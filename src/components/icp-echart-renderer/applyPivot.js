/**
 * Pivot data by a given field, transforming rows into columns.
 *
 * Example:
 *   Input: [{ type: 'A', month: 'Jan', count: 10 }, { type: 'A', month: 'Feb', count: 20 }]
 *   applyPivot(data, 'type', 'month', 'count')
 *   Output: [[{ type: 'A', Jan: 10, Feb: 20 }], ['Jan', 'Feb']]
 *
 * @param {Array} data - Source data array
 * @param {string} categoryField - The field used as category (row key)
 * @param {string} pivotField - The field whose values become new columns
 * @param {string} valueField - The field whose values fill the pivoted columns
 * @returns {[Array, Array]} Tuple of [pivoted data, pivot column names]
 */
export function applyPivot(data, categoryField, pivotField, valueField) {
  const map = new Map();
  const pivotColumnSet = new Set();

  for (const {
    [categoryField]: category,
    [pivotField]: pivotColumn,
    [valueField]: value,
  } of data) {
    if (!map.has(category)) {
      map.set(category, { [categoryField]: category });
    }
    map.get(category)[pivotColumn] = value;
    pivotColumnSet.add(pivotColumn);
  }

  return [Array.from(map.values()), Array.from(pivotColumnSet)];
}
