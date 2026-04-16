
import React from 'react';
import { Activity, ShieldCheck, User, Hash } from 'lucide-react';
import { VesselIntelligenceProfile } from '../types';
import { maskFullName } from '../services/utils';

interface VesselCardProps {
    profile: VesselIntelligenceProfile;
}

export const VesselCard: React.FC<VesselCardProps> = ({ profile }) => {
    return (
        <div className="mt-6 border border-white/5 bg-[#0a121e] p-4 rounded font-mono text-xs shadow-xl animate-in fade-in slide-in-from-left-2 max-w-md">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                <div className="text-teal-500 font-bold uppercase tracking-widest flex items-center gap-2 text-[10px]">
                    <ShieldCheck size={12} /> TARGET PROFILE
                </div>
                <div className="text-[9px] text-teal-500/50 font-bold flex items-center gap-1 animate-pulse">
                    <Activity size={10} /> LIVE
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div className="col-span-2 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white">{profile.name}</span>
                    <span className="text-[10px] text-zinc-600 font-bold bg-zinc-900 px-1.5 py-0.5 rounded">IMO {profile.imo}</span>
                </div>

                <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-600 uppercase font-bold mb-0.5">Type</span>
                    <span className="text-zinc-300">{profile.type}</span>
                </div>

                <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-600 uppercase font-bold mb-0.5">Flag</span>
                    <span className="text-zinc-300">{profile.flag}</span>
                </div>

                <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-600 uppercase font-bold mb-0.5">Dimensions</span>
                    <span className="text-zinc-300">{profile.loa}m x {profile.beam}m</span>
                </div>

                <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-600 uppercase font-bold mb-0.5">Owner</span>
                    <span className="text-zinc-300 flex items-center gap-1"><User size={10} className="text-zinc-500"/> {maskFullName(profile.ownerName || 'N/A')}</span>
                </div>

                {profile.outstandingDebt && profile.outstandingDebt > 0 && (
                    <div className="col-span-2 mt-2">
                        <div className="bg-red-500/5 border border-red-500/20 text-red-400 px-3 py-2 rounded flex justify-between items-center">
                            <span className="text-[9px] font-bold uppercase">Outstanding Balance</span>
                            <span className="font-bold">€{profile.outstandingDebt}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
