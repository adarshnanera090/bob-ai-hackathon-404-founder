import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Flame, 
  Cpu, 
  Activity,
  Layers,
  Sparkles,
  Crosshair,
  Server
} from 'lucide-react';
import { NETWORK_LINKS, NODE_STATUS } from '../types/immuneTypes';

export default function NetworkTopology({
  nodes,
  selectedNodeId,
  onSelectNode,
  attackInProgress,
  currentAttackStep,
}) {
  const [showWbcPatrol, setShowWbcPatrol] = useState(true);
  const containerRef = useRef(null);

  const getNode = (id) => nodes.find((n) => n.id === id);

  return (
    <div className="glass-panel" style={{
      position: 'relative',
      height: '520px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Topology Header Bar */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(9, 13, 22, 0.75)',
        backdropFilter: 'blur(12px)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={16} color="#a5b4fc" />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
            Distributed Lymphatic Mesh Topology
          </span>
          <span style={{
            fontSize: '0.68rem',
            padding: '2px 8px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
          }}>
            8 Cellular Endpoints
          </span>
        </div>

        {/* Legend & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setShowWbcPatrol(!showWbcPatrol)}
            className="bio-btn bio-btn-subtle"
            style={{ padding: '4px 10px', fontSize: '0.74rem', borderRadius: '6px' }}
          >
            <Sparkles size={13} color={showWbcPatrol ? '#a5b4fc' : '#64748b'} />
            <span>{showWbcPatrol ? 'T-Cell Patrol: ON' : 'T-Cell Patrol: OFF'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} /> Healthy
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f43f5e' }} /> Infected
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b' }} /> Quarantined
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c084fc' }} /> Immune (IgG)
            </span>
          </div>
        </div>
      </div>

      {/* Live Stage Progress Indicator Banner */}
      {currentAttackStep && (
        <div style={{
          position: 'absolute',
          top: '56px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 25,
          padding: '8px 18px',
          borderRadius: '9999px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(99, 102, 241, 0.25)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px #6366f1' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
            {currentAttackStep}
          </span>
        </div>
      )}

      {/* Living Canvas Area */}
      <div 
        ref={containerRef}
        style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #070a10 0%, #0a0e17 100%)',
        }}
      >
        {/* Subtle grid dots for depth */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }} />

        {/* SVG Synaptic Link Network */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {NETWORK_LINKS.map(([idA, idB], index) => {
            const nodeA = getNode(idA);
            const nodeB = getNode(idB);
            if (!nodeA || !nodeB) return null;

            const isQuarantined =
              nodeA.status === NODE_STATUS.QUARANTINED || nodeB.status === NODE_STATUS.QUARANTINED;
            const isInfected =
              nodeA.status === NODE_STATUS.INFECTED || nodeB.status === NODE_STATUS.INFECTED;
            const isImmuneLink =
              nodeA.status === NODE_STATUS.IMMUNE && nodeB.status === NODE_STATUS.IMMUNE;

            let strokeColor = 'rgba(255, 255, 255, 0.1)';
            let strokeDasharray = 'none';
            let strokeWidth = 1.4;

            if (isQuarantined) {
              strokeColor = 'rgba(245, 158, 11, 0.35)';
              strokeDasharray = '3 5';
              strokeWidth = 1.2;
            } else if (isInfected) {
              strokeColor = 'rgba(244, 63, 94, 0.4)';
              strokeWidth = 1.8;
            } else if (isImmuneLink) {
              strokeColor = 'rgba(139, 92, 246, 0.4)';
              strokeWidth = 1.8;
            }

            return (
              <g key={`link-${idA}-${idB}-${index}`}>
                <line
                  x1={`${nodeA.x}%`}
                  y1={`${nodeA.y}%`}
                  x2={`${nodeB.x}%`}
                  y2={`${nodeB.y}%`}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                />

                {/* Patrol Particle */}
                {showWbcPatrol && !isQuarantined && (
                  <circle r={isImmuneLink ? 2.5 : 2} fill={isImmuneLink ? '#c084fc' : '#a5b4fc'}>
                    <animateMotion
                      path={`M ${nodeA.x * 10} ${nodeA.y * 5} L ${nodeB.x * 10} ${nodeB.y * 5}`}
                      dur={`${3.8 + (index % 4) * 0.7}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Node Entities */}
        {nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          const isQuarantined = node.status === NODE_STATUS.QUARANTINED;
          const isInfected = node.status === NODE_STATUS.INFECTED;
          const isImmune = node.status === NODE_STATUS.IMMUNE;

          let statusColor = '#10b981';
          let statusBg = 'rgba(16, 185, 129, 0.12)';
          if (isInfected) {
            statusColor = '#f43f5e';
            statusBg = 'rgba(244, 63, 94, 0.16)';
          } else if (isQuarantined) {
            statusColor = '#f59e0b';
            statusBg = 'rgba(245, 158, 11, 0.16)';
          } else if (isImmune) {
            statusColor = '#8b5cf6';
            statusBg = 'rgba(139, 92, 246, 0.16)';
          }

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              style={{
                position: 'absolute',
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: isSelected ? 20 : 15,
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Cellular Node Pod Card */}
              <div
                style={{
                  position: 'relative',
                  width: isSelected ? '106px' : '96px',
                  padding: '8px 10px',
                  borderRadius: '12px',
                  background: isQuarantined
                    ? 'rgba(26, 18, 10, 0.92)'
                    : isInfected
                    ? 'rgba(30, 12, 18, 0.92)'
                    : isImmune
                    ? 'rgba(20, 14, 34, 0.92)'
                    : 'rgba(13, 18, 30, 0.92)',
                  border: isSelected
                    ? `1.5px solid ${statusColor}`
                    : `1px solid ${statusColor}44`,
                  boxShadow: isSelected
                    ? `0 0 0 3px ${statusColor}22, 0 8px 24px rgba(0, 0, 0, 0.6)`
                    : '0 4px 16px rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(16px)',
                  transition: 'all 0.22s ease',
                  textAlign: 'center',
                }}
              >
                {/* Status Glow / Ring */}
                {isInfected && (
                  <div style={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '16px',
                    border: '1.5px solid #f43f5e',
                    animation: 'threat-radar 1.5s infinite ease-out',
                    pointerEvents: 'none',
                  }} />
                )}

                {isQuarantined && (
                  <div style={{
                    position: 'absolute',
                    inset: -5,
                    borderRadius: '16px',
                    border: '1.5px dashed #f59e0b',
                    animation: 'spin-slow 12s linear infinite',
                    pointerEvents: 'none',
                  }} />
                )}

                {isImmune && (
                  <div style={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.5)',
                    animation: 'immune-ring 2.5s infinite ease-out',
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Top Row: Icon + Mini Status Dot */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    background: statusBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {isInfected ? (
                      <AlertOctagon size={13} color="#f43f5e" />
                    ) : isQuarantined ? (
                      <Flame size={13} color="#f59e0b" />
                    ) : isImmune ? (
                      <ShieldCheck size={13} color="#c084fc" />
                    ) : (
                      <Server size={12} color="#10b981" />
                    )}
                  </div>

                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: statusColor,
                  }}>
                    {node.anomalyScore.toFixed(1)}%
                  </span>
                </div>

                {/* Node Title */}
                <div style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: isSelected ? '#ffffff' : '#f1f5f9',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'left',
                }}>
                  {node.name.split(' ')[0]}
                </div>

                {/* IP address */}
                <div style={{
                  fontSize: '0.62rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'left',
                  marginTop: '1px',
                }}>
                  {node.ip}
                </div>

                {/* Pill Tag for Scout / Shield */}
                <div style={{
                  marginTop: '5px',
                  padding: '1px 4px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  fontSize: '0.58rem',
                  fontWeight: 600,
                  color: isImmune ? '#c084fc' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span>{isImmune ? '🛡️ IgG Protected' : `T-Cell x${node.wbcScouts}`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
