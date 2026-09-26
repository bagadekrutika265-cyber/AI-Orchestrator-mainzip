import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount API Router
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 AI ORCHESTRATOR Engine running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`💡 Mode: ${process.env.GEMINI_API_KEY ? 'LIVE AI MODE' : 'DEMO MODE'}`);
  console.log(`====================================================`);
});
