import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormattedMessage, FormattedNumber, FormattedDate } from 'react-intl';

const I18nExample = () => {
  const { t, i18n } = useTranslation();
  const currentDate = new Date();
  const amount = 1234.56;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '1.5rem',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        color: '#1F2B6C',
        borderBottom: '2px solid #007bff',
        paddingBottom: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        <FormattedMessage 
          id="i18nExample.title" 
          defaultMessage="Internationalization Example" 
        />
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1rem',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{
            color: '#1F2B6C',
            marginTop: '0',
            borderBottom: '1px solid #dee2e6',
            paddingBottom: '0.5rem'
          }}>
            react-i18next
          </h3>
          
          <p><strong>Simple Text:</strong> {t('welcome')}</p>
          
          <p><strong>With Interpolation:</strong> {t('greeting', { name: 'John' })}</p>
          
          <p><strong>Pluralization:</strong> {t('messages', { count: 5 })}</p>
          
          <p><strong>Date:</strong> {new Intl.DateTimeFormat(i18n.language).format(currentDate)}</p>
          
          <p><strong>Number:</strong> {new Intl.NumberFormat(i18n.language).format(amount)}</p>
        </div>

        <div style={{
          padding: '1rem',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{
            color: '#1F2B6C',
            marginTop: '0',
            borderBottom: '1px solid #dee2e6',
            paddingBottom: '0.5rem'
          }}>
            react-intl (FormatJS)
          </h3>
          
          <p><strong>Simple Text:</strong> <FormattedMessage id="welcome" defaultMessage="Welcome to our application" /></p>
          
          <p><strong>With Values:</strong> <FormattedMessage 
            id="greeting" 
            defaultMessage="Hello, {name}!" 
            values={{ name: 'John' }} 
          /></p>
          
          <p><strong>Pluralization:</strong> <FormattedMessage 
            id="messages" 
            defaultMessage="{count, plural, =0 {No messages} one {# message} other {# messages}}" 
            values={{ count: 5 }} 
          /></p>
          
          <p><strong>Date:</strong> <FormattedDate 
            value={currentDate} 
            year="numeric"
            month="long"
            day="numeric"
            weekday="long"
          /></p>
          
          <p><strong>Number:</strong> <FormattedNumber 
            value={amount} 
            style="currency"
            currency="USD"
          /></p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#e9ecef',
        padding: '1rem',
        borderRadius: '6px',
        fontSize: '0.9rem'
      }}>
        <h4 style={{ marginTop: '0' }}>Which one to use?</h4>
        <p>
          <strong>react-i18next</strong> is great for simple to medium complexity applications.
          It has a simpler API and is easier to set up.
        </p>
        <p>
          <strong>react-intl (FormatJS)</strong> is more powerful for complex internationalization needs,
          with built-in support for number, date, and time formatting, pluralization, and more.
        </p>
        <p>
          In this example, we're using both to show how they can work together. In a real application,
          you would typically choose one based on your needs.
        </p>
      </div>
    </div>
  );
};

export default I18nExample;
