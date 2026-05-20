import type {
  HitlTodo,
  AgentTask,
  AgentMetricDefinition,
  AgentBusinessMetricDaily,
  UserAgentFavorite,
  AgentInsightReport,
  AgentRegistry,
  UserInfo,
} from './types';

export const mockUserInfo: UserInfo = {
  name: '张经理',
  role: 'manager',
  period: '本月',
};

export const mockAgentRegistry: AgentRegistry[] = [
  { id: '10188805', agentCode: 'reconciliation', name: '每日往来核销Agent', iconUrl: '✓', description: '', domain: 'finance', type: 'execution', executionMode: 'async', isHitlCapable: true, isInsightCapable: true, entryUrl: '', backendService: '', version: '1.2.0', status: 'active', ownerTeam: '', config: '' },
  { id: '10188806', agentCode: 'invoice-gen', name: '订单发票联单生成Agent', iconUrl: '📄', description: '', domain: 'finance', type: 'execution', executionMode: 'async', isHitlCapable: true, isInsightCapable: false, entryUrl: '', backendService: '', version: '2.0.1', status: 'active', ownerTeam: '', config: '' },
  { id: '10188807', agentCode: 'price-audit', name: '订单价格稽核Agent', iconUrl: '🔍', description: '', domain: 'sales', type: 'risk', executionMode: 'async', isHitlCapable: true, isInsightCapable: true, entryUrl: '', backendService: '', version: '1.5.0', status: 'active', ownerTeam: '', config: '' },
  { id: '10188808', agentCode: 'inventory-alert', name: '库存自动预警Agent', iconUrl: '📦', description: '', domain: 'inventory', type: 'insight', executionMode: 'long_running', isHitlCapable: false, isInsightCapable: true, entryUrl: '', backendService: '', version: '1.0.0', status: 'active', ownerTeam: '', config: '' },
  { id: '10188809', agentCode: 'collection-assistant', name: '智能收款助手', iconUrl: '⚙️', description: '', domain: 'finance', type: 'assistant', executionMode: 'sync', isHitlCapable: false, isInsightCapable: false, entryUrl: '', backendService: '', version: '1.1.0', status: 'active', ownerTeam: '', config: '' },
  { id: '10188810', agentCode: 'contract-review', name: '合同审核助手', iconUrl: '📋', description: '', domain: 'compliance', type: 'assistant', executionMode: 'sync', isHitlCapable: false, isInsightCapable: false, entryUrl: '', backendService: '', version: '1.0.0', status: 'active', ownerTeam: '', config: '' },
  { id: '10188811', agentCode: 'inventory-analysis', name: '库存分析助手', iconUrl: '📊', description: '', domain: 'inventory', type: 'assistant', executionMode: 'sync', isHitlCapable: false, isInsightCapable: false, entryUrl: '', backendService: '', version: '1.0.0', status: 'active', ownerTeam: '', config: '' },
  { id: '10188812', agentCode: 'tax-calc', name: '税务计算助手', iconUrl: '🧮', description: '', domain: 'finance', type: 'assistant', executionMode: 'sync', isHitlCapable: false, isInsightCapable: false, entryUrl: '', backendService: '', version: '1.0.0', status: 'active', ownerTeam: '', config: '' },
  { id: '10188813', agentCode: 'supplier-eval', name: '供应商评估Agent', iconUrl: '🏭', description: '', domain: 'supply_chain', type: 'insight', executionMode: 'async', isHitlCapable: true, isInsightCapable: true, entryUrl: '', backendService: '', version: '1.0.0', status: 'active', ownerTeam: '', config: '' },
  { id: '10188814', agentCode: 'sales-forecast', name: '销售预测Agent', iconUrl: '📈', description: '', domain: 'sales', type: 'insight', executionMode: 'async', isHitlCapable: false, isInsightCapable: true, entryUrl: '', backendService: '', version: '2.1.0', status: 'active', ownerTeam: '', config: '' },
  { id: '10188815', agentCode: 'expense-audit', name: '费用报销审核Agent', iconUrl: '💰', description: '', domain: 'finance', type: 'execution', executionMode: 'async', isHitlCapable: true, isInsightCapable: false, entryUrl: '', backendService: '', version: '1.3.0', status: 'active', ownerTeam: '', config: '' },
  { id: '10188816', agentCode: 'hr-onboard', name: '入职流程助手', iconUrl: '👤', description: '', domain: 'hr', type: 'assistant', executionMode: 'sync', isHitlCapable: false, isInsightCapable: false, entryUrl: '', backendService: '', version: '1.0.0', status: 'active', ownerTeam: '', config: '' },
];

