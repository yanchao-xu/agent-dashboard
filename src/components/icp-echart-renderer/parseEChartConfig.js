import { GROUPABLE_CHART_DIMENSION, AGGREGATABLE_CHART_DIMENSION } from './constants';
import { buildEChartOption } from './buildEChartOption';
import { fetchChartData } from './fetchChartData';

/**
 * Parse a user JSON configuration and produce a renderable ECharts option.
 *
 * This is the main entry point for standalone usage. Given a user's JSON config
 * (as defined in the form schema), it fetches data and builds the final ECharts option.
 *
 * Supported JSON structures:
 *
 * 1. Generic mode (dataUrl returns full echartOption):
 *    {
 *      "component": "EChart",
 *      "componentProps": {
 *        "style": { "height": 300 },
 *        "category": "generic",
 *        "dataUrl": "/flow/api/flow-rest/annual-business-line-chart-flow",
 *        "httpMethod": "post"
 *      }
 *    }
 *
 * 2. Axis mode (chartSettings-based):
 *    {
 *      "component": "EChart",
 *      "componentProps": {
 *        "style": { "height": 300 },
 *        "echartOption": { ... },
 *        "category": "axis",
 *        "series": { "type": "line", "stack": "stack" },
 *        "dataSource": { ... },
 *        "chartSettings": {
 *          "categoryAxis": { "token": "applyType", "name": "申请类型" },
 *          "valueAxis": [{ "token": "applicant", "name": "申请人", "aggr": "count", "aggrAlias": "applicant_count" }]
 *        }
 *      }
 *    }
 *
 * @param {Object} componentProps - The componentProps from user JSON
 * @param {Object} [options] - Additional options
 * @param {Array|Object} [options.data] - Pre-fetched data (skips network fetch)
 * @param {Object} [options.fetchOptions] - Additional fetch options (headers, auth, etc.)
 * @param {Function} [options.resolveDataUrl] - Custom function to resolve dataSource to a URL
 * @returns {Promise<{ option: Object|null, style: Object }>} The ECharts option and style
 */
export default async function parseEChartConfig(componentProps, options = {}) {
  const {
    style,
    category,
    chartSettings,
    echartOption,
    series,
    dataUrl: dataUrlProp,
    dataSource,
    httpMethod,
    httpBody,
    dataResponseKeyPath = 'results',
    transformDataResponse,
  } = componentProps;

  const { data: preloadedData, fetchOptions, resolveDataUrl } = options;

  // Resolve data URL
  let dataUrl = dataUrlProp;
  if (!dataUrl && dataSource && typeof resolveDataUrl === 'function') {
    dataUrl = resolveDataUrl(dataSource);
  }

  // Build aggregation config for internal APIs
  let aggregationBody = null;
  if (chartSettings && dataSource && !dataUrlProp) {
    const groupByFields = GROUPABLE_CHART_DIMENSION.flatMap((dim) => chartSettings?.[dim] ?? [])
      .filter(Boolean)
      .map((f) => [f.token, f.fn].filter(Boolean).join('|'));

    const aggregationModels = AGGREGATABLE_CHART_DIMENSION.flatMap(
      (dim) => chartSettings?.[dim] ?? [],
    )
      .filter(Boolean)
      .map((f) => ({
        valueField: f.token,
        aggregationType: f.aggr,
        alias: f.aggrAlias,
      }));

    if (groupByFields.length > 0 && aggregationModels.length > 0) {
      aggregationBody = {
        groupByFields: [...new Set(groupByFields)],
        aggregationModels,
      };
    }
  }

  // Fetch data
  let data = preloadedData;
  if (!data && dataUrl) {
    const method = httpMethod || (!dataUrlProp && dataSource ? 'post' : 'get');
    const body = httpBody || aggregationBody;

    data = await fetchChartData({
      dataUrl,
      httpMethod: method,
      httpBody: body,
      dataResponseKeyPath,
      transformDataResponse,
      fetchOptions,
    });
  }

  // Build option
  const option = buildEChartOption({ category, echartOption, chartSettings, series }, data);

  return { option, style: style || {} };
}
