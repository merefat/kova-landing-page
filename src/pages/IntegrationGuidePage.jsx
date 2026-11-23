import { useEffect } from 'react';
import {
  ArrowLeft, ArrowRight, ChevronRight, CircleAlert, CircleCheck,
  Info, ListChecks,
} from 'lucide-react';
import { byId, GROUPS } from '../data/integrations';
import { BrandIcon, iconTone } from '../components/integrations/icons';
import { StatusPill } from '../components/integrations/StatusPill';

// /integrations/<id> — the full-page version of a setup guide. Same data
// as the drawer (src/data/integrations.js), but every connection method
// and every step is laid out at once. Reuses the ni-guide-* styles; the
// page-only layout lives in styles/ni-page.css.
export default function IntegrationGuidePage({ id, onNavigate, onStart }) {
  const item = byId(id);

  useEffect(() => {
    const prev = document.title;
    document.title = item ? `${item.name} — Kova` : 'Integrations — Kova';
    return () => { document.title = prev; };
  }, [item]);

  if (!item) {
    return (
      <div className="ni-page container ni-page-missing">
        <p className="ni-guide-eyebrow">Setup guide</p>
        <h1 className="ni-page-missing-title">No guide for &ldquo;{id}&rdquo;</h1>
        <p className="ni-guide-sum">That connection doesn&rsquo;t exist — pick one from the integrations page.</p>
        <button type="button" className="ni-btn ni-btn-primary" onClick={() => onNavigate?.('/integrations')}>
          <ArrowLeft size={14} aria-hidden="true" /> All integrations
        </button>
      </div>
    );
  }

  const group = GROUPS[item.group];
  const applyNote =
    item.apply === 'restart'
      ? 'Takes effect when the hub restarts.'
      : 'Saving restarts just this integration — nothing else.';
  const testNote = item.test ? ' The Test button tries the settings without saving.' : '';
  const methodApply = (m) =>
    (m.apply || item.apply) === 'restart'
      ? 'Takes effect when the hub restarts.'
      : 'Saving restarts just this integration — nothing else.';

  return (
    <div className="ni-page container">
      <button type="button" className="ni-page-back" onClick={() => onNavigate?.('/integrations')}>
        <ArrowLeft size={14} aria-hidden="true" /> All integrations
      </button>

      <header className="ni-guide-head ni-page-head">
        <span className="ni-guide-icon" data-tone={iconTone(item.id)} aria-hidden="true">
          <BrandIcon icon={item.icon} size={26} tone={iconTone(item.id)} />
        </span>
        <div className="ni-guide-title-wrap">
          <h1 className="ni-guide-title ni-page-title">{item.name}</h1>
          <div className="ni-guide-pills">
            <span className="ni-pill ni-pill-dim">{item.connectionType}</span>
            <StatusPill status={item.status} />
            {group && <span className="ni-pill ni-pill-dim">{group.label}</span>}
          </div>
        </div>
      </header>

      <p className="ni-guide-eyebrow ni-page-eyebrow">Setup guide · {item.setupMethod}</p>
      <p className="ni-guide-sum ni-page-sum">{item.details || item.summary}</p>

      {item.warning && (
        <p className={`ni-banner ni-banner-${item.warning.tone}`}>
          <CircleAlert size={15} aria-hidden="true" /> {item.warning.text}
        </p>
      )}
      {item.guideNote && (
        <p className="ni-banner ni-banner-blue">
          <Info size={15} aria-hidden="true" /> {item.guideNote}
        </p>
      )}

      {item.needs.length > 0 && (
        <div className="ni-needs ni-page-needs">
          <span className="ni-needs-label">You&rsquo;ll need</span>
          {item.needs.map((n) => (
            <span key={n} className="ni-need">{n}</span>
          ))}
        </div>
      )}

      {item.methods.map((m) => (
        <section key={m.id} className="ni-page-method ni-panel">
          <header className="ni-page-method-head">
            <h2 className="ni-page-method-title">
              {m.label}
              {m.tag && <span className="ni-tab-tag">{m.tag}</span>}
            </h2>
            {m.needs?.length > 0 && (
              <div className="ni-needs ni-page-method-needs">
                <span className="ni-needs-label">Needs</span>
                {m.needs.map((n) => (
                  <span key={n} className="ni-need">{n}</span>
                ))}
              </div>
            )}
            <p className="ni-page-method-apply">{methodApply(m)}</p>
          </header>

          <ol className="ni-psteps">
            {m.steps.map((s, i) => (
              <li key={s.title} className="ni-pstep">
                <span className="ni-pstep-marker" aria-hidden="true">{i + 1}</span>
                <div className="ni-pstep-body">
                  <h3 className="ni-pstep-title">{s.title}</h3>
                  <p>{s.body}</p>
                  {s.code && <code className="ni-code">{s.code}</code>}
                  {s.note && (
                    <p className="ni-step-note"><Info size={12} aria-hidden="true" /> {s.note}</p>
                  )}
                  {s.links?.map((l) => (
                    <a key={l.url} className="ni-step-link" href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.label} <ChevronRight size={11} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className="ni-page-gets ni-panel">
        <p className="ni-done-head">
          <CircleCheck size={16} aria-hidden="true" /> What you get
        </p>
        {item.gets.length > 0 ? (
          <ul className="ni-done-list">
            {item.gets.map((g) => <li key={g}>{g}</li>)}
          </ul>
        ) : (
          <p className="ni-done-sum">{item.summary}</p>
        )}
        {item.rules && (
          <>
            <p className="ni-done-head ni-done-head-2">
              <ListChecks size={15} aria-hidden="true" /> Rules you can toggle
            </p>
            <ul className="ni-done-list ni-done-rules">
              {item.rules.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </>
        )}
        <p className="ni-done-apply">{applyNote}{testNote}</p>
        <p className="ni-done-hint">
          Finish the setup inside Kova &rarr; Integrations. Nothing is
          connected from this page.
        </p>
        <div className="ni-done-actions">
          <button type="button" className="ni-btn ni-btn-primary" onClick={onStart}>
            Get Started <ArrowRight size={14} aria-hidden="true" />
          </button>
          <button type="button" className="ni-btn ni-btn-ghost" onClick={() => onNavigate?.('/integrations')}>
            Browse all guides
          </button>
        </div>
      </section>
    </div>
  );
}
