import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_NODES, ATTACK_CATALOG, NODE_STATUS } from '../types/immuneTypes';
import {
  playPathogenAlert,
  playQuarantineInflammation,
  playAntibodySynthesized,
  playPeerImmunized,
  playSelfHealed,
  playClick,
  toggleAudio,
  isAudioEnabled,
} from '../audio/soundEffects';

export function useImmuneNetwork() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [events, setEvents] = useState([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      timeMs: Date.now(),
      type: 'HOMEOSTASIS',
      severity: 'INFO',
      title: 'Distributed T-Cell Mesh Initialized',
      detail: '8 endpoint agents active. Sampling system call entropy & socket baselines.',
      nodeId: 'ALL',
      nodeName: 'Network Swarm',
      metadata: { activeAgents: 124, baselineEntropy: 0.11 },
    },
  ]);
  const [antibodies, setAntibodies] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState('node-beta');
  const [attackInProgress, setAttackInProgress] = useState(false);
  const [currentAttackStep, setCurrentAttackStep] = useState(null);
  const [connectionMode, setConnectionMode] = useState('simulation'); // 'simulation' | 'websocket'
  const [wsStatus, setWsStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected'
  const [wsUrl, setWsUrl] = useState('ws://localhost:8000/ws');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [neutralizedCount, setNeutralizedCount] = useState(0);

  const wsRef = useRef(null);
  const timeoutsRef = useRef([]);

  const clearPendingTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  const addEvent = useCallback((eventData) => {
    setEvents((prev) => [
      {
        id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toLocaleTimeString(),
        timeMs: Date.now(),
        ...eventData,
      },
      ...prev.slice(0, 99), // Keep latest 100 events
    ]);
  }, []);

  // WebSocket Connection Handler
  useEffect(() => {
    if (connectionMode !== 'websocket') {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setWsStatus('disconnected');
      return;
    }

    setWsStatus('connecting');
    let socket;
    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setWsStatus('connected');
        addEvent({
          type: 'WS_SYNC',
          severity: 'SUCCESS',
          title: 'WebSocket Bridge Connected',
          detail: `Synchronized with backend immune orchestrator at ${wsUrl}`,
          nodeId: 'ALL',
          nodeName: 'Bridge Hub',
        });
      };

      socket.onmessage = (msgEvent) => {
        try {
          const data = JSON.parse(msgEvent.data);
          // Backend may send node updates or event timeline logs
          if (data.type === 'NODE_UPDATE' && data.nodeId) {
            setNodes((prev) =>
              prev.map((n) => (n.id === data.nodeId ? { ...n, ...data.patch } : n))
            );
          } else if (data.type === 'IMMUNE_EVENT') {
            addEvent(data.event);
          } else if (data.type === 'NEW_ANTIBODY' && data.antibody) {
            setAntibodies((prev) => [data.antibody, ...prev]);
            playAntibodySynthesized();
          }
        } catch (err) {
          console.warn('Malformed WS payload:', msgEvent.data);
        }
      };

      socket.onerror = () => {
        setWsStatus('disconnected');
      };

      socket.onclose = () => {
        setWsStatus('disconnected');
      };
    } catch (e) {
      setWsStatus('disconnected');
    }

    return () => {
      if (socket) socket.close();
    };
  }, [connectionMode, wsUrl, addEvent]);

  // Primary Attack Injection Scenario (Stage Demo Cycle)
  const triggerAttack = useCallback(
    (targetNodeId = 'node-beta', attackKey = 'crypto_ransomware') => {
      clearPendingTimeouts();
      setAttackInProgress(true);
      const attack =
        ATTACK_CATALOG.find((a) => a.id === attackKey) || ATTACK_CATALOG[0];

      const targetNode = nodes.find((n) => n.id === targetNodeId) || nodes[1];

      // Step 1: Ingress & Infection
      setCurrentAttackStep(`[Stage 1] Pathogen Ingress: ${attack.name} invading ${targetNode.name}`);
      playPathogenAlert();

      setNodes((prev) =>
        prev.map((n) =>
          n.id === targetNodeId
            ? {
                ...n,
                status: NODE_STATUS.INFECTED,
                activeThreat: attack,
                anomalyScore: attack.anomalyScore,
                biomarkers: {
                  ...n.biomarkers,
                  entropy: 0.94,
                  cpu: 89,
                },
              }
            : n
        )
      );

      addEvent({
        type: 'PATHOGEN_INGRESS',
        severity: 'CRITICAL',
        title: `Pathogen Ingress: ${attack.name}`,
        detail: `Anomalous vector [${attack.vector}] injected into ${targetNode.name} (${targetNode.ip}). High entropy detected.`,
        nodeId: targetNode.id,
        nodeName: targetNode.name,
        metadata: {
          attackId: attack.id,
          vector: attack.vector,
          anomalyScore: attack.anomalyScore,
        },
      });

      // Step 2: T-Cell Agent Detection & Anomaly Verification (450ms)
      const t1 = setTimeout(() => {
        setCurrentAttackStep(`[Stage 2] T-Cell Recognition: Local agent flagged anomalous process entropy`);
        addEvent({
          type: 'TCELL_ANOMALY',
          severity: 'WARNING',
          title: `T-Cell Receptor Triggered on ${targetNode.name}`,
          detail: `Local White Blood Cell agent #T-${Math.floor(100 + Math.random() * 900)} detected behavioral drift: Disk write entropy +94%, Process fork rate spike.`,
          nodeId: targetNode.id,
          nodeName: targetNode.name,
          metadata: attack.biomarkers,
        });
      }, 550);
      timeoutsRef.current.push(t1);

      // Step 3: Inflammatory Isolation / Quarantine (1100ms)
      const t2 = setTimeout(() => {
        playQuarantineInflammation();
        setCurrentAttackStep(`[Stage 3] Local Inflammation: ${targetNode.name} Quarantined to contain lateral spread`);

        setNodes((prev) =>
          prev.map((n) =>
            n.id === targetNodeId
              ? {
                  ...n,
                  status: NODE_STATUS.QUARANTINED,
                  biomarkers: {
                    ...n.biomarkers,
                    socketLoad: 0, // Ingress/egress cut
                  },
                }
              : n
          )
        );

        addEvent({
          type: 'INFLAMMATORY_QUARANTINE',
          severity: 'ALERT',
          title: `Inflammation Barrier: ${targetNode.name} Quarantined`,
          detail: `Lateral movement links severed in 118ms. Node network namespace isolated in sandbox to protect the collective swarm.`,
          nodeId: targetNode.id,
          nodeName: targetNode.name,
          metadata: {
            latencyMs: 118,
            sandboxBoundary: 'eBPF cgroup network egress drop',
          },
        });
      }, 1200);
      timeoutsRef.current.push(t2);

      // Step 4: Digital Antibody Synthesis (2100ms)
      const t3 = setTimeout(() => {
        playAntibodySynthesized();
        setCurrentAttackStep(`[Stage 4] Antibody Synthesis: Generating digital signature ${attack.antibodySignature}`);

        const newAntibody = {
          id: attack.antibodySignature,
          name: `Anti-${attack.id.replace('_', '-')}`,
          targetPathogen: attack.name,
          attackId: attack.id,
          signatureHash: '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          eBpfRule: attack.eBpfRule,
          synthesizedAt: new Date().toLocaleTimeString(),
          neutralizedCount: 1,
        };

        setAntibodies((prev) => [newAntibody, ...prev.filter((ab) => ab.id !== newAntibody.id)]);

        addEvent({
          type: 'ANTIBODY_SYNTHESIS',
          severity: 'SUCCESS',
          title: `Digital Antibody Synthesized: ${newAntibody.id}`,
          detail: `Autonomous synthesis completed in 142ms. Rule: ${attack.eBpfRule}`,
          nodeId: targetNode.id,
          nodeName: targetNode.name,
          metadata: {
            signature: newAntibody.id,
            hash: newAntibody.signatureHash,
            rule: newAntibody.eBpfRule,
          },
        });
      }, 2200);
      timeoutsRef.current.push(t3);

      // Step 5: Peer-to-Peer Lymphatic Broadcast & Swarm Immunization (3000ms - 4200ms)
      const t4 = setTimeout(() => {
        setCurrentAttackStep(`[Stage 5] Lymphatic Broadcast: Propagating antibody to all peer nodes via P2P mesh`);

        // Propagate antibody to all other healthy nodes
        nodes.forEach((peer, idx) => {
          if (peer.id !== targetNodeId) {
            const delay = 300 + idx * 180;
            const peerTimeout = setTimeout(() => {
              playPeerImmunized();
              setNodes((prev) =>
                prev.map((n) =>
                  n.id === peer.id
                    ? {
                        ...n,
                        status: NODE_STATUS.IMMUNE,
                        memoryShields: Array.from(new Set([...n.memoryShields, attack.antibodySignature])),
                      }
                    : n
                )
              );

              addEvent({
                type: 'PEER_IMMUNIZED',
                severity: 'SUCCESS',
                title: `${peer.name} Fortified with Antibody`,
                detail: `P2P lymph sync installed ${attack.antibodySignature}. Memory B-Cell eBPF filter loaded in memory.`,
                nodeId: peer.id,
                nodeName: peer.name,
              });
            }, delay);
            timeoutsRef.current.push(peerTimeout);
          }
        });

        // Trigger confetti celebration when herd immunity achieves milestone
        const finishTimeout = setTimeout(() => {
          setCurrentAttackStep(null);
          setAttackInProgress(false);
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#00f3ff', '#a855f7', '#10b981'],
            });
          } catch (e) {}
        }, 1800);
        timeoutsRef.current.push(finishTimeout);
      }, 3100);
      timeoutsRef.current.push(t4);
    },
    [nodes, addEvent]
  );

  // Secondary Attack (The Winning Demo: Proving Instant Immunity to the same attack)
  const triggerSecondaryAttack = useCallback(
    (targetNodeId = 'node-gamma', attackKey = 'crypto_ransomware') => {
      playClick();
      const attack =
        ATTACK_CATALOG.find((a) => a.id === attackKey) || ATTACK_CATALOG[0];
      const targetNode = nodes.find((n) => n.id === targetNodeId) || nodes[2];

      const hasAntibody =
        targetNode.memoryShields.includes(attack.antibodySignature) ||
        antibodies.some((ab) => ab.attackId === attack.id || ab.id === attack.antibodySignature);

      if (hasAntibody) {
        // Instant bounce-off! Memory antibody blocks it in < 4ms!
        playAntibodySynthesized();
        setNeutralizedCount((c) => c + 1);

        // Flash node immune highlight
        setNodes((prev) =>
          prev.map((n) =>
            n.id === targetNodeId
              ? {
                  ...n,
                  status: NODE_STATUS.IMMUNE,
                  memoryShields: Array.from(new Set([...n.memoryShields, attack.antibodySignature])),
                  anomalyScore: Math.min(n.anomalyScore + 0.8, 8.0),
                }
              : n
          )
        );

        addEvent({
          type: 'ANTIBODY_NEUTRALIZATION',
          severity: 'IMMUNE',
          title: `🛡️ ATTACK DEFLECTED: Memory Antibody Blocked ${attack.name}`,
          detail: `Same pathogen fired at ${targetNode.name} — immediately intercepted at the membrane by ${attack.antibodySignature} in 3.4ms! Zero latency, zero infection.`,
          nodeId: targetNode.id,
          nodeName: targetNode.name,
          metadata: {
            interceptionLatency: '3.4ms',
            antibody: attack.antibodySignature,
            bCellMemory: 'CONFIRMED_IMMUNITY',
            humanInterventionRequired: false,
          },
        });

        try {
          confetti({
            particleCount: 30,
            spread: 45,
            origin: { x: targetNode.x / 100, y: targetNode.y / 100 },
            colors: ['#a855f7', '#00f3ff'],
          });
        } catch (e) {}
      } else {
        // Fallback: If no antibody exists yet, triggers primary attack cycle
        triggerAttack(targetNodeId, attackKey);
      }
    },
    [nodes, antibodies, triggerAttack, addEvent]
  );

  // Self-Healing Rollback from Immutable Snapshot
  const triggerSelfHeal = useCallback(
    (targetNodeId) => {
      playClick();
      const nodeToHeal =
        nodes.find((n) => n.id === targetNodeId && n.status === NODE_STATUS.QUARANTINED) ||
        nodes.find((n) => n.status === NODE_STATUS.QUARANTINED) ||
        nodes.find((n) => n.id === targetNodeId);

      if (!nodeToHeal) return;

      playSelfHealed();

      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeToHeal.id
            ? {
                ...n,
                status: NODE_STATUS.IMMUNE,
                anomalyScore: 3.8,
                activeThreat: null,
                biomarkers: {
                  cpu: 21,
                  memory: 38,
                  entropy: 0.12,
                  socketLoad: 110,
                },
                memoryShields: antibodies.map((ab) => ab.id),
              }
            : n
        )
      );

      addEvent({
        type: 'AUTONOMOUS_SELF_HEAL',
        severity: 'SUCCESS',
        title: `Self-Healing Rollback Complete: ${nodeToHeal.name}`,
        detail: `Node flushed corrupted execution state, restored from Immutable Marrow Snapshot #SNAP-7718, and applied active digital antibodies. Zero human ticket needed.`,
        nodeId: nodeToHeal.id,
        nodeName: nodeToHeal.name,
        metadata: {
          rollbackTimeMs: 480,
          snapshotId: 'SNAP-7718-CLEAN',
          stateRestored: 'HEALTHY_IMMUNE',
        },
      });
    },
    [nodes, antibodies, addEvent]
  );

  // Reset entire network state to baseline
  const resetNetwork = useCallback(() => {
    clearPendingTimeouts();
    playClick();
    setAttackInProgress(false);
    setCurrentAttackStep(null);
    setNodes(INITIAL_NODES);
    setAntibodies([]);
    setNeutralizedCount(0);
    addEvent({
      type: 'NETWORK_RESET',
      severity: 'INFO',
      title: 'Network Re-Sensitized & Reset',
      detail: 'All endpoints returned to baseline homeostasis. T-cell surveillance recalibrated.',
      nodeId: 'ALL',
      nodeName: 'Swarm Orchestrator',
    });
  }, [addEvent]);

  // Audio Toggle
  const toggleSoundState = () => {
    const next = toggleAudio();
    setSoundEnabled(next);
  };

  // Metrics Calculations
  const totalNodes = nodes.length;
  const immuneNodes = nodes.filter((n) => n.status === NODE_STATUS.IMMUNE || n.memoryShields.length > 0).length;
  const healthyNodes = nodes.filter((n) => n.status === NODE_STATUS.HEALTHY).length;
  const quarantinedNodes = nodes.filter((n) => n.status === NODE_STATUS.QUARANTINED).length;
  const infectedNodes = nodes.filter((n) => n.status === NODE_STATUS.INFECTED).length;

  const herdImmunityPercent = Math.round((immuneNodes / totalNodes) * 100);
  const activeTCells = nodes.reduce((sum, n) => sum + (n.wbcScouts || 12), 0);

  // Selected Node Data for the Explainability Panel
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return {
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
    metrics: {
      totalNodes,
      herdImmunityPercent,
      healthyNodes,
      quarantinedNodes,
      infectedNodes,
      immuneNodes,
      activeTCells,
      autonomousMTTR: '0.42s', // vs Industry 197 days!
    },
    actions: {
      triggerAttack,
      triggerSecondaryAttack,
      triggerSelfHeal,
      resetNetwork,
      addEvent,
    },
  };
}
