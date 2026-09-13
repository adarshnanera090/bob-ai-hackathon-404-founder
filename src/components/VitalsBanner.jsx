import React from 'react';
import { 
  ShieldCheck, 
  Dna, 
  Zap, 
  Clock, 
  Flame, 
  CheckCircle2, 
  TrendingUp,
  Activity
} from 'lucide-react';

export default function VitalsBanner({ metrics, antibodiesCount, neutralizedCount }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
      gap: '14px',
      padding: '18px 24px 6px 24px',
    }}>
      {/* 1. Herd Immunity */}
      <div className="glass-panel" style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Swarm Herd Immunity
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '2px', color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ color: metrics.herdImmunityPercent > 0 ? '#c084fc' : '#fff' }}>
                {metrics.herdImmunityPercent}%
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                {metrics.immuneNodes}/{metrics.totalNodes} Nodes
              </span>
            </div>
          </div>
          <div style={{
            padding: '7px',
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.12)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
          }}>
            <ShieldCheck size={17} color="#c084fc" />
          </div>
        </div>

        <div style={{ marginTop: '12px', height: '4px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${metrics.herdImmunityPercent}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            borderRadius: '9999px',
            transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </div>
      </div>

      {/* 2. Autonomous MTTR */}
      <div className="glass-panel" style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Autonomous MTTR
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '2px', color: '#10b981', letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span>{metrics.autonomousMTTR}</span>
              <span style={{
                fontSize: '0.66rem',
                fontWeight: 600,
                color: '#f43f5e',
                background: 'rgba(244, 63, 94, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(244, 63, 94, 0.2)',
              }}>
                vs 197d Human SOC
              </span>
            </div>
          </div>
          <div style={{
            padding: '7px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
          }}>
            <Zap size={17} color="#34d399" />
          </div>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '10px' }}>
          Zero-human ticket lag • Local containment in &lt;120ms
        </div>
      </div>

      {/* 3. Antibodies Circulating */}
      <div className="glass-panel" style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Digital Antibodies
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '2px', color: '#fff', letterSpacing: '-0.02em' }}>
              <span style={{ color: '#a5b4fc' }}>{antibodiesCount}</span>
              <span style={{ fontSize: '0.74rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '6px' }}>
                Signatures Active
              </span>
            </div>
          </div>
          <div style={{
            padding: '7px',
            borderRadius: '8px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
          }}>
            <Dna size={17} color="#a5b4fc" />
          </div>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '10px' }}>
          P2P eBPF signatures in kernel memory rings
        </div>
      </div>

      {/* 4. Instant Deflections */}
      <div className="glass-panel" style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Memory Deflections (4ms)
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '2px', color: '#c084fc', letterSpacing: '-0.02em' }}>
              <span>{neutralizedCount}</span>
              <span style={{ fontSize: '0.74rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '6px' }}>
                Auto-Neutralized
              </span>
            </div>
          </div>
          <div style={{
            padding: '7px',
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.12)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
          }}>
            <CheckCircle2 size={17} color="#c084fc" />
          </div>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '10px' }}>
          Second-time attacks auto-dropped at perimeter
        </div>
      </div>

      {/* 5. Active Inflammations */}
      <div className="glass-panel" style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Inflammatory Barriers
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '2px', color: metrics.quarantinedNodes > 0 ? '#fbbf24' : '#fff', letterSpacing: '-0.02em' }}>
              <span>{metrics.quarantinedNodes}</span>
              <span style={{ fontSize: '0.74rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '6px' }}>
                Quarantined
              </span>
            </div>
          </div>
          <div style={{
            padding: '7px',
            borderRadius: '8px',
            background: metrics.quarantinedNodes > 0 ? 'rgba(245, 158, 11, 0.14)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${metrics.quarantinedNodes > 0 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
          }}>
            <Flame size={17} color={metrics.quarantinedNodes > 0 ? '#fbbf24' : 'var(--text-muted)'} />
          </div>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '10px' }}>
          Isolated sandboxes preventing lateral pivot
        </div>
      </div>
    </div>
  );
}
