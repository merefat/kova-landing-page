import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft, ArrowRight, Check, ChevronRight, CircleAlert, CircleCheck,
  Info, ListChecks, RotateCcw, Search, X,
} from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { byGroup, byId, GROUPS } from '../../data/integrations';
import { BrandIcon, iconTone } from './icons';
import { StatusPill } from './StatusPill';

// GuideDrawer — the right-side sheet every tile opens. A small stack of
// views lives inside it: an overview list (all / cloud / services) or a
// step-by-step guide. Guides show one step at a time with Back / Next
// and finish on a "what you get" screen.
//
// Stack item shapes (owned by IntegrationsPage):
//   { kind: 'overview', filter: 'all' | 'cloud' | 'service' }
//   { kind: 'guide', id: '<integration id>' | 'docs' }
export default function GuideDrawer({ stack, onClose, onBack, onGuide, onOverview, onGetStarted, onOpenPage }) {
  const panelRef = useRef(null);
  const reduced = useReducedMotion();
  const open = stack.length > 0;
  const top = stack[stack.length - 1];

  // Modal bookkeeping: freeze the page, and mark the app shell inert so
  // AT and Tab can't reach behind the drawer. Declared BEFORE the focus
  // trap so its cleanup (un-inert) runs first on unmount — otherwise the
  // trap would try to restore focus to an element that is still inert.
  useEffect(() => {
    if (!open) return undefined;
    const root = document.getElementById('root');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (root) root.inert = true;
    return () => {
      document.body.style.overflow = prevOverflow;
      if (root) root.inert = false;
    };
  }, [open]);

  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={`ni-scrim ${reduced ? 'is-still' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="ni-drawer" role="dialog" aria-modal="true" aria-label="Integration setup" ref={panelRef}>
        {stack.length > 1 && (
          <button type="button" className="ni-drawer-back" onClick={onBack}>
            <ArrowLeft size={14} aria-hidden="true" /> Back to list
          </button>
        )}
        <button type="button" className="ni-drawer-close" onClick={onClose} aria-label="Close">
          <X size={18} aria-hidden="true" />
        </button>
        {top.kind === 'overview' ? (
          <DrawerOverview
            key={`ov-${top.filter}`}
            filter={top.filter}
            onGuide={onGuide}
          />
        ) : (
          <DrawerGuide
            key={top.id}
            item={byId(top.id)}
            onGetStarted={onGetStarted}
            onOverview={onOverview}
            onOpenPage={onOpenPage}
          />
        )}
      </div>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------- guide
function DrawerGuide({ item, onGetStarted, onOverview, onOpenPage }) {
  const uid = useId();
  const [methodIdx, setMethodIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);
  const method = item.methods[Math.min(methodIdx, item.methods.length - 1)];
  const steps = method.steps;
  const last = stepIdx === steps.length - 1;
  const multi = item.methods.length > 1;

  const announce = done
    ? `${item.name} — what you get`
    : `Step ${stepIdx + 1} of ${steps.length}: ${steps[stepIdx].title}`;

  const pickMethod = (i) => {
    setMethodIdx(i);
    setStepIdx(0);
    setDone(false);
  };

  const onTabKey = (e, i) => {
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % item.methods.length;
    if (e.key === 'ArrowLeft') n = (i - 1 + item.methods.length) % item.methods.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = item.methods.length - 1;
    if (n !== null) {
      e.preventDefault();
      pickMethod(n);
      e.currentTarget.parentElement.children[n]?.focus();
    }
  };

  const applyNote =
    (method.apply || item.apply) === 'restart'
      ? 'Takes effect when the hub restarts.'
      : 'Saving restarts just this integration — nothing else.';

  return (
    <div className="ni-guide">
      <div className="sr-only" aria-live="polite">{announce}</div>

      <header className="ni-guide-head">
        <span className="ni-guide-icon" data-tone={iconTone(item.id)} aria-hidden="true">
          <BrandIcon icon={item.icon} size={26} tone={iconTone(item.id)} />
        </span>
        <div className="ni-guide-title-wrap">
          <h2 className="ni-guide-title" id={uid} data-autofocus tabIndex={-1}>{item.name}</h2>
          <div className="ni-guide-pills">
            <span className="ni-pill ni-pill-dim">{item.connectionType}</span>
            <StatusPill status={item.status} />
            {onOpenPage && (
              <button
                type="button"
                className="ni-text-link ni-guide-fulllink"
                onClick={() => onOpenPage(item.id)}
              >
                Full guide <ArrowRight size={12} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="ni-guide-scroll">
        <p className="ni-guide-eyebrow">
          Setup guide · {item.setupMethod}
          {multi && item.methodsNote ? ` · ${item.methodsNote}` : ''}
        </p>
        <p className="ni-guide-sum">{item.details || item.summary}</p>

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

        {(item.needs.length > 0 || method.needs?.length > 0) && !done && (
          <div className="ni-needs">
            <span className="ni-needs-label">You&rsquo;ll need</span>
            {[...(item.needs || []), ...(method.needs || [])].map((n) => (
              <span key={n} className="ni-need">{n}</span>
            ))}
          </div>
        )}

        {multi && (
          <div className="ni-tabs" role="tablist" aria-label="Connection method">
            {item.methods.map((m, i) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={i === methodIdx}
                tabIndex={i === methodIdx ? 0 : -1}
                className={`ni-tab ${i === methodIdx ? 'is-active' : ''}`}
                onClick={() => pickMethod(i)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                {m.label}
                {m.tag && <span className="ni-tab-tag">{m.tag}</span>}
              </button>
            ))}
          </div>
        )}

        {!done ? (
          <ol className="ni-steps">
            {steps.map((s, i) => {
              const state = i < stepIdx ? 'done' : i === stepIdx ? 'current' : 'next';
              return (
                <li key={s.title} className={`ni-step ni-step-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
                  <button
                    type="button"
                    className="ni-step-head"
                    onClick={() => setStepIdx(i)}
                    aria-expanded={state === 'current'}
                  >
                    <span className="ni-step-marker" aria-hidden="true">
                      {state === 'done' ? <Check size={12} /> : i + 1}
                    </span>
                    <span className="ni-step-title">{s.title}</span>
                  </button>
                  {state === 'current' && (
                    <div className="ni-step-body">
                      <p>{s.body}</p>
                      {s.code && <code className="ni-code">{s.code}</code>}
                      {s.note && <p className="ni-step-note"><Info size={12} aria-hidden="true" /> {s.note}</p>}
                      {s.links?.map((l) => (
                        <a key={l.url} className="ni-step-link" href={l.url} target="_blank" rel="noopener noreferrer">
                          {l.label} <ChevronRight size={11} aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="ni-done">
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
            <p className="ni-done-apply">
              {applyNote}
              {item.test ? ' The Test button tries the settings without saving.' : ''}
            </p>
            <p className="ni-done-hint">
              Finish the setup inside Kova &rarr; Integrations. Nothing is
              connected from this page.
            </p>
            <div className="ni-done-actions">
              <button type="button" className="ni-btn ni-btn-primary" onClick={onGetStarted}>
                Get Started <ArrowRight size={14} aria-hidden="true" />
              </button>
              <button type="button" className="ni-btn ni-btn-ghost" onClick={() => onOverview?.('all')}>
                Browse all guides
              </button>
            </div>
          </div>
        )}
      </div>

      {!done && (
        <footer className="ni-guide-foot">
          <div className="ni-progress" aria-hidden="true">
            <span className="ni-progress-label">Step {stepIdx + 1} of {steps.length}</span>
            <span className="ni-progress-bar">
              <span className="ni-progress-fill" style={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }} />
            </span>
          </div>
          <div className="ni-guide-btns">
            <button
              type="button"
              className="ni-btn ni-btn-ghost ni-btn-sm"
              onClick={() => (stepIdx === 0 ? setStepIdx(0) : setStepIdx(stepIdx - 1))}
              disabled={stepIdx === 0}
            >
              <ArrowLeft size={13} aria-hidden="true" /> Back
            </button>
            <button type="button" className="ni-btn ni-btn-primary ni-btn-sm" onClick={() => (last ? setDone(true) : setStepIdx(stepIdx + 1))}>
              {last ? 'What you get' : 'Next'} <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>
        </footer>
      )}

      {done && (
        <footer className="ni-guide-foot">
          <button
            type="button"
            className="ni-btn ni-btn-ghost ni-btn-sm"
            onClick={() => { setDone(false); setStepIdx(0); }}
          >
            <RotateCcw size={13} aria-hidden="true" /> Review steps
          </button>
        </footer>
      )}
    </div>
  );
}

// ------------------------------------------------------------- overview
function DrawerOverview({ filter, onGuide }) {
  const [q, setQ] = useState('');
  const groups = useMemo(() => {
    const wanted =
      filter === 'all' ? ['local', 'cloud', 'service'] : [filter];
    return wanted
      .map((g) => ({ meta: GROUPS[g], items: byGroup(g) }))
      .filter((g) => g.items.length);
  }, [filter]);

  const needle = q.trim().toLowerCase();
  const match = (i) =>
    !needle ||
    i.name.toLowerCase().includes(needle) ||
    i.setupMethod.toLowerCase().includes(needle) ||
    i.summary.toLowerCase().includes(needle);

  return (
    <div className="ni-ov">
      <header className="ni-ov-head">
        <h2 className="ni-guide-title" data-autofocus tabIndex={-1}>
          {filter === 'all' ? 'All connections' : filter === 'cloud' ? 'Cloud integrations' : 'Services & more'}
        </h2>
        {filter === 'cloud' && (
          <p className="ni-ov-note">
            <Info size={14} aria-hidden="true" /> These brands have no local
            API — Kova links to their cloud once, then keeps working.
          </p>
        )}
      </header>

      <label className="ni-ov-search">
        <Search size={14} aria-hidden="true" />
        <input
          type="search"
          placeholder="Filter connections…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Filter connections"
        />
      </label>

      <div className="ni-guide-scroll ni-ov-list">
        {groups.map(({ meta, items }) => {
          const shown = items.filter(match);
          if (!shown.length) return null;
          return (
            <div key={meta.id} className="ni-ov-group">
              {filter === 'all' && <p className="ni-ov-group-title">{meta.label}</p>}
              {shown.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="ni-ov-row"
                  onClick={() => onGuide?.(item.id)}
                >
                  <span className="ni-ov-icon" data-tone={iconTone(item.id)} aria-hidden="true">
                    <BrandIcon icon={item.icon} size={19} tone={iconTone(item.id)} />
                  </span>
                  <span className="ni-ov-text">
                    <span className="ni-ov-name">{item.name}</span>
                    <span className="ni-ov-sub">{item.setupMethod}</span>
                  </span>
                  <ChevronRight size={14} className="ni-tile-chev" aria-hidden="true" />
                </button>
              ))}
            </div>
          );
        })}
        {!groups.some(({ items }) => items.some(match)) && (
          <p className="ni-ov-empty">No connections match “{q}”.</p>
        )}
      </div>
    </div>
  );
}
