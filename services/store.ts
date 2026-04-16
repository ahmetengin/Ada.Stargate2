import { create } from 'zustand';
import { ThemeMode } from '../types';
import { persistenceService, STORAGE_KEYS } from './persistence';

interface AppState {
  // Layout State
  sidebarWidth: number;
  opsWidth: number;
  activeMobileTab: 'nav' | 'comms' | 'ops';
  setSidebarWidth: (width: number) => void;
  setOpsWidth: (width: number) => void;
  setActiveMobileTab: (tab: 'nav' | 'comms' | 'ops') => void;

  // Modal State
  isVoiceOpen: boolean;
  isScannerOpen: boolean;
  isTraceOpen: boolean;
  isReportOpen: boolean;
  setIsVoiceOpen: (isOpen: boolean) => void;
  setIsScannerOpen: (isOpen: boolean) => void;
  setIsTraceOpen: (isOpen: boolean) => void;
  setIsReportOpen: (isOpen: boolean) => void;

  // Theme State
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Layout
  sidebarWidth: 260,
  opsWidth: 400,
  activeMobileTab: 'comms',
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  setOpsWidth: (width) => set({ opsWidth: width }),
  setActiveMobileTab: (tab) => set({ activeMobileTab: tab }),

  // Modals
  isVoiceOpen: false,
  isScannerOpen: false,
  isTraceOpen: false,
  isReportOpen: false,
  setIsVoiceOpen: (isOpen) => set({ isVoiceOpen: isOpen }),
  setIsScannerOpen: (isOpen) => set({ isScannerOpen: isOpen }),
  setIsTraceOpen: (isOpen) => set({ isTraceOpen: isOpen }),
  setIsReportOpen: (isOpen) => set({ isReportOpen: isOpen }),

  // Theme
  theme: persistenceService.load(STORAGE_KEYS.THEME, 'dark'),
  setTheme: (theme) => {
    persistenceService.save(STORAGE_KEYS.THEME, theme);
    set({ theme });
  },
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'auto' ? 'light' : state.theme === 'light' ? 'dark' : 'auto';
    persistenceService.save(STORAGE_KEYS.THEME, newTheme);
    return { theme: newTheme };
  }),
}));
