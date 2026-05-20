import type { AgentInsightReport, AgentRegistry, LongTextField } from "../types";
import type { RouterApi } from "../../icp-extension.types";
import { PROJECT_TOKEN } from "../api";
import { useI18n } from "../i18n";

interface Props {
    reports: AgentInsightReport[];
    agentRegistry: AgentRegistry[];
    routerApi?: RouterApi;
}

const severityTagMap: Record<string, { className: string; label: string }> = {
    warning: { className: "ad-tag-warning", label: "预警" },
    critical: { className: "ad-tag-warning", label: "严重" },
    info: { className: "ad-tag-insight", label: "洞察" },
};

const reportTypeTagMap: Record<string, { className: string; label: string }> = {
    alert: { className: "ad-tag-warning", label: "预警" },
    risk_warning: { className: "ad-tag-warning", label: "风险" },
    insight: { className: "ad-tag-insight", label: "洞察" },
};

export default function InsightReportPanel({ reports, agentRegistry, routerApi }: Props) {
    const { t } = useI18n();

    function getAgentName(agentId: string): string {
        const agent = agentRegistry.find((a) => String(a.id) === String(agentId));
        return agent?.name || agentId;
    }

    function handleViewAll() {
        routerApi?.navigate(`/${PROJECT_TOKEN}/page/agent-insight-report-form-list`);
    }

    function handleViewReport(report: AgentInsightReport) {
        if (report.contentUrl) {
            window.open(report.contentUrl, "_blank", "noopener,noreferrer");
        }
    }

    // 按生成时间倒序
    const sortedReports = [...reports].sort(
        (a, b) => b.generatedAt.localeCompare(a.generatedAt)
    );

    function parseKeyMetrics(keyMetrics?: string | LongTextField): { label: string; value: string | number; unit: string }[] {
        if (!keyMetrics) return [];
        try {
            const jsonStr = typeof keyMetrics === 'object' && keyMetrics !== null ? keyMetrics.longText : keyMetrics;
            if (!jsonStr) return [];
            const obj = JSON.parse(jsonStr);
            return Object.entries(obj).map(([key, val]) => ({
                label: key,
                value: val as string | number,
                unit: "",
            }));
        } catch {
            return [];
        }
    }

    return (
        <div className="ad-insight-panel">
            <div className="ad-insight-header">
                <h3 className="ad-section-title">{t("agent-dashboard>insight>title")}</h3>
                <button className="ad-link-btn" onClick={handleViewAll}>{t("agent-dashboard>insight>view-all")}</button>
            </div>

            <div className="ad-insight-list">
                {sortedReports.slice(0, 4).map((report) => {
                    const tag = reportTypeTagMap[report.reportType] || severityTagMap[report.severity] || { className: "ad-tag-insight", label: "洞察" };
                    const metrics = parseKeyMetrics(report.keyMetrics);

                    return (
                        <div key={report.id} className="ad-insight-card">
                            <span className={`ad-insight-tag ${tag.className}`}>
                                {tag.label}
                            </span>
                            <h4 className="ad-insight-title">{report.title}</h4>
                            <p className="ad-insight-source">
                                {getAgentName(report.agentId)} · {report.generatedAt}
                            </p>
                            <div className="ad-insight-metrics">
                                {metrics.map((metric, idx) => (
                                    <div key={idx} className="ad-insight-metric">
                                        <span className="ad-insight-metric-value">
                                            {typeof metric.value === "number"
                                                ? metric.value.toLocaleString()
                                                : metric.value}
                                            {metric.unit && <small> {metric.unit}</small>}
                                        </span>
                                        <span className="ad-insight-metric-label">{metric.label}</span>
                                    </div>
                                ))}
                                {report.businessImpactAmount != null && (
                                    <div className="ad-insight-metric">
                                        <span className="ad-insight-metric-value">
                                            {report.businessImpactAmount.toLocaleString()}
                                            <small> 元</small>
                                        </span>
                                        <span className="ad-insight-metric-label">业务影响金额</span>
                                    </div>
                                )}
                            </div>
                            <button
                                className="ad-link-btn ad-insight-view-btn"
                                onClick={() => handleViewReport(report)}
                            >
                                查看报告 &gt;
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
