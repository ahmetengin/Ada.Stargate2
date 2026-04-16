
import React, { useState } from 'react';
import { X, Brain, AlertCircle, Layers, Activity, CheckCircle2, Circle, Clock, Scale } from 'lucide-react';
import { AgentTraceLog } from '../types';

interface AgentTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  traces: AgentTraceLog[];
}

// --- CAPABILITY MATRIX DEFINITION ---
// This maps the current codebase capabilities to specific scenarios.
const CAPABILITY_MATRIX = [
    {
        domain: 'MARINA OPS',
        color: 'text-emerald-500',
        scenarios: [
            { name: 'Proactive Arrival (Welcome Home)', status: 'ACTIVE' },
            { name: 'Departure Protocol (ATC)', status: 'ACTIVE' },
            { name: 'Tender Dispatch & Routing', status: 'ACTIVE' },
            { name: 'Radar / AIS Surveillance', status: 'ACTIVE' },
            { name: 'Ambarlı Traffic Conflict', status: 'ACTIVE' },
            { name: 'Sector Zulu Sequencing', status: 'ACTIVE' },
        ]
    },
    {
        domain: 'FINANCE',
        color: 'text-amber-500',
        scenarios: [
            { name: 'Real-time Debt Check', status: 'ACTIVE' },
            { name: 'Auto-Invoicing (Parasut)', status: 'ACTIVE' },
            { name: 'Payment Link Gen (Iyzico)', status: 'ACTIVE' },
            { name: 'Bank Reconciliation (Garanti)', status: 'BETA' },
            { name: 'Loyalty Score Calculation', status: 'ACTIVE' },
        ]
    },
    {
        domain: 'SECURITY & SAFETY',
        color: 'text-red-500',
        scenarios: [
            { name: 'Incident Protocol (Collision)', status: 'ACTIVE' },
            { name: 'CCTV Analysis (Simulated)', status: 'ACTIVE' },
            { name: 'Guardian Protocol (Red Alert)', status: 'ACTIVE' },
            { name: 'Muster / Casualty Tracking', status: 'ACTIVE' },
            { name: 'Departure Ban Enforcement', status: 'ACTIVE' },
        ]
    },
    {
        domain: 'LEGAL & REGULATION',
        color: 'text-blue-500',
        scenarios: [
            { name: 'Contract Inquiry (RAG)', status: 'ACTIVE' },
            { name: 'COLREGs Advisory', status: 'ACTIVE' },
            { name: 'Cross-Border (Greece/TR)', status: 'ACTIVE' },
            { name: 'KVKK/GDPR Compliance', status: 'ACTIVE' },
            { name: 'Self-Adapting Rules (SEAL)', status: 'PLANNED' },
        ]
    },
    {
        domain: 'TECHNICAL',
        color: 'text-purple-500',
        scenarios: [
            { name: 'Service Scheduling', status: 'ACTIVE' },
            { name: 'Job Status Tracking', status: 'ACTIVE' },
            { name: 'Telemetry Monitoring (IoT)', status: 'BETA' },
            { name: 'Remote Control (Ada Sea ONE)', status: 'BETA' },
        ]
    },
    {
        domain: 'CONCIERGE',
        color: 'text-pink-500',
        scenarios: [
            { name: 'General Inquiry (Amenities)', status: 'ACTIVE' },
            { name: 'VHF Switchboard Mode', status: 'ACTIVE' },
            { name: 'Digital Pass (PassKit)', status: 'ACTIVE' },
            { name: 'Payment Plan Negotiation', status: 'ACTIVE' },
        ]
    }
];

