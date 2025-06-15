const express = require("express");
const userSchema = require("../model/userSchema");
const eventSchema = require("../model/eventSchema");
const feedbackSchema = require("../model/feedbackSchema");
const eventRoute = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth, isAdmin } = require("../middleware/auth");
const nodemailer = require("nodemailer");

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

// ----------------------------------------------------------------------------
// User
// Get all users (admin only)
eventRoute.get("/user-list", auth, isAdmin, (req, res) => {
  userSchema.find((err, data) => {
    if (err) return res.status(500).json({ error: err.toString() });
    res.json(data);
  });
});

// Signup or create-user
eventRoute.post("/create-user", async (req, res) => {
  try {
    // password will be hashed by the pre-save middleware
    const newUser = await userSchema.create(req.body);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Login (with password comparison)
eventRoute.post('/login-user', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userSchema.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    // Generate a JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful!", token });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Update User (admin)
eventRoute.route("/update-user/:id")
  .get(auth, isAdmin, (req, res) => {
    userSchema.findById(req.params.id, (err, data) => {
      if (err) return res.status(500).json({ error: err.toString() });
      res.json(data);
    });
  })
  .put(auth, isAdmin, async (req, res) => {
    try {
      // If password is present, it will be hashed by the schema
      const updated = await userSchema.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  });

// Delete User (admin)
eventRoute.delete("/delete-user/:id", auth, isAdmin, (req, res) => {
  userSchema.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) return res.status(500).json({ error: err.toString() });
    res.json({ message: "User deleted.", data });
  });
});

// ----------------------------------------------------------------------------
// Events
// Get all events
eventRoute.get("/event-list", (req, res) => {
  eventSchema.find((err, data) => {
    if (err) return res.status(500).json({ error: err.toString() });
    res.json(data);
  });
});

// Get event by id
eventRoute.route("/check-event/:id")
  .get((req, res) => {
    eventSchema.findById(mongoose.Types.ObjectId(req.params.id), (err, data) => {
      if (err) return res.status(500).json({ error: err.toString() });
      res.json(data);
    });
  });

 // Create event (admin)
eventRoute.post("/create-event", auth, isAdmin, (req, res) => {
  eventSchema.create(req.body, (err, data) => {
    if (err) return res.status(500).json({ error: err.toString() });
    res.json(data);
  });
});

// Update event (admin)
eventRoute.route("/update-event/:id")
  .get((req, res) => {
    eventSchema.findById(mongoose.Types.ObjectId(req.params.id), (err, data) => {
      if (err) return res.status(500).json({ error: err.toString() });
      res.json(data);
    });
  })
  .put(auth, isAdmin, (req, res) => {
    eventSchema.findByIdAndUpdate(
      mongoose.Types.ObjectId(req.params.id),
      { $set: req.body },
      (err, data) => {
        if (err) return res.status(500).json({ error: err.toString() });
        res.json({ message: "Event updated.", data });
      }
    );
  });

// Delete event (admin)
eventRoute.delete("/delete-event/:id", auth, isAdmin, (req, res) => {
  eventSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) return res.status(500).json({ error: err.toString() });
    res.json({ message: "Event deleted.", data });
  });
});

// ----------------------------------------------------------------------------
// Feedback
eventRoute.post("/post-feedback", (req, res) => {
  feedbackSchema.create(req.body, (err, data) => {
    if (err) return res.status(500).json({ error: err.toString() });
    res.json(data);
  });
});

// ----------------------------------------------------------------------------
// Book event (user)
eventRoute.post('/book-event/:id', auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await eventSchema.findById(eventId);
    if (!event) {
      return res.status(404).json({error:'Event not found'})
    }

    // Check if slots are available
    if (event.slots <= 0) {
      return res.status(400).json({error:'No slots available'})
    }

    // Check if the user already booked this event
    const user = await userSchema.findById(req.user.id);
    if (user.bookedEvents.some(id => id.toString() === eventId.toString()) ) {
      return res.status(400).json({error:'Event already booked'})
    }

    // Decrement event slots
    event.slots -= 1;

    // Push eventId into user's booked events
    user.bookedEvents.push(eventId);

    // Push user's id into event's registeredUsers
    event.registeredUsers.push(user._id);

    // Save both
    await event.save();
    await user.save();

    res.json({ message:'Event successfully booked!', event, user });

  } catch (err) {
    res.status(500).json({error:err.toString()});
  }
});

// ----------------------------------------------------------------------------
// User Profile (with Booked Events)

eventRoute.get('/profile', auth, async (req, res) => {
  try {
    // Find the user by their ID (attached by auth middleware)
    // and populate their booked events
    const user = await userSchema.findById(req.user.id).populate('bookedEvents');    

    if (!user) {
      return res.status(404).json({error:'User not found'})
    }

    res.json({ 
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      bookedEvents: user.bookedEvents // This will include the event details
    });
  } catch (err) {
    res.status(500).json({error:err.toString()});
  }
});

// ----------------------------------------------------------------------------
// Contact form submission (send email)

eventRoute.post('/send-mail', async (req, res) => {
  const { fullName, email, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create transporter
    let transporter = nodemailer.createTransport({ 
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL_ADDRESS,
        pass: process.env.MY_EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // <- ADDING THIS
      },
    });

    // Send email
    await transporter.sendMail({ 
      from: email,
      to: process.env.MY_EMAIL_ADDRESS,
      subject: `Message from ${fullName} from Eventify`,
      text: message,
    });

    res.json({ message: "Message successfully sent!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message.", details: error.toString() });
  }
});

module.exports = eventRoute;