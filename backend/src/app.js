import express from 'express';
import api from './api/index.js';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import klarnaRouter from './api/routes/klarnaRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'http://10.120.32.65',
  // Add any other known frontend origins
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('Incoming request origin:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use((err, req, res, next) => {
  console.error('Error handler caught:', err);
  res.status(500).json({ error: err.message });
});


app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

// serve static files from the 'public' directory
app.use(
  '/uploads',
  express.static(path.join(__dirname,'public', 'uploads')),
);
console.log(
  'Static files path:',
  path.join(__dirname, '..', 'public', 'uploads'),
);

app.use('/api/v1', api);

app.use('/api/v1/klarna', klarnaRouter);

export default app;
