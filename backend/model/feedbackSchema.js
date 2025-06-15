const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({ 
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  slots: { 
    type: Number, 
    default: 0 
  },
  // List of users who have booked this event
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
});

// Export the model under the name "Event"
// This lets you reuse or avoid overwrite errors
module.exports = mongoose.models.Event ||
  mongoose.model("Event", eventSchema);