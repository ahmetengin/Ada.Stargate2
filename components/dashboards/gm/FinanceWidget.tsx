
import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const FinanceWidget: React.FC = () => {
  const transactions = [
    { id: 'TX-99', desc: 'Mooring: Blue Horizon', amount: 1200, status: 'SUCCESS', type: 'IN' },
    { id: 'TX-98', desc: 'Market: Guest #22', amount: 45, status: 'SUCCESS', type: 'IN' },
    { id: 'TX-97', desc: 'Fuel: Tender Alpha', amount: 350, status: 'PENDING', type: 'OUT' },
    { id: 'TX-96', desc: 'Lift: S/Y Aegeas', amount: 850, status: 'SUCCESS', type: 'IN' },
    { id: 'TX-95', desc: 'Restaurant: Poem', amount: 120, status: 'SUCCESS', type: 'IN' },
  ];

  return (
    <div className="flex flex-col">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {transactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-full ${tx.type === 'IN' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                            {tx.type === 'IN' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        </div>
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">{tx.desc}</span>
                    </div>
                    <div className={`font-mono font-bold text-sm ${tx.type === 'IN' ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>
                        {tx.type === 'IN' ? '+' : '-'}€{tx.amount}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
