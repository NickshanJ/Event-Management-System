// src/components/Event.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

import Layout from "./Layout";

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Handle booking event
  const handleBookEvent = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No authentication token.");
        return;
      }

      await axios.post(
        `http://localhost:5000/eventRoute/book-event/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Event successfully booked!");
    } catch (err) {
      console.error(err);
      alert("Error booking event.");
    }
  };

  // Handle adding event (admin)
  const handleAddEvent = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No authentication token.");
        return;
      }

      await axios.post(
        "http://localhost:5000/eventRoute/create-event",
        newEvent,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Event successfully added!");
      setNewEvent({}); // Reset form
      setAddEventVisible(false);
      // Reload events after adding
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Error adding event.");
    }
  };

  // Local state for adding event
  const [addEventVisible, setAddEventVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    place: "",
    club: "",
    description: "",
    slots: 0,
    registeredUsers: [],
  });

  // Update form fields
  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Reload events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/eventRoute/event-list"
      );

      setEvents(res.data);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Retrieve the token from localStorage after login
    const token = localStorage.getItem("token");

    if (token) {
      // Get User first (for profile info)
      axios
        .get("http://localhost:5000/eventRoute/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => setError(err.toString()))
        .finally(() => setLoading(false));

      // Then fetch all events
      fetchEvents();
    } else {
      setError("No authentication token.");
      setLoading(false);
    }
  }, []);

  return (
    <Layout user={user}>
      {/* Main content with events */}
      <div className="flex-1 p-16 flex flex-col items-center justify-start">
        {loading ? (
          <p className="text-gray-50">Loading...</p>
        ) : error ? (
          <p className="text-red-500 mt-4">Error: {error}</p>
        ) : (
          <>
            {/* Add event button (admin) */}
            {user && user.role === "admin" && (
              <button
                onClick={() => setAddEventVisible(true)}
                className="bg-orange-500 hover:bg-orange-600 transition px-4 py-2 font-semibold rounded-md shadow-md mb-6"
              >
                Add Event
              </button>
            )}

            {/* Add event form (admin) */}
            {addEventVisible && (
              <form
                onSubmit={handleAddEvent}
                className="bg-gray-900 p-4 rounded-md shadow-md space-y-4 mb-6 w-full max-w-lg"
              >
                <h2 className="text-2xl font-semibold text-orange-500">
                  Add a new event
                </h2>

                <input
                  className="w-full p-3 rounded-md border-none outline-none bg-gray-800 text-gray-50"
                  type="text"
                  name="name"
                  placeholder="Event Name"
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full p-3 rounded-md border-none outline-none bg-gray-800 text-gray-50"
                  type="date"
                  name="date"
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full p-3 rounded-md border-none outline-none bg-gray-800 text-gray-50"
                  type="text"
                  name="startTime"
                  placeholder="Start Time"
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full p-3 rounded-md border-none outline-none bg-gray-800 text-gray-50"
                  type="text"
                  name="endTime"
                  placeholder="End Time"
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full p-3 rounded-md border-none outline-none bg-gray-800 text-gray-50"
                  type="text"
                  name="place"
                  placeholder="Place"
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full p-3 rounded-md border-none outline-none bg-gray-800 text-gray-50"
                  type="text"
                  name="club"
                  placeholder="Club"
                  onChange={handleChange}
                  required
                />
                <textarea
                  className="w-full p-3 rounded-md border-none outline-none bg-gray-800 text-gray-50"
                  name="description"
                  placeholder="Description"
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full p-3 rounded-md border-none outline-none bg-gray-800 text-gray-50"
                  type="number"
                  name="slots"
                  placeholder="Slots"
                  onChange={handleChange}
                  required
                />

                <button className="bg-orange-500 hover:bg-orange-600 transition px-4 py-2 font-semibold rounded-md shadow-md">
                  Submit
                </button>
              </form>
            )}

            {/* List of events */}
            <ul className="w-full max-w-3xl space-y-6">
              {events.map((item, idx) => (
                <li
                  key={idx}
                  className="p-6 rounded-md border border-orange-500 backdrop-blur-md bg-black/30 transition transform hover:scale-105 hover:bg-black/50"
                >
                  <h3 className="text-3xl font-semibold text-orange-500 mb-4">
                    {item.name}
                  </h3>
                  <p className="text-gray-50 mb-2">
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-50 mb-2">
                    <span className="font-semibold">Start Time:</span>{" "}
                    {item.startTime}
                  </p>
                  <p className="text-gray-50 mb-2">
                    <span className="font-semibold">End Time:</span>{" "}
                    {item.endTime}
                  </p>
                  <p className="text-gray-50 mb-2">
                    <span className="font-semibold">Place:</span> {item.place}
                  </p>
                  <p className="text-gray-50 mb-2">
                    <span className="font-semibold">Club:</span> {item.club}
                  </p>
                  <p className="text-gray-50">
                    <span className="font-semibold">Description:</span>{" "}
                    {item.description}
                  </p>

                  <button
                    onClick={() => handleBookEvent(item._id)}
                    className="bg-orange-500 hover:bg-orange-600 transition px-4 py-2 mt-4 font-semibold rounded-md shadow-md"
                  >
                    Book
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Layout>
  );
}
