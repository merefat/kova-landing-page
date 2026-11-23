import { useState } from 'react';
import { ArrowRight, Plus, Crown, RotateCcw } from 'lucide-react';
import FeatureCard, { CardText } from '../FeatureCard';
import SceneStage from '../SceneStage';
import { FI } from '../../../data/featureImages';

// 05 — Family & Access. Selectable avatars, role switching (Owner locked),
// inline add-member form, reset to defaults.
const INITIAL = [
  { id: 'you', name: 'You', role: 'Owner' },
  { id: 'maya', name: 'Maya', role: 'Member' },
  { id: 'leo', name: 'Leo', role: 'Guest' },
];

const ROLE_DESC = {
  Owner: 'Full access, settings and permissions — owner roles can\u2019t change in the demo',
  Member: 'Control devices and scenes, manage own rooms and routines',
  Guest: 'Limited access — basic controls and shared spaces only',
};

const AVATAR_TONES = ['av-a', 'av-b', 'av-c', 'av-d'];

export default function FamilyCard() {
  const [members, setMembers] = useState(INITIAL);
  const [sel, setSel] = useState('you');
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  const selected = members.find((m) => m.id === sel) ?? members[0];

  const reset = () => {
    setMembers(INITIAL);
    setSel('you');
    setAdding(false);
    setName('');
  };

  const addMember = (e) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) return;
    const id = `m-${Date.now()}`;
    setMembers((m) => [...m, { id, name: clean, role: 'Member' }]);
    setSel(id);
    setAdding(false);
    setName('');
  };

  const setRole = (role) =>
    setMembers((m) => m.map((x) => (x.id === sel ? { ...x, role } : x)));

  const dirty = members !== INITIAL || sel !== 'you' || adding;

  // "Explore Access" selects the next member so the role panel visibly changes.
  const explore = () => {
    const i = members.findIndex((m) => m.id === sel);
    setSel(members[(i + 1) % members.length].id);
  };

  return (
    <FeatureCard id="fc-05" className="family-card">
      <SceneStage image={FI.familyRoom} />

      <div className="fc-inner">
        <CardText
          num="05"
          title="Family &amp; Access"
          desc="A home for everyone. Manage family members, set permissions and keep everyone connected safely."
        >
          {dirty ? (
            <button type="button" className="outline-gold fc-cta" onClick={reset}>
              Reset <RotateCcw size={13} />
            </button>
          ) : (
            <button type="button" className="outline-gold fc-cta" onClick={explore}>
              Explore Access <ArrowRight size={13} />
            </button>
          )}
        </CardText>

        <div className="fc-demo">
          <div className="fam-panel glass-panel">
            <ul className="fam-avatars">
              {members.map((m, i) => (
                <li key={m.id}>
                  <button
                    type="button"
                    className={`fam-av ${AVATAR_TONES[i % AVATAR_TONES.length]} ${sel === m.id ? 'sel' : ''}`}
                    onClick={() => setSel(m.id)}
                    aria-pressed={sel === m.id}
                  >
                    {m.name[0]}
                  </button>
                  <span className="fam-name">{m.name}</span>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="fam-av fam-add"
                  onClick={() => setAdding((v) => !v)}
                  aria-label="Add member"
                >
                  <Plus size={17} />
                </button>
                <span className="fam-name">Add Member</span>
              </li>
            </ul>

            {adding && (
              <form className="fam-form" onSubmit={addMember}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Member name"
                  aria-label="Member name"
                />
                <button type="submit" className="outline-gold">Add</button>
              </form>
            )}

            <div className="fam-detail">
              <p className="fam-detail-line">
                <strong>{selected.name}</strong>
                {selected.role === 'Owner' && (
                  <span className="fam-owner"><Crown size={10} /> {selected.name}</span>
                )}
                <span className="fam-role">{selected.role}</span>
              </p>
              {selected.role !== 'Owner' && (
                <div className="fam-roles" role="group" aria-label="Change role">
                  {['Member', 'Guest'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`fam-role-btn ${selected.role === r ? 'active' : ''}`}
                      onClick={() => setRole(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
              <p className="fam-desc">{ROLE_DESC[selected.role]}</p>
            </div>
          </div>
        </div>
      </div>
    </FeatureCard>
  );
}
