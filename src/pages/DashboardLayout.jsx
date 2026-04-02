import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.svg';
import { ExamConfigProvider } from '../context/Examconfigcontext';
import { QuestionsProvider } from '../context/QuestionsContext';
import { ExamListProvider } from '../context/ExamListContext';
import { UserProvider, useUser } from '../context/UserContext';
import { apiFetch } from '../api';

import {
  ClipboardList, PenLine, Eye,
  LayoutGrid, CheckSquare, BarChart3, Menu, ChevronDown, BookOpen, LogOut
} from 'lucide-react';

const responsiveStyles = `
  .sidebar { width: 260px; transform: translateX(0); transition: transform 0.3s ease, width 0.3s ease; }
  .main-content { margin-left: 260px; }
  .mobile-topbar { display: none !important; }
  .desktop-header { display: flex !important; }

  @media (max-width: 1024px) and (min-width: 768px) {
    .sidebar { width: 80px; }
    .sidebar .nav-label { display: none; }
    .sidebar .logo-circle { width: 56px !important; height: 56px !important; margin-bottom: 24px !important; }
    .sidebar .logo-circle img { width: 40px !important; }
    .main-content { margin-left: 80px; }
    .exam-selector-chevron { display: none !important; }
  }

  @media (max-width: 767px) {
    .sidebar { transform: translateX(-100%); position: fixed !important; z-index: 300; width: 260px !important; top: 0; left: 0; height: 100vh; }
    .sidebar.open { transform: translateX(0); }
    .main-content { margin-left: 0 !important; }
    .mobile-topbar { display: grid !important; grid-template-columns: 1fr auto 1fr; align-items: center; height: 68px; padding: 0 16px; background: #fff; border-bottom: 1.5px solid #ceedf8; box-shadow: 0 2px 10px rgba(5,59,118,0.07); box-sizing: border-box; width: 100%; }
    .desktop-header { display: none !important; }
    .topbar-left  { display: flex; align-items: center; justify-content: flex-start; }
    .topbar-mid   { display: flex; align-items: center; justify-content: center; }
    .topbar-right { display: flex; align-items: center; justify-content: flex-end; }
  }

  .exam-dropdown { position: absolute; left: 12px; right: 12px; top: calc(100% + 6px); background: #fff; border-radius: 14px; box-shadow: 0 8px 28px rgba(5,59,118,0.20); overflow: hidden; z-index: 400; animation: examDropIn 0.17s ease; }
  @keyframes examDropIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  .exam-dropdown-item { display: flex; align-items: center; gap: 10px; padding: 11px 14px; color: #053B76; font-weight: 600; font-size: 0.86rem; text-decoration: none; transition: background 0.13s; border-bottom: 1px solid #f0f7ff; }
  .exam-dropdown-item:last-child { border-bottom: none; }
  .exam-dropdown-item:hover { background: #f4faff; }
  .exam-dropdown-item.active { background: #e8f6ff; color: #0B96D9; font-weight: 700; }
  .exam-dropdown-item .opt-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .exam-dropdown-item:not(.active) .opt-icon { background: #f4faff; color: #6B8DB2; }
  .exam-dropdown-item.active .opt-icon { background: #0B96D9; color: #fff; }

  .nav-divider { height: 1px; background: rgba(255,255,255,0.2); margin: 6px 0; border-radius: 1px; }

  .logout-btn {
    background: rgba(255,255,255,0.12) !important;
    box-shadow: none;
    transition: all 0.25s ease !important;
  }
  .logout-btn:hover, .logout-btn:focus {
    background: rgba(255,255,255,0.25) !important;
    color: #fff !important;
    box-shadow: 0 4px 18px rgba(5, 59, 118, 0.35) !important;
    outline: none;
    transform: translateY(-1px);
  }
  .logout-btn:active {
    background: rgba(255,255,255,0.35) !important;
    transform: translateY(0px);
    box-shadow: 0 2px 8px rgba(5, 59, 118, 0.20) !important;
  }
`;

const examSubItems = [
  { label: "Create an exam",   path: "/dashboard/exam-config",  icon: <ClipboardList size={16} /> },
  { label: "Add questions",    path: "/dashboard/questions",    icon: <PenLine size={16} /> },
  { label: "Question sheet",   path: "/dashboard/preview",      icon: <Eye size={16} /> },
  { label: "Grid sheet",       path: "/dashboard/grid-preview", icon: <LayoutGrid size={16} /> },
  { label: "Correction sheet", path: "/dashboard/correction",   icon: <CheckSquare size={16} /> },
];

