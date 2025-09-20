import React, { useState, useEffect } from 'react';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import { 
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, 
  FaVenusMars, FaUserMd, FaStethoscope, 
  FaComment, FaMapMarkerAlt
} from 'react-icons/fa';
import '../css/Appointment.css';
import Contact from '../sections/Contact';
import { useTranslation } from 'react-i18next'; 

const Appointment = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    doctor: '',
    department: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState(null);
  const [cmsContactDetails, setCmsContactDetails] = useState({});
  const [departments, setDepartments] = useState([]); 
  const [loadingDepartments, setLoadingDepartments] = useState(true); 
  const [errors, setErrors] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);

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

  // Track current time for dynamic slot filtering
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update available times based on selected date and current time
  useEffect(() => {
    if (!formData.date) {
      setAvailableTimes(generateTimeSlots());
      return;
    }
    const today = new Date();
    const selectedDate = new Date(formData.date);
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
  }, [formData.date, currentTime]); // <-- add currentTime

  useEffect(() => {
 
    const fetchCmsContactDetails = async () => {
      try {
        const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/contacts1?populate=*', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch CMS contact details.');
        const data = await response.json();
        setCmsContactDetails(data.data[0]?.attributes || {});
      } catch (err) {
        console.error('Error fetching CMS contact details:', err);
      }
    };

    const fetchDepartments = async () => {
      try {
        const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/our-specialties1', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch departments');
        
        const data = await response.json();
        const uniqueDepartments = [
          ...new Set(
            data.data
              .map(dept => dept.attributes?.DEPARTMENT)
              .filter(dept => typeof dept === 'string' && dept.trim() !== '')
          )
        ];
        setDepartments(uniqueDepartments);
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchCmsContactDetails();
    fetchDepartments();
  }, []);

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('Name is required');
    if (!formData.age || isNaN(formData.age) || formData.age < 0) newErrors.age = t('Valid age is required');
    if (!formData.gender) newErrors.gender = t('Gender is required');
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = t('Valid email is required');
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = t('Please enter a 10-digit phone number');
    if (!formData.date) newErrors.date = t('Date is required');
    else {
      const today = new Date();
      const selectedDate = new Date(formData.date);
      if (selectedDate < new Date(today.toISOString().split('T')[0])) {
        newErrors.date = t('Past dates are not allowed');
      }
    }
    if (!formData.time) newErrors.time = t('Time is required');
    else if (formData.date) {
      // Time validation: must be between 09:00 and 22:00
      const [h, m] = formData.time.split(':');
      const hour = parseInt(h, 10);
      const minute = parseInt(m, 10);
      if (
        isNaN(hour) ||
        isNaN(minute) ||
        hour < 9 ||
        (hour > 22 || (hour === 22 && minute > 0))
      ) {
        newErrors.time = t('Please select a time between 09:00 and 22:00');
      } else {
        const today = new Date();
        const selectedDate = new Date(formData.date);
        if (selectedDate.toDateString() === today.toDateString()) {
          // Only allow future times for today
          const selectedMins = hour * 60 + minute;
          const nowMins = today.getHours() * 60 + today.getMinutes();
          if (selectedMins <= nowMins) {
            newErrors.time = t('Please select a future time for today');
          }
        }
      }
    }
    if (!formData.department) newErrors.department = t('Department is required');
    if (!formData.doctor) newErrors.doctor = t('Doctor is required');
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrors({ ...errors, [e.target.name]: undefined }); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus(null);
      return;
    }
    try {
      const payload = {
        ...formData,
        age: formData.age ? Number(formData.age) : undefined,
        appointmentDate: formData.date,
        appointmentTime: formData.time,
      };
      delete payload.date;
      delete payload.time;

      const response = await fetch('https://devbeapi.lucknowheritagehospital.com/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          gender: '',
          age: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          doctor: '',
          department: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="appointment-page">
      <Navbar />
      {/* Hero Section */}
      <div className="appointment-hero">
        <div className="container">
          <h1>{t('Book an Appointment')}</h1>
          <p>{t('Schedule your visit with our expert healthcare professionals')}</p>
        </div>
      </div>

      <div className="appointment-container">
        <div className="container">
          <div className="appointment-wrapper">
            {/* Left Side: Appointment Form */}
            <div className="appointment-form-section">
              <div className="form-header">
                <h2>{t('Book an Appointment')}</h2>
                <p>{t('Fill out the form below to schedule your appointment')}</p>
              </div>
              
              <form className="appointment-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label style={{ color: 'white' }}>{t('Full Name')}</label>
                    <div className="input-with-icon">
                      <FaUser className="input-icon" />
                      <input
                        type="text"
                        placeholder={t('John Doe')}
                        style={{ paddingLeft: '25px' }}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label style={{ color: 'white' }}>{t('Age')}</label>
                    <div className="input-with-icon">
                      <FaUser className="input-icon" />
                      <input
                        type="number"
                        placeholder={t('Age')}
                        style={{ paddingLeft: '25px' }}
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min={0}
                      />
                    </div>
                    {errors.age && <div className="form-error">{errors.age}</div>}
                  </div>
                  <div className="form-group">
                    <label style={{ color: 'white' }}>{t('Gender')}</label>
                    <div className="select-wrapper">
                      <FaVenusMars className="input-icon" />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">{t('Select Gender')}</option>
                        <option value="male">{t('Male')}</option>
                        <option value="female">{t('Female')}</option>
                        <option value="other">{t('Other')}</option>
                      </select>
                    </div>
                    {errors.gender && <div className="form-error">{errors.gender}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label style={{ color: 'white' }}>{t('Email Address')}</label>
                    <div className="input-with-icon">
                      <FaEnvelope className="input-icon" />
                      <input
                        type="email"
                        placeholder={t('your.email@example.com')}
                        style={{ paddingLeft: '25px' }}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {errors.email && <div className="form-error">{errors.email}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label style={{ color: 'white' }}>{t('Phone Number')}</label>
                    <div className="input-with-icon">
                      <FaPhone className="input-icon" />
                      <input
                        type="tel"
                        placeholder={t('+1 (123) 456-7890')}
                        style={{ paddingLeft: '25px' }}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="\d{10}"
                        title={t('Please enter a 10-digit phone number')}
                        required
                      />
                    </div>
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label style={{ color: 'white' }}>{t('Appointment Date')}</label>
                    <div
                      className="input-with-icon"
                      style={{ position: 'relative', width: '100%' }}
                      onClick={() => {
                        // Focus the input when clicking anywhere in the container
                        document.getElementById('appointment-date-input')?.focus();
                      }}
                    >
                      <FaCalendarAlt className="input-icon" />
                      <input
                        type="date"
                        id="appointment-date-input"
                        name="date"
                        value={formData.date}
                        style={{ paddingLeft: '25px', width: '100%' }}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    {errors.date && <div className="form-error">{errors.date}</div>}
                  </div>
                  <div className="form-group">
                    <label style={{ color: 'white' }}>{t('Appointment Time')}</label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" />
                      <select
                        name="time"
                        value={formData.time}
                        style={{ paddingLeft: '25px', width: '100%', height: '50px', borderRadius: '8px' }}
                        onChange={handleChange}
                        required
                      >
                        <option value="">{t('Select Time')}</option>
                        {availableTimes.length > 0 ? (
                          availableTimes.map((time, idx) => (
                            <option key={idx} value={time}>{formatTimeTo12Hour(time)}</option>
                          ))
                        ) : (
                          <option value="" disabled>{t('No slots available')}</option>
                        )}
                      </select>
                    </div>
                    {errors.time && <div className="form-error">{errors.time}</div>}
                  </div>
                  <div className="form-group">
                    <label style={{ color: 'white' }}>{t('Department')}</label>
                    <div className="select-wrapper">
                      <FaStethoscope className="input-icon" />
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        disabled={loadingDepartments}
                        style={loadingDepartments ? { color: '#999' } : {}}
                      >
                        <option value="">
                          {loadingDepartments ? t('Loading departments...') : t('Select Department')}
                        </option>
                        {departments
  .filter(dept => typeof dept === 'string' && dept.trim() !== '')
  .map((dept, index) => (
    <option key={index} value={dept.toLowerCase().replace(/\s+/g, '-')}>
      {dept}
    </option>
  ))}
                      </select>
                    </div>
                    {errors.department && <div className="form-error">{errors.department}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label style={{ color: 'white' }}>{t('Doctor')}</label>
                    <div className="select-wrapper">
                      <FaUserMd className="input-icon" />
                      <select
                        name="doctor"
                        value={formData.doctor}
                        onChange={handleChange}
                        required
                      >
                        <option value="">{t('Select Doctor')}</option>
                        <option value="dr-smith">{t('Dr. John Smith (Cardiology)')}</option>
                        <option value="dr-johnson">{t('Dr. Sarah Johnson (Neurology)')}</option>
                        <option value="dr-williams">{t('Dr. Michael Williams (Orthopedics)')}</option>
                      </select>
                    </div>
                    {errors.doctor && <div className="form-error">{errors.doctor}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label style={{ color: 'white' }}>{t('Message (Optional)')}</label>
                    <div className="input-with-icon">
                      <FaComment className="input-icon" style={{ top: '20px' }} />
                      <textarea
                        placeholder={t('Your message here...')}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  {t('Book Appointment')}
                </button>
                {submitStatus === 'success' && (
                  <div className="form-success" style={{ color: 'green' }}>{t('Appointment booked successfully!')}</div>
                )}
                {submitStatus === 'error' && (
                  <div className="form-error">{t('Failed to book appointment. Please try again.')}</div>
                )}
              </form>
             
            </div>
            {/* Right Side: Schedule */}
              <div className="appointment-schedule">
                <div className="schedule-header" style={{ textAlign: 'center' }}>
                  <h3>{t('Opening Hours')}</h3>
                  <p>{t('We are open 6 days a week')}</p>
                </div>
                <div className="schedule-center" style={{ textAlign: 'left' }}>
                  <div className="days-list" style={{ position:'relative',left:'10px' }}>
                    <div className="location-item">
                      <FaCalendarAlt className="location-icon" />
                      <div>
                        <h5>{t('Monday')}</h5>
                        <p>9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                    <div className="location-item">
                      <FaCalendarAlt className="location-icon" />
                      <div>
                        <h5>{t('Tuesday')}</h5>
                        <p>9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                    <div className="location-item">
                      <FaCalendarAlt className="location-icon" />
                      <div>
                        <h5>{t('Wednesday')}</h5>
                        <p>9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                    <div className="location-item">
                      <FaCalendarAlt className="location-icon" />
                      <div>
                        <h5>{t('Thursday')}</h5>
                        <p>9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                    <div className="location-item">
                      <FaCalendarAlt className="location-icon" />
                      <div>
                        <h5>{t('Friday')}</h5>
                        <p>9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                    <div className="location-item">
                      <FaCalendarAlt className="location-icon" />
                      <div>
                        <h5>{t('Saturday')}</h5>
                        <p>9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  {/* <div className="location-item">
                    <FaCalendarAlt className="location-icon" />
                    <div>
                      <h5>{t('Sunday')}</h5>
                      <p>{t('Closed')}</p>
                    </div>
                  </div> */}
                </div>
                <div className="location-info">
                  <div className="location-item">
                    <FaMapMarkerAlt className="location-icon" />
                    <div>
                      <h5>{t('Location')}</h5>
                      <p>{cmsContactDetails.Location || t('123 Medical Center, New York, NY 10001')}</p>
                    </div>
                  </div>
                  <div className="location-item">
                    <FaPhone className="location-icon" />
                    <div>
                      <h5>{t('Emergency')}</h5>
                      <p>{cmsContactDetails.Emergency || t('+1 234 567 8900')}</p>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
       {/* Map Section below the form */}
              <div className="appointment-map-section" style={{ marginTop: '32px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425872426606!3d40.74076987932881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sMadison%20Square%20Garden!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                  width="800px"
                  height="400px"
                  style={{ border: 0, borderRadius: '8px', position: 'relative', left: '300px', top: '50px' }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Our Location"
                ></iframe>
              </div>

      <Contact />
      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default Appointment;
