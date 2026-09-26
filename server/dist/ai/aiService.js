"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const understanding_js_1 = require("../engine/understanding.js");
class AIService {
    static getMode() {
        if (process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY) {
            return 'LIVE_AI_MODE';
        }
        return 'DEMO_MODE';
    }
    static async processRequest(requestText) {
        const mode = this.getMode();
        console.log(`[AI Service] Processing request in ${mode}...`);
        if (mode === 'LIVE_AI_MODE' && process.env.GEMINI_API_KEY) {
            try {
                // Live Gemini API call if API key provided
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                                parts: [{
                                        text: `You are an AI Workflow Orchestration engine. Analyze this request and output JSON with keys: requestType, intent, priority (LOW|MEDIUM|HIGH|CRITICAL), priorityReason, missingInformation (array of strings), suggestedWorkflow, confidenceScore (number 0-100). Request: "${requestText}"`
                                    }]
                            }]
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (jsonText) {
                        const cleanJson = jsonText.substring(jsonText.indexOf('{'), jsonText.lastIndexOf('}') + 1);
                        const parsed = JSON.parse(cleanJson);
                        return {
                            requestType: parsed.requestType || 'General Service Request',
                            intent: parsed.intent || 'Execute requested business action',
                            entities: {},
                            constraints: [],
                            priority: parsed.priority || 'MEDIUM',
                            priorityReason: parsed.priorityReason || 'LLM analyzed business impact',
                            requiredInformation: [],
                            missingInformation: parsed.missingInformation || [],
                            suggestedWorkflow: parsed.suggestedWorkflow || 'Service Request',
                            confidenceScore: parsed.confidenceScore || 92,
                            confidenceReason: 'Evaluated by Google Gemini 1.5 Flash Model',
                            nextAction: 'Initiate dynamic execution plan'
                        };
                    }
                }
            }
            catch (err) {
                console.warn('[AI Service] Gemini API call failed or timed out, falling back to Demo Mode simulation engine:', err);
            }
        }
        // Fallback to deterministic, reliable Demo Engine
        return understanding_js_1.RequestUnderstandingEngine.understand(requestText);
    }
}
exports.AIService = AIService;
