# SystemDesignLab Backend

A scalable, production-ready backend API for **SystemDesignLab** - A SaaS platform for practicing system design.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Security**: bcrypt, CORS, rate limiting

## 📁 Project Structure

```
src/
├── config/          # Configuration (env, database, constants)
├── controllers/     # Request handlers
├── middlewares/     # Custom middleware (auth, validation, rate limiting)
├── models/          # Mongoose schemas
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helper functions (JWT, response formatters)
├── validators/      # Zod validation schemas
├── types/           # TypeScript type definitions
├── app.ts           # Express app setup
└── server.ts        # Entry point
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/systemdesignlab
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

**⚠️ IMPORTANT**: Change `JWT_SECRET` to a secure random string in production!

### 3. Install and Start MongoDB

Ensure MongoDB is installed and running locally:

```bash
# Windows (if installed as service)
# MongoDB should auto-start

# Or start manually
mongod

# Check if MongoDB is running
mongosh
```

### 4. Seed Database (Optional)

To populate the database with sample problems:

```bash
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

### 6. Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |

### Problems

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/problems` | Get all problems (filtered by role) | ✅ |
| GET | `/api/problems/:id` | Get specific problem | ✅ |

### Designs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/designs` | Save new design | ✅ |
| GET | `/api/designs/user` | Get user's designs | ✅ |
| GET | `/api/designs/:id` | Get specific design | ✅ |

### Evaluation

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/evaluate` | Evaluate design (mock AI) | ✅ |

## 📚 API Documentation

Interactive API documentation is available via **Swagger UI**:

**URL**: `http://localhost:5000/api-docs`

The Swagger UI provides:
- 📖 Complete API reference for all endpoints
- 🧪 Interactive testing interface (try endpoints directly from the browser)
- 📝 Request/response schemas
- 🔐 JWT authentication support (click "Authorize" button to add your token)

### Using Swagger UI

1. Start the server: `npm run dev`
2. Open browser: `http://localhost:5000/api-docs`
3. Click "Authorize" button and enter: `Bearer <your_jwt_token>`
4. Try any endpoint by clicking "Try it out"

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Example Registration Request

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example Login Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🎨 Frontend Integration

### Axios Setup

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Usage in React

```typescript
// Register
const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  localStorage.setItem('token', response.data.data.token);
};

// Login
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.data.token);
};

// Fetch problems
const getProblems = async () => {
  const response = await api.get('/problems');
  return response.data.data;
};

// Submit design
const saveDesign = async (problemId, nodes, edges) => {
  const response = await api.post('/designs', { problemId, nodes, edges });
  return response.data.data;
};
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**:
  - General API: 100 req/15min
  - Auth endpoints: 5 req/15min
  - Evaluation: 10 req/hour
- **CORS**: Configured for frontend origin
- **Input Validation**: Zod schemas on all inputs
- **Error Handling**: Centralized error handler

## 🎯 Role-Based Access Control

### Free Users
- Access to non-pro problems
- Can save designs
- Can evaluate designs (mock AI)

### Pro Users
- Access to all problems (including pro-only)
- All free user features

## 🤖 AI Evaluation (Future Integration)

Currently using **mock responses**. To integrate OpenAI:

1. Install OpenAI SDK: `npm install openai`
2. Add `OPENAI_API_KEY` to `.env`
3. Update `src/services/evaluation.service.ts`
4. Replace mock data with actual API calls

## 💳 Payment Integration (Stripe/Razorpay)

Backend is structured to easily add payment routes:

```typescript
// Future: src/routes/payment.routes.ts
// Future: src/services/stripe.service.ts
// Future: src/controllers/payment.controller.ts
```

When ready, update user's `role` and `subscriptionStatus` fields.

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run type-check` - Check TypeScript types
- `npm run seed` - Seed database with sample data

## 🧪 Testing the API

Use tools like:
- **Thunder Client** (VS Code extension)
- **Postman**
- **curl**
- **Insomnia**

## 🚧 Future Enhancements

- [ ] OpenAI integration for real AI evaluation
- [ ] Stripe/Razorpay payment integration
- [ ] Email verification
- [ ] Forgot password flow
- [ ] Admin panel routes
- [ ] Design sharing/collaboration
- [ ] Unit and integration tests

## 📄 License

MIT
