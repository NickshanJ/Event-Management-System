# Event Management System

## Description

Event Management System is a **web application designed to enable users to view, book, and manage events effortlessly**.  
It includes a profile section where users can view their booked events, a list of available events, and a contact form for sending messages directly to the team.

## Features

- View all available events
- Book events and view them under your profile
- Contact form for sending messages to the team
- User authentication with JWT
- Role-based authorization (admin/user)
- An admin can add, update, or delete events
- User can view their profile with their booked events
- Integrated email notifications for messages (using NodeMailer)

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Other Packages:** JWT, NodeMailer, CORS, Bcrypt

## Installation & Run

### 1. Clone the repository:

```bash
git clone https://github.com/NickshanJ/Event-Management-System.git
cd event-management-system

### 2. Install dependencies:
For backend:

```bash
cd backend
npm install

For frontend:
```bash
cd frontend
npm install

### 3. Set up environment variables:
Create a .env file in backend/ with your own credentials:

PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
SECRET_KEY=<your-jwt-secret>
MY_EMAIL_ADDRESS=<your-gmail-address>
MY_EMAIL_PASSWORD=<your-gmail-app-specific-password>

### 4. Run the application:
Start backend first:

```bash
cd backend
npm run dev
# or
npm start

Then start frontend:

```bash
cd frontend
npm run dev

### 5. Access the application:
Frontend (Client): https://event-managementsystem.netlify.app/

API (Server): https://event-management-system-0w2o.onrender.com


## Demo Accounts (Fill in with your own)
# Admin:

Username: admin
Password: admin123

# User:

Username: Test
Password: 123456

### How to Use
✅ Signup or login with your account.
✅ View a list of events.
✅ Book the event you wish to attend.
✅ View your profile to see your booking details.
✅ Contact us directly through the contact form.
✅ If you’re an admin, you can add, delete, or modify events.
