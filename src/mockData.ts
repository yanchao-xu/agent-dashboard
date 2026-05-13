import type {
  Notification,
  BusinessTrend,
  RunningAgent,
  AgentKPI,
  AIAssistant,
  InsightReport,
  UserInfo,
} from './types';

export const mockUserInfo: UserInfo = {
  name: '张经理',
  role: 'manager',
  period: '本月',
};

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    agentName: '风险Agent',
    title: '警报：原材料交货逾期，已生成替代采购方案。',
    description: '',
    actions: [
      { label: '一键执行', type: 'primary' },
      { label: '查看详情', type: 'default' },
    ],
  },
  {
    id: '2',
    type: 'info',
    agentName: '价格Agent',
    title: '智能防跨价invoice中有8笔尚未通过价格稽核，需复核。',
    description: '',
    actions: [],
  },
];

export const mockBusinessTrend: BusinessTrend = {
  chartData: [
    { date: '05-01', value: 1800 },
    { date: '05-05', value: 2100 },
    { date: '05-10', value: 2500 },
    { date: '05-15', value: 2200 },
    { date: '05-20', value: 2600 },
    { date: '05-25', value: 2400 },
    { date: '05-31', value: 2345 },
  ],
  revenue: { value: 2345.67, unit: '万元', growth: 12.5 },
  orderCount: { value: 1234, unit: '单', growth: 8.3 },
};

export const mockRunningAgents: RunningAgent[] = [
  {
    id: '1',
    name: '每日往来核销',
    status: 'running',
    statusLabel: '运行中',
    progress: 98,
    pendingCount: 3,
  },
  {
    id: '2',
    name: '订单发票联单生成(Done)',
    status: 'running',
    statusLabel: '运行中',
    progress: 85,
  },
  {
    id: '3',
    name: '订单价格稽核(processing)',
    status: 'processing',
    statusLabel: '处理中',
    progress: 62,
  },
  {
    id: '4',
    name: '库存自动预警',
    status: 'running',
    statusLabel: '运行中',
    progress: 75,
  },
];

export const mockAgentKPIs: AgentKPI[] = [
  {
    id: '1',
    name: '每日往来核销Agent',
    icon: '✓',
    color: '#22c55e',
    metrics: [
      { label: '已自动完成', value: 396, unit: '笔' },
      { label: '待人工确认', value: 23, unit: '笔' },
      { label: '核销金额', value: 1245.30, unit: '万元' },
    ],
    contribution: { label: '价值贡献', value: 15.2 },
  },
  {
    id: '2',
    name: '订单发票联单生成Agent',
    icon: '📄',
    color: '#3b82f6',
    metrics: [
      { label: '已生成', value: 1128, unit: '单' },
      { label: '异常待处理', value: 62, unit: '单' },
      { label: '订单金额', value: 3560.80, unit: '万元' },
    ],
    contribution: { label: '价值贡献', value: 11.7 },
  },
  {
    id: '3',
    name: '订单价格稽核Agent',
    icon: '🔍',
    color: '#f59e0b',
    metrics: [
      { label: '已稽核', value: 842, unit: '单' },
      { label: '待人工复核', value: 18, unit: '单' },
      { label: '拦截异常金额', value: 128.60, unit: '万元' },
    ],
    contribution: { label: '价值贡献', value: 26.5 },
  },
  {
    id: '4',
    name: '库存自动预警Agent',
    icon: '📦',
    color: '#8b5cf6',
    metrics: [
      { label: '预警次数', value: 56, unit: '次' },
      { label: '已处理预警', value: 12, unit: '个' },
      { label: '避免缺货金额', value: 98.20, unit: '万元' },
    ],
    contribution: { label: '价值贡献', value: 9.6 },
  },
];

export const mockAIAssistants: AIAssistant[] = [
  { id: '1', name: '智能收款助手', icon: '⚙️', collected: true },
  { id: '2', name: '价格稽核助手', icon: '🔍', collected: true },
  { id: '3', name: '合同审核助手', icon: '📋', collected: true },
  { id: '4', name: '库存分析助手', icon: '📊', collected: true },
];

export const mockInsightReports: InsightReport[] = [
  {
    id: '1',
    tag: 'warning',
    tagLabel: '预警',
    title: '逾期账款回收风险预警',
    source: '每日往来核销Agent · 今天 09:30',
    time: '今天 09:30',
    metrics: [
      { label: '高风险客户', value: 12, unit: '个' },
      { label: '涉及金额', value: 245.60, unit: '万元' },
    ],
  },
  {
    id: '2',
    tag: 'insight',
    tagLabel: '洞察',
    title: '价格异常波动分析',
    source: '订单价格稽核Agent · 昨天 18:00',
    time: '昨天 18:00',
    metrics: [
      { label: '异常订单', value: 18, unit: '单' },
      { label: '涉及金额', value: 128.60, unit: '万元' },
    ],
  },
  {
    id: '3',
    tag: 'insight',
    tagLabel: '洞察',
    title: '库存积压分析报告',
    source: '库存自动预警Agent · 昨天 10:20',
    time: '昨天 10:20',
    metrics: [
      { label: '积压SKU', value: 56, unit: '个' },
      { label: '占用资金', value: 98.20, unit: '万元' },
    ],
  },
  {
    id: '4',
    tag: 'warning',
    tagLabel: '预警',
    title: '供应商交期延迟分析',
    source: '风险Agent · 05-29 16:40',
    time: '05-29 16:40',
    metrics: [
      { label: '延迟供应商', value: 8, unit: '家' },
      { label: '影响订单', value: 32, unit: '单' },
    ],
  },
];
