// services/agents/weatherAgent.ts
import { TaskHandlerFn } from '../decomposition/types';

const getCurrent: TaskHandlerFn = async (ctx, obs) => {
  console.log('[Agent: Weather] Getting current weather conditions...');
  // In a real system, this would call an API. Here we just confirm the step was executed.
  return [{
    id: `act_${Date.now()}`,
    kind: 'internal',
    name: 'weather.conditions.checked',
    params: { status: 'OK', summary: 'Wind 15kts NW, Clear skies.' },
  }];
};

const broadcastWarning: TaskHandlerFn = async (ctx, obs) => {
    console.log('[Agent: Weather] Broadcasting weather warning...');
    return [{
        id: `act_${Date.now()}`,
        kind: 'external',
        name: 'weather.broadcastWarning',
        params: { message: 'Gale warning issued for Sector Zulu. All vessels are advised to return to port or seek shelter.' },
    }];
};

export const weatherHandlers: Record<string, TaskHandlerFn> = {
  'weather.getCurrent': getCurrent,
  'weather.broadcastWarning': broadcastWarning,
};
