# Untangle API Documentation

## Base URL

```
Production: https://your-domain.com
Development: http://localhost:8787
```

## Authentication

Most endpoints require authentication via Bearer token. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Response Format

All API responses follow this structure:

```json
{
	"message": "string",
	"data": {},
	"is_error": false
}
```

---

## Table of Contents

1. [Development Endpoints](#development-endpoints)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Documents Endpoints](#documents-endpoints)
4. [Agent/Sessions Endpoints](#agentsessions-endpoints)

---

## Development Endpoints

### GET /dev

Get server status (for development purposes)

**Authentication:** Not required

**Response:**

```json
{
	"status": "ok"
}
```

---

## Authentication Endpoints

### POST /auth/signup

Register a new user with email and password.

**Authentication:** Not required

**Request Body:**

```json
{
	"email": "user@example.com",
	"password": "securepassword123"
}
```

**Validation Rules:**

- Email must be a valid email address
- Password must be between 8-128 characters

**Query Parameters:**

- `sessionId` (optional): Session ID to associate with the user

**Response (201 Created):**

```json
{
	"message": "User created successfully",
	"data": {
		"id": "user-id",
		"email": "user@example.com",
		"token": "jwt-token"
	},
	"is_error": false
}
```

**Error Response (400 Bad Request):**

```json
{
	"message": "User already exists",
	"is_error": true
}
```

---

### POST /auth/signin

Sign in an existing user.

**Authentication:** Not required

**Request Body:**

```json
{
	"email": "user@example.com",
	"password": "securepassword123"
}
```

**Query Parameters:**

- `sessionId` (optional): Session ID to associate with the user

**Response (200 OK):**

```json
{
	"message": "User signed in",
	"data": {
		"id": "user-id",
		"email": "user@example.com",
		"token": "jwt-token"
	},
	"is_error": false
}
```

**Error Response (400 Bad Request):**

```json
{
	"message": "Invalid credentials",
	"is_error": true
}
```

---

### GET /auth/google

Initiate Google OAuth authentication.

**Authentication:** Not required

**Query Parameters:**

- `sessionId` (optional): Session ID to associate after authentication

**Response (200 OK):**

```json
{
	"url": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

**Error Response (400 Bad Request):**

```json
{
	"message": "unable to redirect to google",
	"is_error": true
}
```

---

### GET /auth/google/callback

Google OAuth callback handler.

**Authentication:** Not required

**Query Parameters:**

- `code` (required): Authorization code from Google
- `state` (optional): State parameter for session association

**Response (200 OK):**

```json
{
	"message": "User signed in",
	"data": {
		"id": "user-id",
		"email": "user@example.com",
		"token": "jwt-token"
	},
	"is_error": false
}
```

**Error Response (400 Bad Request):**

```json
{
	"message": "Authorization code is missing",
	"is_error": true
}
```

---

### POST /auth/whatsapp/start

Get WhatsApp authentication link.

**Authentication:** Not required

**Request Body:**

```json
{
	"phoneNumber": "+1234567890"
}
```

**Validation Rules:**

- Phone number must be between 10-15 characters

**Response (200 OK):**

```json
{
	"message": "Auth link generated",
	"data": {
		"url": "https://whatsapp.com/..."
	},
	"is_error": false
}
```

**Error Response (400 Bad Request):**

```json
{
	"message": "unable to get whatsapp auth link",
	"is_error": true
}
```

---

### GET /auth/ping

Verify authentication and get current user information.

**Authentication:** Required

**Response (200 OK):**

```json
{
	"message": "user fetched successfully",
	"data": {
		"id": "user-id",
		"email": "user@example.com"
	},
	"is_error": false
}
```

**Error Response (401 Unauthorized):**

```json
{
	"message": "Unauthorized",
	"is_error": true
}
```

---

## Documents Endpoints

All document endpoints require authentication.

### PUT /documents/upload

Upload a document (image or PDF).

**Authentication:** Required

**Request:**

- Content-Type: `multipart/form-data`
- Body: FormData with `file` field

**Example:**

```javascript
const formData = new FormData();
formData.append("file", fileBlob, "document.pdf");

fetch("/documents/upload", {
	method: "PUT",
	headers: {
		Authorization: "Bearer <token>",
	},
	body: formData,
});
```

**Response (201 Created):**

```json
{
	"message": "File uploaded successfully",
	"data": {
		"id": "document-id",
		"fileName": "document.pdf",
		"type": "pdf",
		"url": "https://storage.../document.pdf",
		"userId": "user-id",
		"createdAt": "2026-01-09T12:00:00Z"
	},
	"is_error": false
}
```

**Error Response (400 Bad Request):**

```json
{
	"error": "No file uploaded"
}
```

---

### GET /documents/all

Get all documents for the authenticated user.

**Authentication:** Required

**Query Parameters:**

- `pageSize` (optional, default: 10): Number of documents per page
- `offset` (optional, default: 0): Pagination offset

**Example:**

```
GET /documents/all?pageSize=20&offset=0
```

**Response (200 OK):**

```json
{
	"message": "Documents retrieved successfully",
	"data": [
		{
			"id": "document-id-1",
			"fileName": "image.png",
			"type": "image",
			"url": "https://storage.../image.png",
			"userId": "user-id",
			"createdAt": "2026-01-09T12:00:00Z"
		},
		{
			"id": "document-id-2",
			"fileName": "report.pdf",
			"type": "pdf",
			"url": "https://storage.../report.pdf",
			"userId": "user-id",
			"createdAt": "2026-01-08T10:00:00Z"
		}
	],
	"is_error": false
}
```

---

### GET /documents/:id

Get a specific document by ID.

**Authentication:** Required

**URL Parameters:**

- `id` (required): Document ID

**Example:**

```
GET /documents/doc-123
```

**Response (200 OK):**

```json
{
	"message": "Document retrieved successfully",
	"data": {
		"id": "doc-123",
		"fileName": "document.pdf",
		"type": "pdf",
		"url": "https://storage.../document.pdf",
		"userId": "user-id",
		"createdAt": "2026-01-09T12:00:00Z"
	},
	"is_error": false
}
```

**Error Response (400 Bad Request):**

```json
{
	"message": "Document ID is required",
	"is_error": true
}
```

---

### GET /documents/session/:sessionId

Get all documents associated with a specific session.

**Authentication:** Required

**URL Parameters:**

- `sessionId` (required): Session ID

**Query Parameters:**

- `pageSize` (optional, default: 10): Number of documents per page
- `offset` (optional, default: 0): Pagination offset

**Example:**

```
GET /documents/session/sess-456?pageSize=10&offset=0
```

**Response (200 OK):**

```json
{
	"message": "Documents retrieved successfully",
	"data": [
		{
			"id": "document-id-1",
			"fileName": "screenshot.png",
			"type": "image",
			"url": "https://storage.../screenshot.png",
			"sessionId": "sess-456",
			"userId": "user-id",
			"createdAt": "2026-01-09T12:00:00Z"
		}
	],
	"is_error": false
}
```

**Error Response (400 Bad Request):**

```json
{
	"message": "Session ID is required",
	"is_error": true
}
```

---

## Agent/Sessions Endpoints

All agent endpoints require authentication.

### GET /agents/sessions

Get all sessions for the authenticated user.

**Authentication:** Required

**Response (200 OK):**

```json
{
	"message": "Sessions fetched successfully",
	"data": [
		{
			"id": "session-id-1",
			"userId": "user-id",
			"createdAt": "2026-01-09T12:00:00Z",
			"updatedAt": "2026-01-09T12:30:00Z"
		},
		{
			"id": "session-id-2",
			"userId": "user-id",
			"createdAt": "2026-01-08T10:00:00Z",
			"updatedAt": "2026-01-08T11:00:00Z"
		}
	],
	"is_error": false
}
```

---

### GET /agents/sessions/:id

Get a specific session by ID.

**Authentication:** Required

**URL Parameters:**

- `id` (required): Session ID

**Example:**

```
GET /agents/sessions/session-123
```

**Response (200 OK):**

```json
{
	"message": "Session fetched successfully",
	"data": {
		"id": "session-123",
		"userId": "user-id",
		"messages": [],
		"createdAt": "2026-01-09T12:00:00Z",
		"updatedAt": "2026-01-09T12:30:00Z"
	},
	"is_error": false
}
```

---

### POST /agents/create-sessions

Create a new session.

**Authentication:** Required

**Request Body:** Empty object or no body required

**Response (200 OK):**

```json
{
	"message": "Session created successfully",
	"data": {
		"id": "new-session-id",
		"userId": "user-id",
		"createdAt": "2026-01-09T12:00:00Z",
		"updatedAt": "2026-01-09T12:00:00Z"
	},
	"is_error": false
}
```

---

### POST /agents/sessions

Start a chat session or send a message to the AI agent.

**Authentication:** Required

**Request Body:**

```json
{
	"message": "Can you help me understand this document?",
	"sessionId": "session-123",
	"documentId": "doc-456",
	"img": [
		{
			"name": "screenshot.png",
			"type": "image",
			"size": 102400,
			"data": "data:image/png;base64,iVBORw0KGgo..."
		}
	]
}
```

**Request Schema:**

- `message` (required): User message (minimum 2 characters)
- `sessionId` (optional): Existing session ID or new session will be created
- `documentId` (optional): Document ID to reference
- `img` (optional): Array of file objects with base64 encoded data
  - `name` (required): File name
  - `type` (required): File MIME type
  - `size` (optional): File size in bytes
  - `data` (optional): Base64 encoded file data

**Response (200 OK):**

```json
{
	"message": "chat fetched successfully",
	"data": {
		"response": "I can help you with that document. Here's what I found...",
		"sessionId": "session-123"
	},
	"is_error": false
}
```

**Error Response (400 Bad Request):**

```json
{
	"error": true,
	"message": "Validation failed",
	"data": {
		"errors": [
			{
				"field": "message",
				"message": "Message must be at least 2 characters long"
			}
		]
	}
}
```

---

### DELETE /agents/sessions/:id

Delete a session.

**Authentication:** Required

**URL Parameters:**

- `id` (required): Session ID to delete

**Example:**

```
DELETE /agents/sessions/session-123
```

**Response (200 OK):**

```json
{
	"message": "Session deleted successfully",
	"data": {
		"id": "session-123",
		"deleted": true
	},
	"is_error": false
}
```

---

## Error Codes

| Status Code | Description                                            |
| ----------- | ------------------------------------------------------ |
| 200         | Success                                                |
| 201         | Created                                                |
| 400         | Bad Request - Invalid input or validation error        |
| 401         | Unauthorized - Missing or invalid authentication token |
| 404         | Not Found - Resource not found                         |
| 500         | Internal Server Error                                  |

---

## Common Examples

### Authentication Flow

1. **Sign Up:**

```bash
curl -X POST https://api.example.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

2. **Sign In:**

```bash
curl -X POST https://api.example.com/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

3. **Use Token in Subsequent Requests:**

```bash
curl -X GET https://api.example.com/documents/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Document Upload Flow

```bash
curl -X PUT https://api.example.com/documents/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/document.pdf"
```

### AI Chat Flow

1. **Create Session:**

```bash
curl -X POST https://api.example.com/agents/create-sessions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

2. **Send Message:**

```bash
curl -X POST https://api.example.com/agents/sessions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain this document to me",
    "sessionId": "session-123",
    "documentId": "doc-456"
  }'
```

3. **Get Session History:**

```bash
curl -X GET https://api.example.com/agents/sessions/session-123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Rate Limiting

_To be implemented_

## Changelog

- **v1.0.0** (2026-01-09): Initial API documentation
