
import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const BreachRadar: React.FC = () => {
  const breaches = [
    { id: 'BR-01', vessel: 'Speedboat X', issue: 'Restricted Zone', severity: 'CRITICAL', time: '10:42' },
    { id: 'BR-02', vessel: 'S/Y Mistral', issue: 'Overstay (48h)', severity: 'MEDIUM', time: '09:15' },
    { id: 'BR-03', vessel: 'JetSki-04', issue: 'Speeding (8kn)', severity: 'HIGH', time: '11:05' },
  ];

  return (
    <div className="flex flex-col">
        {/* Render List Directly */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {breaches.map(b => (
                <div key={b.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${b.severity === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'}`}>
                            {b.severity === 'CRITICAL' ? <ShieldAlert size={16} /> : <AlertTriangle size={16} />}
                        </div>
                        <div>
                            <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{b.vessel}</div>
                            <div className="text-[10px] text-zinc-500 uppercase">{b.issue}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-[9px] font-bold px-2 py-0.5 rounded inline-block ${b.severity === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-amber-500/10 text-amber-600'}`}>
                            {b.severity}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-1 font-mono">{b.time}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
