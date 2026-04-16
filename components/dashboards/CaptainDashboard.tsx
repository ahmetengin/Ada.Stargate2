

import React, { useState, useEffect } from 'react';
import { Wifi, Thermometer, Zap, ShieldCheck, Droplets, Recycle, Clock } from 'lucide-react';
import { marinaExpert } from '../../services/agents/marinaAgent';
import { getCurrentMaritimeTime } from '../../services/utils';
import { VesselSystemsStatus, TenantConfig } from '../../types';
import { TENANT_CONFIG } from '../../services/config';

export const CaptainDashboard: React.FC = () => {
  const [activeCaptainTab, setActiveCaptainTab] = useState<'overview' | 'engineering' | 'finance' | 'bluecard'>('overview');
  const [zuluTime, setZuluTime] = useState(getCurrentMaritimeTime());
  const [telemetry, setTelemetry] = useState<VesselSystemsStatus | null>(null);

  const activeTenantConfig: TenantConfig = TENANT_CONFIG; // Assuming TENANT_CONFIG is the active one

  useEffect(() => {
      // Live Clock Ticker
      const timer = setInterval(() => {
          setZuluTime(getCurrentMaritimeTime());
      }, 1000);

      // Simulated telemetry fetch using the active tenant's name
      // This part would ideally be dynamically linked to the user's vessel
      marinaExpert.getVesselTelemetry(activeTenantConfig.name).then((data) => {
          setTelemetry(data);
      });

      return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 font-mono text-zinc-800 dark:text-zinc-300 p-4 animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* Live Clock Header */}
        <div className="flex justify-between items-center bg-zinc-900/50 p-2 rounded-lg border border-zinc-800 mb-2">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} /> MARITIME TIME
            </div>
            <div className="font-mono text-sm font-bold text-indigo-400 tracking-wider">
                {zuluTime}
            </div>
        </div>

        {/* Captain Tabs */}
        <div className="flex gap-1 border-b border-zinc-800 pb-2 overflow-x-auto custom-scrollbar">
            {['overview', 'engineering', 'finance', 'bluecard'].map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveCaptainTab(tab as any)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-colors ${activeCaptainTab === tab ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}
                >
                    {tab}
                </button>
            ))}
        </div>

        {activeCaptainTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vessel Status</div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-emerald-500">SECURE</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-[10px] text-zinc-500">Location</div>
                            <div className="text-sm font-bold text-white">Pontoon C-12</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-zinc-500">Shore Power</div>
                            <div className={`text-sm font-bold ${telemetry?.shorePower.connected ? 'text-emerald-400' : 'text-amber-500'}`}>
                                {telemetry?.shorePower.connected ? 'CONNECTED' : 'DISCONNECTED'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ada Sea ONE Control */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                <Wifi size={12} /> ADA SEA ONE
                            </div>
                            <div className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                                CONNECTED
                            </div>
                        </div>
                        
                        {/* Remote Controls */}
                        <div className="grid grid-cols-2 gap-2">
                            <button className="bg-black/40 hover:bg-indigo-600/20 border border-zinc-700 hover:border-indigo-500/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                                <Thermometer size={16} className="text-zinc-400" />
                                <span className="text-[9px] uppercase text-zinc-500">AC: {telemetry?.comfort?.climate.currentTemp || '--'}°C</span>
                            </button>
                            <button className="bg-black/40 hover:bg-indigo-600/20 border border-zinc-700 hover:border-indigo-500/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                                <Zap size={16} className="text-yellow-500/70" />
                                <span className="text-[9px] uppercase text-zinc-500">Lights</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeCaptainTab === 'engineering' && (
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                {/* Battery Gauge */}
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <div className="flex justify-between mb-2">
                        <span className="text-[10px] text-zinc-500 uppercase">Service Bank</span>
                        <span className="text-xs font-bold text-white">{telemetry?.battery.serviceBank || '--'} V</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: '85%' }}></div>
                    </div>
                </div>
                
                {/* Tank Levels */}
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 uppercase mb-3">Fluid Levels</div>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-zinc-400">Fuel</span>
                                <span className="text-white">{telemetry?.tanks.fuel || '--'}%</span>
                            </div>
                            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${telemetry?.tanks.fuel || 0}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-zinc-400">Fresh Water</span>
                                <span className="text-white">{telemetry?.tanks.freshWater || '--'}%</span>
                            </div>
                            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${telemetry?.tanks.freshWater || 0}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-zinc-400">Black Water</span>
                                <span className="text-red-400">{telemetry?.tanks.blackWater || '--'}%</span>
                            </div>
                            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${telemetry?.tanks.blackWater || 0}%` }}></div>
                            </div>
                            {(telemetry?.tanks.blackWater || 0) > 90 && (
                                <div className="mt-2 text-right">
                                    <span className="text-[9px] text-red-500 font-bold uppercase animate-pulse">PUMP-OUT REQUIRED</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeCaptainTab === 'finance' && (
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldCheck size={64} />
                    </div>
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={12} className="text-blue-500"/> INSURANCE POLICY
                        </div>
                        <div className="bg-emerald-500/10 text-emerald-500 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                            ACTIVE
                        </div>
                    </div>
                    <div className="space-y-1 relative z-10">
                        <div className="text-lg font-bold text-zinc-200">Turk P&I <span className="text-xs font-normal text-zinc-500">Gold Hull & Machinery</span></div>
                        <div className="flex justify-between text-xs text-zinc-400">
                            <span>Policy #: TR-99281</span>
                            <span>Exp: 14 Days</span>
                        </div>
                    </div>
                    <button className="mt-4 w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-400 hover:text-white py-2 rounded text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        <Zap size={12} /> Get Renewal Quote
                    </button>
                </div>
            </div>
        )}

        {activeCaptainTab === 'bluecard' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-[10px] font-bold text-sky-500 uppercase tracking-widest flex items-center gap-2">
                        <Droplets size={12} /> DIGITAL BLUE KART (MAVİ KART)
                    </div>
                    <div className="bg-sky-500/10 text-sky-500 text-[9px] font-bold px-2 py-0.5 rounded border border-sky-500/20">
                        COMPLIANT
                    </div>
                </div>
                
                <div className="flex gap-4 items-center">
                    {/* QR Code Placeholder */}
                    <div className="w-16 h-16 bg-white p-1 rounded">
                        <div className="w-full h-full bg-black/10 flex items-center justify-center text-[8px] text-black font-mono text-center leading-none">
                            TR-CSB<br/>DIGITAL<br/>VERIFIED
                        </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-[10px] border-b border-zinc-800 pb-1">
                            <span className="text-zinc-500">Card ID</span>
                            <span className="font-mono text-zinc-300">WIM-99281-25</span>
                        </div>
                        <div className="flex justify-between text-[10px] border-b border-zinc-800 pb-1">
                            <span className="text-zinc-500">Last Discharge</span>
                            <span className="font-mono text-emerald-500">2 Days Ago</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                            <span className="text-zinc-500">Next Mandatory</span>
                            <span className="font-mono text-amber-500">12 Days</span>
                        </div>
                    </div>
                </div>
                
                <button className="w-full mt-4 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/50 text-sky-400 hover:text-white py-2 rounded text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <Recycle size={12} /> Request Pump-out
                </button>
            </div>
        )}
    </div>
  );
};