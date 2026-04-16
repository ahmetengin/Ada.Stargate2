// services/agents/analyticsAgent.ts

import { AgentTraceLog, NodeName } from '../../types';
import { wimMasterData } from '../wimMasterData';
import { TaskHandlerFn } from '../decomposition/types';

const createLog = (node: NodeName, step: AgentTraceLog['step'], content: string, persona: 'ORCHESTRATOR' | 'EXPERT' | 'WORKER' = 'ORCHESTRATOR'): AgentTraceLog => ({
    id: `trace_ana_${Date.now()}_${Math.random()}`,
    timestamp: new Date().toLocaleTimeString(),
    node,
    step,
    content,
    persona
});

export const analyticsExpert = {
    // Skill: Predict future occupancy
    predictOccupancy: async (period: '1M' | '3M' | '6M', addTrace: (t: AgentTraceLog) => void): Promise<{ period: string, prediction: number, confidence: number, message: string }> => {
        addTrace(createLog('ada.analytics', 'THINKING', `Running ${wimMasterData.analytics_data.prediction_model} model for ${period} occupancy forecast...`, 'EXPERT'));
        
        // Mock prediction logic
        let prediction = 0;
        if (period === '1M') prediction = 91;
        if (period === '3M') prediction = 94; // Holiday season
        if (period === '6M') prediction = 87;
        const confidence = 88;

        addTrace(createLog('ada.analytics', 'TOOL_EXECUTION', `Model Output: ${prediction}% occupancy with ${confidence}% confidence.`, 'WORKER'));

        const message = `**OCCUPANCY FORECAST (${period})**\n\n` +
                        `Based on historical data and seasonal trends, the predicted occupancy rate is **${prediction}%**.\n\n` +
                        `*Confidence Level: ${confidence}%*`;
        
        return { period, prediction, confidence, message };
    },

    // Skill: Run a "What-If" scenario
    runWhatIfScenario: async (scenario: string, addTrace: (t: AgentTraceLog) => void): Promise<{ message: string }> => {
        addTrace(createLog('ada.analytics', 'THINKING', `Simulating "What-If" scenario: "${scenario}"...`, 'EXPERT'));

        let result = "";
        if (scenario.toLowerCase().includes('price') && scenario.toLowerCase().includes('10%')) {
            result = "Increasing prices by 10% during peak season is projected to increase revenue by 6% while causing a minor 2% drop in occupancy.";
        } else if (scenario.toLowerCase().includes('ponton')) {
            result = "Adding a new pontoon (Pontoon E) with 50 berths is projected to have a Return on Investment (ROI) period of 4.5 years, assuming 80% average occupancy.";
        } else {
            result = "Scenario parameters are insufficient for a detailed analysis.";
        }

        addTrace(createLog('ada.analytics', 'OUTPUT', `Simulation Result: ${result}`, 'WORKER'));

        return { message: `**WHAT-IF SCENARIO ANALYSIS**\n\n**Query:** *${scenario}*\n\n**Result:**\n${result}` };
    }
};

// --- Handlers for the Brain ---
export const analyticsHandlers: Record<string, TaskHandlerFn> = {
    'analytics.predictOccupancy': async (ctx: any, obs: any) => {
        const { period } = obs.payload;
        const result = await analyticsExpert.predictOccupancy(period, () => {});
        return [{
            id: `act_ana_predict_${Date.now()}`,
            kind: 'internal',
            name: 'analytics.predictionResult',
            params: result
        }];
    }
};