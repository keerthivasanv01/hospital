import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { IntlProvider } from 'react-intl';
import 'bootstrap/dist/css/bootstrap.min.css';

const locale = localStorage.getItem('i18nextLng') || 'en';

// Add messages definition
const messages = {}; // or provide default messages for supported locales

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <IntlProvider 
        locale={locale} 
        messages={messages}
        defaultLocale="en"
        onError={(err) => {
          
          if (process.env.NODE_ENV === 'development') {
            return;
          }
          console.error('Intl error:', err);
        }}
      >
        <App />
      </IntlProvider>
    </I18nextProvider>
  </React.StrictMode>
);

