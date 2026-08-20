import { Router } from 'express';
import { recommend } from '../controllers/ai.controller.js';

export const aiRouter = Router();

/**
 * @swagger
 * /api/v1/ai/recommend:
 *   post:
 *     summary: Smart healthcare discovery
 *     description: >
 *       Uses Gemini AI to extract search criteria from natural language queries,
 *       then searches the database for matching organizations, doctors, and departments.
 *       Falls back to keyword extraction if Gemini is unavailable.
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 500
 *                 example: "I need a dermatologist near El Shorouk"
 *     responses:
 *       200:
 *         description: Recommendations with extracted criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     extractedCriteria:
 *                       type: object
 *                       properties:
 *                         specialty:
 *                           type: string
 *                           nullable: true
 *                         location:
 *                           type: string
 *                           nullable: true
 *                         organizationType:
 *                           type: string
 *                           nullable: true
 *                         keywords:
 *                           type: array
 *                           items:
 *                             type: string
 *                     extractionSource:
 *                       type: string
 *                       enum: [gemini, fallback]
 *                     organizations:
 *                       type: array
 *                     doctors:
 *                       type: array
 *                     departments:
 *                       type: array
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request body
 */
aiRouter.post('/recommend', recommend);
