import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * MainLayout — Wraps all authenticated pages
 * Provides consistent Navbar + Footer + content area
 * 
 * Uses React Router's <Outlet /> to render nested route content
 */
function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--color-bg-body)' }}>
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
