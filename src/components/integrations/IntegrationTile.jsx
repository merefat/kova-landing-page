import { ChevronRight } from 'lucide-react';
import { BrandIcon, iconTone } from './icons';

// One local-integration tile in the workspace grid. Whole tile is the
// button; the chevron is decorative.
export default function IntegrationTile({ item, onGuide }) {
  return (
    <button
      type="button"
      className="ni-tile"
      data-integral={item.id}
      onClick={() => onGuide?.(item.id)}
      title={`${item.name} — ${item.setupMethod}`}
      aria-label={`${item.name} setup guide`}
    >
      <span className="ni-tile-icon" data-tone={iconTone(item.id)} aria-hidden="true">
        <BrandIcon icon={item.icon} size={22} tone={iconTone(item.id)} />
      </span>
      <span className="ni-tile-name">{item.name}</span>
      <span className="ni-tile-sub">{item.setupMethod}</span>
      <ChevronRight size={13} className="ni-tile-chev" aria-hidden="true" />
    </button>
  );
}
