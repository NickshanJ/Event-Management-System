// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

import Layout from "./Layout";

import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the token from localStorage after login
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No authentication token.");
      setLoading(false);
      navigate("/"); // Redirect to login
      return;
    }

    // If we do have a token, fetch profile
    axios
      .get("https://event-management-system-0w2o.onrender.com/eventRoute/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.toString()); 
        setLoading(false);

        // If unauthorized or invalid, clear and navigate to login
        if (err.response && (err.response.status === 403 ||
                             err.response.status === 401)) {
          localStorage.removeItem("token");

          navigate("/");
        }
      })
      .finally(() => setLoading(false));

  }, [navigate]);

  return (
    <Layout user={user}>
      {/* Main content divided into two columns */}
      <div className="flex gap-12">
        {/* Left side (Title/Slogan/Text)*/}
        <div className="flex-1">
          {/* Heading/Slogan */}
          <h1 className="text-5xl font-semibold text-orange-500 drop-shadow-md">
            Eventify
          </h1>
          <h2 className="text-2xl mt-4 font-light text-gray-300">
            ‘ Simplify ’ your Events
          </h2>

          {/* Text */}
          <p className="mt-6 max-w-md text-lg font-semibold px-4 text-gray-200">
            Explore the magic of our application{" "}
            <span className="text-orange-500">'EVENTIFY'</span>. A go-to solution
            for managing amazing events effortlessly. From easy sign-ups to
            registering and managing event schedules, our user-friendly platform
            has everything you need for a flawless experience.
          </p>
        </div>

        {/* Right side (Your Booked Events)*/}
        <div className="flex-1">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500 mt-4">Error: {error}</p>
          ) : user && user.bookedEvents.length > 0 ? (
            <div className="bg-gray-900 bg-opacity-80 text-gray-50 p-4 rounded-md shadow-md">
              <h3 className="text-2xl text-orange-500 font-semibold">Your Booked Events</h3>
              <ul className="list-inside font-bold gap-2 list-decimal mt-4">
                {user.bookedEvents.map((item, idx) => (
                    <li key={idx} className="mb-2">
                        {item.name} - {new Date(item.date).toLocaleDateString()} 
                    </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-400 mt-4">No booked events</p>
          )}

        </div>
      </div>
    </Layout>
  );
}