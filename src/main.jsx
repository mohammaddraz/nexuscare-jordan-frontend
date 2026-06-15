import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Bootstrap CSS (UI Framework - M3 criterion)
import 'bootstrap/dist/css/bootstrap.min.css';

// NexusCare Jordan custom theme
import './styles/index.css';
import './styles/bootstrap-overrides.css';
import './styles/animations.css';
import './styles/pages.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
