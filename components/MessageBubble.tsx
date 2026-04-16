
import React, { useState, useEffect, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, MessageRole, VesselIntelligenceProfile } from '../types';
import { marinaExpert } from '../services/agents/marinaAgent';
import { VesselCard } from './VesselCard';
import { Anchor } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = memo(({ message }) => {
  const isUser = message.role === MessageRole.User;
  const [vesselProfiles, setVesselProfiles] = useState<Record<string, VesselIntelligenceProfile>>({});

  useEffect(() => {
    if (message.role === MessageRole.Model && message.text) {
      const lowerText = message.text.toLowerCase();
      
      const allVessels = marinaExpert.getAllFleetVessels();
      const foundProfiles: Record<string, VesselIntelligenceProfile> = {};

      allVessels.forEach(vessel => {
          const fullName = vessel.name.toLowerCase();
          const nameParts = fullName.split(' ');
          const coreName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : fullName;

          if (lowerText.includes(fullName) || (coreName.length >= 4 && lowerText.includes(coreName))) {
              foundProfiles[vessel.name] = vessel;
          }
      });

      if (Object.keys(foundProfiles).length > 0) {
          setVesselProfiles(foundProfiles);
      }
    }
  }, [message.text, message.role]);

  if (message.role === MessageRole.System) {
      return (
          <div className="flex justify-center my-12">
              <div className="text-center font-mono">
                  <div className="flex justify-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#0a121e] border border-white/5 flex items-center justify-center shadow-lg">
                        <Anchor className="text-teal-500/50" size={18} />
                      </div>
                  </div>
                  <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.25em] mb-2">ADA MARINA <span className="text-zinc-800 mx-2">——</span> <span className="text-teal-900">v3.2</span></div>
                  <div className="max-w-md text-[10px] text-zinc-600 leading-relaxed opacity-60">
                      <span className="font-bold text-zinc-500">Ada Stargate v3.2 Distributed Initialized</span><br/>
                      [ <span className="text-teal-900 font-bold">OK</span> ] Core System Active. [ <span className="text-teal-900 font-bold">OK</span> ] COLREGs Protocol Online. [ <span className="text-teal-900 font-bold">OK</span> ] Parasut Integrated.<br/>
                      <span className="italic opacity-50 mt-2 block">System is operating in Distributed Mode via FastRTC Mesh.</span>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
            <div className="mr-4 pt-1">
                <div className="w-5 h-5 bg-[#0a121e] border border-white/5 flex items-center justify-center rounded text-[9px] text-teal-500/80 font-bold">
                    AI
                </div>
            </div>
        )}
        
        <div className={`max-w-2xl font-mono text-sm ${isUser ? 'text-right' : 'text-left'}`}>
            {isUser ? (
                <div className="bg-[#0a121e] text-zinc-300 px-5 py-3 rounded-lg border border-white/5 inline-block shadow-md">
                    {message.text}
                </div>
            ) : (
                <div className="text-zinc-400 leading-relaxed">
                    <ReactMarkdown 
                        components={{
                            strong: ({node, ...props}) => <span className="text-teal-400 font-bold" {...props} />,
                            code: ({node, ...props}) => <span className="text-amber-500 text-xs bg-amber-900/10 px-1 py-0.5 rounded border border-amber-900/20" {...props} />,
                            p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />
                        }}
                    >
                        {message.text}
                    </ReactMarkdown>
                    
                    {/* Injected Vessel Intelligence Cards */}
                    <div className="space-y-4">
                        {Object.values(vesselProfiles).map((profile, idx) => (
                            <VesselCard key={idx} profile={profile} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
});
