import React, { useEffect, useState } from 'react';
import { FaLinkedin, FaFacebook, FaInstagram, FaEye, FaHeart, FaCalendarAlt, FaUsers, FaHeartbeat } from 'react-icons/fa';
import { AiOutlineHeart } from 'react-icons/ai';
import '../css/Hero.css';
import '../css/home.css';
import Hero from './Hero'
import { useTranslation } from 'react-i18next';
import dna from '../../assets/icons/Vector (1).png';
import cardiogram from '../../assets/icons/Vector.png';
import bloodBank from '../../assets/icons/Vector (2).png';
import checkup from '../../assets/icons/medical 1.png';
import doctorImage1 from '../../assets/doctor1.png';
import bonesPng from '../../assets/icons/Vector (3).png';
import DoctorsSection from '../sections/DoctorsSection';

const Body = () => {
  const { t } = useTranslation(); 
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appointment, setAppointment] = useState({
    name: '',
    gender: '',
    age: '', 
    email: '',
    phone: '',
    appointmentDate: '', // add date
    appointmentTime: '', // add time
    doctor: '',
    department: '',
    message: ''
  });
  const [apptLoading, setApptLoading] = useState(false);
  const [apptError, setApptError] = useState('');
  const [apptSuccess, setApptSuccess] = useState('');
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [serviceContent, setServiceContent] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [contacts, setContacts] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null); 
  const [news, setNews] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  // Add availableTimes logic
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/our-services1?populate=*', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setServices([]);
      }
      setServicesLoading(false);
    };

    const fetchServiceContent = async () => {
      try {
        const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/service-lefts?populate=*', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch service content');
        const data = await response.json();
        setServiceContent(data.data && data.data[0] ? data.data[0].attributes : null);
      } catch {
        setServiceContent(null);
      }
    };

   
    const fetchSpecialties = async () => {
      try {
        const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/our-specialties1?populate=*', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch specialties');
        const data = await response.json();
        setSpecialties(Array.isArray(data.data) ? data.data : []);
      } catch {
        setSpecialties([]);
      }
    };

    fetchServices();
    fetchServiceContent();
    fetchSpecialties();
  }, []);

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

    fetchContacts();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError('');
      try {
        const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/news11?populate=*', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch news.');
        const data = await response.json();
        setNews(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError('Error loading news.');
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  const handleApptChange = e => {
    const { name, value } = e.target;
    setAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleApptSubmit = async e => {
    e.preventDefault();
    setApptError('');
    setApptSuccess('');

    const requiredFields = [
      'name', 'gender', 'age', 'email', 'phone',
      'appointmentDate', 'appointmentTime', 'doctor', 'department'
    ];
    for (const field of requiredFields) {
      if (!appointment[field] || appointment[field].toString().trim() === '') {
        setApptError('Please fill all required fields.');
        return;
      }
    }

    setApptLoading(true);
    try {

      const filteredAppointment = Object.fromEntries(
        Object.entries(appointment)
          .filter(([_, v]) => v !== '')
          .map(([k, v]) => k === 'age' ? [k, Number(v)] : [k, v])
      );
      const response = await fetch('https://devbeapi.lucknowheritagehospital.com/appointments', {
        method: 'POST',
        headers:
         {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredAppointment)
      });
      if (!response.ok) throw new Error('Failed to submit appointment');
      setApptSuccess('Appointment submitted successfully!');
      setAppointment({
        name: '',
        gender: '',
        age: '',
        email: '',
        phone: '',
        doctor: '',
        department: '',
        message: ''
      });
    } catch (err) {
      setApptError('Could not submit appointment.');
    }
    setApptLoading(false);
  };

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

  // Helper: Generate time slots (every 5 min from 9:00 to 22:00)
  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 9; h <= 22; h++) {
      for (let m = 0; m < 60; m += 5) {
        if (h === 22 && m > 0) break;
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };
  // Format time to 12-hour format
  const formatTimeTo12Hour = (time) => {
    const [h, m] = time.split(':');
    let hour = parseInt(h, 10);
    const minute = m.padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
  };
  useEffect(() => {
    if (!appointment.appointmentDate) {
      setAvailableTimes(generateTimeSlots());
      return;
    }
    const today = new Date();
    const selectedDate = new Date(appointment.appointmentDate);
    let slots = generateTimeSlots();
    if (selectedDate.toDateString() === today.toDateString()) {
      const now = today.getHours() * 60 + today.getMinutes();
      slots = slots.filter(time => {
        const [h, m] = time.split(':');
        const mins = parseInt(h) * 60 + parseInt(m);
        return mins > now;
      });
    }
    setAvailableTimes(slots);
  }, [appointment.appointmentDate, currentTime]);

  return (
    <div>

      {/* Hero Section */}
      <Hero />
      <div
        className="body-center"
        style={{
          marginBottom: '40px',
          width: '100%',
          padding: 0,
        }}
      >
        <div
          className="appointment-cards"
        >
          <a href="/appointment">
            <div className="appointment-card primary">
              <span className="card-icon"><FaCalendarAlt /></span>
              {t('Book an Appointment')}
            </div>
          </a>
          <a href="/doctors">
            <div className="appointment-card secondary">
              <span className="card-icon"><FaUsers /></span>
              {t('Meet Our Specialists')}
            </div>
          </a>
          <a href="/services">
            <div className="appointment-card secondary">
              <span className="card-icon"><FaHeartbeat /></span>
              {t('Visit Our Services')}
            </div>
          </a>
        </div>
        <p className="appointment-para" style={{ color: '#159EEC', marginBottom: '10px' }}>
          {t('Welcome to Meddical')}
        </p>
        <p className="appointment-para" style={{ color: '#1F2B6C', marginBottom: '10px' }}>
          {t('A Great Place to Receive Care')}
        </p>
        
        <p>
        Welcome to our hospital, where compassionate care meets advanced medical expertise. <br />
        We offer 24/7 emergency services with modern facilities and skilled doctors.<br />
        Our specialties include cardiology, neurology, orthopedics, pediatrics, and more.<br />
        With state-of-the-art technology, we ensure accurate diagnosis and effective treatments.<br />
        Your health and well-being are our top priority — caring for you, always.<br />
        </p>

        <hr style={{ marginBottom: '10px' }} />
        <a href="#" style={{ color: '#159EEC', textDecoration: 'none', fontSize: '18px', marginBottom: '20px', display: 'inline-block' }}>
          {t('Learn more')} &rarr;
        </a>
      </div>

     

      <div className="services-section" style={{ marginBottom: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', backgroundColor: 'white', position: "relative", bottom: "80px",  }}>
        <h2 className="services-title" style={{ position: "relative", bottom: "80px" }}>{t('Our Services')}</h2>

        <div className="services-row" style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'stretch',
          gap: '32px',
          width: '100%',
          marginBottom: '4px',
          flexWrap: 'wrap',
          position: "relative", bottom: "80px"
        }}>
          {servicesLoading && <div>{t('Loading services...')}</div>}
          {!servicesLoading && services.length > 0 ? (
            services.slice(0, 4).map((service, idx) => (
              <div
                className="service-card"
                key={service.id || idx}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(31,43,108,0.08)',
                  padding: '32px 18px',
                  minWidth: '180px',
                  maxWidth: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  cursor: 'pointer'
                }}
              >
                <div className="service-icon-img" style={{ marginBottom: '16px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Show icon if available, else fallback */}
                  {service.attributes?.icon?.data?.attributes?.url ? (
                    <img
                      src={
                        service.attributes.icon.data.attributes.url.startsWith('http')
                          ? service.attributes.icon.data.attributes.url
                          : `https://cms-dev.seidrtech.ai/com${service.attributes.icon.data.attributes.url}`
                      }
                      alt={service.attributes?.service_name}
                      style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                    />
                  ) : (
                    <img src={checkup} alt={t('Service Icon')} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                  )}
                </div>
                <span style={{ fontWeight: 600, fontSize: 18, color: '#1F2B6C', textAlign: 'center' }}>
                  {service.attributes?.service_name}
                </span>
              </div>
            ))
          ) : (
            <>
              {/* Fallback static cards */}
              <div className="service-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(31,43,108,0.08)', padding: '32px 18px', minWidth: '180px', maxWidth: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img src={checkup} alt={t('Free Checkup')} style={{ width: '48px', height: '48px', marginBottom: '16px' }} />
                <span style={{ fontWeight: 600, fontSize: 18, color: '#1F2B6C' }}>{t('Free Checkup')}</span>
              </div>
              <div className="service-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(31,43,108,0.08)', padding: '32px 18px', minWidth: '180px', maxWidth: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img src={cardiogram} alt={t('Cardiogram')} style={{ width: '48px', height: '48px', marginBottom: '16px' }} />
                <span style={{ fontWeight: 600, fontSize: 18, color: '#1F2B6C' }}>{t('Cardiogram')}</span>
              </div>
              <div className="service-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(31,43,108,0.08)', padding: '32px 18px', minWidth: '180px', maxWidth: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img src={dna} alt={t('DNA Testing')} style={{ width: '48px', height: '48px', marginBottom: '16px' }} />
                <span style={{ fontWeight: 600, fontSize: 18, color: '#1F2B6C' }}>{t('DNA Testing')}</span>
              </div>
              <div className="service-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(31,43,108,0.08)', padding: '32px 18px', minWidth: '180px', maxWidth: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img src={bloodBank} alt={t('Blood Bank')} style={{ width: '48px', height: '48px', marginBottom: '16px' }} />
                <span style={{ fontWeight: 600, fontSize: 18, color: '#1F2B6C' }}>{t('Blood Bank')}</span>
              </div>
            </>
          )}
        </div>
        {/* <button className="view-all-btn" style={{ display: 'block', margin: '0 auto 32px auto' }}>{t('View All')}</button> */}
        <div className="services-content">
          <div className="content-box" style={{ position:"relative" ,bottom:"95px" }}>
            <h2>
              {serviceContent?.heading || t('A passion for putting patients first.')}
            </h2>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {/* Sidepoints on the left */}
              {serviceContent?.sidepoints?.length > 0 && (
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                  {serviceContent.sidepoints.map((point, idx) => (
                    <li key={idx} style={{ fontSize: 16, color: '#1F2B6C', marginBottom: 0 }}>
                      <span role="img" aria-label="bullet">🔹</span> {t(point.children[0].text.replace(/^- /, ''))}
                    </li>
                  ))}
                </ul>
              )}

              {serviceContent?.points && (
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                  {serviceContent.points
                    .split('\n')
                    .filter(Boolean)
                    .map((point, idx) => (
                      <li key={idx} style={{ fontSize: 16, color: '#1F2B6C', marginBottom: 8 }}>
                        <span role="img" aria-label="pointer">🔹</span> {point.replace(/^- /, '')}
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <p>
              {serviceContent?.servicepara || t('Default service paragraph')}
            </p>
            <p>
              {serviceContent?.servicepara || t('Default service paragraph')}
            </p>

          </div>
          <div className="doctor-images" style={{ position:"relative" ,bottom:"110px" }}>
            {/* Show service images one by one (stacked vertically) */}
            {serviceContent?.service_image?.data && Array.isArray(serviceContent.service_image.data) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                {serviceContent.service_image.data.map((img, idx) => {
                  const attr = img.attributes;
                  let imgUrl = '';
                  if (attr?.formats?.large?.url) {
                    imgUrl = attr.formats.large.url.startsWith('http')
                      ? attr.formats.large.url
                      : `https://cms-dev.seidrtech.ai/com${attr.formats.large.url}`;
                  } else if (attr?.url) {
                    imgUrl = attr.url.startsWith('http')
                      ? attr.url
                      : `https://cms-dev.seidrtech.ai/com${attr.url}`;
                  }
                  return (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={attr?.name || 'Service'}
                      style={{ width: 250, height: 280, objectFit: 'cover', borderRadius: 8, background: '#f4f6fa', display: 'block' }} />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="specialties-container" style={{ position: "relative", bottom: "200px" }}>
        <div className="specialties-header" style={{ marginBottom: '50px' }}>
          <p className="specialties-subtitle">{t('ALWAYS CARING')}</p>
          <h2 className="specialties-title">{t('Our Specialties')}</h2>
        </div>
        <div className="specialties-items-grid" style={{ backgroundColor: 'white' }}>
          {specialties.length > 0 ? (
            specialties.map((item, idx) => {
              const attr = item.attributes;
              let iconUrl = '';
              const iconData = attr?.ICONS?.data?.[0]?.attributes;
              if (iconData?.formats?.thumbnail?.url) {
                iconUrl = iconData.formats.thumbnail.url.startsWith('http')
                  ? iconData.formats.thumbnail.url
                  : `https://cms-dev.seidrtech.ai/com${iconData.formats.thumbnail.url}`;
              } else if (iconData?.url) {
                iconUrl = iconData.url.startsWith('http')
                  ? iconData.url
                  : `https://cms-dev.seidrtech.ai/com${iconData.url}`;
              }
              return (
                <div className={`specialty-card${idx === 1 ? ' specialty-active' : ''}`} key={item.id || idx} style={{
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(31,43,108,0.08)',
                  padding: '32px 18px',
                  minWidth: '220px',
                  maxWidth: '260px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0'
                }}>
                  {iconUrl && (
                    <img src={iconUrl} alt={attr.DEPARTMENT} className="specialty-img-icon" style={{ width: 50, height: 44, objectFit: 'contain', marginBottom: 12 }} />
                  )}
                  <span style={{ fontWeight: 600, fontSize: 18, color: '#1F2B6C' }}>{attr.DEPARTMENT}</span>
                </div>
              );
            })
          ) : (
      
            <>
              <div className="specialty-card">
                <img src={bonesPng} alt="Neurology" className="specialty-img-icon" />
                <span>Neurology</span>
              </div>
              <div className="specialty-card specialty-active">
                <img src={bonesPng} alt="Bones" className="specialty-img-icon" />
                <span>Bones</span>
              </div>
              <div className="specialty-card">
                <img src={bonesPng} alt="Oncology" className="specialty-img-icon" />
                <span>Oncology</span>
              </div>
              <div className="specialty-card">
                <img src={bonesPng} alt="Otorhinolaryngology" className="specialty-img-icon" />
                <span>Otorhinolaryngology</span>
              </div>
              <div className="specialty-card">
                <img src={bonesPng} alt="Ophthalmology" className="specialty-img-icon" />
                <span>Ophthalmology</span>
              </div>
              <div className="specialty-card">
                <img src={bonesPng} alt="Cardiovascular" className="specialty-img-icon" />
                <span>Cardiovascular</span>
              </div>
              <div className="specialty-card">
                <img src={bonesPng} alt="Pulmonology" className="specialty-img-icon" />
                <span>Pulmonology</span>
              </div>
              <div className="specialty-card">
                <img src={bonesPng} alt="Renal Medicine" className="specialty-img-icon" />
                <span>Renal Medicine</span>
              </div>
              <div className="specialty-card">
                <img src={bonesPng} alt="Gastroenterology" className="specialty-img-icon" />
                <span>Gastroenterology</span>
              </div>
              <div className="specialty-card">
                <img src={bonesPng} alt="Urology" className="specialty-img-icon" />
                <span>Urology</span>
              </div>
              <div className="specialty-card">
                <img src={bonesPng} alt="Dermatology" className="specialty-img-icon" />
                <span>Dermatology</span>
              </div>
              <div className="specialty-card">
                <img src={bonesPng} alt="Gynaecology" className="specialty-img-icon" />
                <span>Gynaecology</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="appointment-section" style ={{  position:"relative" ,bottom:"100px" }}>
        {/* Add clock above the form */}
       
        <div className="appointment-content">
          <h2 className="appointment-title">{t('Book an Appointment')}</h2>
          <p className="appointment-description">
            {t('Please fill out the form below to book your appointment.')}
          </p>
        </div>
        <form
          className="appointment-form"
          onSubmit={handleApptSubmit}
          style={{
            backgroundColor: 'white',
            padding: '32px 24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(31,43,108,0.08)',
            maxWidth: '700px',
            margin: '0 auto',
            border: '3px solid green'
          }}
        >
          {/* Row 1: Name, Age, Gender */}
          <div className="form-row" style={{  backgroundColor: 'white',  color: '#000', border: '0px solid #BFD2F8' }}>
            <input
              type="text"
              name="name"
              placeholder={t('Enter your name')}
              className="form-input"
              value={appointment.name}
              onChange={handleApptChange}
              required
              style={{ flex: 1, minWidth: 0 }}
            />
            <input
              type="number"
              name="age"
              placeholder={t('Enter your age')}
              className="form-input"
              value={appointment.age}
              onChange={handleApptChange}
              min="1"
              max="120"
              required
              style={{ flex: 1, minWidth: 0 }}
            />
            <select
              className="form-input"
              name="gender"
              value={appointment.gender}
              onChange={handleApptChange}
              required
              style={{ flex: 1, minWidth: 0 }}
            >
              <option value="">{t('Select Gender')}</option>
              <option value="male">{t('Male')}</option>
              <option value="female">{t('Female')}</option>
              <option value="other">{t('Other')}</option>
            </select>
          </div>
          {/* Row 2: Email, Phone */}
          <div className="form-row" style={{ backgroundColor: 'white', color: '#000', border: '0px solid #BFD2F8' }}>
            <input
              type="email"
              name="email"
              placeholder={t('Enter your email')}
              className="form-input"
              value={appointment.email}
              onChange={handleApptChange}
              required
              style={{ flex: 1, minWidth: 0 }}
            />
            <input
              type="tel"
              name="phone"
              placeholder={t('Enter your phone number')}
              className="form-input"
              value={appointment.phone}
              onChange={handleApptChange}
              pattern="[0-9]{10}"
              required
              style={{ flex: 1, minWidth: 0 }}
            />
          </div>
          {/* Row 3: Date, Time */}
          <div className="form-row" style={{ backgroundColor: 'white', color: '#000', border: '0px solid #BFD2F8' }}>
            <input
              type="date"
              name="appointmentDate"
              id="appointmentDate"
              placeholder={t('Appointment Date')}
              className="form-input"
              value={appointment.appointmentDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={handleApptChange}
              required
              style={{ flex: 1, minWidth: 0 }}
            />
            <select
              className="form-input"
              name="appointmentTime"
              id="appointmentTime"
              value={appointment.appointmentTime}
              onChange={handleApptChange}
              required
              style={{ flex: 1, minWidth: 0 }}
            >
              <option value="">{t('Select Time')}</option>
              {availableTimes.length > 0 ? (
                availableTimes.map((time, idx) => (
                  <option key={idx} value={time}>
                    {formatTimeTo12Hour(time)}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {t('No slots available')}
                </option>
              )}
            </select>
          </div>
          {/* Row 4: Doctor, Department */}
          <div className="form-row" style={{ backgroundColor: 'white', color: '#000', border: '0px solid #BFD2F8' }}>
            <select
              className="form-input"
              name="doctor"
              value={appointment.doctor}
              onChange={handleApptChange}
              required
              style={{ flex: 1, minWidth: 0 }}
            >
              <option value="">{t('Select Doctor')}</option>
              {doctors.map((doc, idx) => (
                <option
                  key={doc.id || idx}
                  value={doc.attributes?.name || ''}
                >
                  {doc.attributes?.name
                    ? `${doc.attributes.name}${doc.attributes.dept ? ` (${doc.attributes.dept})` : ''}`
                    : t("Doctor's Name")}
                </option>
              ))}
            </select>
            <select
              className="form-input"
              name="department"
              value={appointment.department}
              onChange={handleApptChange}
              required
              style={{ flex: 1, minWidth: 0 }}
            >
              <option value="">{t('Select Department')}</option>
              {specialties.map((item, idx) => (
                <option key={item.id || idx} value={item.attributes?.DEPARTMENT || ''}>
                  {item.attributes?.DEPARTMENT || t('Department')}
                </option>
              ))}
            </select>
          </div>
          {/* Row 5: Message */}
          <div className="form-row" style={{ marginBottom: '16px' }}>
            <textarea
              className="form-input message-input"
              name="message"
              placeholder={t('Enter your message')}
              rows="4"
              value={appointment.message}
              onChange={handleApptChange}
              required
              style={{ width: '100%', minWidth: 0 }}
            ></textarea>
          </div>
          {apptError && <div style={{ color: 'red', marginBottom: 8 }}>{apptError}</div>}
          {apptSuccess && <div style={{ color: 'lightgreen', marginBottom: 8 }}>{apptSuccess}</div>}
          <button className="submit-btn" type="submit" disabled={apptLoading}>
            {apptLoading ? t('Submitting...') : t('Submit')}
          </button>
        </form>
      </div>

      {/* Doctors Section */}
      <DoctorsSection />

      <div className="news-section" style={{ position: "relative", top: "0px" }}>
        <span className="news-subtitle">{t('BETTER INFORMATION, BETTER HEALTH')}</span>
        <h2 className="news-title">{t('News')}</h2>
        <div className="news-grid" style={{ marginBottom: '15px' }}>
          {loading && <p>Loading news...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && news.map((item) => {
            let imageUrl = doctorImage1;
            const imgAttr = item.attributes.picimage?.data?.[0]?.attributes;
            if (imgAttr) {
              if (imgAttr.formats?.large?.url) {
                imageUrl = imgAttr.formats.large.url;
              } else if (imgAttr.formats?.medium?.url) {
                imageUrl = imgAttr.formats.medium.url;
              } else if (imgAttr.formats?.small?.url) {
                imageUrl = imgAttr.formats.small.url;
              } else if (imgAttr.formats?.thumbnail?.url) {
                imageUrl = imgAttr.formats.thumbnail.url;
              } else if (imgAttr.url) {
                imageUrl = imgAttr.url;
              }
            }
            return (
              <div key={item.id} className="news-card" style={{ marginBottom: '15px' }}>
                <img src={imageUrl} alt="News" className="news-image" />
                <div className="news-info">
                  <div className="news-date">
                    <span>{new Date(item.attributes.PUBLISHED).toLocaleDateString()}</span>
                    <span>{item.attributes.authors || 'Author'}</span>
                  </div>
                  <h3 className="news-headline">{item.attributes.news_heading}</h3>
                  <div className="news-stats">
                    <span><FaEye /> {item.attributes.VIEWS}</span>
                    <span><FaHeart /> {item.attributes.LIKES}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
        src={`https://cms-dev.seidrtech.ai/com${selectedDoctor.attributes?.doctorimage?.data?.attributes?.url || ''}`} 
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
    {/* Responsive styles for appointment form */}
    <style>
      {`
        @media (max-width: 700px) {
          .appointment-form {
            padding: 16px !important;
            max-width: 98vw !important;
          }
          .appointment-form .form-row {
            flex-direction: column !important;
            gap: 12px !important;
            background-color: none
          }
          .appointment-form .form-input,
          .appointment-form .message-input,
          .appointment-form .submit-btn {
            width: 100% !important;
            min-width: 0 !important;
            box-sizing: border-box;
            font-size: 16px !important;
          }
        }
        @media (max-width: 400px) {
          .appointment-form {
            padding: 6px !important;
          }
        }
      `}
    </style>
  </div>
  );
};

export default Body;