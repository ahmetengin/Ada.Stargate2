
import { AgentAction, AgentTraceLog, NodeName, CongressEvent, Delegate } from '../../types';
import { wimMasterData } from '../wimMasterData';
import { passkitExpert } from './passkitAgent';

const createLog = (node: NodeName, step: AgentTraceLog['step'], content: string, persona: 'ORCHESTRATOR' | 'EXPERT' | 'WORKER' = 'ORCHESTRATOR'): AgentTraceLog => ({
    id: `trace_${Date.now()}_${Math.random()}`,
    timestamp: new Date().toLocaleTimeString(),
    node,
    step,
    content,
    persona
});

// MOCK DATA
const ACTIVE_EVENT: CongressEvent = {
    id: 'EVT-2025-YACHT-SUMMIT',
    name: 'Global Superyacht Summit 2025',
    dates: { start: '2025-11-25', end: '2025-11-27' },
    venues: ['WIM Grand Ballroom', 'Kumsal Beach Gala Area'],
    status: 'LIVE',
    delegateCount: 450
};

const MOCK_DELEGATES: Delegate[] = [
    { id: 'DEL-001', name: 'Jean-Luc Picard', company: 'Starfleet Marine', status: 'CHECKED_IN', location: 'WIM Grand Ballroom' },
    { id: 'DEL-002', name: 'William Riker', company: 'Titan Salvage', status: 'IN_TRANSIT', location: 'Transfer (Mercedes Vito)' },
    { id: 'DEL-003', name: 'Beverly Crusher', company: 'MedAssist', status: 'REGISTERED', location: 'Hotel (Kaya Ramada)' }
];

export const congressExpert = {
    
    getEventDetails: async (): Promise<CongressEvent> => {
        return ACTIVE_EVENT;
    },

    getDelegates: async (): Promise<Delegate[]> => {
        return MOCK_DELEGATES;
    },

    // Skill: Register Delegate & Issue Badge
    registerDelegate: async (name: string, company: string, addTrace: (t: AgentTraceLog) => void): Promise<{ success: boolean, message: string, badgeUrl?: string, actions: AgentAction[] }> => {
        addTrace(createLog('ada.congress', 'THINKING', `Processing registration for ${name} (${company})...`, 'EXPERT'));
        
        if (ACTIVE_EVENT.delegateCount >= 500) {
             return { success: false, message: "Event capacity reached.", actions: [] };
        }

        addTrace(createLog('ada.congress', 'TOOL_EXECUTION', `Requesting Digital Badge from ada.passkit...`, 'WORKER'));
        const passResult = await passkitExpert.issuePass(ACTIVE_EVENT.name, name, 'GUEST', () => {});

        const actions: AgentAction[] = [];
        actions.push({
            id: `congress_reg_${Date.now()}`,
            kind: 'external',
            name: 'ada.passkit.generated',
            params: passResult
        });

        return {
            success: true,
            message: `**REGISTRATION CONFIRMED**\n\nWelcome to **${ACTIVE_EVENT.name}**.\n\n> **Delegate:** ${name}\n> **Company:** ${company}\n> **Access:** All Sessions + Gala Dinner\n\n*Your Digital Badge has been sent to your wallet.*`,
            badgeUrl: passResult.passUrl,
            actions
        };
    },

    // Skill: Locate Delegate (Logistics)
    locateDelegate: async (delegateName: string, addTrace: (t: AgentTraceLog) => void): Promise<string> => {
        const delegate = MOCK_DELEGATES.find(d => d.name.toLowerCase().includes(delegateName.toLowerCase()));
        if (!delegate) return "Delegate not found.";

        addTrace(createLog('ada.congress', 'TOOL_EXECUTION', `Triangulating delegate position via PassKit beacon...`, 'WORKER'));
        return `**STATUS REPORT:** ${delegate.name}\nStatus: **${delegate.status}**\nLocation: **${delegate.location}**`;
    }
};
