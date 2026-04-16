// services/brain/AdaBrain.ts
import { AgentContext, AgentObservation, AgentAction, DecisionStepLog } from './types';
import { runMdapGraph } from '../decomposition/mdapExecutor';

export class AdaBrain {
  private context: AgentContext;
  private logs: DecisionStepLog[] = [];

  constructor(initialContext?: Partial<AgentContext>) {
    this.context = {
      workingMemory: [],
      episodicMemory: [],
      semanticMemory: [],
      proceduralMemory: [],
      ...initialContext,
    } as AgentContext;
  }

  getContext() {
    return this.context;
  }

  getLogs() {
    return this.logs;
  }

  async handleObservation(obs: AgentObservation, mdapGraphId: string): Promise<AgentAction[]> {
    this.context.workingMemory.push({
      id: `wm_${Date.now()}`,
      type: 'working',
      timestamp: Date.now(),
      key: 'last_observation',
      data: obs,
    });

    const actions = await runMdapGraph(mdapGraphId, this.context, obs);

    actions.forEach((a) => {
      this.logs.push({
        step: this.logs.length + 1,
        observation: obs,
        chosenAction: a,
      });
    });

    return actions;
  }
}