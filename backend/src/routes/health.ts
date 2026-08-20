import { Router } from 'express';
import { sendSuccess } from '../utils/response.js';
import prisma from '../lib/prisma.js';

export const healthRouter = Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: healthy
 *                     timestamp:
 *                       type: string
 *                     database:
 *                       type: string
 *                       example: connected
 *                     uptime:
 *                       type: string
 *                 message:
 *                   type: string
 */
healthRouter.get('/health', async (_req, res, next) => {
  try {
    // Quick DB connectivity check
    await prisma.$queryRaw`SELECT 1`;

    sendSuccess(res, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: `${Math.floor(process.uptime())}s`,
      version: '1.0.0',
    }, 'VEXA API is running');
  } catch (error) {
    next(error);
  }
});
