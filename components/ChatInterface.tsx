import React, { useRef, useCallback, useLayoutEffect } from 'react';
import { Message, ModelType, ThemeMode, TenantConfig } from '../types';
import { InputArea } from './InputArea';
import { MessageBubble } from './MessageBubble';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ChatInterfaceProps {
    messages: Message[];
    activeChannel: string;
    isLoading: boolean;
    selectedModel: ModelType;
    userRole: any;
    theme: ThemeMode;
    activeTenantConfig: TenantConfig;
    onModelChange: (m: ModelType) => void;
    onSend: (text: string, attachments: File[]) => void;
    onQuickAction: (text: string) => void;
    onScanClick: () => void;
    onRadioClick: () => void;
    onTraceClick: () => void;
    onToggleTheme: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    activeChannel,
    isLoading,
    selectedModel,
    userRole,
    theme,
    activeTenantConfig,
    onModelChange,
    onSend,
    onQuickAction,
    onScanClick,
    onRadioClick,
    onTraceClick,
    onToggleTheme
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isUserAtBottomRef = useRef(true);

    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const threshold = 100;
        const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
        isUserAtBottomRef.current = distanceToBottom < threshold;
    }, []);

    useLayoutEffect(() => {
        if (isUserAtBottomRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full w-full bg-zinc-50 dark:bg-[#050b14] relative">
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-[#050b14]/80 backdrop-blur-md z-10 flex-shrink-0">
                <div className="flex items-center gap-2 cursor-pointer" onClick={onTraceClick}>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 tracking-[0.2em] uppercase">
                        {activeTenantConfig.id}.MARINA
                    </span>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-2 py-1 bg-zinc-100 dark:bg-white/5 rounded border border-zinc-200 dark:border-white/10">
                        <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400">VHF {activeChannel}</span>
                    </div>
                    <button 
                        onClick={onToggleTheme}
                        className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 transition-colors"
                    >
                        {theme === 'light' ? <Sun size={14} /> : theme === 'dark' ? <Moon size={14} /> : <Monitor size={14} />}
                    </button>
                </div>
            </div>

            {/* Messages Area - Flex Grow to fill space */}
            <div 
                className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-6 custom-scrollbar scroll-smooth" 
                ref={scrollContainerRef}
                onScroll={handleScroll}
            >
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area - Fixed at bottom of flex container */}
            <div className="flex-shrink-0 bg-zinc-50 dark:bg-[#050b14] border-t border-zinc-200 dark:border-white/5 p-2 sm:p-4 pb-4 sm:pb-6 z-20">
                <InputArea 
                    onSend={onSend}
                    isLoading={isLoading}
                    selectedModel={selectedModel}
                    onModelChange={onModelChange}
                    userRole={userRole}
                    onQuickAction={onQuickAction}
                    onScanClick={onScanClick}
                    onRadioClick={onRadioClick}
                />
            </div>
        </div>
    );
};
