import { debounce } from 'lodash-es';
import { buildEChartOption } from './buildEChartOption';
import { fetchChartData } from './fetchChartData';

/**
 * EChartManager - Manages an ECharts instance lifecycle independently.
 *
 * Handles:
 * - ECharts initialization on a DOM element
 * - Auto-resize via ResizeObserver
 * - Data fetching and option building from user JSON config
 * - Cleanup/dispose
 *
 * Usage:
 *   const manager = new EChartManager(containerEl, echarts);
 *   await manager.render(config);
 *   // later...
 *   manager.dispose();
 */
export default class EChartManager {
  /**
   * @param {HTMLElement} container - The DOM element to render the chart into
   * @param {Object} echarts - The echarts module (import * as echarts from 'echarts')
   * @param {Object} [options] - Additional options
   * @param {string} [options.locale] - ECharts locale
   * @param {Object} [options.localeObj] - Locale definition object to register
   * @param {string} [options.theme] - ECharts theme name
   */
  constructor(container, echarts, options = {}) {
    this._container = container;
    this._echarts = echarts;
    this._options = options;
    this._instance = null;
    this._resizeObserver = null;
    this._resizeListener = null;

    this._init();
  }

  _init() {
    const { locale, localeObj, theme } = this._options;

    if (localeObj && locale) {
      this._echarts.registerLocale(locale, localeObj);
    }

    const initOpts = locale ? { locale } : undefined;
    this._instance = this._echarts.init(this._container, theme || null, initOpts);

    this._setupResize();
  }

  _setupResize() {
    const listener = debounce(
      () => {
        this._instance?.resize();
      },
      250,
      { leading: true, trailing: true },
    );

    if (window.ResizeObserver) {
      this._resizeObserver = new ResizeObserver(listener);
      this._resizeObserver.observe(this._container);
    } else {
      this._resizeListener = listener;
      window.addEventListener('resize', listener);
    }
  }

  /**
   * Get the underlying ECharts instance.
   */
  get instance() {
    return this._instance;
  }

  /**
   * Render the chart from a user JSON configuration.
   *
   * @param {Object} config - The componentProps from user JSON config
   * @param {string} config.category - 'generic' | 'axis' | 'pie'
   * @param {Object} [config.echartOption] - Base ECharts option
   * @param {Object} [config.chartSettings] - Chart dimension settings
   * @param {Object} [config.series] - Series template
   * @param {string} [config.dataUrl] - URL to fetch data from
   * @param {string} [config.httpMethod] - HTTP method for data fetch
   * @param {Object} [config.httpBody] - HTTP body for POST requests
   * @param {string} [config.dataResponseKeyPath] - Key path to extract data from response
   * @param {Function} [config.transformDataResponse] - Transform function for response data
   * @param {Object} [config.fetchOptions] - Additional fetch options
   * @param {Array|Object} [config.data] - Pre-fetched data (skips fetch if provided)
   * @returns {Promise<void>}
   */
  async render(config) {
    const {
      category,
      echartOption,
      chartSettings,
      series,
      dataUrl,
      httpMethod,
      httpBody,
      dataResponseKeyPath,
      transformDataResponse,
      fetchOptions,
      data: preloadedData,
    } = config;

    let data = preloadedData;

    // Fetch data if not pre-loaded and dataUrl is provided
    if (!data && dataUrl) {
      data = await fetchChartData({
        dataUrl,
        httpMethod,
        httpBody,
        dataResponseKeyPath,
        transformDataResponse,
        fetchOptions,
      });
    }

    const option = buildEChartOption(
      { category, echartOption, chartSettings, series },
      data,
    );

    if (option) {
      this._instance.setOption(option, true);
    }
  }

  /**
   * Directly set an ECharts option (bypass config parsing).
   * @param {Object} option - ECharts option object
   * @param {boolean} [notMerge=true] - Whether to not merge with previous option
   */
  setOption(option, notMerge = true) {
    this._instance?.setOption(option, notMerge);
  }

  /**
   * Resize the chart.
   */
  resize() {
    this._instance?.resize();
  }

  /**
   * Dispose the chart instance and clean up listeners.
   */
  dispose() {
    if (this._resizeObserver) {
      this._resizeObserver.unobserve(this._container);
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._resizeListener) {
      window.removeEventListener('resize', this._resizeListener);
      this._resizeListener = null;
    }
    this._instance?.dispose();
    this._instance = null;
  }
}
