# Creative Project Commissioning Platform

A web application designed to connect creative professionals in the game development and animation industries with project owners seeking talent. The platform facilitates job postings, portfolio showcases, and a seamless application process.

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Core Features](#2-core-features)
3. [Tech Stack](#3-tech-stack)
4. [Getting Started](#4-getting-started)
5. [Implementation Status](#5-implementation-status)

## 1. Project Overview

The platform enables requesters to post creative project listings and artists to apply for opportunities. It features comprehensive user authentication, portfolio management, and a Redux-powered state management system.

## 2. Core Features

### 2.1 User Management

- Role-based authentication (Requester/Artist)
- JWT-based secure sessions
- Customizable user profiles
- Password encryption with bcrypt

### 2.2 Artist Features

- Portfolio management with image uploads
- Skill showcase
- Application tracking
- Custom profile pages

### 2.3 Requester Features

- Job posting management
- Applicant review system
- Project status tracking
- Profile customization

### 2.4 Platform Features

- Redux-powered state management
- Secure authentication flow
- Responsive UI with Tailwind CSS
- Real-time form validation

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

3. **Create .env file in project root directory**

```bash
touch .env
```

**Verify .env file with team**

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

### In Progress

- [ ] Job posting system
- [ ] Application management
- [ ] Review and rating system
- [ ] Messaging system
- [ ] Advanced search and filtering
- [ ] Email notifications

### Project Structure

root/
├── frontend/
│ ├── src/
│ │ ├── assets/
│ │ │ └── commission.svg
│ │ ├── components/
│ │ │ ├── artist_profile/
│ │ │ │ ├── PortfolioGallery.jsx
│ │ │ │ ├── ProfileHeader.jsx
│ │ │ │ ├── ReviewsSection.jsx
│ │ │ │ └── SkillsList.jsx
│ │ │ ├── dashboard/
│ │ │ │ ├── QuickStats.jsx
│ │ │ │ ├── RecentActivity.jsx
│ │ │ │ └── Recommendations.jsx
│ │ │ └── ui/
│ │ ├── lib/
│ │ │ └── utils.ts
│ │ ├── pages/
│ │ │ ├── ArtistProfile.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ └── UserCreationPage.jsx
│ │ ├── redux/
│ │ │ ├── actions/
│ │ │ │ └── userActions.js
│ │ │ ├── constants/
│ │ │ │ └── userConstants.js
│ │ │ ├── reducers/
│ │ │ │ ├── index.js
│ │ │ │ └── userReducer.js
│ │ │ └── store.js
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── index.html
├── backend/
│ ├── controllers/
│ │ ├── artistProfileController.js
│ │ ├── jobsController.js
│ │ ├── requesterProfileController.js
│ │ └── userController.js
│ ├── models/
│ │ ├── ArtistSchema.js
│ │ ├── JobsSchema.js
│ │ ├── RequesterSchema.js
│ │ └── User.js
│ ├── routes/
│ │ ├── artistRoutes.js
│ │ ├── jobsRoutes.js
│ │ ├── requesterRoutes.js
│ │ └── userRoutes.js
│ ├── config.js
│ ├── db.js
│ └── server.js
├── .env
└── package.json

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

#### Database Models

- **User Model**: Base user information and authentication
- **Artist Profile**: Portfolio and skill management
- **Requester Profile**: Job posting and management
- **Job Listings**: Project details and applications

### Next Steps

1. Complete the job posting system implementation
2. Integrate the application management flow
3. Implement the review and rating system
4. Set up the messaging system
5. Add advanced search and filtering capabilities
6. Configure email notification system

## License

This project is licensed under the MIT License.
