import React, { useEffect, useState } from 'react';
import { FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../css/Footer.css';

const Footer = () => {
  const [footerData, setFooterData] = useState({
    hospitalAddress: '',
    logo: null,
    contactUs: [],
    importantLinks: [],
    email: '',
    newsletter: 'Newsletter',
  });

  useEffect(() => {
    fetch('https://cms-dev.seidrtech.ai/api/lh-hfooters1?populate=*', {
      headers: {
        Authorization: 'Bearer a467086c677778101358dce5f8ae9f8cb21c195dccaa19077b3b29391358154e6d34ae535d6b94358c0be304f79f73aa2c4a53cd19fa4b2abd88deadd222f4469bcd5e98fab68ebf0b58e03debde91eab94c1a2f155786865433136c19233ca50c9aaaea827b03de56a6de475029c804dfca94fe4047fb9891769eb1af4f3193'
      }
    })
      .then(res => res.json())
      .then(data => {
        const attr = data?.data?.[0]?.attributes || {};
        setFooterData({
          hospitalAddress: attr.Hospitalnameandaddress || '',
          logo: attr.logo?.data?.attributes?.url
            ? attr.logo.data.attributes.url
            : null,
          contactUs: attr.ContactUs ? attr.ContactUs.split('\n').filter(Boolean) : [],
          importantLinks: attr.ImportantLinks ? attr.ImportantLinks.split('\n').filter(Boolean) : [],
          email: attr.email || '',
          newsletter: attr.Newsletter || 'Newsletter',
        });
      })
      .catch(() => {});
  }, []);

  return (
    <><footer className="footer" style={{ position: "static", bottom: "0px" }}>
      <div className="footer-container">
        <div className="footer-top">
          {/* Hospital Information */}
          <div className="footer-column">
            {footerData.logo && (
              <div className="footer-logo">
                <img src={footerData.logo} alt="Hospital Logo" style={{ height: 20, marginBottom: 8, width: '250px' }} />
              </div>
            )}
            <div className="footer-logo">

            </div>
            <p className="footer-address">
              {footerData.hospitalAddress}
            </p>
          </div>

          {/* Important Links */}
          <div className="footer-column">
            <h3 className="footer-title">Important Links</h3>
            <ul className="footer-links" style={{ color: 'white' }}>
              {footerData.importantLinks.map((link, idx) => {
                // Map link text to route
                let route = '/';
                if (link.toLowerCase().includes('appointment')) route = '/appointment';
                else if (link.toLowerCase().includes('doctor')) route = '/doctors';
                else if (link.toLowerCase().includes('service')) route = '/services';
                else if (link.toLowerCase().includes('about')) route = '/about';
                return (
                  <li key={idx}><Link to={route}>{link}</Link></li>
                );
              })}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="footer-column">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="contact-info" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, listStyle: 'none' }}>
              {footerData.contactUs.map((phone, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i>📞</i>
                  <span>Phone: {phone.trim()}</span>
                </li>
              ))}
              {footerData.email && (
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i>✉️</i>
                  <span>Email: {footerData.email}</span>
                </li>
              )}
              {footerData.hospitalAddress && (
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i>📍</i>
                  <span>Address: {footerData.hospitalAddress}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-column">
            <h3 className="footer-title">{footerData.newsletter}</h3>
            <form className="newsletter-form">
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email address"
                required />
              <button type="submit" className="newsletter-button">
                <i>✉️</i>
              </button>
            </form>
          </div>
        </div>
        <hr />
        <div className="footer-bottom" style={{ height: '20px', color: 'white' }}>
          <div className="copyright" style={{ position: 'relative', bottom: '50px' }}>
            © 2025 Lucknow Heritage Hospital All Rights Reserved by medihap-apps
          </div>
          <div className="social-links" style={{ backgroundColor: 'none', position: 'relative', bottom: '55px', display: 'flex', gap: '12px', flexDirection: 'row' }}>
            <a href="#linkedin" className="social-link" aria-label="LinkedIn" style={{ backgroundColor: 'none' }}>
              <FaLinkedin />
            </a>
            <a href="#facebook" className="social-link" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#instagram" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer><style>
        {`
        @media (max-width: 800px) {
          .social-links {
            display: none !important;

          }
          hr{
            display: none !important;
          }
        }
        @media (max-width: 576px) {
          .copyright {
            font-size: 9px !important;
            position: relative;
            top: px;
          }
        }

    @media (max-width: 500px) {
        .copyright {
          font-size: 8px !important;
        }
      }
    @media (max-width: 400px) {
        .copyright {
          font-size: 7px !important;
        }
      }
      `}      </style></>
    
  );
};

export default Footer;