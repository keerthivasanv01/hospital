import React from 'react';
import Home from '../js/home';
import Navbar from '../sections/Navbar';
import Contact from '../sections/Contact';
import Footer from '../sections/Footer';

const HomeScreen = () => {
  return (
    <div className="home-screen">
      <Navbar />
      <Home />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomeScreen;