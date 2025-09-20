import React, { useState } from 'react';
import Navbar from '../sections/Navbar';
import Transions from '../js/Transions'; 
import '../css/HospitalLogin.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HospitalLogin = () => {
  const { t } = useTranslation(); 
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.email === '' || form.password === '') {
      setError(t('Please enter both email and password.'));
      return;
    }
    try {
      const response = await fetch('https://devbeapi.lucknowheritagehospital.com/accounts/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        setError('');
        const result = await response.json();
        let group = '';
        let fullName = '';
        let email = '';
        if (Array.isArray(result.data)) {
          group = result.data[0]?.group || '';
          fullName = result.data[0]?.fullName || '';
          email = result.data[0]?.email || form.email;
        } else if (result.data && typeof result.data === 'object') {
          group = result.data.group || result.data.user?.group || '';
          fullName = result.data.fullName || result.data.user?.fullName || '';
          email = result.data.email || result.data.user?.email || form.email;
        }

        localStorage.setItem('profileEmail', email);
        localStorage.setItem('group', group);
        localStorage.setItem('fullName', fullName);
        if (group === 'Normal User') {
          navigate('/user-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(t('Invalid email or password.'));
      }
    } catch (err) {
      setError(t('Login failed. Please try again.'));
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotStatus('');
    if (!forgotEmail) {
      setForgotStatus(t('Please enter your email.'));
      return;
    }
    try {
      const response = await fetch('https://devbeapi.lucknowheritagehospital.com/accounts/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      if (response.ok) {
        setForgotStatus(t('Password reset instructions sent to your email.'));
      } else {
        setForgotStatus(t('Failed to send reset instructions.'));
      }
    } catch {
      setForgotStatus(t('Error sending reset instructions.'));
    }
  };

  return (
    <div className="hospital-login-page">
      <Navbar />
      {/* <Transions /> Add Transions component */}
      <div className="hospital-login-container">
        <form className="hospital-login-form" onSubmit={handleSubmit}>
          <h2>{t('Hospital Login')}</h2>
          {error && <div className="login-error">{error}</div>}
          <div className="form-group">
            <label style={{ color: 'black' }}>{t('Email')}</label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t('Enter your email')}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group">
            <label style={{ color: 'black' }}>{t('Password')}</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t('Enter your password')}
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="login-btn">{t('Login')}</button>
          <div style={{ marginTop: '12px', textAlign: 'right' }}>
            <button
              type="button"
              className="forgot-link"
              style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '14px' }}
              onClick={() => setShowForgot(true)}
            >
              {t('Forgot Password?')}
            </button>
          </div>
        </form>
        {showForgot && (
          <div className="forgot-modal" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}>
            <div style={{
              background: '#fff', padding: '32px 24px', borderRadius: '8px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', minWidth: '320px'
            }}>
              <h3>{t('Forgot Password')}</h3>
              <form onSubmit={handleForgotSubmit}>
                <input
                  type="email"
                  placeholder={t('Enter your email')}
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  required
                />
                <button type="submit" className="login-btn" style={{ width: '100%' }}>{t('Send Reset Link')}</button>
              </form>
              {forgotStatus && <div style={{ marginTop: '10px', color: '#2563eb' }}>{forgotStatus}</div>}
              <button
                type="button"
                style={{ marginTop: '16px', background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '14px' }}
                onClick={() => { setShowForgot(false); setForgotStatus(''); setForgotEmail(''); }}
              >
                {t('Close')}
              </button>
            </div>
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default HospitalLogin;
