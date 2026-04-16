
import React from 'react';
import { Anchor } from 'lucide-react';
import { wimMasterData } from '../../../services/wimMasterData';

interface BerthsTabProps {
  berthAllocation: any;
}

export const BerthsTab: React.FC<BerthsTabProps> = ({ berthAllocation }) => {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-widest flex items-center gap-2"><Anchor size={14} /> Harbormaster Control</h3>
        <div className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded font-bold">Dynamic Pricing Active</div>
      </div>
      {berthAllocation && (
        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Inbound Vessel Analysis</div>
          <div className="bg-white dark:bg-zinc-900 p-3 rounded border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <div className="flex justify-between items-start mb-2">
              <div><div className="font-bold text-indigo-500">S/Y Phisedelia</div><div className="text-[10px] text-zinc-500">VO65 Racing Yacht (ex-Mapfre) • 20.4m x 5.6m</div></div>
              <div className="text-right"><div className="text-lg font-bold text-emerald-500">€{berthAllocation.priceQuote}</div><div className="text-[9px] text-zinc-400">per day (Dynamic)</div></div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-500 font-medium">Optimal Allocation</span>
                <div className="flex items-center gap-2"><span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">{berthAllocation.berth}</span><span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20">CONFIRMED</span></div>
              </div>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/10 rounded text-indigo-700 dark:text-indigo-300 italic border border-indigo-100 dark:border-indigo-800/30">"{berthAllocation.reasoning}"</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
