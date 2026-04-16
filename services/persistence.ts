// services/persistence.ts
import { RegistryEntry, Tender, TrafficEntry, UserProfile, VesselIntelligenceProfile, MaintenanceJob, Message } from '../types';

export const STORAGE_KEYS = {
  FLEET: 'ada_fleet_v1',
  TECHNIC_JOBS: 'ada_technic_jobs_v1',
  FINANCE_LEDGER: 'ada_finance_ledger_v1',
  LOGS: 'ada_logs_v1',
  MESSAGES: 'ada_chat_history_v1',
  REGISTRY: 'ada_registry_v1',
  TENDERS: 'ada_tenders_v1',
  TRAFFIC: 'ada_traffic_queue_v1',
  USER_PROFILE: 'ada_user_profile_v1',
  THEME: 'theme',
  ACTIVE_TENANT_ID: 'active_tenant_id', // NEW: To persist the active tenant choice
};

class PersistenceService {
  
  // Save data to local storage with error handling
  save<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`[Persistence] Error saving to ${key}:`, error);
    }
  }

  // Load data from local storage with type safety and default fallback
  load<T>(key: string, defaultValue: T): T {
    try {
      const serialized = localStorage.getItem(key);
      if (serialized === null) {
        return defaultValue;
      }
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.warn(`[Persistence] Error loading/parsing ${key}, using default value.`, error);
      return defaultValue;
    }
  }

  // Clear specific key
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  // Nuke everything (Factory Reset)
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    window.location.reload();
  }
}

export const persistenceService = new PersistenceService();