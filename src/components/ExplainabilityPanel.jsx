import React from 'react';
import { 
  Dna, 
  Activity, 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  Info,
  Layers,
  Cpu
} from 'lucide-react';
import { NODE_STATUS } from '../types/immuneTypes';

export default function ExplainabilityPanel({ selectedNode, antibodies }) {
  if (!selectedNode) {
    return (
      <div className="glass-panel" style={{ padding: '20px', color: 'var(--text-muted)', textAlign: 'center' }}>
        Select a node from the topology to inspect behavioral telemetry.
      </div>
    );
  }

  const isQuarantined = selectedNode.status === NODE_STATUS.QUARANTINED;
  const isInfected = selectedNode.status === NODE_STATUS.INFECTED;
  const isImmune = selectedNode.status === NODE_STATUS.IMMUNE;

  const activeAntibody = antibodies.find((ab) =>
    selectedNode.memoryShields.includes(ab.id)
  ) || (antibodies.length > 0 ? antibodies[0] : null);

  const biomarkerFeatures = [
    {
      name: 'Process Fork Anomaly',
      value: isInfected || isQuarantined ? 42 : 4,
      unit: '+42% drift',
      color: '#f43f5e',
      desc: 'Rapid execution spawn exceeding expected Gaussian baseline',
    },
    {
      name: 'Socket Egress Entropy',
      value: isInfected || isQuarantined ? 31 : 8,
      unit: '+31% drift',
      color: '#fb7185',
      desc: 'High-entropy payload bursts across unwhitelisted egress ports',
    },
    {
      name: 'Filesystem Mutation Rate',
      value: isInfected || isQuarantined ? 18 : 3,
      unit: '+18% drift',
      color: '#f59e0b',
      desc: 'Bulk rewrite of file descriptors in user directories',
    },
    {
      name: 'Syscall Deviation (pTrace/eBPF)',
      value: isInfected || isQuarantined ? 9 : 2,
      unit: '+9% drift',
      color: '#8b5cf6',
      desc: 'Disallowed system calls attempting ring-0 capability escalation',
    },
  ];

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Dna size={17} color="#a5b4fc" />
          <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff' }}>
            Bio-Explainability & Biomarkers
          </h3>
        </div>
        <span style={{
          fontSize: '0.66rem',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: '9999px',
          background: 'rgba(99, 102, 241, 0.1)',
          color: '#a5b4fc',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}>
          SHAP Telemetry
        </span>
      </div>

      {/* Selected Node Profile */}
      <div style={{
        padding: '12px 14px',
        borderRadius: '10px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
            {selectedNode.name}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>{selectedNode.ip}</span>
            <span>•</span>
            <span>{selectedNode.role}</span>
          </div>
        </div>

        <span className={`bio-btn ${
          isInfected ? 'badge-infected' : isQuarantined ? 'badge-quarantined' : isImmune ? 'badge-immune' : 'badge-healthy'
        }`} style={{ padding: '3px 8px', fontSize: '0.72rem', textTransform: 'uppercase', cursor: 'default' }}>
          {selectedNode.status}
        </span>
      </div>

      {/* Receptor Anomaly Score Breakdown */}
      <div style={{
        padding: '14px',
        borderRadius: '10px',
        background: 'rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} color="#a5b4fc" />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>
              Receptor Anomaly Score
            </span>
          </div>
          <span style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: selectedNode.anomalyScore > 50 ? '#f43f5e' : selectedNode.anomalyScore > 20 ? '#f59e0b' : '#10b981',
          }}>
            {selectedNode.anomalyScore.toFixed(1)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.min(selectedNode.anomalyScore, 100)}%`,
            background: selectedNode.anomalyScore > 50
              ? 'linear-gradient(90deg, #f59e0b, #f43f5e)'
              : 'linear-gradient(90deg, #10b981, #6366f1)',
            borderRadius: '9999px',
            transition: 'width 0.4s ease',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.66rem', color: 'var(--text-muted)' }}>
          <span>Homeostasis Threshold (15%)</span>
          <span>Quarantine Trigger (80%)</span>
        </div>
      </div>

      {/* SHAP Behavioral Drift Attribution */}
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
          Biomarker Drift Attribution (Why It Triggered)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {biomarkerFeatures.map((feat, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.72rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#fff', fontWeight: 500 }}>{feat.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: feat.color, fontWeight: 700 }}>
                  {feat.unit}
                </span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${feat.value * 2}%`,
                  background: feat.color,
                  borderRadius: '9999px',
                }} />
              </div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                {feat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Digital Antibody & eBPF Neutralization Rule */}
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        background: 'rgba(139, 92, 246, 0.07)',
        border: '1px solid rgba(139, 92, 246, 0.22)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <ShieldCheck size={15} color="#c084fc" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e9d5ff' }}>
            Digital Antibody Defense Rule
          </span>
        </div>

        {activeAntibody ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Signature: <b style={{ color: '#c084fc' }}>{activeAntibody.id}</b></span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#a5b4fc' }}>{activeAntibody.signatureHash}</span>
            </div>
            <pre style={{
              padding: '8px',
              borderRadius: '6px',
              background: 'rgba(5, 8, 17, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#34d399',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              margin: '6px 0',
            }}>
              {activeAntibody.eBpfRule}
            </pre>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
              Intercept Latency: <b style={{ color: '#fff' }}>3.4ms</b> • Memory B-Cell Filter: <b style={{ color: '#c084fc' }}>Active in Kernel Ring</b>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No antibody synthesized for this node yet. Trigger an attack above to observe autonomous generation.
          </div>
        )}
      </div>

      {/* Zero Human In the Loop Proof */}
      <div style={{
        padding: '10px 12px',
        borderRadius: '8px',
        background: 'rgba(16, 185, 129, 0.06)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <CheckCircle2 size={16} color="#34d399" />
        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          <b style={{ color: '#fff' }}>Autonomous Containment:</b> System isolates and broadcasts antibody without human escalation tickets or SOC analyst delay.
        </div>
      </div>
    </div>
  );
}
