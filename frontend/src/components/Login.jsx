import React, { useState } from "react";
import BG from "../assets/BG.jpg";
import Logo from "../assets/Logo.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  // Local state for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError(null);
      const response = await axios.post("https://event-management-system-0w2o.onrender.com/eventRoute/login-user", {
        username,
        password,
      });

      // Store the JWT in localStorage
      localStorage.setItem("loginStatus", "true");

      localStorage.setItem("token", response.data.token);

      alert("Login successful!");
      // Redirect to Home after login
      navigate("/home");

    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while logging in.");
      console.error(err);
    }
  };

  return (
    <div
      className="flex min-h-screen p-16 text-gray-50"
      style={{ backgroundImage: `url('${BG}')`,
        backgroundSize: "cover",
        backgroundPosition: "center" }}>
      {/* Left side */}
      <div className="flex-1 flex flex-col justify-center items-start p-16">
        {/* Logo in circle */}
        <img
          src={Logo}
          alt="Eventify Logo"
          className="mb-6 w-32 h-32 rounded-full border-4 border-orange-500 p-1 shadow-lg"
        />

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

      {/* Right side (Login form)*/}
      <div className="flex-1 flex flex-col justify-center items-center p-16">
        <form
          onSubmit={handleLogin}
          className="bg-gray-900 bg-opacity-80 p-10 rounded-md shadow-md w-96">
          <h2 className="text-4xl font-semibold text-orange-500 mb-6">Login</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <input
            className="w-full p-3 rounded-md border-none outline-none mb-4 bg-gray-800 text-gray-50"
            type="text"
            placeholder="Enter your Username here"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="w-full p-3 rounded-md border-none outline-none mb-4 bg-gray-800 text-gray-50"
            type="password"
            placeholder="Enter your Password here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="w-full p-3 rounded-md bg-orange-500 hover:bg-orange-600 transition-colors font-semibold shadow-md"
            type="submit">
            Login
          </button>

          <p className="text-gray-400 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-orange-500 font-semibold">
              Signup here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}