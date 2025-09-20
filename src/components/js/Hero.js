import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../css/Hero.css';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const fetchBanners = async () => {
    try {
      const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
      const response = await fetch('https://cms-dev.seidrtech.ai/api/herosessions?populate=*', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch banners');
      const data = await response.json();

      const banners = [];
      if (data.data && data.data[0]?.attributes) {
        const attributes = data.data[0].attributes;
        if (attributes.banner?.data?.attributes?.url) {
          banners.push(attributes.banner.data.attributes.url);
        }
        if (attributes.banner1?.data?.attributes?.url) {
          banners.push(attributes.banner1.data.attributes.url);
        }
        if (attributes.banner2?.data?.attributes?.url) {
          banners.push(attributes.banner2.data.attributes.url);
        }
      }
      setSlides(banners);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000); 
    return () => clearInterval(interval);
  }, [slides]);


  const isMobile = () => window.innerWidth <= 576;

  return (
    <section className="hero">
      {slides.length > 0 ? (
        <>
          <img
            src={slides[currentSlide]}
            alt="Banner"
            className="hero-background"
            style={{ width: '100%', height: '360px', objectFit: 'fill', display: 'block' }}
          />
          {/* Only show carousel controls if not mobile */}
          {!isMobile() && (
            <div className="carousel-controls">
              <button className="carousel-btn prev-btn" onClick={handlePrev}>
                {/* <FaChevronLeft /> */}
              </button>
              <button className="carousel-btn next-btn" onClick={handleNext}>
                {/* <FaChevronRight /> */}
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Loading banners...</p>
      )}
    </section>
  );
};

export default Hero;
