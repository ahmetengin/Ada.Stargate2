import React, { useState, useEffect } from 'react';
import { Message, MessageRole, ModelType, RegistryEntry, Tender, UserProfile, AgentAction, VhfLog, AisTarget, ThemeMode, TenantConfig } from './types';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { BootSequence } from './components/BootSequence';
import { VoiceModal } from './components/VoiceModal';
import { PassportScanner } from './components/PassportScanner';
import { AgentTraceModal } from './components/AgentTraceModal';
import { DailyReportModal } from './components/DailyReportModal';
import { ChatInterface } from './components/ChatInterface';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAppStore } from './services/store';
import { streamChatResponse } from './services/geminiService';
import { orchestratorService } from './services/orchestratorService';
import { marinaExpert } from './services/agents/marinaAgent';
import { passkitExpert } from './services/agents/passkitAgent';
import { wimMasterData } from './services/wimMasterData'; // Still needed for specific mock data
import { persistenceService, STORAGE_KEYS } from './services/persistence';
import { Menu, Radio, Activity, MessageSquare } from 'lucide-react';
import { FEDERATION_REGISTRY } from './services/config'; // Import FEDERATION_REGISTRY

// --- SIMULATED USER DATABASE ---
const MOCK_USER_DATABASE: Record<string, UserProfile> = {
  'GUEST': { id: 'usr_anonymous', name: 'Misafir', role: 'GUEST', clearanceLevel: 0, legalStatus: 'GREEN' },
  'CAPTAIN': { id: 'usr_cpt_99', name: 'Kpt. Barbaros', role: 'CAPTAIN', clearanceLevel: 3, legalStatus: 'GREEN', contractId: 'CNT-2025-PHISEDELIA' },
  'GENERAL_MANAGER': { id: 'usr_gm_01', name: 'Levent Baktır', role: 'GENERAL_MANAGER', clearanceLevel: 5, legalStatus: 'GREEN' }
};

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: MessageRole.System,
  text: 'SYSTEM READY',
  timestamp: Date.now()
};

const BOOT_TRACES: any[] = [
    { id: 'boot_1', timestamp: '08:00:01', node: 'ada.stargate', step: 'THINKING', content: 'Initializing Distributed Node Mesh...', persona: 'ORCHESTRATOR' },
    { id: 'boot_2', timestamp: '08:00:02', node: 'ada.marina', step: 'TOOL_EXECUTION', content: 'Connecting to Kpler AIS Stream (Region: WIM)...', persona: 'WORKER' },
];

export default function App() {
  // --- ZUSTAND STATE ---
  const {
    sidebarWidth, opsWidth, activeMobileTab, setActiveMobileTab,
    isVoiceOpen, setIsVoiceOpen, isScannerOpen, setIsScannerOpen,
    isTraceOpen, setIsTraceOpen, isReportOpen, setIsReportOpen,
    theme, toggleTheme
  } = useAppStore();

  // --- LOCAL STATE ---
  const [isBooting, setIsBooting] = useState(true);
  const [messages, setMessages] = useState<Message[]>(() => persistenceService.load(STORAGE_KEYS.MESSAGES, [INITIAL_MESSAGE]));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.Flash);
  
  // Tenant Management
  const [activeTenantConfig, setActiveTenantConfig] = useState<TenantConfig>(() => {
    const savedTenantId = persistenceService.load(STORAGE_KEYS.ACTIVE_TENANT_ID, 'wim');
    return FEDERATION_REGISTRY.peers.find(p => p.id === savedTenantId) || FEDERATION_REGISTRY.peers[0];
  });

  // Data
  const [userProfile, setUserProfile] = useState<UserProfile>(() => persistenceService.load(STORAGE_KEYS.USER_PROFILE, MOCK_USER_DATABASE['CAPTAIN']));
  const [tenders, setTenders] = useState<Tender[]>(() => persistenceService.load(STORAGE_KEYS.TENDERS, wimMasterData.assets.tenders as Tender[]));
  const [registry, setRegistry] = useState<RegistryEntry[]>(() => persistenceService.load(STORAGE_KEYS.REGISTRY, []));
  const [vesselsInPort, setVesselsInPort] = useState(542);
  const [agentTraces, setAgentTraces] = useState<any[]>(BOOT_TRACES);
  const [vhfLogs, setVhfLogs] = useState<VhfLog[]>([]); 
  const [aisTargets, setAisTargets] = useState<AisTarget[]>([]);
  const [nodeStates, setNodeStates] = useState<Record<string, 'connected' | 'working' | 'disconnected'>>({});
  const [activeChannel, setActiveChannel] = useState('72');
  const [hailedVessels, setHailedVessels] = useState<Set<string>>(new Set());

  // --- INITIALIZATION ---
  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2000); // Faster boot
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'auto') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(systemDark ? 'dark' : 'light');
    } else {
        root.classList.add(theme);
    }
    persistenceService.save(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Node Heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      const nodes = ['ada.vhf', 'ada.sea', 'ada.marina', 'ada.finance'];
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      setNodeStates(prev => ({ ...prev, [randomNode]: 'working' }));
      setTimeout(() => setNodeStates(prev => ({ ...prev, [randomNode]: 'connected' })), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Proactive Hailing for Inbound Vessels
  useEffect(() => {
      if (isBooting) return;

      const checkInboundVessels = async () => {
          const currentFleet = marinaExpert.getAllFleetVessels();
          const newInboundVessels = currentFleet.filter(
              vessel => vessel.status === 'INBOUND' && vessel.voyage?.eta && !hailedVessels.has(vessel.name)
          );

          if (newInboundVessels.length > 0) {
              for (const vessel of newInboundVessels) {
                  const hailMessageText = await marinaExpert.generateProactiveHail(vessel.name);
                  const hailMessage: Message = {
                      id: `hail-${Date.now()}-${vessel.name}`,
                      role: MessageRole.Model,
                      text: hailMessageText,
                      timestamp: Date.now()
                  };
                  setMessages(prev => [...prev, hailMessage]);
                  setHailedVessels(prev => new Set(prev).add(vessel.name));
              }
          }
      };

      const interval = setInterval(checkInboundVessels, 10000);
      checkInboundVessels();

      return () => clearInterval(interval);
  }, [isBooting, hailedVessels]);

  // --- ACTIONS ---
  const handleRoleChange = (newRole: string) => {
      const profile = MOCK_USER_DATABASE[newRole];
      if (profile) {
          setUserProfile(profile);
          persistenceService.save(STORAGE_KEYS.USER_PROFILE, profile);
          if (newRole === 'GUEST' && activeMobileTab === 'nav') setActiveMobileTab('ops');
      }
  };

  // NEW: Handle Tenant Switch (for demo purposes)
  const handleTenantSwitch = (tenantId: string) => {
    const newTenantConfig = FEDERATION_REGISTRY.peers.find(p => p.id === tenantId);
    if (newTenantConfig) {
      setActiveTenantConfig(newTenantConfig);
      persistenceService.save(STORAGE_KEYS.ACTIVE_TENANT_ID, tenantId);
      // Optional: Clear messages or reset UI on tenant switch
      setMessages([INITIAL_MESSAGE]);
      setAgentTraces(BOOT_TRACES);
      setVhfLogs([]);
      console.log(`Switched to tenant: ${newTenantConfig.fullName}`);
    }
  };

  const handleVhfClick = (channel: string) => {
      setActiveChannel(channel);
      setIsVoiceOpen(true);
  };

  const handleSendMessage = (text: string, attachments: File[]) => {
      setIsLoading(true);
      const newMessages = [...messages, { id: Date.now().toString(), role: MessageRole.User, text, timestamp: Date.now() }];
      setMessages(newMessages);

      // Pass the updated messages array and activeTenantConfig for context
      orchestratorService.processRequest(text, userProfile, tenders, registry, vesselsInPort, newMessages, activeTenantConfig).then(res => {
          if (res.traces) setAgentTraces(prev => [...res.traces, ...prev]);
          if (res.actions) {
              res.actions.forEach(act => {
                  if (act.name === 'ada.ui.openModal') {
                      if (act.params.modal === 'SCANNER') setIsScannerOpen(true);
                  }
              });
          }
          
          const responseMsg: Message = { id: (Date.now()+1).toString(), role: MessageRole.Model, text: res.text, timestamp: Date.now() };
          setMessages(prev => [...prev, responseMsg]);
          setIsLoading(false);
      }).catch(() => setIsLoading(false));
  };

  const handleVoiceTranscript = (userText: string, modelText: string) => {
      const newLogs: VhfLog[] = [
          { id: `vhf-${Date.now()}-u`, timestamp: new Date().toLocaleTimeString(), channel: activeChannel, speaker: 'VESSEL', message: userText },
          { id: `vhf-${Date.now()}-m`, timestamp: new Date().toLocaleTimeString(), channel: activeChannel, speaker: 'CONTROL', message: modelText }
      ];
      setVhfLogs(prev => [...newLogs, ...prev]);
      
      setMessages(prev => [
          ...prev, 
          { id: Date.now().toString(), role: MessageRole.User, text: `[VHF CH${activeChannel}] ${userText}`, timestamp: Date.now() },
          { id: (Date.now()+1).toString(), role: MessageRole.Model, text: modelText, timestamp: Date.now() }
      ]);
  };

  if (isBooting) return <BootSequence />;

  return (
    <ErrorBoundary>
      <div className="h-[100dvh] w-full bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-300 font-sans overflow-hidden flex flex-col lg:flex-row">
        
        {/* --- MOBILE VIEW --- */}
        <div className="lg:hidden flex flex-col h-full w-full relative overflow-hidden">
            
            <div className="flex-1 overflow-hidden relative">
                {activeMobileTab === 'nav' && (
                    <div className="h-full w-full overflow-y-auto">
                        <Sidebar 
                            nodeStates={nodeStates}
                            activeChannel={activeChannel}
                            isMonitoring={true}
                            userProfile={userProfile}
                            onRoleChange={handleRoleChange}
                            onVhfClick={handleVhfClick}
                            onScannerClick={() => setIsScannerOpen(true)}
                            onPulseClick={() => setIsReportOpen(true)}
                            onTenantSwitch={handleTenantSwitch} // NEW
                            activeTenantId={activeTenantConfig.id} // NEW
                        />
                    </div>
                )}
                
                {activeMobileTab === 'comms' && (
                    <ChatInterface 
                        messages={messages}
                        activeChannel={activeChannel}
                        isLoading={isLoading}
                        selectedModel={selectedModel}
                        userRole={userProfile.role}
                        theme={theme}
                        activeTenantConfig={activeTenantConfig} // NEW
                        onModelChange={setSelectedModel}
                        onSend={handleSendMessage}
                        onQuickAction={(text) => handleSendMessage(text, [])}
                        onScanClick={() => setIsScannerOpen(true)}
                        onRadioClick={() => setIsVoiceOpen(true)}
                        onTraceClick={() => setIsTraceOpen(true)}
                        onToggleTheme={toggleTheme}
                    />
                )}

                {activeMobileTab === 'ops' && (
                    <Canvas 
                        vesselsInPort={vesselsInPort}
                        registry={registry}
                        tenders={tenders}
                        vhfLogs={vhfLogs}
                        aisTargets={aisTargets}
                        userProfile={userProfile}
                        onOpenReport={() => setIsReportOpen(true)}
                        onOpenTrace={() => setIsTraceOpen(true)}
                        agentTraces={agentTraces}
                        activeTenantConfig={activeTenantConfig} // NEW
                    />
                )}
            </div>

            <div className="h-16 flex-shrink-0 bg-white dark:bg-[#0a121e] border-t border-zinc-200 dark:border-white/5 flex items-center justify-around px-2 z-50 pb-safe">
                <button 
                    onClick={() => setActiveMobileTab('nav')}
                    className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${activeMobileTab === 'nav' ? 'text-teal-500' : 'text-zinc-400'}`}
                >
                    <Menu size={20} />
                    <span className="text-[9px] font-bold">NAV</span>
                </button>
                <button 
                    onClick={() => setActiveMobileTab('comms')}
                    className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${activeMobileTab === 'comms' ? 'text-teal-500' : 'text-zinc-400'}`}
                >
                    <MessageSquare size={20} />
                    <span className="text-[9px] font-bold">CHAT</span>
                </button>
                <button 
                    onClick={() => setActiveMobileTab('ops')}
                    className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${activeMobileTab === 'ops' ? 'text-teal-500' : 'text-zinc-400'}`}
                >
                    <Activity size={20} />
                    <span className="text-[9px] font-bold">OPS</span>
                </button>
            </div>
        </div>

        {/* --- DESKTOP VIEW --- */}
        <div className="hidden lg:flex h-full w-full">
            <div style={{ width: sidebarWidth }} className="flex-shrink-0 h-full border-r border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#050b14]">
                <Sidebar 
                    nodeStates={nodeStates}
                    activeChannel={activeChannel}
                    isMonitoring={true}
                    userProfile={userProfile}
                    onRoleChange={handleRoleChange}
                    onVhfClick={handleVhfClick}
                    onScannerClick={() => setIsScannerOpen(true)}
                    onPulseClick={() => setIsReportOpen(true)}
                    onTenantSwitch={handleTenantSwitch} // NEW
                    activeTenantId={activeTenantConfig.id} // NEW
                />
            </div>

            <div className="flex-1 h-full min-w-[400px] border-r border-zinc-200 dark:border-white/5">
                <ChatInterface 
                    messages={messages}
                    activeChannel={activeChannel}
                    isLoading={isLoading}
                    selectedModel={selectedModel}
                    userRole={userProfile.role}
                    theme={theme}
                    activeTenantConfig={activeTenantConfig} // NEW
                    onModelChange={setSelectedModel}
                    onSend={handleSendMessage}
                    onQuickAction={(text) => handleSendMessage(text, [])}
                    onScanClick={() => setIsScannerOpen(true)}
                    onRadioClick={() => setIsVoiceOpen(true)}
                    onTraceClick={() => setIsTraceOpen(true)}
                    onToggleTheme={toggleTheme}
                />
            </div>

            <div style={{ width: opsWidth }} className="flex-shrink-0 h-full bg-zinc-100 dark:bg-black">
                <Canvas 
                    vesselsInPort={vesselsInPort}
                    registry={registry}
                    tenders={tenders}
                    vhfLogs={vhfLogs}
                    aisTargets={aisTargets}
                    userProfile={userProfile}
                    onOpenReport={() => setIsReportOpen(true)}
                    onOpenTrace={() => setIsTraceOpen(true)}
                    agentTraces={agentTraces}
                    activeTenantConfig={activeTenantConfig} // NEW
                />
            </div>
        </div>

        {/* MODALS */}
        <VoiceModal 
            isOpen={isVoiceOpen} 
            onClose={() => setIsVoiceOpen(false)} 
            userProfile={userProfile} 
            onTranscriptReceived={handleVoiceTranscript} 
            channel={activeChannel}
        />
        <PassportScanner 
            isOpen={isScannerOpen} 
            onClose={() => setIsScannerOpen(false)} 
            onScanComplete={(res) => handleSendMessage(`Identity Verified: ${res.data.name}`, [])} 
        />
        <AgentTraceModal 
            isOpen={isTraceOpen} 
            onClose={() => setIsTraceOpen(false)} 
            traces={agentTraces} 
        />
        <DailyReportModal 
            isOpen={isReportOpen} 
            onClose={() => setIsReportOpen(false)} 
            registry={registry} 
            logs={agentTraces} 
            vesselsInPort={vesselsInPort} 
            userProfile={userProfile} 
            weatherData={[{ day: 'Today', temp: 24, condition: 'Sunny', windSpeed: 12, windDir: 'NW' }]} 
            activeTenantConfig={activeTenantConfig} // NEW
        />

      </div>
    </ErrorBoundary>
  );
}