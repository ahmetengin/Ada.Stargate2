
import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { ArrowUp, Paperclip, AudioWaveform, ScanLine, Radio, Sparkles, Zap, Image as ImageIcon } from 'lucide-react'; 
import { ModelType, UserRole } from '../types';
import { QuickActions } from './QuickActions';

interface InputAreaProps {
  onSend: (text: string, attachments: File[]) => void;
  isLoading: boolean;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  userRole?: UserRole;
  onQuickAction?: (text: string) => void;
  onScanClick?: () => void;
  onRadioClick?: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ 
  onSend, 
  isLoading, 
  selectedModel, 
  onModelChange,
  userRole,
  onQuickAction,
  onScanClick,
  onRadioClick
}) => {
  const [text, setText] = useState('');
  const [isDictating, setIsDictating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  const handleSend = () => {
    if ((!text.trim()) || isLoading) return;
    onSend(text, []);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      
      {/* Model Selector - Optimized: Removed Image Model */}
      <div className="flex justify-center sm:justify-start mb-2">
          <div className="flex bg-zinc-100 dark:bg-[#0a121e] p-1 rounded-lg border border-zinc-200 dark:border-white/10 shadow-sm">
              <button onClick={() => onModelChange(ModelType.Flash)} className={`px-2 py-1 rounded text-[9px] font-bold flex items-center gap-1 ${selectedModel === ModelType.Flash ? 'bg-white dark:bg-white/10 shadow text-teal-600 dark:text-teal-400' : 'text-zinc-500'}`}><Zap size={10}/> FLASH</button>
              <button onClick={() => onModelChange(ModelType.Pro)} className={`px-2 py-1 rounded text-[9px] font-bold flex items-center gap-1 ${selectedModel === ModelType.Pro ? 'bg-white dark:bg-white/10 shadow text-indigo-600 dark:text-indigo-400' : 'text-zinc-500'}`}><Sparkles size={10}/> PRO</button>
          </div>
      </div>

      {/* Quick Actions */}
      {userRole && onQuickAction && (
          <div className="mb-3">
              <QuickActions userRole={userRole} onAction={onQuickAction} />
          </div>
      )}

      {/* Main Input Capsule */}
      <div className={`relative bg-white dark:bg-[#0a121e] rounded-3xl border shadow-sm transition-all duration-300 flex items-end p-1.5 
          ${isLoading ? 'border-teal-500/30 ring-2 ring-teal-500/10' : 'border-zinc-200 dark:border-white/10 focus-within:ring-2 focus-within:ring-teal-500/20'}`}>
          
          {/* Tools */}
          <div className="flex items-center gap-1 pr-2 border-r border-zinc-100 dark:border-white/5 mr-2 mb-1.5">
              <button onClick={onScanClick} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors" title="Scanner">
                  <ScanLine size={18} />
              </button>
              <button onClick={onRadioClick} className="p-2 text-red-500 hover:text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors relative" title="Radio">
                  <Radio size={18} />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              </button>
          </div>
          
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDictating ? "Dinliyorum..." : "Komut girin..."}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 py-3 font-mono min-w-0 max-h-[120px] resize-none"
            disabled={isLoading}
          />

          <div className="flex items-center gap-2 pl-2 mb-1">
              <button onClick={() => setIsDictating(!isDictating)} className={`p-2 rounded-full transition-all ${isDictating ? 'text-red-500 bg-red-50' : 'text-zinc-400 hover:text-zinc-600'}`}>
                  <AudioWaveform size={18} className={isDictating ? 'animate-pulse' : ''} />
              </button>
              <button 
                onClick={handleSend}
                disabled={!text.trim() || isLoading}
                className={`p-2 rounded-full transition-all ${text.trim() ? 'bg-teal-500 text-white shadow-md hover:bg-teal-600' : 'bg-zinc-100 dark:bg-white/5 text-zinc-300 dark:text-zinc-600'}`}
              >
                  {isLoading ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <ArrowUp size={18} />}
              </button>
          </div>
      </div>
      
      <div className="text-[9px] text-center text-zinc-400 mt-2 uppercase tracking-widest opacity-60">
          SECURE CONNECTION • 256-BIT ENCRYPTED
      </div>
    </div>
  );
};
