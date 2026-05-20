import type { RestApi } from "../icp-extension.types";
import type {
  HitlTodo,
  AgentTask,
  AgentMetricDefinition,
  AgentBusinessMetricDaily,
  UserAgentFavorite,
  AgentInsightReport,
  AgentRegistry,
  UserInfo,
} from "./types";

const BASE = "/form/api/v3/form-entity-data/workbench-intelligence";

/** 项目标识，用于路由前缀 */
export const PROJECT_TOKEN = "workbench-intelligence";

/** /list 接口统一返回格式 */
interface ListResponse<T> {
  count: number;
  metaData: Record<string, any>;
  results: T[];
}

export function fetchUserInfo(restApi: RestApi): Promise<UserInfo> {
  return restApi.get("/api/dashboard/user-info");
}

export async function fetchHitlTodos(restApi: RestApi): Promise<HitlTodo[]> {
  const res: ListResponse<HitlTodo> = await restApi.post(`${BASE}/hitl-todo-form/list`, {});
  return res.results;
}

export async function fetchAgentTasks(restApi: RestApi): Promise<AgentTask[]> {
  const res: ListResponse<AgentTask> = await restApi.post(`${BASE}/agent-task-form/list`, {});
  return res.results;
}

export async function fetchMetricDefinitions(restApi: RestApi): Promise<AgentMetricDefinition[]> {
  const res: ListResponse<AgentMetricDefinition> = await restApi.post(`${BASE}/agent-metric-definition-form/list`, {});
  return res.results;
}

export async function fetchMetricDailyValues(restApi: RestApi): Promise<AgentBusinessMetricDaily[]> {
  const res: ListResponse<AgentBusinessMetricDaily> = await restApi.post(`${BASE}/agent-business-metric-daily-form/list`, {});
  return res.results;
}

export async function fetchUserAgentFavorites(restApi: RestApi): Promise<UserAgentFavorite[]> {
  const res: ListResponse<UserAgentFavorite> = await restApi.post(`${BASE}/user-agent-favorite-form/list`, {});
  return res.results;
}

export async function fetchInsightReports(restApi: RestApi): Promise<AgentInsightReport[]> {
  const res: ListResponse<AgentInsightReport> = await restApi.post(`${BASE}/agent-insight-report-form/list`, {});
  return res.results;
}

export async function fetchAgentRegistry(restApi: RestApi): Promise<AgentRegistry[]> {
  const res: ListResponse<AgentRegistry> = await restApi.post(`${BASE}/agent-registry-form/list`, {});
  return res.results;
}

export function addUserAgentFavorite(
  restApi: RestApi,
  data: { userId: string; agentId: string; sortOrder: number; addedAt: string },
): Promise<any> {
  return restApi.post("/form/api/v2/form-entity-data/workbench-intelligence/user-agent-favorite-form/default", data);
}
