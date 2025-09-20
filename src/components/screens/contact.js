import React, { useEffect, useState } from 'react';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane, FaArrowRight,FaEye,FaHeart} from 'react-icons/fa';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../css/Contact.css';
import { useTranslation } from 'react-i18next';

function Contact() {
  const { t } = useTranslation(); 
  const [contacts, setContacts] = useState({});
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/contacts1?populate=*', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error(t('Failed to fetch contacts.'));
        const data = await response.json();
        setContacts(data.data[0]?.attributes || {});
      } catch (err) {
        console.error(t('Error fetching contacts:'), err);
      }
    };

    const fetchNews = async () => {
      setLoading(true);
      setError('');
      try {
        const token = 'a467086c677778101358dce5f8afa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7e9f8cb21c195dccaa19077b3b29391358154e6d34ae535d6b94358c0be304f79f73aa2c4a53cd19fa4b2abd88deadd222f4469bcd5e98fab68ebf0b58e03debde91eab94c1a2f155786865433136c19233ca50c9aaaea827b03de56a6de475029c804dfca94fe4047fb9891769eb1af4f3193';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/news11?populate=*', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error(t('Failed to fetch news.'));
        const data = await response.json();
        setNews(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError(t('Could not load news.'));
      }
      setLoading(false);
    };

    fetchContacts();
    fetchNews();
  }, []);

  return (
    <div className="contact-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="contact-hero">
        <div className="container">
          <h1>{t('Contact Us')}</h1>
          <p className="hero-subtitle">{t('We are here for you! How can we help?')}</p>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425872426606!3d40.74076987932881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sMadison%20Square%20Garden!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" 
          width="100%" 
          height="350" 
          style={{border:0}} 
          allowFullScreen="" 
          loading="lazy"
          title={t('Our Location')}
        ></iframe>
      </div>

      {/* Contact Section */}
      <div className="contact-section" style={{ position: 'relative', top: '1px' }}>
        <div className="container">
          <div className="contact-content">
            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>{t('Get in Touch')}</h2>
              <p className="form-subtitle">{t('Have questions or need assistance? Our team is here to help.')}</p>
              <form className="contact-form">
                <div className="form-group">
                  <input type="text" placeholder={t('Your Name')} required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder={t('Your Email')} required />
                </div>
                <div className="form-group">
                  <input type="text" placeholder={t('Subject')} />
                </div>
                <div className="form-group">
                  <textarea placeholder={t('Your Message')} rows="5" required></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  <span>{t('Send Message')}</span>
                  <FaPaperPlane className="send-icon" />
                </button>
              </form>

              <div className="social-links" style={{ position: 'relative', top: '0px', alignItems: 'center', textAlign: 'center' }}>
                <p>{t('Follow us on social media:')}</p>
                <div className="social-icons" style={{ position: 'relative', top: '-15px'}}>
                  <a href="#" className="social-icon"><FaFacebook /></a>
                  <a href="#" className="social-icon"><FaTwitter /></a>
                  <a href="#" className="social-icon"><FaInstagram /></a>
                  <a href="#" className="social-icon"><FaLinkedin /></a>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon" style={{ position: 'relative', left: '40px'}}>
                  <FaPhoneAlt />
                </div>
                <h3>{t('Emergency')}</h3>
                <p>{contacts.Emergency || '+1 (555) 123-4567'}</p>
                <a href="#" className="learn-more">
                  {t('Learn More')} <FaArrowRight className="arrow-icon" />
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon" style={{ position: 'relative', left: '40px'}}>
                  <FaClock />
                </div>
                <h3>{t('Working Hours')}</h3>
                <p>{contacts.WorkingHours || t('Mon - Fri: 8:00 - 18:00')}</p>
                <p>{contacts.SaturdayHours || t('Saturday: 9:00 - 16:00')}</p>
                <p>{contacts.SundayHours || t('Sunday: Closed')}</p>
                <a href="#" className="learn-more">
                  {t('Learn More')} <FaArrowRight className="arrow-icon" />
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon" style={{ position: 'relative', left: '40px'}} >
                  <FaMapMarkerAlt />
                </div>
                <h3>{t('Location')}</h3>
                <p>{contacts.Location || t('123 Medical Center Drive')}</p>
                {/* <p>{contacts.Address || t('Suite 456, New York, NY 10001')}</p> */}
                <a href="#" className="learn-more">
                  {t('View on Map')} <FaArrowRight className="arrow-icon" />
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon" style={{ position: 'relative', left: '40px'}} >
                  <FaEnvelope />
                </div>
                <h3>{t('Email Us')}</h3>
                <p>{contacts.Email || t('info@meddical.com')}</p>
                <a href="#" className="learn-more">
                  {t('Send Email')} <FaArrowRight className="arrow-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
