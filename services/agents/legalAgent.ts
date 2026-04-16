
import { AgentAction, UserProfile, AgentTraceLog } from '../../types';
import { LEGAL_DOCUMENTS } from '../legalData';
import { financeExpert } from './financeAgent';
import { marinaExpert } from './marinaAgent';
import { customerExpert } from './customerAgent'; // Import Customer Expert for Blacklist Check

// Regex to find article numbers like E.1.1, D.9, F.13, or Rule 15
const ARTICLE_REGEX = /(?:^|\n)(?:##\s*)?(?:MADD|MADDE|Madde|Article|Kural|Rule|Section|Part)\s+([A-Z]?\.?\d+(?:\.\d+)*|B\.\d+|A\.\d+)\.?\s*[:\-\s]/i;

function simulateRagLookup(query: string, documentId: string, addTrace: (t: AgentTraceLog) => void): string {
    const docContent = LEGAL_DOCUMENTS[documentId];
    if (!docContent) {
        return `Document not found: ${documentId}`;
    }

    const lowerQuery = query.toLowerCase();
    
    addTrace({
        id: `trace_rag_match_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        node: 'ada.legal',
        step: 'THINKING',
        content: `Searching "${documentId}" for keywords related to: "${query}"...`,
        persona: 'WORKER'
    });

    const lines = docContent.split('\n');
    const allSections: { article: string; text: string; score: number }[] = [];
    let currentArticle = "General Information";
    let sectionBuffer: string[] = [];

    const addSection = () => {
        if (sectionBuffer.length > 0) {
            const text = sectionBuffer.join('\n').trim();
            let score = 0;
            if (text.toLowerCase().includes(lowerQuery)) {
                score = 2;
            }
            if (score > 0) {
                allSections.push({ article: currentArticle, text, score });
            }
            sectionBuffer = [];
        }
    };

    for (const line of lines) {
        const articleMatch = line.match(ARTICLE_REGEX);
        if (articleMatch) {
            addSection();
            currentArticle = articleMatch[1].trim();
            sectionBuffer.push(line.trim());
        } else {
            sectionBuffer.push(line.trim());
        }
    }
    addSection();

    if (allSections.length === 0) {
        return `No direct article related to "${query}" was found in the **${documentId}** document.`;
    }

    allSections.sort((a, b) => b.score - a.score);
    const topSnippets = allSections.slice(0, 3);
    let formattedResponse = "";

    if (documentId.includes('colregs') || documentId.includes('maritime')) {
         formattedResponse += "Set your compass straight, Captain! Here's what you need to know about maritime rules and regulations:\n\n";
    } else {
         formattedResponse += `**West Istanbul Marina Regulations (related to "${query}"):**\n\n`;
    }

    topSnippets.forEach(snippet => {
        formattedResponse += `--- **Article ${snippet.article}:** ---\n${snippet.text}\n\n`;
    });

    return formattedResponse;
}

export const legalExpert = {
  // Skill: Check Vessel Compliance (Turkish Waters)
  checkTurkishCompliance: async (vesselFlag: string, length: number, addTrace: (t: AgentTraceLog) => void): Promise<{ compliant: boolean, requirements: string[], message: string }> => {
      addTrace({
          id: `trace_legal_comp_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          node: 'ada.legal',
          step: 'THINKING',
          content: `Evaluating compliance for ${vesselFlag} flagged vessel (${length}m) against Turkish Maritime Guide...`,
          persona: 'EXPERT'
      });

      const requirements: string[] = [];
      let compliant = true;
      
      // Logic based on docs/legal/turkish_maritime_guide.md content
      
      // 1. Mandatory Documents (Section 2)
      if (vesselFlag === 'TR') {
          requirements.push("Certificate of Registry / Tonnage Certificate");
          requirements.push("Mandatory Vessel Insurance");
          
          if (length >= 2.5 && length < 24) {
              requirements.push("Amateur Seaman's Certificate (ADB)");
          }
          requirements.push("Short Range Certificate (SRC) (if VHF present)");
      } else {
          // Foreign flag requirements implied
          requirements.push("Transit Log (Yacht Registration Certificate)");
          requirements.push("Valid Insurance Policy");
      }

      // 2. Safety Equipment (Section 3 Overview)
      requirements.push("Life Jackets (1 per person)");
      requirements.push("Fire Extinguishers");
      
      // 3. Straits Rules (Section 5)
      let straitsRule = "Monitor VHF Sector Channels (11/12/13/14).";
      if (length < 20) {
          straitsRule += " Navigation restricted to outside TSS lanes.";
      } else {
          straitsRule += " SP-1 Reporting required to VTS.";
      }

      const message = `**TURKISH MARITIME COMPLIANCE CHECK**\n\n` +
                      `**Vessel Profile:** Flag ${vesselFlag}, LOA ${length}m\n\n` +
                      `**Mandatory Documentation:**\n` +
                      requirements.map(r => `- ${r}`).join('\n') +
                      `\n\n**Straits Navigation Protocol:**\n` +
                      `- ${straitsRule}\n` +
                      `- Max Speed: 10 Knots (SOG).`;

      addTrace({
          id: `trace_legal_comp_out_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          node: 'ada.legal',
          step: 'OUTPUT',
          content: `Compliance checklist generated. ${requirements.length} items flagged.`,
          persona: 'WORKER'
      });

      return { compliant, requirements, message };
  },

  process: async (params: any, user: UserProfile, addTrace: (t: AgentTraceLog) => void): Promise<AgentAction[]> => {
    
    // RBAC Check
    if (user.role !== 'GENERAL_MANAGER' && user.role !== 'CAPTAIN') {
        addTrace({
            id: `trace_legal_deny_${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            node: 'ada.legal',
            step: 'ERROR',
            content: `SECURITY ALERT: Unauthorized access attempt by ${user.name}.`
        });
        return [{
            id: `legal_deny_${Date.now()}`,
            kind: 'internal',
            name: 'ada.legal.accessDenied',
            params: { reason: 'Requires authorized role.' }
        }];
    }

    const { query } = params;
    const lowerQuery = query.toLowerCase();
    let documentToQuery: string | null = null;
    let queryContext: string = "";

    // --- SPECIAL SCENARIO: SALE / TRANSFER OF VESSEL ---
    if (lowerQuery.includes('satış') || lowerQuery.includes('satabilir') || lowerQuery.includes('sell') || lowerQuery.includes('sale') || lowerQuery.includes('transfer') || lowerQuery.includes('devir')) {
        
        addTrace({
            id: `trace_legal_sale_${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            node: 'ada.legal',
            step: 'PLANNING',
            content: `Detected "Vessel Sale/Transfer" intent. Initiating protocol: Debt Check (Muvafakat) + Contract Review (Article E.2.19) + CRM Blacklist Check.`,
            persona: 'EXPERT'
        });

        // 1. Check Debt (Simulation using Finance Expert logic directly)
        const vesselName = "S/Y Phisedelia"; // Context-aware in production
        const debtStatus = await financeExpert.checkDebt(vesselName);
        const hasDebt = debtStatus.status === 'DEBT';
        
        // 2. Check Blacklist / Right of Refusal (Simulate buyer name check from prompt or context)
        // If user asks: "Can I sell to Mr. Problem?", we check "Mr. Problem"
        let buyerStatus: { status: string, reason?: string } = { status: 'ACTIVE', reason: '' };
        const potentialBuyer = query.match(/(?:to|alıcı)\s+([A-Z][a-z]+)/i)?.[1]; // Simple extraction
        if (potentialBuyer) {
             buyerStatus = await customerExpert.checkBlacklistStatus(potentialBuyer, addTrace);
        }
        
        let advice = `**VESSEL SALE & CONTRACT TRANSFER PROTOCOL**\n\n`;
        advice += `Captain, selling a vessel while under contract (e.g., at Month 5 of 12) triggers specific legal procedures under **WIM Operation Regulations**.\n\n`;
        
        advice += `**1. The "Muvafakat" Requirement (Consent):**\n`;
        if (hasDebt) {
            advice += `⚠️ **ALERT:** Financial records show an outstanding balance of **€${debtStatus.amount}** for ${vesselName}.\n`;
            advice += `Pursuant to **Article H.2 (Right of Retention)**, the Marina **WILL NOT** issue the "No Debt Letter" (Borcu Yoktur Yazısı) required by the Harbor Master (Liman Başkanlığı) for the official sale until this debt is cleared.\n`;
        } else {
            advice += `✅ **CLEAR:** Financial records are clean. The Marina can issue the "No Debt Letter" required for the Port Authority transfer upon request.\n`;
        }

        advice += `\n**2. Contract Status (Article E.2.19):**\n`;
        advice += `Contracts are **personal** and **non-transferable**. If you sell the vessel:\n`;
        advice += `- Your current contract **terminates** automatically.\n`;
        advice += `- You are **not entitled to a refund** for the remaining period (e.g., the remaining 7 months).\n`;
        advice += `- The new owner must sign a **new contract** within 7 days to keep the vessel in the marina.\n`;

        advice += `\n**3. Right of Refusal (Freedom of Contract):**\n`;
        if (buyerStatus.status === 'BLACKLISTED') {
             advice += `⛔ **CRITICAL WARNING:** The potential buyer **"${potentialBuyer}"** is flagged in our CRM as **BLACKLISTED**.\n`;
             advice += `**Reason:** ${buyerStatus.reason}\n`;
             advice += `The Marina exercises its Right of Refusal. We **WILL NOT** sign a contract with this individual. If the sale proceeds, the vessel must **vacate the marina immediately** upon transfer of title.\n`;
        } else {
             advice += `The Marina is **not obligated** to sign a contract with the new owner. We reserve the right to accept or reject customers based on our operational principles and CRM history. If the new owner is deemed suitable, a new contract will be drawn up at current market rates.\n`;
        }

        return [{
            id: `legal_sale_advice_${Date.now()}`,
            kind: 'internal',
            name: 'ada.legal.consultation',
            params: { 
                advice: advice,
                context: "Vessel Sale & Transfer",
                references: ["Article E.2.19", "Article H.2", "Article H.6"]
            }
        }];
    }

    // SETUR Policy Check
    if (lowerQuery.includes('setur')) { 
        addTrace({
            id: `trace_legal_setur_${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            node: 'ada.legal',
            step: 'OUTPUT',
            content: `Policy: Competitor inquiry detected. Providing generic legal response.`,
            persona: 'EXPERT'
        });
        return [{
            id: `legal_resp_${Date.now()}`,
            kind: 'internal',
            name: 'ada.legal.consultation',
            params: { 
                advice: `Ada Marina specializes in the legal regulations of West Istanbul Marina. KVKK/GDPR is a legal requirement in Turkey. For inquiries about other institutions, please contact them directly.`,
                context: "General Legal Information",
                references: []
            }
        }];
    } 
    
    // Document Selection
    if (lowerQuery.includes('colregs') || lowerQuery.includes('rule') || lowerQuery.includes('navigation') || lowerQuery.includes('collision')) {
        documentToQuery = 'colregs_and_straits.md';
        queryContext = "COLREGs & Navigation Rules";
    } else if (lowerQuery.includes('guide') || lowerQuery.includes('document') || lowerQuery.includes('equipment')) {
        documentToQuery = 'turkish_maritime_guide.md';
        queryContext = "Maritime Guide";
    } else if (lowerQuery.includes('kvkk') || lowerQuery.includes('data') || lowerQuery.includes('privacy')) {
        documentToQuery = 'wim_kvkk.md';
        queryContext = "WIM Privacy Policy";
    } else {
        documentToQuery = 'wim_contract_regulations.md';
        queryContext = "WIM Operation Regulations";
    }

    const ragResult = documentToQuery ? simulateRagLookup(query, documentToQuery, addTrace) : "Information not found.";

    return [{
        id: `legal_resp_${Date.now()}`,
        kind: 'internal',
        name: 'ada.legal.consultation',
        params: { 
            advice: ragResult,
            context: queryContext,
            references: documentToQuery ? [documentToQuery] : []
        }
    }];
  }
};
