import React, { useState, useEffect, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.css';
import Preloader from '../Preloader';
import { useAuth } from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const menuItems = [
    { path: '/', icon: 'fa fa-chart-bar', text: 'Dashboard' },
    { path: '/gestor', icon: 'fa fa-users', text: 'Gestores' },
    { path: '/motorista', icon: 'fa fa-id-card', text: 'Motoristas' },
    { path: '/frota', icon: 'fa fa-car', text: 'Frotas' },
    { path: '/evento', icon: 'fa fa-calendar', text: 'Eventos' }
  ];

  const handleLogout = () => {
    document.cookie = "TrackFleetToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login'
  }

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Sidebar desktop */}
      <aside className="layout-sidebar-desktop d-none d-md-flex flex-column justify-content-between">
        <div>
          <div className="layout-logo-box">
            <div className="layout-logo-icon">
              <i className="fa fa-truck" style={{ fontSize: 20, color: '#fff' }}></i>
            </div>
            <div>
              <div className="layout-logo-title">TrackFleet</div>
              <div className="layout-logo-desc">Sistema de Controle de Frotas</div>
            </div>
          </div>
          <nav className="layout-menu">
            <ul>
              {menuItems.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className={`layout-menu-link${location.pathname === item.path ? ' active' : ''}`}
                  >
                    <i className={`${item.icon}`}></i>
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="layout-sidebar-footer">
          <FontAwesomeIcon icon={faUser} style={{ fontSize: 26, color: '#888', borderRadius: '50%' }} />          <div>
            <div className="footer-name">{user?.firstName} {user?.lastName}</div>
            <div className="footer-email">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="logout-btn"
            title="Sair"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>

        </div>
      </aside>


      {/* Sidebar mobile/topbar */}
      <aside className="layout-topbar-mobile d-flex d-md-none flex-column justify-content-between position-fixed bg-white">
        <div className="d-flex align-items-center justify-content-between w-100" style={{ height: 60 }}>
          <div className="layout-logo-box">
            <div className="layout-logo-icon-mobile">
              <i className="fa fa-truck" style={{ fontSize: 18, color: '#fff' }}></i>
            </div>
            <span style={{ fontWeight: 600, fontSize: 15 }}>TrackFleet</span>
          </div>
          <button
            className="layout-hamburger-btn btn btn-link p-0 ms-2"
            onClick={() => setShowSidebar(true)}
            aria-label="Abrir menu"
          >
            <i className="fa fa-bars"></i>
          </button>
        </div>
      </aside>
      {showSidebar && (
        <div
          className="layout-offcanvas-bg"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="layout-offcanvas"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <div className="layout-logo-box">
                <div className="layout-logo-icon-mobile">
                  <i className="fa fa-truck" style={{ fontSize: 18, color: '#fff' }}></i>
                </div>
                <span style={{ fontWeight: 600, fontSize: 15 }}>TrackFleet</span>
              </div>
              <nav className="layout-menu">
                <ul>
                  {menuItems.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        to={item.path}
                        className={`layout-menu-link${location.pathname === item.path ? ' active' : ''}`}
                        onClick={() => setShowSidebar(false)}
                      >
                        <i className={`${item.icon}`}></i>
                        <span>{item.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="layout-sidebar-footer" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FontAwesomeIcon icon={faUser} style={{ fontSize: 26, color: '#888', borderRadius: '50%' }} />
              <div>
                <div className="footer-name">{user?.firstName} {user?.lastName}</div>
                <div className="footer-email">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="logout-btn"
                title="Sair"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Conteúdo principal */}
      <main className="layout-main w-100">
        <div className="layout-greeting">
          Bem Vindo, <span style={{ fontWeight: 700 }}>{user?.firstName}!</span>
        </div>
        {children}
      </main>
    </div>
  );
};

export default Layout; 