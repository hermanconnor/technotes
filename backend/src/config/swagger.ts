import swaggerJSDoc, { type Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'TechFix Pro API',
      version: '1.0.0',
      description: 'MERN stack ticketing system API with RBAC',
    },

    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],

    tags: [
      { name: 'Auth', description: 'Authentication & Tokens' },
      { name: 'Users', description: 'User management' },
      { name: 'Notes', description: 'Ticket system' },
    ],

    security: [{ bearerAuth: [] }],

    components: {
      // AUTH
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      // SCHEMAS
      schemas: {
        // ENUM
        UserRole: {
          type: 'string',
          enum: ['Employee', 'Manager', 'Admin'],
        },

        // ERROR RESPONSE
        ErrorResponse: {
          type: 'object',
          required: ['success', 'message'],
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Validation failed',
            },
            details: {
              type: 'array',
              nullable: true,
              description: 'Present only for validation errors',
              items: {
                type: 'object',
                required: ['field', 'message'],
                properties: {
                  field: {
                    type: 'string',
                    example: 'username',
                  },
                  message: {
                    type: 'string',
                    example: 'Username is required',
                  },
                },
              },
              example: [
                { field: 'username', message: 'Username is required' },
                { field: 'password', message: 'Must be at least 6 characters' },
              ],
            },
            stack: {
              type: 'string',
              nullable: true,
              description: 'Only returned in development mode',
              example: 'Error: stack trace...',
            },
          },

          // EXAMPLES
          example: {
            success: false,
            message: 'Validation failed',
            details: [
              { field: 'username', message: 'Username is required' },
              { field: 'password', message: 'Must be at least 6 characters' },
            ],
          },
        },

        // PAGINATION
        PaginationMetadata: {
          type: 'object',
          required: ['total', 'page', 'limit', 'pages'],
          properties: {
            total: { type: 'integer', example: 42 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            pages: { type: 'integer', example: 5 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
          },
        },

        // USER RESPONSE
        UserResponse: {
          type: 'object',
          required: [
            '_id',
            'username',
            'roles',
            'active',
            'createdAt',
            'updatedAt',
          ],
          properties: {
            _id: { type: 'string', example: '64f1c2a9e1234567890abcde' },
            username: { type: 'string', example: 'jdoe' },
            roles: {
              type: 'array',
              items: { $ref: '#/components/schemas/UserRole' },
            },
            active: { type: 'boolean', example: true },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-01T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-02T12:00:00.000Z',
            },
          },
        },

        // CREATE USER
        UserCreate: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', minLength: 3, example: 'jdoe' },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'securePass123',
            },
            roles: {
              type: 'array',
              items: { $ref: '#/components/schemas/UserRole' },
              example: ['Employee'],
            },
          },
        },

        // UPDATE USER
        UserUpdate: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', example: '64f1c2a9e1234567890abcde' },
            username: { type: 'string', example: 'newUsername' },
            password: {
              type: 'string',
              format: 'password',
              example: 'newSecurePass123',
            },
            roles: {
              type: 'array',
              items: { $ref: '#/components/schemas/UserRole' },
            },
            active: { type: 'boolean', example: true },
          },
        },

        // NOTE RESPONSE
        NoteResponse: {
          type: 'object',
          required: [
            '_id',
            'user',
            'username',
            'title',
            'text',
            'completed',
            'ticket',
            'createdAt',
            'updatedAt',
          ],
          properties: {
            _id: { type: 'string', example: '64f1c2a9e1234567890abcd1' },
            user: {
              type: 'string',
              description: 'User ID',
              example: '64f1c2a9e1234567890abcde',
            },
            username: { type: 'string', example: 'jdoe' },
            title: { type: 'string', maxLength: 100, example: 'Fix server' },
            text: { type: 'string', example: 'Restart the production server' },
            completed: { type: 'boolean', example: false },
            ticket: { type: 'integer', example: 1001 },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-01T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-02T12:00:00.000Z',
            },
          },
        },

        // CREATE NOTE
        NoteCreate: {
          type: 'object',
          required: ['title', 'text'],
          properties: {
            title: { type: 'string', maxLength: 100, example: 'Fix bug' },
            text: { type: 'string', example: 'Resolve login issue' },
            user: {
              type: 'string',
              description: 'Assign to user ID (Admin/Manager only)',
              example: '64f1c2a9e1234567890abcde',
            },
          },
        },

        // UPDATE NOTE
        NoteUpdate: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', example: '64f1c2a9e1234567890abcd1' },
            title: { type: 'string', example: 'Updated title' },
            text: { type: 'string', example: 'Updated text' },
            completed: { type: 'boolean', example: true },
            user: {
              type: 'string',
              description: 'Reassign user ID',
            },
          },
        },
      },

      // STANDARD RESPONSES
      responses: {
        UnauthorizedError: {
          description: 'Access token missing or invalid',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },

        ForbiddenError: {
          description: 'User does not have required permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },

        BadRequestError: {
          description: 'Validation failed or malformed request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },

        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },

        ConflictError: {
          description: 'Duplicate resource (e.g., username/title exists)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },

        InternalServerError: {
          description: 'Unexpected server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },

  apis: ['./src/routes/*.ts', './src/routes/*.js', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
