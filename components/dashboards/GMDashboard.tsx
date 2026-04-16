

import React, { useState, useEffect } from 'react';
import { RegistryEntry, Tender, UserProfile, CongressEvent, Delegate, AgentTraceLog, VhfLog, AisTarget, TenantConfig } from '../../types';
import { facilityExpert } from '../../services/agents/facilityAgent';
import { congressExpert } from '../../services/agents/congressAgent';
import { hrExpert } from '../../services/agents/hrAgent';
import { commercialExpert } from '../../services/agents/commercialAgent';
import { analyticsExpert } from '../../services/agents/analyticsAgent';
import { berthExpert } from '../../services/agents/berthAgent';
import { reservationsExpert } from '../../services/agents/reservationsAgent';
import { FileText, Activity, Bell } from 'lucide-react';

import { OpsTab } from './gm/OpsTab';
import { FleetTab } from './gm/FleetTab';
import { FacilityTab } from './gm/FacilityTab';
import { CongressTab } from './gm/CongressTab';
import { BerthsTab } from './gm/BerthsTab';
import { HRTab, CommercialTab, AnalyticsTab, BookingsTab } from './gm/ManagementTabs';
import { ObserverTab } from './gm/ObserverTab';
import { GuestCheckInTab } from './gm/GuestCheckInTab';

interface GMDashboardProps {
  userProfile: UserProfile;
  logs: any[];
  registry: RegistryEntry[];
  tenders: Tender[];
  vesselsInPort: number;
  agentTraces: AgentTraceLog[];
  vhfLogs?: VhfLog[];
  aisTargets?: AisTarget[];
  onOpenReport: () => void;
  onOpenTrace: () => void;
  activeTenantConfig: TenantConfig; // NEW: Pass activeTenantConfig
}

