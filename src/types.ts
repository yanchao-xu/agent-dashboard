// ===== API 响应类型定义 =====

/** API 1: 通知预警 */
export interface Notification {
  id: string;
  type: 'warning' | 'info';
  agentName: string;
  title: string;
  description: string;
  actions: { label: string; type: 'primary' | 'default' }[];
}

/** API 2: 业务趋势 */
export interface BusinessTrend {
  chartData: { date: string; value: number }[];
  revenue: { value: number; unit: string; growth: number };
  orderCount: { value: number; unit: string; growth: number };
}

/** API 3: 运行中的 Agent */
export interface RunningAgent {
  id: string;
  name: string;
  status: 'running' | 'processing' | 'paused';
  statusLabel: string;
  progress: number;
  pendingCount?: number;
}

/** API 4: Agent 工作成效 */
export interface AgentKPI {
  id: string;
  name: string;
  icon: string;
  color: string;
  metrics: { label: string; value: number; unit: string }[];
  contribution: { label: string; value: number };
}

/** API 5: AI 助手列表 */
export interface AIAssistant {
  id: string;
  name: string;
  icon: string;
  collected: boolean;
}

/** API 6: 洞察预警报告 */
export interface InsightReport {
  id: string;
  tag: 'warning' | 'insight';
  tagLabel: string;
  title: string;
  source: string;
  time: string;
  metrics: { label: string; value: number | string; unit: string }[];
}

/** API 7: 用户基本信息 */
export interface UserInfo {
  name: string;
  role: string;
  period: string;
}
