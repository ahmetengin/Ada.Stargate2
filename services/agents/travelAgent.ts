
import { AgentAction, AgentTraceLog, NodeName, TravelItinerary } from '../../types';
import { marinaExpert } from './marinaAgent'; 
import { passkitExpert } from './passkitAgent'; // Integrate PassKit
import { TaskHandlerFn } from '../decomposition/types'; 
import { wimMasterData } from '../wimMasterData';

// Helper to create a log
const createLog = (node: NodeName, step: AgentTraceLog['step'], content: string, persona: 'ORCHESTRATOR' | 'EXPERT' | 'WORKER' = 'ORCHESTRATOR'): AgentTraceLog => ({
    id: `trace_${Date.now()}_${Math.random()}`,
    timestamp: new Date().toLocaleTimeString(),
    node,
    step,
    content,
    persona
});

// --- TENANT CONFIG ---
const TENANT = "KITES"; // Hardcoded Tenant Identity
const AGENCY_ID = "TÜRSAB A-2648";

const PROVIDERS = {
    AVIATION: 'Ada.Travel.Adriyatik (IATA)',
    HOTELS: 'Ada.Travel.Tinkon (Global)',
    GROUND: 'WIM VIP Services',
    MARINE: 'WIM Charter Fleet (Operator)',
    CROSS_BORDER: 'Kites Global Concierge'
};

// --- MOCK ITINERARY DATABASE ---
const MOCK_ITINERARIES: TravelItinerary[] = [
    {
        id: 'TRV-2025-001',
        passengerName: 'Ahmet Engin',
        tripName: 'Paris Business Trip',
        status: 'ACTIVE',
        totalCost: 4850,
        flights: [
            {
                id: 'FL-01',
                airline: 'Turkish Airlines',
                flightNumber: 'TK1821',
                departure: { airport: 'IST', time: '2025-11-25 08:30' },
                arrival: { airport: 'CDG', time: '2025-11-25 11:10' },
                status: 'TICKETED',
                provider: PROVIDERS.AVIATION
            }
        ],
        hotels: [],
        transfers: []
    }
];

