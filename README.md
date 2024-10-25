# Creative Project Commissioning Platform

This is a web application designed to connect creative professionals in the game development and animation industries with project owners seeking talent. The platform facilitates job postings, portfolio showcases, and a seamless application process, making it easier for requesters and artists to collaborate on creative projects.

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Core Features](#2-core-features)
3. [Tech Stack](#3-tech-stack)
4. [Getting Started](#4-getting-started)
   - [Prerequisites](#41-prerequisites)
   - [Installation](#42-installation)
5. [Implementation Checklist](#5-implementation-checklist)
   - [Front-End Work](#front-end-work)
   - [Back-End Work](#back-end-work)
6. [License](#6-license)



## 1. Project Overview

The platform allows requesters to post creative project listings and artists to apply for those opportunities. Artists can showcase their portfolios, and both parties can communicate via an integrated messaging system. The platform also includes review and rating features to promote transparency.


## 2. Core Features

### 2.1 User Accounts
- Role-based logins: Requester or Artist
- Profiles with customizable information such as skills and contact details

### 2.2 Job Board
- Requesters can post job listings with tags
- Artists can filter and search listings by role or tags

### 2.3 Artist Portfolios
- Profile creation with image samples or external portfolio links
- Showcase skills and previous work

### 2.4 Application Process
- Artists can apply for jobs, and requesters can manage applications
- Requesters can accept or deny applications
- Artists can track the status of their applications

### 2.5 Review and Rating System
- Both requesters and artists can review each other post-project
- Ratings and written reviews help future users make informed decisions

### 2.6 Messaging System
- Private messaging between requesters and artists for project discussions

### 2.7 Notifications
- Email notifications for important events like new applications or messages

### 2.8 Payment Tracking (Future Feature)
- Simple tracking system to mark payments (no actual transactions)


## 3. Tech Stack

***Current Implementation:***

**Frontend**
   - Framework: Vite + React (Fast development and build tool for modern web projects)
   - Styling: Tailwind CSS (Utility-first CSS framework for rapid UI development)
   - UI Components: shadcn/ui (Pre-built, customizable React components)
   
**Backend**
   - Server Framework: Express.js (Minimal and flexible Node.js web application framework)
   - Runtime Environment: Node.js (JavaScript runtime for server-side development)
   - Database: MongoDB (NoSQL database for storing and managing data)
   - Version Control Repository Hosting: Git + GitHub (Version control system for collaboration and code management)

***Future Implementation***
   - API Handling: Axios (Promise-based HTTP client for making requests to the backend)
   - User Authentication: JWT (JSON Web Tokens) (For secure user authentication and authorization) 
   - Deployment: Hosting Platform: AWS (Amazon Web Services) (Scalable cloud computing services)
   - File Storage: AWS S3 (Secure and scalable cloud storage for media, documents, etc.) 
   - Email Services Options Under Consideration: SendGrid or Nodemailer (For handling email notifications such as user registration, password resets, etc.)
   - State Management: Global State Management: Redux (Centralized state container for JavaScript apps)

## 4. Getting Started

### 4.1 Prerequisites

Before setting up the project, ensure the following prerequisites are installed:

- **Node.js**: v16.x or higher  
   - [Install Node.js](https://nodejs.org/en/) if not already installed (comes with npm).
- **npm**: Comes with Node.js. Make sure you are using a recent version.
  You can run the following command in your terminal window to check the version of npm
  ```bash
  npm --version
  ```
- **Git**: Latest version for version control  
   - [Install Git](https://git-scm.com/downloads) if not already installed.
     
- **MongoDB**: Install MongoDB Community Edition for local development  
   - [Install MongoDB](https://docs.mongodb.com/manual/installation/) based on your operating system.
     
Additional tools that may improve your development experience:
- **VS Code**: Recommended code editor  
   - [Download VS Code](https://code.visualstudio.com/)

## 4.2 Installation

Follow these steps to set up the project on your local machine:

1. **Install Node.js and npm**  
   Use Homebrew to install Node.js:
   ```bash
   brew install node
   ```
   Alternatively, download the latest stable version from the [Node.js official website](https://nodejs.org/en/).
2. **Install MongoDB**  
   Use npm to install MongoDB from the root folder of the project:
   ```
   npm install mongodb
   ```
3. **Clone The Repository**
   Beofore running this command, make sure to change your directory to the folder you want the project to be cloned to.
   For example, /Users/user/Desktop/project-folder
   ```bash
   git clone https://github.com/DamiansPortfolio/COSC484-Group-Project.git
   cd COSC484-Group-Project
   ```
4. **Configure .env variables
   **THIS STEP IS CRUTIAL TO GET THE PROJECT UP AND RUNNING ON YOUR LOCAL MACHINE**
   Create a .env file in the root directory based on the provided .env.example. Update the variables as necessary.
   Example path: ```/COSC-484/group-project-main-folder/```
   You can see your current path with this command:
   ```bash
   pwd
   ```
   After you make sure youre in the project root folder, you can create a new file called .env (exactly as typed here).
   If you want to run this command on mac you can run the following command:
   ```bash
   touch .env
   ```
5. **Install dependencies**
   In the project root directory make sure to install all dependencies via
   ```bash
   npm install
   ```
   or
   ```bash
   npm ci
   ```
   Subsequently you must also do this inside of the frontend and backend folders.

6. **Starting the project**
   **REMEMBER TO OPEN TWO TERMINAL WINDOWS FOR EACH FRONTEND AND BACKEND**
   
   Start the frontend client
   **IMPORTANT**: Navigate to the /frontend folder:
   ```bash
   npm run dev
   ```

   Start the backend server
   **IMPORTANT**: Navigate to the /backend folder:
   ```bash
   npm run start
   ```
**IF EVERYTHING IS WORKING AS EXPECTED THIS IS THE OUTPUT YOU SHOULD SEE IN YOUR TERMINAL WINDOWS**
**Frontend Terminal Window**
```bash

> cosc484-group-project@0.0.0 dev
> vite

  VITE v5.4.7  ready in 537 ms

  ➜  Local:   http://localhost:(ip_address_goes_here)/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
**Backend Terminal Window**
```bash

> backend@1.0.0 start
> node server.js

Server running on port (port_number_here)
Connected to MongoDB at (timestamp)
```

## 5. Implementation Checklist

The following checklist tracks the progress of front-end and back-end work.

### Front-End Work

- [x] Set up Vite + React
- [x] Integrate Tailwind CSS for styling
- [x] Integrate ShadCN for UI components
- [ ] Build user account registration and login (Requester/Artist roles)
- [ ] Design user profiles with customizable fields (skills, contact info)
- [ ] Implement the Job Board UI with filtering options
- [x] Create portfolio showcase pages for artists 
      ^ Still needs work
- [ ] Implement application tracking UI for artists
- [ ] Add a review and rating system UI
- [ ] Implement private messaging system UI

### Back-End Work

- [ ] Set up database for users, job listings, and applications
- [ ] Implement user authentication and role-based access
- [ ] Develop job posting and filtering logic
- [ ] Create an application management system for requesters
- [ ] Implement a review and rating system with proper storage
- [ ] Set up email notifications for events like new applications or messages
- [ ] Build payment tracking


## 6. License

This project is licensed under the MIT License.
