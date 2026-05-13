import type { InsightReport } from '../types';
import { useI18n } from '../i18n';

interface Props {
    reports: InsightReport[];
}

export default function InsightReportPanel({ reports }: Props) {
    const { t } = useI18n();

    return (
        <div className="ad-insight-panel">
            <div className="ad-insight-header">
                <h3 className="ad-section-title">{t('agent-dashboard>insight>title')}</h3>
                <button className="ad-link-btn">{t('agent-dashboard>insight>view-all')}</button>
            </div>

            <div className="ad-insight-list">
                {reports.map((report) => (
                    <div key={report.id} className="ad-insight-card">
                        <span className={`ad-insight-tag ad-tag-${report.tag}`}>
                            {report.tagLabel}
                        </span>
                        <h4 className="ad-insight-title">{report.title}</h4>
                        <p className="ad-insight-source">{report.source}</p>
                        <div className="ad-insight-metrics">
                            {report.metrics.map((metric, idx) => (
                                <div key={idx} className="ad-insight-metric">
                                    <span className="ad-insight-metric-value">
                                        {typeof metric.value === 'number'
                                            ? metric.value.toLocaleString()
                                            : metric.value}
                                        <small> {metric.unit}</small>
                                    </span>
                                    <span className="ad-insight-metric-label">{metric.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