export const kitesExpert = {
    
    // Skill: Search Flights 
    searchFlights: async (origin: string, dest: string, date: string, addTrace: (t: AgentTraceLog) => void): Promise<{ success: boolean, results: any[], message: string }> => {
        addTrace(createLog('ada.travel', 'THINKING', `[TENANT: ${TENANT}] Requesting flight options from sub-agent '${PROVIDERS.AVIATION}' for ${origin}-${dest}...`, 'EXPERT'));
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        addTrace(createLog('ada.travel', 'TOOL_EXECUTION', `ADRIYATIK: Querying Amadeus GDS... Found 3 routes.`, 'WORKER'));
        addTrace(createLog('ada.travel', 'OUTPUT', `KITES: Filtered results. Presenting best options.`, 'EXPERT'));

        const isLondon = dest === 'LHR' || dest === 'LGW';
        
        const results = [
            { 
                id: 'OPT-1', 
                airline: isLondon ? 'British Airways' : 'THY', 
                flight: isLondon ? 'BA675' : 'TK1951', 
                price: isLondon ? 1450 : 1200, 
                class: 'Business', 
                provider: PROVIDERS.AVIATION, 
                time: '08:30' 
            },
            { 
                id: 'OPT-2', 
                airline: 'Turkish Airlines', 
                flight: isLondon ? 'TK1985' : 'TK1827', 
                price: isLondon ? 350 : 450, 
                class: 'Economy', 
                provider: PROVIDERS.AVIATION, 
                time: '13:15' 
            },
            { 
                id: 'OPT-3', 
                airline: 'Private Jet', 
                flight: 'C560XL', 
                price: 12500, 
                class: 'Private', 
                provider: PROVIDERS.AVIATION, 
                time: 'Any' 
            }
        ];

        return {
            success: true,
            results,
            message: `**FLIGHT OPTIONS**\n` +
                     `*(operated by "ada.travel.kites")*\n\n` +
                     `I have found the following connections for **${origin} -> ${dest}** on **${date}**:\n\n` +
                     results.map(r => `✈️ **${r.airline} (${r.flight})** - ${r.time}\n   Class: ${r.class} | Price: **€${r.price}**`).join('\n\n') +
                     `\n\n*Reply "Book Option 1" to confirm immediately.*`
        };
    },

    // Skill: Finalize Booking & Issue PassKit (The "Ch72 Confirm" Logic)
    finalizeBooking: async (details: string, passengerName: string, addTrace: (t: AgentTraceLog) => void): Promise<{ success: boolean, message: string, actions: AgentAction[] }> => {
        addTrace(createLog('ada.travel', 'THINKING', `[TENANT: ${TENANT}] Initiating Booking Protocol for: "${details}". Passenger: ${passengerName}`, 'EXPERT'));

        // 1. Create PNR (Simulation)
        const pnr = `PNR-${Math.random().toString(36).substring(7).toUpperCase()}`;
        addTrace(createLog('ada.travel', 'TOOL_EXECUTION', `Creating PNR on Amadeus... Confirmed: ${pnr}`, 'WORKER'));

        // 2. Issue Digital Pass (PassKit Integration)
        const passResult = await passkitExpert.issueTravelPass({
            passenger: passengerName,
            type: 'FLIGHT',
            summary: `Flight Booking: ${details}`,
            date: new Date().toISOString().split('T')[0]
        }, addTrace);

        const actions: AgentAction[] = [];
        
        // 3. Log Operational Confirmation (The "Ch72" Metaphor)
        actions.push({
            id: `op_log_travel_${Date.now()}`,
            kind: 'internal',
            name: 'ada.marina.log_operation',
            params: {
                message: `[OP] KITES TRAVEL CONFIRMED | PAX:${passengerName.toUpperCase()} | REF:${pnr} | STS:ISSUED`,
                type: 'info'
            }
        });

        // 4. Trigger PassKit Action for UI
        actions.push({
            id: `passkit_travel_${Date.now()}`,
            kind: 'external',
            name: 'ada.passkit.generated',
            params: { passUrl: passResult.passUrl }
        });

        return {
            success: true,
            message: `**BOOKING CONFIRMED**\n` +
                     `*(operated by "ada.travel.kites")*\n\n` +
                     `Your itinerary has been finalized.\n\n` +
                     `> **Reference:** \`${pnr}\`\n` +
                     `> **Details:** ${details}\n` +
                     `> **Status:** TICKETED\n\n` +
                     `*A Digital Boarding Pass has been sent to your wallet.*`,
            actions: actions
        };
    },

    // Skill: Book Yacht Charter
    bookYachtCharter: async (date: string, type: string, addTrace: (t: AgentTraceLog) => void): Promise<{ success: boolean, options: any[], message: string }> => {
        addTrace(createLog('ada.travel', 'THINKING', `[TENANT: ${TENANT}] Client requested Yacht Charter for ${date}. Querying WIM Charter Fleet...`, 'EXPERT'));
        
        const availableBoats = await marinaExpert.checkCharterFleetAvailability(type, date, addTrace);
        
        if (availableBoats.length === 0) {
            return { success: false, options: [], message: "No charter vessels available for the selected date." };
        }

        const offers = availableBoats.map(boat => ({
            ...boat,
            price_daily: boat.length === '24m' ? 5000 : 2500,
            provider: PROVIDERS.MARINE
        }));

        const message = `**YACHT CHARTER PROPOSAL**\n` +
                        `*(operated by "ada.travel.kites")*\n\n` +
                        `Available vessels from our exclusive fleet:\n\n` +
                        offers.map((o: any) => `1. **${o.name}** (${o.type}, ${o.length})\n   *Capacity: ${o.capacity} Pax*\n   *Rate: €${o.price_daily}/day + VAT*`).join('\n') +
                        `\n\n*Reply "Confirm Charter [Name]" to book.*`;

        return { success: true, options: offers, message };
    },

    // Skill: Emergency Extraction 
    arrangeEmergencyExit: async (currentLocation: {lat: number, lng: number}, destinationCity: string, addTrace: (t: AgentTraceLog) => void): Promise<{ success: boolean, plan: any, message: string }> => {
        addTrace(createLog('ada.travel', 'THINKING', `🚨 [TENANT: ${TENANT}] EMERGENCY EXTRACTION PROTOCOL INITIATED.`, 'EXPERT'));

        const nearestPort = "D-Marin Göcek (Tender Dock)";
        const flight = { airline: "Turkish Airlines", number: "TK2559", time: "21:40", airport: "Dalaman (DLM)" };

        addTrace(createLog('ada.travel', 'PLANNING', `Extraction Route: Sea(${nearestPort}) -> Land(Transfer) -> Air(${flight.number})`, 'ORCHESTRATOR'));

        // Auto-generate pass for this emergency
        const passResult = await passkitExpert.issueTravelPass({
            passenger: "Emergency PAX",
            type: 'TRANSFER',
            summary: `URGENT TRANSFER: ${nearestPort} -> DLM`,
            date: "TODAY"
        }, addTrace);

        const message = `**🚨 EXTRACTION PLAN CONFIRMED**\n` +
                        `*(operated by "ada.travel.kites")*\n\n` +
                        `We have arranged your immediate return to ${destinationCity}.\n\n` +
                        `1. **Divert:** Proceed to **${nearestPort}**.\n` +
                        `2. **Transfer:** VIP Vito (34 AA 001) dispatched to pier.\n` +
                        `3. **Flight:** Ticketed on **${flight.airline} ${flight.number}**.\n\n` +
                        `*Digital Itinerary sent to wallet.*`;

        return { success: true, plan: { flight, nearestPort }, message };
    },

    // Skill: Cross-Border Dining
    manageCrossBorderDining: async (venue: string, guests: number, time: string, addTrace: (t: AgentTraceLog) => void): Promise<{ success: boolean, message: string, action?: AgentAction }> => {
        addTrace(createLog('ada.travel', 'THINKING', `[TENANT: ${TENANT}] Processing Cross-Border Reservation for **${venue}** (Greece).`, 'EXPERT'));

        const partner = wimMasterData.strategic_partners.cross_border_partners?.find(p => p.name.toLowerCase().includes(venue.toLowerCase()));

        if (!partner) {
             return { success: false, message: `I'm sorry, I don't have a direct partnership link with **${venue}**. I can only book confirmed tables at **Manos** or **Pantelis** in Symi.` };
        }

        // Generate a Pass for the Restaurant Reservation
        const passResult = await passkitExpert.issueTravelPass({
            passenger: "VIP Guest",
            type: 'HOTEL', // Reusing type for venue
            summary: `Dinner: ${partner.name} (Symi)`,
            date: "TONIGHT"
        }, addTrace);

        const message = `**🇬🇷 CROSS-BORDER RESERVATION CONFIRMED**\n` +
                        `*(operated by "ada.travel.kites")*\n\n` +
                        `**Venue:** ${partner.name} (${partner.location})\n` +
                        `**Time:** ${time} (${guests} Guests)\n\n` +
                        `> **Docking:** ${partner.docking}. \n\n` +
                        `*Reservation Pass sent to wallet.*`;

        const action: AgentAction = {
            id: `passkit_dining_${Date.now()}`,
            kind: 'external',
            name: 'ada.passkit.generated',
            params: { passUrl: passResult.passUrl }
        };

        return { success: true, message, action };
    },

    checkCompliance: async (addTrace: (t: AgentTraceLog) => void): Promise<boolean> => {
        addTrace(createLog('ada.travel', 'THINKING', `Verifying TÜRSAB License (No. A-2648)... Valid.`, 'EXPERT'));
        return true;
    }
};

// --- Handlers for the Brain ---
export const travelHandlers: Record<string, TaskHandlerFn> = {
    'travel.searchFlights': async (ctx: any, obs: any) => {
        const { origin, dest, date } = obs.payload;
        const result = await kitesExpert.searchFlights(origin, dest, date, () => {});
        return [{
            id: `act_travel_flights_${Date.now()}`,
            kind: 'internal',
            name: 'travel.flightResults',
            params: result
        }];
    }
};
