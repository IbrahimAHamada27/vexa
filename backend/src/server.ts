import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/health.js';
import { organizationsRouter } from './routes/organizations.routes.js';
import { doctorsRouter } from './routes/doctors.routes.js';
import { departmentsRouter } from './routes/departments.routes.js';
import { servicesRouter } from './routes/services.routes.js';
import { appointmentsRouter } from './routes/appointments.routes.js';
import { aiRouter } from './routes/ai.routes.js';

// ─── Load Environment Variables ─────────────────────────────────────────────

dotenv.config();

// ─── Create Express App ─────────────────────────────────────────────────────

const app = express();
const PORT = parseInt(process.env['PORT'] || '5000', 10);

// ─── Global Middleware ──────────────────────────────────────────────────────

// CORS: Allow local dev servers + Vercel frontend deployments
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin.includes('localhost') ||
      origin.includes('vercel.app') ||
      origin === 'https://vexa-1-vert.vercel.app'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Request Logger (dev) ───────────────────────────────────────────────────

if (process.env['NODE_ENV'] !== 'production') {
  app.use((req, _res, next) => {
    const timestamp = new Date().toISOString().slice(11, 19);
    console.log(`  ${timestamp} │ ${req.method.padEnd(6)} ${req.url}`);
    next();
  });
}

// ─── Swagger API Docs ───────────────────────────────────────────────────────

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { font-size: 2em; }
  `,
  customSiteTitle: 'VEXA API Documentation',
  customfavIcon: '',
}));

// Expose raw OpenAPI spec
app.get('/api/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─── API Routes (v1) ───────────────────────────────────────────────────────

app.use('/api/v1', healthRouter);                        // GET /api/v1/health
app.use('/api/v1/organizations', organizationsRouter);   // GET /, GET /:id
app.use('/api/v1/doctors', doctorsRouter);               // GET /, GET /:id
app.use('/api/v1/departments', departmentsRouter);       // GET /
app.use('/api/v1/services', servicesRouter);             // GET /
app.use('/api/v1/appointments', appointmentsRouter);     // GET /, GET /availability, POST /
app.use('/api/v1/ai', aiRouter);                         // POST /recommend

// ─── 404 & Global Error Handling ────────────────────────────────────────────

app.use(notFoundHandler);
app.use(globalErrorHandler);

// ─── Start Server ───────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════════════════╗');
  console.log('  ║           🏥  VEXA Healthcare Platform               ║');
  console.log('  ╠══════════════════════════════════════════════════════╣');
  console.log(`  ║  🚀  Server:     http://localhost:${PORT}                 ║`);
  console.log(`  ║  📚  API Docs:   http://localhost:${PORT}/api/docs        ║`);
  console.log(`  ║  📋  Spec JSON:  http://localhost:${PORT}/api/docs.json   ║`);
  console.log(`  ║  🌍  Env:        ${(process.env['NODE_ENV'] || 'development').padEnd(36)}║`);
  console.log(`  ║  🤖  Gemini:     ${(process.env['GEMINI_API_KEY'] ? 'Configured ✓' : 'Not set (fallback mode)').padEnd(36)}║`);
  console.log('  ╠══════════════════════════════════════════════════════╣');
  console.log('  ║  API v1 Endpoints:                                   ║');
  console.log('  ║  ─────────────────────────────────────────────────   ║');
  console.log('  ║   GET    /api/v1/health                              ║');
  console.log('  ║   GET    /api/v1/organizations                       ║');
  console.log('  ║   GET    /api/v1/organizations/:id                   ║');
  console.log('  ║   GET    /api/v1/doctors                             ║');
  console.log('  ║   GET    /api/v1/doctors/:id                         ║');
  console.log('  ║   GET    /api/v1/departments                         ║');
  console.log('  ║   GET    /api/v1/services                            ║');
  console.log('  ║   GET    /api/v1/appointments                        ║');
  console.log('  ║   GET    /api/v1/appointments/availability           ║');
  console.log('  ║   POST   /api/v1/appointments                        ║');
  console.log('  ║   POST   /api/v1/ai/recommend              🤖 AI    ║');
  console.log('  ╚══════════════════════════════════════════════════════╝');
  console.log('');
});

export default app;