export const mockHitlTodos: HitlTodo[] = [
  {
    id: 'todo-1',
    taskId: '10188824',
    todoType: 'confirm',
    title: '原材料交货逾期，已生成替代采购方案，请确认执行。',
    assignedTo: '',
    priority: 'high',
    status: 'pending',
    payload: '',
    actionOptions: { longText: '[{"label": "一键执行", "value": "execute"}]', value: '' },
  },
  {
    id: 'todo-2',
    taskId: '10188825',
    todoType: 'review',
    title: '智能防跨价invoice中有8笔尚未通过价格稽核，需复核。',
    assignedTo: '',
    priority: 'medium',
    status: 'pending',
    payload: '',
    actionOptions: { longText: '[{"label": "去复核", "value": "review"}]', value: '' },
  },
  {
    id: 'todo-3',
    taskId: '10188826',
    todoType: 'approve',
    title: '库存预警触发自动补货申请，需审批。',
    assignedTo: '',
    priority: 'medium',
    status: 'pending',
    payload: '',
    actionOptions: { longText: '[{"label": "审批", "value": "approve", "url": "/flow-test/generate", "methord": "get"}, {"label": "驳回", "value": "reject"}]', value: '' },
  },
];

export const mockAgentTasks: AgentTask[] = [
  { id: '10188824', agentId: '10188805', triggerType: 'scheduled', triggerBy: 'system', executionMode: 'async', status: 'running', progressPercent: 98, inputParams: '', tokenCost: 0, startedAt: '' },
  { id: '10188825', agentId: '10188806', triggerType: 'scheduled', triggerBy: 'system', executionMode: 'async', status: 'running', progressPercent: 85, inputParams: '', tokenCost: 0, startedAt: '' },
  { id: '10188826', agentId: '10188807', triggerType: 'event', triggerBy: 'system', executionMode: 'async', status: 'waiting_hitl', progressPercent: 62, inputParams: '', tokenCost: 0, startedAt: '' },
  { id: '10188827', agentId: '10188808', triggerType: 'scheduled', triggerBy: 'system', executionMode: 'long_running', status: 'running', progressPercent: 75, inputParams: '', tokenCost: 0, startedAt: '' },
];

export const mockMetricDefinitions: AgentMetricDefinition[] = [
  { id: '10188831', agentId: '10188805', metricKey: 'auto_completed', metricName: '已自动完成', metricDescription: '', valueType: 'integer', unit: '笔', aggregationType: 'sum', isValueContribution: false, displayCategory: 'primary', displayOrder: 1, status: 'active' },
  { id: '10188832', agentId: '10188805', metricKey: 'pending_confirm', metricName: '待人工确认', metricDescription: '', valueType: 'integer', unit: '笔', aggregationType: 'sum', isValueContribution: false, displayCategory: 'primary', displayOrder: 2, status: 'active' },
  { id: '10188833', agentId: '10188805', metricKey: 'reconciled_amount', metricName: '核销金额', metricDescription: '', valueType: 'decimal', unit: '万元', aggregationType: 'sum', isValueContribution: true, valueWeight: 1, displayCategory: 'primary', displayOrder: 3, status: 'active' },
  { id: '10188834', agentId: '10188806', metricKey: 'generated_count', metricName: '已生成', metricDescription: '', valueType: 'integer', unit: '单', aggregationType: 'sum', isValueContribution: false, displayCategory: 'primary', displayOrder: 1, status: 'active' },
  { id: '10188835', agentId: '10188806', metricKey: 'exception_count', metricName: '异常待处理', metricDescription: '', valueType: 'integer', unit: '单', aggregationType: 'sum', isValueContribution: false, displayCategory: 'primary', displayOrder: 2, status: 'active' },
  { id: '10188836', agentId: '10188806', metricKey: 'order_amount', metricName: '订单金额', metricDescription: '', valueType: 'decimal', unit: '万元', aggregationType: 'sum', isValueContribution: true, valueWeight: 1, displayCategory: 'primary', displayOrder: 3, status: 'active' },
  { id: '10188837', agentId: '10188807', metricKey: 'audited_count', metricName: '已稽核', metricDescription: '', valueType: 'integer', unit: '单', aggregationType: 'sum', isValueContribution: false, displayCategory: 'primary', displayOrder: 1, status: 'active' },
  { id: '10188838', agentId: '10188807', metricKey: 'pending_review', metricName: '待人工复核', metricDescription: '', valueType: 'integer', unit: '单', aggregationType: 'sum', isValueContribution: false, displayCategory: 'primary', displayOrder: 2, status: 'active' },
  { id: '10188839', agentId: '10188807', metricKey: 'blocked_amount', metricName: '拦截异常金额', metricDescription: '', valueType: 'decimal', unit: '万元', aggregationType: 'sum', isValueContribution: true, valueWeight: 1, displayCategory: 'primary', displayOrder: 3, status: 'active' },
  { id: '10188840', agentId: '10188808', metricKey: 'alert_count', metricName: '预警次数', metricDescription: '', valueType: 'integer', unit: '次', aggregationType: 'sum', isValueContribution: false, displayCategory: 'primary', displayOrder: 1, status: 'active' },
  { id: '10188841', agentId: '10188808', metricKey: 'resolved_alerts', metricName: '已处理预警', metricDescription: '', valueType: 'integer', unit: '个', aggregationType: 'sum', isValueContribution: false, displayCategory: 'primary', displayOrder: 2, status: 'active' },
  { id: '10188842', agentId: '10188808', metricKey: 'avoided_stockout_amount', metricName: '避免缺货金额', metricDescription: '', valueType: 'decimal', unit: '万元', aggregationType: 'sum', isValueContribution: true, valueWeight: 1, displayCategory: 'primary', displayOrder: 3, status: 'active' },
];

