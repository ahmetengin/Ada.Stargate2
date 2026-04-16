// services/agents/hrAgent.ts

import { AgentTraceLog, NodeName } from '../../types';
import { wimMasterData } from '../wimMasterData';
import { TaskHandlerFn } from '../decomposition/types';

const createLog = (node: NodeName, step: AgentTraceLog['step'], content: string, persona: 'ORCHESTRATOR' | 'EXPERT' | 'WORKER' = 'ORCHESTRATOR'): AgentTraceLog => ({
    id: `trace_hr_${Date.now()}_${Math.random()}`,
    timestamp: new Date().toLocaleTimeString(),
    node,
    step,
    content,
    persona
});

// --- MOCK HR DATABASE ---
const STAFF_SCHEDULE = {
    'Security': [
        { name: 'Ahmet Yılmaz', shift: '08:00-16:00', status: 'ON_DUTY', last_patrol: '14:30 (OK)' },
        { name: 'Murat Kaya', shift: '08:00-16:00', status: 'ON_DUTY', last_patrol: '14:45 (OK)' },
        { name: 'Zeynep Aydın', shift: '16:00-24:00', status: 'OFF_DUTY', last_patrol: 'N/A' },
    ],
    'Linesman': [
        { name: 'Hasan Vural', shift: '08:00-16:00', status: 'ON_DUTY', last_op: '15:05 (Arrival)' },
        { name: 'İsmail Çetin', shift: '16:00-24:00', status: 'OFF_DUTY', last_op: 'N/A' }
    ],
};

export const hrExpert = {
    // Skill: Get current shift schedule
    getShiftSchedule: async (department: string, addTrace: (t: AgentTraceLog) => void): Promise<{ department: string, schedule: any[] }> => {
        addTrace(createLog('ada.hr', 'TOOL_EXECUTION', `Querying Kronos DB for ${department} shift...`, 'WORKER'));
        const schedule = (STAFF_SCHEDULE as any)[department] || [];
        return { department, schedule };
    },

    // Skill: Track Patrol Status
    trackPatrolStatus: async (addTrace: (t: AgentTraceLog) => void): Promise<{ on_time: number, late: number, total: number, message: string }> => {
        addTrace(createLog('ada.hr', 'THINKING', `Analyzing security patrol completion rates...`, 'EXPERT'));
        
        // Mock logic
        const on_time = 2;
        const late = 0;
        const total = on_time + late;
        let message = `**PATROL STATUS: GREEN**\n\nAll security patrols are on schedule. Last checkpoint scanned 15 minutes ago.`;
        if(late > 0) {
            message = `**PATROL STATUS: AMBER**\n\n${late} security patrol(s) are overdue. Notifying shift supervisor.`;
        }

        addTrace(createLog('ada.hr', 'OUTPUT', `Patrols: ${on_time} on time, ${late} late.`, 'WORKER'));

        return { on_time, late, total, message };
    }
};

// --- Handlers for the Brain ---
export const hrHandlers: Record<string, TaskHandlerFn> = {
    'hr.getShiftSchedule': async (ctx: any, obs: any) => {
        const { department } = obs.payload;
        const result = await hrExpert.getShiftSchedule(department, () => {});
        return [{
            id: `act_hr_shift_${Date.now()}`,
            kind: 'internal',
            name: 'hr.shiftScheduleResult',
            params: result
        }];
    }
};