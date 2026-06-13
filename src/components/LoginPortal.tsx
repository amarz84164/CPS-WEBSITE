/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, User, Lock, ArrowLeft, ArrowRight, BookOpen, Sparkles, Upload, FileCheck, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole, Teacher } from '../types';
import { getTeachers, getStudents, addTeacher } from '../lib/schoolStorage';

interface LoginPortalProps {
  onBackToWeb: () => void;
  onLoginSuccess: (role: UserRole, userId: string) => void;
}

export default function LoginPortal({ onBackToWeb, onLoginSuccess }: LoginPortalProps) {
  const [selectedTab, setSelectedTab] = useState<UserRole>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Registration States
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDesignation, setRegDesignation] = useState('Senior Faculty Coordinator');
  const [regSubjects, setRegSubjects] = useState('Mathematics, Physics');
  const [regClasses, setRegClasses] = useState('Class-IX, Class-X');
  const [regAddress, setRegAddress] = useState('');
  const [regPhoto, setRegPhoto] = useState('');
  const [dragActiveReg, setDragActiveReg] = useState(false);

  // Pre-load users to validate custom credential entry
  const teachers = getTeachers();
  const students = getStudents();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (selectedTab === 'admin') {
      if (username.trim().toLowerCase() === 'admin' && password === 'admin') {
        onLoginSuccess('admin', 'admin_root');
      } else {
        setErrorMsg('Invalid root administrator credentials. Try username "admin", password "admin"');
      }
    } else if (selectedTab === 'teacher') {
      const match = teachers.find(t => t.username.toLowerCase() === username.trim().toLowerCase());
      const expectedPassword = match?.password || 'teacher';
      if (match && password === expectedPassword) {
        onLoginSuccess('teacher', match.id);
      } else {
        setErrorMsg('Invalid teacher credentials. For your registered teacher account, use your set password.');
      }
    } else if (selectedTab === 'student') {
      const match = students.find(s => s.username.toLowerCase() === username.trim().toLowerCase());
      const expectedPassword = match?.password || 'student';
      if (match && password === expectedPassword) {
        onLoginSuccess('student', match.id);
      } else {
        setErrorMsg('Invalid student/parent credentials. For demo try username "student1", password "student"');
      }
    }
  };

  const handleDragReg = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveReg(true);
    } else if (e.type === "dragleave") {
      setDragActiveReg(false);
    }
  };

  const handleDropReg = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveReg(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeacherRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim() || !regUsername.trim() || !regPassword.trim() || !regEmail.trim()) {
      setErrorMsg('Please populate all required fields (Name, Username, Password, and Email)');
      return;
    }

    // Check if username already exists
    const existingTeacher = getTeachers().find(t => t.username.toLowerCase() === regUsername.trim().toLowerCase());
    const existingStudent = getStudents().find(s => s.username.toLowerCase() === regUsername.trim().toLowerCase());
    if (existingTeacher || existingStudent || regUsername.toLowerCase() === 'admin') {
      setErrorMsg(`Username "${regUsername.trim()}" is already registered. Please choose a unique username.`);
      return;
    }

    try {
      const newTeacherObj = addTeacher({
        name: regName.trim(),
        username: regUsername.trim(),
        password: regPassword,
        email: regEmail.trim(),
        phone: regPhone.trim() || 'Not Provided',
        designation: regDesignation.trim(),
        subjects: regSubjects.split(',').map(s => s.trim()).filter(Boolean),
        classes: regClasses.split(',').map(c => c.trim()).filter(Boolean),
        address: regAddress.trim() || 'Chakrapani Das Faculty Quarters',
        photoUrl: regPhoto || undefined
      });

      setSuccessMsg(`Teacher registered successfully! Name: ${newTeacherObj.name} (Employee Code: ${newTeacherObj.empNo}). You can now switch to Login mode and sign in with username: "${newTeacherObj.username}".`);
      
      // Reset fields
      setRegName('');
      setRegUsername('');
      setRegPassword('');
      setRegEmail('');
      setRegPhone('');
      setRegAddress('');
      setRegPhoto('');
    } catch (err: any) {
      setErrorMsg('Failed to register educational profile. ' + (err?.message || err));
    }
  };

  const handleQuickDemoLogin = (role: UserRole, user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setSelectedTab(role);
    setIsRegisterMode(false);
    
    // Auto submit delay
    setTimeout(() => {
      if (role === 'admin') onLoginSuccess('admin', 'admin_root');
      else if (role === 'teacher') {
        const found = teachers.find(t => t.username === user) || teachers[0];
        onLoginSuccess('teacher', found.id);
      } else if (role === 'student') {
        const found = students.find(s => s.username === user) || students[0];
        onLoginSuccess('student', found.id);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c0519] via-[#2d020d] to-zinc-955 flex flex-col justify-between py-8 px-4" id="login-portal-root">
      
      {/* Top Bar back button */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between" id="login-top-bar">
        <button 
          onClick={onBackToWeb}
          className="text-rose-200 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" /> Back to School Website
        </button>
        <span className="text-rose-400 font-mono text-xs hidden sm:inline-block">
          CDPS SECURE PORTAL v1.2
        </span>
      </div>

      {/* Main card box */}
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-6">
        
        {/* Left Side branding details */}
        <div className="md:col-span-5 text-white space-y-6 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#800000] font-display font-black text-lg shadow-md border border-red-900/10">
              CD
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-rose-50">Chakrapani Das Public School Jalah</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-display tracking-tight leading-tight text-white">
              One Unified School Portal
            </h2>
            <p className="text-rose-200/80 text-xs leading-relaxed">
              Log in to access your administrative variables, mark schedules, syllabus breakdowns, and invoice receipts with cryptographic state safety.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs text-rose-200/70 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-455"></span>
              <span>Daily Attendance Automation Tracker</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-455"></span>
              <span>Interactive FA/SA Mark Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-455"></span>
              <span>Detailed Fee Structures & Receipts</span>
            </div>
          </div>
        </div>

        {/* Right Side Credential container */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5 relative overflow-hidden" id="login-container-card">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full filter blur-3xl -z-10 opacity-70"></div>
          
          {/* Header depending on mode */}
          {!isRegisterMode ? (
            <>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Secure Sign-In <Sparkles className="w-4.5 h-4.5 text-[#800000]" />
                </h3>
                <p className="text-slate-500 text-[11px] font-semibold">Select your account authorization category below.</p>
              </div>

              {/* TAB BAR SELECTORS */}
              <div className="bg-slate-100 rounded-xl p-1 grid grid-cols-3 gap-1" id="login-tabs">
                <button
                  id="tab-admin"
                  onClick={() => { setSelectedTab('admin'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedTab === 'admin' 
                      ? 'bg-rose-900 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${selectedTab === 'admin' ? 'text-white' : 'text-[#800000]'}`} /> Admin
                </button>
                <button
                  id="tab-teacher"
                  onClick={() => { setSelectedTab('teacher'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedTab === 'teacher' 
                      ? 'bg-rose-900 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className={`w-3.5 h-3.5 ${selectedTab === 'teacher' ? 'text-white' : 'text-[#800000]'}`} /> Teacher
                </button>
                <button
                  id="tab-student"
                  onClick={() => { setSelectedTab('student'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedTab === 'student' 
                      ? 'bg-rose-900 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <BookOpen className={`w-3.5 h-3.5 ${selectedTab === 'student' ? 'text-white' : 'text-[#800000]'}`} /> Student / Parent
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <h3 className="text-xl font-black text-rose-950 tracking-tight flex items-center gap-2">
                Educator Registration <Sparkles className="w-4.5 h-4.5 text-[#800000]" />
              </h3>
              <p className="text-slate-500 text-[11px] font-semibold">Create your secure teacher credential for grading, attendance, and syllabus tracks.</p>
            </div>
          )}

          {/* DISPATCH MESSAGES */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 text-rose-700 border border-rose-150 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 text-emerald-850 border border-emerald-150 rounded-xl text-xs font-semibold flex items-start gap-2">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN OR REGISTER FORMS */}
          {!isRegisterMode ? (
            <>
              <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Username / Identifier</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      required 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={
                        selectedTab === 'admin' ? 'e.g. admin' :
                        selectedTab === 'teacher' ? 'e.g. teacher1' :
                        'e.g. student1'
                      }
                      className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#800000] bg-slate-50/50"
                      id="login-username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Password Credentials</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#800000] bg-slate-50/50"
                      id="login-password"
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(true);
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-[10px] text-indigo-700 hover:text-indigo-900 font-extrabold cursor-pointer hover:underline text-left"
                    >
                      Are you a Teacher? Register Here →
                    </button>
                    <span className="text-[9px] text-slate-400 font-semibold cursor-pointer">Contact Administration</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#800000] hover:bg-[#660000] text-white font-bold py-2.5 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-transform hover:translate-y-[-0.5px] cursor-pointer"
                  id="login-submit-btn"
                >
                  Sign In to Accounts <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleTeacherRegister} className="space-y-4 max-h-[460px] overflow-y-auto pr-2 scrollbar-thin" id="registration-form">
              
              {/* Photo Upload Zone */}
              <div 
                onDragEnter={handleDragReg}
                onDragOver={handleDragReg}
                onDragLeave={handleDragReg}
                onDrop={handleDropReg}
                className={`border-2 border-dashed rounded-xl p-3 text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  dragActiveReg ? 'border-rose-450 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                {regPhoto ? (
                  <div className="relative">
                    <img src={regPhoto} alt="Upload preview" className="w-14 h-14 rounded-full object-cover border shadow-sm" referrerPolicy="no-referrer" />
                    <button 
                      type="button" 
                      onClick={() => setRegPhoto('')}
                      className="absolute -top-1 -right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full w-4.5 h-4.5 text-[10px] flex items-center justify-center font-bold"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer text-slate-500 text-[11px] flex flex-col items-center w-full">
                    <Upload className="w-5 h-5 text-rose-800 mb-0.5" />
                    <span className="font-semibold text-slate-650">Drag & drop profile picture, or <span className="text-rose-800 font-bold hover:underline">browse</span></span>
                    <span className="text-[9px] text-slate-400">JPG, PNG or WebP</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setRegPhoto(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Grid Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wide mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Dr. Ramesh Chander"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wide mb-1">Designation Title *</label>
                  <input 
                    type="text" 
                    required 
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    placeholder="e.g. Junior Science Associate"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wide mb-1">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ramesh@school.org"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wide mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 94580 12022"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wide mb-1">Desired Username *</label>
                  <input 
                    type="text" 
                    required 
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="e.g. ramesh1"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wide mb-1">Secure Password *</label>
                  <input 
                    type="password" 
                    required 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Set private password"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wide mb-1">Assigned Subjects (comma list)</label>
                  <input 
                    type="text" 
                    value={regSubjects}
                    onChange={(e) => setRegSubjects(e.target.value)}
                    placeholder="e.g. Biology, Chemistry"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wide mb-1">Target Classes (comma list)</label>
                  <input 
                    type="text" 
                    value={regClasses}
                    onChange={(e) => setRegClasses(e.target.value)}
                    placeholder="e.g. Class-IX, Class-XI"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wide mb-1">Residential Address</label>
                <textarea 
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="Street quarters, Pin details..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-[#800000] resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end items-center pt-2">
                <button 
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="px-4 py-2 text-slate-650 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  ← Back to Sign In
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          )}

          {/* SIMULATED QUICK DEMO PROFILE CHANGER (BONUS / DEV UTILITY) */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Quick Interactive Demo profiles</h4>
            <p className="text-[9px] text-slate-400">Click a badge to log in instantly and review that specific interface role.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              
              <button 
                onClick={() => handleQuickDemoLogin('admin', 'admin', 'admin')}
                className="bg-rose-50 hover:bg-rose-100/90 text-rose-950 font-bold p-2 rounded-xl border border-rose-100 flex flex-col items-center justify-center gap-0.5 transition-colors text-center cursor-pointer text-[10px]"
                id="quick-login-admin"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#800000]" />
                <span>Admin Dashboard</span>
                <span className="text-[8px] text-[#800000] font-mono font-bold">admin / admin</span>
              </button>

              <button 
                onClick={() => handleQuickDemoLogin('teacher', 'teacher1', 'teacher')}
                className="bg-amber-50/40 hover:bg-amber-100/60 text-amber-950 font-bold p-2 rounded-xl border border-amber-200 flex flex-col items-center justify-center gap-0.5 transition-colors text-center cursor-pointer text-[10px]"
                id="quick-login-teacher"
              >
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Sarah (Teacher)</span>
                <span className="text-[8px] text-amber-700 font-mono font-bold">teacher1 / teacher</span>
              </button>

              <button 
                onClick={() => handleQuickDemoLogin('student', 'student1', 'student')}
                className="bg-rose-50/80 hover:bg-rose-100 text-rose-950 font-bold p-2 rounded-xl border border-rose-200 flex flex-col items-center justify-center gap-0.5 transition-colors text-center cursor-pointer text-[10px]"
                id="quick-login-student"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#800000]" />
                <span>Alex (Student)</span>
                <span className="text-[8px] text-rose-700 font-mono font-bold">student1 / student</span>
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom info */}
      <div className="text-center text-rose-200/60 text-xs" id="login-footer">
        © Chakrapani Das Public School Jalah Secure Encryption Key. All logins are tracked on system registers.
      </div>

    </div>
  );
}
