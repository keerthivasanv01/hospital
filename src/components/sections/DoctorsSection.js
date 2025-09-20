import React, { useEffect, useState } from 'react';
import '../../css/DoctorsSection.css';

// Import doctor images from assets
import doctor1 from '../../assets/doctor1.png';
import { Button } from 'react-bootstrap';

const DoctorsSection = () => {
  const [doctors, setDoctors] = useState([]);
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

  const handleViewProfile = (doc) => {
    setSelectedDoctor(doc);
  };

  const closePopup = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="doctors-section responsive-doctors-section">
      <span className="doctors-subtitle">TRUSTED CARE</span>
      <h2 className="doctors-title">Our Doctors</h2>
      <div className="doctors-grid">
        {loading && <p>Loading doctors...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && doctors.slice(0, 3).map((doc, idx) => {
          const doctorImageData = doc.attributes?.doctorimage?.data?.attributes;
          let imageUrl = doctor1;
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
            <div className="doctor-card" key={doc.id || idx} style={{  position: 'relative', right: '100px' }}>
              <img src={imageUrl} alt="Doctor" className="doctor-image" />
              <div className="doctor-info">
                <h3 className="doctor-name">{doc.attributes?.name || "Doctor's Name"}</h3>
                <p className="doctor-specialty">{doc.attributes?.dept || 'N/A'}</p>
                <p className="doctor-specialty">{doc.attributes?.specialization || 'N/A'}</p>
                <button className="view-profile-btn" onClick={() => handleViewProfile(doc)}>
                  View Profile
                </button>
              </div>
            </div>
            
          );
        })}
      </div>
      
      
      {selectedDoctor && (
        <div
          className="doctors-section-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            className="doctors-section-popup"
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
              src={
                (() => {
                  const imgAttr = selectedDoctor.attributes?.doctorimage?.data?.attributes;
                  if (imgAttr?.formats?.thumbnail?.url) {
                    return imgAttr.formats.thumbnail.url.startsWith('http')
                      ? imgAttr.formats.thumbnail.url
                      : `https://cms-dev.seidrtech.ai/com${imgAttr.formats.thumbnail.url}`;
                  } else if (imgAttr?.url) {
                    return imgAttr.url.startsWith('http')
                      ? imgAttr.url
                      : `https://cms-dev.seidrtech.ai/com${imgAttr.url}`;
                  }
                  return doctor1;
                })()
              }
              alt={selectedDoctor.attributes?.name || "Doctor's Image"}
              style={{
                width: '250px',
                height: '260px',
                objectFit: 'cover',
                marginBottom: '20px'
              }}
            />
            <h2 className="popup-title">{selectedDoctor.attributes?.name || "Doctor's Name"}</h2>
            <p className="popup-department"><strong>Department:</strong> {selectedDoctor.attributes?.dept || 'N/A'}</p>
            <p className="popup-specialization"><strong>Specialization:</strong> {selectedDoctor.attributes?.specialization || 'N/A'}</p>
            <p className="popup-profile"><strong>Profile:</strong> {selectedDoctor.attributes?.addprofiledata || 'N/A'}</p>
            <button
              className="doctors-section-close-popup-btn"
              onClick={closePopup}
              style={{
                position: 'absolute',
                top: '0px',
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
      {/* Responsive styles for forms and popups */}
      <style>
        {`
          .responsive-doctors-section {
            width: 100%;
            box-sizing: border-box;
            padding: 0 16px;
          }
          .doctors-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 24px;
            justify-content: center;
          }
          .doctor-card {
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            min-width: 260px;
            max-width: 320px;
            flex: 1 1 260px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px;
            margin: 8px;
          }
          .doctor-image {
            width: 120px;
            height: 180px;
            object-fit: cover;
            margin-bottom: 12px;
            border-radius: 8px;
          }
          .doctor-info {
            text-align: center;
            width: 100%;
          }
          .view-profile-btn {
            margin-top: 10px;
            padding: 8px 16px;
            font-size: 15px;
            border-radius: 4px;
            border: none;
            background: #007bff;
            color: #fff;
            cursor: pointer;
            transition: background 0.2s;
          }
          .view-profile-btn:hover {
            background: #0056b3;
          }
          .dots {
            display: flex;
            justify-content: center;
            margin-top: 18px;
          }
          .dot {
            height: 10px;
            width: 10px;
            margin: 0 4px;
            background-color: #bbb;
            border-radius: 50%;
            display: inline-block;
            transition: background 0.3s;
          }
          .dot.active {
            background-color: #007bff;
          }
          .doctors-section-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .doctors-section-popup {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 90vw;
            text-align: center;
            position: relative;
          }
          .doctors-section-popup img {
            width: 150px;
            height: 250px;
            object-fit: cover;
            margin-bottom: 20px;
            border-radius: 8px;
          }
          .doctors-section-popup-title {
            font-size: 1.5rem;
            margin-bottom: 10px;
          }
          .doctors-section-popup-profile,
          .doctors-section-popup-department,
          .doctors-section-popup-specialization {
            font-size: 15px;
            margin-bottom: 8px;
          }
          .doctors-section-close-popup-btn {
            position: absolute;
            top: 0px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #000;
          }
          @media (max-width: 900px) {
            .doctors-grid {
              gap: 16px;
            }
            .doctor-card {
              min-width: 220px;
              max-width: 260px;
              padding: 12px;
            }
            .doctor-image {
              width: 100px;
              height: 150px;
              border-radius: 8px;
            }
          }
          @media (max-width: 600px) {
            .responsive-doctors-section {
              padding: 0 4px;
            }
            .doctors-grid {
              flex-direction: column;
              gap: 12px;
            }
            .doctor-card {
              min-width: 90vw;
              max-width: 98vw;
              flex-direction: column;
              padding: 0px;
              // margin: 20px 0 20px 0;
              position: relative;
              left: -30px;
            }
            .doctor-info {
              font-size: 13px;
              padding: 8px 0;
            }
            .doctor-image {
              width: 100% !important;
              height: 180px !important;
              object-fit: contain !important;
              border-radius: 8px !important;
            }
            .doctors-section-popup {
              max-width: 98vw !important;
              width: 98vw !important;
              padding: 10px !important;
            }
            .doctors-section-popup img {
              width: 100px !important;
              height: 180px !important;
              object-fit: contain !important;
              border-radius: 8px !important;
            }
            .doctors-section-popup-title {
              font-size: 1.2rem !important;
            }
            .doctors-section-popup-profile,
            .doctors-section-popup-department,
            .doctors-section-popup-specialization {
              font-size: 13px !important;
            }
            .doctors-section-close-popup-btn {
              font-size: 24px !important;
              top: 4px !important;
              right: 4px !important;
            }
            .view-profile-btn {
              font-size: 13px !important;
              padding: 6px 12px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DoctorsSection;

