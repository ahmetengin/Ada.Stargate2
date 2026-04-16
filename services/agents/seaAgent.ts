
import { AgentAction } from '../../types';

// COLREGs Rules Logic for ada.sea
export const seaExpert = {
  process: async (params: any): Promise<AgentAction[]> => {
    const actions: AgentAction[] = [];
    const { situation, mySpeed, targetBearing, targetDistance, visibility } = params;

    // COLREGs Rule 6: Safe Speed
    if (visibility === 'low' && mySpeed > 10) {
         actions.push({
            id: `sea_safe_speed_${Date.now()}`,
            kind: 'internal',
            name: 'ada.sea.adjustSpeed',
            params: { reason: 'COLREGs Rule 6 (Restricted Visibility)', newSpeed: 5 }
         });
    }

    // COLREGs Rule 13: Overtaking
    if (situation === 'overtaking') {
        actions.push({
            id: `sea_rule13_${Date.now()}`,
            kind: 'internal',
            name: 'ada.sea.maneuver',
            params: { rule: '13', action: 'Keep clear of overtaken vessel', status: 'GIVE_WAY' }
        });
    }

    // COLREGs Rule 15: Crossing Situation
    // "When two power-driven vessels are crossing... the vessel which has the other on her own starboard side shall keep out of the way."
    if (situation === 'crossing') {
        if (targetBearing > 0 && targetBearing < 112.5) { // Target on Starboard
            actions.push({
                id: `sea_rule15_${Date.now()}`,
                kind: 'internal',
                name: 'ada.sea.maneuver',
                params: { rule: '15', action: 'Alter course to Starboard. Avoid crossing ahead.', status: 'GIVE_WAY' }
            });
        } else {
             actions.push({
                id: `sea_rule15_standon_${Date.now()}`,
                kind: 'internal',
                name: 'ada.sea.maintainCourse',
                params: { rule: '15', action: 'Stand-on vessel. Maintain course and speed.', status: 'STAND_ON' }
            });
        }
    }

    // General Telemetry Log
    actions.push({
        id: `sea_telemetry_${Date.now()}`,
        kind: 'external',
        name: 'ada.sea.logTelemetry',
        params: { speed: mySpeed, course: 180, status: 'Navigating' }
    });

    return actions;
  }
};