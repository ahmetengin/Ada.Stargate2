
import { AgentAction, AgentTraceLog, NodeName } from '../../types';
import { wimMasterData } from '../wimMasterData';
import { TaskHandlerFn } from '../decomposition/types';

// Helper to create a log
const createLog = (node: NodeName, step: AgentTraceLog['step'], content: string, persona: 'ORCHESTRATOR' | 'EXPERT' | 'WORKER' = 'ORCHESTRATOR'): AgentTraceLog => ({
    id: `trace_berth_${Date.now()}_${Math.random()}`,
    timestamp: new Date().toLocaleTimeString(),
    node,
    step,
    content,
    persona
});

export const berthExpert = {
    
    // Skill: Find Optimal Berth (The Harbormaster Protocol)
    findOptimalBerth: async (vesselParams: { loa: number, beam: number, draft: number, type: string }, addTrace: (t: AgentTraceLog) => void): Promise<{ berth: string, pontoon: string, reasoning: string, priceQuote?: number }> => {
        
        addTrace(createLog('ada.berth', 'THINKING', `Harbormaster Analysis: Seeking berth for ${vesselParams.type} (${vesselParams.loa}m x ${vesselParams.beam}m, Draft: ${vesselParams.draft}m)...`, 'EXPERT'));

        let assignedPontoon = "C"; // Default
        let reasoning = "Standard allocation based on LOA.";
        let tier = "STANDARD";

        // Logic based on WIM Master Data definitions
        if (vesselParams.loa > 30) {
            assignedPontoon = "VIP";
            tier = "VIP";
            reasoning = "Vessel size (>30m) requires VIP Quay for deep water access and security.";
        } else if (vesselParams.type.includes('VO65') || vesselParams.type.includes('Racing')) {
            // Racing yachts need space and easy exit
            assignedPontoon = "T";
            tier = "PREMIUM";
            reasoning = "High-performance racing vessel. T-Head assigned for rapid deployment and deep draft clearance.";
        } else if (vesselParams.loa > 20) {
            assignedPontoon = "T";
            tier = "PREMIUM";
            reasoning = "Large vessel (>20m). T-Head preferred for windage and maneuverability.";
        } else if (vesselParams.loa > 15) {
            assignedPontoon = "A";
            tier = "PREMIUM";
            reasoning = "Mid-size cruiser. Pontoon A provides proximity to social areas.";
        } else {
            assignedPontoon = "C";
            tier = "STANDARD";
            reasoning = "Standard leisure craft. Protected inner berth assigned.";
        }

        // Calculate Price
        const price = await berthExpert.calculateBerthPrice(vesselParams.loa, vesselParams.beam, tier, addTrace);

        addTrace(createLog('ada.berth', 'OUTPUT', `Optimal Allocation: ${assignedPontoon}-12 (Tier: ${tier}). Reasoning: ${reasoning}`, 'WORKER'));

        return {
            berth: `${assignedPontoon}-12`,
            pontoon: assignedPontoon,
            reasoning: reasoning,
            priceQuote: price
        };
    },

    // Skill: Calculate Berth Price (Dynamic Yield Management)
    calculateBerthPrice: async (loa: number, beam: number, tier: string, addTrace: (t: AgentTraceLog) => void): Promise<number> => {
        // Article E.7.4: Fees based on LOA x B.Max (Area)
        const area = loa * beam;
        const baseRate = wimMasterData.legal_framework.base_pricing.mooring_daily;
        
        // Get Multipliers
        const multipliers = wimMasterData.legal_framework.pricing_multipliers as any;
        const tierMult = multipliers.tiers[tier] || 1.0;
        const seasonalMult = multipliers.seasonality['HIGH']; // Assuming Summer

        const dailyPrice = area * baseRate * tierMult * seasonalMult;

        addTrace(createLog('ada.berth', 'THINKING', `Pricing Logic: ${area.toFixed(1)}m² * €${baseRate} * ${tierMult} (Tier) * ${seasonalMult} (Season) = €${dailyPrice.toFixed(2)}`, 'EXPERT'));

        return Math.round(dailyPrice * 100) / 100;
    }
};

// --- Handlers for the Brain ---
export const berthHandlers: Record<string, TaskHandlerFn> = {
    'berth.findOptimal': async (ctx: any, obs: any) => {
        const { loa, beam, draft, type } = obs.payload;
        const result = await berthExpert.findOptimalBerth({ loa, beam, draft, type }, () => {});
        return [{
            id: `act_berth_assign_${Date.now()}`,
            kind: 'internal',
            name: 'berth.assignmentResult',
            params: result
        }];
    },
    'berth.calculatePrice': async (ctx: any, obs: any) => {
        const { loa, beam, tier } = obs.payload;
        const price = await berthExpert.calculateBerthPrice(loa, beam, tier, () => {});
        return [{
            id: `act_berth_price_${Date.now()}`,
            kind: 'internal',
            name: 'berth.priceCalculated',
            params: { price }
        }];
    }
};