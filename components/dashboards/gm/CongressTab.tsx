
import React from 'react';
import { Activity } from 'lucide-react';
import { CongressEvent, Delegate } from '../../../types';

interface CongressTabProps {
  eventDetails: CongressEvent | null;
  delegates: Delegate[];
}

export const CongressTab: React.FC<CongressTabProps> = ({ eventDetails, delegates }) => {
  if (!eventDetails) return <div>Loading Event Data...</div>;

  return (
    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 animate-in fade-in duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2"><Activity size={12} /> ADA.CONGRESS.KITES</div>
          <div className="text-lg font-bold text-zinc-800 dark:text-zinc-200">{eventDetails.name}</div>
        </div>
        <div className="bg-indigo-500/10 text-indigo-500 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-500/20">{eventDetails.status}</div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-700">
            <div className="text-[10px] text-zinc-500 uppercase">Registered</div>
            <div className="text-xl font-bold">{eventDetails.delegateCount}</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-700">
            <div className="text-[10px] text-zinc-500 uppercase">Checked-In</div>
            <div className="text-xl font-bold text-emerald-500">{delegates.filter(d => d.status === 'CHECKED_IN').length}</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-700">
            <div className="text-[10px] text-zinc-500 uppercase">In Transit</div>
            <div className="text-xl font-bold text-amber-500">{delegates.filter(d => d.status === 'IN_TRANSIT').length}</div>
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Delegate Status</div>
          <div className="space-y-2 text-xs">
            {delegates.map(del => (
              <div key={del.id} className="flex justify-between items-center p-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700">
                <div><span className="font-bold">{del.name}</span><span className="text-zinc-500 ml-2">({del.company})</span></div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${del.status === 'CHECKED_IN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{del.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
