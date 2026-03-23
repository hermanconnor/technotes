import { Router } from 'express';
import {
  deleteUser,
  getAllUsers,
  register,
  updateUser,
} from '../controllers/userController.js';
import { verifyJWT } from '../middleware/verifyJwt.js';
import { verifyRoles } from '../middleware/verifyRoles.js';

const router = Router();

router.use(verifyJWT);

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User management and administration
 */

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all registered users alphabetically. Passwords are excluded.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 *   post:
 *     summary: Register/Create a new user
 *     description: Creates a new user account. Only accessible by Managers or Admins.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New user jdoe created
 *                 id:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *
 *   patch:
 *     summary: Update a user
 *     description: Update user details, roles, or password. Only provided fields will be updated.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Username already taken
 *
 *   delete:
 *     summary: Delete a user
 *     description: Removes a user from the system. Prevents self-deletion and deletion of users with assigned notes.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The MongoDB ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Bad Request - User has assigned notes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admins cannot delete their own account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router
  .route('/')
  .get(verifyRoles('Admin', 'Manager'), getAllUsers)
  .post(verifyRoles('Admin', 'Manager'), register)
  .patch(verifyRoles('Admin', 'Manager'), updateUser)
  .delete(verifyRoles('Admin'), deleteUser);

export default router;
