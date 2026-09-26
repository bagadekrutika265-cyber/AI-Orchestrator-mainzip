import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import path from 'node:path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Mount API Router
app.use('/api', apiRoutes);

const projectRoot = path.basename(process.cwd()) === 'server' ? path.resolve(process.cwd(), '..') : process.cwd();
const clientDist = path.resolve(projectRoot, 'client/dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 AI ORCHESTRATOR Engine running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`💡 Mode: ${process.env.GEMINI_API_KEY ? 'LIVE AI MODE' : 'DEMO MODE'}`);
  console.log(`====================================================`);
});