export const GMDashboard: React.FC<GMDashboardProps> = ({
  userProfile,
  logs,
  registry,
  tenders,
  vesselsInPort,
  agentTraces,
  vhfLogs = [],
  aisTargets = [],
  onOpenReport,
  onOpenTrace,
  activeTenantConfig // NEW
}) => {
  const criticalLogs = logs.filter(log => log.type === 'critical' || log.type === 'alert');
  const [activeGmTab, setActiveGmTab] = useState<'ops' | 'fleet' | 'facility' | 'congress' | 'hr' | 'commercial' | 'analytics' | 'berths' | 'bookings' | 'observer' | 'guest_entry'>('ops');
  
  const [zeroWasteStats, setZeroWasteStats] = useState<any>(null);
  const [blueFlagStatus, setBlueFlagStatus] = useState<any>(null);
  const [eventDetails, setEventDetails] = useState<CongressEvent | null>(null);
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [hrData, setHrData] = useState<any>(null);
  const [commercialData, setCommercialData] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [berthAllocation, setBerthAllocation] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (activeGmTab === 'facility') {
      facilityExpert.generateZeroWasteReport(() => { }).then(res => setZeroWasteStats(res));
      facilityExpert.checkSeaWaterQuality(() => { }).then(res => setBlueFlagStatus(res));
    }
    if (activeGmTab === 'congress') {
      congressExpert.getEventDetails().then(setEventDetails);
      congressExpert.getDelegates().then(setDelegates);
    }
    if (activeGmTab === 'hr') {
      hrExpert.getShiftSchedule('Security', () => { }).then(setHrData);
    }
    if (activeGmTab === 'commercial') {
      commercialExpert.getTenantLeases(() => { }).then(setCommercialData);
    }
    if (activeGmTab === 'analytics') {
      analyticsExpert.predictOccupancy('3M', () => { }).then(setAnalyticsData);
    }
    if (activeGmTab === 'berths') {
      berthExpert.findOptimalBerth({ loa: 20.4, beam: 5.6, draft: 4.7, type: 'VO65 Racing Yacht' }, () => { }).then(setBerthAllocation);
    }
    if (activeGmTab === 'bookings') {
      reservationsExpert.processBooking({ name: "S/Y Wind Chaser", type: "Sailing Yacht", loa: 16, beam: 4.5 }, { start: "2025-06-10", end: "2025-06-15" }, () => { }).then(res => setBookings([res.proposal]));
    }
  }, [activeGmTab]);

  const tabs = [
      { id: 'ops', label: 'Ops' },
      { id: 'fleet', label: 'Fleet' },
      { id: 'facility', label: 'Facility' },
      { id: 'guest_entry', label: 'Check-In' }, // Moved up for priority
      { id: 'berths', label: 'Berths' },
      { id: 'observer', label: 'Neural' },
      { id: 'congress', label: 'Event' },
      { id: 'hr', label: 'HR' },
      { id: 'commercial', label: 'Retail' },
      { id: 'analytics', label: 'Data' },
      { id: 'bookings', label: 'Book' },
  ];

  return (
    <div className="text-zinc-800 dark:text-zinc-200 font-sans h-full flex flex-col bg-zinc-50 dark:bg-black">
      
      {/* COMMAND DECK HEADER */}
      <div className="bg-white dark:bg-[#0a121e] border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0 shadow-sm relative z-10">
        <div className="flex items-center justify-between p-4 pb-2">
            
            {/* Left: Title & Status (CLEAN - NO ICON) */}
            <div>
                <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider leading-none">
                    {activeTenantConfig.name} Command Deck
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        ONLINE
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline-block">
                        Clearance Level 5 • {userProfile.name}
                    </span>
                </div>
            </div>
            
            {/* Right: Utility Cluster */}
            <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800">
                    <button 
                        onClick={onOpenReport}
                        className="p-2 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all group"
                        title="Daily Operations Report"
                    >
                        <FileText size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-800 mx-1"></div>
                    <button 
                        onClick={onOpenTrace}
                        className="p-2 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all group"
                        title="System Intelligence (Neural Trace)"
                    >
                        <Activity size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-800 mx-1"></div>
                    <button 
                        className="p-2 text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all relative group"
                        title="Notifications"
                    >
                        <Bell size={18} className="group-hover:scale-110 transition-transform" />
                        {criticalLogs.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white dark:ring-zinc-900"></span>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* MOBILE-FRIENDLY TABS (Horizontal Scroll + Capsules) */}
        <div className="px-4 pb-3 pt-1 overflow-x-auto custom-scrollbar no-scrollbar w-full">
            <div className="flex gap-2">
                {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveGmTab(tab.id as any)}
                    className={`
                        px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all whitespace-nowrap flex-shrink-0 border
                        ${activeGmTab === tab.id 
                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white shadow-md transform scale-105' 
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                        }
                    `}
                >
                    {tab.label}
                </button>
                ))}
            </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-zinc-100 dark:bg-[#050b14] relative">
        {activeGmTab === 'ops' && (
            <OpsTab 
                vesselsInPort={vesselsInPort} 
                registry={registry} 
                criticalLogs={criticalLogs} 
                tenders={tenders}
                vhfLogs={vhfLogs}
                aisTargets={aisTargets}
            />
        )}
        {activeGmTab === 'fleet' && <FleetTab tenders={tenders} />}
        {activeGmTab === 'facility' && <FacilityTab blueFlagStatus={blueFlagStatus} zeroWasteStats={zeroWasteStats} />}
        {activeGmTab === 'congress' && <CongressTab eventDetails={eventDetails} delegates={delegates} />}
        {activeGmTab === 'hr' && <HRTab hrData={hrData} />}
        {activeGmTab === 'commercial' && <CommercialTab commercialData={commercialData} />}
        {activeGmTab === 'analytics' && <AnalyticsTab analyticsData={analyticsData} />}
        {activeGmTab === 'berths' && <BerthsTab berthAllocation={berthAllocation} />}
        {activeGmTab === 'bookings' && <BookingsTab bookings={bookings} />}
        {activeGmTab === 'guest_entry' && <GuestCheckInTab />}
        {activeGmTab === 'observer' && <ObserverTab traces={agentTraces} />}
      </div>
    </div>
  );
};