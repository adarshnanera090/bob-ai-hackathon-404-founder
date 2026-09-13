import React, { useState } from 'react';
import { 
  Flame, 
  ShieldCheck, 
  RotateCcw, 
  Zap, 
  Skull, 
  ArrowRight, 
  Dna,
  CheckCircle2,
  Terminal,
  Crosshair
} from 'lucide-react';
import { ATTACK_CATALOG, NODE_STATUS } from '../types/immuneTypes';

export default function AttackTriggerDeck({
  nodes,
  antibodies,
  onTriggerAttack,
  onTriggerSecondaryAttack,
  onTriggerSelfHeal,
  attackInProgress,
}) {
  const [selectedTargetNode, setSelectedTargetNode] = useState('node-beta');
  const [selectedAttackKey, setSelectedAttackKey] = useState(ATTACK_CATALOG[0].id);

  const currentAttack =
    ATTACK_CATALOG.find((a) => a.id === selectedAttackKey) || ATTACK_CATALOG[0];

  const quarantinedNodes = nodes.filter((n) => n.status === NODE_STATUS.QUARANTINED);
  const immuneNodes = nodes.filter((n) => n.status === NODE_STATUS.IMMUNE);

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Deck Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crosshair size={17} color="#a5b4fc" />
          <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff' }}>
            Swarm Attack Controller
          </h3>
        </div>
        <span style={{
          fontSize: '0.66rem',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
        }}>
          Live Pitch Mode
        </span>
      </div>

      {/* Target & Vector Pickers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {/* Node Target Select */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Target Node
          </label>
          <select
            value={selectedTargetNode}
            onChange={(e) => setSelectedTargetNode(e.target.value)}
            disabled={attackInProgress}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              background: 'rgba(5, 8, 17, 0.95)',
              border: '1px solid var(--border-medium)',
              color: '#fff',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name.split(' ')[0]} ({n.status})
              </option>
            ))}
          </select>
        </div>

        {/* Pathogen Type Select */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Pathogen Vector
          </label>
          <select
            value={selectedAttackKey}
            onChange={(e) => setSelectedAttackKey(e.target.value)}
            disabled={attackInProgress}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              background: 'rgba(5, 8, 17, 0.95)',
              border: '1px solid var(--border-medium)',
              color: '#fda4af',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {ATTACK_CATALOG.map((atk) => (
              <option key={atk.id} value={atk.id}>
                {atk.name.split('(')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vector Details Snippet */}
      <div style={{
        padding: '10px 12px',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.74rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '3px' }}>
          <span style={{ fontWeight: 600 }}>Vector Signature:</span>
          <span style={{ color: '#fb7185', fontWeight: 700, fontSize: '0.68rem' }}>{currentAttack.severity} LEVEL</span>
        </div>
        <div style={{ color: 'var(--text-secondary)' }}>{currentAttack.description}</div>
      </div>

      {/* Stage Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Step 1: Trigger Attack */}
        <button
          onClick={() => onTriggerAttack(selectedTargetNode, selectedAttackKey)}
          disabled={attackInProgress}
          className="bio-btn bio-btn-threat"
          style={{
            padding: '11px 16px',
            fontSize: '0.86rem',
            width: '100%',
            opacity: attackInProgress ? 0.6 : 1,
            cursor: attackInProgress ? 'not-allowed' : 'pointer',
            justifyContent: 'flex-start',
          }}
        >
          <span style={{
            padding: '2px 7px',
            borderRadius: '4px',
            background: 'rgba(0, 0, 0, 0.25)',
            fontSize: '0.72rem',
            fontWeight: 800,
          }}>
            1
          </span>
          <Skull size={16} />
          <span style={{ fontWeight: 700 }}>Inject Pathogen & Observe Immune Cycle</span>
        </button>

        {/* Step 2: Test Secondary Immunity */}
        <button
          onClick={() => {
            const peer =
              nodes.find((n) => n.id !== selectedTargetNode && n.status === NODE_STATUS.IMMUNE) ||
              nodes.find((n) => n.id !== selectedTargetNode) ||
              nodes[0];
            onTriggerSecondaryAttack(peer.id, selectedAttackKey);
          }}
          disabled={attackInProgress || antibodies.length === 0}
          className="bio-btn bio-btn-purple"
          style={{
            padding: '11px 16px',
            fontSize: '0.86rem',
            width: '100%',
            opacity: attackInProgress || antibodies.length === 0 ? 0.5 : 1,
            cursor: attackInProgress || antibodies.length === 0 ? 'not-allowed' : 'pointer',
            justifyContent: 'flex-start',
          }}
          title={antibodies.length === 0 ? 'Generate an antibody first via Step 1' : 'Attack an immunized node to prove instant deflection'}
        >
          <span style={{
            padding: '2px 7px',
            borderRadius: '4px',
            background: 'rgba(0, 0, 0, 0.25)',
            fontSize: '0.72rem',
            fontWeight: 800,
          }}>
            2
          </span>
          <ShieldCheck size={16} />
          <span style={{ fontWeight: 700 }}>Fire Duplicate Attack on Peer (Prove Immunity)</span>
        </button>

        {/* Step 3: Self-Healing Rollback */}
        <button
          onClick={() => {
            const nodeToHeal = quarantinedNodes[0] || nodes.find((n) => n.id === selectedTargetNode);
            if (nodeToHeal) onTriggerSelfHeal(nodeToHeal.id);
          }}
          disabled={attackInProgress || quarantinedNodes.length === 0}
          className="bio-btn bio-btn-green"
          style={{
            padding: '10px 16px',
            fontSize: '0.84rem',
            width: '100%',
            opacity: attackInProgress || quarantinedNodes.length === 0 ? 0.5 : 1,
            cursor: attackInProgress || quarantinedNodes.length === 0 ? 'not-allowed' : 'pointer',
            justifyContent: 'flex-start',
          }}
        >
          <span style={{
            padding: '2px 7px',
            borderRadius: '4px',
            background: 'rgba(0, 0, 0, 0.25)',
            fontSize: '0.72rem',
            fontWeight: 800,
          }}>
            3
          </span>
          <RotateCcw size={15} />
          <span style={{ fontWeight: 700 }}>Autonomous Snapshot Rollback ({quarantinedNodes.length} Quarantined)</span>
        </button>
      </div>

      {/* Cycle Indicator */}
      <div style={{
        marginTop: '4px',
        padding: '10px 12px',
        borderRadius: '8px',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
          5-Stage Autonomous Biological Sequence
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 600 }}>
          <span style={{ color: '#fb7185' }}>Ingress</span>
          <ArrowRight size={11} color="var(--text-muted)" />
          <span style={{ color: '#f59e0b' }}>T-Cell</span>
          <ArrowRight size={11} color="var(--text-muted)" />
          <span style={{ color: '#fbbf24' }}>Quarantine</span>
          <ArrowRight size={11} color="var(--text-muted)" />
          <span style={{ color: '#a5b4fc' }}>Antibody</span>
          <ArrowRight size={11} color="var(--text-muted)" />
          <span style={{ color: '#c084fc' }}>P2P Herd</span>
        </div>
      </div>
    </div>
  );
}
