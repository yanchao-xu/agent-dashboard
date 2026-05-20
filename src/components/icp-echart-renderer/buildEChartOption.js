import { set } from 'lodash-es';
import { normalizeDataset } from './normalizeDataset';
import { applyPivot } from './applyPivot';

/**
 * Build a complete ECharts option object from user configuration and data.
 *
 * Supports three category modes:
 * - "generic": data is already a full echartOption, returned as-is.
 * - "axis": builds axis-based charts (line, bar, scatter, etc.) from chartSettings.
 * - "pie": builds pie/donut charts from chartSettings.
 *
 * @param {Object} config - The chart configuration
 * @param {string} config.category - Chart category: 'generic' | 'axis' | 'pie'
 * @param {Object} [config.echartOption] - Base ECharts option to merge with
 * @param {Object} [config.chartSettings] - Settings defining axes and aggregation
 * @param {Object} [config.series] - Series template (type, stack, etc.)
 * @param {Array|Object} [data] - The fetched/resolved data
 * @returns {Object|null} The final ECharts option, or null if insufficient config
 */
export function buildEChartOption(config, data) {
  const { category, echartOption, chartSettings, series } = config;

  // generic mode: data IS the full echart option
  if (category === 'generic') {
    return data || null;
  }

  const option = { ...(echartOption || {}) };

  if (data) {
    set(option, 'dataset.source', data);
  }

  const { transpose, categoryAxis, valueAxis: valueAxises, legend, value } = chartSettings || {};
  const valueAxis = valueAxises?.filter(Boolean);

  // axis mode
  if (category === 'axis' && series && chartSettings && categoryAxis && valueAxis?.length > 0) {
    const source = normalizeDataset(data || [], chartSettings);
    set(option, 'dataset.source', source);
    set(option, 'dataset.dimensions', [categoryAxis.token, ...valueAxis.map((x) => x.aggrAlias)]);
    let valueAxisFields = valueAxis;

    if (chartSettings.legend) {
      const [pivotedDataset, pivotColumns] = applyPivot(
        source,
        categoryAxis.token,
        chartSettings.legend.token,
        valueAxis[0].aggrAlias,
      );
      valueAxisFields = pivotColumns.map((x) => ({ token: x }));
      set(option, 'dataset.source', pivotedDataset);
      set(option, 'dataset.dimensions', [categoryAxis.token, ...pivotColumns]);
    }

    // Ensure legend has a proper position (top by default)
    if (option.legend && !option.legend.top && !option.legend.bottom) {
      option.legend = { top: 0, ...option.legend };
    }

    // Ensure grid leaves room for legend at top and long axis labels
    if (option.grid) {
      if (!option.grid.top) {
        option.grid.top = option.legend ? 40 : 20;
      }
    }

    option.xAxis = {
      ...option.xAxis,
      type: transpose ? 'value' : 'category',
      // For category axis, ensure all labels are shown and not truncated
      ...(!transpose && {
        axisLabel: {
          interval: 0,
          ...(option.xAxis?.axisLabel || {}),
        },
      }),
    };

    option.yAxis = {
      ...option.yAxis,
      type: transpose ? 'category' : 'value',
    };

    option.series = [
      ...(option.series || []),
      ...valueAxisFields.map((vField) => ({
        ...series,
        name: vField?.name || vField?.token,
        encode: {
          [transpose ? 'y' : 'x']: categoryAxis?.token,
          [transpose ? 'x' : 'y']: vField?.aggrAlias ?? vField?.token,
          ...(series.type === 'scatter' && { tooltip: [categoryAxis?.token, vField?.token] }),
        },
      })),
    ];

    return option;
  }

  // pie mode
  if (category === 'pie' && series && chartSettings && legend && value) {
    const source = normalizeDataset(data || [], chartSettings);
    set(option, 'dataset.source', source);

    option.series = [
      ...(option.series || []),
      {
        ...series,
        name: legend?.name || legend?.token,
        encode: {
          itemName: legend?.token,
          value: value?.aggrAlias ?? value?.token,
        },
      },
    ];

    return option;
  }

  // fallback: return option with dataset if data was provided
  return data ? option : null;
}
