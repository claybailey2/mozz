import express from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/error';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (to be added)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Error handling should be last
app.use('*', notFoundHandler);
app.use(errorHandler);

export default app;