function ExamSelectorNavItem({ location, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const activeSub = examSubItems.find(i => location.pathname.includes(i.path));
  const isAnyActive = Boolean(activeSub);
  const displayLabel = activeSub ? activeSub.label : "Create an exam";
  const displayIcon  = activeSub ? activeSub.icon  : <ClipboardList size={18} />;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '11px 10px', borderRadius: 14, border: 'none', fontFamily: 'inherit', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', transition: 'all 0.2s', background: isAnyActive ? '#fff' : 'transparent', color: isAnyActive ? '#0B96D9' : '#fff', boxShadow: isAnyActive ? '0 2px 10px rgba(5,59,118,0.12)' : 'none', borderBottom: isAnyActive ? '3px solid #0a7dbf' : '3px solid transparent' }}>
        <span style={{ display: 'flex', flexShrink: 0 }}>{displayIcon}</span>
        <span className="nav-label" style={{ flex: 1, textAlign: 'center' }}>{displayLabel}</span>
        <ChevronDown size={14} className="exam-selector-chevron" style={{ color: isAnyActive ? '#0B96D9' : 'rgba(255,255,255,0.75)', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>

      {open && (
        <div className="exam-dropdown">
          {examSubItems.map(item => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link key={item.path} to={item.path} className={`exam-dropdown-item${isActive ? ' active' : ''}`} onClick={() => { setOpen(false); onNavigate(); }}>
                <div className="opt-icon">{item.icon}</div>
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Avatar({ size = 40 }) {
  const { user, initials } = useUser();
  if (user.avatar) {
    return <img src={user.avatar} alt="avatar" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', flexShrink: 0 }} />;
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #053B76, #0B96D9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: size * 0.35, border: '2px solid #fff', flexShrink: 0 }}>
      {initials}
    </div>
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
  const navigate  = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Protect route ──
  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      navigate('/signin', { replace: true });
    }
  }, []);

  const otherNavItems = [
    { label: "Exam List",  path: "/dashboard/exam-list",   icon: <BookOpen size={18} /> },
    { label: "Statistic",  path: "/dashboard/statistics",  icon: <BarChart3 size={18} /> },
  ];

  async function handleLogout() {
    setSidebarOpen(false);
    try {
      await apiFetch('/api/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') }),
      });
    } catch (_) {}
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/signin');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F5FA', position: 'relative' }}>
      <style>{responsiveStyles}</style>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.38)', zIndex: 200, cursor: 'pointer' }} />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', position: 'fixed', height: '100vh', top: 0, left: 0, background: 'linear-gradient(180deg, #38B6FF 0%, #0B96D9 100%)', borderRadius: '0 30px 30px 0', boxShadow: '4px 0 24px rgba(5,59,118,0.13)', overflowY: 'auto' }}>
        <div className="logo-circle" style={{ background: '#fff', borderRadius: '50%', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, flexShrink: 0, boxShadow: '0 4px 16px rgba(5,59,118,0.12)' }}>
          <img src={logo} alt="QuiZor" style={{ width: 85, height: 'auto', objectFit: 'contain' }} />
        </div>

        <nav style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, padding: '0 12px', flex: 1 }}>
          <ExamSelectorNavItem location={location} onNavigate={() => setSidebarOpen(false)} />
          <div className="nav-divider" />

          {otherNavItems.map(item => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link key={item.label} to={item.path} onClick={() => setSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '11px 10px', borderRadius: 14, textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem', transition: 'all 0.2s', background: isActive ? '#fff' : 'transparent', color: isActive ? '#0B96D9' : '#fff', boxShadow: isActive ? '0 2px 10px rgba(5,59,118,0.12)' : 'none', borderBottom: isActive ? '3px solid #0a7dbf' : '3px solid transparent' }}>
                <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                <span className="nav-label" style={{ flex: 1, textAlign: 'center' }}>{item.label}</span>
              </Link>
            );
          })}

          <div style={{ flex: 1 }} />
          <div className="nav-divider" />

          <button className="logout-btn" onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '11px 10px', borderRadius: 14, border: 'none', fontFamily: 'inherit', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', transition: 'all 0.25s ease', marginBottom: 4 }}>
            <span style={{ display: 'flex', flexShrink: 0 }}><LogOut size={18} /></span>
            <span className="nav-label" style={{ flex: 1, textAlign: 'center' }}>Log out</span>
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="mobile-topbar">
          <div className="topbar-left">
            <button onClick={() => setSidebarOpen(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#053B76', display: 'flex', alignItems: 'center', padding: 6, borderRadius: 8 }}>
              <Menu size={26} />
            </button>
          </div>
          <div className="topbar-mid">
            <img src={logo} alt="QuiZor" style={{ height: 38, objectFit: 'contain' }} />
          </div>
          <div className="topbar-right"><HeaderUser /></div>
        </div>

        <header className="desktop-header" style={{ height: 80, alignItems: 'center', justifyContent: 'flex-end', padding: '0 40px', flexShrink: 0 }}>
          <HeaderUser />
        </header>

        <div style={{ flex: 1, padding: '0 32px 32px', display: 'flex', overflow: 'auto' }}>
          <ExamConfigProvider>
            <QuestionsProvider>
              <ExamListProvider>
                <Outlet />
              </ExamListProvider>
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