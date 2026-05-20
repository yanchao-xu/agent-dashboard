declare module './EChartManager' {
  export default class EChartManager {
    constructor(container: HTMLElement, echarts: any, options?: Record<string, any>);
    get instance(): any;
    render(config: Record<string, any>): Promise<void>;
    setOption(option: Record<string, any>, notMerge?: boolean): void;
    resize(): void;
    dispose(): void;
  }
}

declare module './buildEChartOption' {
  export function buildEChartOption(
    config: { category: string; echartOption?: any; chartSettings?: any; series?: any },
    data: any,
  ): any;
}

declare module './constants' {
  export const GROUPABLE_CHART_DIMENSION: string[];
  export const AGGREGATABLE_CHART_DIMENSION: string[];
  export const CHART_DIMENSION: string[];
}

declare module './normalizeDataset' {
  export function normalizeDataset(data: any[], chartSettings: any): any[];
}

declare module './applyPivot' {
  export function applyPivot(
    data: any[],
    categoryField: string,
    pivotField: string,
    valueField: string,
  ): [any[], string[]];
}

declare module './fetchChartData' {
  export function fetchChartData(options: {
    dataUrl: string;
    httpMethod?: string;
    httpBody?: any;
    dataResponseKeyPath?: string;
    transformDataResponse?: (data: any) => any;
    fetchOptions?: any;
  }): Promise<any>;
}
