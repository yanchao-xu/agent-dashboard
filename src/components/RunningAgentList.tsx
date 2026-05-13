import type { RunningAgent } from '../types';
import { useI18n } from '../i18n';

interface Props {
    agents: RunningAgent[];
}

const statusColorMap: Record<string, string> = {
    running: '#22c55e',
    processing: '#f59e0b',
    paused: '#94a3b8',
};

const statusBgMap: Record<string, string> = {
    running: '#dcfce7',
    processing: '#fef3c7',
    paused: '#f1f5f9',
};

export default function RunningAgentList({ agents }: Props) {
    const { t } = useI18n();

    return (
        <div className="ad-running-panel">
            <div className="ad-running-header">
                <h3 className="ad-section-title">{t('agent-dashboard>running>title')}</h3>
                <button className="ad-link-btn">{t('agent-dashboard>running>view-all')}</button>
            </div>

            <div className="ad-running-list">
                {agents.map((agent) => (
                    <div key={agent.id} className="ad-running-item">
                        <div className="ad-running-item-left">
                            <span
                                className="ad-agent-dot"
                                style={{ backgroundColor: statusColorMap[agent.status] }}
                            />
                            <span className="ad-agent-name">{agent.name}</span>
                            <span
                                className="ad-status-badge"
                                style={{
                                    color: statusColorMap[agent.status],
                                    backgroundColor: statusBgMap[agent.status],
                                }}
                            >
                                {agent.statusLabel}
                            </span>
                            {agent.pendingCount && (
                                <span className="ad-pending-badge">{agent.pendingCount}</span>
                            )}
                        </div>
                        <div className="ad-running-item-right">
                            <span className="ad-progress-text">{agent.progress}%</span>
                        </div>
                    </div>
                ))}
                {agents.map((agent) => (
                    <div key={`bar-${agent.id}`} className="ad-progress-bar-wrapper" style={{ display: 'none' }}>
                        {/* 进度条在上面的 item 中内联显示 */}
                    </div>
                ))}
            </div>

            {/* 进度条可视化 */}
            <div className="ad-running-bars">
                {agents.map((agent) => (
                    <div key={agent.id} className="ad-progress-row">
                        <div className="ad-progress-bar">
                            <div
                                className="ad-progress-fill"
                                style={{
                                    width: `${agent.progress}%`,
                                    backgroundColor: statusColorMap[agent.status],
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
