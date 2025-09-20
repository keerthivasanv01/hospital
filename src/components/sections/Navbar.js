// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { FaPhone, FaClock, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HospitalNavbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [profileEmail, setProfileEmail] = useState('');
  const [group, setGroup] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactDetails, setContactDetails] = useState({});
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    setProfileEmail(localStorage.getItem('profileEmail') || '');
    setGroup(localStorage.getItem('group') || '');
    setFullName(localStorage.getItem('fullName') || '');
  }, []);

  useEffect(() => {
    const fetchHeaderDetails = async () => {
      try {
        const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/lh-hheaders?populate=*', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Header fetch failed');
        const data = await response.json();
        const attr = data.data[0]?.attributes || {};
        setContactDetails({
          Emergency: attr.Emergency,
          WorkHour: attr.WorkHour,
          Location: attr.Location
        });
        setLogoUrl(attr.logo?.data?.attributes?.url || '');
      } catch (err) {
        console.error('Error fetching header:', err);
      }
    };

    fetchHeaderDetails();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setProfileEmail('');
    setGroup('');
    setFullName('');
    navigate('/hospital-login');
  };

  const handleProfileClick = () => {
    if (group === 'Admin') navigate('/dashboard');
    else if (group === 'Normal User') navigate('/user-dashboard');
    else navigate('/dashboard');
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      {/* Top contact header */}
      <div
        className="bg-light border-bottom py-2 px-3 d-flex justify-content-between align-items-center flex-wrap"
        style={{ zIndex: 1040, position: 'relative' }}
      >
        <div className="d-flex align-items-center gap-2 ">
          {/* Show logo only on md and up */}
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              style={{ height: '60px', width: '250px', display: 'none' }}
              className="d-none d-md-block"
            />
          ) : (
            <span className="fw-bold text-danger d-none d-md-block">
              LUCKNOW <span className="text-success">HERITAGE HOSPITAL</span>
            </span>
          )}
        </div>
        <div 
          className="d-flex gap-4 align-items-center small text-muted navbar-contact-details" 
          style={{ }}
        >
          <div><FaPhone className="me-1" /> {contactDetails.Emergency || t('Phone')}</div>
          <div><FaMapMarkerAlt className="me-1" /> {contactDetails.Location || t('Location')}</div>
          <div><FaClock className="me-1" /> {contactDetails.WorkHour || t('Work Hour')}</div>
          <NavDropdown
            title={i18n.language.toUpperCase()}
            align="end"
            className="ms-3"
            menuVariant="light"
            style={{ zIndex: 1050, position: 'relative' }}
          >
            {['en', 'hi', 'ta', 'kn'].map((lang) => (
              <NavDropdown.Item key={lang} onClick={() => changeLanguage(lang)}>
                {lang.toUpperCase()}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        expand="md"
        bg="primary"
        variant="dark"
        sticky="top"
        style={{ zIndex: 1030, position: 'relative' }}
      >
        <Container>
          <Navbar.Brand className="d-md-none">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                style={{ height: '44px', width: '150px' }}
              />
            ) : (
              <span className="text-white">LUCKNOW <span className="text-success">HERITAGE</span></span>
            )}
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" active={location.pathname === '/'}>{t('Home')}</Nav.Link>
              <Nav.Link as={Link} to="/about" active={location.pathname === '/about'}>{t('About us')}</Nav.Link>
              <Nav.Link as={Link} to="/services" active={location.pathname === '/services'}>{t('Services')}</Nav.Link>
              <Nav.Link as={Link} to="/doctors" active={location.pathname === '/doctors'}>{t('Doctors')}</Nav.Link>
              <Nav.Link as={Link} to="/news" active={location.pathname === '/news'}>{t('News')}</Nav.Link>
              <Nav.Link as={Link} to="/contact" active={location.pathname === '/contact'}>{t('Contact')}</Nav.Link>
            </Nav>

            <div className="d-flex align-items-center gap-3">
              <FaSearch style={{ color: '#fff', cursor: 'pointer' }} />
              <Button as={Link} to="/appointment" variant="info" className="rounded-pill px-4">{t('Appointment')}</Button>
              {profileEmail ? (
                <>
                  <span
                    onClick={handleProfileClick}
                    title={t('Dashboard')}
                    className="text-white fw-semibold"
                    style={{ cursor: 'pointer' }}
                  >
                    {fullName}
                  </span>
                  <Button variant="danger" size="sm" onClick={handleLogout}>
                    {t('Logout')}
                  </Button>
                </>
              ) : (
                <Nav.Link as={Link} to="/hospital-login" className="text-white">
                  {t('Hospital Login')}
                </Nav.Link>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <style>
      {`
      @media (max-width: 576px) {
        .navbar-contact-details {
          font-size: 9px !important;
        }
      }

    @media (max-width: 500px) {
        .navbar-contact-details {
          font-size: 8px !important;
        }
      }
    @media (max-width: 400px) {
        .navbar-contact-details {
          font-size: 7px !important;
        }
      }
      

      `}      </style>
    </>
  );
};

export default HospitalNavbar;
