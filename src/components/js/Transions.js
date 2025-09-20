import React from 'react';
import { useTranslation } from 'react-i18next';

const Transions = () => {
  const { t, i18n } = useTranslation();

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  React.useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @media (max-width: 576px) {
        .transions-lang-selector {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  return (
    <div
      className="transions-lang-selector"
      style={{
        position: 'fixed',
        top: '0px',
        right: '20px',
        zIndex: 10000,
        background: 'white',
        padding: '6px 12px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        overflow: 'visible',
        pointerEvents: 'auto',
        left: 'auto',
        width: 'auto',
        maxWidth: '90vw',
      }}
    >
      <span style={{ marginRight: 8 }}>{t('Choose Language')}:</span>
      <select
        onChange={handleChange}
        style={{ padding: '4px 10px', borderRadius: 4 }}
      >
        <option value="en">{t('English')}</option>
        <option value="hi">{t('Hindi')}</option>
        <option value="ta">{t('Tamil')}</option>
        <option value="kn">{t('Kannada')}</option>
      </select>
    </div>
  );
};

export default Transions;