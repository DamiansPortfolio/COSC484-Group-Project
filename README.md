# Palette

A web application designed to connect creative professionals in the game development and animation industries with project owners seeking talent. The platform facilitates job postings, portfolio showcases, and a seamless application process.

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Core Features](#2-core-features)
3. [Tech Stack](#3-tech-stack)
4. [Getting Started](#4-getting-started)
5. [Implementation Status](#5-implementation-status)

## 1. Project Overview

Palette is a platform that connects creative professionals in the game development and animation industries with project owners, known as requesters, seeking talent for their creative projects. The platform allows requesters to create detailed job listings that outline the requirements and scope of their projects, including desired skills, deadlines, and budget. Artists can browse these listings, apply for opportunities, and showcase their portfolios to demonstrate their expertise. Palette streamlines the application process by enabling seamless submission of portfolios, tracking application statuses, and facilitating direct communication between artists and requesters. This efficient workflow fosters collaboration and helps artists and requesters find the perfect match for their creative needs.


## 2. Core Features

### 2.1 Artist Features

- Portfolio management with image uploads (future release)
- Skill showcase
- Application tracking
- Custom profile pages

### 2.3 Requester Features

- Job posting management
- Applicant review system
- Project status tracking
- Profile customization

### 2.4 User Features

- Messaging system to connect users


## 3. Tech Stack

### Frontend

- React (Vite)
- Redux + Redux Toolkit
- React Router DOM
- Tailwind CSS
- shadcn/ui Components

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt Password Hashing

### Testing
- Playwright test suite

### Development Tools

- Concurrently (Running multiple scripts)
- ESLint
- Nodemon

## 4. Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm (latest version)
- Git
- MongoDB (latest version)

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/DamiansPortfolio/COSC484-Group-Project.git
```

2. **Install Dependencies**

```bash
# Install all dependencies (frontend, backend, and root)
npm run install:all
```

3. **Create .env file in frontend and backend directories**

```bash
touch .env
```

**Backend .env file**
```
# For local testing uncomment this
NODE_ENV="local"

# Common settings
FRONTEND_URL= (Your frontend local host connection here)
MONGODB_URI= (Your mongodb connection URI here)
JWT_SECRET= (Your JWT secret here)
REFRESH_TOKEN_SECRET= (Your refresh token secret here)
PORT= (Your backend port here)
```

**Frontend .env file**
```
# For local testing uncomment this
VITE_API_URL= (Local host port of your choosing)

# Encryption key
VITE_ENCRYPTION_KEY= (Your encryption key here)
```

4. **Start development servers from project root directory**

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them separately:
npm run start:frontend  # For frontend only
npm run start:backend   # For backend only
```

## 5. Implementation Status

### Completed Features

- [x] Project setup and configuration
- [x] Redux integration
- [x] User authentication system
- [x] Basic user management
- [x] Portfolio system structure
- [x] Frontend routing
- [x] Basic API integration
- [x] Database models and schemas
- [x] User messaging system
- [x] Job posting system
- [x] Application management

### In Progress

- [ ] Reviews - Complete review and rating system
- [ ] Payment Tracking - Project payment status monitoring
- [ ] Leave Reviews - Complete review and rating system
- [ ] Review and rating system
- [ ] Advanced search and filtering
- [ ] Email notifications

### Core Implementation Details

#### Frontend Architecture

- **State Management**: Implemented using Redux with Redux Toolkit
- **Routing**: React Router DOM v6 with protected routes
- **Styling**: Tailwind CSS with shadcn/ui components
- **API Integration**: Fetch API with custom hooks for data fetching

#### Backend Architecture

- **API Design**: RESTful API architecture
- **Authentication**: JWT-based authentication with secure cookie storage
- **Database**: MongoDB with Mongoose ODM
- **Security**: Password hashing with bcrypt, CORS configuration
- **Security**: Encryption using crypto-js to encrypt user data

## License

This project is licensed under the MIT License.
