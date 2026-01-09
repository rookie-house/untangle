export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Untangle API',
    version: '1.0.0',
    description: 'API documentation for the Untangle application - AI-powered document analysis and conversation platform',
  },
  servers: [
    {
      url: 'http://localhost:8787',
      description: 'Development server',
    },
    {
      url: 'https://api.untangle.rookie.house',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', nullable: true },
          email: { type: 'string', format: 'email' },
          profilePic: { type: 'string', nullable: true },
          phoneNumber: { type: 'string', nullable: true },
          createdAt: { type: 'integer', description: 'Unix timestamp' },
          updatedAt: { type: 'integer', description: 'Unix timestamp' },
        },
      },
      Session: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string', nullable: true },
          userId: { type: 'integer' },
          createdAt: { type: 'integer', description: 'Unix timestamp' },
          updatedAt: { type: 'integer', description: 'Unix timestamp' },
        },
      },
      Document: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          type: { type: 'string' },
          url: { type: 'string' },
          userId: { type: 'integer' },
          sessionId: { type: 'string', nullable: true },
          createdAt: { type: 'integer', description: 'Unix timestamp' },
          updatedAt: { type: 'integer', description: 'Unix timestamp' },
        },
      },
      AuthRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Valid email address',
          },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 128,
            description: 'Password must be 8-128 characters',
          },
        },
      },
      PhoneNumberRequest: {
        type: 'object',
        required: ['phoneNumber'],
        properties: {
          phoneNumber: {
            type: 'string',
            minLength: 10,
            maxLength: 15,
            description: 'Phone number for WhatsApp authentication',
          },
        },
      },
      ChatRequest: {
        type: 'object',
        required: ['message'],
        properties: {
          message: {
            type: 'string',
            minLength: 2,
            description: 'Chat message content',
          },
          sessionId: {
            type: 'string',
            description: 'Optional session ID to continue conversation',
          },
          documentId: {
            type: 'string',
            description: 'Optional document ID to analyze',
          },
          img: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                type: { type: 'string' },
                size: { type: 'number' },
                data: { type: 'string', description: 'Base64 encoded file data' },
              },
            },
            description: 'Optional array of images',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          error: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        tags: ['System'],
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/dev': {
      get: {
        summary: 'Get development status',
        tags: ['Development'],
        responses: {
          '200': {
            description: 'Development status',
          },
        },
      },
    },
    '/api/auth/signup': {
      post: {
        summary: 'Create a new user account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/auth/signin': {
      post: {
        summary: 'Sign in to existing account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successfully authenticated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        token: { type: 'string', description: 'JWT token' },
                        user: { $ref: '#/components/schemas/User' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
          },
        },
      },
    },
    '/api/auth/google': {
      get: {
        summary: 'Initiate Google OAuth flow',
        tags: ['Authentication'],
        responses: {
          '302': {
            description: 'Redirect to Google OAuth',
          },
        },
      },
    },
    '/api/auth/google/callback': {
      get: {
        summary: 'Google OAuth callback',
        tags: ['Authentication'],
        parameters: [
          {
            name: 'code',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Authorization code from Google',
          },
        ],
        responses: {
          '200': {
            description: 'Successfully authenticated with Google',
          },
          '400': {
            description: 'Invalid authorization code',
          },
        },
      },
    },
    '/api/auth/whatsapp/start': {
      post: {
        summary: 'Start WhatsApp authentication',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PhoneNumberRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'WhatsApp auth link generated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        authLink: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/auth/ping': {
      get: {
        summary: 'Verify authentication status',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Authentication valid',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    authenticated: { type: 'boolean' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/documents/upload': {
      put: {
        summary: 'Upload a document',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                  },
                  title: { type: 'string' },
                  sessionId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Document uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Document' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Upload failed',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/documents/all': {
      get: {
        summary: 'Get all documents for authenticated user',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of documents',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Document' },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/documents/{id}': {
      get: {
        summary: 'Get document by ID',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Document ID',
          },
        ],
        responses: {
          '200': {
            description: 'Document details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Document' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Document not found',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/documents/session/{sessionId}': {
      get: {
        summary: 'Get all documents in a session',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'sessionId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Session ID',
          },
        ],
        responses: {
          '200': {
            description: 'List of documents in session',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Document' },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/agents/sessions': {
      get: {
        summary: 'Get all agent sessions for authenticated user',
        tags: ['Agent Sessions'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of agent sessions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Session' },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
      post: {
        summary: 'Start a new agent conversation',
        tags: ['Agent Sessions'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChatRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Agent response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        sessionId: { type: 'string' },
                        response: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/agents/sessions/{id}': {
      get: {
        summary: 'Get a specific agent session',
        tags: ['Agent Sessions'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Session ID',
          },
        ],
        responses: {
          '200': {
            description: 'Session details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Session' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Session not found',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
      delete: {
        summary: 'Delete an agent session',
        tags: ['Agent Sessions'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Session ID',
          },
        ],
        responses: {
          '200': {
            description: 'Session deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Session not found',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/agents/create-sessions': {
      post: {
        summary: 'Create a new empty agent session',
        tags: ['Agent Sessions'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', description: 'Optional session title' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Session created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Session' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'System',
      description: 'System health and status endpoints',
    },
    {
      name: 'Development',
      description: 'Development and debugging endpoints',
    },
    {
      name: 'Authentication',
      description: 'User authentication and authorization',
    },
    {
      name: 'Documents',
      description: 'Document upload and management',
    },
    {
      name: 'Agent Sessions',
      description: 'AI agent conversation sessions',
    },
  ],
};