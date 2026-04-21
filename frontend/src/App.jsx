import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login      from "./components/Login";
import Register   from "./components/Register";
import Home       from "./components/Home";
import EventPage  from "./components/Event";
import MyProfile  from "./components/MyProfile";
import ContactPage from "./components/Contact";

function App() {
  const token = localStorage.getItem("token");
  return (
    <Router>
      <Routes>
        <Route path="/"         element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home"     element={token ? <Home />        : <Navigate to="/" />} />
        <Route path="/events"   element={token ? <EventPage />   : <Navigate to="/" />} />
        <Route path="/profile"  element={token ? <MyProfile />   : <Navigate to="/" />} />
        <Route path="/contact"  element={token ? <ContactPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
export default App;