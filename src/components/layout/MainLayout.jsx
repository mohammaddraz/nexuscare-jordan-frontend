import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './MainLayout.css';

/**
 * MainLayout — Wraps all authenticated pages
 * Provides consistent Navbar + Footer + content area
 * 
 * Uses React Router's <Outlet /> to render nested route content
 */
function MainLayout() {
  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100 main-layout-wrapper">
      <Navbar />
      <div className="d-flex flex-column flex-grow-1 main-layout-content">
        <main className="flex-grow-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
