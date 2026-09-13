import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  AlertOctagon, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Pause, 
  Play, 
  Terminal,
  Activity
} from 'lucide-react';

export default function LiveEventTimeline({ events, wsStatus, connectionMode }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const filteredEvents = events.filter((evt) => {
    if (filterSeverity !== 'ALL') {
      if (filterSeverity === 'CRITICAL' && evt.severity !== 'CRITICAL') return false;
      if (filterSeverity === 'ALERT' && evt.severity !== 'ALERT') return false;
      if (filterSeverity === 'IMMUNE' && evt.severity !== 'IMMUNE') return false;
      if (filterSeverity === 'SUCCESS' && evt.severity !== 'SUCCESS') return false;
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchesTitle = evt.title?.toLowerCase().includes(q);
      const matchesNode = evt.nodeName?.toLowerCase().includes(q) || evt.nodeId?.toLowerCase().includes(q);
      const matchesDetail = evt.detail?.toLowerCase().includes(q);
      return matchesTitle || matchesNode || matchesDetail;
    }

    return true;
  });

  const getEventBadge = (evt) => {
    switch (evt.severity) {
      case 'CRITICAL':
        return { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.25)', icon: AlertOctagon };
      case 'ALERT':
        return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)', icon: Flame };
      case 'IMMUNE':
        return { color: '#c084fc', bg: 'rgba(139, 92, 246, 0.14)', border: 'rgba(139, 92, 246, 0.28)', icon: ShieldCheck };
      case 'SUCCESS':
        return { color: '#34d399', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)', icon: CheckCircle2 };
      default:
        return { color: '#a5b4fc', bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.2)', icon: Activity };
    }
  };

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '420px',
      overflow: 'hidden',
    }}>
      {/* Timeline Header */}
      <div style={{
        padding: '12px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(9, 13, 22, 0.75)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radio size={15} color="#a5b4fc" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
              Live Event Stream
            </span>
            <span style={{
              fontSize: '0.64rem',
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: '9999px',
              background: connectionMode === 'websocket' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
              color: connectionMode === 'websocket' ? '#34d399' : '#a5b4fc',
              border: `1px solid ${connectionMode === 'websocket' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(99, 102, 241, 0.25)'}`,
            }}>
              {connectionMode === 'websocket' ? `WS: ${wsStatus}` : 'Bio-Simulation'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="bio-btn bio-btn-subtle"
            style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: '6px' }}
            title={isPaused ? 'Resume auto-stream' : 'Pause stream to inspect'}
          >
            {isPaused ? <Play size={11} color="#34d399" /> : <Pause size={11} color="#f59e0b" />}
            <span>{isPaused ? 'Paused' : 'Streaming'}</span>
          </button>

          <div style={{ position: 'relative' }}>
            <Search size={11} color="var(--text-muted)" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              style={{
                padding: '4px 8px 4px 24px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.74rem',
                width: '120px',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        padding: '5px 18px',
        background: 'rgba(0, 0, 0, 0.25)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: '4px',
        overflowX: 'auto',
      }}>
        {['ALL', 'CRITICAL', 'ALERT', 'IMMUNE', 'SUCCESS'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              border: 'none',
              background: filterSeverity === sev ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: filterSeverity === sev ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.66rem',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Stream List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        {filteredEvents.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            No matching events in the buffer.
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const badge = getEventBadge(evt);
            const Icon = badge.icon;
            const isExpanded = expandedEventId === evt.id;

            return (
              <div
                key={evt.id}
                onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: isExpanded ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.015)',
                  border: `1px solid ${isExpanded ? badge.color + '66' : 'rgba(255, 255, 255, 0.04)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                    <div style={{
                      padding: '4px',
                      borderRadius: '5px',
                      background: badge.bg,
                      border: `1px solid ${badge.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={13} color={badge.color} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {evt.title}
                        </span>
                        <span style={{
                          fontSize: '0.62rem',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          flexShrink: 0,
                        }}>
                          {evt.nodeName ? evt.nodeName.split(' ')[0] : evt.nodeId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {evt.timestamp}
                    </span>
                    {isExpanded ? <ChevronDown size={13} color="var(--text-muted)" /> : <ChevronRight size={13} color="var(--text-muted)" />}
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '3px', paddingLeft: '26px' }}>
                  {evt.detail}
                </div>

                {isExpanded && evt.metadata && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'rgba(5, 8, 17, 0.95)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.66rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#94a3b8',
                  }}>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>
                      {JSON.stringify(evt.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
