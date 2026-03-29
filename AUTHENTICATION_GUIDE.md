# Authentication System - Login & Registration with JWT

## Overview
Simple JWT-based authentication system with BCrypt password hashing for:
- User Registration
- User Login
- JWT token generation and storage

## Installed Dependencies

**Server:**
```bash
npm install bcryptjs validator jsonwebtoken
```

**Client:**
- No additional dependencies needed (fetch API is built-in)

## Environment Variables (`.env`)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123@Tech.45
DB_NAME=amazon
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

## Database Schema

Create the `users` table:
```sql
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Server Implementation

### Authentication Middleware (`/server/middleware/auth.js`)
```javascript
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyToken };
```

### Authentication Routes (`/server/Models/userSchema.js`)

#### POST /api/auth/register
Registers a new user with email validation and password hashing.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

#### POST /api/auth/login
Authenticates user and returns JWT token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

## Client Implementation

### API Service (`/client/src/services/api.js`)
Helper functions for authentication:
- `registerUser(userData)` - Register new user
- `loginUser(credentials)` - Login user
- `getAuthToken()` - Get stored token
- `removeAuthToken()` - Clear token
- `isAuthenticated()` - Check if user is logged in

### SignUp Component (`/client/src/components/SignUp_SignIn/SignUp.js`)
- Form validation (email, password confirmation)
- Calls `/api/auth/register` endpoint
- Stores JWT token and user info in localStorage
- Redirects to home on success

### SignIn Component (`/client/src/components/SignUp_SignIn/SignIn.js`)
- Form validation
- Calls `/api/auth/login` endpoint
- Stores JWT token and user info in localStorage
- Redirects to home on success

## Storage
Tokens and user data are stored in localStorage:
```javascript
localStorage.setItem("authToken", token);
localStorage.setItem("user", JSON.stringify(user));
```

## Using the Token

Include token in API requests header:
```javascript
const headers = {
  "Authorization": `Bearer ${localStorage.getItem("authToken")}`
};

fetch(url, { headers });
```

## Error Codes

| Status | Message | Solution |
|--------|---------|----------|
| 201 | User registered successfully | Registration complete |
| 200 | Login successful | Login complete |
| 400 | Invalid email format | Provide valid email |
| 400 | Password too short | Minimum 6 characters |
| 400 | Email already registered | Use different email |
| 401 | Invalid email or password | Check credentials |
| 500 | Internal Server Error | Server issue |

## Password Security
- Passwords hashed using BCrypt with 10 salt rounds
- Never stored in plain text
- Password comparison uses BCrypt verify

## JWT Token Details
- Valid for 7 days
- Contains userId, email, name
- Automatically appended in Authorization header

## Testing

### cURL - Registration
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

### cURL - Login
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## File Structure
```
server/
├── middleware/
│   └── auth.js                 (JWT verification)
├── Models/
│   └── userSchema.js           (Register & Login routes)
├── Routes/
│   └── Router.js               (Main router)
├── .env                        (Environment variables)
└── package.json

client/
├── src/
│   ├── services/
│   │   └── api.js              (API helpers)
│   └── components/
│       └── SignUp_SignIn/
│           ├── SignUp.js       (Registration)
│           └── SignIn.js       (Login)
└── package.json
```
