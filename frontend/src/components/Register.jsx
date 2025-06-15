import React, { useState } from "react";
import { Link } from "react-router-dom";

import BG from "../assets/BG.jpg";
import Logo from "../assets/Logo.jpg";

export default function Register() {
  // Local state for form inputs
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setError(null);
      setSuccess(null);
      const response = await fetch(
        "http://localhost:5000/eventRoute/create-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, fullName, email, phone, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful!");
        setUsername("");
        setFullName("");
        setEmail("");
        setPhone("");
        setPassword("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred while registering.");
      console.error(err);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        backgroundImage: `url('${BG}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Register Form */}
      <form
        onSubmit={handleRegister}
        className="bg-gray-900 bg-opacity-80 p-10 rounded-md shadow-md w-96"
      >
        <h2 className="text-4xl font-semibold text-orange-500 mb-6">
          Register
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

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
          type="text"
          placeholder="Enter your Full Name here"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          className="w-full p-3 rounded-md border-none outline-none mb-4 bg-gray-800 text-gray-50"
          type="email"
          placeholder="Enter your Email here"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full p-3 rounded-md border-none outline-none mb-4 bg-gray-800 text-gray-50"
          type="text"
          placeholder="Enter your Phone Number here"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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

        <button className="w-full p-3 rounded-md bg-orange-500 hover:bg-orange-600 transition-colors font-semibold">
          Register
        </button>

        <p className="text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-orange-500 font-semibold">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
