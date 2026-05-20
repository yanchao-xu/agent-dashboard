/**
 * Normalize dataset: ensure data is an array of objects with consistent keys,
 * then perform client-side aggregation if chartSettings defines aggr functions.
 *
 * When the backend returns raw detail records (no server-side aggregation),
 * this function groups by categoryAxis (and optional legend) and computes
 * count/sum/avg/min/max on valueAxis fields.
 *
 * @param {Array} data - Raw data array
 * @param {Object} chartSettings - Chart settings with axis definitions
 * @returns {Array} Normalized and aggregated data array
 */
export function normalizeDataset(data, chartSettings) {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  // Step 1: Convert array-of-arrays to array-of-objects if needed
  let rows = data;
  if (Array.isArray(data[0])) {
    const { categoryAxis, valueAxis, legend, value } = chartSettings || {};
    const dimensions = [];
    if (categoryAxis) dimensions.push(categoryAxis.token);
    if (legend) dimensions.push(legend.token);
    if (valueAxis) {
      valueAxis.filter(Boolean).forEach((v) => dimensions.push(v.aggrAlias || v.token));
    }
    if (value) dimensions.push(value.aggrAlias || value.token);

    rows = data.map((row) => {
      const obj = {};
      row.forEach((val, idx) => {
        if (dimensions[idx]) {
          obj[dimensions[idx]] = val;
        }
      });
      return obj;
    });
  }

  // Step 2: Check if aggregation is needed
  // If any valueAxis field has an `aggr` defined, we need to aggregate client-side
  const { categoryAxis, valueAxis, legend, value } = chartSettings || {};
  const needsAggregation = checkNeedsAggregation(rows, chartSettings);

  if (!needsAggregation) {
    return rows;
  }

  // Step 3: Determine group-by fields
  const groupByFields = [];
  if (categoryAxis) groupByFields.push(categoryAxis.token);
  if (legend) groupByFields.push(legend.token);

  // Step 4: Determine aggregation targets
  const aggrTargets = [];
  if (valueAxis) {
    valueAxis.filter(Boolean).forEach((v) => {
      if (v.aggr) {
        aggrTargets.push(v);
      }
    });
  }
  if (value && value.aggr) {
    aggrTargets.push(value);
  }

  if (groupByFields.length === 0 || aggrTargets.length === 0) {
    return rows;
  }

  // Step 5: Group and aggregate
  return aggregateData(rows, groupByFields, aggrTargets);
}

/**
 * Check if client-side aggregation is needed.
 * Returns true if:
 * 1. chartSettings has aggr definitions, AND
 * 2. The data does NOT already contain the aggrAlias fields (i.e., not pre-aggregated)
 */
function checkNeedsAggregation(rows, chartSettings) {
  if (!chartSettings) return false;

  const { valueAxis, value } = chartSettings;
  const aggrFields = [];

  if (valueAxis) {
    valueAxis.filter(Boolean).forEach((v) => {
      if (v.aggr && v.aggrAlias) {
        aggrFields.push(v.aggrAlias);
      }
    });
  }
  if (value && value.aggr && value.aggrAlias) {
    aggrFields.push(value.aggrAlias);
  }

  // No aggregation defined
  if (aggrFields.length === 0) return false;

  // Check if the first row already has the aggrAlias fields
  // If it does, data is already aggregated (server did it)
  const firstRow = rows[0];
  if (firstRow && typeof firstRow === 'object') {
    const hasAllAliases = aggrFields.every((alias) => alias in firstRow);
    if (hasAllAliases) return false;
  }

  return true;
}

/**
 * Resolve a field value from a row. Handles cases where the field value
 * is an array of objects with a `label` property (common in ICP form data).
 */
function resolveFieldValue(row, fieldToken) {
  const val = row[fieldToken];
  if (val === undefined || val === null) return null;

  // ICP form fields often store values as [{label: "xxx", value: "yyy"}]
  if (Array.isArray(val)) {
    if (val.length === 0) return null;
    // Use label for display, join multiple values
    return val.map((item) => (item && item.label) || item).join(', ');
  }

  return val;
}

/**
 * Perform groupBy + aggregation on raw data.
 */
function aggregateData(rows, groupByFields, aggrTargets) {
  const groups = new Map();

  for (const row of rows) {
    // Build group key
    const keyParts = groupByFields.map((field) => {
      const val = resolveFieldValue(row, field);
      return val === null ? '__null__' : String(val);
    });
    const groupKey = keyParts.join('|||');

    if (!groups.has(groupKey)) {
      // Initialize group with category values
      const groupObj = {};
      groupByFields.forEach((field, idx) => {
        groupObj[field] = resolveFieldValue(row, field);
      });
      // Initialize accumulators for each aggr target
      aggrTargets.forEach((target) => {
        const alias = target.aggrAlias || target.token;
        groupObj[`__acc_${alias}`] = [];
      });
      groups.set(groupKey, groupObj);
    }

    const group = groups.get(groupKey);
    // Collect values for aggregation
    aggrTargets.forEach((target) => {
      const alias = target.aggrAlias || target.token;
      const rawVal = row[target.token];
      group[`__acc_${alias}`].push(rawVal);
    });
  }

  // Compute final aggregated values
  const result = [];
  for (const group of groups.values()) {
    const row = {};
    // Copy group-by fields
    groupByFields.forEach((field) => {
      row[field] = group[field];
    });
    // Compute aggregations
    aggrTargets.forEach((target) => {
      const alias = target.aggrAlias || target.token;
      const values = group[`__acc_${alias}`];
      row[alias] = computeAggregation(values, target.aggr);
    });
    result.push(row);
  }

  return result;
}

/**
 * Compute an aggregation over a list of values.
 */
function computeAggregation(values, aggrType) {
  switch (aggrType) {
    case 'count':
      return values.length;

    case 'sum': {
      return values.reduce((acc, v) => acc + (Number(v) || 0), 0);
    }

    case 'avg': {
      const nums = values.filter((v) => v !== null && v !== undefined);
      if (nums.length === 0) return 0;
      return nums.reduce((acc, v) => acc + (Number(v) || 0), 0) / nums.length;
    }

    case 'min': {
      const nums = values.filter((v) => v !== null && v !== undefined).map(Number);
      return nums.length > 0 ? Math.min(...nums) : 0;
    }

    case 'max': {
      const nums = values.filter((v) => v !== null && v !== undefined).map(Number);
      return nums.length > 0 ? Math.max(...nums) : 0;
    }

    default:
      // Default to count if unknown aggregation type
      return values.length;
  }
}
