
import React from 'react';
import { Ship } from 'lucide-react';
import { Tender } from '../../../types';

interface FleetTabProps {
  tenders: Tender[];
}

export const FleetTab: React.FC<FleetTabProps> = ({ tenders }) => {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 animate-in fade-in duration-300">
      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4 uppercase tracking-widest flex items-center gap-2">
        <Ship size={14} /> Fleet Status (Tenders)
      </h3>
      <div className="space-y-3">
        {tenders.map((tender) => {
          const statusColor = tender.status === 'Idle' ? 'bg-emerald-500' : tender.status === 'Busy' ? 'bg-amber-500' : 'bg-red-500';
          return (
            <div key={tender.id} className="flex justify-between items-center p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                <div>
                  <span className="font-mono font-bold text-sm text-zinc-800 dark:text-zinc-200">{tender.name}</span>
                  <span className="block text-[10px] text-zinc-500 uppercase">{tender.status}</span>
                </div>
              </div>
              {tender.status === 'Busy' && tender.assignment && (
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block">ASSIGNED TO</span>
                  <span className="font-mono font-bold text-sm text-indigo-500">{tender.assignment}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
