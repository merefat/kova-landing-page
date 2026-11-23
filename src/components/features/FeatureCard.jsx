// Feature card shell — photo-backed card (SceneStage fills it), .fc-inner
// holds the copy column plus the demo-widget column.
export default function FeatureCard({ id, wide, className = '', children }) {
  return (
    <article
      className={`feature-card ${wide ? 'fc-wide' : 'fc-half'} ${className}`}
      id={id}
    >
      {children}
    </article>
  );
}

export function CardText({ num, title, desc, children }) {
  return (
    <div className="fc-text">
      <div className="fc-head">
        <span className="fc-num" aria-hidden="true">{num}</span>
        <h3 className="fc-title">{title}</h3>
      </div>
      <p className="fc-desc">{desc}</p>
      {children}
    </div>
  );
}
