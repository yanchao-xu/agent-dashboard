import type { BusinessTrend } from '../types';
import { useI18n } from '../i18n';

interface Props {
    data: BusinessTrend;
    period: string;
}

export default function BusinessTrendChart({ data, period }: Props) {
    const { t } = useI18n();

    // 简易 SVG 折线图
    const chartWidth = 280;
    const chartHeight = 100;
    const maxValue = Math.max(...data.chartData.map((d) => d.value));
    const minValue = Math.min(...data.chartData.map((d) => d.value));
    const range = maxValue - minValue || 1;

    const points = data.chartData
        .map((d, i) => {
            const x = (i / (data.chartData.length - 1)) * chartWidth;
            const y = chartHeight - ((d.value - minValue) / range) * chartHeight;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <div className="ad-trend-panel">
            <div className="ad-trend-header">
                <h3 className="ad-section-title">{t('agent-dashboard>trend>title')}</h3>
                <span className="ad-period-badge">{period} ▾</span>
            </div>

            <div className="ad-trend-chart">
                <svg viewBox={`-10 -10 ${chartWidth + 20} ${chartHeight + 30}`} className="ad-svg-chart">
                    <polyline
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                    />
                    {/* 渐变填充 */}
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polygon
                        fill="url(#chartGradient)"
                        points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
                    />
                    {/* X 轴标签 */}
                    {data.chartData.map((d, i) => {
                        const x = (i / (data.chartData.length - 1)) * chartWidth;
                        return (
                            <text
                                key={i}
                                x={x}
                                y={chartHeight + 18}
                                textAnchor="middle"
                                fontSize="8"
                                fill="#9ca3af"
                            >
                                {d.date}
                            </text>
                        );
                    })}
                </svg>
            </div>

            <div className="ad-trend-metrics">
                <div className="ad-trend-metric">
                    <span className="ad-metric-label">
                        {t('agent-dashboard>trend>revenue')}({data.revenue.unit})
                    </span>
                    <span className="ad-metric-value">{data.revenue.value.toLocaleString()}</span>
                    <span className="ad-metric-growth ad-growth-up">↑ {data.revenue.growth}%</span>
                </div>
                <div className="ad-trend-metric">
                    <span className="ad-metric-label">
                        {t('agent-dashboard>trend>orders')}({data.orderCount.unit})
                    </span>
                    <span className="ad-metric-value">{data.orderCount.value.toLocaleString()}</span>
                    <span className="ad-metric-growth ad-growth-up">↑ {data.orderCount.growth}%</span>
                </div>
            </div>
        </div>
    );
}
