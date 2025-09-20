import React, { useEffect, useState } from 'react';
import '../../css/Contact.css';
import dna from '../../assets/icons/Vector (1).png';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Contact = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [contacts, setContacts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError('');
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
        setError(t('Could not load contact details.'));
      }
      setLoading(false);
    };

    fetchContacts();
  }, []);

  return (
    <div className="contact-section">
      <div className="container">
        <div className="contact-header">
          <span className="contact-subtitle">{t('GET IN TOUCH')}</span>
          <h2 className="contact-title">{t('Contact')}</h2>
        </div>
        
        <div className="contact-cards">
          {/* Phone Card */}
          <div className="contact-card">
            <h3 className="card-title">{t('Phone')}</h3>
            <p className="card-content">
              {contacts.Emergency || t('N/A')}
            </p>
          </div>

          {/* Location Card */}
          <div className="contact-card">
            <h3 className="card-title">{t('Location')}</h3>
            <p className="card-content">
              {contacts.Location || t('N/A')}
            </p>
          </div>
          
          {/* Email Card */}
          <div className="contact-card">
            <h3 className="card-title">{t('Email')}</h3>
            <p className="card-content">
              {contacts.Email || t('N/A')}
            </p>
          </div>
          
          {/* Hours Card */}
          <div className="contact-card">
            <h3 className="card-title">{t('Working Hours')}</h3>
            <p className="card-content">
              {contacts.WorkingHours || t('N/A')}<br />
              {contacts.WorkingHours2 || t('SUNDAY - SATURDAY')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
