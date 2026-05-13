import { useState, useEffect } from 'react';
import type { RestApi, I18nApi } from '../icp-extension.types';
import type {
  Notification,
  BusinessTrend,
  RunningAgent,
  AgentKPI,
  AIAssistant,
  InsightReport,
  UserInfo,
} from './types';
import {
  mockUserInfo,
  mockNotifications,
  mockBusinessTrend,
  mockRunningAgents,
  mockAgentKPIs,
  mockAIAssistants,
  mockInsightReports,
} from './mockData';
import { I18nContext } from './i18n';
import NotificationPanel from './components/NotificationPanel';
import BusinessTrendChart from './components/BusinessTrendChart';
import RunningAgentList from './components/RunningAgentList';
import AgentKPICards from './components/AgentKPICards';
import AIAssistantPanel from './components/AIAssistantPanel';
import InsightReportPanel from './components/InsightReportPanel';

interface AppProps {
  restApi?: RestApi;
  i18nApi?: I18nApi;
  params?: Record<string, any>;
}

export default function App({ restApi, i18nApi, params }: AppProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [businessTrend, setBusinessTrend] = useState<BusinessTrend | null>(null);
  const [runningAgents, setRunningAgents] = useState<RunningAgent[]>([]);
  const [agentKPIs, setAgentKPIs] = useState<AgentKPI[]>([]);
  const [assistants, setAssistants] = useState<AIAssistant[]>([]);
  const [reports, setReports] = useState<InsightReport[]>([]);
  const [loading, setLoading] = useState(true);

  const period = params?.period || '本月';

  useEffect(() => {
    async function fetchData() {
      if (!restApi) {
        // 没有 restApi 时直接使用 mock 数据
        useMockData();
        return;
      }

      try {
        const [
          userRes,
          notifRes,
          trendRes,
          agentsRes,
          kpiRes,
          assistantRes,
          reportRes,
        ] = await Promise.all([
          restApi.get('/api/dashboard/user-info'),
          restApi.get('/api/dashboard/notifications'),
          restApi.get(`/api/dashboard/business-trend?period=${period}`),
          restApi.get('/api/dashboard/running-agents'),
          restApi.get(`/api/dashboard/agent-kpis?period=${period}`),
          restApi.get('/api/dashboard/ai-assistants'),
          restApi.get('/api/dashboard/insight-reports'),
        ]);

        setUserInfo(userRes);
        setNotifications(notifRes);
        setBusinessTrend(trendRes);
        setRunningAgents(agentsRes);
        setAgentKPIs(kpiRes);
        setAssistants(assistantRes);
        setReports(reportRes);
      } catch (err) {
        console.error('Dashboard data fetch error, falling back to mock data:', err);
        // API 请求失败时 fallback 到 mock 数据
        useMockData();
      } finally {
        setLoading(false);
      }
    }

    function useMockData() {
      setUserInfo(mockUserInfo);
      setNotifications(mockNotifications);
      setBusinessTrend(mockBusinessTrend);
      setRunningAgents(mockRunningAgents);
      setAgentKPIs(mockAgentKPIs);
      setAssistants(mockAIAssistants);
      setReports(mockInsightReports);
      setLoading(false);
    }

    fetchData();
  }, [restApi, period]);

  if (loading) {
    return <div className="ad-loading">加载中...</div>;
  }

  if (!userInfo) {
    return <div className="ad-empty">暂无数据</div>;
  }

  return (
    <I18nContext.Provider value={i18nApi}>
      <div className="ad-container">
        {/* 区域1：顶部概览 */}
        <div className="ad-top-section">
          <div className="ad-top-left">
            <NotificationPanel userInfo={userInfo} notifications={notifications} />
          </div>
          <div className="ad-top-center">
            {businessTrend && (
              <BusinessTrendChart data={businessTrend} period={period} />
            )}
          </div>
          <div className="ad-top-right">
            <RunningAgentList agents={runningAgents} />
          </div>
        </div>

        {/* 区域2：核心 Agent 工作成效 */}
        <AgentKPICards kpis={agentKPIs} />

        {/* 区域3 + 4：底部两栏 */}
        <div className="ad-bottom-section">
          <div className="ad-bottom-left">
            <AIAssistantPanel assistants={assistants} />
          </div>
          <div className="ad-bottom-right">
            <InsightReportPanel reports={reports} />
          </div>
        </div>
      </div>
    </I18nContext.Provider>
  );
}
