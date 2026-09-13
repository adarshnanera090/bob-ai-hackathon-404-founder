import React from 'react';
import { 
  Server, 
  ShieldCheck, 
  Flame, 
  AlertOctagon, 
  Activity 
} from 'lucide-react';
import { NODE_STATUS } from '../types/immuneTypes';

export default function NodeStatusCard({ node, isSelected, onSelect }) {
  const isQuarantined = node.status === NODE_STATUS.QUARANTINED;
  const isInfected = node.status === NODE_STATUS.INFECTED;
  const isImmune = node.status === NODE_STATUS.IMMUNE;

  const getStatusBadge = () => {
    if (isInfected) return <span className="bio-btn badge-infected" style={{ padding: '2px 7px', fontSize: '0.66rem' }}>Infected</span>;
    if (isQuarantined) return <span className="bio-btn badge-quarantined" style={{ padding: '2px 7px', fontSize: '0.66rem' }}>Quarantined</span>;
    if (isImmune) return <span className="bio-btn badge-immune" style={{ padding: '2px 7px', fontSize: '0.66rem' }}>Immune (IgG)</span>;
    return <span className="bio-btn badge-healthy" style={{ padding: '2px 7px', fontSize: '0.66rem' }}>Healthy</span>;
  };

  return (
    <div
      onClick={() => onSelect(node.id)}
      className="glass-panel"
      style={{
        padding: '12px 14px',
        cursor: 'pointer',
        border: isSelected ? '1.5px solid #6366f1' : '1px solid var(--border-subtle)',
        boxShadow: isSelected ? '0 0 0 2px rgba(99, 102, 241, 0.25), 0 4px 16px rgba(0, 0, 0, 0.4)' : 'none',
        transition: 'all 0.18s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
            {node.name}
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {node.ip} • {node.role}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Mini Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.68rem', marginTop: '6px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '3px 6px', borderRadius: '4px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Anomaly: </span>
          <span style={{ fontWeight: 700, color: node.anomalyScore > 50 ? '#f43f5e' : '#10b981' }}>
            {node.anomalyScore.toFixed(1)}%
          </span>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '3px 6px', borderRadius: '4px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Entropy: </span>
          <span style={{ fontWeight: 700, color: node.biomarkers?.entropy > 0.5 ? '#f59e0b' : '#94a3b8' }}>
            {node.biomarkers?.entropy?.toFixed(2) || '0.12'}
          </span>
        </div>
      </div>

      {/* Shield status */}
      {node.memoryShields && node.memoryShields.length > 0 && (
        <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.62rem', color: '#c084fc' }}>
          <ShieldCheck size={11} />
          <span>Active: {node.memoryShields.join(', ')}</span>
        </div>
      )}
    </div>
  );
}
