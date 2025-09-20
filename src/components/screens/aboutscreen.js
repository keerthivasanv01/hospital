import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; 
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import '../css/AboutScreen.css';
import '../css/Hero.css';
import '../css/home.css';
import {  FaEye, FaHeart ,FaCheck } from 'react-icons/fa';
import doctorImage1 from '../../assets/doctor1.png';
import DoctorsSection from '../sections/DoctorsSection'; // Import DoctorsSection
import Contact from '../sections/Contact';

const AboutScreen = () => {
  const { t } = useTranslation(); 
  const [selectedDoctor, setSelectedDoctor] = useState(null); 
  const [contacts, setContacts] = useState({});
  const [news, setNews] = useState([]); 
  const [aboutData, setAboutData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]); 

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/contacts1?populate=*', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch contacts');
        const data = await response.json();
        setContacts(data.data[0]?.attributes || {});
      } catch (err) {
        console.error('Error fetching contacts:', err);
      }
    };

    const fetchNews = async () => {
      setLoading(true);
      setError('');
      try {
        const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/news11?populate=*', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNews(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError('Error loading news.');
      }
      setLoading(false);
    };

    const fetchAboutData = async () => {
      try {
        const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/aboutuspages?populate=*', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch about data');
        const data = await response.json();
        setAboutData(data.data[0]?.attributes || null);
      } catch (err) {
        console.error('Error fetching about data:', err);
      }
    };

    fetchContacts();
    fetchNews();
    fetchAboutData();
  }, 
  
  []);

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const closePopup = () => {
    setSelectedDoctor(null);
  };
   useEffect(() => {
      const fetchDoctors = async () => {
        setLoading(true);
        setError('');
        try {
          const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
          const response = await fetch('https://cms-dev.seidrtech.ai/api/doctor-listings?populate=*', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error('Failed to fetch doctors');
          const data = await response.json();
          setDoctors(Array.isArray(data.data) ? data.data : []);
        } catch (err) {
          setError('Error loading doctors.');
        }
        setLoading(false);
      };
  
      fetchDoctors();
    }, []);
  

  return (
    <div className="about-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="breadcrumbs">{t('Home')} / {t('About')}</div>
          <h1>{t('About us')}</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="about-content">
  <div className="container">
    <div className="about-grid">
      {/* Left Column - Image */}
      <div className="about-image">
        {aboutData?.aboutimage?.data?.attributes && (() => {
          const imgAttr = aboutData.aboutimage.data.attributes;
          let imgUrl = imgAttr.formats?.thumbnail?.url
            || imgAttr.formats?.small?.url
            || imgAttr.formats?.medium?.url
            || imgAttr.formats?.large?.url
            || imgAttr.url;
          return (
            <img
              src={imgUrl}
              alt={t('About Us')}
              className="about-image"
            />
          );
        })()}
      </div>
      {/* Right Column - Content */}
      <div className="about-text">
        <span className="section-subtitle">{t('WELCOME TO HOSPITAL NAME')}</span>
        <h2 className="section-title">{aboutData?.topic || t('Best Care for Your Good Health')}</h2>
        <div className="features-grid" style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {/* Left Points */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {Array.isArray(aboutData?.leftpoints) && aboutData.leftpoints.map((point, idx) => (
              <li key={`left-${idx}`} className="feature-item" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span className="feature-icon" style={{ marginRight: 8 }}><FaCheck /></span>
                <span className="feature-text">{point.children?.[0]?.text}</span>
              </li>
            ))}
          </ul>
          {/* Right Points */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {Array.isArray(aboutData?.rightpoints) && aboutData.rightpoints.map((point, idx) => (
              <li key={`right-${idx}`} className="feature-item" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span className="feature-icon" style={{ marginRight: 8 }}><FaCheck /></span>
                <span className="feature-text">{point.children?.[0]?.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="about-description">
          {aboutData?.aboutpara || t('Default about us paragraph')}
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Doctors Section */}
      <DoctorsSection /> {/* Use imported DoctorsSection component */}

      {/* News Section */}
      <div className="news-section">
        <span className="news-subtitle">{t('BETTER INFORMATION, BETTER HEALTH')}</span>
        <h2 className="news-title">{t('News')}</h2>
        <div className="news-grid">
          {loading && <p>Loading news...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && news.map((item) => {
            // Fix image path logic
            let imageUrl = null;
            const imgAttr = item.attributes.picimage?.data?.[0]?.attributes;
            if (imgAttr) {
              if (imgAttr.formats?.thumbnail?.url) {
                imageUrl = imgAttr.formats.thumbnail.url;
              } else if (imgAttr.formats?.small?.url) {
                imageUrl = imgAttr.formats.small.url;
              } else if (imgAttr.formats?.medium?.url) {
                imageUrl = imgAttr.formats.medium.url;
              } else if (imgAttr.formats?.large?.url) {
                imageUrl = imgAttr.formats.large.url;
              } else if (imgAttr.url) {
                imageUrl = imgAttr.url;
              }
            }
            return (
              <div key={item.id} className="news-card">
                <img src={imageUrl || doctorImage1} alt="News" className="news-image" />
                <div className="news-info">
                  <div className="news-date">
                    <span>{new Date(item.attributes.PUBLISHED).toLocaleDateString()}</span>
                    <span>{item.attributes.authors || 'Author'}</span>
                  </div>
                  <h3 className="news-headline">{item.attributes.news_heading}</h3>
                  <p className="news-excerpt">{item.attributes.news_excerpt}</p>
                  <div className="news-stats">
                    <span><FaEye /> {item.attributes.VIEWS || 0}</span>
                    <span><FaHeart /> {item.attributes.LIKES || 0}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutScreen;
      