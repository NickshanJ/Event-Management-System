const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    fullName: { type: String },
    email: { type: String },
    phone: { type: String },
    password: { type: String },
    role: { type: String, default: "user" },
    bookedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref:'eventSchema' }],
  },
  { collection: "userrecord" }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const hashed = await bcrypt.hash(this.password, SALT_ROUNDS);
      this.password = hashed;
      return next();
    } catch (err) {
      return next(err);
    }
  } else {
    return next();
  }
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (plaintext) {
  return await bcrypt.compare(plaintext, this.password);
};

module.exports = mongoose.model("userSchema", userSchema);