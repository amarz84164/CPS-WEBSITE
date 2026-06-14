/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, User, Lock, ArrowLeft, ArrowRight, BookOpen, Sparkles, Upload, FileCheck, CheckCircle, ChevronDown, ChevronUp, Key, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole, Teacher } from '../types';
import { getTeachers, getStudents, addTeacher } from '../lib/schoolStorage';
import SchoolLogo from './SchoolLogo';

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
  const [showAccountsDir, setShowAccountsDir] = useState(false);
  
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

  // Robust finder to match student by ID, Admission Number, Phone or Username
  const findStudent = (inputVal: string) => {
    const cleanInput = inputVal.trim().toLowerCase();
    const normalize = (num: string) => num.replace(/[^0-9]/g, '');
    const inputNormalized = normalize(cleanInput);

    return students.find(s => {
      // 1. ID matching (case insensitive)
      const idMatch = s.id.toLowerCase() === cleanInput;
      
      // 2. Admission Number matching (case insensitive)
      const admissionMatch = s.admissionNo.toLowerCase() === cleanInput;
      
      // 3. Username matching (case insensitive)
      const usernameMatch = s.username.toLowerCase() === cleanInput;
      
      // 4. Raw phone match
      const rawPhoneMatch = s.phone.toLowerCase() === cleanInput;

      // 5. Phone matching with digit normalization
      let phoneMatch = false;
      if (inputNormalized) {
        const studentNormalized = normalize(s.phone);
        phoneMatch = studentNormalized && (
          studentNormalized === inputNormalized || 
          studentNormalized.endsWith(inputNormalized) || 
          inputNormalized.endsWith(studentNormalized)
        );
      }

      return idMatch || admissionMatch || usernameMatch || rawPhoneMatch || phoneMatch;
    });
  };

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
      const inputVal = username.trim().toLowerCase();
      const enteredPass = password.trim().toLowerCase();
      const match = teachers.find(t => 
        t.username.toLowerCase() === inputVal || 
        t.id.toLowerCase() === inputVal ||
        (t.empNo && t.empNo.toLowerCase() === inputVal)
      );
      if (match) {
        const expectedId = match.id.toLowerCase();
        const expectedEmpNo = (match.empNo || '').toLowerCase();
        const expectedPassword = (match.password || '').toLowerCase();
        
        if (enteredPass === expectedPassword || enteredPass === expectedId || enteredPass === expectedEmpNo) {
          onLoginSuccess('teacher', match.id);
          return;
        }
      }
      setErrorMsg('Invalid teacher credentials. Try signing in with either your Username or Teacher ID (e.g. "T01") and your registered password.');
    } else if (selectedTab === 'student') {
      const inputVal = username.trim();
      const enteredPass = password.trim().toLowerCase();

      const match = findStudent(inputVal);

      if (match) {
        const expectedId = match.id.toLowerCase();
        const expectedAdmissionNo = match.admissionNo.toLowerCase();
        const expectedPassword = (match.password || '').toLowerCase(); // fallback

        if (enteredPass === expectedId || enteredPass === expectedAdmissionNo || enteredPass === expectedPassword) {
          onLoginSuccess('student', match.id);
          return;
        }
      }
      setErrorMsg('Invalid credentials. Student/Parent can sign in with their registered Phone Number, Student ID (e.g. "S08") or Username, and password/ID.');
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
        const found = teachers.find(t => 
          t.username.toLowerCase() === user.trim().toLowerCase() ||
          t.id.toLowerCase() === user.trim().toLowerCase() ||
          (t.empNo && t.empNo.toLowerCase() === user.trim().toLowerCase())
        ) || teachers[0];
        onLoginSuccess('teacher', found.id);
      } else if (role === 'student') {
        const found = findStudent(user) || students[0];
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
            <SchoolLogo className="w-12 h-12 drop-shadow-md" />
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
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {selectedTab === 'student' ? 'Registered Phone Number' : selectedTab === 'teacher' ? 'Username or Teacher ID' : 'Username / Identifier'}
                  </label>
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
                        selectedTab === 'teacher' ? 'e.g. T01 or sarahj' :
                        'e.g. +1 (555) 987-6543'
                      }
                      className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#800000] bg-slate-50/50"
                      id="login-username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {selectedTab === 'student' ? 'Student ID (or Admission No.)' : 'Password Credentials'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        selectedTab === 'student' ? 'e.g. S08 or ADM2020-C10-601' : 'Password'
                      }
                      className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#800000] bg-slate-50/50"
                      id="login-password"
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2 bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1.5 leading-relaxed">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#800000] shrink-0" />
                      Only school administrators are authorized to add or register new students, parents, and teachers.
                    </span>
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
                type="button"
                onClick={() => handleQuickDemoLogin('admin', 'admin', 'admin')}
                className="bg-rose-50 hover:bg-rose-100/90 text-rose-950 font-bold p-2 rounded-xl border border-rose-100 flex flex-col items-center justify-center gap-0.5 transition-colors text-center cursor-pointer text-[10px]"
                id="quick-login-admin"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#800000]" />
                <span>Admin Dashboard</span>
                <span className="text-[8px] text-[#800000] font-mono font-bold">admin / admin</span>
              </button>

              <button 
                type="button"
                onClick={() => handleQuickDemoLogin('teacher', 'T01', 'sarah123')}
                className="bg-amber-50/40 hover:bg-amber-100/60 text-amber-950 font-bold p-2 rounded-xl border border-amber-200 flex flex-col items-center justify-center gap-0.5 transition-colors text-center cursor-pointer text-[10px]"
                id="quick-login-teacher"
              >
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Sarah (Teacher)</span>
                <span className="text-[8px] text-amber-700 font-mono font-bold">T01 / sarah123</span>
              </button>

              <button 
                type="button"
                onClick={() => handleQuickDemoLogin('student', '+1 (555) 987-6543', 'S08')}
                className="bg-rose-50/80 hover:bg-rose-100 text-rose-950 font-bold p-2 rounded-xl border border-rose-200 flex flex-col items-center justify-center gap-0.5 transition-colors text-center cursor-pointer text-[10px]"
                id="quick-login-student"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#800000]" />
                <span>Alex (Student)</span>
                <span className="text-[8px] text-rose-700 font-mono font-bold">+1 (555) 987-6543 / S08</span>
              </button>

            </div>

            {/* FULL ACCOUNTS DIRECTORY FOR DEMO */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAccountsDir(!showAccountsDir)}
                className="w-full flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-slate-50 hover:bg-slate-100 p-2 rounded-lg transition-colors cursor-pointer border border-slate-150"
              >
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Key className="w-3.5 h-3.5 text-[#800000]" />
                  View All Individual Logins ({teachers.length} Teachers, {students.length} Students)
                </span>
                {showAccountsDir ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showAccountsDir && (
                <div className="mt-2 bg-slate-50 border border-slate-150 p-3 rounded-xl max-h-56 overflow-y-auto space-y-3 shadow-inner text-[10px]">
                  
                  {/* Teachers Directory */}
                  <div>
                    <h5 className="font-extrabold text-[#800000] border-b border-slate-200 pb-1 mb-1.5 uppercase tracking-wide">
                      Faculty / Teachers ({teachers.length})
                    </h5>
                    <div className="space-y-1">
                      {teachers.map(t => (
                        <div 
                          key={t.id}
                          onClick={() => handleQuickDemoLogin('teacher', t.id, t.password || 'sarah123')}
                          className="flex items-center justify-between p-1.5 bg-white border border-slate-100 rounded-lg hover:border-[#800000] hover:bg-rose-50/30 transition-all cursor-pointer group"
                        >
                          <div>
                            <span className="font-bold text-slate-800">{t.name}</span>
                            <span className="text-slate-405 font-medium ml-1">({t.designation.split('&')[0]})</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] text-slate-700 font-semibold group-hover:bg-rose-100/50">
                              ID: {t.id}
                            </span>
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] text-slate-600 font-semibold group-hover:bg-rose-100/50">
                              P: {t.password || 'sarah123'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Students Directory */}
                  <div>
                    <h5 className="font-extrabold text-indigo-700 border-b border-slate-200 pb-1 mb-1.5 uppercase tracking-wide">
                      Students / Parents ({students.length})
                    </h5>
                    <div className="space-y-1">
                      {students.map(s => (
                        <div 
                          key={s.id}
                          onClick={() => handleQuickDemoLogin('student', s.phone, s.id)}
                          className="flex items-center justify-between p-1.5 bg-white border border-slate-100 rounded-lg hover:border-[#800000] hover:bg-rose-50/30 transition-all cursor-pointer group"
                        >
                          <div>
                            <span className="font-bold text-slate-800">{s.name}</span>
                            <span className="text-indigo-650 font-bold bg-indigo-50 px-1 py-0.2 rounded text-[8px] ml-1.5">{s.classId}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] text-slate-700 font-semibold group-hover:bg-rose-100/50">
                              Phone: {s.phone}
                            </span>
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] text-slate-600 font-semibold group-hover:bg-rose-100/50">
                              ID: {s.id}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
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
