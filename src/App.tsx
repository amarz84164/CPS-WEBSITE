/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initializeSchoolStorage } from './lib/schoolStorage';
import { UserRole } from './types';
import PublicWebsite from './components/PublicWebsite';
import LoginPortal from './components/LoginPortal';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'public' | 'login' | 'dashboard'>('public');
  const [userRole, setUserRole] = useState<UserRole>('public');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Auto-initialize browser storage elements
  useEffect(() => {
    initializeSchoolStorage();
  }, []);

  const handleLoginTrigger = () => {
    setCurrentView('login');
  };

  const handleBackToWeb = () => {
    setCurrentView('public');
    setUserRole('public');
    setCurrentUserId('');
  };

  const handleLoginSuccess = (role: UserRole, userId: string) => {
    setUserRole(role);
    setCurrentUserId(userId);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('public');
    setUserRole('public');
    setCurrentUserId('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased" id="zenith-app-shell">
      {currentView === 'public' && (
        <PublicWebsite onLoginClick={handleLoginTrigger} />
      )}

      {currentView === 'login' && (
        <LoginPortal 
          onBackToWeb={handleBackToWeb} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}

      {currentView === 'dashboard' && (
        <React.Fragment>
          {userRole === 'admin' && (
            <AdminDashboard onLogout={handleLogout} />
          )}
          {userRole === 'teacher' && (
            <TeacherDashboard teacherId={currentUserId} onLogout={handleLogout} />
          )}
          {userRole === 'student' && (
            <StudentDashboard studentId={currentUserId} onLogout={handleLogout} />
          )}
        </React.Fragment>
      )}
    </div>
  );
}
