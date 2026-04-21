const express     = require("express");
const userSchema  = require("../model/userSchema");
const eventSchema = require("../model/eventSchema");
const feedbackSchema = require("../model/feedbackSchema");
const eventRoute  = express.Router();
const mongoose    = require("mongoose");
const jwt         = require("jsonwebtoken");
const { auth, isAdmin } = require("../middleware/auth");
const nodemailer  = require("nodemailer");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

// ── USER ──────────────────────────────────────────────────
eventRoute.get("/user-list", auth, isAdmin, async (req, res) => {
  try { res.json(await userSchema.find()); }
  catch (err) { res.status(500).json({ error: err.toString() }); }
});

eventRoute.post("/create-user", async (req, res) => {
  try { res.json(await userSchema.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.toString() }); }
});

eventRoute.post("/login-user", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userSchema.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "6h" });
    res.json({ message: "Login successful!", token });
  } catch (err) { res.status(500).json({ error: err.toString() }); }
});

eventRoute.put("/update-user/:id", auth, isAdmin, async (req, res) => {
  try {
    const updated = await userSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.toString() }); }
});

eventRoute.delete("/delete-user/:id", auth, isAdmin, async (req, res) => {
  try {
    const data = await userSchema.findByIdAndRemove(req.params.id);
    res.json({ message: "User deleted.", data });
  } catch (err) { res.status(500).json({ error: err.toString() }); }
});

// ── EVENTS ────────────────────────────────────────────────
eventRoute.get("/event-list", async (req, res) => {
  try { res.json(await eventSchema.find()); }
  catch (err) { res.status(500).json({ error: err.toString() }); }
});

eventRoute.get("/check-event/:id", async (req, res) => {
  try {
    const data = await eventSchema.findById(mongoose.Types.ObjectId(req.params.id));
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.toString() }); }
});

eventRoute.post("/create-event", auth, isAdmin, async (req, res) => {
  try { res.json(await eventSchema.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.toString() }); }
});

eventRoute.put("/update-event/:id", auth, isAdmin, async (req, res) => {
  try {
    const data = await eventSchema.findByIdAndUpdate(
      mongoose.Types.ObjectId(req.params.id),
      { $set: req.body },
      { new: true }
    );
    res.json({ message: "Event updated.", data });
  } catch (err) { res.status(500).json({ error: err.toString() }); }
});

eventRoute.delete("/delete-event/:id", auth, isAdmin, async (req, res) => {
  try {
    const data = await eventSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id));
    res.json({ message: "Event deleted.", data });
  } catch (err) { res.status(500).json({ error: err.toString() }); }
});

// ── BOOK EVENT ────────────────────────────────────────────
eventRoute.post("/book-event/:id", auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event   = await eventSchema.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.slots <= 0) return res.status(400).json({ error: "No slots available" });

    const user = await userSchema.findById(req.user.id);
    if (user.bookedEvents.some(id => id.toString() === eventId.toString()))
      return res.status(400).json({ error: "Event already booked" });

    event.slots -= 1;
    user.bookedEvents.push(eventId);
    event.registeredUsers.push(user._id);
    await event.save();
    await user.save();

    // Send confirmation email (non-blocking)
    if (user.email) {
      try {
        const t = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.MY_EMAIL_ADDRESS, pass: process.env.MY_EMAIL_PASSWORD },
          tls: { rejectUnauthorized: false },
        });
        await t.sendMail({
          from: process.env.MY_EMAIL_ADDRESS,
          to:   user.email,
          subject: `Booking Confirmed: ${event.name} — Eventify`,
          html: `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#0f0f1a;color:#f1f1f1;border-radius:12px;">
            <h2 style="color:#f97316;margin:0 0 4px;">Eventify</h2>
            <p style="color:#888;font-size:13px;margin:0 0 24px;">Your booking is confirmed</p>
            <h3 style="font-size:22px;margin:0 0 16px;">${event.name}</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;color:#888;">Date</td><td>${new Date(event.date).toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Time</td><td>${event.startTime} – ${event.endTime}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Venue</td><td>${event.place}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Organised by</td><td>${event.club}</td></tr>
            </table>
            <p style="margin-top:24px;color:#888;font-size:12px;">See you there! — Team Eventify</p>
          </div>`,
        });
      } catch (mailErr) { console.error("Email error:", mailErr.message); }
    }

    res.json({ message: "Event successfully booked!", event, user });
  } catch (err) { res.status(500).json({ error: err.toString() }); }
});

// ── CANCEL BOOKING ────────────────────────────────────────
eventRoute.post("/cancel-booking/:id", auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event   = await eventSchema.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const user = await userSchema.findById(req.user.id);
    if (!user.bookedEvents.some(id => id.toString() === eventId.toString()))
      return res.status(400).json({ error: "You have not booked this event" });

    user.bookedEvents      = user.bookedEvents.filter(id => id.toString() !== eventId.toString());
    event.registeredUsers  = event.registeredUsers.filter(id => id.toString() !== user._id.toString());
    event.slots += 1;
    await event.save();
    await user.save();
    res.json({ message: "Booking cancelled successfully." });
  } catch (err) { res.status(500).json({ error: err.toString() }); }
});

// ── PROFILE ───────────────────────────────────────────────
eventRoute.get("/profile", auth, async (req, res) => {
  try {
    const user = await userSchema.findById(req.user.id).populate("bookedEvents");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      _id: user._id, username: user.username, fullName: user.fullName,
      email: user.email, phone: user.phone, role: user.role,
      bookedEvents: user.bookedEvents,
    });
  } catch (err) { res.status(500).json({ error: err.toString() }); }
});

// ── FEEDBACK + CONTACT ────────────────────────────────────
eventRoute.post("/post-feedback", async (req, res) => {
  try { res.json(await feedbackSchema.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.toString() }); }
});

eventRoute.post("/send-mail", async (req, res) => {
  const { fullName, email, message } = req.body;
  if (!fullName || !email || !message)
    return res.status(400).json({ error: "All fields are required" });
  try {
    const t = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MY_EMAIL_ADDRESS, pass: process.env.MY_EMAIL_PASSWORD },
      tls: { rejectUnauthorized: false },
    });
    await t.sendMail({
      from: email,
      to:   process.env.MY_EMAIL_ADDRESS,
      subject: `Message from ${fullName} — Eventify`,
      text: message,
    });
    res.json({ message: "Message successfully sent!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message.", details: error.toString() });
  }
});

module.exports = eventRoute;