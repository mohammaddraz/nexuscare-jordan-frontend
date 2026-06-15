import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import './StatsCard.css';

/**
 * StatsCard — Reusable KPI/statistics card (DRY)
 * Used across all dashboards (Consumer, Provider, Admin)
 * 
 * @param {string} title - Card heading
 * @param {string|number} value - Main stat value
 * @param {string} subtitle - Description below value
 * @param {React.ReactNode} icon - Lucide icon component
 * @param {string} trend - Trend text (e.g., "+12% from last month")
 * @param {string} trendDirection - 'up' | 'down' | 'neutral'
 * @param {string} variant - Color variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
 * @param {Array} chartData - Array of objects for the sparkline chart
 */

const variantStyles = {
  primary: { bg: 'var(--color-brand-primary)', iconBg: 'rgba(19, 27, 46, 0.08)', iconColor: 'var(--color-brand-primary)', chartColor: '#131b2e' },
  secondary: { bg: 'var(--color-brand-secondary)', iconBg: 'rgba(0, 106, 97, 0.08)', iconColor: 'var(--color-brand-secondary)', chartColor: '#006a61' },
  info: { bg: 'var(--color-info)', iconBg: 'rgba(56, 189, 248, 0.08)', iconColor: 'var(--color-info)', chartColor: '#38bdf8' },
  success: { bg: 'var(--color-success)', iconBg: 'rgba(16, 185, 129, 0.08)', iconColor: 'var(--color-success)', chartColor: '#10b981' },
  warning: { bg: 'var(--color-warning)', iconBg: 'rgba(245, 158, 11, 0.08)', iconColor: 'var(--color-warning)', chartColor: '#f59e0b' },
  danger: { bg: 'var(--color-danger)', iconBg: 'rgba(239, 68, 68, 0.08)', iconColor: 'var(--color-danger)', chartColor: '#ef4444' },
};

function StatsCard({ title, value, subtitle, icon: Icon, trend, trendDirection = 'neutral', variant = 'secondary', chartData }) {
  const style = variantStyles[variant] || variantStyles.secondary;

  return (
    <div className="card glass-panel-hover h-100 position-relative overflow-hidden">
      <div className="card-body p-3 d-flex flex-column z-1 position-relative">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 shadow-sm stats-card-icon-box"
            style={{ backgroundColor: style.iconBg }}
          >
            {Icon && <Icon size={20} color={style.iconColor} />}
          </div>
          {trend && (
            <span
              className="px-2 py-1 rounded-pill stats-card-trend"
              style={{
                backgroundColor: trendDirection === 'up' ? 'rgba(16, 185, 129, 0.1)' :
                  trendDirection === 'down' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                color: trendDirection === 'up' ? 'var(--color-success)' :
                  trendDirection === 'down' ? 'var(--color-danger)' : 'var(--color-text-secondary)',
              }}
            >
              {trend}
            </span>
          )}
        </div>

        <div>
          <p className="mb-1 stats-card-label">
            {title}
          </p>
          <p className="mb-0 stats-card-value">
            {value}
          </p>
          {subtitle && (
            <p className="mb-0 mt-1 stats-card-subtitle">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {chartData && chartData.length > 0 && (
        <div className="position-absolute bottom-0 start-0 w-100 z-0 stats-card-chart-bg">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={style.chartColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={style.chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={style.chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${title.replace(/\s+/g, '-')})`}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default StatsCard;
