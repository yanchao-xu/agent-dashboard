import { get } from 'lodash-es';

/**
 * Fetch chart data from a remote URL.
 *
 * @param {Object} options - Fetch options
 * @param {string} options.dataUrl - The URL to fetch data from
 * @param {string} [options.httpMethod='get'] - HTTP method
 * @param {Object} [options.httpBody] - Request body for POST requests
 * @param {string} [options.dataResponseKeyPath='results'] - Path to extract data from response
 * @param {Function} [options.transformDataResponse] - Optional transform function for response data
 * @param {Object} [options.fetchOptions] - Additional fetch options (headers, etc.)
 * @returns {Promise<Array|Object>} The fetched and transformed data
 */
export async function fetchChartData({
  dataUrl,
  httpMethod = 'get',
  httpBody,
  dataResponseKeyPath = 'results',
  transformDataResponse,
  fetchOptions = {},
}) {
  if (!dataUrl) {
    return null;
  }

  const method = httpMethod.toUpperCase();
  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  const config = {
    method,
    headers,
    ...fetchOptions,
  };

  if (method !== 'GET' && method !== 'HEAD' && httpBody) {
    config.body = typeof httpBody === 'string' ? httpBody : JSON.stringify(httpBody);
  }

  const response = await fetch(dataUrl, config);

  if (!response.ok) {
    throw new Error(`Failed to fetch chart data: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  // Extract data from response using keyPath
  let data = dataResponseKeyPath ? get(json, dataResponseKeyPath, json) : json;

  // Apply optional transform
  if (typeof transformDataResponse === 'function') {
    data = transformDataResponse(data);
  }

  return data;
}
