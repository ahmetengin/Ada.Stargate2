// types.ts

export enum MessageRole {
  User = 'user',
  Model = 'model',
  System = 'system'
}

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface Attachment {
  mimeType: string;
  data: string; // Base64
  name?: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  attachments?: Attachment[];
  timestamp: number;
  isThinking?: boolean; // UI state for ongoing generation
  groundingSources?: GroundingSource[]; // URLs from search
  generatedImage?: string; // Base64 or URL for generated image
}

export enum ModelType {
  Flash = 'gemini-2.5-flash',
  Pro = 'gemini-3-pro-preview', // For complex reasoning
  // Image = 'imagen-4.0-generate-001', // Removed per user request
}

export interface AppState {
  messages: Message[];
  isLoading: boolean;
  selectedModel: ModelType;
  useSearch: boolean;
  useThinking: boolean;
}

export enum LiveConnectionState {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
  Processing = 'processing',
  Generating = 'generating',
  Error = 'error'
}

export interface RegistryEntry {
  id: string;
  timestamp: string;
  vessel: string;
  action: 'CHECK-IN' | 'CHECK-OUT';
  location: string;
  status: 'AUTHORIZED' | 'PENDING' | 'DENIED';
}

// NEW: Dedicated VHF Log Type
export interface VhfLog {
    id: string;
    timestamp: string;
    channel: string;
    speaker: 'VESSEL' | 'CONTROL';
    message: string;
}

export interface Tender {
  id: string;
  name: string;
  callsign?: string; // Added for display
  status: 'Idle' | 'Busy' | 'Maintenance';
  assignment?: string;
  serviceCount?: number; 
}

export interface AisTarget {
    name: string;
    type: string;
    distance: string;
    squawk: string;
    status: string;
    coordinates: { lat: number; lng: number; };
    speed: string;
    course?: number;
}

export interface KplerAisTarget {
    id: string;
    vessel_name: string;
    status: 'INBOUND' | 'OUTBOUND' | 'HOLDING' | 'TAXIING' | 'DOCKED' | 'AT_ANCHOR';
    latitude: number;
    longitude: number;
    speed_knots: number;
    course_deg: number;
}

export interface TrafficEntry {
  id: string;
  vessel: string;
  status: 'INBOUND' | 'OUTBOUND' | 'HOLDING' | 'TAXIING' | 'DOCKED' | 'AT_ANCHOR';
}

export type UserRole = 'GUEST' | 'CAPTAIN' | 'GENERAL_MANAGER';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  clearanceLevel: number;
  legalStatus: 'GREEN' | 'RED';
  contractId?: string;
}

export interface VesselIntelligenceProfile {
  name: string;
  imo: string;
  type: string;
  flag: string;
  ownerName?: string;
  ownerId?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  dwt: number;
  loa: number;
  beam: number;
  status: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  voyage?: { lastPort: string; nextPort: string; eta: string };
  paymentHistoryStatus?: 'REGULAR' | 'RECENTLY_LATE';
  adaSeaOneStatus?: 'ACTIVE' | 'INACTIVE';
  utilities?: { electricityKwh: number; waterM3: number; lastReading: string; status: 'ACTIVE' | 'DISCONNECTED' };
  outstandingDebt?: number;
  loyaltyScore?: number;
}

export type NodeName = string | 'ada.stargate'; // Added ada.stargate for consistency

export interface AgentTraceLog {
  id: string;
  timestamp: string;
  node: NodeName;
  step: 'THINKING' | 'TOOL_EXECUTION' | 'TOOL_CALL' | 'CODE_OUTPUT' | 'PLANNING' | 'ROUTING' | 'FINAL_ANSWER' | 'OUTPUT' | 'VOTING' | 'ERROR' | 'WARNING';
  content: any;
  persona?: 'ORCHESTRATOR' | 'EXPERT' | 'WORKER';
  type?: string; 
  source?: string;
  message?: string;
  isError?: boolean;
}

export interface TravelItinerary {
  id: string;
  passengerName: string;
  tripName: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  totalCost: number;
  flights: any[];
  hotels: any[];
  transfers: any[];
}

export interface MaintenanceLogEntry {
  timestamp: string;
  stage: 'SCHEDULED' | 'PARTS_ORDERED' | 'PARTS_ARRIVED' | 'IN_PROGRESS' | 'COMPLETED';
  details: string;
}

export interface MaintenanceJob {
  id: string;
  vesselName: string;
  jobType: 'HAUL_OUT' | 'ENGINE_SERVICE' | 'GENERAL_REPAIR';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'WAITING_PARTS' | 'COMPLETED';
  scheduledDate: string;
  contractor: string;
  partsStatus: 'N/A' | 'ORDERED' | 'ARRIVED';
  notes: string;
  logs: MaintenanceLogEntry[];
}

export interface WeatherForecast {
  day: string;
  temp: number;
  condition: string;
  windSpeed: number;
  windDir: string;
}

export interface CongressEvent {
  id: string;
  name: string;
  dates: { start: string; end: string };
  venues: string[];
  status: string;
  delegateCount: number;
}

export interface Delegate {
  id: string;
  name: string;
  company: string;
  status: 'CHECKED_IN' | 'IN_TRANSIT' | 'REGISTERED';
  location: string;
}

export interface OrchestratorResponse {
  text: string;
  actions: AgentAction[];
  traces: AgentTraceLog[];
}

export interface GuestProfile {
  id: string;
  fullName: string;
  nationality: string;
  dob: string;
  vesselName: string;
}

// NEW: Federated Marina and Berth Availability Types
export interface FederatedMarina {
  id: string;
  name: string;
  node_address: string;
  status: 'ONLINE' | 'OFFLINE';
  api_endpoint?: string;
  region?: string;
  tier?: string;
}

export interface FederatedBerthAvailability {
  marinaId: string;
  date: string;
  totalBerths: number;
  availableBerths: number;
  occupancyRate: number;
  message: string;
}

// NEW: Consolidated Tenant Configuration
export interface TenantConfig {
  id: string;
  name: string;
  fullName: string;
  network: string;
  node_address: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  api_endpoint?: string;
  region?: string;
  tier?: string;
  mission: string;
  contextSources: string[];
  rules: any; // Parsed YAML content (or similar structured data)
  doctrine: string; // Parsed CLAUDE.md content
  masterData: any; // Entire wimMasterData.ts or similar for other tenants
  // Add other specific properties as needed, e.g., for Phisedelia
  vesselType?: string;
  flag?: string;
  operationalLimits?: any;
  racingRules?: any;
  systemThresholds?: any;
  communicationProtocols?: any;
  requiredDocumentsRace?: string[];
  sensors?: any;
  autonomyLevels?: any;
}