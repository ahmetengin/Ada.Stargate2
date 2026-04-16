
import { AgentAction, AgentTraceLog, NodeName } from '../../types';
import { wimMasterData } from '../wimMasterData';
import { TaskHandlerFn } from '../decomposition/types';

// Helper to create a log
const createLog = (node: NodeName, step: AgentTraceLog['step'], content: string, persona: 'ORCHESTRATOR' | 'EXPERT' | 'WORKER' = 'ORCHESTRATOR'): AgentTraceLog => ({
    id: `trace_${Date.now()}_${Math.random()}`,
    timestamp: new Date().toLocaleTimeString(),
    node,
    step,
    content,
    persona
});

export const facilityExpert = {
    
    // Skill: Check Infrastructure Status (Pedestals/Water)
    checkInfrastructureStatus: async (addTrace: (t: AgentTraceLog) => void): Promise<{ status: string, alerts: string[] }> => {
        addTrace(createLog('ada.facility', 'THINKING', `Running diagnostic scan on 350 pedestals and utility grids...`, 'EXPERT'));
        
        // Mock Logic
        const faults = ["Pedestal B-12: Breaker Trip", "Water Line C: Pressure Drop"];
        
        addTrace(createLog('ada.facility', 'TOOL_EXECUTION', `SCADA System: 98% Operational. 2 Alerts detected.`, 'WORKER'));
        
        return {
            status: 'OPERATIONAL',
            alerts: faults
        };
    },

    // Skill: Manage Utility Grid (Smart Grid)
    manageUtilityGrid: async (addTrace: (t: AgentTraceLog) => void): Promise<{ load: number, optimization: string }> => {
        addTrace(createLog('ada.facility', 'THINKING', `Analyzing Real-time Power Consumption (Smart Grid)...`, 'EXPERT'));
        
        // Mock Data
        const currentLoad = 85; // %
        let optimization = "Normal Operation";
        
        if (currentLoad > 90) {
            optimization = "Load Shedding Active (Non-critical systems dimmed)";
            addTrace(createLog('ada.facility', 'WARNING', `Peak Load Detected (${currentLoad}%). Initiating eco-mode protocol.`, 'WORKER'));
        } else {
            addTrace(createLog('ada.facility', 'OUTPUT', `Grid Load: ${currentLoad}%. Systems nominal.`, 'WORKER'));
        }

        return { load: currentLoad, optimization };
    },

    // Skill: Control Pedestal (Remote Utility Management)
    controlPedestal: async (pedestalId: string, action: string, addTrace: (t: AgentTraceLog) => void): Promise<{ success: boolean, message: string }> => {
        addTrace(createLog('ada.facility', 'THINKING', `Processing remote command for ${pedestalId}: ${action.toUpperCase()}...`, 'EXPERT'));
        
        // Simulate IoT latency
        await new Promise(resolve => setTimeout(resolve, 800));

        addTrace(createLog('ada.facility', 'TOOL_EXECUTION', `Sending encoded signal to Pedestal Controller (PLC)...`, 'WORKER'));
        
        // Determine state for messaging
        let newState = 'UNKNOWN';
        if (action.toLowerCase() === 'toggle') newState = 'ON (Toggled)';
        else if (action.toLowerCase() === 'on') newState = 'ON';
        else if (action.toLowerCase() === 'off') newState = 'OFF';
        else if (action.toLowerCase() === 'reset') newState = 'RESET';

        const message = `**PEDESTAL CONTROL**\n\nCommand execution successful for **${pedestalId}**.\nAction: **${action.toUpperCase()}**\nNew State: **${newState}**.\n\n*Telemetry confirmed.*`;
        
        return { success: true, message };
    },

    // Skill: Generate Zero Waste Report (Sustainability Audit)
    generateZeroWasteReport: async (addTrace: (t: AgentTraceLog) => void): Promise<{ compliance: string, recyclingRate: number, nextAudit: string, message: string }> => {
        addTrace(createLog('ada.facility', 'THINKING', `Compiling Zero Waste (Sıfır Atık) Compliance Report for Ministry Audit...`, 'EXPERT'));

        // Mock Data - In real life, this comes from IoT scales on waste bins
        const stats = {
            paper: 1250, // kg
            plastic: 840,
            metal: 320,
            glass: 450,
            organic: 600,
            hazardous: 45 // Waste oil etc.
        };
        const total = Object.values(stats).reduce((a,b) => a+b, 0);
        const recycled = total - stats.organic; // Simplified logic
        const rate = Math.round((recycled / total) * 100);

        addTrace(createLog('ada.facility', 'TOOL_EXECUTION', `Querying Waste Management DB... Total Vol: ${total}kg. Recyclables: ${recycled}kg.`, 'WORKER'));

        const message = `**ZERO WASTE (SIFIR ATIK) STATUS REPORT**\n\n` +
                        `**Certificate Level:** ${wimMasterData.facility_management?.environmental_compliance.zero_waste_certificate}\n` +
                        `**Recycling Rate:** ${rate}% (Target: >40%)\n\n` +
                        `**Waste Breakdown (Monthly):**\n` +
                        `- 🔵 Paper: ${stats.paper}kg\n` +
                        `- 🟡 Plastic: ${stats.plastic}kg\n` +
                        `- 🟢 Glass: ${stats.glass}kg\n` +
                        `- 🟠 Hazardous: ${stats.hazardous}kg (MoTAT Entry Confirmed)\n\n` +
                        `> **Audit Readiness:** READY. All declarations submitted to EÇBS.`;

        return {
            compliance: 'COMPLIANT',
            recyclingRate: rate,
            nextAudit: '2025-12-15',
            message: message
        };
    },

    // Skill: Check Sea Water Quality (Blue Flag)
    checkSeaWaterQuality: async (addTrace: (t: AgentTraceLog) => void): Promise<{ status: 'BLUE' | 'RED', data: any, message: string }> => {
        addTrace(createLog('ada.facility', 'THINKING', `Retrieving latest Sea Water Analysis (Ministry of Health Lab Result)...`, 'EXPERT'));
        
        // Simulated Lab Data
        // E. Coli limit: 250, Enterococci limit: 100
        const analysis = {
            date: new Date().toISOString().split('T')[0],
            location: "Kumsal Beach Sample Point 1",
            e_coli: 12, // cfu/100ml (Very Clean)
            enterococci: 5, // cfu/100ml (Very Clean)
            ph: 8.1,
            transparency: "Clear > 2m"
        };

        addTrace(createLog('ada.facility', 'TOOL_EXECUTION', `Lab Report: E.coli ${analysis.e_coli}, Enterococci ${analysis.enterococci}.`, 'WORKER'));

        const isClean = analysis.e_coli < 250 && analysis.enterococci < 100;
        const status = isClean ? 'BLUE' : 'RED';

        const message = `**BLUE FLAG ANALYSIS REPORT**\n\n` +
                        `**Status:** ${isClean ? '🟢 EXCELLENT (Blue Flag Active)' : '🔴 CRITICAL (Beach Closed)'}\n` +
                        `**Sample Date:** ${analysis.date}\n\n` +
                        `**Lab Results:**\n` +
                        `- E. Coli: **${analysis.e_coli}** cfu/100ml (Limit: 250)\n` +
                        `- Int. Enterococci: **${analysis.enterococci}** cfu/100ml (Limit: 100)\n` +
                        `- Transparency: **${analysis.transparency}**\n\n` +
                        `> **FEE Compliance:** 100%. Lifeguard on duty.`;

        return { status, data: analysis, message };
    },

    // Skill: HSE Audit (Occupational Safety)
    auditHSE: async (addTrace: (t: AgentTraceLog) => void): Promise<{ score: number, issues: string[] }> => {
        addTrace(createLog('ada.facility', 'THINKING', `Initiating HSE (Health, Safety, Environment) Digital Audit...`, 'EXPERT'));
        
        const issues = [
            "Pontoon B: Life Buoy housing cracked",
            "Workshop: PPE compliance spot check passed"
        ];
        
        addTrace(createLog('ada.facility', 'OUTPUT', `HSE Score: 95/100. 1 Minor issue logged.`, 'WORKER'));
        
        return { score: 95, issues };
    }
};

// --- Handlers for the Brain ---
export const facilityHandlers: Record<string, TaskHandlerFn> = {
    'facility.checkStatus': async (ctx: any, obs: any) => {
        const result = await facilityExpert.checkInfrastructureStatus(() => {});
        return [{
            id: `act_fac_status_${Date.now()}`,
            kind: 'internal',
            name: 'facility.statusResult',
            params: result
        }];
    }
};
