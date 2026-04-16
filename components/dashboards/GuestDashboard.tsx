

import React, { useState } from 'react';
import { Car, CheckCircle2, Zap, Utensils, Calendar, Wind, PartyPopper, QrCode, MapPin, Scan } from 'lucide-react';
import { UserProfile, TenantConfig } from '../../types';
import { wimMasterData } from '../../services/wimMasterData';
import { securityExpert } from '../../services/agents/securityAgent';
import { TENANT_CONFIG } from '../../services/config';

interface GuestDashboardProps {
  userProfile: UserProfile;
}

export const GuestDashboard: React.FC<GuestDashboardProps> = ({ userProfile }) => {
  const upcomingEvents = TENANT_CONFIG.masterData.event_calendar || [];
  const [accessStatus, setAccessStatus] = useState<'INSIDE' | 'OUTSIDE'>('OUTSIDE');
  const [lastGate, setLastGate] = useState<string | null>(null);

  // Generate a mock QR Data string unique to the user
  const qrData = JSON.stringify({
      uid: userProfile.id,
      name: userProfile.name,
      valid: '24H',
      ts: Date.now()
  });
  
  // Use a public API to generate the QR image based on the data
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}&color=000000&bgcolor=ffffff`;

  const simulateGateScan = async (gate: string) => {
      const newStatus = accessStatus === 'INSIDE' ? 'OUTSIDE' : 'INSIDE';
      await securityExpert.processAccessPass(userProfile.name, gate, newStatus === 'INSIDE' ? 'ENTRY' : 'EXIT', () => {});
      setAccessStatus(newStatus);
      setLastGate(gate);
  };

  return (
    <div className="space-y-6 font-sans text-zinc-800 dark:text-zinc-200 p-4 animate-in fade-in slide-in-from-right-4 duration-500">
        {/* Welcome & Status */}
        <div className="flex items-center justify-between">
            <div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Welcome Back</div>
                <div className="text-xl font-bold">{userProfile.name}</div>
            </div>
            <div className="text-right">
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Membership</div>
                <div className="text-sm font-bold text-indigo-500">PLATINUM</div>
            </div>
        </div>

        {/* --- NEW: DIGITAL ACCESS PASS (QR) --- */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden relative group">
            {/* Holographic Top Bar */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
            
            <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                {/* QR Code Area */}
                <div className="bg-white p-2 rounded-xl shadow-inner border border-zinc-100 flex-shrink-0 relative">
                    <img src={qrImageUrl} alt="Access QR" className="w-32 h-32 object-contain mix-blend-multiply opacity-90" />
                    <div className="absolute inset-0 border-[3px] border-indigo-500/20 rounded-xl pointer-events-none"></div>
                    <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1 rounded-full shadow-lg">
                        <Scan size={14} />
                    </div>
                </div>

                {/* Info Area */}
                <div className="flex-1 w-full text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-between mb-2">
                        <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                            <QrCode size={16} className="text-indigo-500" /> Ada Access Pass
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${accessStatus === 'INSIDE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                            {accessStatus === 'INSIDE' ? '● ON PREMISES' : '○ AWAY'}
                        </span>
                    </div>
                    
                    <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                        Use this QR code at turnstiles and security gates for contactless entry/exit.
                        {lastGate && <span className="block mt-1 text-indigo-500 font-medium">Last Activity: {lastGate} ({new Date().toLocaleTimeString()})</span>}
                    </p>

                    {/* Simulation Controls (Hidden in Production) */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <button 
                            onClick={() => simulateGateScan('Main Gate A')}
                            className="flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-200 text-xs font-bold py-2 rounded-lg transition-all"
                        >
                            <MapPin size={12} /> {accessStatus === 'OUTSIDE' ? 'Enter Gate A' : 'Exit Gate A'}
                        </button>
                        <button 
                            onClick={() => simulateGateScan('VIP Turnstile')}
                            className="flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-zinc-200 dark:border-zinc-700 hover:border-purple-200 text-xs font-bold py-2 rounded-lg transition-all"
                        >
                            <Zap size={12} /> {accessStatus === 'OUTSIDE' ? 'VIP Entry' : 'VIP Exit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* ISPARK Validation Widget */}
        <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <div className="flex justify-between items-start mb-3">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Car size={12} /> MY GARAGE (ISPARK INTEGRATION)
                </div>
                <div className="bg-emerald-500/10 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                    ACTIVE
                </div>
            </div>
            
            <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 cursor-pointer ring-1 ring-indigo-500">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span className="font-mono font-bold">34 XX 99</span>
                        <span className="text-xs text-zinc-500">Porsche 911</span>
                    </div>
                    <CheckCircle2 size={14} className="text-indigo-500"/>
                </div>
                <div className="flex items-center justify-between p-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 opacity-60">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-zinc-300 rounded-full"></div>
                        <span className="font-mono font-bold">34 AA 01</span>
                        <span className="text-xs text-zinc-500">Range Rover</span>
                    </div>
                </div>
            </div>

            <button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                <Zap size={12} /> Validate Exit (Free)
            </button>
        </div>

        {/* Active Dining Reservation */}
        <div className="bg-zinc-900 text-white p-4 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Utensils size={64} />
            </div>
            <div className="relative z-10">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Utensils size={12} /> DINING RESERVATION
                </div>
                <div className="text-lg font-bold text-white mb-1">Poem Restaurant</div>
                <div className="flex justify-between text-xs text-zinc-300 mb-3">
                    <span>Today, 19:30</span>
                    <span>4 Guests</span>
                </div>
                <div className="bg-white/10 p-2 rounded border border-white/10 text-[10px] space-y-1">
                    <div className="flex justify-between">
                        <span className="text-zinc-400">Pre-Order:</span>
                        <span className="text-emerald-400">Sea Bass x2</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-400">Kitchen Status:</span>
                        <span className="text-yellow-400 animate-pulse">PREPARING</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Event Calendar */}
        <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Calendar size={12} /> Upcoming Events
            </h3>
            <div className="space-y-2">
                {upcomingEvents.map((evt: any) => (
                    <div key={evt.id} className="flex gap-3 p-3 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-indigo-500/50 transition-colors cursor-pointer">
                        <div className="flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-700 rounded p-2 min-w-[50px]">
                            <span className="text-xs font-bold text-zinc-500 uppercase">{new Date(evt.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200">{new Date(evt.date).getDate()}</span>
                        </div>
                        <div>
                            <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{evt.name}</div>
                            <div className="text-[10px] text-zinc-500 uppercase mt-1 flex items-center gap-1">
                                {evt.type === 'Race' ? <Wind size={10}/> : <PartyPopper size={10}/>}
                                {evt.type} • {evt.location || 'Marina'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};