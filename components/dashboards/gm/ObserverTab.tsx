
import React, { useState } from 'react';
import { Activity, Brain, CheckCircle2, Clock, Layers, Terminal } from 'lucide-react';
import { AgentTraceLog } from '../../../types';

interface ObserverTabProps {
  traces: AgentTraceLog[];
}

export const ObserverTab: React.FC<ObserverTabProps> = ({ traces }) => {
  const [view, setView] = useState<'stream' | 'matrix'>('stream');

  const getTraceStyle = (trace: AgentTraceLog) => {
    if (trace.isError || trace.step === 'ERROR') return 'border-l-2 border-red-500 bg-red-900/10';
    switch (trace.step) {
      case 'TOOL_CALL':
      case 'TOOL_EXECUTION': return 'border-l-2 border-blue-500 bg-blue-900/10';
      case 'CODE_OUTPUT': return 'border-l-2 border-zinc-500 bg-zinc-900/50';
      case 'PLANNING': 
      case 'THINKING': return 'border-l-2 border-purple-500 bg-purple-900/10';
      case 'FINAL_ANSWER': 
      case 'OUTPUT': return 'border-l-2 border-emerald-500 bg-emerald-900/10';
      default: return 'border-l-2 border-zinc-700';
    }
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 animate-in fade-in duration-300 h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-widest flex items-center gap-2">
            <Brain size={14} className="text-indigo-500" /> Neural Observer
            </h3>
            <div className="text-[10px] text-zinc-500 font-mono mt-1">
                Live Event Stream & Capability Matrix
            </div>
        </div>
        <div className="flex bg-zinc-200 dark:bg-zinc-800 rounded p-1">
            <button onClick={() => setView('stream')} className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${view === 'stream' ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-500' : 'text-zinc-500 hover:text-zinc-300'}`}><Terminal size={12} /> Stream</button>
            <button onClick={() => setView('matrix')} className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${view === 'matrix' ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-500' : 'text-zinc-500 hover:text-zinc-300'}`}><Layers size={12} /> Matrix</button>
        </div>
      </div>

      {view === 'stream' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 p-1">
            {traces.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                    <Activity size={32} className="opacity-20 mb-2" />
                    <span className="text-xs">No neural activity detected in current session.</span>
                </div>
            ) : (
                traces.slice().reverse().map((trace) => (
                    <div key={trace.id} className={`p-2 rounded text-xs font-mono ${getTraceStyle(trace)}`}>
                        <div className="flex justify-between mb-1 opacity-70">
                            <span>{trace.timestamp}</span>
                            <span className="uppercase font-bold">{trace.node}</span>
                        </div>
                        <div className="font-bold mb-1 text-indigo-400">{trace.step}</div>
                        <div className="whitespace-pre-wrap break-words text-zinc-600 dark:text-zinc-300">
                            {typeof trace.content === 'object' ? JSON.stringify(trace.content, null, 2) : trace.content}
                        </div>
                    </div>
                ))
            )}
          </div>
      )}
      {view === 'matrix' && <div className="text-zinc-500 text-center p-10">Matrix View Placeholder</div>}
    </div>
  );
};
