import { useState } from "react";
import type { UserAgentFavorite, AgentRegistry } from "../types";
import type { RestApi, RouterApi } from "../../icp-extension.types";
import { addUserAgentFavorite, PROJECT_TOKEN } from "../api";
import { useI18n } from "../i18n";

interface Props {
    favorites: UserAgentFavorite[];
    agentRegistry: AgentRegistry[];
    restApi?: RestApi;
    routerApi?: RouterApi;
    onFavoritesChange?: () => void;
}

/** 每页显示的格子数（最后一个固定为"添加"按钮，所以实际展示 PAGE_SIZE - 1 个收藏） */
const PAGE_SIZE = 6;
const ITEMS_PER_PAGE = PAGE_SIZE - 1; // 留一个位置给"添加"按钮

export default function AIAssistantPanel({ favorites, agentRegistry, restApi, routerApi, onFavoritesChange }: Props) {
    const { t } = useI18n();
    const [currentPage, setCurrentPage] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // 按 sortOrder 排序
    const sortedFavorites = [...favorites].sort((a, b) => a.sortOrder - b.sortOrder);

    // 分页
    const totalPages = Math.max(1, Math.ceil(sortedFavorites.length / ITEMS_PER_PAGE));
    const pageStart = currentPage * ITEMS_PER_PAGE;
    const pageFavorites = sortedFavorites.slice(pageStart, pageStart + ITEMS_PER_PAGE);

    // 未收藏的 agent 列表
    const favoritedAgentIds = new Set(favorites.map((f) => String(f.agentId)));
    const availableAgents = agentRegistry.filter((a) => !favoritedAgentIds.has(String(a.id)));

    function getAgent(agentId: string): AgentRegistry | undefined {
        return agentRegistry.find((a) => String(a.id) === String(agentId));
    }

    function toggleSelect(agentId: string) {
        setSelectedIds((prev) =>
            prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]
        );
    }

    async function handleConfirm() {
        if (!restApi || selectedIds.length === 0) return;
        setSubmitting(true);

        try {
            const maxOrder = favorites.reduce((max, f) => Math.max(max, f.sortOrder), 0);

            for (let i = 0; i < selectedIds.length; i++) {
                await addUserAgentFavorite(restApi, {
                    userId: '',
                    agentId: selectedIds[i],
                    sortOrder: maxOrder + i + 1,
                    addedAt: new Date().toISOString(),
                });
            }

            setShowModal(false);
            setSelectedIds([]);
            onFavoritesChange?.();
        } catch (err) {
            console.error("添加收藏失败:", err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="ad-assistant-panel">
            <div className="ad-assistant-header">
                <h3 className="ad-section-title">{t("agent-dashboard>assistant>title")}</h3>
                <button className="ad-link-btn" onClick={() => routerApi?.navigate(`/${PROJECT_TOKEN}/page/user-agent-favorite-form-list`)}>{t("agent-dashboard>assistant>manage")}</button>
            </div>

            <div className="ad-assistant-grid">
                {pageFavorites.map((fav) => {
                    const agent = getAgent(fav.agentId);
                    return (
                        <div key={fav.id} className="ad-assistant-item">
                            <span className="ad-assistant-icon">
                                {agent?.iconUrl && !agent.iconUrl.startsWith("http") ? agent.iconUrl : "🤖"}
                            </span>
                            <span className="ad-assistant-name">{agent?.name || fav.agentId}</span>
                            <span className="ad-assistant-status">
                                {t("agent-dashboard>assistant>collected")}
                            </span>
                        </div>
                    );
                })}
                {/* 最后一个格子固定为"添加"按钮 */}
                <div className="ad-assistant-item ad-assistant-add" onClick={() => setShowModal(true)}>
                    <span className="ad-assistant-icon">＋</span>
                    <span className="ad-assistant-name">{t("agent-dashboard>assistant>add")}</span>
                </div>
            </div>

            {/* 分页指示器 */}
            {totalPages > 1 && (
                <div className="ad-pagination-dots">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <span
                            key={i}
                            className={`ad-dot ${i === currentPage ? "ad-dot-active" : ""}`}
                            onClick={() => setCurrentPage(i)}
                        />
                    ))}
                </div>
            )}

            {/* 添加助手弹窗 */}
            {showModal && (
                <div className="ad-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ad-modal-header">
                            <h4 className="ad-modal-title">添加助手</h4>
                            <button className="ad-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="ad-modal-body">
                            {availableAgents.length === 0 ? (
                                <p className="ad-modal-empty">所有助手已添加</p>
                            ) : (
                                <div className="ad-modal-list">
                                    {availableAgents.map((agent) => (
                                        <label key={agent.id} className="ad-modal-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(agent.id)}
                                                onChange={() => toggleSelect(agent.id)}
                                            />
                                            <span className="ad-modal-item-icon">
                                                {agent.iconUrl && !agent.iconUrl.startsWith("http") ? agent.iconUrl : "🤖"}
                                            </span>
                                            <span className="ad-modal-item-name">{agent.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="ad-modal-footer">
                            <button
                                className="ad-btn ad-btn-outline ad-btn-sm"
                                onClick={() => setShowModal(false)}
                            >
                                取消
                            </button>
                            <button
                                className="ad-btn ad-btn-primary ad-btn-sm"
                                disabled={selectedIds.length === 0 || submitting}
                                onClick={handleConfirm}
                            >
                                {submitting ? "添加中..." : `确认 (${selectedIds.length})`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
