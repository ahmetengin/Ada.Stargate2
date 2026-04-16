
import { AgentAction, AgentTraceLog, MaintenanceJob, NodeName, UserProfile, MaintenanceLogEntry } from '../../types';
import { TaskHandlerFn } from '../decomposition/types';
import { persistenceService, STORAGE_KEYS } from '../persistence'; // Enterprise Persistence

// Helper to create a log
const createLog = (node: NodeName, step: AgentTraceLog['step'], content: string, persona: 'ORCHESTRATOR' | 'EXPERT' | 'WORKER' = 'ORCHESTRATOR'): AgentTraceLog => ({
    id: `trace_${Date.now()}_${Math.random()}`,
    timestamp: new Date().toLocaleTimeString(),
    node,
    step,
    content,
    persona
});

// Helper to timestamp internal job logs
const getJobTimestamp = (): string => new Date().toLocaleString('en-GB', { hour12: false });

// --- DEFAULT TECHNIC DATA ---
const DEFAULT_JOBS: MaintenanceJob[] = [
    {
        id: 'JOB-1023',
        vesselName: 'M/Y Poseidon',
        jobType: 'HAUL_OUT',
        status: 'SCHEDULED',
        scheduledDate: '2025-11-25 09:00',
        contractor: 'WIM Tech Services',
        partsStatus: 'N/A',
        notes: '700T Lift Reserved. Hull inspection.',
        logs: [
            { timestamp: '20/11/2025 09:00', stage: 'SCHEDULED', details: 'Job created. 700T Travel Lift slot reserved.' }
        ]
    },
    {
        id: 'JOB-1024',
        vesselName: 'S/Y Mistral',
        jobType: 'ENGINE_SERVICE',
        status: 'WAITING_PARTS',
        scheduledDate: '2025-11-22',
        contractor: 'Authorized Volvo Penta Service',
        partsStatus: 'ORDERED',
        notes: 'Main engine overhaul. Filters ordered from Italy.',
        logs: [
            { timestamp: '18/11/2025 10:30', stage: 'SCHEDULED', details: 'Engine service booked.' },
            { timestamp: '18/11/2025 14:00', stage: 'PARTS_ORDERED', details: 'Oil filters and gaskets ordered from VP Italy.' }
        ]
    },
    {
        id: 'JOB-1025',
        vesselName: 'Tender Charlie',
        jobType: 'GENERAL_REPAIR',
        status: 'IN_PROGRESS',
        scheduledDate: '2025-11-20',
        contractor: 'WIM Tech Services',
        partsStatus: 'ARRIVED',
        notes: 'Outboard motor electrical fault.',
        logs: [
            { timestamp: '20/11/2025 08:00', stage: 'SCHEDULED', details: 'Immediate repair requested.' },
            { timestamp: '20/11/2025 08:15', stage: 'PARTS_ARRIVED', details: 'Spare solenoid in stock.' },
            { timestamp: '20/11/2025 08:30', stage: 'IN_PROGRESS', details: 'Technician assigned: Murat K.' }
        ]
    }
];

// --- LOAD FROM PERSISTENCE ---
let TECHNIC_DB: MaintenanceJob[] = persistenceService.load(STORAGE_KEYS.TECHNIC_JOBS, DEFAULT_JOBS);
// Migration check for old data without logs
TECHNIC_DB = TECHNIC_DB.map(job => ({
    ...job,
    logs: job.logs || [{ timestamp: getJobTimestamp(), stage: 'SCHEDULED', details: 'Legacy job data migrated.' }]
}));
persistenceService.save(STORAGE_KEYS.TECHNIC_JOBS, TECHNIC_DB);


// --- HANDLERS FOR BRAIN/MDAP ---
const scheduleServiceHandler: TaskHandlerFn = async (ctx, obs) => {
    return [{
        id: `technic_sched_${Date.now()}`,
        kind: 'internal',
        name: 'technic.service.scheduled',
        params: { status: 'confirmed', jobId: 'JOB-NEW' }
    }];
};

export const technicHandlers: Record<string, TaskHandlerFn> = {
    'technic.scheduleService': scheduleServiceHandler,
};