export const AgentTraceModal: React.FC<AgentTraceModalProps> = ({ isOpen, onClose, traces }) => {
  const [activeTab, setActiveTab] = useState<'live_trace' | 'coverage'>('live_trace');

  if (!isOpen) return null;

  const getTraceStyle = (trace: AgentTraceLog) => {
    if (trace.isError || trace.step === 'ERROR') return 'bg-red-900/40 border-l-2 border-red-500';
    switch (trace.step) {
      case 'TOOL_CALL':
      case 'TOOL_EXECUTION':
        return 'bg-blue-900/20 border-l-2 border-blue-500';
      case 'CODE_OUTPUT': 
        return 'bg-zinc-800/50 border-l-2 border-zinc-600';
      case 'PLANNING': 
      case 'ROUTING':
      case 'THINKING':
        return 'border-l-2 border-transparent';
      case 'FINAL_ANSWER': 
      case 'OUTPUT':
        return 'bg-green-900/20 border-l-2 border-green-500';
      case 'VOTING':
        return 'bg-purple-900/20 border-l-2 border-purple-500';
      default: return 'border-l-2 border-transparent';
    }
  };

  const getStepIcon = (trace: AgentTraceLog) => {
    if (trace.isError || trace.step === 'ERROR') {
      return <AlertCircle size={12} className="text-red-400 animate-pulse" />;
    }
    if (trace.step === 'VOTING') {
        return <Scale size={12} className="text-purple-400" />;
    }
    return <div className="w-3 h-3" />;
  };

  const renderContent = (content: any) => {
    if (typeof content === 'object') {
      return JSON.stringify(content, null, 2);
    }
    return String(content);
  };

  // Calculate Readiness Score
  const totalScenarios = CAPABILITY_MATRIX.reduce((acc, domain) => acc + domain.scenarios.length, 0);
  const activeScenarios = CAPABILITY_MATRIX.reduce((acc, domain) => acc + domain.scenarios.filter(s => s.status === 'ACTIVE').length, 0);
  const readinessScore = Math.round((activeScenarios / totalScenarios) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="w-full max-w-4xl h-[85vh] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-zinc-800 flex-shrink-0 bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-indigo-400">
                <Brain size={18} />
                <h2 className="font-bold tracking-wider text-sm">SYSTEM INTELLIGENCE</h2>
            </div>
            
            {/* Tab Switcher */}
            <div className="flex bg-zinc-900 rounded p-1 border border-zinc-800">
                <button 
                    onClick={() => setActiveTab('live_trace')}
                    className={`px-3 py-1 rounded transition-colors flex items-center gap-2 ${activeTab === 'live_trace' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Activity size={12} /> Live Trace
                </button>
                <button 
                    onClick={() => setActiveTab('coverage')}
                    className={`px-3 py-1 rounded transition-colors flex items-center gap-2 ${activeTab === 'coverage' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Layers size={12} /> Neural Coverage
                </button>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800">
            <X size={18} />
          </button>
        </header>

        {/* CONTENT: LIVE TRACE */}
        {activeTab === 'live_trace' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar bg-black/20">
            {traces.length > 0 ? traces.map((trace) => (
                <div key={trace.id} className={`flex gap-3 p-2 rounded transition-colors ${getTraceStyle(trace)}`}>
                <div className="flex-shrink-0 w-20 opacity-60 text-zinc-500">{trace.timestamp}</div>
                <div className="flex-shrink-0 w-28 font-bold uppercase tracking-wider flex items-center gap-2">
                    {getStepIcon(trace)}
                    <span className={trace.persona === 'ORCHESTRATOR' ? 'text-indigo-400' : trace.persona === 'EXPERT' ? 'text-sky-400' : 'text-zinc-400'}>
                        {trace.persona || 'NODE'}
                    </span>
                </div>
                <div className="flex-shrink-0 w-28 text-zinc-400">{trace.step}</div>
                <code className="break-words leading-relaxed whitespace-pre-wrap text-zinc-300 flex-1 font-mono">
                    {renderContent(trace.content)}
                </code>
                </div>
            )) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2">
                    <Activity size={32} className="opacity-20"/>
                    <span>No active neural activity detected in current session.</span>
                </div>
            )}
            </div>
        )}

        {/* CONTENT: NEURAL COVERAGE */}
        {activeTab === 'coverage' && (
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-zinc-950">
                {/* Score Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-zinc-200">Capability Matrix</h3>
                        <p className="text-zinc-500 mt-1">Active Agent Skills & Response Protocols</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black text-emerald-500">{readinessScore}%</div>
                        <div className="text-[10px] uppercase tracking-widest text-zinc-500">System Readiness</div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-6">
                    {CAPABILITY_MATRIX.map((domain, idx) => (
                        <div key={idx} className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/20">
                            <h4 className={`text-sm font-bold mb-4 uppercase tracking-widest ${domain.color} flex items-center gap-2`}>
                                <div className={`w-2 h-2 rounded-full bg-current`}></div>
                                {domain.domain}
                            </h4>
                            <div className="space-y-2">
                                {domain.scenarios.map((scenario, sIdx) => (
                                    <div key={sIdx} className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800/50">
                                        <span className="text-zinc-300">{scenario.name}</span>
                                        <div className="flex items-center gap-2">
                                            {scenario.status === 'ACTIVE' && <CheckCircle2 size={14} className="text-emerald-500" />}
                                            {scenario.status === 'BETA' && <Activity size={14} className="text-amber-500" />}
                                            {scenario.status === 'PLANNED' && <Clock size={14} className="text-zinc-600" />}
                                            
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                scenario.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' :
                                                scenario.status === 'BETA' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-zinc-800 text-zinc-500'
                                            }`}>
                                                {scenario.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};