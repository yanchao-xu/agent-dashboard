import type { AgentKPI } from '../types';
import { useI18n } from '../i18n';

interface Props {
    kpis: AgentKPI[];
}

export default function AgentKPICards({ kpis }: Props) {
    const { t } = useI18n();

    return (
        <div className="ad-kpi-section">
            <div className="ad-kpi-header">
                <h3 className="ad-section-title">
                    {t('agent-dashboard>kpi>title')}
                    <span className="ad-kpi-period">（{t('agent-dashboard>kpi>this-month')}）</span>
                </h3>
                <button className="ad-link-btn">{t('agent-dashboard>kpi>view-all')}</button>
            </div>

            <div className="ad-kpi-grid">
                {kpis.map((kpi) => (
                    <div key={kpi.id} className="ad-kpi-card">
                        <div className="ad-kpi-card-header">
                            <span className="ad-kpi-icon" style={{ backgroundColor: kpi.color }}>
                                {kpi.icon}
                            </span>
                            <span className="ad-kpi-name">{kpi.name}</span>
                            {kpi.id === '1' && <span className="ad-pending-badge">11</span>}
                        </div>

                        <div className="ad-kpi-metrics">
                            {kpi.metrics.map((metric, idx) => (
                                <div key={idx} className="ad-kpi-metric">
                                    <span className="ad-kpi-metric-value">
                                        {metric.value.toLocaleString()}
                                        <small> {metric.unit}</small>
                                    </span>
                                    <span className="ad-kpi-metric-label">{metric.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="ad-kpi-contribution">
                            <span className="ad-contribution-label">{kpi.contribution.label}</span>
                            <span className="ad-contribution-value ad-growth-up">
                                ↑ {kpi.contribution.value}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
