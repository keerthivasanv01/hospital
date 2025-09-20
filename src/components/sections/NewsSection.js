import React from 'react';
import { FaEye, FaHeart } from 'react-icons/fa';

// Image paths - these should be in your public/images directory
import news1 from '../../assets/news1.png';
import news2 from '../../assets/doctor1.png';
import news3 from '../../assets/doctor2.png';
// import news4 from '../../assets/doctor3.png';

const NewsSection = () => {
  return (
    <div className="news-section">
      <span className="news-subtitle">BETTER INFORMATION, BETTER HEALTH</span>
      <h2 className="news-title">News</h2>
      
      <div className="news-grid">
        <div className="news-card">
          <img src={news1} alt="News" className="news-image" />
          <div className="news-info">
            
            <h3 className="news-headline">This Article's Title goes Here, but not too long.</h3>
            <div className="news-stats">
              <span><FaEye /> 68</span>
              <span><FaHeart /> 86</span>
            </div>
          </div>
        </div>

        <div className="news-card">
          <img src={news2} alt="News" className="news-image" />
          <div className="news-info">
            <h3 className="news-headline">This Article's Title goes Here, but not too long.</h3>
            <div className="news-stats">
              <span><FaEye /> 68</span>
              <span><FaHeart /> 86</span>
            </div>
          </div>
        </div>

        <div className="news-card">
          <img src={news3} alt="News" className="news-image" />
          <div className="news-info">
            <h3 className="news-headline">This Article's Title goes Here, but not too long.</h3>
            <div className="news-stats">
              <span><FaEye /> 68</span>
              <span><FaHeart /> 86</span>
            </div>
          </div>
        </div>

        <div className="news-card">
          <img src={news1} alt="News" className="news-image" />
          <div className="news-info">
            <h3 className="news-headline">This Article's Title goes Here, but not too long.</h3>
            <div className="news-stats">
              <span><FaEye /> 68</span>
              <span><FaHeart /> 86</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dots">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default NewsSection;
