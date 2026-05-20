import type {
  AgentMetricDefinition,
  AgentBusinessMetricDaily,
  AgentRegistry,
} from "../types";
import { useI18n } from "../i18n";

interface Props {
  metricDefinitions: AgentMetricDefinition[];
  metricDailyValues: AgentBusinessMetricDaily[];
  agentRegistry: AgentRegistry[];
}

const agentColorPalette = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
];

export default function AgentKPICards({
  metricDefinitions,
  metricDailyValues,
  agentRegistry,
}: Props) {
  const { t } = useI18n();

  // 按 agentId 分组指标定义（只取 active 的）
  const activeDefinitions = metricDefinitions.filter(
    (d) => d.status === "active",
  );
  const agentIds = [...new Set(activeDefinitions.map((d) => d.agentId))];

  function getAgentName(agentId: string): string {
    const agent = agentRegistry.find((a) => String(a.id) === String(agentId));
    return agent?.name || agentId;
  }

  function getAgentIcon(agentId: string): string {
    const agent = agentRegistry.find((a) => String(a.id) === String(agentId));
    return agent?.iconUrl || "🤖";
  }

  // 获取某个指标定义的最新日值
  function getLatestValue(metricDefId: string): number | null {
    const values = metricDailyValues
      .filter((v) => String(v.metricDefId) === String(metricDefId))
      .sort((a, b) => b.statDate.localeCompare(a.statDate));
    return values.length > 0 ? values[0].value : null;
  }

  return (
    <div className="ad-kpi-section">
      <div className="ad-kpi-header">
        <h3 className="ad-section-title">
          {t("agent-dashboard>kpi>title")}
          <span className="ad-kpi-period">
            （{t("agent-dashboard>kpi>this-month")}）
          </span>
        </h3>
        <button className="ad-link-btn">
          {t("agent-dashboard>kpi>view-all")}
        </button>
      </div>

      <div className="ad-kpi-grid">
        {agentIds.map((agentId, idx) => {
          const defs = activeDefinitions
            .filter(
              (d) => d.agentId === agentId && d.displayCategory === "primary",
            )
            .sort((a, b) => a.displayOrder - b.displayOrder);

          const color = agentColorPalette[idx % agentColorPalette.length];

          // 计算价值贡献（isValueContribution 为 true 的指标加权求和）
          const contributionDefs = activeDefinitions.filter(
            (d) => d.agentId === agentId && d.isValueContribution,
          );
          const totalContribution = contributionDefs.reduce((sum, def) => {
            const val = getLatestValue(def.id);
            return sum + (val ?? 0) * (def.valueWeight ?? 1);
          }, 0);

          return (
            <div key={agentId} className="ad-kpi-card">
              <div className="ad-kpi-card-header">
                <span
                  className="ad-kpi-icon"
                  style={{ backgroundColor: color }}
                >
                  {getAgentIcon(agentId).startsWith("http")
                    ? "🤖"
                    : getAgentIcon(agentId)}
                </span>
                <span className="ad-kpi-name">{getAgentName(agentId)}</span>
              </div>

              <div className="ad-kpi-metrics">
                {defs.slice(0, 3).map((def, i) => {
                  const val = getLatestValue(def.id);
                  return (
                    <div
                      key={def.id}
                      className={`ad-kpi-metric${i > 0 ? " ad-kpi-metric-bordered" : ""}`}
                    >
                      <span className="ad-kpi-metric-value">
                        {val !== null ? val.toLocaleString() : "-"}
                        <small> {def.unit}</small>
                      </span>
                      <span className="ad-kpi-metric-label">
                        {def.metricName}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* {contributionDefs.length > 0 && (
                <div className="ad-kpi-contribution">
                  <span className="ad-contribution-label">{t("agent-dashboard>kpi>value-contribution")}</span>
                  <span className="ad-contribution-value ad-growth-up">
                    ↑ {totalContribution.toLocaleString()}%
                  </span>
                </div>
              )} */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
