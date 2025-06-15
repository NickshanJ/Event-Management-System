import React, { useState } from "react";
import axios from "axios";

import Layout from "./Layout";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);

  // Retrieve the token to show the user's info in Layout
  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("https://event-management-system-0w2o.onrender.com/eventRoute/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => console.error(err.toString()));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setError("All fields are required.");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await axios.post("https://event-management-system-0w2o.onrender.com/eventRoute/send-mail", {
        fullName,
        email,
        message,
      });
      setSuccess("Message successfully sent!");
      setFullName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user}>
      {/* Contact form */}
      <div className="flex-1 px-16 py-8 flex items-center justify-center">
        <div className="bg-gray-900 bg-opacity-80 p-6 rounded-md shadow-md max-w-md w-full">
          <h1 className="text-4xl mb-4 font-semibold text-orange-500 drop-shadow-md">
            Contact Us
          </h1>

          {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}
          {success && (
            <p className="text-green-500 font-semibold mb-4">{success}</p>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-md border-none outline-none mb-4 bg-gray-800 text-gray-50"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md border-none outline-none mb-4 bg-gray-800 text-gray-50"
              required
            />

            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-md border-none outline-none mb-4 bg-gray-800 text-gray-50"
              rows="5"
              required
            ></textarea>

            <button
              disabled={loading}
              className="w-full p-3 font-bold rounded-md bg-orange-500 hover:bg-orange-600 transition-colors shadow-md disabled:bg-gray-500 disabled:cursor-wait"
            >
              {loading ? "Sending…" : "Send"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
