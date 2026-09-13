import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Settings2, 
  CheckCircle2, 
  Cpu
} from 'lucide-react';

export default function Header({
  wsStatus,
  wsUrl,
  setWsUrl,
  connectionMode,
  setConnectionMode,
  soundEnabled,
  toggleSoundState,
  onReset,
  attackInProgress,
}) {
  const [showConfig, setShowConfig] = useState(false);
  const [tempUrl, setTempUrl] = useState(wsUrl);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setWsUrl(tempUrl);
    setShowConfig(false);
  };

  return (
    <header style={{
      padding: '14px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(99, 102, 241, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
          flexShrink: 0,
        }}>
          <ShieldCheck size={22} color="#ffffff" />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}>
              IMMUNE-NET
            </span>
            <span style={{
              fontSize: '0.66rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#a5b4fc',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              letterSpacing: '0.04em',
            }}>
              BIO-AUTONOMOUS
            </span>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
            Decentralized Endpoint Immunology • Autonomous T-Cell Detection & P2P Memory
          </p>
        </div>
      </div>

      {/* Control Actions & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Connection Mode Pill */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="bio-btn bio-btn-subtle"
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              borderRadius: '9999px',
            }}
          >
            {connectionMode === 'websocket' ? (
              wsStatus === 'connected' ? (
                <>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ color: '#34d399' }}>Live WS</span>
                </>
              ) : (
                <>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ color: '#fbbf24' }}>Connecting...</span>
                </>
              )
            ) : (
              <>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1' }} />
                <span>Bio-Engine Sim</span>
              </>
            )}
            <Settings2 size={13} style={{ marginLeft: 4, color: 'var(--text-muted)' }} />
          </button>

          {/* Config Popover */}
          {showConfig && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '300px',
                padding: '16px',
                zIndex: 200,
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)',
              }}
            >
              <div style={{ fontSize: '0.84rem', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>
                Event Stream Configuration
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Execution Engine
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setConnectionMode('simulation')}
                    className={`bio-btn ${connectionMode === 'simulation' ? 'bio-btn-iris' : 'bio-btn-subtle'}`}
                    style={{ padding: '6px 8px', fontSize: '0.76rem' }}
                  >
                    Autonomous Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setConnectionMode('websocket')}
                    className={`bio-btn ${connectionMode === 'websocket' ? 'bio-btn-iris' : 'bio-btn-subtle'}`}
                    style={{ padding: '6px 8px', fontSize: '0.76rem' }}
                  >
                    Backend WebSocket
                  </button>
                </div>
              </div>

              {connectionMode === 'websocket' && (
                <form onSubmit={handleSaveConfig}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    WebSocket URI
                  </label>
                  <input
                    type="text"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="ws://localhost:8000/ws"
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      background: 'rgba(5, 8, 17, 0.9)',
                      border: '1px solid var(--border-medium)',
                      color: '#fff',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      marginBottom: '12px',
                      outline: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setShowConfig(false)}
                      className="bio-btn bio-btn-subtle"
                      style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="bio-btn bio-btn-iris"
                      style={{ padding: '4px 12px', fontSize: '0.74rem' }}
                    >
                      Connect
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleSoundState}
          className="bio-btn bio-btn-subtle"
          style={{ padding: '7px 10px', borderRadius: '8px' }}
          title={soundEnabled ? 'Mute Bio-Synthesizer' : 'Enable Bio-Synthesizer'}
        >
          {soundEnabled ? <Volume2 size={15} color="#a5b4fc" /> : <VolumeX size={15} color="#64748b" />}
        </button>

        {/* Reset Swarm */}
        <button
          onClick={onReset}
          disabled={attackInProgress}
          className="bio-btn bio-btn-subtle"
          style={{
            padding: '7px 12px',
            fontSize: '0.78rem',
            borderRadius: '8px',
            opacity: attackInProgress ? 0.5 : 1,
          }}
          title="Reset Swarm to Homeostasis"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