export const mockMetricDailyValues: AgentBusinessMetricDaily[] = [
  { id: 'v-001', agentId: '10188805', metricDefId: '10188831', metricKey: 'auto_completed', statDate: '2026-05-18', value: 396 },
  { id: 'v-002', agentId: '10188805', metricDefId: '10188832', metricKey: 'pending_confirm', statDate: '2026-05-18', value: 23 },
  { id: 'v-003', agentId: '10188805', metricDefId: '10188833', metricKey: 'reconciled_amount', statDate: '2026-05-18', value: 1245.3 },
  { id: 'v-004', agentId: '10188806', metricDefId: '10188834', metricKey: 'generated_count', statDate: '2026-05-18', value: 1128 },
  { id: 'v-005', agentId: '10188806', metricDefId: '10188835', metricKey: 'exception_count', statDate: '2026-05-18', value: 62 },
  { id: 'v-006', agentId: '10188806', metricDefId: '10188836', metricKey: 'order_amount', statDate: '2026-05-18', value: 3560.8 },
  { id: 'v-007', agentId: '10188807', metricDefId: '10188837', metricKey: 'audited_count', statDate: '2026-05-18', value: 842 },
  { id: 'v-008', agentId: '10188807', metricDefId: '10188838', metricKey: 'pending_review', statDate: '2026-05-18', value: 18 },
  { id: 'v-009', agentId: '10188807', metricDefId: '10188839', metricKey: 'blocked_amount', statDate: '2026-05-18', value: 128.6 },
  { id: 'v-010', agentId: '10188808', metricDefId: '10188840', metricKey: 'alert_count', statDate: '2026-05-18', value: 56 },
  { id: 'v-011', agentId: '10188808', metricDefId: '10188841', metricKey: 'resolved_alerts', statDate: '2026-05-18', value: 12 },
  { id: 'v-012', agentId: '10188808', metricDefId: '10188842', metricKey: 'avoided_stockout_amount', statDate: '2026-05-18', value: 98.2 },
];

export const mockFavorites: UserAgentFavorite[] = [
  { id: 'fav-1', userId: '', agentId: '10188809', sortOrder: 1, addedAt: '' },
  { id: 'fav-2', userId: '', agentId: '10188807', sortOrder: 2, addedAt: '' },
  { id: 'fav-3', userId: '', agentId: '10188810', sortOrder: 3, addedAt: '' },
  { id: 'fav-4', userId: '', agentId: '10188811', sortOrder: 4, addedAt: '' },
  { id: 'fav-5', userId: '', agentId: '10188812', sortOrder: 5, addedAt: '' },
  { id: 'fav-6', userId: '', agentId: '10188813', sortOrder: 6, addedAt: '' },
  { id: 'fav-7', userId: '', agentId: '10188814', sortOrder: 7, addedAt: '' },
  { id: 'fav-8', userId: '', agentId: '10188815', sortOrder: 8, addedAt: '' },
];

export const mockInsightReports: AgentInsightReport[] = [
  { id: 'report-1', agentId: '10188805', reportType: 'alert', severity: 'warning', title: '逾期账款回收风险预警', summary: '', keyMetrics: { longText: '{"高风险客户": 12, "涉及金额(万元)": 245.6}', value: '' }, businessImpactAmount: 2456000, contentUrl: '/reports/report-1/v1.html', contentFormat: 'html', contentStorageType: 'object_storage', contentVersion: 1, generatedAt: '2026-05-18 09:30' },
  { id: 'report-2', agentId: '10188807', reportType: 'insight', severity: 'info', title: '价格异常波动分析', summary: '', keyMetrics: { longText: '{"异常订单": 18, "涉及金额(万元)": 128.6}', value: '' }, businessImpactAmount: 1286000, contentUrl: '/reports/report-2/v1.html', contentFormat: 'html', contentStorageType: 'object_storage', contentVersion: 1, generatedAt: '2026-05-17 18:00' },
  { id: 'report-3', agentId: '10188808', reportType: 'insight', severity: 'info', title: '库存积压分析报告', summary: '', keyMetrics: { longText: '{"积压SKU": 56, "占用资金(万元)": 98.2}', value: '' }, businessImpactAmount: 982000, contentUrl: '/reports/report-3/v1.md', contentFormat: 'markdown', contentStorageType: 'object_storage', contentVersion: 1, generatedAt: '2026-05-17 10:20' },
  { id: 'report-4', agentId: '10188808', reportType: 'risk_warning', severity: 'warning', title: '供应商交期延迟分析', summary: '', keyMetrics: { longText: '{"延迟供应商": 8, "影响订单": 32}', value: '' }, contentUrl: '/reports/report-4/v1.html', contentFormat: 'html', contentStorageType: 'cdn', contentVersion: 1, generatedAt: '2026-05-16 16:40' },
];
