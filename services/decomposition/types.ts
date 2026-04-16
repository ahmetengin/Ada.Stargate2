// services/decomposition/types.ts
import { AgentContext, AgentObservation, AgentAction } from '../brain/types';

export interface TaskNode {
  id: string;
  description: string;
  module: 'travel' | 'payment' | 'crm' | 'sea' | 'generic' | 'marina' | 'weather';
  handler: string;
  next: string[];
}

export interface MdapGraph {
  id: string;
  name: string;
  nodes: TaskNode[];
  entryNode: string;
}

export type TaskHandlerFn = (ctx: AgentContext, obs: AgentObservation) => Promise<AgentAction[]>;