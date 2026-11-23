import { STATUS } from '../../data/integrations';

// Neutral status pill. Supports every state in STATUS — but the page only
// ever renders 'supported' and 'cloud_setup' today, since there is no
// live backend to report anything else.
export function StatusPill({ status, className = '' }) {
  const def = STATUS[status] || STATUS.supported;
  return (
    <span className={`ni-pill ni-pill-${def.tone} ${className}`}>
      <span className="ni-pill-dot" aria-hidden="true" />
      {def.label}
    </span>
  );
}
