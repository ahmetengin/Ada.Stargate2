
import { AgentAction, AgentTraceLog, NodeName } from '../../types';
import { TaskHandlerFn } from '../decomposition/types';
import { berthExpert } from './berthAgent'; // Uses berth expert logic

// Helper to create a log
const createLog = (node: NodeName, step: AgentTraceLog['step'], content: string, persona: 'ORCHESTRATOR' | 'EXPERT' | 'WORKER' = 'ORCHESTRATOR'): AgentTraceLog => ({
    id: `trace_res_${Date.now()}_${Math.random()}`,
    timestamp: new Date().toLocaleTimeString(),
    node,
    step,
    content,
    persona
});

export const reservationsExpert = {
    
    // Skill: Process Booking Request (Public Facing)
    processBooking: async (vesselSpecs: { name: string, type: string, loa: number, beam: number }, dates: { start: string, end: string }, addTrace: (t: AgentTraceLog) => void): Promise<{ success: boolean, message: string, proposal?: any }> => {
        
        addTrace(createLog('ada.reservations', 'THINKING', `Processing booking request for ${vesselSpecs.name} (${dates.start} to ${dates.end})...`, 'EXPERT'));

        // 1. Call Berth Expert for Assignment
        const assignment = await berthExpert.findOptimalBerth({ 
            loa: vesselSpecs.loa, 
            beam: vesselSpecs.beam, 
            draft: 3.0, // Default draft if unknown
            type: vesselSpecs.type 
        }, addTrace);

        // 2. Generate Proposal
        const days = 5; // Simplified duration calc
        const totalCost = (assignment.priceQuote || 0) * days;

        addTrace(createLog('ada.reservations', 'TOOL_EXECUTION', `Generated Booking ID: BK-${Date.now().toString().slice(-6)}. Total Value: €${totalCost}`, 'WORKER'));

        const message = `**BOOKING PROPOSAL**\n\n` +
                        `**Vessel:** ${vesselSpecs.name}\n` +
                        `**Dates:** ${dates.start} - ${dates.end} (${days} Nights)\n\n` +
                        `**Optimal Assignment:** ${assignment.berth}\n` +
                        `> *Reasoning: ${assignment.reasoning}*\n\n` +
                        `**Financials:**\n` +
                        `- Daily Rate: €${assignment.priceQuote}\n` +
                        `- **Total Estimate: €${totalCost.toFixed(2)}**\n\n` +
                        `*To confirm this reservation, please proceed to payment.*`;

        return {
            success: true,
            message: message,
            proposal: { ...assignment, totalCost }
        };
    }
};

// --- Handlers ---
export const reservationsHandlers: Record<string, TaskHandlerFn> = {
    'reservations.create': async (ctx: any, obs: any) => {
        const { vessel, dates } = obs.payload;
        const res = await reservationsExpert.processBooking(vessel, dates, () => {});
        return [{
            id: `act_res_book_${Date.now()}`,
            kind: 'external',
            name: 'reservations.proposalGenerated',
            params: res
        }];
    }
};