// --- DIRECT AGENT INTERFACE ---
export const technicExpert = {
    
    // Internal Helper: Append Log & Persist
    _addJobLog: (jobId: string, stage: MaintenanceLogEntry['stage'], details: string) => {
        const jobIndex = TECHNIC_DB.findIndex(j => j.id === jobId);
        if (jobIndex === -1) return;

        const newEntry: MaintenanceLogEntry = {
            timestamp: getJobTimestamp(),
            stage: stage,
            details: details
        };

        TECHNIC_DB[jobIndex].logs.push(newEntry);
        persistenceService.save(STORAGE_KEYS.TECHNIC_JOBS, TECHNIC_DB);
    },

    // Skill: Get all active jobs for UI
    getActiveJobs: (): MaintenanceJob[] => {
        return TECHNIC_DB;
    },

    // Skill: Check Blue Card Status (Environmental Compliance)
    checkBlueCardStatus: async (vesselName: string, addTrace: (t: AgentTraceLog) => void): Promise<{ status: 'VALID' | 'EXPIRED', daysSinceLast: number, lastDate: string }> => {
        addTrace(createLog('ada.technic', 'THINKING', `Verifying Blue Card (Mavi Kart) waste discharge history for ${vesselName}...`, 'EXPERT'));

        // Mock Logic: 
        // "Mistral" is always expired for simulation purposes.
        // Others are valid (random 1-10 days ago).
        const isExpiredTarget = vesselName.toLowerCase().includes('mistral');
        
        const daysSinceLast = isExpiredTarget ? 21 : Math.floor(Math.random() * 10) + 1;
        const lastDate = new Date(Date.now() - (daysSinceLast * 24 * 60 * 60 * 1000)).toLocaleDateString();
        
        // Regulation: Must discharge every 14 days in this region (Simulated rule)
        const limit = 14; 
        const status = daysSinceLast > limit ? 'EXPIRED' : 'VALID';

        if (status === 'EXPIRED') {
            addTrace(createLog('ada.technic', 'WARNING', `BLUE CARD EXPIRED. Last discharge: ${daysSinceLast} days ago (Limit: ${limit}).`, 'WORKER'));
        } else {
            addTrace(createLog('ada.technic', 'OUTPUT', `Blue Card Valid. Last discharge: ${daysSinceLast} days ago.`, 'WORKER'));
        }

        return { status, daysSinceLast, lastDate };
    },

    // Skill: Check availability and schedule
    scheduleService: async (vesselName: string, jobType: string, date: string, addTrace: (t: AgentTraceLog) => void): Promise<{ success: boolean, message: string, job?: MaintenanceJob }> => {
        
        addTrace(createLog('ada.technic', 'THINKING', `Checking resource availability for ${jobType} on ${date}...`, 'EXPERT'));

        // Simulation: Simple availability check
        const isBusy = TECHNIC_DB.some(j => j.scheduledDate.includes(date) && j.jobType === 'HAUL_OUT');
        
        if (isBusy && jobType.includes('HAUL')) {
            addTrace(createLog('ada.technic', 'ERROR', `Conflict detected. Travel Lift is booked on ${date}.`, 'WORKER'));
            return { success: false, message: `Schedule Conflict: The Travel Lift is fully booked on ${date}. Please select another slot.` };
        }

        const newJob: MaintenanceJob = {
            id: `JOB-${Math.floor(Math.random() * 10000)}`,
            vesselName: vesselName,
            jobType: jobType as any || 'GENERAL_REPAIR',
            status: 'SCHEDULED',
            scheduledDate: date,
            contractor: 'WIM Tech Services', // Default
            partsStatus: 'N/A',
            notes: 'Scheduled via Ada AI.',
            logs: [
                { timestamp: getJobTimestamp(), stage: 'SCHEDULED', details: `Service booked via AI Agent. Contractor: WIM Tech.` }
            ]
        };

        TECHNIC_DB.push(newJob);
        
        // Enterprise: PERSISTENCE SAVE
        persistenceService.save(STORAGE_KEYS.TECHNIC_JOBS, TECHNIC_DB);

        addTrace(createLog('ada.technic', 'TOOL_EXECUTION', `Job Ticket ${newJob.id} created in WIM Technical System.`, 'WORKER'));

        return { success: true, message: `Service Confirmed. Ticket #${newJob.id} created for ${vesselName}.`, job: newJob };
    },

    // Skill: Update Job Status (Parts/Progress Tracking)
    updateJobStatus: async (jobId: string, newStatus: MaintenanceJob['status'], partsStatus: MaintenanceJob['partsStatus'], notes: string, addTrace: (t: AgentTraceLog) => void): Promise<{ success: boolean, message: string }> => {
        const jobIndex = TECHNIC_DB.findIndex(j => j.id === jobId);
        if (jobIndex === -1) return { success: false, message: "Job not found." };

        addTrace(createLog('ada.technic', 'THINKING', `Updating Job ${jobId}: ${newStatus} (Parts: ${partsStatus})`, 'EXPERT'));

        // Update Fields
        TECHNIC_DB[jobIndex].status = newStatus;
        if (partsStatus) TECHNIC_DB[jobIndex].partsStatus = partsStatus;
        
        // Determine Log Stage
        let stage: MaintenanceLogEntry['stage'] = 'IN_PROGRESS';
        if (partsStatus === 'ORDERED') stage = 'PARTS_ORDERED';
        else if (partsStatus === 'ARRIVED') stage = 'PARTS_ARRIVED';
        else if (newStatus === 'COMPLETED') stage = 'COMPLETED';

        // Add Log
        technicExpert._addJobLog(jobId, stage, notes);

        return { success: true, message: `Job ${jobId} updated.` };
    },

    // Skill: Check status of existing jobs
    checkStatus: async (vesselName: string, addTrace: (t: AgentTraceLog) => void): Promise<string> => {
        addTrace(createLog('ada.technic', 'TOOL_EXECUTION', `Querying Technical Database for ${vesselName}...`, 'WORKER'));
        
        const jobs = TECHNIC_DB.filter(j => j.vesselName.toLowerCase().includes(vesselName.toLowerCase()));
        
        if (jobs.length === 0) {
            return `No active technical records found for **${vesselName}**.`;
        }

        let report = `**TECHNICAL STATUS REPORT: ${vesselName}**\n\n`;
        jobs.forEach(j => {
            report += `**Job #${j.id}: ${j.jobType}**\n`;
            report += `- Current Status: **${j.status}**\n`;
            report += `- Contractor: ${j.contractor}\n`;
            if (j.partsStatus !== 'N/A') report += `- Parts: ${j.partsStatus}\n`;
            
            // Render Logs
            if (j.logs && j.logs.length > 0) {
                report += `\n*Activity Log:*\n`;
                j.logs.forEach(l => {
                    report += `> \`${l.timestamp}\` - **${l.stage}**: ${l.details}\n`;
                });
            }
            report += `\n`;
        });

        return report;
    },

    // Skill: Process Blue Card (Waste Management)
    processBlueCard: async (vesselName: string, location: string, liters: number, addTrace: (t: AgentTraceLog) => void): Promise<{ success: boolean, message: string, actions: AgentAction[] }> => {
        addTrace(createLog('ada.technic', 'THINKING', `Processing Blue Card waste discharge for ${vesselName} (${liters}L) at ${location}...`, 'EXPERT'));

        const actions: AgentAction[] = [];
        
        // Log operation
        actions.push({
            id: `tech_bluecard_${Date.now()}`,
            kind: 'internal',
            name: 'ada.marina.log_operation',
            params: {
                message: `[ECO] BLUE CARD | VS:${vesselName} | QTY:${liters}L | LOC:${location}`,
                type: 'info'
            }
        });
        
        addTrace(createLog('ada.technic', 'TOOL_EXECUTION', `Pump-out station activated. Digital Blue Card updated.`, 'WORKER'));

        return {
            success: true,
            message: `**BLUE CARD PROCESSED**\n\nDischarge of **${liters}L** black water confirmed for **${vesselName}**.\nEnvironment Ministry Database updated.`,
            actions: actions
        };
    },

    // Skill: Complete Job & Trigger Billing (FastRTC Mesh)
    completeJob: async (vesselName: string, jobId: string | undefined, user: UserProfile, addTrace: (t: AgentTraceLog) => void): Promise<AgentAction[]> => {
        addTrace(createLog('ada.technic', 'THINKING', `Processing job completion for ${vesselName}...`, 'EXPERT'));

        const jobIndex = TECHNIC_DB.findIndex(j => 
            (jobId ? j.id === jobId : true) && 
            j.vesselName.toLowerCase().includes(vesselName.toLowerCase()) && 
            j.status !== 'COMPLETED'
        );
        
        if (jobIndex === -1) {
             addTrace(createLog('ada.technic', 'ERROR', `Active job not found for ${vesselName}.`, 'WORKER'));
             return [];
        }

        const job = TECHNIC_DB[jobIndex];
        TECHNIC_DB[jobIndex].status = 'COMPLETED';
        
        // Calculate Final Cost (Simulated)
        let cost = 500; // Base call out
        if (job.jobType === 'HAUL_OUT') cost = 3500;
        if (job.jobType === 'ENGINE_SERVICE') cost = 1200;

        // Add Log via Helper
        technicExpert._addJobLog(job.id, 'COMPLETED', `Job marked completed by ${user.name}. Final billing amount: €${cost}.`);

        addTrace(createLog('ada.technic', 'OUTPUT', `Job ${job.id} marked COMPLETED. Final Cost: €${cost}.`, 'WORKER'));
        addTrace(createLog('ada.technic', 'PLANNING', `Initiating Billing Hand-off to ada.finance...`, 'ORCHESTRATOR'));

        return [{
            id: `technic_complete_${Date.now()}`,
            kind: 'external',
            name: 'ada.technic.jobCompleted',
            params: { 
                jobId: job.id,
                vesselName: job.vesselName,
                cost: cost,
                summary: `${job.jobType} Completed`
            }
        }];
    }
};
