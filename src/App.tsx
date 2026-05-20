import { useState, useEffect } from "react";
import type { RestApi, I18nApi, RouterApi, MessageApi } from "../icp-extension.types";
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
import {
  fetchHitlTodos,
  fetchAgentTasks,
  fetchMetricDefinitions,
  fetchMetricDailyValues,
  fetchUserAgentFavorites,
  fetchInsightReports,
  fetchAgentRegistry,
} from "./api";

import { I18nContext } from "./i18n";
import NotificationPanel from "./components/NotificationPanel";
import BusinessTrendChart from "./components/BusinessTrendChart";
import RunningAgentList from "./components/RunningAgentList";
import AgentKPICards from "./components/AgentKPICards";
import AIAssistantPanel from "./components/AIAssistantPanel";
import InsightReportPanel from "./components/InsightReportPanel";

interface AppProps {
  restApi?: RestApi;
  i18nApi?: I18nApi;
  messageApi?: MessageApi;
  routerApi?: RouterApi;
  params?: Record<string, any>;
}

export default function App({ restApi, i18nApi, messageApi, routerApi, params }: AppProps) {
  const [hitlTodos, setHitlTodos] = useState<HitlTodo[]>([]);
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [metricDefinitions, setMetricDefinitions] = useState<
    AgentMetricDefinition[]
  >([]);
  const [metricDailyValues, setMetricDailyValues] = useState<
    AgentBusinessMetricDaily[]
  >([]);
  const [favorites, setFavorites] = useState<UserAgentFavorite[]>([]);
  const [insightReports, setInsightReports] = useState<AgentInsightReport[]>(
    [],
  );
  const [agentRegistry, setAgentRegistry] = useState<AgentRegistry[]>([]);
  const [loading, setLoading] = useState(true);

  const period = params?.period || "month";

  // userInfo comes from host params, not from API
  const userInfo: UserInfo | null = params?.userInfo
    ? {
      name: params.userInfo.name || "",
      role: params.userInfo.role || "",
      period: params.userInfo.period || period,
    }
    : null;

  useEffect(() => {
    async function loadData() {
      if (!restApi) {
        console.error("restApi is not provided");
        setLoading(false);
        return;
      }

      try {
        const [
          hitlRes,
          taskRes,
          metricDefRes,
          metricDailyRes,
          favoriteRes,
          reportRes,
          registryRes,
        ] = await Promise.all([
          fetchHitlTodos(restApi),
          fetchAgentTasks(restApi),
          fetchMetricDefinitions(restApi),
          fetchMetricDailyValues(restApi),
          fetchUserAgentFavorites(restApi),
          fetchInsightReports(restApi),
          fetchAgentRegistry(restApi),
        ]);

        setHitlTodos(hitlRes);
        setAgentTasks(taskRes);
        setMetricDefinitions(metricDefRes);
        setMetricDailyValues(metricDailyRes);
        setFavorites(favoriteRes);
        setInsightReports(reportRes);
        setAgentRegistry(registryRes);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [restApi, period]);

  if (loading) {
    return <div className="ad-loading">加载中...</div>;
  }

  if (!userInfo) {
    return <div className="ad-empty">暂无数据</div>;
  }
  console.log("agentRegistry", agentRegistry);
  return (
    <I18nContext.Provider value={i18nApi}>
      <div className="ad-container">
        {/* 区域1：顶部概览 */}
        <div className="ad-top-section">
          <div className="ad-top-left">
            <NotificationPanel
              userInfo={userInfo}
              hitlTodos={hitlTodos}
              agentRegistry={agentRegistry}
              restApi={restApi}
              messageApi={messageApi}
              routerApi={routerApi}
            />
          </div>
          <div className="ad-top-center">
            <BusinessTrendChart
              period={period}
              restApi={restApi}
            />
          </div>
          <div className="ad-top-right">
            <RunningAgentList
              agentTasks={agentTasks}
              agentRegistry={agentRegistry}
              routerApi={routerApi}
            />
          </div>
        </div>

        {/* 区域2：核心 Agent 工作成效 */}
        <AgentKPICards
          metricDefinitions={metricDefinitions}
          metricDailyValues={metricDailyValues}
          agentRegistry={agentRegistry}
        />

        {/* 区域3 + 4：底部两栏 */}
        <div className="ad-bottom-section">
          <div className="ad-bottom-left">
            <AIAssistantPanel
              favorites={favorites}
              agentRegistry={agentRegistry}
              restApi={restApi}
              routerApi={routerApi}
              onFavoritesChange={async () => {
                if (restApi) {
                  const updated = await fetchUserAgentFavorites(restApi);
                  setFavorites(updated);
                }
              }}
            />
          </div>
          <div className="ad-bottom-right">
            <InsightReportPanel
              reports={insightReports}
              agentRegistry={agentRegistry}
              routerApi={routerApi}
            />
          </div>
        </div>
      </div>
    </I18nContext.Provider>
  );
}
