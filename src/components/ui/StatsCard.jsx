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
 */

const variantStyles = {
  primary: { bg: 'var(--color-brand-primary)', iconBg: 'rgba(19, 27, 46, 0.08)', iconColor: 'var(--color-brand-primary)' },
  secondary: { bg: 'var(--color-brand-secondary)', iconBg: 'rgba(0, 106, 97, 0.08)', iconColor: 'var(--color-brand-secondary)' },
  success: { bg: 'var(--color-success)', iconBg: 'rgba(16, 185, 129, 0.08)', iconColor: 'var(--color-success)' },
  warning: { bg: 'var(--color-warning)', iconBg: 'rgba(245, 158, 11, 0.08)', iconColor: 'var(--color-warning)' },
  danger: { bg: 'var(--color-danger)', iconBg: 'rgba(239, 68, 68, 0.08)', iconColor: 'var(--color-danger)' },
};

function StatsCard({ title, value, subtitle, icon: Icon, trend, trendDirection = 'neutral', variant = 'secondary' }) {
  const style = variantStyles[variant] || variantStyles.secondary;

  return (
    <div className="card glass-panel-hover h-100">
      <div className="card-body p-3">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: 40,
              height: 40,
              backgroundColor: style.iconBg,
            }}
          >
            {Icon && <Icon size={20} color={style.iconColor} />}
          </div>
          {trend && (
            <span
              className="px-2 py-1 rounded-pill"
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                backgroundColor: trendDirection === 'up' ? 'rgba(16, 185, 129, 0.08)' :
                  trendDirection === 'down' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(100, 116, 139, 0.08)',
                color: trendDirection === 'up' ? 'var(--color-success)' :
                  trendDirection === 'down' ? 'var(--color-danger)' : 'var(--color-text-secondary)',
              }}
            >
              {trend}
            </span>
          )}
        </div>

        <div>
          <p
            className="mb-1"
            style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-text-secondary)',
            }}
          >
            {title}
          </p>
          <p
            className="mb-0"
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {value}
          </p>
          {subtitle && (
            <p className="mb-0 mt-1" style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
