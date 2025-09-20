import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/screens/homescreen';
import AboutScreen from './components/screens/aboutscreen';
import Services from './components/screens/services';
import Doctors from './components/screens/doctors';
import News from './components/screens/news';
import Contact from './components/screens/contact';
import Appointment from './components/screens/appointment';
import HospitalLogin from './components/screens/HospitalLogin';
import Dashboard from './components/screens/Dashboard';
import UserDashboard from './components/screens/UserDashboard';
import './App.css';
import './index.css';

function App() {
  const [lang, setLang] = useState('en');
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ka', label: 'Kannada' },
    { code: 'ta', label: 'Tamil' },
  ];

  return (
    <Router>
      <div className="font-sans">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/about" element={<AboutScreen />} />
          <Route path="/services" element={<Services />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/hospital-login" element={<HospitalLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
