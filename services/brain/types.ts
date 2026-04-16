// services/brain/types.ts
export type MemoryType = 'working' | 'episodic' | 'semantic' | 'procedural';

export interface MemoryItem {
  id: string;
  type: MemoryType;
  timestamp: number;
  key: string;
  data: any;
  tags?: string[];
}

export interface AgentObservation {
  source: 'user' | 'api' | 'sensor' | 'internal';
  payload: any;
  timestamp: number;
}

export interface AgentAction {
  id: string;
  kind: 'internal' | 'external';
  name: string;
  params: any;
}

export interface DecisionStepLog {
  step: number;
  observation: AgentObservation;
  chosenAction: AgentAction;
  reasoningTrace?: string;
}

export interface AgentContext {
  workingMemory: MemoryItem[];
  episodicMemory: MemoryItem[];
  semanticMemory: MemoryItem[];
  proceduralMemory: MemoryItem[];
}