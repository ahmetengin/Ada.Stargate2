
import React from 'react';
import { Anchor, DollarSign, Radio, Navigation, Ship, Clock, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { RegistryEntry, Tender, VhfLog, AisTarget } from '../../../types';
import { getCurrentMaritimeTime } from '../../../services/utils';
import { LiveMap } from './LiveMap';
import { BreachRadar } from './BreachRadar';
import { FinanceWidget } from './FinanceWidget';

interface OpsTabProps {
  vesselsInPort: number;
  registry: RegistryEntry[];
  criticalLogs: any[];
  tenders: Tender[];
  vhfLogs: VhfLog[];
  aisTargets?: AisTarget[];
}

export const OpsTab: React.FC<OpsTabProps> = ({ vesselsInPort, registry, criticalLogs, tenders, vhfLogs, aisTargets = [] }) => {
  
  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
          {/* 1. HUD ROW (Flat KPIs) */}
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 pt-2">
            <div className="flex items-center gap-6">
                <div>
                    <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1 flex items-center gap-2">
                        <Anchor size={12} /> Occupancy
                    </div>
                    <div className="text-3xl font-black text-zinc-800 dark:text-zinc-100 leading-none">
                        {vesselsInPort} <span className="text-lg font-medium text-zinc-400">/ 600</span>
                    </div>
                </div>
                <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800"></div>
                <div>
                    <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1 flex items-center gap-2">
                        <Navigation size={12} /> Radar Targets
                    </div>
                    <div className="text-3xl font-black text-indigo-500 leading-none">
                        {aisTargets.length}
                    </div>
                </div>
                <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800"></div>
                <div>
                    <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1 flex items-center gap-2">
                        <DollarSign size={12} /> Yield (Est)
                    </div>
                    <div className="text-3xl font-black text-emerald-500 leading-none">
                        €{(vesselsInPort * 1.5 * 100 / 1000).toFixed(1)}k
                    </div>
                </div>
            </div>

            <div className="text-right bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-lg">
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center justify-end gap-2">
                    <Clock size={12} /> Maritime Time (UTC)
                </div>
                <div className="text-xl font-mono font-bold text-amber-500">
                    {getCurrentMaritimeTime().split(' ')[0]}
                </div>
            </div>
          </div>

          {/* 2. DIGITAL TWIN (Hero Section) */}
          <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-widest flex items-center gap-2">
                      <Navigation size={16} className="text-sky-500" /> Live Sector Map
                  </h3>
                  <div className="flex gap-4 text-[10px] font-bold uppercase">
                      <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Occupied</span>
                      <span className="flex items-center gap-2 text-red-600 dark:text-red-400"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Breach</span>
                  </div>
              </div>
              <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <LiveMap />
              </div>
          </div>

          {/* 3. INFO STREAM (Flat Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-zinc-200 dark:border-zinc-800 pt-8">
              
              {/* COL 1: BREACH & FINANCE */}
              <div className="space-y-8">
                  {/* Breach Section */}
                  <div>
                      <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Target size={14} /> Active Alerts
                      </h3>
                      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                          <BreachRadar />
                      </div>
                  </div>

                  {/* Finance Section */}
                  <div>
                      <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <TrendingUp size={14} /> Cash Flow Stream
                      </h3>
                      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                          <FinanceWidget />
                      </div>
                  </div>
              </div>

              {/* COL 2: FLEET STATUS */}
              <div>
                  <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                          <Ship size={14} /> Asset Status
                      </h3>
                      <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded font-bold">{tenders.length} Units</span>
                  </div>
                  
                  <div className="space-y-3">
                      {tenders.map((tender) => (
                          <div key={tender.id} className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-amber-500/50 transition-colors">
                              <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-full ${tender.status === 'Busy' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
                                      <Ship size={16} />
                                  </div>
                                  <div>
                                      <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{tender.name}</div>
                                      <div className="text-[10px] text-zinc-500 uppercase">{tender.status}</div>
                                  </div>
                              </div>
                              {tender.status === 'Busy' && (
                                  <div className="text-right">
                                      <div className="text-[9px] text-zinc-400 uppercase">Mission</div>
                                      <div className="text-xs font-bold text-indigo-500">{tender.assignment}</div>
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>

              {/* COL 3: VHF FEED */}
              <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Radio size={14} /> Live Comms (CH 72)
                  </h3>
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 font-mono text-xs h-full min-h-[400px] flex flex-col">
                      <div className="flex-1 space-y-4">
                          {vhfLogs.length === 0 ? (
                              <div className="text-zinc-600 text-center italic mt-10">Channel Silent...</div>
                          ) : (
                              vhfLogs.slice().reverse().map((log, idx) => (
                                  <div key={idx} className="border-l-2 border-zinc-700 pl-3">
                                      <div className="flex justify-between items-baseline mb-1">
                                          <span className={`font-bold ${log.speaker === 'VESSEL' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                                              {log.speaker === 'VESSEL' ? 'UNKNOWN VESSEL' : 'WIM CONTROL'}
                                          </span>
                                          <span className="text-[10px] text-zinc-600">{log.timestamp}</span>
                                      </div>
                                      <p className="text-zinc-300 leading-relaxed opacity-80">{log.message}</p>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              </div>

          </div>
        </div>
    </div>
  );
};
