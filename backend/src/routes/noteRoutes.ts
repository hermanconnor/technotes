import { Router } from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from '../controllers/noteController.js';
import { verifyJWT } from '../middleware/verifyJwt.js';

const router = Router();

router.use(verifyJWT);

/**
 * @openapi
 * tags:
 *   - name: Notes
 *     description: Ticket management and assignments
 */

/**
 * @openapi
 * /notes:
 *   get:
 *     summary: Get all notes (Paginated & Searchable)
 *     description: Returns a paginated list of tickets. Regular employees see only their own assigned notes. Managers and Admins see all notes.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or text using MongoDB text index
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter by completion status
 *     responses:
 *       200:
 *         description: Successfully retrieved notes with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metadata:
 *                   $ref: '#/components/schemas/PaginationMetadata'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NoteResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *   post:
 *     summary: Create a new note
 *     description: Creates a new ticket. If an Employee creates it, it is auto-assigned to them. Admins/Managers can assign it to any User ID.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteCreate'
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New note 'Fix Server' created and assigned to jdoe
 *                 ticketNumber:
 *                   type: integer
 *                   example: 1005
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         description: Assigned user not found
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *
 *   patch:
 *     summary: Update a note
 *     description: Updates ticket details or completion status. Ownership/Role checks are performed via canAccessResource helper.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteUpdate'
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       403:
 *         description: Forbidden - You do not have permission to edit this note
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
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
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router
  .route('/')
  .get(getAllNotes)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote);

export default router;
