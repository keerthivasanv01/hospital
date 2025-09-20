import React, { useEffect, useState } from 'react';
import Navbar from '../sections/Navbar';
import { FaLinkedin, FaFacebook, FaInstagram, FaEye, FaHeart } from 'react-icons/fa';
import doctorImage1 from '../../assets/doctor1.png';
import '../../css/Doctors.css';
import '../css/home.css';
import Footer from '../sections/Footer';
import Contact from '../sections/Contact';
import { useTranslation } from 'react-i18next'; 

function Doctors() {
  const { t } = useTranslation(); 
  const [doctors, setDoctors] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null); 

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
        if (!response.ok) throw new Error(t('Failed to fetch doctors.'));
        const data = await response.json();
        setDoctors(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError(t('Could not load doctors.'));
      }
      setLoading(false);
    };

    const fetchNews = async () => {
      setLoading(true);
      setError('');
      try {
        const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
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

    fetchDoctors();
    fetchNews();
  }, []);

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const closePopup = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="doctors-screen">
      <Navbar />
      {/* Hero Section */}
      <div className="doctors-hero">
        <div className="container">
          <div className="breadcrumb">{t('Home')} / {t('Doctors')}</div>
          <h1>{t('Our Doctors')}</h1>
        </div>
      </div>
      <div className="doctors-section">
        <span className="doctors-subtitle">{t('TRUSTED CARE')}</span>
        <h2 className="doctors-title">{t('Our Doctors')}</h2>
        {loading && <p>{t('Loading doctors...')}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="doctors-grid">
          {doctors.length === 0 && !loading && !error ? (
            <p>{t('No doctors found.')}</p>
          ) : (
            doctors.map((doc, idx) => {
              const doctorImageData = doc.attributes?.doctorimage?.data?.attributes;
              let imageUrl = doctorImage1; 
              if (doctorImageData?.formats?.thumbnail?.url) {
                const thumbUrl = doctorImageData.formats.thumbnail.url;
                imageUrl = thumbUrl.startsWith('http')
                  ? thumbUrl
                  : `https://cms-dev.seidrtech.ai/com${thumbUrl}`;
              } else if (doctorImageData?.url) {
                const mainUrl = doctorImageData.url;
                imageUrl = mainUrl.startsWith('http')
                  ? mainUrl
                  : `https://cms-dev.seidrtech.ai/com${mainUrl}`;
              }

              return (
                <div className="doctor-card" key={doc.id || idx}>
                  <img src={imageUrl} alt={t('Doctor')} className="doctor-image" />
                  <div className="doctor-info">
                    <h3 className="doctor-name">{doc.attributes?.name || t("Doctor's Name")}</h3>
                    <p className="doctor-specialty"> {doc.attributes?.specialization || t('N/A')}</p>
                    <p className="doctor-specialty"> {doc.attributes?.dept || t('N/A')}</p>
                    <p className="doctor-profile"> {doc.attributes?.addprofiledata || t('N/A')}</p>
                    <button className="view-profile-btn" onClick={() => handleViewProfile(doc)}>
                      {t('View Profile')}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Contact />
      <Footer />

      {selectedDoctor && (
        <div 
          className="overlay" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div 
            className="popup" 
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <img 
              src={`${selectedDoctor.attributes?.doctorimage?.data?.attributes?.url || ''}`} 
              alt={selectedDoctor.attributes?.name || t("Doctor's Image")} 
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '20px'
              }}
            />
            <h2 className="popup-title">{selectedDoctor.attributes?.name || t("Doctor's Name")}</h2>
            <p className="popup-department"><strong>{t('Department')}:</strong> {selectedDoctor.attributes?.dept || t('N/A')}</p>
            <p className="popup-specialization"><strong>{t('Specialization')}:</strong> {selectedDoctor.attributes?.specialization || t('N/A')}</p>
            <p className="popup-profile"><strong>{t('Profile')}:</strong> {selectedDoctor.attributes?.addprofiledata || t('N/A')}</p>
            <p className="popup-viewprofile"><strong>{t('View Profile')}:</strong> {selectedDoctor.attributes?.viewprofile || t('N/A')}</p>
            <button 
              className="close-popup-btn" 
              onClick={closePopup} 
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#000'
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;