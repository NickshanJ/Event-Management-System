import React, { useEffect, useState } from "react";
import axios from "axios";

import Layout from "./Layout";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve the token from localStorage after login
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:5000/eventRoute/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => setError(err.toString()))
        .finally(() => setLoading(false));

    } else {
      setError("No authentication token.");
      setLoading(false);
    }
  }, []);

  return (
    <Layout user={user}>
      {/* Main content for MyProfile */}
      <div className="flex-1 p-16">
        {loading ? (
          <p className="text-gray-50">Loading...</p>
        ) : error ? (
          <p className="text-red-500 mt-4">Error: {error}</p>
        ) : user ? (
          <div className="bg-black/30 p-6 rounded-md shadow-md border border-orange-500 backdrop-blur-md">
            {/* User details */}
            <h1 className="text-4xl font-semibold text-orange-500 mb-4">
              My Profile
            </h1>

            <p className="text-gray-50 mb-2">
              <span className="font-semibold">Username:</span> {user.username}
            </p>

            <p className="text-gray-50 mb-2">
              <span className="font-semibold">Full Name:</span> {user.fullName}
            </p>

            <p className="text-gray-50 mb-2">
              <span className="font-semibold">Email:</span> {user.email}
            </p>

            <p className="text-gray-50 mb-2">
              <span className="font-semibold">Phone Number:</span> {user.phone}
            </p>

            <p className="text-gray-50 mb-2">
              <span className="font-semibold">Role:</span> {user.role}
            </p>

            {/* Booked events */}
            <h2 className="text-3xl font-semibold text-orange-500 mt-6">
              Booked Events
            </h2>

            {user.bookedEvents.length > 0 ? (
              <ul className="list-inside text-white list-decimal mt-4 space-y-4">
                {user.bookedEvents.map((item, idx) => (
                    <li
                      key={idx}
                      className="p-4 rounded-md border border-orange-500 backdrop-blur-md">
                      <h3 className="text-2xl text-orange-500 font-semibold">
                        {item.name}
                      </h3>
                      <p className="text-gray-50 mb-2">
                        <span className="font-semibold">Date:</span> {new Date(item.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-50 mb-2">
                        <span className="font-semibold">Start Time:</span> {item.startTime}
                      </p>
                      <p className="text-gray-50 mb-2">
                        <span className="font-semibold">End Time:</span> {item.endTime}
                      </p>
                      <p className="text-gray-50 mb-2">
                        <span className="font-semibold">Place:</span> {item.place}
                      </p>
                      <p className="text-gray-50 mb-2">
                        <span className="font-semibold">Club:</span> {item.club}
                      </p>
                      <p className="text-gray-50">
                        <span className="font-semibold">Description:</span> {item.description}
                      </p>
                    </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 mt-4">No booked events</p>
            )}

          </div>
        ) : null}
      </div>
    </Layout>
  );
}