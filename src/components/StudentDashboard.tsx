/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  FileText, 
  DollarSign, 
  Clock, 
  User, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  CreditCard, 
  Download, 
  LogOut, 
  Sparkles,
  Info,
  Upload
} from 'lucide-react';
import { 
  getStudents, 
  saveStudents, 
  getFeePayments, 
  getAttendance, 
  getMarks, 
  getSyllabus,
  markStudentFeeAsPaid
} from '../lib/schoolStorage';
import { TIMETABLE_CLASS_X } from '../data/mockData';
import { FeePayment } from '../types';

interface StudentDashboardProps {
  studentId: string;
  onLogout: () => void;
}

export default function StudentDashboard({ studentId, onLogout }: StudentDashboardProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<'grades' | 'attendance' | 'fees' | 'timetable' | 'profile'>('grades');

  // Load student
  const [currentStudent, setCurrentStudent] = useState(() => {
    const studentsList = getStudents();
    return studentsList.find(s => s.id === studentId) || studentsList[0];
  });
  const [dragActive, setDragActive] = useState(false);

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const list = getStudents();
      const idx = list.findIndex(s => s.id === currentStudent.id);
      if (idx !== -1) {
        list[idx].photoUrl = base64String;
        saveStudents(list);
        setCurrentStudent(list[idx]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  // Load records
  const [payments, setPayments] = useState<FeePayment[]>(() => {
    return getFeePayments().filter(p => p.studentId === currentStudent.id);
  });
  
  const studentAttendance = getAttendance().filter(a => a.entityId === currentStudent.id && a.entityType === 'student');
  const studentMarks = getMarks().filter(marks => marks.studentId === currentStudent.id);

  // Payments / Pay Form State
  const [activeBillToPay, setActiveBillToPay] = useState<FeePayment | null>(null);
  const [upiIdInput, setUpiIdInput] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);

  // Group marks by Exam type
  const examsList = ['FA-I', 'FA-II', 'SA-I', 'SA-II'] as const;
  
  // Calculate attendance averages
  const presentCount = studentAttendance.filter(a => a.status === 'Present').length;
  const absentCount = studentAttendance.filter(a => a.status === 'Absent').length;
  const attendanceRatio = studentAttendance.length > 0 
    ? Math.round((presentCount / studentAttendance.length) * 100) 
    : 100;

  const handleOnlinePaymentSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeBillToPay) {
      setPaymentDone(true);
      setTimeout(() => {
        // Execute storage commit
        markStudentFeeAsPaid(activeBillToPay.id, 'UPI');
        
        // Refresh local state datasets
        setPayments(getFeePayments().filter(p => p.studentId === currentStudent.id));
        setPaymentDone(false);
        setActiveBillToPay(null);
        setUpiIdInput('');
      }, 3000);
    }
  };

  const calculateGradeForPct = (pct: number): string => {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  };

  const handleSyllabusReceiptDownload = (bill: FeePayment) => {
    const rawData = `CHAKRAPANI DAS PUBLIC SCHOOL JALAH - FEE INVOICE RECEIPT\n` +
      `Receipt No: ${bill.receiptNo || 'PND-03912'}\n` +
      `Billing phase: ${bill.billingMonth}\n` +
      `Class Allocated: ${bill.classId}\n` +
      `Scholar Candidate: ${currentStudent.name}\n` +
      `Admission No: ${currentStudent.admissionNo}\n` +
      `Settled Amount: $${bill.amount}.00\n` +
      `Date Settle: ${bill.paidAt || 'Awaiting Payment'}\n` +
      `Status Verified: PAID\n`;

    const blob = new Blob([rawData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${bill.receiptNo || 'Pending'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadProgressReport = () => {
    let reportText = `==================================================================\n`;
    reportText += `                CHAKRAPANI DAS PUBLIC SCHOOL JALAH\n`;
    reportText += `          OFFICIAL COMPLETE CONSOLIDATED PROGRESS REPORT CARD\n`;
    reportText += `==================================================================\n\n`;
    reportText += `STUDENT PROFILE DETAILS:\n`;
    reportText += `------------------------\n`;
    reportText += `Scholar Candidate  : ${currentStudent.name}\n`;
    reportText += `Admission Number   : ${currentStudent.admissionNo}\n`;
    reportText += `Standard Class     : ${currentStudent.classId} A\n`;
    reportText += `Roster Roll Number : ${currentStudent.rollNo}\n`;
    reportText += `Guardian Contact   : ${currentStudent.guardianName}\n`;
    reportText += `Current Date/Time  : ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n\n`;

    reportText += `SUMMARY OF ASSESSMENT EXAMS PERFORMANCE:\n`;
    reportText += `----------------------------------------\n`;

    const defaultSubjects = ['Mathematics', 'Science', 'English'];

    let examSummaries = '';

    examsList.forEach(exam => {
      examSummaries += `\n>> ASSESSMENT EXAM: ${exam}\n`;
      examSummaries += `------------------------------------------------------\n`;
      examSummaries += `Subject Name       | Marks Obtained / Max Allotted | Grade  \n`;
      examSummaries += `-------------------+-------------------------------+--------\n`;

      const marksForExam = studentMarks.filter(m => m.examType === exam);
      if (marksForExam.length > 0) {
        marksForExam.forEach(mark => {
          const pct = Math.round((mark.marksObtained / mark.maxMarks) * 100);
          const grade = calculateGradeForPct(pct);
          examSummaries += `${mark.subjectName.padEnd(18)} | ${String(mark.marksObtained).padStart(14)} / ${String(mark.maxMarks).padStart(12)} | Grade ${grade}\n`;
        });
        const totalObtained = marksForExam.reduce((acc, curr) => acc + curr.marksObtained, 0);
        const totalMax = marksForExam.reduce((acc, curr) => acc + curr.maxMarks, 0);
        const avgPct = Math.round((totalObtained / totalMax) * 100);
        const overallG = calculateGradeForPct(avgPct);
        examSummaries += `-------------------+-------------------------------+--------\n`;
        examSummaries += `AGGREGATE SUMMARY  | ${String(totalObtained).padStart(14)} / ${String(totalMax).padStart(12)} | Grade ${overallG} (${avgPct}%)\n`;
      } else {
        defaultSubjects.forEach(sub => {
          const mMax = exam.startsWith('FA') ? 25 : 100;
          examSummaries += `${sub.padEnd(18)} | ${'--'.padStart(14)} / ${String(mMax).padStart(12)} | PEND   \n`;
        });
        examSummaries += `-------------------+-------------------------------+--------\n`;
        examSummaries += `STATUS: Evaluation scores are pending registration.\n`;
      }
      examSummaries += `------------------------------------------------------\n`;
    });

    reportText += examSummaries;

    reportText += `\n==================================================================\n`;
    reportText += `OFFICIAL STATUS: Registered Grade A+ state educational system.\n`;
    reportText += `COGNIZANT AUTHORITIES STATEMENT:\n`;
    reportText += `  Approved by: Prof. Pamela Moore (Principal Officer, CDPSJ)\n`;
    reportText += `  Official Verification: STAMP OF REGISTRAR OFFICE SECURE INTEGRITY\n`;
    reportText += `==================================================================\n`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CD_Public_School_Report_Card_${currentStudent.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" id="student-dashboard-root">
      
      {/* BRAND & HEADER BANNER */}
      <header className="bg-slate-900 text-white shadow-md py-4 px-6 sm:px-8 border-b border-indigo-950 flex items-center justify-between" id="student-header">
        <div className="flex items-center gap-3">
          {currentStudent.photoUrl ? (
            <img 
              src={currentStudent.photoUrl} 
              alt={currentStudent.name} 
              referrerPolicy="no-referrer" 
              className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-lg"
              id="student-header-photo"
            />
          ) : (
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-mono font-bold text-lg shadow-lg" id="student-header-initial">
              ST
            </div>
          )}
          <div>
            <h1 className="text-base font-black tracking-tight">{currentStudent.name}</h1>
            <p className="text-[11px] text-slate-400 font-mono font-bold">Standard Class: {currentStudent.classId} A</p>
          </div>
        </div>
        
        {/* Logout Control */}
        <button 
          onClick={onLogout}
          className="bg-white/10 hover:bg-rose-600/20 hover:text-rose-400 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </header>

      {/* CORE FRAME LAYOUT */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDE BAR NAVIGATION */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Scholar Gateway</span>
            <nav className="flex flex-col gap-1">
              {[
                { id: 'grades', label: 'Marks & Report Cards', icon: Award },
                { id: 'attendance', label: 'Attendance stats', icon: TrendingUp },
                { id: 'fees', label: 'Fee Invoices & Payments', icon: DollarSign },
                { id: 'timetable', label: 'Class Timetable', icon: Clock },
                { id: 'profile', label: 'Student Profile', icon: User }
              ].map(tab => {
                const IconComp = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                      active 
                        ? 'bg-indigo-650 text-white shadow-sm shadow-indigo-100' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Metrics Bar Gauge */}
          <div className="bg-indigo-950 text-indigo-100 p-5 rounded-2xl space-y-3 shadow-sm border border-slate-700">
            <h4 className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest flex items-center gap-1.5 leading-none">
              <TrendingUp className="w-3.5 h-3.5" /> Term Presence Metric
            </h4>
            
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-white">{attendanceRatio}%</span>
                <span className="text-[10px] text-indigo-300 font-semibold">{presentCount} Lectures Present</span>
              </div>
              <div className="w-full bg-indigo-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-400 h-1.5 rounded-full animate-pulse" style={{ width: `${attendanceRatio}%` }}></div>
              </div>
            </div>
            <p className="text-[10px] text-indigo-200 leading-normal">
              Standards require 80% mandatory presence to approve SA examination permits.
            </p>
          </div>
        </aside>

        {/* MAIN WORKSPACE SCREEN */}
        <main className="lg:col-span-9 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm min-h-[500px]" id="student-inner-workspace">
          
          {/* ============ TAB 1: GRADES REPORT CARDS ============ */}
          {activeTab === 'grades' && (
            <div className="space-y-8" id="view-student-marks">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                    Academic Performance Grades Card <Award className="w-5 h-5 text-indigo-650" />
                  </h3>
                  <p className="text-xs text-slate-500">Continuous evaluation assessments. Track Formative Assessments (FA) and Summative Assessments (SA).</p>
                </div>
                <button
                  onClick={handleDownloadProgressReport}
                  className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0 transition-all hover:translate-y-[-1px]"
                >
                  <Download className="w-4 h-4" /> Save Printed Progress Report
                </button>
              </div>

              {/* Loop Exam types */}
              <div className="space-y-6">
                {examsList.map(exam => {
                  const marksForExam = studentMarks.filter(m => m.examType === exam);
                  
                  if (marksForExam.length === 0) {
                    const defaultSubjects = ['Mathematics', 'Science', 'English'];
                    const defaultMax = exam.startsWith('FA') ? 25 : 100;
                    
                    return (
                      <div key={exam} id={`report-card-pending-${exam}`} className="bg-slate-50/20 rounded-2xl border border-slate-200/60 p-5 space-y-4 opacity-75">
                        <div className="flex items-center justify-between border-b pb-3 border-dashed border-slate-200">
                          <div>
                            <h4 className="font-extrabold text-base text-slate-500 uppercase tracking-tight">{exam} Assessment Phase</h4>
                            <span className="text-[10px] text-slate-400 font-mono font-medium">Term cycle Academic 2026</span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-400 border border-slate-150 rounded-md font-bold uppercase tracking-wider font-mono">
                              Awaiting Grading
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {defaultSubjects.map(sub => (
                            <div key={sub} className="bg-white p-3.5 rounded-xl border border-slate-150 flex flex-col justify-between">
                              <span className="font-bold text-slate-450 text-sm block mb-1">{sub}</span>
                              <div className="space-y-1.5 pt-2">
                                <div className="flex justify-between text-[11px] text-slate-400 font-medium font-mono">
                                  <span>Marks: -- / {defaultMax}</span>
                                  <span>Pending</span>
                                </div>
                                <div className="w-full bg-slate-50 rounded-full h-1 overflow-hidden">
                                  <div className="bg-slate-200 h-1 w-0"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-slate-50/60 p-4 rounded-xl border border-dashed border-slate-200 text-xs text-center text-slate-500 font-medium">
                          ☕ Final evaluation scores are currently pending course teacher compilation & safe ledger entry.
                        </div>
                      </div>
                    );
                  }

                  const totalObtained = marksForExam.reduce((acc, curr) => acc + curr.marksObtained, 0);
                  const totalMax = marksForExam.reduce((acc, curr) => acc + curr.maxMarks, 0);
                  const aggPercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
                  const overallGrade = calculateGradeForPct(aggPercentage);

                  return (
                    <div key={exam} id={`report-card-${exam}`} className="bg-slate-50/55 rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between border-b pb-3 border-slate-150-dot">
                        <div>
                          <h4 className="font-extrabold text-base text-slate-900 uppercase tracking-tight">{exam} Assessment Phase</h4>
                          <span className="text-[10px] text-slate-400 font-mono font-medium">Term cycle Academic 2026</span>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Aggregate Percentage</span>
                          <span className="text-lg font-black text-indigo-650">{aggPercentage}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {marksForExam.map(mark => {
                          const pct = Math.round((mark.marksObtained / mark.maxMarks) * 100);
                          const subGrade = calculateGradeForPct(pct);
                          return (
                            <div key={mark.id} className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-xs flex flex-col justify-between">
                              <span className="font-bold text-slate-850 text-sm block mb-1">{mark.subjectName}</span>
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-slate-500 font-medium">
                                  <span>Marks: {mark.marksObtained}/{mark.maxMarks}</span>
                                  <span>{pct}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                                  <div className="bg-indigo-600 h-1" style={{ width: `${pct}%` }}></div>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 block pt-2 mt-2 border-t text-right">Grade {subGrade}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-white p-4.5 rounded-xl border border-dashed border-slate-200 text-xs flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-650"></span>
                          <span className="font-bold text-slate-700">Combined Yield: {totalObtained} / {totalMax} Marks accumulated</span>
                        </div>

                        <span className="px-3.5 py-1 bg-indigo-650 text-white font-bold text-xs rounded-xl shadow-xs">
                          Overall Grade: {overallGrade}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ============ TAB 2: DETAILED ATTENDANCE ============ */}
          {activeTab === 'attendance' && (
            <div className="space-y-8" id="view-student-attendance">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                  Attendance logs & Compliance <Clock className="w-5 h-5 text-indigo-650" />
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Check official registers. Track presence criteria across the four exam terms to maintain academic validation quotas.</p>
              </div>

              {/* OVERALL SUMMARY BADGES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 border border-emerald-150 p-5 rounded-2xl text-center space-y-1">
                  <span className="text-xs font-bold text-emerald-800 block uppercase tracking-wider">Total Lectures Present</span>
                  <span className="text-3xl font-black text-emerald-600 block">{presentCount} Days</span>
                </div>
                <div className="bg-rose-50/50 border border-rose-150 p-5 rounded-2xl text-center space-y-1">
                  <span className="text-xs font-bold text-rose-800 block uppercase tracking-wider">Total Absences Tracked</span>
                  <span className="text-3xl font-black text-rose-600 block">{absentCount} Days</span>
                </div>
              </div>

              {/* Attendance breakdown by academic terms */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Term attendance by Exam Cycles</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {(['FA-I', 'FA-II', 'SA-I', 'SA-II'] as const).map(term => {
                    // Partition helper
                    const getTermForDateLocal = (dateStr: string) => {
                      const month = parseInt(dateStr.split('-')[1], 10);
                      if (month === 4 || month === 5) return 'FA-I';
                      if (month === 6 || month === 7 || month === 8) return 'FA-II';
                      if (month === 9 || month === 10 || month === 11) return 'SA-I';
                      return 'SA-II';
                    };
                    
                    const termRecords = studentAttendance.filter(a => getTermForDateLocal(a.date) === term);
                    const present = termRecords.filter(a => a.status === 'Present').length;
                    const total = termRecords.length;
                    const ratio = total > 0 ? Math.round((present / total) * 100) : null;
                    
                    return (
                      <div key={term} className="bg-slate-50/60 p-4.5 rounded-xl border border-slate-200 text-center flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-650 block uppercase tracking-wider font-mono">{term} Cycle</span>
                          <span className="text-[10px] text-slate-400 block pb-1">Term Attendance</span>
                          
                          {ratio !== null ? (
                            <span className="text-2xl font-black text-slate-800 block my-1">
                              {ratio}%
                            </span>
                          ) : (
                            <span className="text-sm font-bold text-slate-400 block my-2.5 font-mono">
                              No Logs Yet
                            </span>
                          )}
                        </div>

                        {ratio !== null && (
                          <div className="space-y-1.5 pt-1.5">
                            <div className="w-full bg-slate-200 rounded-full h-1">
                              <div className="bg-indigo-600 h-1 rounded-full" style={{ width: `${ratio}%` }}></div>
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono italic block">
                              {present} of {total} marked
                            </span>
                          </div>
                        )}
                        {ratio === null && (
                          <span className="text-[9px] text-slate-400 block border-t pt-1.5">Awaiting cycle launch</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DETAIL CHRONOLOGY LIST */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Detailed Attendance Chronology</span>
                <div className="space-y-1.5">
                  {studentAttendance.length > 0 ? (
                    studentAttendance.map(log => {
                      const isPresent = log.status === 'Present';
                      return (
                        <div key={log.id} className="bg-white border rounded-lg p-3 flex items-center justify-between text-xs shadow-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${isPresent ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            <span className="font-mono text-slate-500 font-medium">{log.date}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] uppercase ${
                            isPresent ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-slate-50 border p-6 text-center text-slate-400 font-semibold rounded-xl text-xs">
                      No chronological attendance logs registered in local database.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============ TAB 3: FEES INVOICES & ONLINE SIMULATOR ============ */}
          {activeTab === 'fees' && (
            <div className="space-y-6" id="view-student-fees">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                  Fee structures & Receipts <DollarSign className="w-5 h-5 text-indigo-650" />
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Track term invoices. Settle remaining outstanding balances using our integrated online transaction gateway simulator.</p>
              </div>

              {/* Payments array mapping */}
              <div className="space-y-4">
                {payments.map(bill => {
                  const isPaid = bill.paymentStatus === 'Paid';
                  return (
                    <div key={bill.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-650 rounded font-bold text-[9px] uppercase tracking-wide">Standard invoice</span>
                        <h4 className="font-extrabold text-base text-slate-900 pt-0.5">{bill.billingMonth}</h4>
                        <div className="flex flex-wrap gap-x-3 text-xs text-slate-500 font-medium pt-0.5">
                          <span>Invoice Amount: ${bill.amount}</span>
                          {isPaid && <span className="font-mono text-emerald-600">Issued On Receipt: {bill.receiptNo}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isPaid 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                        }`}>
                          {bill.paymentStatus}
                        </span>

                        {isPaid ? (
                          <button 
                            onClick={() => handleSyllabusReceiptDownload(bill)}
                            className="bg-white border rounded-xl hover:bg-slate-100 py-1.5 px-4 text-xs font-semibold text-slate-600 flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" /> PDF Receipt
                          </button>
                        ) : (
                          <button 
                            onClick={() => setActiveBillToPay(bill)}
                            className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs py-1.5 px-4 rounded-xl shadow cursor-pointer"
                          >
                            Settle Online Now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAYMENT DRAWER POPUP */}
              {activeBillToPay && (
                <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-55 backdrop-blur-xs">
                  <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-5">
                    
                    <div className="text-center space-y-1 pb-3 border-b">
                      <span className="w-10 h-10 bg-indigo-50 flex items-center justify-center text-indigo-650 rounded-full mx-auto font-bold border border-indigo-100">
                        <CreditCard className="w-5 h-5" />
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base">UPI / Online Settle Platform</h4>
                      <p className="text-[10px] text-slate-400">Total invoice: ${activeBillToPay.amount}.00</p>
                    </div>

                    {paymentDone ? (
                      <div className="text-center p-6 space-y-4">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto animate-bounce border border-emerald-150">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-emerald-850">Processing Transaction...</h5>
                          <p className="text-[10px] text-emerald-700">Awaiting safe confirmation locks in Ledger registers. Please do not close.</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleOnlinePaymentSim} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Enter your Personal Virtual ID</label>
                          <input 
                            type="text" 
                            required
                            value={upiIdInput}
                            onChange={(e) => setUpiIdInput(e.target.value)}
                            placeholder="e.g. parents@upi, card..." 
                            className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 text-slate-800 outline-none"
                          />
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border text-[10px] text-slate-500 leading-normal flex gap-1.5">
                          <Info className="w-4 h-4 text-indigo-650 shrink-0" />
                          <span>This is an integrated offline-first educational system. Submitting coordinates registers a simulated successful receipt back into metadata banks.</span>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => setActiveBillToPay(null)}
                            className="w-1/2 p-2 border rounded-xl text-xs font-semibold hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="w-1/2 p-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs"
                          >
                            Verify & Settle
                          </button>
                        </div>
                      </form>
                    )}

                  </div>
                </div>
              )}

            </div>
          )}

          {/* ============ TAB 4: CLASS TIMETABLE ============ */}
          {activeTab === 'timetable' && (
            <div className="space-y-6" id="view-student-timetable">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                  Class Room Lecture Timetable <Clock className="w-5 h-5 text-indigo-650" />
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Verified lecture slots and faculty coordinators assigned for current term cycles.</p>
              </div>

              {/* Mapping schedule */}
              <div className="space-y-6">
                {TIMETABLE_CLASS_X.schedule.map(daySch => (
                  <div key={daySch.day} className="bg-slate-50/50 rounded-2xl border p-4.5 space-y-3">
                    <span className="font-extrabold text-slate-850 text-sm block border-b border-dashed pb-1">{daySch.day}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {daySch.periods.map((per, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-slate-150 flex items-center justify-between text-xs text-sans shadow-xs">
                          <div>
                            <span className="font-bold text-slate-900 block">{per.subject}</span>
                            <span className="text-[10px] text-indigo-650 font-medium">Instructor: {per.teacherName}</span>
                          </div>
                          <span className="font-mono text-slate-400 font-semibold">{per.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ TAB 5: STUDENT PROFILE CARD ============ */}
          {activeTab === 'profile' && (
            <div className="space-y-8" id="view-student-profile">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50 p-6 rounded-2xl border border-slate-205/85 shadow-xs">
                
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    {/* Interactive Photo Upload Widget */}
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative group shrink-0 transition-all rounded-full p-0.5 border-2 ${
                        dragActive ? 'border-indigo-500 bg-indigo-50/40 scale-105' : 'border-indigo-200 hover:border-indigo-400'
                      }`}
                      title="Drag-and-drop or click to upload photo"
                    >
                      <label className="cursor-pointer block relative rounded-full overflow-hidden w-14 h-14">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(file);
                          }} 
                        />
                        {currentStudent.photoUrl ? (
                          <>
                            <img 
                              src={currentStudent.photoUrl} 
                              alt={currentStudent.name} 
                              referrerPolicy="no-referrer" 
                              className="w-14 h-14 rounded-full object-cover shadow-sm transition-transform duration-300 group-hover:scale-110"
                              id="student-profile-photo"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[8px] font-bold tracking-wider transition-opacity">
                              <Upload className="w-3.5 h-3.5 mb-0.5" />
                              CHANGE
                            </div>
                          </>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-indigo-50 font-sans font-bold text-indigo-650 flex flex-col items-center justify-center text-lg border border-indigo-200 shadow-sm" id="student-profile-initial">
                            <span>{currentStudent.name.charAt(0)}</span>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[8px] font-bold tracking-wider transition-opacity">
                              <Upload className="w-3.5 h-3.5 mb-0.5" />
                              UPLOAD
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{currentStudent.name}</h4>
                      <p className="text-[10px] font-mono text-slate-400">Admission No: {currentStudent.admissionNo}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p><strong>Allocated Class:</strong> {currentStudent.classId} A</p>
                    <p><strong>Roster guardian:</strong> {currentStudent.guardianName}</p>
                    <p><strong>Roster email:</strong> {currentStudent.email}</p>
                    <p><strong>Official contact:</strong> {currentStudent.phone}</p>
                    <p><strong>Official DOB:</strong> {currentStudent.dob}</p>
                    <p><strong>Residential Address:</strong> {currentStudent.address}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-150 space-y-4">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-650" /> Guardian Correspondence Note
                  </h5>
                  <p className="text-xs text-slate-550 leading-relaxed">
                    Welcome parent to your student dashboard portals. Inside these panels, you are granted complete visual visibility into formative test mark distributions, daily timetables, and invoice histories with automated receipt generators.
                  </p>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      <footer className="h-10 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 sm:px-8 text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono" id="student-sub-footer">
        <div>🔒 Secure Node: CDPSJ.Student.Log</div>
        <div className="hidden sm:block">Session Status: Authenticated Scholar Account</div>
        <div>Scholar Portal</div>
      </footer>

    </div>
  );
}
