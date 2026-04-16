// services/orchestratorService.ts

import { AgentAction, AgentTraceLog, UserProfile, OrchestratorResponse, NodeName, Tender, RegistryEntry, Message, TenantConfig } from '../types';
import { checkBackendHealth, sendToBackend } from './api';
import { getCurrentMaritimeTime } from './utils';
import { vote, Candidate } from './voting/consensus';
import { generateSimpleResponse } from './geminiService';
import { MAX_HISTORY_LENGTH } from './geminiService'; // Import MAX_HISTORY_LENGTH for consistent history scanning

// --- LEGACY IMPORTS (FALLBACK MODE) ---
import { financeExpert } from './agents/financeAgent';
import { legalExpert } from './agents/legalAgent';
import { marinaExpert } from './agents/marinaAgent';
import { customerExpert } from './agents/customerAgent';
import { technicExpert } from './agents/technicAgent';
import { kitesExpert } from './agents/travelAgent'; 
import { federationExpert } from './agents/federationAgent';
// import { wimMasterData } from './wimMasterData'; // Removed direct import
import { VESSEL_KEYWORDS } from './constants';
// import { FEDERATION_REGISTRY } from './config'; // Removed direct import

// Helper
const createLog = (node: NodeName, step: AgentTraceLog['step'], content: string, persona: 'ORCHESTRATOR' | 'EXPERT' | 'WORKER' = 'ORCHESTRATOR'): AgentTraceLog => ({
    id: `trace_${Date.now()}_${Math.random()}`,
    timestamp: getCurrentMaritimeTime(),
    node,
    step,
    content,
    persona
});

