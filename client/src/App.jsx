import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import Profile from "./pages/Profile/Profile";
import Appointment from "./pages/Appointment/Appointment";
import Contact from "./pages/Contact/Contact";
import Doctors from "./pages/Doctors/Doctors";
import Login from "./pages/Login/Login";
import MyAppointment from "./pages/MyAppointment/MyAppointment";
import About from "./pages/About/About";
import ScrollToTop from "./components/ui/ScrollToTop";
import toast, { Toaster } from 'react-hot-toast';
import Home from "./pages/Home/Home";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ScrollToTop />
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-appointments" element={<MyAppointment />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;