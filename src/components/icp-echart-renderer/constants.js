/**
 * Chart dimensions that support groupBy (used as category/legend axes).
 */
export const GROUPABLE_CHART_DIMENSION = ['categoryAxis', 'legend'];

/**
 * Chart dimensions that support aggregation (used as value axes).
 */
export const AGGREGATABLE_CHART_DIMENSION = ['valueAxis', 'value'];

/**
 * All chart dimensions.
 */
export const CHART_DIMENSION = [...GROUPABLE_CHART_DIMENSION, ...AGGREGATABLE_CHART_DIMENSION];
