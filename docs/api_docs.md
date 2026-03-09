## 📚 API Documentation

### 🌐 Base URL
```
http://localhost:4000/api/v1
```

### 🔑 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

---

### 🔐 Authentication Endpoints

#### **Login**

<table>
<tr>
<td width="120"><b>Method</b></td>
<td><code>POST</code></td>
</tr>
<tr>
<td><b>Endpoint</b></td>
<td><code>/auth/login</code></td>
</tr>
<tr>
<td><b>Auth Required</b></td>
<td>❌ No</td>
</tr>
<tr>
<td><b>Rate Limit</b></td>
<td>5 requests per 15 minutes</td>
</tr>
</table>

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "status": 200,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "MEMBER",
    "organizationId": "uuid"
  }
}
```

**Error Response (401):**
```json
{
  "status": 401,
  "message": "Invalid credentials"
}
```

---

### 🏢 Organization Endpoints

| Method | Endpoint | Description | Auth | Role | Rate Limit |
|--------|----------|-------------|------|------|------------|
| `POST` | `/organizations` | Create new organization | ✅ | ORG_ADMIN | 100/15min |
| `GET` | `/organizations` | List all organizations | ✅ | ORG_ADMIN | 100/15min |

**Create Organization Example:**

```bash
curl -X POST http://localhost:4000/api/v1/organizations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation",
    "slug": "acme-corp",
    "description": "Enterprise solutions provider"
  }'
```

**Response (201):**
```json
{
  "status": 201,
  "message": "Organization created successfully",
  "data": {
    "id": "uuid",
    "name": "Acme Corporation",
    "slug": "acme-corp",
    "description": "Enterprise solutions provider",
    "isActive": true,
    "createdAt": "2026-03-09T10:30:00.000Z"
  }
}
```

---

### 📊 Project Endpoints

| Method | Endpoint | Description | Auth | Role | Response |
|--------|----------|-------------|------|------|----------|
| `POST` | `/projects` | Create project | ✅ | ORG_ADMIN | Project object |
| `GET` | `/projects` | List organization projects | ✅ | ORG_ADMIN | Project array |
| `GET` | `/projects/:id` | Get project details | ✅ | ORG_ADMIN | Project object |
| `PUT` | `/projects/:id` | Update project | ✅ | ORG_ADMIN | Updated project |
| `DELETE` | `/projects/:id` | Soft delete project | ✅ | ORG_ADMIN | Success message |

**Create Project Request:**
```json
{
  "name": "Website Redesign",
  "description": "Complete overhaul of company website"
}
```

---

### ✅ Task Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| `POST` | `/tasks` | Create new task | ✅ | ORG_ADMIN |
| `GET` | `/tasks/my-tasks` | Get assigned tasks | ✅ | MEMBER |
| `GET` | `/tasks/:id` | Get task details | ✅ | Any |
| `PUT` | `/tasks/:id` | Update task | ✅ | ORG_ADMIN |
| `PUT` | `/tasks/:id/assign` | Assign/unassign task | ✅ | ORG_ADMIN |
| `PUT` | `/tasks/:id/status` | Update task status | ✅ | MEMBER |
| `DELETE` | `/tasks/:id` | Soft delete task | ✅ | ORG_ADMIN |

**Task Priorities:**
| Priority | Description | Color |
|----------|-------------|-------|
| `LOW` | Minor tasks | 🟢 Green |
| `MEDIUM` | Standard tasks | 🟡 Yellow |
| `HIGH` | Important tasks | 🟠 Orange |
| `URGENT` | Critical tasks | 🔴 Red |

**Task Statuses:**
| Status | Description | Icon |
|--------|-------------|------|
| `PENDING` | Not started | ⏳ |
| `IN_PROGRESS` | Currently working | 🔄 |
| `COMPLETED` | Finished | ✅ |
| `BLOCKED` | Blocked/Waiting | 🚫 |

**Create Task Example:**
```json
{
  "title": "Design homepage mockup",
  "description": "Create high-fidelity mockup for new homepage",
  "projectId": "project-uuid",
  "priority": "HIGH",
  "assignedTo": "user-uuid",
  "dueDate": "2026-04-15T00:00:00Z"
}
```

---

### 👥 User Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| `POST` | `/users` | Create user | ✅ | ORG_ADMIN |
| `GET` | `/users` | List users | ✅ | ORG_ADMIN |
| `GET` | `/users/:id` | Get user by ID | ✅ | Any |
| `PUT` | `/users/:id` | Update user | ✅ | ORG_ADMIN |
| `DELETE` | `/users/:id` | Deactivate user | ✅ | ORG_ADMIN |

---

### 🏥 Health & Monitoring Endpoints

| Method | Endpoint | Description | Auth | Purpose |
|--------|----------|-------------|------|---------|
| `GET` | `/health` | Complete health check | ❌ | Monitor all services |
| `GET` | `/ready` | Readiness probe | ❌ | K8s readiness |
| `GET` | `/live` | Liveness probe | ❌ | K8s liveness |
| `GET` | `/metrics` | Prometheus metrics | ❌ | Observability |

**Health Check Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-09T10:30:00.000Z",
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": 15
    },
    "memory": {
      "status": "healthy",
      "usage": 150000000,
      "percentage": 7.5
    }
  },
  "uptime": 3600
}
```
