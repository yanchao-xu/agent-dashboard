import { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import type { RestApi } from '../../icp-extension.types';
import EChartManager from './icp-echart-renderer/EChartManager';
import { buildEChartOption } from './icp-echart-renderer/buildEChartOption';
import { GROUPABLE_CHART_DIMENSION, AGGREGATABLE_CHART_DIMENSION } from './icp-echart-renderer/constants';

/**
 * EChartRenderer - React component that accepts the full ICP form schema JSON
 * and renders an ECharts chart.
 *
 * Input format (the same JSON used in ICP form schemas):
 * {
 *   "component": "EChart",
 *   "componentProps": {
 *     "style": { "height": 300 },
 *     "echartOption": { "tooltip": {...}, "legend": {...}, ... },
 *     "category": "axis",
 *     "series": { "type": "line", "stack": "stack" },
 *     "dataSource": { "token": "requirement-management-form", "pbcToken": "requirement-management" },
 *     "chartSettings": {
 *       "categoryAxis": { "token": "statusDescription", "name": "单据状态" },
 *       "valueAxis": [{ "token": "applicant", "name": "申请人", "aggr": "count", "aggrAlias": "applicant_count" }]
 *     }
 *   }
 * }
 *
 * Usage:
 *   <EChartRenderer
 *     schema={schemaJson}
 *     restApi={restApi}
 *   />
 *
 *   // Or with pre-loaded data (skips remote fetch):
 *   <EChartRenderer
 *     schema={schemaJson}
 *     data={preloadedData}
 *   />
 */

export interface EChartDataSource {
    token: string;
    pbcToken: string;
}

export interface EChartChartSettings {
    categoryAxis?: { token: string; name?: string; fn?: string };
    valueAxis?: Array<{ token: string; name?: string; aggr?: string; aggrAlias?: string }>;
    legend?: { token: string; name?: string; fn?: string };
    value?: { token: string; name?: string; aggr?: string; aggrAlias?: string };
    transpose?: boolean;
}

export interface EChartComponentProps {
    style?: React.CSSProperties;
    echartOption?: Record<string, unknown>;
    category: 'generic' | 'axis' | 'pie';
    series?: Record<string, unknown>;
    dataSource?: EChartDataSource;
    chartSettings?: EChartChartSettings;
    dataUrl?: string;
    httpMethod?: string;
    httpBody?: Record<string, unknown>;
    dataResponseKeyPath?: string;
}

export interface EChartSchema {
    component: string;
    componentProps: EChartComponentProps;
}

interface EChartRendererProps {
    /** Full ICP form schema JSON */
    schema: EChartSchema;
    /** Host-injected REST API client (used for data fetching) */
    restApi?: RestApi;
    /** Pre-loaded data (skips remote fetch if provided) */
    data?: unknown[] | Record<string, unknown>;
    /** Additional CSS class for the container */
    className?: string;
    /** ECharts theme name */
    theme?: string;
    /** Loading state override */
    loading?: boolean;
}

/**
 * Resolve dataSource to a list API URL.
 * Pattern: /form/api/v3/form-entity-data/{pbcToken}/{token}/list
 */
function resolveDataUrl(dataSource: EChartDataSource): string {
    return `/form/api/v3/form-entity-data/${dataSource.pbcToken}/${dataSource.token}/list`;
}

/**
 * Build the aggregation request body from chartSettings.
 */
function buildAggregationBody(chartSettings: EChartChartSettings): Record<string, unknown> | null {
    const groupByFields = GROUPABLE_CHART_DIMENSION
        .flatMap((dim: string) => (chartSettings as any)?.[dim] ?? [])
        .filter(Boolean)
        .map((f: any) => [f.token, f.fn].filter(Boolean).join('|'));

    const aggregationModels = AGGREGATABLE_CHART_DIMENSION
        .flatMap((dim: string) => (chartSettings as any)?.[dim] ?? [])
        .filter(Boolean)
        .map((f: any) => ({
            valueField: f.token,
            aggregationType: f.aggr,
            alias: f.aggrAlias,
        }));

    if (groupByFields.length > 0 && aggregationModels.length > 0) {
        return {
            groupByFields: [...new Set(groupByFields)],
            aggregationModels,
        };
    }

    return null;
}

export default function EChartRenderer({
    schema,
    restApi,
    data: preloadedData,
    className,
    theme,
    loading = false,
}: EChartRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const managerRef = useRef<EChartManager | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [internalLoading, setInternalLoading] = useState(false);

    const componentProps = schema?.componentProps;

    // Initialize EChartManager
    useEffect(() => {
        if (!containerRef.current) return;

        const manager = new EChartManager(containerRef.current, echarts, { theme });
        managerRef.current = manager;

        return () => {
            manager.dispose();
            managerRef.current = null;
        };
    }, [theme]);

    // Fetch data and render chart when schema or data changes
    useEffect(() => {
        if (!managerRef.current || !componentProps) return;

        setError(null);

        const renderChart = async () => {
            try {
                const {
                    category,
                    echartOption,
                    series,
                    chartSettings,
                    dataSource,
                    dataUrl: dataUrlProp,
                    httpMethod,
                    httpBody,
                    dataResponseKeyPath = 'results',
                } = componentProps;

                let data: any = preloadedData;

                // Fetch data if not pre-loaded
                if (!data) {
                    let dataUrl = dataUrlProp;

                    // Resolve URL from dataSource
                    if (!dataUrl && dataSource) {
                        dataUrl = resolveDataUrl(dataSource);
                    }

                    if (dataUrl) {
                        setInternalLoading(true);

                        // Build request body
                        let body = httpBody || null;
                        if (!body && chartSettings && dataSource) {
                            body = buildAggregationBody(chartSettings) || {};
                        }
                        if (!body) {
                            body = {};
                        }

                        // Determine HTTP method
                        const method = httpMethod || (dataSource ? 'post' : 'get');

                        try {
                            let response: any;
                            if (method.toLowerCase() === 'post') {
                                response = await restApi?.post(dataUrl, body);
                            } else {
                                response = await restApi?.get(dataUrl);
                            }

                            // Extract data from response using keyPath
                            if (response && dataResponseKeyPath) {
                                const keys = dataResponseKeyPath.split('.');
                                let extracted = response;
                                for (const key of keys) {
                                    extracted = extracted?.[key];
                                }
                                data = extracted ?? response;
                            } else {
                                data = response;
                            }
                        } finally {
                            setInternalLoading(false);
                        }
                    }
                }

                // Build ECharts option
                const option = buildEChartOption(
                    { category, echartOption, chartSettings, series },
                    data,
                );

                if (option && managerRef.current) {
                    managerRef.current.setOption(option);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Chart render failed');
                setInternalLoading(false);
            }
        };

        renderChart();
    }, [schema, preloadedData, restApi]);

    // Show/hide loading
    useEffect(() => {
        const instance = managerRef.current?.instance;
        if (!instance) return;

        if (loading || internalLoading) {
            instance.showLoading();
        } else {
            instance.hideLoading();
        }
    }, [loading, internalLoading]);

    const style = componentProps?.style;

    return (
        <div className={className} style={{ position: 'relative' }}>
            {error && (
                <div style={{ color: '#ef4444', padding: 8, fontSize: 12 }}>
                    Chart Error: {error}
                </div>
            )}
            <div
                ref={containerRef}
                style={{ width: '100%', height: 300, ...style }}
            />
        </div>
    );
}
