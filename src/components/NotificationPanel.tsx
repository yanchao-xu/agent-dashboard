import { useState } from "react";
import type { HitlTodo, AgentRegistry, UserInfo, LongTextField } from "../types";
import type { RestApi, RouterApi, MessageApi } from "../../icp-extension.types";
import { useI18n } from "../i18n";

interface Props {
  userInfo: UserInfo;
  hitlTodos: HitlTodo[];
  agentRegistry: AgentRegistry[];
  restApi?: RestApi;
  messageApi?: MessageApi;
  routerApi?: RouterApi;
}

interface ActionOption {
  label: string;
  value: string;
  url?: string;
  methord?: string;
}

const priorityStyleMap: Record<string, { bg: string; border: string; icon: string }> = {
  high: { bg: "#fef3c7", border: "#fde68a", icon: "⚠️" },
  medium: { bg: "#eff6ff", border: "#bfdbfe", icon: "🔵" },
  low: { bg: "#f0fdf4", border: "#bbf7d0", icon: "ℹ️" },
};

function parseActionOptions(raw: string | LongTextField): ActionOption[] {
  try {
    const jsonStr = typeof raw === 'object' && raw !== null ? raw.longText : raw;
    if (!jsonStr) return [];
    const options = JSON.parse(jsonStr) as ActionOption[];
    // 过滤掉"查看详情"，因为它是固定按钮
    return options.filter((opt) => opt.value !== "detail" && opt.label !== "查看详情");
  } catch {
    return [];
  }
}

export default function NotificationPanel({ userInfo, hitlTodos, agentRegistry, restApi, messageApi, routerApi }: Props) {
  const { t } = useI18n();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  // 只显示待处理和处理中的待办
  const activeTodos = hitlTodos.filter(
    (todo) => todo.status === "pending" || todo.status === "processing"
  );

  function handleViewDetail(todoId: string) {
    routerApi?.navigate(`/workbench-intelligence/form/hitl-todo-form/${todoId}/view`);
  }

  async function handleAction(action: ActionOption, todoId: string, actionIdx: number) {
    if (!action.url || !restApi) return;
    const key = `${todoId}-${actionIdx}`;
    setLoadingKey(key);
    const method = (action.methord || "get").toLowerCase();
    try {
      if (method === "post") {
        await restApi.post(action.url, {});
      } else if (method === "put") {
        await restApi.put(action.url, {});
      } else if (method === "delete") {
        await restApi.delete(action.url);
      } else {
        await restApi.get(action.url);
      }
      messageApi?.success(`${action.label}操作成功`);
    } catch (err) {
      console.error("Action request failed:", err);
      messageApi?.error(`${action.label}操作失败`);
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <div className="ad-notification-panel">
      <h1 className="ad-welcome">
        {t("agent-dashboard>welcome", { name: userInfo.name })}
      </h1>
      <p className="ad-slogan">{t("agent-dashboard>slogan")}</p>

      <div className="ad-notification-list">
        {activeTodos.slice(0, 3).map((todo) => {
          const style = priorityStyleMap[todo.priority] || priorityStyleMap.medium;
          const actions = parseActionOptions(todo.actionOptions);

          return (
            <div
              key={todo.id}
              className="ad-notification-item"
              style={{ background: style.bg, border: `1px solid ${style.border}` }}
            >
              <div className="ad-notification-icon">{style.icon}</div>
              <div className="ad-notification-content">
                <span className="ad-notification-agent">
                  【{todo.todoType === "confirm" ? "确认执行" : todo.todoType === "review" ? "复核结果" : todo.todoType === "approve" ? "审批" : todo.todoType === "supplement" ? "补充信息" : "选择"}】
                </span>
                <span className="ad-notification-title">{todo.title}</span>
                <div className="ad-notification-actions">
                  {actions.map((action, idx) => {
                    const isLoading = loadingKey === `${todo.id}-${idx}`;
                    return (
                      <button
                        key={idx}
                        className="ad-btn ad-btn-primary ad-btn-sm"
                        disabled={isLoading}
                        onClick={() => handleAction(action, todo.id, idx)}
                      >
                        {isLoading ? <span className="ad-btn-loading" /> : action.label}
                      </button>
                    );
                  })}
                  <button
                    className="ad-btn ad-btn-outline ad-btn-sm"
                    onClick={() => handleViewDetail(todo.id)}
                  >
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeTodos.length > 3 && (
        <button className="ad-more-link">&gt;&gt;more ({activeTodos.length})</button>
      )}
    </div>
  );
}