export const orchestratorService = {
    async processRequest(
        prompt: string, 
        user: UserProfile, 
        tenders: Tender[],
        registry: RegistryEntry[] = [],
        vesselsInPort: number = 0,
        messages: Message[] = [],
        activeTenantConfig: TenantConfig // NEW: Pass activeTenantConfig
    ): Promise<OrchestratorResponse> {
        const traces: AgentTraceLog[] = [];
        
        const isBackendOnline = await checkBackendHealth();

        if (isBackendOnline) {
            traces.push(createLog('ada.marina', 'ROUTING', `Connecting to Beyond-MCP Python Grid...`, 'ORCHESTRATOR'));
            try {
                const backendResponse = await sendToBackend(prompt, user);
                if (backendResponse && backendResponse.text) {
                    const actions = backendResponse.actions || [];
                    if (backendResponse.traces) {
                        traces.push(...backendResponse.traces);
                    } else {
                        traces.push(createLog('ada.marina', 'OUTPUT', `Expert Node Response received.`, 'EXPERT'));
                    }
                    return { text: backendResponse.text, actions: actions, traces: traces };
                }
            } catch (err) {
                console.error("Backend Error, falling back to simulation:", err);
                traces.push(createLog('ada.marina', 'ERROR', `MCP Grid Unreachable. Fallback to Local Simulation.`, 'ORCHESTRATOR'));
            }
        } else {
            traces.push(createLog('ada.marina', 'ROUTING', `MCP Offline. Using Local TypeScript Simulation.`, 'ORCHESTRATOR'));
        }

        const actions: AgentAction[] = [];
        let responseText = "";
        const lower = prompt.toLowerCase();
        const findVesselInPrompt = (p: string) => VESSEL_KEYWORDS.find(v => p.toLowerCase().includes(v));
        const vesselName = findVesselInPrompt(prompt) || (user.role === 'CAPTAIN' ? 'S/Y Phisedelia' : 's/y phisedelia');

        if (lower.includes('öde') || lower.includes('pay') || lower.includes('link') || lower.includes('send link')) {
             if (user.role === 'GUEST') {
                 responseText = "**ACCESS DENIED.** Only registered Captains or Owners can settle vessel accounts.";
             } else {
                 traces.push(createLog('ada.finance', 'PLANNING', `User requested payment link. Initiating transaction protocol...`, 'EXPERT'));
                 const status = await financeExpert.checkDebt(vesselName);
                 if (status.status === 'DEBT') {
                     const finActions = await financeExpert.process({
                         intent: 'create_invoice',
                         vesselName: vesselName,
                         amount: status.amount,
                         serviceType: 'DEBT_SETTLEMENT'
                     }, user, (t) => traces.push(t));
                     actions.push(...finActions);
                     const linkAction = finActions.find(a => a.name === 'ada.finance.paymentLinkGenerated');
                     const linkUrl = linkAction?.params?.link?.url || '#';
                     responseText = `**PAYMENT LINK GENERATED**\n\nI have generated a secure link for your outstanding balance of **€${status.amount}**.\n\n[Click here to Pay via Iyzico 3D-Secure](${linkUrl})\n\n> *Reference: ${vesselName} Debt Settlement*`;
                 } else {
                     responseText = "**ACCOUNT CLEAR.**\n\nYou have no outstanding balance to pay at this time. Thank you.";
                 }
             }
        }
        else if (lower.includes('invoice') || lower.includes('debt') || lower.includes('balance') || lower.includes('borç')) {
             if (user.role === 'GUEST') {
                 responseText = "**ACCESS DENIED.**";
             } else {
                 const status = await financeExpert.checkDebt(vesselName);
                 if (status.status === 'DEBT') {
                     responseText = `**FINANCIAL STATUS**\n\n**Vessel:** ${vesselName}\n**Outstanding Balance:** €${status.amount}\n**Status:** ${status.paymentHistoryStatus}\n\n*Would you like me to generate a payment link?*`;
                 }
                 else {
                     responseText = "**ACCOUNT CLEAR (Local).**\nNo outstanding invoices found.";
                 }
             }
        }
        else if (lower.includes('depart') || lower.includes('leaving') || lower.includes('çıkış')) {
             traces.push(createLog('ada.marina', 'ROUTING', `Departure request detected. Initiating Multi-Agent Consensus Protocol...`, 'ORCHESTRATOR'));
             const debtStatus = await financeExpert.checkDebt(vesselName);
             const financeDecision = debtStatus.status === 'CLEAR' ? 'APPROVE' : 'DENY';
             traces.push(createLog('ada.finance', 'VOTING', `Vote: ${financeDecision}. Reason: ${financeDecision === 'APPROVE' ? 'Account Clear' : 'Outstanding Debt'}`, 'EXPERT'));
             const jobs = technicExpert.getActiveJobs().filter(j => j.vesselName.toLowerCase().includes(vesselName.toLowerCase()) && j.status !== 'COMPLETED');
             const criticalJob = jobs.find(j => j.jobType === 'HAUL_OUT' || j.jobType === 'ENGINE_SERVICE');
             let technicDecision = criticalJob ? 'DENY' : 'APPROVE';
             let technicReason = criticalJob ? `Active Critical Job: ${criticalJob.jobType}` : 'No active critical maintenance';
             const blueCard = await technicExpert.checkBlueCardStatus(vesselName, (t) => traces.push(t));
             if (blueCard.status === 'EXPIRED') {
                 technicDecision = 'CONDITIONAL';
                 technicReason = `Blue Card EXPIRED (${blueCard.daysSinceLast} days).`;
             }
             traces.push(createLog('ada.technic', 'VOTING', `Vote: ${technicDecision}. Reason: ${technicReason}`, 'EXPERT'));
             const marinaDecision = 'APPROVE'; 
             traces.push(createLog('ada.marina', 'VOTING', `Vote: ${marinaDecision}.`, 'EXPERT'));
             if (financeDecision === 'DENY') {
                 responseText = `**DEPARTURE DENIED**\n\nConsensus failed. Outstanding Debt: **€${debtStatus.amount}**.\n\n> **Legal Hold:** Right of Retention exercised pursuant to **WIM Contract Article H.2**.\nPlease clear balance at Finance Office.`;
             } else if (technicDecision === 'DENY') {
                 responseText = `**DEPARTURE DENIED**\n\nConsensus failed. Safety Block: **${technicReason}**.\n\n> **Rule:** **Article E.1.8** (Seaworthiness) & **COLREGs** safety violation.`;
             } else {
                 const res = await marinaExpert.processDeparture(vesselName, tenders, t => traces.push(t));
                 responseText = res.message;
                 if (technicDecision === 'CONDITIONAL') {
                     responseText += `\n\n⚠️ **ENVIRONMENTAL ALERT (MAVİ KART):**\nYour Blue Card period has expired (**${blueCard.daysSinceLast} days** since last discharge). Violation of **Article F.13**.\nPlease visit the Pump-out station immediately at your next port to avoid fines.`;
                 }
                 if (res.actions) actions.push(...res.actions);
             }
        }
        else if (lower.includes('arrival') || lower.includes('arrive') || lower.includes('dock') || lower.includes('approach') || lower.includes('giriş')) {
             const debtStatus = await financeExpert.checkDebt(vesselName);
             const res = await marinaExpert.processArrival(vesselName, tenders, debtStatus, t => traces.push(t));
             responseText = res.message;
             if (res.actions) actions.push(...res.actions);
        }
        else if (lower.includes('scan') || lower.includes('id') || lower.includes('passport')) {
             responseText = "Initiating Identity Verification Protocol...";
             actions.push({
                 id: `ui_open_scanner_${Date.now()}`,
                 kind: 'internal',
                 name: 'ada.ui.openModal',
                 params: { modal: 'SCANNER' }
             });
        }
        else if (lower.includes('blue card') || lower.includes('waste') || lower.includes('pump-out') || lower.includes('atık') || lower.includes('mavi kart')) {
             if (user.role === 'GUEST') {
                 responseText = "**ACCESS DENIED.** Only Captains can request technical services.";
             } else {
                 traces.push(createLog('ada.technic', 'PLANNING', `Received Waste Discharge Request (Blue Card) for ${vesselName}...`, 'EXPERT'));
                 const status = await technicExpert.checkBlueCardStatus(vesselName, (t) => traces.push(t));
                 let urgencyMsg = "";
                 if (status.status === 'EXPIRED') {
                     urgencyMsg = `⚠️ **STATUS: EXPIRED** (${status.daysSinceLast} days). Immediate discharge required to avoid Coast Guard fines.\n> **Regulation:** Article F.13 (Mandatory Discharge)`;
                 } else {
                     urgencyMsg = `✅ **STATUS: VALID** (Last: ${status.daysSinceLast} days ago).`;
                 }
                 responseText = `**BLUE CARD PUMP-OUT REQUEST**\n\n${urgencyMsg}\n\n**Instructions:**\n1. Proceed to **Fuel Dock (Station 4)**.\n2. Prepare **Green Hose** connection.\n3. Digital Blue Card will be auto-updated upon completion.\n\n> *Waste Barge 'WIM-Eco' is also available on Ch 73.*`;
                 actions.push({
                    id: `bluecard_req_${Date.now()}`,
                    kind: 'internal',
                    name: 'ada.marina.log_operation',
                    params: {
                        message: `[ECO] PUMP-OUT REQUEST | VS:${vesselName} | QTY:${status.lastDate}L | LOC:Fuel Dock`, // Changed QTY to lastDate for example
                        type: 'info'
                    }
                 });
             }
        }
        else if (lower.includes('setur') || lower.includes('d-marin') || lower.includes('monaco') || lower.includes('place')) {
            const partnerNameMatch = activeTenantConfig.masterData.strategic_partners?.partner_marinas.find((p:any) => lower.includes(p.name.toLowerCase()) || lower.includes(p.node.toLowerCase()));
            const partnerAddress = partnerNameMatch?.node;
            if (partnerAddress) {
                traces.push(createLog('ada.federation', 'ROUTING', `Query detected for federated partner: ${partnerNameMatch.name}.`, 'ORCHESTRATOR'));
                const today = new Date().toISOString().split('T')[0];
                const availability = await federationExpert.getRemoteBerthAvailability(partnerAddress, today, (t) => traces.push(t));
                if (availability) {
                    responseText = `**FEDERATED BERTH AVAILABILITY (${partnerNameMatch.name})**\n\n*${availability.message}*\n\n> **Occupancy:** ${availability.occupancyRate}%\n> **Available:** ${availability.availableBerths} / ${availability.totalBerths} berths.`;
                } else {
                    responseText = `**FEDERATED QUERY FAILED:** Unable to retrieve data from ${partnerNameMatch.name}. It might be offline or an API issue.`;
                }
            }
        }
        else if (lower.includes('rezervasyon') || lower.includes('reserve') || lower.includes('masa') || lower.includes('table') || lower.includes('kişi') || lower.includes('person') || lower.includes('tonight') || lower.includes('yarın') || lower.includes('bugün') || lower.includes('saat') || lower.includes('restaurant') || lower.includes('yemek') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('kahvaltı')) {
            traces.push(createLog('ada.customer', 'ROUTING', `Dining reservation request detected. Routing to Concierge Expert.`, 'ORCHESTRATOR'));
            let reservationDetails: { venueName: string | null; guests: number | null; time: string | null; date: string | null; } = { venueName: null, guests: null, time: null, date: null };
            const relevantHistory = messages.slice(-MAX_HISTORY_LENGTH);
            for (let i = relevantHistory.length - 1; i >= 0; i--) {
                const msgText = relevantHistory[i].text.toLowerCase();
                const venueMatch = activeTenantConfig.masterData.services.amenities.restaurants.find((r:string) => msgText.includes(r.toLowerCase()));
                if (venueMatch && !reservationDetails.venueName) reservationDetails.venueName = venueMatch;
                const guestsMatch = msgText.match(/(\d+)\s*(kişi|person)/i);
                if (guestsMatch && !reservationDetails.guests) reservationDetails.guests = parseInt(guestsMatch[1]);
                const timeMatch = msgText.match(/(\d{1,2}:\d{2})\s*(am|pm|pm|öğleden sonra|akşam|de)?/i);
                if (timeMatch && !reservationDetails.time) reservationDetails.time = timeMatch[1];
                if ((msgText.includes('tonight') || msgText.includes('bugün') || msgText.includes('bu gece')) && !reservationDetails.date) reservationDetails.date = new Date().toISOString().split('T')[0];
                else if ((msgText.includes('tomorrow') || msgText.includes('yarın')) && !reservationDetails.date) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    reservationDetails.date = tomorrow.toISOString().split('T')[0];
                }
            }
            if (lower.includes('menu') || lower.includes('menü')) {
                responseText = (await customerExpert.handleGeneralInquiry(`menu for ${reservationDetails.venueName || 'restaurant'}`, (t) => traces.push(t), activeTenantConfig)).text;
            } else if (lower.includes('yes') || lower.includes('onay') || lower.includes('confirm')) {
                const lastAiMessage = messages.slice().reverse().find(m => m.role === 'model');
                if (lastAiMessage && lastAiMessage.text.toLowerCase().includes('onaylıyor musunuz?')) {
                    responseText = (await customerExpert.manageDiningReservation(reservationDetails.venueName, reservationDetails.guests, reservationDetails.time, reservationDetails.date, null, (t) => traces.push(t))).message;
                } else {
                     responseText = (await customerExpert.manageDiningReservation(reservationDetails.venueName, reservationDetails.guests, reservationDetails.time, reservationDetails.date, null, (t) => traces.push(t))).message;
                }
            }
            else if (reservationDetails.venueName && reservationDetails.guests && reservationDetails.time && reservationDetails.date) {
                responseText = `Confirmation: **${reservationDetails.venueName}** for **${reservationDetails.guests} guests** on **${reservationDetails.date}** at **${reservationDetails.time}**. Onaylıyor musunuz?`;
            } else {
                responseText = (await customerExpert.manageDiningReservation(reservationDetails.venueName, reservationDetails.guests, reservationDetails.time, reservationDetails.date, null, (t) => traces.push(t))).message;
            }
        }
        else if (lower.includes('wifi') || lower.includes('market') || lower.includes('gym') || lower.includes('taxi') || lower.includes('pharmacy') || lower.includes('fuel') || lower.includes('lift') || lower.includes('parking') || lower.includes('events') || lower.includes('restaurant')) {
            responseText = (await customerExpert.handleGeneralInquiry(prompt, (t) => traces.push(t), activeTenantConfig)).text;
        }

        if (!responseText) {
            traces.push(createLog('ada.stargate', 'THINKING', `No deterministic handler matched. Forwarding to General Intelligence (Gemini)...`, 'ORCHESTRATOR'));
            responseText = await generateSimpleResponse(prompt, user, registry, tenders, vesselsInPort, messages, activeTenantConfig); 
        }
        
        return { text: responseText, actions: actions, traces: traces };
    }
};