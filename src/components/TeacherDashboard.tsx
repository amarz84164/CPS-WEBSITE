/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  FileEdit, 
  User, 
  CheckCircle, 
  ArrowRight, 
  Save, 
  ChevronRight, 
  LogOut, 
  Grid,
  ClipboardList,
  Sparkles,
  Download,
  Upload
} from 'lucide-react';
import { 
  getStudents, 
  getTeachers, 
  saveTeachers,
  getMarks, 
  addBulkMarks, 
  getAttendance, 
  saveDailyAttendance 
} from '../lib/schoolStorage';
import { Student, Teacher, Mark, AttendanceRecord, ExamType } from '../types';

interface TeacherDashboardProps {
  teacherId: string;
  onLogout: () => void;
}

export default function TeacherDashboard({ teacherId, onLogout }: TeacherDashboardProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<'attendance' | 'marks' | 'report' | 'profile'>('attendance');

  // Load teacher details
  const [currentTeacher, setCurrentTeacher] = useState(() => {
    const list = getTeachers();
    return list.find(t => t.id === teacherId) || list[0];
  });
  const [dragActive, setDragActive] = useState(false);

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const list = getTeachers();
      const idx = list.findIndex(t => t.id === currentTeacher.id);
      if (idx !== -1) {
        list[idx].photoUrl = base64String;
        saveTeachers(list);
        setCurrentTeacher(list[idx]);
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

  // Load students belonging to classes this teacher handles
  const allStudents = getStudents();
  const classesTaught = currentTeacher.classes; // e.g. ["Class-VIII", "Class-X"]
  const [selectedClass, setSelectedClass] = useState(classesTaught[0] || 'Class-X');

  // -------------------------
  // 1. ATTENDANCE WORKSPACE
  // -------------------------
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const studentsInClass = allStudents.filter(s => s.classId === selectedClass);
  
  // Local state representing attendance checkboxes
  const currentAttendanceRecords = getAttendance();
  const [classAttendance, setClassAttendance] = useState<{ [studentId: string]: 'Present' | 'Absent' }>(() => {
    const initial: { [studentId: string]: 'Present' | 'Absent' } = {};
    studentsInClass.forEach(s => {
      const match = currentAttendanceRecords.find(a => a.date === attendanceDate && a.entityId === s.id);
      initial[s.id] = match ? (match.status === 'Present' ? 'Present' : 'Absent') : 'Present';
    });
    return initial;
  });

  const [attendanceSavedMsg, setAttendanceSavedMsg] = useState(false);

  // Sync state when Class or Date changes
  React.useEffect(() => {
    const updated: { [studentId: string]: 'Present' | 'Absent' } = {};
    const records = getAttendance();
    const studentsList = allStudents.filter(s => s.classId === selectedClass);
    studentsList.forEach(s => {
      const match = records.find(a => a.date === attendanceDate && a.entityId === s.id);
      updated[s.id] = match ? (match.status === 'Present' ? 'Present' : 'Absent') : 'Present';
    });
    setClassAttendance(updated);
    setAttendanceSavedMsg(false);
  }, [selectedClass, attendanceDate]);

  const toggleStudentAttendance = (studentId: string) => {
    setClassAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const handleSaveAttendance = () => {
    const recordsToSave: Omit<AttendanceRecord, 'id'>[] = Object.keys(classAttendance).map(studId => ({
      date: attendanceDate,
      entityId: studId,
      entityType: 'student',
      status: classAttendance[studId],
      markedBy: currentTeacher.name
    }));

    saveDailyAttendance(recordsToSave);
    setAttendanceSavedMsg(true);
    setTimeout(() => setAttendanceSavedMsg(false), 3000);
  };

  // -------------------------
  // 2. MARK ENTRY WORKSPACE
  // -------------------------
  const [selectedExam, setSelectedExam] = useState<ExamType>('FA-I');
  const [selectedSubject, setSelectedSubject] = useState(currentTeacher.subjects[0] || 'Mathematics');
  const maxMarksForExam = selectedExam.startsWith('FA') ? 25 : 100;

  // Local state representing marks obtained input
  const [studentMarks, setStudentMarks] = useState<{ [studentId: string]: number }>(() => {
    const initial: { [studentId: string]: number } = {};
    const marksData = getMarks();
    studentsInClass.forEach(s => {
      const match = marksData.find(m => m.studentId === s.id && m.examType === selectedExam && m.subjectName === selectedSubject);
      initial[s.id] = match ? match.marksObtained : 0;
    });
    return initial;
  });

  const [marksSavedMsg, setMarksSavedMsg] = useState(false);

  // Sync marks when Class, Subject or Exam variables modify
  React.useEffect(() => {
    const updated: { [studentId: string]: number } = {};
    const marksData = getMarks();
    const studentsList = allStudents.filter(s => s.classId === selectedClass);
    studentsList.forEach(s => {
      const match = marksData.find(m => m.studentId === s.id && m.examType === selectedExam && m.subjectName === selectedSubject);
      updated[s.id] = match ? match.marksObtained : 0;
    });
    setStudentMarks(updated);
    setMarksSavedMsg(false);
  }, [selectedClass, selectedSubject, selectedExam]);

  const handleMarkChange = (studentId: string, val: number) => {
    const sanitizedVal = Math.min(Math.max(0, val), maxMarksForExam);
    setStudentMarks(prev => ({
      ...prev,
      [studentId]: sanitizedVal
    }));
  };

  const handleSaveMarks = () => {
    const payload = Object.keys(studentMarks).map(studId => ({
      studentId: studId,
      classId: selectedClass,
      examType: selectedExam,
      subjectName: selectedSubject,
      marksObtained: studentMarks[studId],
      maxMarks: maxMarksForExam,
      gradedBy: currentTeacher.id
    }));

    addBulkMarks(payload);
    setMarksSavedMsg(true);
    setTimeout(() => setMarksSavedMsg(false), 3000);
  };

  const handleDownloadClassLedger = () => {
    let reportText = `==================================================================\n`;
    reportText += `                CHAKRAPANI DAS PUBLIC SCHOOL JALAH\n`;
    reportText += `          CLASS STUDY PROGRESS LEDGER - ${selectedClass.toUpperCase()} STANDARD\n`;
    reportText += `==================================================================\n`;
    reportText += `Generated by Educator: ${currentTeacher.name}\n`;
    reportText += `Date of Ledger Generation: ${new Date().toLocaleDateString()}\n`;
    reportText += `------------------------------------------------------------------\n\n`;

    const examTypes = ['FA-I', 'FA-II', 'SA-I', 'SA-II'] as const;

    studentsInClass.forEach(student => {
      reportText += `STUDENT: ${student.name} | Admission No: ${student.admissionNo} | Roll: ${student.rollNo}\n`;
      reportText += `------------------------------------------------------------------\n`;
      
      const sMarks = getMarks().filter(m => m.studentId === student.id);
      
      examTypes.forEach(exam => {
        reportText += `  * EXAM: ${exam} -> `;
        const examMarks = sMarks.filter(m => m.examType === exam);
        
        if (examMarks.length > 0) {
          const details = examMarks.map(m => `${m.subjectName}: ${m.marksObtained}/${m.maxMarks}`).join(', ');
          const totalObtained = examMarks.reduce((acc, curr) => acc + curr.marksObtained, 0);
          const totalMax = examMarks.reduce((acc, curr) => acc + curr.maxMarks, 0);
          const pct = Math.round((totalObtained / totalMax) * 105 ? (totalObtained / totalMax) * 100 : 0);
          reportText += `[${details}] | Aggregate: ${pct}%\n`;
        } else {
          reportText += `Awaiting grades registration.\n`;
        }
      });
      
      const sAttendance = getAttendance().filter(a => a.entityId === student.id && a.entityType === 'student');
      const present = sAttendance.filter(a => a.status === 'Present').length;
      const totalAtt = sAttendance.length;
      const attPct = totalAtt > 0 ? Math.round((present / totalAtt) * 100) : 100;
      reportText += `  * ATTENDANCE: Present ${present} of ${totalAtt} cycles (${attPct}%)\n`;
      reportText += `==================================================================\n\n`;
    });

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Class_Ledger_${selectedClass}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Auto calculate total / grades helper for preview
  const generateGradeForPct = (pct: number): string => {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  };

  // Staff self-login attendance roster
  const staffAttendance = getAttendance().filter(a => a.entityId === currentTeacher.id && a.entityType === 'teacher');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" id="teacher-dashboard-root">
      
      {/* BRAND & HEADER BANNER */}
      <header className="bg-slate-900 text-white shadow-md py-4 px-6 sm:px-8 border-b border-indigo-950 flex items-center justify-between" id="teacher-header">
        <div className="flex items-center gap-3">
          {currentTeacher.photoUrl ? (
            <img 
              src={currentTeacher.photoUrl} 
              alt={currentTeacher.name} 
              referrerPolicy="no-referrer" 
              className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-lg"
              id="teacher-header-photo"
            />
          ) : (
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-mono font-bold text-lg shadow-lg" id="teacher-header-initial">
              IN
            </div>
          )}
          <div>
            <h1 className="text-base font-black tracking-tight">{currentTeacher.name}</h1>
            <p className="text-[11px] text-slate-400 font-mono font-bold">{currentTeacher.designation}</p>
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
        
        {/* TAB WORKSPACE FILTERS */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Teacher Workspace</span>
            <nav className="flex flex-col gap-1">
              {[
                { id: 'attendance', label: 'Roll-Call Marker', icon: ClipboardList },
                { id: 'marks', label: 'FA/SA Mark Entry', icon: FileEdit },
                { id: 'report', label: 'Class Progress Report', icon: Grid },
                { id: 'profile', label: 'Teacher Profile', icon: User }
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

          {/* CLASSROOM CONTEXT LISTENER */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Allocated Classrooms:</h4>
            <div className="space-y-1.5">
              {classesTaught.map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                    selectedClass === cls 
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 ring-1 ring-indigo-50/50' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <span>{cls} Standard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE SCREEN */}
        <main className="lg:col-span-9 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm min-h-[500px]" id="teacher-inner-workspace">
          
          {/* ============ TAB 1: ROLL-CALL ATTENDANCE MARKER ============ */}
          {activeTab === 'attendance' && (
            <div className="space-y-6" id="view-teacher-attendance">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                    Daily Attendance marking <ClipboardList className="w-5 h-5 text-indigo-650" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Choose target Class, select logging date, and toggle students' status indicators.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 font-sans">Date:</span>
                  <input 
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="p-1 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none"
                  />
                </div>
              </div>

              {attendanceSavedMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-xl text-xs font-semibold">
                  Attendance logs registered successfully in local data blocks for date {attendanceDate}!
                </div>
              )}

              {/* Attendance Table Checklist */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Admission ID</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Guardian Name</th>
                      <th className="p-3 text-center">Roster Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentsInClass.length > 0 ? (
                      studentsInClass.map(student => {
                        const status = classAttendance[student.id] || 'Present';
                        const isPresent = status === 'Present';
                        return (
                          <tr key={student.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono font-bold text-slate-400">{student.rollNo}</td>
                            <td className="p-3 font-mono text-slate-500">{student.admissionNo}</td>
                            <td className="p-3 font-bold text-slate-850 flex items-center gap-2">
                              {student.photoUrl && (
                                <img 
                                  src={student.photoUrl} 
                                  alt={student.name} 
                                  referrerPolicy="no-referrer" 
                                  className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                                />
                              )}
                              <span>{student.name}</span>
                            </td>
                            <td className="p-3 text-slate-550">{student.guardianName}</td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => toggleStudentAttendance(student.id)}
                                className={`px-4.5 py-1.5 rounded-xl font-bold text-xs border cursor-pointer transition-all ${
                                  isPresent 
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm' 
                                    : 'bg-rose-50 border-rose-200 text-rose-800 shadow-sm'
                                }`}
                              >
                                {isPresent ? '● Present' : '○ Absent'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400 font-semibold">No students registered in this school class standard.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {studentsInClass.length > 0 && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveAttendance}
                    className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Save className="w-4 h-4" /> Save Daily Attendance Sheet
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ============ TAB 2: EXAM MARKS ENTRY WORKSPACE ============ */}
          {activeTab === 'marks' && (
            <div className="space-y-6" id="view-teacher-marks">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                    Mark Entry & Assessment Form <FileEdit className="w-5 h-5 text-indigo-650" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Select assessment phase of term, choose course module, and type raw marks achieved.</p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <select 
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value as ExamType)}
                    className="p-1 px-3 border border-slate-200 bg-slate-55 rounded-lg outline-none font-sans font-bold"
                  >
                    <option value="FA-I">FA-I (Formative I - Max 25)</option>
                    <option value="FA-II">FA-II (Formative II - Max 25)</option>
                    <option value="SA-I">SA-I (Summative I - Max 100)</option>
                    <option value="SA-II">SA-II (Summative II - Max 100)</option>
                  </select>

                  <select 
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="p-1 px-3 border border-slate-200 bg-slate-55 rounded-lg outline-none font-sans font-bold"
                  >
                    {currentTeacher.subjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              {marksSavedMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-xl text-xs font-semibold">
                  Syllabus marks registered successfully in Chakrapani Das Jalah databases for assessment phase {selectedExam}!
                </div>
              )}

              {/* Marks Entry Grid */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-3 h-10">Admission ID</th>
                      <th className="p-3">Scholar Student</th>
                      <th className="p-3">Max Marks Allotment</th>
                      <th className="p-3 text-center">Marks Obtained (Raw)</th>
                      <th className="p-3 text-center">Percentage Yield</th>
                      <th className="p-3 text-center">Derived Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentsInClass.length > 0 ? (
                      studentsInClass.map(student => {
                        const marksVal = studentMarks[student.id] || 0;
                        const pctValue = Math.round((marksVal / maxMarksForExam) * 100);
                        const calculatedGrade = generateGradeForPct(pctValue);

                        return (
                          <tr key={student.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono font-bold text-slate-400">{student.admissionNo}</td>
                            <td className="p-3 font-bold text-slate-850 flex items-center gap-2">
                              {student.photoUrl && (
                                <img 
                                  src={student.photoUrl} 
                                  alt={student.name} 
                                  referrerPolicy="no-referrer" 
                                  className="w-7 h-7 rounded-lg object-cover border border-slate-200 animate-fade-in"
                                />
                              )}
                              <span>{student.name}</span>
                            </td>
                            <td className="p-3 font-mono text-slate-500 font-semibold">{maxMarksForExam}</td>
                            <td className="p-3 text-center">
                              <input 
                                type="number" 
                                value={marksVal}
                                min={0}
                                max={maxMarksForExam}
                                onChange={(e) => handleMarkChange(student.id, Number(e.target.value))}
                                className="w-20 px-2 py-1 border border-slate-240 rounded bg-slate-50 font-bold text-center text-xs focus:ring-1 focus:ring-indigo-650"
                              />
                            </td>
                            <td className="p-3 text-center font-bold font-mono text-slate-700">{pctValue}%</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                calculatedGrade === 'A+' || calculatedGrade === 'A' ? 'bg-emerald-55 text-emerald-800' :
                                calculatedGrade === 'B' || calculatedGrade === 'C' ? 'bg-indigo-50 text-indigo-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>
                                Grade {calculatedGrade}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400 font-semibold">No students registered in this school class standard.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {studentsInClass.length > 0 && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveMarks}
                    className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Save className="w-4 h-4" /> Save Course Marks Table
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ============ TAB 2.5: CLASS PROGRESS REPORT ============ */}
          {activeTab === 'report' && (
            <div className="space-y-6" id="view-teacher-class-report">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                    Class Cumulative Progress Report <Grid className="w-5 h-5 text-indigo-650" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Analyze academic aggregate score trends and attendance ratios of standard {selectedClass} standard.</p>
                </div>

                {studentsInClass.length > 0 && (
                  <button
                    onClick={handleDownloadClassLedger}
                    className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all hover:translate-y-[-1px]"
                  >
                    <Download className="w-4 h-4" /> Export Class Progress Ledger
                  </button>
                )}
              </div>

              {/* Roster overview with 4-exam indicators */}
              <div className="space-y-4">
                {studentsInClass.map(student => {
                  const sMarks = getMarks().filter(m => m.studentId === student.id);
                  const sAttendance = getAttendance().filter(a => a.entityId === student.id && a.entityType === 'student');
                  const present = sAttendance.filter(a => a.status === 'Present').length;
                  const totalAtt = sAttendance.length;
                  const attPct = totalAtt > 0 ? Math.round((present / totalAtt) * 100) : 100;

                  return (
                    <div key={student.id} className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 space-y-4">
                      {/* Name header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 border-slate-200/60 gap-3">
                        <div className="flex items-center gap-2.5">
                          {student.photoUrl ? (
                            <img 
                              src={student.photoUrl} 
                              alt={student.name} 
                              referrerPolicy="no-referrer" 
                              className="w-8 h-8 rounded-full object-cover border border-slate-205"
                              id={`progress-report-student-photo-${student.id}`}
                            />
                          ) : (
                            <span className="w-8 h-8 rounded-full bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-xs" id={`progress-report-student-initial-${student.id}`}>
                              {student.name.charAt(0)}
                            </span>
                          )}
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">{student.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono">Admission No: {student.admissionNo} | Roll No: {student.rollNo}</p>
                          </div>
                        </div>

                        {/* Attendance Meter */}
                        <div className="flex items-center gap-2 text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Attendance Rate</span>
                          <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] font-mono ${
                            attPct >= 80 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {attPct}% presence
                          </span>
                        </div>
                      </div>

                      {/* 4 Exam overview slots */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {(['FA-I', 'FA-II', 'SA-I', 'SA-II'] as const).map(exam => {
                          const examMarks = sMarks.filter(m => m.examType === exam);
                          const totalObtained = examMarks.reduce((acc, curr) => acc + curr.marksObtained, 0);
                          const totalMax = examMarks.reduce((acc, curr) => acc + curr.maxMarks, 0);
                          const pct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : null;
                          const overallG = pct !== null ? generateGradeForPct(pct) : null;

                          return (
                            <div key={exam} className="bg-white p-3 rounded-xl border border-slate-150 flex flex-col justify-between shadow-xs">
                              <span className="text-[10px] font-bold text-indigo-750 font-mono block uppercase">{exam} Exam</span>
                              
                              {pct !== null ? (
                                <div className="space-y-1 mt-1">
                                  <div className="flex justify-between items-baseline text-xs font-mono">
                                    <span className="font-bold text-slate-800">{pct}%</span>
                                    <span className="text-[9px] text-slate-400">Grade {overallG}</span>
                                  </div>
                                  <span className="text-[9px] text-slate-400 block truncate">Marks: {totalObtained}/{totalMax}</span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 block pt-1 font-mono">Pending...</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {studentsInClass.length === 0 && (
                  <div className="border border-slate-200 p-8 text-center text-slate-400 font-semibold rounded-2xl bg-slate-50">
                    No students currently registered in this curriculum standard.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============ TAB 3: TEACHER PROFILE / STAFF ATTENDANCE ============ */}
          {activeTab === 'profile' && (
            <div className="space-y-8" id="view-teacher-profile">
              
              {/* Profile details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="space-y-3">
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
                        {currentTeacher.photoUrl ? (
                          <>
                            <img 
                              src={currentTeacher.photoUrl} 
                              alt={currentTeacher.name} 
                              referrerPolicy="no-referrer" 
                              className="w-14 h-14 rounded-full object-cover shadow-sm transition-transform duration-300 group-hover:scale-110"
                              id="teacher-profile-photo"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[8px] font-bold tracking-wider transition-opacity">
                              <Upload className="w-3.5 h-3.5 mb-0.5" />
                              CHANGE
                            </div>
                          </>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-indigo-50 font-sans font-bold text-indigo-650 flex flex-col items-center justify-center text-lg border border-indigo-200 shadow-sm" id="teacher-profile-initial">
                            <span>{currentTeacher.name.charAt(0)}</span>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[8px] font-bold tracking-wider transition-opacity">
                              <Upload className="w-3.5 h-3.5 mb-0.5" />
                              UPLOAD
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{currentTeacher.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">Employee No: {currentTeacher.empNo}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p><strong>Designation:</strong> {currentTeacher.designation}</p>
                    <p><strong>Roster email:</strong> {currentTeacher.email}</p>
                    <p><strong>Official phone:</strong> {currentTeacher.phone}</p>
                    <p><strong>Residential block:</strong> {currentTeacher.address}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-2">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Expertise Subjects list</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTeacher.subjects.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-indigo-50 text-indigo-750 font-bold rounded-lg text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Staff login attendance timeline */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">Staff Attendance logging check</h4>
                <p className="text-xs text-slate-500">Your visual log report is registered below on root administrator dashboard logs.</p>
                
                <div className="space-y-2">
                  {staffAttendance.length > 0 ? (
                    staffAttendance.map(log => (
                      <div key={log.id} className="bg-white border rounded-lg p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          <span className="font-mono text-slate-500">{log.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">Authenticated presence</span>
                          <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-150 rounded px-2 text-[10px] py-0.5">PRESENT</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white border text-center p-6 rounded-lg text-xs text-slate-400 font-semibold">
                      Your attendance credentials are auto-synced present for current session login.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      <footer className="h-10 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 sm:px-8 text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono" id="teacher-sub-footer">
        <div>🔒 Secure Node: CDPSJ.Teacher.Gateway</div>
        <div className="hidden sm:block">Token status: Verified Active Session</div>
        <div>Instructor Portal</div>
      </footer>

    </div>
  );
}
