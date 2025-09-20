import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import Contact from '../sections/Contact';
import { FaSearch, FaCalendarAlt, FaUser, FaEye, FaHeart, FaChevronRight } from 'react-icons/fa';
import '../../components/css/newspage.css';

function News() {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError('');
      try {
        const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';
        const response = await fetch('https://cms-dev.seidrtech.ai/api/news11?populate=*', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch news.');
        const data = await response.json();
        setNews(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError('Error loading news.');
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <div className="news-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="news-hero">
        <div className="container">
          <h1>{t('News & Articles')}</h1>
          <div className="breadcrumb">
            <a href="/">{t('Home')}</a> / {t('News')}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="news-container">
        <div className="container">
          <div className="news-content">
            {/* News Posts */}
            <div className="blog-posts">
              {loading && <p>{t('Loading news...')}</p>}
              {error && <p style={{ color: 'red' }}>{t('Error loading news.')}</p>}
              {!loading && !error && news.map((item) => {
                let imageUrl = null;
                const imgAttr = item.attributes.picimage?.data?.[0]?.attributes;
                if (imgAttr) {
                  if (imgAttr.formats?.large?.url) {
                    imageUrl = imgAttr.formats.large.url;
                  } else if (imgAttr.formats?.medium?.url) {
                    imageUrl = imgAttr.formats.medium.url;
                  } else if (imgAttr.formats?.small?.url) {
                    imageUrl = imgAttr.formats.small.url;
                  } else if (imgAttr.formats?.thumbnail?.url) {
                    imageUrl = imgAttr.formats.thumbnail.url;
                  } else if (imgAttr.url) {
                    imageUrl = imgAttr.url;
                  }
                }
                const author = item.attributes.author || t('Admin');
                const translatedHeading = t(item.attributes.news_heading);
                const translatedExcerpt = t(item.attributes.News);
                return (
                  <article key={item.id} className="blog-post">
                    <div className="post-thumbnail">
                      {imageUrl ? <img src={imageUrl} alt={t('News Post')} /> : <div style={{ height: '192px', background: '#f0f0f0' }} />}
                    </div>
                    <div className="post-content">
                      <div className="post-meta">
                        <span><FaCalendarAlt /> {new Date(item.attributes.PUBLISHED).toLocaleDateString()}</span>
                        <span><FaUser /> {t('By')} {author}</span>
                        <span><FaEye /> {item.attributes.VIEWS}</span>
                        <span><FaHeart /> {item.attributes.LIKES}</span>
                      </div>
                      <h2 className="post-title">{translatedHeading}</h2>
                      <p className="post-excerpt">{translatedExcerpt}</p>
                      <a href="#" className="read-more">
                        {t('Read More')} <FaChevronRight />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Sidebar */}
            <aside className="blog-sidebar">
              {/* Search Widget */}
              <div className="sidebar-widget">
                <h3 className="widget-title">{t('Search')}</h3>
                <div className="search-form">
                  <input type="text" placeholder={t('Search...')} />
                  <button type="submit"><FaSearch /></button>
                </div>
              </div>

              {/* Recent Posts */}
              <div className="sidebar-widget">
                <h3 className="widget-title">{t('Recent Posts')}</h3>
                <ul className="recent-posts">
                  {news.map((item) => (
                    <li key={item.id} className="recent-post-item">
                      <a href="#" className="recent-post-link">{item.attributes.news_heading}</a>
                      <span className="post-date">{new Date(item.attributes.PUBLISHED).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div className="sidebar-widget">
                <h3 className="widget-title">{t('Categories')}</h3>
                <ul className="categories-list">
                  <li className="category-item">
                    <a href="#" className="category-link">
                      <FaChevronRight className="category-icon" />
                      <span>{t('Cardiology')}</span>
                      <span className="category-count">(5)</span>
                    </a>
                  </li>
                  <li className="category-item">
                    <a href="#" className="category-link">
                      <FaChevronRight className="category-icon" />
                      <span>{t('Neurology')}</span>
                      <span className="category-count">(8)</span>
                    </a>
                  </li>
                  <li className="category-item">
                    <a href="#" className="category-link">
                      <FaChevronRight className="category-icon" />
                      <span>{t('Dental Care')}</span>
                      <span className="category-count">(3)</span>
                    </a>
                  </li>
                  <li className="category-item">
                    <a href="#" className="category-link">
                      <FaChevronRight className="category-icon" />
                      <span>{t('Eye Care')}</span>
                      <span className="category-count">(6)</span>
                    </a>
                  </li>
                  <li className="category-item">
                    <a href="#" className="category-link">
                      <FaChevronRight className="category-icon" />
                      <span>{t('General Health')}</span>
                      <span className="category-count">(12)</span>
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Contact />
      <Footer />
    </div>
  );
}

export default News;
