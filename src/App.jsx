import React, { useState } from 'react';
import Header from './components/Header';
import VitalsBanner from './components/VitalsBanner';
import NetworkTopology from './components/NetworkTopology';
import AttackTriggerDeck from './components/AttackTriggerDeck';
import LiveEventTimeline from './components/LiveEventTimeline';
import ExplainabilityPanel from './components/ExplainabilityPanel';
import NodeStatusCard from './components/NodeStatusCard';
import { useImmuneNetwork } from './hooks/useImmuneNetwork';
import { Layers, Activity, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const {
    nodes,
    events,
    antibodies,
    selectedNode,
    selectedNodeId,
    setSelectedNodeId,
    attackInProgress,
    currentAttackStep,
    connectionMode,
    setConnectionMode,
    wsStatus,
    wsUrl,
    setWsUrl,
    soundEnabled,
    toggleSoundState,
    neutralizedCount,
    metrics,
    actions,
  } = useImmuneNetwork();

  const [activeTab, setActiveTab] = useState('topology'); // 'topology' | 'nodes'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* 1. Header Bar */}
      <Header
        wsStatus={wsStatus}
        wsUrl={wsUrl}
        setWsUrl={setWsUrl}
        connectionMode={connectionMode}
        setConnectionMode={setConnectionMode}
        soundEnabled={soundEnabled}
        toggleSoundState={toggleSoundState}
        onReset={actions.resetNetwork}
        attackInProgress={attackInProgress}
      />

      {/* 2. Real-Time Vitals Banner */}
      <VitalsBanner
        metrics={metrics}
        antibodiesCount={antibodies.length}
        neutralizedCount={neutralizedCount}
      />

      {/* 3. Main Dashboard Layout Grid */}
      <main className="dashboard-grid" style={{ marginTop: '16px', flex: 1 }}>
        {/* Left Column: Living Network Mesh & Real-Time Event Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Visualizer Panel */}
          <NetworkTopology
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            attackInProgress={attackInProgress}
            currentAttackStep={currentAttackStep}
          />

          {/* Real-time WebSocket Event Timeline */}
          <LiveEventTimeline
            events={events}
            wsStatus={wsStatus}
            connectionMode={connectionMode}
          />
        </div>

        {/* Right Column: Stage Attack Controller & Bio-Cyber Explainability */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Live Stage Attack Controller */}
          <AttackTriggerDeck
            nodes={nodes}
            antibodies={antibodies}
            onTriggerAttack={actions.triggerAttack}
            onTriggerSecondaryAttack={actions.triggerSecondaryAttack}
            onTriggerSelfHeal={actions.triggerSelfHeal}
            attackInProgress={attackInProgress}
          />

          {/* Bio-Explainability & T-Cell Biomarker SHAP Inspector */}
          <ExplainabilityPanel
            selectedNode={selectedNode}
            antibodies={antibodies}
          />
        </div>
      </main>

      {/* 4. Bottom Quick-Select Node Fleet Matrix */}
      <section style={{ padding: '0 24px 24px 24px' }}>
        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="#00f3ff" />
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                Distributed Cellular Node Fleet ({nodes.length} Endpoints Active)
              </h4>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Click any node card to focus diagnostics in Explainability Panel
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
          }}>
            {nodes.map((node) => (
              <NodeStatusCard
                key={node.id}
                node={node}
                isSelected={node.id === selectedNodeId}
                onSelect={setSelectedNodeId}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '14px 24px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(5, 8, 17, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.74rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={14} color="#00f3ff" />
          <span><b>IMMUNE-NET:</b> Autonomous Bio-Inspired Cyber Immunology Protocol</span>
        </div>
        <div>
          Decentralized Swarm Architecture • Peer-to-Peer Digital Memory • Zero Human-in-the-Loop MTTR
        </div>
      </footer>
    </div>
  );
}
