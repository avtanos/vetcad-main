import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from '@/app/router/router';
import { BrowserRouter } from 'react-router-dom';
import './assets/styles/globals.css'
import '@/locale/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.PROD ? "/vetcard-main" : "/"}>
      <Router />
    </BrowserRouter>
  </React.StrictMode>
);