// services/agents/genericAgent.ts
import { TaskHandlerFn } from '../decomposition/types';

const llmQueryHandler: TaskHandlerFn = async (ctx, obs) => {
    console.log('[Agent: Generic] Preparing to query LLM with current context...');
    const userPrompt = obs.payload?.text || "Summarize the situation and respond.";
    // This action just signals the orchestrator (App.tsx) to call the LLM.
    // The params can contain the prompt to be sent.
    return [{
        id: `act_${Date.now()}`,
        kind: 'internal',
        name: 'generic.llmQuery',
        params: { prompt: userPrompt },
    }];
};

export const genericHandlers: Record<string, TaskHandlerFn> = {
  'generic.llmQuery': llmQueryHandler,
};
