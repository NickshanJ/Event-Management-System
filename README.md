# Event Management System (Eventify)

## Description

Eventify is a fully-featured **web application designed to enable users to view, book, and manage events effortlessly**.  
With a recently revamped and modernized user interface, it provides an intuitive experience for users to browse events, manage their bookings, and reach out to the admin team. Administrators have comprehensive control over the events catalog.

## Features

- **Modernized UI:** Reworked user interface offering a stunning, dynamic, and responsive experience.
- **Event Catalog:** View all available events with rich details, including categories and image banners.
- **Booking & Cancellations:** Book events directly and easily cancel bookings if plans change.
- **Dashboard/Profile:** Users can view their profile and efficiently manage their booked events.
- **Contact Form:** Send messages or feedback to the team seamlessly.
- **User Authentication:** Secure login and registration using JWT.
- **Role-Based Authorization:** Secure endpoints differentiating standard users from administrators.
- **Admin Controls:** Admins can effortlessly create, edit, or delete events.
- **Email Notifications:** Integrated email alerts (via NodeMailer) for automatic booking confirmations and contact form submissions.

## Tech Stack

- **Frontend:** React, Vite, React Router DOM, Axios, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Other Packages:** JWT, NodeMailer, CORS, Bcrypt

## Installation & Run

### 1. Clone the repository

```bash
git clone https://github.com/NickshanJ/Event-Management-System.git
cd Event-Management-System
```

### 2. Install dependencies

**For backend:**
```bash
cd backend
npm install
```

**For frontend:**
```bash
cd frontend
npm install
```

### 3. Set up environment variables

Create a `.env` file in the `backend/` directory with your own credentials:

```env
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
SECRET_KEY=<your-jwt-secret>
MY_EMAIL_ADDRESS=<your-gmail-address>
MY_EMAIL_PASSWORD=<your-gmail-app-specific-password>
```

### 4. Run the application

**Start backend:**
```bash
cd backend
npm run dev
# or
npm start
```

**Start frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the application

- **Frontend (Client):** https://event-managementsystem.netlify.app/
- **API (Server):** https://event-management-system-0w2o.onrender.com

## Demo Accounts

**Admin:**
- Username: `admin`
- Password: `admin123`

**User:**
- Username: `Test`
- Password: `123456`

## How to Use

✅ Signup or log in with your credentials.
✅ Browse the newly redesigned events list.
✅ Book an event to receive an automatic email confirmation.
✅ View your profile to check booking details or cancel an existing booking.
✅ Reach out directly through the contact form.
✅ If you log in as an administrator, use the dashboard to add, manage, or delete events (now supporting images and categories).
