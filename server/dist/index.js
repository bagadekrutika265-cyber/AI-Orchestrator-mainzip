"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_js_1 = __importDefault(require("./routes/api.js"));
const node_path_1 = __importDefault(require("node:path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
// Mount API Router
app.use('/api', api_js_1.default);
const projectRoot = node_path_1.default.basename(process.cwd()) === 'server' ? node_path_1.default.resolve(process.cwd(), '..') : process.cwd();
const clientDist = node_path_1.default.resolve(projectRoot, 'client/dist');
app.use(express_1.default.static(clientDist));
app.get('*', (_req, res) => {
    res.sendFile(node_path_1.default.join(clientDist, 'index.html'));
});
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 AI ORCHESTRATOR Engine running on port ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`💡 Mode: ${process.env.GEMINI_API_KEY ? 'LIVE AI MODE' : 'DEMO MODE'}`);
    console.log(`====================================================`);
});
