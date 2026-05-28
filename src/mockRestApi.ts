import {
  mockUserInfo,
  mockHitlTodos,
  mockAgentTasks,
  mockMetricDefinitions,
  mockMetricDailyValues,
  mockFavorites,
  mockInsightReports,
  mockAgentRegistry,
} from "./mockData";

export const mockRestApi = {
  get: async (url: string) => {
    if (url.includes("/api/dashboard/user-info")) return mockUserInfo;
    if (
      url.includes(
        "/form/api/form-entity-page/get-by-schema-id/workbench-intelligence/custom-chart",
      )
    ) {
      return {
        schemaId: "custom-chart",
        id: 55380,
        pbcId: 9454,
        name: "自定义chart",
        description: null,
        schemaJson: JSON.stringify({
          form: { title: "自定义chart" },
          fields: [
            {
              component: "EChart",
              componentProps: {
                style: { height: 300 },
                echartOption: {
                  tooltip: { trigger: "item" },
                  legend: { type: "scroll" },
                  series: [],
                },
                category: "pie",
                series: { type: "pie", radius: "50%" },
                dataSource: {
                  token: "requirement-management-form",
                  pbcToken: "requirement-management",
                },
                chartSettings: {
                  legend: { token: "status", name: "状态" },
                  value: {
                    token: "statusDescription",
                    name: "单据状态",
                    aggr: "count",
                    aggrAlias: "statusDescription_count",
                  },
                },
              },
            },
          ],
        }),
        contentVersion: "541649b811aa43839b933bf6dc9da9dc",
        currentUserPermission: null,
      };
    }
    return null;
  },
  put: async () => ({ success: true }),
  post: async (url: string) => {
    const wrapList = (results: any[]) => ({
      count: results.length,
      metaData: {},
      results,
    });

    if (url.includes("/hitl-todo-form/list")) return wrapList(mockHitlTodos);
    if (url.includes("/agent-task-form/list")) return wrapList(mockAgentTasks);
    if (url.includes("/agent-metric-definition-form/list"))
      return wrapList(mockMetricDefinitions);
    if (url.includes("/agent-business-metric-daily-form/list"))
      return wrapList(mockMetricDailyValues);
    if (url.includes("/user-agent-favorite-form/list"))
      return wrapList(mockFavorites);
    if (url.includes("/agent-insight-report-form/list"))
      return wrapList(mockInsightReports);
    if (url.includes("/agent-registry-form/list"))
      return wrapList(mockAgentRegistry);
    return wrapList([]);
  },
  delete: async () => ({ success: true }),
};
