import ReactECharts from "echarts-for-react";
import type { AgentTask, AgentRegistry } from "../types";
import type { RouterApi } from "../../icp-extension.types";
import { PROJECT_TOKEN } from "../api";
import { useI18n } from "../i18n";

interface Props {
  agentTasks: AgentTask[];
  agentRegistry: AgentRegistry[];
  routerApi?: RouterApi;
}

const statusColorMap: Record<string, string> = {
  pending: "#94a3b8",
  running: "#22c55e",
  waiting_hitl: "#f59e0b",
  success: "#10b981",
  failed: "#ef4444",
  cancelled: "#6b7280",
  timeout: "#f97316",
};

const statusBgMap: Record<string, string> = {
  pending: "#f1f5f9",
  running: "#dcfce7",
  waiting_hitl: "#fef3c7",
  success: "#d1fae5",
  failed: "#fee2e2",
  cancelled: "#f3f4f6",
  timeout: "#ffedd5",
};

const statusLabelMap: Record<string, string> = {
  pending: "待执行",
  running: "运行中",
  waiting_hitl: "等待人工",
  success: "成功",
  failed: "失败",
  cancelled: "已取消",
  timeout: "超时",
};

export default function RunningAgentList({ agentTasks, agentRegistry, routerApi }: Props) {
  const { t } = useI18n();

  // 显示所有状态的任务
  const activeTasks = agentTasks;

  function getAgentName(agentId: string): string {
    const agent = agentRegistry.find((a) => String(a.id) === String(agentId));
    return agent?.name || agentId;
  }

  function handleViewAll() {
    routerApi?.navigate(`/${PROJECT_TOKEN}/page/agent-task-form-list`);
  }

  return (
    <div className="ad-running-panel">
      <div className="ad-running-header">
        <h3 className="ad-section-title">
          {t("agent-dashboard>running>title")}
        </h3>
        <button className="ad-link-btn" onClick={handleViewAll}>
          {t("agent-dashboard>running>view-all")}
        </button>
      </div>

      <div className="ad-running-list">
        {activeTasks.slice(0, 4).map((task) => {
          const color = statusColorMap[task.status] || "#94a3b8";
          const bgColor = statusBgMap[task.status] || "#f1f5f9";
          const label = statusLabelMap[task.status] || task.status;
          const progress = task.progressPercent ?? 0;

          const option = {
            grid: { top: 0, right: 0, bottom: 0, left: 0 },
            xAxis: { type: "value", max: 100, show: false },
            yAxis: { type: "category", data: [""], show: false },
            series: [
              {
                type: "bar",
                data: [{ value: progress, itemStyle: { color } }],
                barWidth: 14,
                backgroundStyle: { color: "#f3f4f6", borderRadius: 7 },
                showBackground: true,
                itemStyle: { borderRadius: 7 },
              },
            ],
          };

          return (
            <div key={task.id} className="ad-running-item">
              <div className="ad-running-item-left">
                <span
                  className="ad-agent-dot"
                  style={{ backgroundColor: color }}
                />
                <span className="ad-agent-name">{getAgentName(task.agentId)}</span>
                <span
                  className="ad-status-badge"
                  style={{ color, backgroundColor: bgColor }}
                >
                  {label}
                </span>
              </div>
              <div className="ad-running-item-right">
                <span className="ad-progress-text">{progress}%</span>
              </div>
              <div className="ad-running-item-bar">
                <ReactECharts
                  option={option}
                  style={{ height: 14, width: "100%" }}
                  opts={{ renderer: "svg" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
