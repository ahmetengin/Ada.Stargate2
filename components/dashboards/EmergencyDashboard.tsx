
import React from 'react';
import { Siren, Map as MapIcon, Wind, Anchor } from 'lucide-react';

export const EmergencyDashboard: React.FC = () => {
  return (
      <div className="h-full flex flex-col bg-zinc-950 border-l-4 border-red-600 p-6 animate-pulse-slow overflow-y-auto">
          <div className="flex items-center justify-between border-b border-red-900/50 pb-6 mb-6">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-600 rounded-lg animate-pulse">
                      <Siren size={32} className="text-white" />
                  </div>
                  <div>
                      <h1 className="text-3xl font-black text-red-500 tracking-tighter">GUARDIAN PROTOCOL</h1>
                      <div className="text-xs font-mono text-red-400/70">CODE RED ACTIVE • SILENCE PROTOCOL IN EFFECT</div>
                  </div>
              </div>
              <div className="text-right">
                  <div className="text-4xl font-black text-red-600">00:04:12</div>
                  <div className="text-[10px] uppercase tracking-widest text-red-800">Time Elapsed</div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
              <div className="space-y-6">
                  <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl">
                      <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <MapIcon size={14} /> Incident Zone
                      </h3>
                      <div className="text-2xl font-bold text-white mb-1">Pontoon A-05</div>
                      <div className="text-sm text-red-400">Type: Collision / Fire Risk</div>
                  </div>

                  <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl">
                      <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Wind size={14} /> Environmental Factors
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <div className="text-[10px] text-red-400 uppercase">Wind Dir</div>
                              <div className="text-xl font-bold text-white">NW (310°)</div>
                              <div className="text-[10px] text-zinc-500">Pushing smoke to sea</div>
                          </div>
                          <div>
                              <div className="text-[10px] text-red-400 uppercase">Speed</div>
                              <div className="text-xl font-bold text-white">18 kn</div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="space-y-6">
                  <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl h-full">
                      <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Anchor size={14} /> Asset Status
                      </h3>
                      <div className="space-y-3">
                          <div className="flex justify-between items-center p-2 bg-red-900/20 rounded border border-red-900/30">
                              <span className="text-sm font-bold text-white">wimCharlie (Fire)</span>
                              <span className="text-xs font-bold text-emerald-500 bg-emerald-900/20 px-2 py-1 rounded">ON SCENE</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-red-900/20 rounded border border-red-900/30">
                              <span className="text-sm font-bold text-white">wimAlfa (Rescue)</span>
                              <span className="text-xs font-bold text-yellow-500 bg-yellow-900/20 px-2 py-1 rounded">EN ROUTE (2m)</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-red-900/20 rounded border border-red-900/30">
                              <span className="text-sm font-bold text-white">Security Patrol</span>
                              <span className="text-xs font-bold text-emerald-500 bg-emerald-900/20 px-2 py-1 rounded">PERIMETER SECURE</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};
