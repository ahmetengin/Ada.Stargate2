// services/decomposition/mdapExecutor.ts
import { MdapGraph, TaskHandlerFn } from './types';
import { AgentContext, AgentObservation, AgentAction } from '../brain/types';
import { getTaskHandler } from '../agents/registry';

const graphs: Record<string, MdapGraph> = {
  'marina_docking_assist_v1': {
    id: 'marina_docking_assist_v1',
    name: 'Marina Docking Assistance Protocol',
    entryNode: 'identify_vessel',
    nodes: [
        { id: 'identify_vessel', description: 'Identify vessel and check for priority', module: 'marina', handler: 'marina.identifyVessel', next: ['check_weather'] },
        { id: 'check_weather', description: 'Check current weather conditions', module: 'weather', handler: 'weather.getCurrent', next: ['dispatch_tender'] },
        { id: 'dispatch_tender', description: 'Dispatch a tender boat for assistance', module: 'marina', handler: 'marina.dispatchTender', next: ['generate_response'] },
        { id: 'generate_response', description: 'Generate final response for user', module: 'generic', handler: 'generic.llmQuery', next: [] }
    ],
  },
  'travel_booking_v1': {
    id: 'travel_booking_v1',
    name: 'Travel Booking Decomposition',
    entryNode: 'date_destination_check',
    nodes: [
      { id: 'date_destination_check', description: 'Check dates and destination', module: 'travel', handler: 'travel.dateDestinationCheck', next: ['flight_options'] },
      { id: 'flight_options', description: 'Generate flights', module: 'travel', handler: 'travel.generateFlights', next: ['hotel_transfer_match'] },
      { id: 'hotel_transfer_match', description: 'Match hotel and transfer', module: 'travel', handler: 'travel.matchHotelTransfer', next: ['reservation_generation'] },
      { id: 'reservation_generation', description: 'Create reservation', module: 'travel', handler: 'travel.buildReservation', next: ['generate_response'] },
    ],
  },
};

export async function runMdapGraph(
  graphId: string,
  ctx: AgentContext,
  obs: AgentObservation,
): Promise<AgentAction[]> {
  const g = graphs[graphId];
  if (!g) throw new Error(`Unknown MDAP graph: ${graphId}`);

  const allActions: AgentAction[] = [];
  let currentId: string | null = g.entryNode;

  while (currentId) {
    const node = g.nodes.find(n => n.id === currentId);
    if (!node) break;

    const handler: TaskHandlerFn = getTaskHandler(node.handler);
    const producedActions = await handler(ctx, obs);
    allActions.push(...producedActions);

    // For demo, we just follow the first path. A real system would have branching logic.
    currentId = node.next[0] ?? null;
  }

  return allActions;
}