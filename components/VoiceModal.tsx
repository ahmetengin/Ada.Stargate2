
import React, { useEffect, useState } from 'react';
import { X, Mic, Radio, SignalHigh, Waves, Power, AlertTriangle, RefreshCw, Activity } from 'lucide-react';
import { LiveSession } from '../services/geminiService';
import { LiveConnectionState, UserProfile } from '../types';
import { wimMasterData } from '../services/wimMasterData';
import { formatCoordinate } from '../services/utils';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onTranscriptReceived: (userText: string, modelText: string) => void;
  channel: string;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose, userProfile, onTranscriptReceived, channel }) => {
  const [status, setStatus] = useState<LiveConnectionState>(LiveConnectionState.Disconnected);
  const [audioLevel, setAudioLevel] = useState(0);
  const [session, setSession] = useState<LiveSession | null>(null);
  const [showProtocol, setShowProtocol] = useState(false);

  // Get coordinates from wimMasterData
  const { lat, lng } = wimMasterData.identity.location.coordinates;

  const formattedLat = formatCoordinate(lat, 'lat');
  const formattedLng = formatCoordinate(lng, 'lng');
  const displayCoordinates = `${formattedLat} / ${formattedLng}`;

  useEffect(() => {
    if (isOpen && status === LiveConnectionState.Disconnected) {
      connect();
    }

    return () => {
      // Cleanup handled by disconnect button for now, but safety here
    };
  }, [isOpen]);

  const connect = async () => {
      const newSession = new LiveSession();
      
      newSession.onStatusChange = (s) => {
        setStatus(s as LiveConnectionState);
      };
      
      newSession.onAudioLevel = (level) => {
        // Smooth the level for visualization
        setAudioLevel(prev => prev * 0.8 + level * 0.2);
      };

      newSession.onTurnComplete = (userText, modelText) => {
          onTranscriptReceived(userText, modelText);
      };

      setSession(newSession);
      // Pass userProfile to connect for RBAC
      newSession.connect(userProfile);
  };

  const handleDisconnect = async () => {
    if (session) {
      await session.disconnect();
    }
    onClose();
    setStatus(LiveConnectionState.Disconnected);
    setSession(null);
  };

  const handleRetry = async () => {
      if (session) await session.disconnect();
      setStatus(LiveConnectionState.Connecting); // Set to connecting immediately for UI feedback
      setTimeout(() => connect(), 500);
  };

  const getChannelLabel = (ch: string) => {
      if (ch === '16') return 'DISTRESS';
      if (ch === '72') return 'MARINA';
      if (ch === 'SCAN') return 'SCANNING';
      if (['12', '13', '14'].includes(ch)) return 'VTS / OPS';
      return 'AUX';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 border-2 border-zinc-700 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* LCD Display Effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,6px_100%]"></div>

        {/* Header / Radio Brand */}
        <div className="bg-zinc-800 p-4 flex justify-between items-center border-b border-zinc-700 relative z-10">
          <div className="flex items-center gap-2">
            <Radio className="text-indigo-500" />
            <span className="font-mono font-bold tracking-widest text-zinc-200">ADA VHF</span>
          </div>
          <div className="flex items-center gap-3">
             {status === LiveConnectionState.Connected && (
                <div className="flex items-center gap-1.5 text-red-500 animate-pulse">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-[10px] font-mono font-bold">REC</span>
                </div>
              )}
             <div className={`w-2 h-2 rounded-full ${
                status === LiveConnectionState.Connected ? 'bg-green-500 animate-pulse' : 
                (status === LiveConnectionState.Processing || status === LiveConnectionState.Generating) ? 'bg-blue-500 animate-pulse' :
                status === LiveConnectionState.Error ? 'bg-red-500' : 'bg-amber-500'
             }`} />
             <span className="text-[10px] font-mono uppercase text-zinc-500">{status}</span>
          </div>
        </div>

        {/* Main Display Area */}
        <div className="p-8 flex flex-col items-center justify-center min-h-[300px] relative z-10">
           
           {/* Channel Indicator */}
           <div className="mb-8 text-center">
             <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                 {channel === 'SCAN' ? 'Monitoring' : 'Priority Channel'}
             </span>
             {/* Prominently displayed coordinates */}
             <div className="text-lg font-mono text-zinc-300 mb-2">{displayCoordinates}</div>
             <div className="text-6xl font-mono font-bold text-indigo-500 tracking-tighter flex items-center justify-center gap-2 text-shadow-glow">
               {channel === 'SCAN' ? 'SCAN' : channel} 
               <span className="text-xl text-zinc-600">{getChannelLabel(channel)}</span>
             </div>
           </div>

           {/* Visualizer Circle / Error State */}
           <div className="relative w-32 h-32 flex items-center justify-center">
             {status === LiveConnectionState.Error ? (
                 <div className="flex flex-col items-center justify-center text-red-500 animate-pulse">
                     <AlertTriangle size={48} />
                     <span className="text-[10px] font-bold mt-2 uppercase tracking-widest text-center">Network Error<br/>Link Lost</span>
                 </div>
             ) : (
                 <>
                    {/* Outer Rings */}
                    <div className={`absolute inset-0 rounded-full border-2 border-indigo-900 transition-all duration-100`} 
                        style={{ transform: `scale(${1 + audioLevel * 2})`, opacity: 0.5 - audioLevel }}></div>
                    <div className={`absolute inset-0 rounded-full border border-indigo-800 transition-all duration-100 delay-75`} 
                        style={{ transform: `scale(${1 + audioLevel * 3})`, opacity: 0.3 - audioLevel }}></div>
                    
                    {/* Inner Core */}
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-transform duration-75 ${(status === LiveConnectionState.Connected || status === LiveConnectionState.Processing || status === LiveConnectionState.Generating) ? 'scale-100' : 'scale-90 grayscale'}`}>
                    {status === LiveConnectionState.Connected ? (
                        <Mic className="text-white w-8 h-8" />
                    ) : (status === LiveConnectionState.Processing || status === LiveConnectionState.Generating) ? (
                        <Waves className="text-white w-8 h-8 animate-pulse" />
                    ) : (
                        <Activity className="text-white/50 w-8 h-8 animate-spin-slow" />
                    )}
                    </div>
                 </>
             )}
           </div>

           {/* Status Text */}
           <div className="mt-8 font-mono text-sm text-zinc-400 text-center h-6">
             {status === LiveConnectionState.Connecting && "ESTABLISHING SECURE LINK..."}
             {status === LiveConnectionState.Connected && (audioLevel > 0.05 ? "RECEIVING / TRANSMITTING" : "MONITORING (VOX ACTIVE)...")}
             {status === LiveConnectionState.Processing && "PROCESSING AUDIO..."}
             {status === LiveConnectionState.Generating && "GENERATING RESPONSE..."}
             {status === LiveConnectionState.Error && <span className="text-red-500 font-bold flex items-center justify-center gap-2"><AlertTriangle size={14}/> CONNECTION LOST</span>}
           </div>
            
           {/* Protocol Instructions */}
           {showProtocol && (
                <div className="mt-6 w-full max-w-sm text-left font-mono text-xs text-zinc-400 bg-zinc-800/50 p-4 rounded-lg animate-in fade-in duration-300 border border-zinc-700/50">
                    <h4 className="font-bold text-indigo-400 mb-2 uppercase tracking-widest">VHF Comms Protocol</h4>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-300">
                        <li>State your call sign clearly.</li>
                        <li>Keep transmissions brief and concise.</li>
                        <li>Use standard phrases (Affirmative, Negative).</li>
                        <li>End every transmission with "Over".</li>
                        <li className="pt-2 text-zinc-500 italic">Ex: "Ada Marina, this is Phisedelia, requesting departure. Over."</li>
                    </ul>
                </div>
            )}
        </div>

        {/* Controls */}
        <div className="bg-zinc-800 p-4 border-t border-zinc-700 flex flex-col items-center justify-center relative z-10">
          <div className="mb-4 text-center">
            <button
                onClick={() => setShowProtocol(!showProtocol)}
                className="text-xs font-mono text-zinc-500 hover:text-indigo-400 transition-colors"
                aria-expanded={showProtocol}
            >
                {showProtocol ? '[ Hide Protocol ]' : '[ Show Comms Protocol ]'}
            </button>
          </div>
          
          {status === LiveConnectionState.Error ? (
              <button 
                onClick={handleRetry}
                className="group flex items-center gap-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-500 px-8 py-3 rounded-full transition-all font-mono uppercase font-bold tracking-wider hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse"
              >
                <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                RE-ESTABLISH LINK
              </button>
          ) : (
              <button 
                onClick={handleDisconnect}
                className="group flex items-center gap-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 px-8 py-3 rounded-full transition-all font-mono uppercase font-bold tracking-wider hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              >
                <Power size={18} className="group-hover:scale-110 transition-transform" />
                End Transmission
              </button>
          )}
        </div>

      </div>
    </div>
  );
};
