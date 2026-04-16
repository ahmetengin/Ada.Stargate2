
import React from 'react';
import { UserProfile, TenantConfig } from '../types';
import { FEDERATION_REGISTRY } from '../services/config'; // Import FEDERATION_REGISTRY
import { Radio, Shield, Anchor, Wifi, Zap, Battery, Signal, UserCheck, CreditCard, ScanLine, Activity, CheckCircle2 } from 'lucide-react';

interface SidebarProps {
  nodeStates: Record<string, 'connected' | 'working' | 'disconnected'>;
  activeChannel: string;
  isMonitoring: boolean;
  userProfile: UserProfile;
  onRoleChange: (role: string) => void;
  onVhfClick?: (channel: string) => void;
  onScannerClick?: () => void;
  onPulseClick?: () => void;
  onTenantSwitch: (tenantId: string) => void; // NEW: Callback for tenant switch
  activeTenantId: string; // NEW: Active tenant ID
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  nodeStates, 
  activeChannel,
  isMonitoring,
  userProfile,
  onRoleChange,
  onScannerClick,
  onPulseClick,
  onTenantSwitch, // NEW
  activeTenantId // NEW
}) => {

  const nodes = [
    { id: 'ada.sea', label: 'SEA (COLREGs)' },
    { id: 'ada.marina', label: 'MARINA OPS' },
    { id: 'ada.finance', label: 'FINANCE' },
    { id: 'ada.customer', label: 'CRM / GUEST' },
    { id: 'ada.passkit', label: 'PASSKIT' },
    { id: 'ada.security', label: 'SECURITY' },
    { id: 'ada.technic', label: 'TECHNIC' },
    { id: 'ada.hr', label: 'HR / STAFF' },
  ];

  const isGM = userProfile.role === 'GENERAL_MANAGER';
  const isCaptain = userProfile.role === 'CAPTAIN';
  const isGuest = userProfile.role === 'GUEST';

  const activeTenant = FEDERATION_REGISTRY.peers.find(p => p.id === activeTenantId);
  const tenantNetworkName = activeTenant ? activeTenant.network : 'Unknown Network';

  return (
    <div className="h-full w-full flex flex-col bg-zinc-50 dark:bg-[#050b14] overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="p-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 mb-1 cursor-pointer" onClick={onPulseClick}>
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white/5 rounded-lg flex items-center justify-center border border-zinc-200 dark:border-white/10">
                <Anchor size={16} className="text-teal-500" />
            </div>
            <div>
                <h2 className="text-sm font-black tracking-wider">ADA EXPLORER</h2>
                <div className="text-[9px] text-zinc-500 dark:text-zinc-400 font-mono">{tenantNetworkName}</div>
            </div>
        </div>
      </div>

      {/* DYNAMIC CONTENT AREA BASED ON ROLE */}
      <div className="px-6 py-4 flex-1">
          
          {/* 1. GENERAL MANAGER VIEW: The "Matrix" (System Nodes) */}
          {isGM && (
              <>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">System Intelligence</div>
                <div className="space-y-3">
                    {nodes.map((node) => {
                    const isWorking = nodeStates[node.id] === 'working';
                    return (
                        <div key={node.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${isWorking ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                                <span className={`text-[10px] font-bold uppercase ${isWorking ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-500 dark:text-zinc-500'}`}>
                                    {node.label}
                                </span>
                            </div>
                            {isWorking && <ActivityIcon />}
                        </div>
                    );
                    })}
                </div>
              </>
          )}

          {/* 2. CAPTAIN VIEW: "My Ship" Status */}
          {isCaptain && (
              <div className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4 border-b border-zinc-200 dark:border-white/10 pb-2">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">MY VESSEL</span>
                      <span className="text-[10px] font-bold text-white bg-indigo-500 px-2 py-0.5 rounded">S/Y Phisedelia</span>
                  </div>
                  <div className="space-y-3">
                      <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-zinc-400 text-xs"><Zap size={12}/> Shore Power</div>
                          <span className="text-xs font-bold text-emerald-500">CONNECTED</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-zinc-400 text-xs"><Battery size={12}/> Service Bank</div>
                          <span className="text-xs font-bold text-yellow-500">24.4V</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-zinc-400 text-xs"><Signal size={12}/> Bilge Sensor</div>
                          <span className="text-xs font-bold text-emerald-500">DRY</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-zinc-400 text-xs"><CreditCard size={12}/> Account</div>
                          <span className="text-xs font-bold text-zinc-300">CLEAR</span>
                      </div>
                  </div>
              </div>
          )}

          {/* 3. GUEST VIEW: "Digital Pass" */}
          {isGuest && (
              <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-20"><ScanLine size={48}/></div>
                  <div className="relative z-10">
                      <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">ADA PASS</div>
                      <div className="text-lg font-bold mb-4">{userProfile.name}</div>
                      
                      <div className="space-y-2">
                          <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
                              <Wifi size={14} className="text-emerald-400"/>
                              <div>
                                  <div className="text-[9px] opacity-60 uppercase">Wi-Fi Code</div>
                                  <div className="text-xs font-mono font-bold">WIM_GUEST / Sailor2025</div>
                              </div>
                          </div>
                          <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
                              <Shield size={14} className="text-emerald-400"/>
                              <div>
                                  <div className="text-[9px] opacity-60 uppercase">Access Level</div>
                                  <div className="text-xs font-bold">Social Areas & Pontoon A</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

      </div>

      {/* VHF MONITOR (PASSIVE RECEIVER) - VISIBLE ONLY TO GENERAL MANAGER (OFFICE) */}
      {isGM && (
        <div className="px-6 py-6 border-t border-zinc-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold text-xs">
                    <Radio size={14} className="text-zinc-400" /> RADIO MONITOR
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-emerald-500 uppercase">RX OPEN</span>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* PASSIVE DISPLAY PANEL */}
            <div className="bg-black rounded-lg p-3 border border-zinc-800 relative overflow-hidden shadow-inner">
                {/* Scan line effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] pointer-events-none bg-[length:100%_4px,6px_100%] z-10 opacity-30"></div>
                
                <div className="relative z-20 flex justify-between items-end">
                    <div>
                        <div className="text-[9px] text-zinc-500 uppercase font-mono mb-1">TUNED FREQ</div>
                        <div className="text-2xl font-mono font-bold text-emerald-500 leading-none tracking-tight">
                            SCANNING
                        </div>
                    </div>
                    <div className="text-right">
                        {/* Fake Audio Visualizer */}
                        <div className="flex gap-0.5 items-end h-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-1 bg-emerald-500/50 animate-pulse" style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 0.1}s` }}></div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-zinc-800/50 flex justify-between text-[9px] font-mono text-zinc-400">
                    <span>ALL STATIONS</span>
                    <span>-102dBm</span>
                </div>
            </div>
            
            <div className="mt-3 text-[9px] text-zinc-400 text-center opacity-70">
                * Office Monitoring Station. Transmission via Chat.
            </div>
        </div>
      )}

      {/* RBAC Switcher */}
      <div className="px-6 py-6 border-t border-zinc-200 dark:border-white/5 bg-zinc-100/50 dark:bg-black/20">
          <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Shield size={12} /> Access Level
          </div>
          <div className="space-y-1">
            <RoleButton role="GUEST" current={userProfile.role} onClick={() => onRoleChange('GUEST')} label="GUEST" />
            <RoleButton role="CAPTAIN" current={userProfile.role} onClick={() => onRoleChange('CAPTAIN')} label="CAPTAIN" />
            <RoleButton role="GENERAL_MANAGER" current={userProfile.role} onClick={() => onRoleChange('GENERAL_MANAGER')} label="MANAGER" />
          </div>

          {/* NEW: Tenant Switcher */}
          <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-6 mb-3 flex items-center gap-2">
              <Anchor size={12} /> Active Node
          </div>
          <div className="space-y-1">
            {FEDERATION_REGISTRY.peers.map((tenant) => (
                <TenantButton 
                    key={tenant.id}
                    tenantId={tenant.id}
                    currentTenantId={activeTenantId}
                    onClick={() => onTenantSwitch(tenant.id)}
                    label={tenant.name}
                />
            ))}
          </div>
      </div>
    </div>
  );
};

const RoleButton = ({ role, current, onClick, label }: any) => (
    <button
        onClick={onClick}
        className={`w-full text-left px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider flex justify-between items-center transition-all ${
            current === role 
            ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-md' 
            : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-white/5'
        }`}
    >
        {label}
        {current === role && <UserCheck size={12} />}
    </button>
);

// NEW: Tenant Button Component
const TenantButton = ({ tenantId, currentTenantId, onClick, label }: any) => (
    <button
        onClick={onClick}
        className={`w-full text-left px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider flex justify-between items-center transition-all ${
            currentTenantId === tenantId 
            ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-md' 
            : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-white/5'
        }`}
    >
        {label}
        {currentTenantId === tenantId && <CheckCircle2 size={12} />}
    </button>
);

const ActivityIcon = () => (
    <div className="flex gap-0.5">
        <div className="w-0.5 h-2 bg-zinc-400 animate-pulse"></div>
        <div className="w-0.5 h-3 bg-zinc-400 animate-pulse delay-75"></div>
        <div className="w-0.5 h-1.5 bg-zinc-400 animate-pulse delay-150"></div>
    </div>
);
