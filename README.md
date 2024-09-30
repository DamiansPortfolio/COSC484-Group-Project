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

- **Frontend:** Vite + React
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN
- **Backend:** (To be decided)
- **Database:** (MongoDB)
- **Authentication:** (To be decided)


## 4. Getting Started

### 4.1 Prerequisites

- **Node.js**: v16.x or higher
- **npm**: Comes with Node.js
- **Git**: Latest version for version control

### 4.2 Installation

#### macOS

1.  **Install Node.js and npm**  
   ```bash
   brew install node
   ```
   Alternatively:
   Download the latest stable version of [Node.js](https://nodejs.org/en/) which includes npm.


2. **Clone the repository**  
   Open your terminal and run:
   ```bash
   git clone https://github.com/DamiansPortfolio/COSC484-Group-Project.git
   cd COSC484-Group-Project
   ```
   Or if you are using SSH:
   ```bash
   git clone git@github.com:DamiansPortfolio/COSC484-Group-Project.git
   cd COSC484-Group-Project
   ```

3. **Install dependencies** (important)
   Inside the project directory, install the necessary packages:
   ```bash
   npm install
   ```

4. **Run the development server**  
   Start the development server:
   ```bash
   npm run dev
   ```

   This will open the application at `http://localhost:3000` by default.

#### Windows

1. **Install Node.js and npm**  
   Download and install the latest stable version of Node.js from the [official website](https://nodejs.org/en/).

2. **Clone the repository**  
   Open Git Bash or your preferred terminal and run:
   ```bash
   git clone https://github.com/DamiansPortfolio/COSC484-Group-Project.git
   cd COSC484-Group-Project
   ```

3. **Install dependencies**  
   Inside the project directory, install the necessary packages:
   ```bash
   npm install
   ```

4. **Run the development server**  
   Start the development server:
   ```bash
   npm run dev
   ```

   This will open the application at `http://localhost:3000` by default.

### Useful npm Commands

- `npm run dev` - Starts the development server
- ~~`npm run build` - Builds the project for production~~ (*not implemented*)
- ~~`npm run lint` - Lints the codebase for issues~~ (*not implemented*)


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
