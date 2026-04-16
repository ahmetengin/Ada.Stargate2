
import React, { useEffect, useState } from 'react';
import { RegistryEntry, Tender, VhfLog, UserProfile, AgentTraceLog, AisTarget, TenantConfig } from '../types';
import { GuestDashboard } from './dashboards/GuestDashboard';
import { CaptainDashboard } from './dashboards/CaptainDashboard';
import { GMDashboard } from './dashboards/GMDashboard';
import { EmergencyDashboard } from './dashboards/EmergencyDashboard';

interface CanvasProps {
  vesselsInPort: number;
  registry: RegistryEntry[];
  tenders: Tender[];
  vhfLogs?: VhfLog[];
  aisTargets?: AisTarget[];
  userProfile: UserProfile;
  onOpenReport?: () => void;
  onOpenTrace?: () => void;
  agentTraces?: AgentTraceLog[];
  activeTenantConfig: TenantConfig; 
}

export const Canvas: React.FC<CanvasProps> = ({ 
  vesselsInPort, 
  registry,
  tenders,
  vhfLogs = [],
  aisTargets = [],
  userProfile,
  onOpenReport,
  onOpenTrace,
  agentTraces = [],
  activeTenantConfig
}) => {
  // Live Data Simulation for "Static" fix
  const [occupancyRate, setOccupancyRate] = useState(92);
  const [movementCount, setMovementCount] = useState(registry.length);
  
  useEffect(() => {
      // Simulate live operational heartbeat
      const interval = setInterval(() => {
          setOccupancyRate(prev => prev + (Math.random() > 0.5 ? 0.1 : -0.1));
          setMovementCount(registry.length); // Sync with real props
      }, 5000);

      return () => clearInterval(interval);
  }, [registry.length]);

  // Extract Critical Logs from Traces for the Dashboard
  // This logic looks for specific keywords that trigger the "Guardian Protocol"
  const dashboardLogs = agentTraces
    .filter(t => t.step === 'ERROR' || t.isError || t.content.includes('DENIED') || t.content.includes('ALERT') || t.content.includes('CODE_RED') || t.content.includes('MAYDAY'))
    .map(t => ({
        timestamp: t.timestamp,
        source: t.node,
        message: t.content,
        type: t.content.includes('CODE_RED') || t.content.includes('MAYDAY') ? 'CRITICAL_EMERGENCY' : 'critical'
    }));

  // --- GUARDIAN PROTOCOL (Episode B) ---
  // If a CODE RED is active, override the dashboard for non-guests to focus purely on the emergency
  const isEmergency = dashboardLogs.some(l => l.type === 'CRITICAL_EMERGENCY');

  if (isEmergency && userProfile.role !== 'GUEST') {
      return <EmergencyDashboard />;
  }

  // --- VIEW 1: GUEST (LIFESTYLE DECK) ---
  if (userProfile.role === 'GUEST') {
      return <GuestDashboard userProfile={userProfile} />;
  }

  // --- VIEW 2: CAPTAIN (VESSEL DECK) ---
  if (userProfile.role === 'CAPTAIN') {
      return <CaptainDashboard />;
  }

  // --- VIEW 3: GM / OPERATOR (MASTER OPS) ---
  return (
      <div className="h-full w-full pb-20 lg:pb-0">
        <GMDashboard 
            userProfile={userProfile}
            logs={dashboardLogs} // Passing dynamic logs derived from traces
            registry={registry}
            tenders={tenders}
            vesselsInPort={vesselsInPort}
            agentTraces={agentTraces}
            vhfLogs={vhfLogs} // PASS THE COMMS
            aisTargets={aisTargets}
            onOpenReport={onOpenReport || (() => {})}
            onOpenTrace={onOpenTrace || (() => {})}
            activeTenantConfig={activeTenantConfig}
        />
      </div>
  );
};
