import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
// Import the new Event page
import EventPage from "./components/Event";
// Import MyProfile
import MyProfile from "./components/MyProfile";
// Import ContactPage
import ContactPage from "./components/Contact";

function App() {
  // Check for a valid token in localStorage
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* If there’s no token, we’re forced back to login */}
        <Route path="/" element={<Login />} />

        {/* Signup/Register route */}
        <Route path="/register" element={<Register />} />

        {/* Home route after login (protected)*/}
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/" />}
        />

        {/* Events route after login (protected)*/}
        <Route
          path="/events"
          element={token ? <EventPage /> : <Navigate to="/" />}
        />

        {/* MyProfile route after login (protected)*/}
        <Route
          path="/profile"
          element={token ? <MyProfile /> : <Navigate to="/" />}
        />

        {/* Contact route after login (protected)*/}
        <Route
          path="/contact"
          element={token ? <ContactPage /> : <Navigate to="/" />}
        />

      </Routes>
    </Router>
  );
}

export default App;