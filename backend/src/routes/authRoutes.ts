import { Router } from 'express';
import { login, logout, refresh } from '../controllers/authController.js';
import loginLimiter from '../middleware/loginLimiter.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Login and Token Management
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Logs in a user
 *     description: Authenticates user credentials. Returns a short-lived Access Token (JWT) in the body and sets a long-lived Refresh Token in an httpOnly cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin_user
 *               password:
 *                 type: string
 *                 format: password
 *                 example: p@ssword123
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: Contains the 'jwt' refresh token cookie
 *             schema:
 *               type: string
 *               example: jwt=abc123...; HttpOnly; Secure; SameSite=None
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1Ni...
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         description: Unauthorized - Invalid username, password, or inactive account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', loginLimiter, login);

/**
 * @openapi
 * /auth/refresh:
 *   get:
 *     summary: Refresh the Access Token
 *     description: Exchanges a valid 'jwt' refresh token cookie for a new short-lived Access Token.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully issued new Access Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/refresh', refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logs out the user
 *     description: Clears the 'jwt' httpOnly refresh token cookie from the browser.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Cookie cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cookie cleared
 *       204:
 *         description: No content - No cookie was present to clear
 */
router.post('/logout', logout);

export default router;
