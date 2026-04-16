
// services/api.ts

/**
 * Checks if the Python backend is reachable at localhost:8000.
 * Used to toggle between 'Simulation Mode' (Typescript) and 'Real Mode' (Python).
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    // Set a short timeout to avoid hanging the UI if backend is down
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    
    const response = await fetch('http://localhost:8000/', { 
      method: 'GET',
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    // Backend is likely not running or blocked
    return false;
  }
};

/**
 * Sends a conversational prompt to the Python Orchestrator (Chat Interface).
 */
export const sendToBackend = async (prompt: string, userProfile: any): Promise<any> => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                user_role: userProfile.role,
                context: {
                    user_id: userProfile.id
                }
            })
        });
        return await response.json();
    } catch (error) {
        console.error("Backend API Call Failed:", error);
        throw error;
    }
}

/**
 * Invokes a specific skill on a specific agent (RPC Style).
 * Used by Dashboard widgets to fetch raw data (e.g., Telemetry, Debt) directly.
 */
export const invokeAgentSkill = async (agentName: string, skillName: string, params: any): Promise<any> => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/agent/${agentName}/${skillName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
        if (!response.ok) throw new Error(`Skill invocation failed: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.warn(`Backend skill ${agentName}.${skillName} unavailable. Using local fallback.`);
        return null; // Return null to trigger fallback logic in the frontend agent
    }
}
