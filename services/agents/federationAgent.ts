// services/agents/federationAgent.ts

import { AgentAction, AgentTraceLog, NodeName, FederatedBerthAvailability } from '../../types';
import { TaskHandlerFn } from '../decomposition/types';
import { FEDERATION_REGISTRY } from '../config';
import { getCurrentMaritimeTime } from '../utils';

// Helper to create a log
const createLog = (node: NodeName, step: AgentTraceLog['step'], content: string, persona: 'ORCHESTRATOR' | 'EXPERT' | 'WORKER' = 'ORCHESTRATOR'): AgentTraceLog => ({
    id: `trace_fed_${Date.now()}_${Math.random()}`,
    timestamp: getCurrentMaritimeTime(),
    node,
    step,
    content,
    persona
});

export const federationExpert = {
    
    // Skill: Get Berth Availability from a Partner Marina
    getRemoteBerthAvailability: async (marinaId: string, date: string, addTrace: (t: AgentTraceLog) => void): Promise<FederatedBerthAvailability | null> => {
        addTrace(createLog('ada.federation', 'THINKING', `Attempting to query berth availability from federated partner: '${marinaId}' for ${date}...`, 'EXPERT'));

        const partner = FEDERATION_REGISTRY.peers.find(p => p.node_address === marinaId || p.id === marinaId.toLowerCase());

        if (!partner) {
            addTrace(createLog('ada.federation', 'ERROR', `Partner marina '${marinaId}' not found in Federation Registry.`, 'EXPERT'));
            return null;
        }

        if (partner.status !== 'ONLINE') {
            addTrace(createLog('ada.federation', 'WARNING', `Partner marina '${partner.name}' is currently offline. Cannot retrieve real-time data.`, 'EXPERT'));
            return null;
        }

        // Simulate API call to partner's endpoint
        // In a real scenario, this would be a fetch() call to partner.api_endpoint
        addTrace(createLog('ada.federation', 'TOOL_EXECUTION', `Invoking API for ${partner.name}: ${partner.api_endpoint}/berths/availability?date=${date}`, 'WORKER'));
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

        // --- MOCK RESPONSES FOR PARTNER MARINAS ---
        let mockAvailability: FederatedBerthAvailability;

        if (partner.id === 'setur_kalamis') {
            mockAvailability = {
                marinaId: partner.id,
                date: date,
                totalBerths: 1000,
                availableBerths: 120,
                occupancyRate: 88,
                message: `Setur Kalamış & Fenerbahçe Marina has **120 berths available** for ${date}. Occupancy is 88%.`
            };
        } else if (partner.id === 'dmaris_gocek') {
            mockAvailability = {
                marinaId: partner.id,
                date: date,
                totalBerths: 400,
                availableBerths: 15,
                occupancyRate: 96,
                message: `D-Marin Göcek has **only 15 berths available** for ${date}. High season, occupancy is 96%.`
            };
        } else if (partner.id === 'setur_midilli') {
            mockAvailability = {
                marinaId: partner.id,
                date: date,
                totalBerths: 200,
                availableBerths: 45,
                occupancyRate: 77.5,
                message: `Setur Mytilene Marina (Lesvos, Greece) has **45 berths available** for ${date}.`
            };
        } else if (partner.id === 'ycm_monaco') {
            mockAvailability = {
                marinaId: partner.id,
                date: date,
                totalBerths: 100, // Very exclusive
                availableBerths: 2,
                occupancyRate: 98,
                message: `Yacht Club de Monaco has **extremely limited availability (2 berths)** for ${date}. Requires advance booking.`
            };
        } else {
            // Default/Generic response for unknown partners
            mockAvailability = {
                marinaId: partner.id,
                date: date,
                totalBerths: 500,
                availableBerths: Math.floor(Math.random() * 100),
                occupancyRate: Math.floor(Math.random() * 30) + 70, // 70-100%
                message: `Partner marina '${partner.name}' has **${Math.floor(Math.random() * 100)} berths available** for ${date}.`
            };
        }
        
        addTrace(createLog('ada.federation', 'OUTPUT', `Received availability data from ${partner.name}.`, 'EXPERT'));
        return mockAvailability;
    }
};

// --- Handlers for the Brain (if used in MDAP graph) ---
export const federationHandlers: Record<string, TaskHandlerFn> = {
    'federation.getBerthAvailability': async (ctx: any, obs: any) => {
        const { marinaId, date } = obs.payload;
        const result = await federationExpert.getRemoteBerthAvailability(marinaId, date, () => {});
        return [{
            id: `act_fed_berth_${Date.now()}`,
            kind: 'internal',
            name: 'federation.berthAvailabilityResult',
            params: result
        }];
    }
};