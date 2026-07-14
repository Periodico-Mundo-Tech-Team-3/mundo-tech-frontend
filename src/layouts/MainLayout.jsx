//Main Layout
import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import './MainLayout.scss';

export const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-layout__wrapper">
        <Topbar />
        <main className="main-layout__content" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};