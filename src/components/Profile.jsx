import React, { useState } from 'react';

export default function Profile() {
  const [form, setForm] = useState({
    firstName: "Mohammed",
    lastName: "Amine",
    email: "MohamenAmine@esi-sba.dz",
    password: "**************",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", form);
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm flex items-center justify-center w-full max-w-[1000px] border-4 border-[#ceedf8] py-16 px-12 mx-auto mt-4 self-start">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-12">
        
        {/* LEFT: AVATAR */}
        <div className="flex flex-col items-center gap-6" style={{ width: "35%" }}>
          <div className="relative">
            <img src="https://i.pravatar.cc/300?img=11" alt="Mohamed Amine" className="w-[200px] h-[200px] rounded-full object-cover border-[8px] border-[#ceedf8] shadow-lg" />
            <div className="absolute bottom-3 right-3 bg-[#053B76] text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-[#0a4d95] transition-colors border-4 border-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#053B76]">Mohamed Amine</h2>
        </div>

        {/* RIGHT: FORM */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6" style={{ width: "65%" }}>
          <div className="flex gap-6">
            <div className="w-1/2">
              <label className="block text-[#053B76] font-bold mb-2 ml-1 text-[0.95rem]">First Name</label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="w-full h-[52px] rounded-xl border-2 border-[#0B96D9] px-4 font-semibold text-[#053B76] outline-none focus:ring-4 focus:ring-[#ceedf8]" />
            </div>
            <div className="w-1/2">
              <label className="block text-[#053B76] font-bold mb-2 ml-1 text-[0.95rem]">Last Name</label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="w-full h-[52px] rounded-xl border-2 border-[#0B96D9] px-4 font-semibold text-[#053B76] outline-none focus:ring-4 focus:ring-[#ceedf8]" />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-1/2">
              <label className="block text-[#053B76] font-bold mb-2 ml-1 text-[0.95rem]">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full h-[52px] rounded-xl border-2 border-[#0B96D9] px-4 font-semibold text-[#053B76] outline-none focus:ring-4 focus:ring-[#ceedf8]" />
            </div>
            <div className="w-1/2">
              <label className="block text-[#053B76] font-bold mb-2 ml-1 text-[0.95rem]">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full h-[52px] rounded-xl border-2 border-[#0B96D9] px-4 font-semibold text-[#053B76] outline-none focus:ring-4 focus:ring-[#ceedf8]" />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button type="submit" className="w-[300px] h-[56px] bg-[#053B76] text-white font-bold text-lg rounded-xl shadow-md hover:bg-[#0a4d95] transition-colors border-none cursor-pointer">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
