import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import logo from '../assets/Logo.svg';

export default function DashboardLayout() {
  const location = useLocation();

  const navItems = [
    { label: "Create an exam", path: "/dashboard/exam-config" },
    { label: "Add questions", path: "/dashboard/questions" },
    { label: "Question preview", path: "/dashboard/preview" },
    { label: "Grid exam preview", path: "/dashboard/grid-preview" },
    { label: "Correction sheet", path: "/dashboard/correction" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F0F5FA] font-sans">
      {/* SIDEBAR */}
      <aside 
        className="w-[260px] flex flex-col items-center py-6 fixed h-screen top-0 left-0 shadow-xl"
        style={{ background: "linear-gradient(180deg, #38B6FF 0%, #0B96D9 100%)", borderRadius: "0 30px 30px 0", zIndex: 100 }}
      >
        <div className="bg-white rounded-full p-3 mb-10 w-[140px] h-[140px] flex items-center justify-center shadow-lg">
          <img src={logo} alt="QuiZor Logo" className="w-[100px] h-auto object-contain" />
        </div>
        
        <nav className="w-full text-white flex flex-col gap-2 px-4">
          {navItems.map(item => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`w-full text-center py-3 rounded-xl font-bold transition-all ${isActive ? "bg-white text-[#0B96D9] shadow-md border-b-4 border-[#0a7dbf]" : "text-white hover:bg-white/10"}`}
                style={{ fontSize: "1rem" }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto w-full px-4 mb-4">
          <button className="w-full flex items-center justify-center gap-2 bg-white text-[#053B76] py-3 rounded-xl font-bold shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            Statistic
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col ml-[260px]">
        {/* HEADER */}
        <header className="h-[90px] w-full flex items-center justify-end px-10">
          <Link to="/dashboard/profile" className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" style={{ textDecoration: "none" }}>
            <span className="font-bold text-[#053B76] text-lg mt-1">Mohamed Amine</span>
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-[50px] h-[50px] rounded-full object-cover border-2 border-white shadow-md relative top-[-4px]" />
          </Link>
        </header>
        
        {/* PAGE CONTENT */}
        <div className="flex-1 p-8 pt-0 flex overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
