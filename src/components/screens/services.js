import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormattedMessage } from 'react-intl';
import Navbar from '../sections/Navbar';
import Contact from '../sections/Contact';
import Footer from '../sections/Footer';
import '../../css/Services.css';
import '../../css/Contact.css';
import serviceImage from '../../assets/doctor2.png';

function Services() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError('');
      try {
        const token = 'a467086c677778101358dce5f8ae9f8cb21c195dccaa19077b3b29391358154e6d34ae535d6b94358c0be304f79f73aa2c4a53cd19fa4b2abd88deadd222f4469bcd5e98fab68ebf0b58e03debde91eab94c1a2f155786865433136c19233ca50c9aaaea827b03de56a6de475029c804dfca94fe4047fb9891769eb1af4f3193';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/our-services1?populate=*', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
          }
        });
        if (!response.ok) throw new Error(t('services.fetchError'));
        const data = await response.json();
        setServices(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError(t('services.loadError', 'Could not load services.'));
      }
      setLoading(false);
    };
    fetchServices();
  }, [t]);

  return (
    <div className="services-screen">
      <Navbar />
      <section className="services-hero">
        <div className="container">
          <h1>
            <FormattedMessage 
              id="services.title" 
              defaultMessage="Our Services" 
            />
          </h1>
          <p>
            <FormattedMessage 
              id="services.subtitle" 
              defaultMessage="Comprehensive healthcare services for you and your family" 
            />
          </p>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="services-section">
        <div className="container" style={{ maxWidth: '100%', padding: 0 }}>
          {loading && (
            <p>
              <FormattedMessage 
                id="services.loading" 
                defaultMessage="Loading services..." 
              />
            </p>
          )}
          {error && (
            <p style={{ color: 'red' }}>
              {error}
            </p>
          )}
          <div className="services-grid" style={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            gap: '40px',
            width: '100%',
            margin: '0 auto',
            padding: '0 8px',
            justifyContent: 'center',
            alignItems: 'stretch'
          }}>
            {services.map((service, idx) => {
              let imageUrl = serviceImage;
              const imageData = service.attributes?.image?.data?.attributes;
              if (imageData?.formats?.thumbnail?.url) {
                const thumbUrl = imageData.formats.thumbnail.url;
                imageUrl = thumbUrl.startsWith('http')
                  ? thumbUrl
                  : `https://cmsdev.prudentgaming.com${thumbUrl}`;
              } else if (imageData?.url) {
                const mainUrl = imageData.url;
                imageUrl = mainUrl.startsWith('http')
                  ? mainUrl
                  : `https://cmsdev.prudentgaming.com${mainUrl}`;
              } else {
                const doctorImageData = service.attributes?.doctorimage?.data?.attributes;
                if (doctorImageData?.formats?.thumbnail?.url) {
                  const thumbUrl = doctorImageData.formats.thumbnail.url;
                  imageUrl = thumbUrl.startsWith('http')
                    ? thumbUrl
                    : `https://cmsdev.prudentgaming.com${thumbUrl}`;
                } else if (doctorImageData?.url) {
                  const mainUrl = doctorImageData.url;
                  imageUrl = mainUrl.startsWith('http')
                    ? mainUrl
                    : `https://cmsdev.prudentgaming.com${mainUrl}`;
                }
              }
              return (
                <div key={service.id || idx} style={{
                  background: 'white',
                  borderRadius: 15,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  padding: '40px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 0,
                  width: '320px',
                  maxWidth: '350px',
                  boxSizing: 'border-box',
                  margin: '20px 0'
                }}>
                  <img src={imageUrl} alt="Service" style={{ width: '100%', maxWidth: 200, borderRadius: 12, marginBottom: 24 }} />
                  <h2 style={{ fontSize: 28, color: '#2c3e50', marginBottom: 16, textTransform: 'capitalize', fontWeight: 700, position: 'relative', paddingBottom: 10 }}>
                    {service.attributes?.service_name || service.attributes?.name}
                    <span style={{
                      display: 'block',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: 40,
                      height: 2,
                      background: '#3498db'
                    }}></span>
                  </h2>
                  <p style={{ fontSize: 15, color: '#6c757d', lineHeight: 1.7, marginBottom: 20, textAlign: 'center', maxWidth: 300 }}>
                    {service.attributes?.Text || service.attributes?.addprofiledata}
                  </p>
                  <a href="#" className="learn-more" style={{ fontSize: 15 }}>
                    <FormattedMessage 
                      id="common.learnMore" 
                      defaultMessage="Learn more" 
                    />
                    <span className="arrow-icon">&rarr;</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default Services;