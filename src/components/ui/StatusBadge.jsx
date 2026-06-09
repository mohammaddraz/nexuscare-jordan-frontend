import { Badge as BsBadge } from 'react-bootstrap';

/**
 * StatusBadge — Consistent status indicator (DRY)
 * Used across claims, enrollments, registrations
 * 
 * @param {string} status - Status text
 * @param {string} size - 'sm' | 'md'
 */

const statusColorMap = {
  // Claims
  'Paid': { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  'Pending': { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  'Rejected': { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  'In Review': { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },

  // Registration / Enrollment
  'Approved': { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  'Active': { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  'Inactive': { bg: '#f8fafc', color: '#94a3b8', border: '#e2e8f0' },

  // Default
  'default': { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' },
};

function StatusBadge({ status, size = 'md' }) {
  const colors = statusColorMap[status] || statusColorMap['default'];
  const fontSize = size === 'sm' ? '0.55rem' : '0.625rem';
  const padding = size === 'sm' ? '0.2em 0.5em' : '0.3em 0.7em';

  return (
    <span
      className="rounded-pill d-inline-flex align-items-center"
      style={{
        fontSize,
        fontWeight: 700,
        padding,
        backgroundColor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        letterSpacing: '0.02em',
      }}
    >
      <span
        className="rounded-circle me-1"
        style={{
          width: 6,
          height: 6,
          display: 'inline-block',
          backgroundColor: colors.color,
        }}
      />
      {status}
    </span>
  );
}

export default StatusBadge;
