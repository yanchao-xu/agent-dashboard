// ===== 数据库表对应类型定义 =====

/** agent-registry 表 — Agent 注册信息 */
export interface AgentRegistry {
  id: string;
  agentCode: string;
  name: string;
  iconUrl: string;
  description: string;
  domain: 'finance' | 'supply_chain' | 'sales' | 'inventory' | 'hr' | 'compliance';
  type: 'execution' | 'insight' | 'risk' | 'assistant';
  executionMode: 'sync' | 'async' | 'long_running';
  isHitlCapable: boolean;
  isInsightCapable: boolean;
  entryUrl: string;
  backendService: string;
  version: string;
  status: 'active' | 'inactive' | 'gray' | 'deprecated';
  ownerTeam: string;
  config: string;
}

/** 长文本字段包装格式 — API 返回 longText 类型字段的通用结构 */
export interface LongTextField {
  longText: string;
  value: string;
}

/** hitl-todo 表 — 人工介入待办 (NotificationPanel) */
export interface HitlTodo {
  id: string;
  taskId: string;
  todoType: 'confirm' | 'review' | 'supplement' | 'approve' | 'choose';
  title: string;
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'done' | 'expired' | 'cancelled';
  payload: string;
  actionOptions: string | LongTextField;
  dueAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolution?: string;
}

/** agent-task 表 — Agent 任务 (RunningAgentList) */
export interface AgentTask {
  id: string;
  agentId: string;
  parentTaskId?: string;
  sessionId?: string;
  triggerType: 'manual' | 'scheduled' | 'event' | 'agent_chain' | 'recommendation';
  triggerBy: string;
  executionMode: 'sync' | 'async' | 'long_running';
  status: 'pending' | 'running' | 'waiting_hitl' | 'success' | 'failed' | 'cancelled' | 'timeout';
  progressPercent?: number;
  currentStage?: string;
  inputParams: string;
  outputResult?: string;
  errorMessage?: string;
  tokenCost: number;
  startedAt: string;
  estimatedCompletionAt?: string;
  completedAt?: string;
}

/** agent-metric-definition 表 — 指标定义 (AgentKPICards) */
export interface AgentMetricDefinition {
  id: string;
  agentId: string;
  metricKey: string;
  metricName: string;
  metricDescription: string;
  valueType: 'integer' | 'decimal' | 'percentage' | 'duration';
  unit: string;
  aggregationType: 'sum' | 'avg' | 'max' | 'min' | 'last';
  isValueContribution: boolean;
  valueWeight?: number;
  displayCategory: 'primary' | 'secondary' | 'breakdown';
  displayOrder: number;
  chartType?: 'line' | 'bar' | 'area';
  targetValue?: number;
  status: 'active' | 'deprecated';
}

/** agent-business-metric-daily 表 — 业务指标日值 (AgentKPICards) */
export interface AgentBusinessMetricDaily {
  id: string;
  agentId: string;
  metricDefId: string;
  metricKey: string;
  statDate: string;
  value: number;
  sampleCount?: number;
  extra?: string;
}

/** user-agent-favorite 表 — 用户收藏 (AIAssistantPanel) */
export interface UserAgentFavorite {
  id: string;
  userId: string;
  agentId: string;
  sortOrder: number;
  addedAt: string;
}

/** agent-insight-report 表 — 洞察报告 (InsightReportPanel) */
export interface AgentInsightReport {
  id: string;
  agentId: string;
  reportType: 'insight' | 'alert' | 'risk_warning';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  summary: string;
  keyMetrics?: string | LongTextField;
  businessImpactAmount?: number;
  affectedScope?: string;
  contentUrl: string;
  contentFormat: 'pdf' | 'html' | 'markdown' | 'json' | 'docx';
  contentStorageType: 'object_storage' | 'cdn' | 'external_doc';
  contentSizeBytes?: number;
  contentVersion: number;
  triggeredTaskId?: string;
  generatedAt: string;
  validUntil?: string;
}

/** 用户基本信息 */
export interface UserInfo {
  name: string;
  role: string;
  period: string;
}
