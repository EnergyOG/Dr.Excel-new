<div align="center">
  <img src="public/images/welcome-banner.png" alt="Dr.Excel Banner" width="100%" />
</div>

# Dr.Excel

A modern full-stack web application for request management with dual authentication support (JWT & Clerk), featuring a responsive React frontend and a secure Express backend with Redis caching.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Local Development](#local-development)
  - [Docker Development](#docker-development)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Security](#security)
- [Performance](#performance)
- [License](#license)

## Overview

Dr.Excel is a comprehensive request management system designed to handle user submissions efficiently. The application provides a seamless experience for both end-users and administrators, featuring:

- **User Authentication**: Dual authentication system supporting both traditional JWT-based auth and modern OAuth via Clerk
- **Request Management**: Full CRUD operations for user requests with status tracking
- **Admin Dashboard**: Comprehensive admin panel for user and request management
- **Performance Optimized**: Redis caching layer for fast data retrieval
- **Production Ready**: CI/CD pipeline with Docker containerization and AWS ECS deployment

## Features

### User Features
- 🔐 **Secure Authentication** - Register, login, and manage your account
- 📧 **Email Verification** - Verify your email address for account security
- 🔄 **Password Reset** - Secure password reset via email
- 👤 **Profile Management** - Update your account settings and information

### Admin Features
- 📊 **Dashboard Analytics** - View system statistics and metrics
- 👥 **User Management** - View, modify roles, and manage user status
- 📋 **Request Management** - Oversee all user requests and their statuses
- 🔒 **Access Control** - Role-based access with admin-only routes

### Technical Features
- ⚡ **Redis Caching** - Fast data retrieval with automatic cache invalidation
- 🛡️ **Security** - Helmet, CORS, rate limiting, and input validation
- 📝 **Structured Logging** - Winston-based logging with environment-aware verbosity
- 🐳 **Docker Support** - Containerized development and deployment
- 🚀 **CI/CD Pipeline** - Automated deployment to AWS ECS

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router |
| **Backend** | Node.js (ESM), Express 4, MongoDB, Redis |
| **Authentication** | JWT, Clerk (OAuth) |
| **Database** | MongoDB (Mongoose ODM) |
| **Cache** | Redis with rate-limit-redis |
| **Logging** | Winston |
| **Security** | Helmet, CORS, express-rate-limit, bcrypt |
| **Deployment** | Docker, AWS ECS, GitHub Actions |
| **Infrastructure as Code** | Terraform |

## Project Structure

```
.
├── backend/                    # Express API server
│   ├── src/
│   │   ├── config/            # Database, Redis, JWT, Clerk configuration
│   │   ├── controllers/       # Route handlers (auth, admin, user, request)
│   │   ├── middleware/        # Auth guards, validation, error handling, rate limiting
│   │   ├── model/             # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Cache and email services
│   │   └── utils/             # Logger utility
│   ├── server.js              # Application entry point
│   └── package.json
├── frontend/                   # React application
│   └── dr-excel/
│       ├── src/
│       │   ├── components/    # Reusable UI components
│       │   ├── homepage/      # Landing page
│       │   ├── login-page/    # Authentication pages
│       │   ├── signup-page/   # Registration page
│       │   ├── account-settings/ # User profile management
│       │   └── admin/         # Admin dashboard
│       ├── index.html
│       └── package.json
├── terraform/                  # Infrastructure as Code
│   ├── modules/
│   └── environment/
├── docker-compose.yaml         # Multi-container development setup
└── .github/workflows/
    └── deploy.yml             # CI/CD pipeline
```

## Prerequisites

- **Node.js** 18+ (for local development)
- **Docker & Docker Compose** (for containerized development)
- **MongoDB** 7+ (or use Docker image)
- **Redis** 7+ (or use Docker image)
- **Git** (for version control)

## Getting Started

### Local Development

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables (see Environment Variables section)
# Then start the server
npm run dev
```

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/dr-excel

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Then start the development server
npm run dev
```

### Docker Development

```bash
# Start all services (MongoDB, Redis, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- **MongoDB** on port 27017
- **Redis** on port 6379
- **Backend API** on port 3000
- **Frontend** on port 5173

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/portfolio` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `REDIS_PASSWORD` | Redis password | - |
| `JWT_SECRET` | Secret for JWT signing | - |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `SMTP_HOST` | Email server host | - |
| `SMTP_PORT` | Email server port | - |
| `SMTP_USER` | Email server username | - |
| `SMTP_PASS` | Email server password | - |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key | - |
| `CLERK_SECRET_KEY` | Clerk secret key | - |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | - |

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | User logout |
| GET | `/auth/profile` | Get user profile |
| PATCH | `/auth/profile` | Update user profile |
| POST | `/auth/change-password` | Change password |
| POST | `/auth/forgot-password` | Request password reset |
| GET | `/auth/verify-password-reset` | Verify reset token |
| POST | `/auth/reset-password` | Reset password |
| GET | `/auth/verify-email` | Verify email address |

### Request Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/requests` | Get all requests (cached) |
| POST | `/requests` | Create new request |
| GET | `/requests/:id` | Get single request |
| PATCH | `/requests/:id/status` | Update request status |
| DELETE | `/requests/:id` | Delete request |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Get dashboard statistics |
| GET | `/admin/users` | Get all users |
| GET | `/admin/users/:userId` | Get specific user |
| PATCH | `/admin/users/:userId/role` | Change user role |
| PATCH | `/admin/users/:userId/status` | Update user status |
| POST | `/admin/users/:userId/force-logout` | Force user logout |
| DELETE | `/admin/users/:userId` | Soft delete user |
| GET | `/admin/requests` | Get all requests |
| DELETE | `/admin/requests/:requestId` | Delete request |

## Deployment

### CI/CD Pipeline

The application uses GitHub Actions for continuous deployment to AWS ECS:

1. **Build Stage**: Docker images are built for both frontend and backend
2. **Push Stage**: Images are pushed to Amazon ECR
3. **Deploy Stage**: ECS services are updated with new images

### Required GitHub Secrets

- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_ACCOUNT_ID` - AWS account ID

### Terraform Infrastructure

Infrastructure is defined in the `terraform/` directory. To deploy:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## Security

- **Helmet** - Security headers for Express
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - API rate limiting with Redis store
- **Input Validation** - express-validator for request validation
- **Password Hashing** - bcrypt for secure password storage
- **JWT Security** - Short-lived access tokens with refresh token rotation
- **Clerk Integration** - Secure OAuth authentication

## Performance

- **Redis Caching** - 1-hour TTL for request data
- **Cache Invalidation** - Automatic invalidation on write operations
- **Connection Pooling** - Efficient database connections
- **Compression** - Response compression for API endpoints

## License

ISC License

---

<div align="center">
  <p>Built with ❤️ by the Dr.Excel Team</p>
</div>
