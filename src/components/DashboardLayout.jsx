import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import logo from '../assets/Logo.svg';
import { ExamConfigProvider } from '../context/Examconfigcontext';
import { QuestionsProvider }  from '../context/QuestionsContext';
import { UserProvider, useUser } from '../context/UserContext';

import {
  ClipboardList, PenLine, Eye,
  LayoutGrid, CheckSquare, BarChart3, Menu
} from 'lucide-react';

const responsiveStyles = `
  /* ── Desktop ── */
  .sidebar { width: 260px; transform: translateX(0); transition: transform 0.3s ease, width 0.3s ease; }
  .main-content { margin-left: 260px; }
  .mobile-topbar { display: none !important; }
  .desktop-header { display: flex !important; }

  /* ── iPad (768–1024px) ── */
  @media (max-width: 1024px) and (min-width: 768px) {
    .sidebar { width: 80px; }
    .sidebar .nav-label { display: none; }
    .sidebar .logo-circle { width: 56px !important; height: 56px !important; margin-bottom: 24px !important; }
    .sidebar .logo-circle img { width: 40px !important; }
    .main-content { margin-left: 80px; }
  }

  /* ── Mobile (<768px) ── */
  @media (max-width: 767px) {
    .sidebar {
      transform: translateX(-100%);
      position: fixed !important;
      z-index: 300;
      width: 260px !important;
      top: 0; left: 0; height: 100vh;
    }
    .sidebar.open { transform: translateX(0); }
    .main-content { margin-left: 0 !important; }
    .mobile-topbar {
      display: grid !important;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      height: 68px;
      padding: 0 16px;
      background: #fff;
      border-bottom: 1.5px solid #ceedf8;
      box-shadow: 0 2px 10px rgba(5,59,118,0.07);
      box-sizing: border-box;
      width: 100%;
    }
    .desktop-header { display: none !important; }
    .topbar-left  { display: flex; align-items: center; justify-content: flex-start; }
    .topbar-mid   { display: flex; align-items: center; justify-content: center; }
    .topbar-right { display: flex; align-items: center; justify-content: flex-end; }
  }
`;

function Avatar({ size = 40 }) {
  const { user, initials } = useUser();
  if (user.avatar) {
    return <img src={user.avatar} alt="avatar" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', flexShrink: 0 }} />;
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #053B76, #0B96D9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.35,
      border: '2px solid #fff', flexShrink: 0,
    }}>{initials}</div>
  );
}

function HeaderUser() {
  const { displayName } = useUser();
  return (
    <Link to="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <span style={{ fontWeight: 700, color: '#053B76', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{displayName}</span>
      <Avatar size={40} />
    </Link>
  );
}

function DashboardInner() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Create an exam",    path: "/dashboard/exam-config",  icon: <ClipboardList size={18} /> },
    { label: "Add questions",     path: "/dashboard/questions",    icon: <PenLine size={18} /> },
    { label: "Question preview",  path: "/dashboard/preview",      icon: <Eye size={18} /> },
    { label: "Grid exam preview", path: "/dashboard/grid-preview", icon: <LayoutGrid size={18} /> },
    { label: "Correction sheet",  path: "/dashboard/correction",   icon: <CheckSquare size={18} /> },
    { label: "Statistic",         path: "/dashboard/statistics",   icon: <BarChart3 size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F5FA', position: 'relative' }}>
      <style>{responsiveStyles}</style>

      {/* Overlay — only in DOM when sidebar open */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.38)',
          zIndex: 200, cursor: 'pointer',
        }} />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '24px 0', position: 'fixed', height: '100vh', top: 0, left: 0,
          background: 'linear-gradient(180deg, #38B6FF 0%, #0B96D9 100%)',
          borderRadius: '0 30px 30px 0',
          boxShadow: '4px 0 24px rgba(5,59,118,0.13)',
          overflowY: 'auto',
        }}
      >
        <div className="logo-circle" style={{
          background: '#fff', borderRadius: '50%',
          width: 120, height: 120,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 32, flexShrink: 0,
          boxShadow: '0 4px 16px rgba(5,59,118,0.12)',
        }}>
          <img src={logo} alt="QuiZor" style={{ width: 85, height: 'auto', objectFit: 'contain' }} />
        </div>

        <nav style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, padding: '0 12px', flex: 1 }}>
          {navItems.map(item => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 10, padding: '11px 10px', borderRadius: 14,
                  textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem',
                  transition: 'all 0.2s',
                  background: isActive ? '#fff' : 'transparent',
                  color: isActive ? '#0B96D9' : '#fff',
                  boxShadow: isActive ? '0 2px 10px rgba(5,59,118,0.12)' : 'none',
                  borderBottom: isActive ? '3px solid #0a7dbf' : '3px solid transparent',
                }}
              >
                <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Mobile topbar — hidden by CSS on desktop, shown on mobile */}
        <div className="mobile-topbar">
          {/* Left: hamburger */}
          <div className="topbar-left">
            <button
              onClick={() => setSidebarOpen(s => !s)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#053B76', display: 'flex', alignItems: 'center',
                padding: 6, borderRadius: 8,
              }}
            >
              <Menu size={26} />
            </button>
          </div>

          {/* Center: logo */}
          <div className="topbar-mid">
            <img src={logo} alt="QuiZor" style={{ height: 38, objectFit: 'contain' }} />
          </div>

          {/* Right: name + avatar */}
          <div className="topbar-right">
            <HeaderUser />
          </div>
        </div>

        {/* Desktop header */}
        <header className="desktop-header" style={{
          height: 80, alignItems: 'center',
          justifyContent: 'flex-end', padding: '0 40px', flexShrink: 0,
        }}>
          <HeaderUser />
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: '0 32px 32px', display: 'flex', overflow: 'auto' }}>
          <ExamConfigProvider>
            <QuestionsProvider>
              <Outlet />
            </QuestionsProvider>
          </ExamConfigProvider>
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <UserProvider>
      <DashboardInner />
    </UserProvider>
  );
}