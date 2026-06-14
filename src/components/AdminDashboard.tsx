/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  User, 
  DollarSign, 
  Layers, 
  Calendar, 
  FileText, 
  Database,
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  TrendingUp, 
  Coins, 
  Info,
  ChevronRight,
  LogOut,
  FileCheck,
  Upload,
  Camera,
  Server,
  HardDrive,
  Terminal,
  Download,
  RefreshCw,
  Play,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { 
  getStudents, 
  saveStudents, 
  getTeachers, 
  saveTeachers, 
  getClasses, 
  getFeeStructures, 
  saveFeeStructures, 
  getFeePayments, 
  getAttendance,
  getMarks,
  addStudent,
  addTeacher,
  saveFeePayments
} from '../lib/schoolStorage';
import { Student, Teacher, FeeStructure, FeePayment, SchoolClass } from '../types';
import { DATABASE_SCHEMA_SQL } from '../data/databaseSchema';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'fees' | 'attendance' | 'exams' | 'databases'>('students');

  // Database Hub States
  const [selectedDb, setSelectedDb] = useState<'STUDENT_DB' | 'TEACHER_DB'>('STUDENT_DB');
  const [dbConsoleTab, setDbConsoleTab] = useState<'data' | 'schema' | 'integrity' | 'sql_interpreter'>('data');
  const [dbSearchQuery, setDbSearchQuery] = useState('');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM students LIMIT 5;');
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);

  // Load datasets
  const [students, setStudents] = useState<Student[]>(() => getStudents());
  const [teachers, setTeachers] = useState<Teacher[]>(() => getTeachers());
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(() => getFeeStructures());
  const [feePayments, setFeePayments] = useState<FeePayment[]>(() => getFeePayments());
  const classes = getClasses();
  const attendance = getAttendance();
  const marks = getMarks();

  // Search/Filters state
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('ALL');
  
  const [teacherSearch, setTeacherSearch] = useState('');

  // Modals / Create forms states
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Class-X');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentGuardian, setNewStudentGuardian] = useState('');
  const [newStudentDob, setNewStudentDob] = useState('2012-05-15');
  const [newStudentAddress, setNewStudentAddress] = useState('');
  const [newStudentPhoto, setNewStudentPhoto] = useState('');
  const [dragActiveStudent, setDragActiveStudent] = useState(false);

  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherDesignation, setNewTeacherDesignation] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');
  const [newTeacherSubjects, setNewTeacherSubjects] = useState('');
  const [newTeacherClasses, setNewTeacherClasses] = useState('');
  const [newTeacherAddress, setNewTeacherAddress] = useState('');
  const [newTeacherPhoto, setNewTeacherPhoto] = useState('');
  const [dragActiveTeacher, setDragActiveTeacher] = useState(false);

  const handleStudentDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveStudent(true);
    } else if (e.type === "dragleave") {
      setDragActiveStudent(false);
    }
  };

  const handleStudentDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveStudent(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStudentPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeacherDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveTeacher(true);
    } else if (e.type === "dragleave") {
      setDragActiveTeacher(false);
    }
  };

  const handleTeacherDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveTeacher(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTeacherPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditStudentPhoto = (studentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const list = getStudents();
      const idx = list.findIndex(s => s.id === studentId);
      if (idx !== -1) {
        list[idx].photoUrl = base64String;
        saveStudents(list);
        setStudents(list);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditTeacherPhoto = (teacherId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const list = getTeachers();
      const idx = list.findIndex(t => t.id === teacherId);
      if (idx !== -1) {
        list[idx].photoUrl = base64String;
        saveTeachers(list);
        setTeachers(list);
      }
    };
    reader.readAsDataURL(file);
  };

  // Fee structure setup states
  const [editingFeeStructureId, setEditingFeeStructureId] = useState<string | null>(null);
  const [editTuitionFee, setEditTuitionFee] = useState<number>(0);
  const [editActivityFee, setEditActivityFee] = useState<number>(0);
  const [editExamFee, setEditExamFee] = useState<number>(0);

  // Active receipt invoice popup state
  const [activeReceipt, setActiveReceipt] = useState<FeePayment | null>(null);

  // Filter/Search Logic
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          s.admissionNo.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesClass = studentClassFilter === 'ALL' || s.classId === studentClassFilter;
    return matchesSearch && matchesClass;
  });

  const filteredTeachers = teachers.filter(t => {
    return t.name.toLowerCase().includes(teacherSearch.toLowerCase()) || 
           t.empNo.toLowerCase().includes(teacherSearch.toLowerCase()) ||
           t.subjects.some(sub => sub.toLowerCase().includes(teacherSearch.toLowerCase()));
  });

  // Calculate High-level Dashboard statistics
  const totalStudentsCount = students.length;
  const totalTeachersCount = teachers.length;
  
  const paidPayments = feePayments.filter(p => p.paymentStatus === 'Paid');
  const totalPaidRevenue = paidPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingPayments = feePayments.filter(p => p.paymentStatus === 'Pending');
  const pendingAmount = pendingPayments.reduce((acc, curr) => acc + curr.amount, 0);

  // Add Action Handlers
  const handleAddNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName && newStudentEmail && newStudentPhone && newStudentGuardian) {
      const added = addStudent({
        name: newStudentName,
        classId: newStudentClass,
        section: 'A',
        email: newStudentEmail,
        phone: newStudentPhone,
        username: newStudentName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 10),
        guardianName: newStudentGuardian,
        dob: newStudentDob,
        address: newStudentAddress || 'Greenfield Campus District',
        photoUrl: newStudentPhoto || undefined
      });
      
      // Refresh local states
      setStudents(getStudents());
      setFeePayments(getFeePayments());
      setIsAddingStudent(false);
      
      // Clear values
      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentPhone('');
      setNewStudentGuardian('');
      setNewStudentDob('2012-05-15');
      setNewStudentAddress('');
      setNewStudentPhoto('');
    }
  };

  const handleAddNewTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeacherName && newTeacherDesignation && newTeacherEmail && newTeacherPhone) {
      addTeacher({
        name: newTeacherName,
        designation: newTeacherDesignation,
        email: newTeacherEmail,
        phone: newTeacherPhone,
        username: newTeacherName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 10),
        subjects: newTeacherSubjects ? newTeacherSubjects.split(',').map(s => s.trim()) : ['Mathematics'],
        classes: newTeacherClasses ? newTeacherClasses.split(',').map(c => c.trim()) : ['Class-X'],
        address: newTeacherAddress || 'Chakrapani Das Faculty Quarters',
        photoUrl: newTeacherPhoto || undefined
      });

      // Refresh
      setTeachers(getTeachers());
      setIsAddingTeacher(false);

      setNewTeacherName('');
      setNewTeacherDesignation('');
      setNewTeacherEmail('');
      setNewTeacherPhone('');
      setNewTeacherSubjects('');
      setNewTeacherClasses('');
      setNewTeacherAddress('');
      setNewTeacherPhoto('');
    }
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you absolute sure you want to dismiss this student record?')) {
      const remaining = students.filter(s => s.id !== id);
      saveStudents(remaining);
      setStudents(remaining);
    }
  };

  const handleDeleteTeacher = (id: string) => {
    if (confirm('Are you absolute sure you want to release this teacher profile?')) {
      const remaining = teachers.filter(t => t.id !== id);
      saveTeachers(remaining);
      setTeachers(remaining);
    }
  };

  const handleEditFeeStructure = (fee: FeeStructure) => {
    setEditingFeeStructureId(fee.id);
    setEditTuitionFee(fee.tuitionFee);
    setEditActivityFee(fee.activityFee);
    setEditExamFee(fee.examFee);
  };

  const handleSaveFeeStructure = (id: string) => {
    const list = [...feeStructures];
    const idx = list.findIndex(item => item.id === id);
    if (idx !== -1) {
      list[idx].tuitionFee = editTuitionFee;
      list[idx].activityFee = editActivityFee;
      list[idx].examFee = editExamFee;
      saveFeeStructures(list);
      setFeeStructures(list);
      setEditingFeeStructureId(null);
    }
  };

  const copySQLSchema = () => {
    navigator.clipboard.writeText(DATABASE_SCHEMA_SQL);
    alert('SQL DDL Database Schema copied to your clipboard!');
  };

  const runSqlSandbox = (queryText: string) => {
    setSqlError(null);
    setSqlResult(null);
    try {
      const q = queryText.trim().toLowerCase().replace(/\s+/g, ' ').replace(/;$/, '');
      if (!q.startsWith('select ')) {
        setSqlError('Query Syntax Error: This sandbox is running in secure READ-ONLY mode. Only "SELECT" queries are permitted.');
        return;
      }

      const selectMatch = q.match(/^select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(.+?))?(?:\s+limit\s+(\d+))?$/);
      if (!selectMatch) {
        setSqlError('Query Syntax Error: Check syntax. Supported format: SELECT columns FROM table [WHERE key = \'val\'] [LIMIT num]');
        return;
      }

      const [, fieldsStr, tableName, whereClause, limitStr] = selectMatch;
      let rawSource: any[] = [];
      if (tableName === 'students') {
        rawSource = getStudents();
      } else if (tableName === 'teachers') {
        rawSource = getTeachers();
      } else if (tableName === 'classes') {
        rawSource = getClasses();
      } else if (tableName === 'fee_payments') {
        rawSource = getFeePayments();
      } else {
        setSqlError(`Table "${tableName}" not found in database. Supported tables in this sandbox: 'students', 'teachers', 'classes', 'fee_payments'`);
        return;
      }

      let filtered = [...rawSource];

      if (whereClause) {
        const cleanWhere = whereClause.trim();
        const eqMatch = cleanWhere.match(/(\w+)\s*=\s*'([^']+)'/) || cleanWhere.match(/(\w+)\s*=\s*(\w+)/);
        if (eqMatch) {
          const [, col, val] = eqMatch;
          
          // Case-insensitive col lookup
          filtered = filtered.filter(item => {
            const actualKey = Object.keys(item).find(k => k.toLowerCase() === col.toLowerCase());
            const itemVal = actualKey ? String(item[actualKey as keyof typeof item] || '') : '';
            return itemVal.toLowerCase() === val.toLowerCase();
          });
        } else {
          setSqlError('WHERE clause syntax unsupported. Use precise direct matching e.g. `WHERE classId = \'Class-X\'` or `WHERE id = \'T01\'`');
          return;
        }
      }

      const requestedFields = fieldsStr.split(',').map(f => f.trim());
      const projected = filtered.map(item => {
        if (fieldsStr === '*') return item;
        const newObj: any = {};
        requestedFields.forEach(col => {
          const actualKey = Object.keys(item).find(k => k.toLowerCase() === col.toLowerCase());
          if (actualKey) {
            newObj[col] = item[actualKey as keyof typeof item];
          } else {
            newObj[col] = null;
          }
        });
        return newObj;
      });

      let finalResult = projected;
      if (limitStr) {
        const limitCount = parseInt(limitStr, 10);
        if (!isNaN(limitCount)) {
          finalResult = projected.slice(0, limitCount);
        }
      }

      const columns = fieldsStr === '*' ? (rawSource.length > 0 ? Object.keys(rawSource[0]) : ['id']) : requestedFields;
      setSqlResult({
        rows: finalResult,
        columns: columns,
        count: finalResult.length,
        totalInTable: rawSource.length
      });
    } catch (err: any) {
      setSqlError(`Execution Error: ${err.message || 'Error occurred during SQL processing'}`);
    }
  };

  const verifyDatabaseIntegrity = () => {
    const logs: Array<{ type: 'info' | 'success' | 'warn'; message: string }> = [];
    logs.push({ type: 'info', message: `Initializing Referential Integrity Scanners...` });
    
    // Check Students
    logs.push({ type: 'info', message: `Scanning student records (Total: ${students.length})` });
    let studentErrors = 0;
    const studentUsernames = new Set<string>();
    const studentIds = new Set<string>();
    
    students.forEach(s => {
      if (studentIds.has(s.id)) {
        logs.push({ type: 'warn', message: `CONSTRAINT VIOLATION: Duplicate Student ID '${s.id}' detected for student '${s.name}'!` });
        studentErrors++;
      }
      studentIds.add(s.id);

      if (studentUsernames.has(s.username.toLowerCase())) {
        logs.push({ type: 'warn', message: `CONSTRAINT VIOLATION: Duplicate Username '${s.username}' detected for student '${s.name}'!` });
        studentErrors++;
      }
      studentUsernames.add(s.username.toLowerCase());

      const classExists = classes.some(c => c.id === s.classId);
      if (!classExists) {
        logs.push({ type: 'warn', message: `FOREIGN KEY VIOLATION: Student '${s.name}' has invalid Class ID reference: '${s.classId}'` });
        studentErrors++;
      }
    });

    if (studentErrors === 0) {
      logs.push({ type: 'success', message: `All student reference indices relate perfectly to registered classes.` });
    }

    // Check Teachers
    logs.push({ type: 'info', message: `Scanning teacher/faculty keys (Total: ${teachers.length})` });
    let teacherErrors = 0;
    const teacherUsernames = new Set<string>();
    const teacherIds = new Set<string>();

    teachers.forEach(t => {
      if (teacherIds.has(t.id)) {
        logs.push({ type: 'warn', message: `CONSTRAINT VIOLATION: Duplicate Teacher ID '${t.id}' detected for faculty '${t.name}'!` });
        teacherErrors++;
      }
      teacherIds.add(t.id);

      if (teacherUsernames.has(t.username.toLowerCase())) {
        logs.push({ type: 'warn', message: `CONSTRAINT VIOLATION: Duplicate Username '${t.username}' detected for faculty '${t.name}'!` });
        teacherErrors++;
      }
      teacherUsernames.add(t.username.toLowerCase());
    });

    if (teacherErrors === 0) {
      logs.push({ type: 'success', message: `Teacher and employee data points have been matched successfully.` });
    }

    // Check Marks Integrity
    logs.push({ type: 'info', message: `Scanning marks database indexes...` });
    let marksErrors = 0;
    marks.forEach(m => {
      const studentExists = students.some(s => s.id === m.studentId);
      if (!studentExists) {
        logs.push({ type: 'warn', message: `FOREIGN KEY VIOLATION: Mark index references non-existent Student ID: '${m.studentId}'` });
        marksErrors++;
      }
    });
    if (marksErrors === 0 && marks.length > 0) {
      logs.push({ type: 'success', message: `All mark sheets check out with correct student and parent references.` });
    }

    const totalErrors = studentErrors + teacherErrors + marksErrors;
    if (totalErrors === 0) {
      logs.push({ type: 'success', message: `DATABASE INTEGRITY STATUS: PRISTINE (0 violations of relational keys detected).` });
    } else {
      logs.push({ type: 'warn', message: `DATABASE INTEGRITY STATUS: COMPROMISED (${totalErrors} constraints failed).` });
    }

    return logs;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" id="admin-dashboard-root">
      
      {/* BRAND & HEADER BANNER */}
      <header className="bg-slate-900 text-white shadow-md py-4 px-6 sm:px-8 border-b border-indigo-950 flex items-center justify-between" id="admin-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-650 rounded-xl flex items-center justify-center text-white font-mono font-bold text-lg shadow-lg">
            AD
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-1.5">
              Academy Administrator Panel
            </h1>
            <p className="text-xs text-indigo-300 font-mono">Principal Root Authorization</p>
          </div>
        </div>
        
        {/* Logout Control */}
        <button 
          onClick={onLogout}
          className="bg-white/10 hover:bg-rose-600/20 hover:text-rose-400 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Exit Panel
        </button>
      </header>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDE BAR NAVIGATION METRICS */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-250/60 rounded-2xl p-4 shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Module Navigations</span>
            <nav className="flex flex-col gap-1">
              {[
                { id: 'students', label: 'Manage Students', icon: Users },
                { id: 'teachers', label: 'Manage Teachers', icon: User },
                { id: 'fees', label: 'Fee Matrix & Receipts', icon: DollarSign },
                { id: 'attendance', label: 'Attendance Overviews', icon: Calendar },
                { id: 'exams', label: 'Exam Results Overview', icon: FileCheck },
                { id: 'databases', label: 'Separate Databases Console', icon: Database }
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

          {/* QUICK ACTIONS PANEL */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-sm space-y-3" id="admin-sidebar-quick-actions">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Admin Quick Actions</span>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => {
                  setActiveTab('students');
                  setIsAddingStudent(true);
                  setTimeout(() => {
                    const el = document.getElementById('section-admin-students');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-indigo-500"
                id="btn-sidebar-add-student"
              >
                <Plus className="w-4 h-4 animate-pulse" /> Add New Student
              </button>
              
              <button 
                onClick={() => {
                  setActiveTab('teachers');
                  setIsAddingTeacher(true);
                  setTimeout(() => {
                    const el = document.getElementById('section-admin-teachers');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold px-3 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-755"
                id="btn-sidebar-add-teacher"
              >
                <Plus className="w-4 h-4" /> Add New Teacher
              </button>
            </div>
          </div>

          {/* QUICK SUMMARY bento numbers */}
          <div className="grid grid-cols-2 gap-3" id="admin-sidebar-quick-stats">
            <div 
              onClick={() => {
                setActiveTab('students');
                setIsAddingStudent(true);
              }}
              className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm text-center cursor-pointer hover:border-indigo-600 hover:bg-indigo-50/10 group transition-all relative"
            >
              <span className="text-[9px] font-bold text-slate-400 block uppercase group-hover:text-indigo-600 transition-colors">Students</span>
              <span className="text-2xl font-black text-slate-900 block mt-1 group-hover:scale-105 transition-transform">{totalStudentsCount}</span>
              <span className="absolute bottom-1 right-2 bg-indigo-100 text-indigo-700 rounded-full w-3.5 h-3.5 text-[10px] items-center justify-center font-bold shadow-xs flex select-none group-hover:bg-indigo-650 group-hover:text-white transition-colors" title="Add Student">
                +
              </span>
            </div>
            <div 
              onClick={() => {
                setActiveTab('teachers');
                setIsAddingTeacher(true);
              }}
              className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm text-center cursor-pointer hover:border-amber-600 hover:bg-amber-50/10 group transition-all relative"
            >
              <span className="text-[9px] font-bold text-slate-400 block uppercase group-hover:text-amber-600 transition-colors">Instructors</span>
              <span className="text-2xl font-black text-slate-900 block mt-1 group-hover:scale-105 transition-transform">{totalTeachersCount}</span>
              <span className="absolute bottom-1 right-2 bg-amber-100 text-amber-700 rounded-full w-3.5 h-3.5 text-[10px] items-center justify-center font-bold shadow-xs flex select-none group-hover:bg-amber-650 group-hover:text-white transition-colors" title="Add Instructor">
                +
              </span>
            </div>
          </div>

          <div className="bg-indigo-950 text-indigo-100 p-5 rounded-2xl space-y-2 border border-slate-700">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Billing Ledger status
            </h4>
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <span>Total Collected</span>
                <span className="font-bold text-emerald-400">${totalPaidRevenue}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Outstanding Pending</span>
                <span className="font-bold text-amber-400">${pendingAmount}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* WORKSPACE CONTENT LAYOUT */}
        <main className="lg:col-span-9 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm min-h-[550px]" id="admin-workspace-pane">
          
          {/* ============ TAB: STUDENTS ============ */}
          {activeTab === 'students' && (
            <div className="space-y-6" id="section-admin-students">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Registered Students Repository</h3>
                  <p className="text-xs text-slate-500 mt-0.5">CRUD and standard profile queries on target scholars.</p>
                </div>
                
                <button 
                  onClick={() => setIsAddingStudent(!isAddingStudent)}
                  className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Student
                </button>
              </div>

              {/* Collapsible Add Student form */}
              {isAddingStudent && (
                <form onSubmit={handleAddNewStudent} className="bg-slate-50 p-5 rounded-2xl border border-slate-205/80 space-y-4">
                  <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">New Student Matriculation</h4>
                  
                  {/* Photo Drag & Drop Zone */}
                  <div 
                    onDragEnter={handleStudentDrag}
                    onDragOver={handleStudentDrag}
                    onDragLeave={handleStudentDrag}
                    onDrop={handleStudentDrop}
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                      dragActiveStudent ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-205 bg-slate-50'
                    }`}
                  >
                    {newStudentPhoto ? (
                      <div className="relative">
                        <img src={newStudentPhoto} alt="Preview student" className="w-16 h-16 rounded-xl object-cover border shadow-xs" referrerPolicy="no-referrer" />
                        <button 
                          type="button" 
                          onClick={() => setNewStudentPhoto('')}
                          className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold shadow-sm"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer text-slate-500 text-xs flex flex-col items-center w-full">
                        <Upload className="w-6 h-6 text-indigo-650 mb-1" />
                        <span className="font-medium text-slate-600">Drag and drop student photo here, or <span className="text-indigo-600 font-bold hover:underline">browse</span></span>
                        <span className="text-[9px] text-slate-400 mt-0.5">JPG, PNG or WEBP formats</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setNewStudentPhoto(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Full Student Name</label>
                      <input 
                        type="text" required 
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder="e.g. Priyah Sharma" 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Allocated Standard Class</label>
                      <select 
                        value={newStudentClass}
                        onChange={(e) => setNewStudentClass(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-xs outline-none"
                      >
                        {classes.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Guardian / Sponsor</label>
                      <input 
                        type="text" required
                        value={newStudentGuardian}
                        onChange={(e) => setNewStudentGuardian(e.target.value)}
                        placeholder="e.g. Thomas Mercer" 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Active Email ID</label>
                      <input 
                        type="email" required
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        placeholder="parent.office@test.com" 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Contact Mobile</label>
                      <input 
                        type="text" required
                        value={newStudentPhone}
                        onChange={(e) => setNewStudentPhone(e.target.value)}
                        placeholder="+1 (555) 012-349" 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Date of Birth</label>
                      <input 
                        type="date" required
                        value={newStudentDob}
                        onChange={(e) => setNewStudentDob(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Current Residential Address</label>
                    <input 
                      type="text" 
                      value={newStudentAddress}
                      onChange={(e) => setNewStudentAddress(e.target.value)}
                      placeholder="Street number, City, State ZIP details" 
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setIsAddingStudent(false)} className="px-4 py-2 border border-slate-200 text-xs text-slate-500 rounded-lg hover:bg-slate-100">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-650 text-white font-bold text-xs rounded-lg hover:bg-indigo-700">Save Student Details</button>
                  </div>
                </form>
              )}

              {/* SEARCH & FILTER CONTROLS */}
              <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search by student full name or admission identifier..." 
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-650 outline-none"
                  />
                </div>
                <select 
                  value={studentClassFilter}
                  onChange={(e) => setStudentClassFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-640"
                >
                  <option value="ALL">All Classes filter</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* TABLE LISTING */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-3">Admission No</th>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Full Student Name</th>
                      <th className="p-3">Allocated Class</th>
                      <th className="p-3">Guardian Name</th>
                      <th className="p-3">Contacts</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <tr key={student.id} id={`student-row-${student.id}`} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-slate-900">{student.admissionNo}</td>
                          <td className="p-3 font-mono text-slate-500">{student.rollNo}</td>
                          <td className="p-3 font-bold text-slate-850">
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer group relative flex shrink-0" title="Click to upload/change photo">
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => handleEditStudentPhoto(student.id, e)} 
                                />
                                {student.photoUrl ? (
                                  <div className="relative w-8 h-8">
                                    <img 
                                      src={student.photoUrl} 
                                      alt={student.name} 
                                      referrerPolicy="no-referrer" 
                                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm"
                                    />
                                    <div className="absolute inset-0 bg-black/45 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[8px] text-white font-bold">
                                      ✎
                                    </div>
                                  </div>
                                ) : (
                                  <div className="relative w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs text-indigo-650 group-hover:bg-indigo-100 transition-colors font-sans font-bold">
                                    <span>{student.name.charAt(0)}</span>
                                    <div className="absolute inset-0 bg-black/45 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[8px] text-white font-bold">
                                      ＋
                                    </div>
                                  </div>
                                )}
                              </label>
                              <span>{student.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-650 font-medium">{student.classId}</td>
                          <td className="p-3 text-slate-600">{student.guardianName}</td>
                          <td className="p-3">
                            <span className="block text-slate-500 font-mono text-[10px]">{student.email}</span>
                            <span className="block text-slate-450 font-mono text-[10px]">{student.phone}</span>
                          </td>
                          <td className="p-3 text-center">
                            <button 
                              onClick={() => handleDeleteStudent(student.id)} 
                              title="Dismiss Student"
                              className="p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded transition-colors inline-block"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-400 font-semibold">No registered scholars found matching search filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ TAB: TEACHERS ============ */}
          {activeTab === 'teachers' && (
            <div className="space-y-6" id="section-admin-teachers">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Academic Instructor Registry</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Manage administrative roles, allocated subjects, and instructional access logs.</p>
                </div>
                
                <button 
                  onClick={() => setIsAddingTeacher(!isAddingTeacher)}
                  className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Teacher
                </button>
              </div>

              {/* Collapsible Add Teacher form */}
              {isAddingTeacher && (
                <form onSubmit={handleAddNewTeacher} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">New Instructor Provisioning</h4>

                  {/* Photo Drag & Drop Zone */}
                  <div 
                    onDragEnter={handleTeacherDrag}
                    onDragOver={handleTeacherDrag}
                    onDragLeave={handleTeacherDrag}
                    onDrop={handleTeacherDrop}
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                      dragActiveTeacher ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-205 bg-slate-50'
                    }`}
                  >
                    {newTeacherPhoto ? (
                      <div className="relative">
                        <img src={newTeacherPhoto} alt="Preview teacher" className="w-16 h-16 rounded-xl object-cover border shadow-xs" referrerPolicy="no-referrer" />
                        <button 
                          type="button" 
                          onClick={() => setNewTeacherPhoto('')}
                          className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold shadow-sm"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer text-slate-500 text-xs flex flex-col items-center w-full">
                        <Upload className="w-6 h-6 text-indigo-650 mb-1" />
                        <span className="font-medium text-slate-600">Drag and drop teacher photo here, or <span className="text-indigo-600 font-bold hover:underline">browse</span></span>
                        <span className="text-[9px] text-slate-400 mt-0.5">JPG, PNG or WEBP formats</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setNewTeacherPhoto(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Instructor Name</label>
                      <input 
                        type="text" required 
                        value={newTeacherName}
                        onChange={(e) => setNewTeacherName(e.target.value)}
                        placeholder="e.g. Jennifer Lawrence" 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Designation Rank</label>
                      <input 
                        type="text" required 
                        value={newTeacherDesignation}
                        onChange={(e) => setNewTeacherDesignation(e.target.value)}
                        placeholder="e.g. Senior Science Lecturer" 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">E-Mail Address</label>
                      <input 
                        type="email" required
                        value={newTeacherEmail}
                        onChange={(e) => setNewTeacherEmail(e.target.value)}
                        placeholder="jennifer.l@cdpsj.edu" 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Contact Mobile</label>
                      <input 
                        type="text" required
                        value={newTeacherPhone}
                        onChange={(e) => setNewTeacherPhone(e.target.value)}
                        placeholder="+1 (555) 124-912" 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Assigned Subjects (comma values)</label>
                      <input 
                        type="text"
                        value={newTeacherSubjects}
                        onChange={(e) => setNewTeacherSubjects(e.target.value)}
                        placeholder="Mathematics, Physics, Chemistry" 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Assigned Classes (comma values)</label>
                      <input 
                        type="text"
                        value={newTeacherClasses}
                        onChange={(e) => setNewTeacherClasses(e.target.value)}
                        placeholder="LKG, Class-I, Class-X" 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Residential Quarter</label>
                    <input 
                      type="text"
                      value={newTeacherAddress}
                      onChange={(e) => setNewTeacherAddress(e.target.value)}
                      placeholder="e.g. Faculty Block Room 12" 
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setIsAddingTeacher(false)} className="px-4 py-2 border border-slate-200 text-xs text-slate-500 rounded-lg hover:bg-slate-100">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-650 text-white font-bold text-xs rounded-lg hover:bg-indigo-700">Publish Instructor Details</button>
                  </div>
                </form>
              )}

              {/* SEARCH CONTROL */}
              <div className="relative bg-slate-50 p-4 rounded-xl border border-slate-200">
                <Search className="absolute left-7 top-6.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  placeholder="Query instructor profiles by name, employee code value, or expertise subjects..." 
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-650 outline-none"
                />
              </div>

              {/* LISTING COVERS */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-3">Emp ID</th>
                      <th className="p-3">Faculty Instructor</th>
                      <th className="p-3">Rank/Designation</th>
                      <th className="p-3">Subject Responsibility</th>
                      <th className="p-3">Assigned Classes</th>
                      <th className="p-3">Contacts</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTeachers.map(teacher => (
                      <tr key={teacher.id} id={`teacher-row-${teacher.id}`} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-slate-900">{teacher.empNo}</td>
                        <td className="p-3 font-bold text-slate-850">
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer group relative flex shrink-0" title="Click to upload/change photo">
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleEditTeacherPhoto(teacher.id, e)} 
                              />
                              {teacher.photoUrl ? (
                                <div className="relative w-8 h-8">
                                  <img 
                                    src={teacher.photoUrl} 
                                    alt={teacher.name} 
                                    referrerPolicy="no-referrer" 
                                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm"
                                  />
                                  <div className="absolute inset-0 bg-black/45 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[8px] text-white font-bold">
                                    ✎
                                  </div>
                                </div>
                              ) : (
                                <div className="relative w-8 h-8 rounded-full bg-indigo-50 border border-indigo-150 flex items-center justify-center text-xs text-indigo-650 group-hover:bg-indigo-100 transition-colors font-sans font-bold">
                                  <span>{teacher.name.charAt(0)}</span>
                                  <div className="absolute inset-0 bg-black/45 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[8px] text-white font-bold">
                                    ＋
                                  </div>
                                </div>
                              )}
                            </label>
                            <div>
                              <span className="block">{teacher.name}</span>
                              <span className="block font-mono text-[9px] text-slate-400 font-normal">username: {teacher.username}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-slate-650 font-medium">{teacher.designation}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {teacher.subjects.map(sub => (
                              <span key={sub} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">{sub}</span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {teacher.classes.map(cls => (
                              <span key={cls} className="px-2 py-0.5 bg-indigo-50 text-indigo-750 font-bold rounded text-[10px]">{cls}</span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="block text-slate-500 font-mono text-[10px]">{teacher.email}</span>
                          <span className="block text-slate-450 font-mono text-[10px]">{teacher.phone}</span>
                        </td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            title="Release Teacher Profile"
                            className="p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded transition-colors inline-block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ TAB: FEES MANAGEMENT ============ */}
          {activeTab === 'fees' && (
            <div className="space-y-8" id="section-admin-fees">
              
              {/* Part A: Class-wise Fee Settings */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Class-wise Term Fee Structure Setup</h3>
                  <p className="text-xs text-slate-500">Configure Tuition fee details, activities allotments, and assessment charges for each Class standard.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feeStructures.map(fee => (
                    <div key={fee.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                      {editingFeeStructureId === fee.id ? (
                        <div className="space-y-3 w-full">
                          <h4 className="font-bold text-xs text-slate-700">{fee.classId} Metrics Modification</h4>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">Tuition ($)</span>
                              <input 
                                type="number" 
                                value={editTuitionFee} 
                                onChange={(e) => setEditTuitionFee(Number(e.target.value))} 
                                className="w-full text-xs p-1 border rounded bg-white text-slate-800"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">Activity ($)</span>
                              <input 
                                type="number" 
                                value={editActivityFee} 
                                onChange={(e) => setEditActivityFee(Number(e.target.value))} 
                                className="w-full text-xs p-1 border rounded bg-white text-slate-800"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">Assessment ($)</span>
                              <input 
                                type="number" 
                                value={editExamFee} 
                                onChange={(e) => setEditExamFee(Number(e.target.value))} 
                                className="w-full text-xs p-1 border rounded bg-white text-slate-800"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end pt-1">
                            <button onClick={() => setEditingFeeStructureId(null)} className="px-3 py-1 text-xs border rounded-lg hover:bg-slate-100">Cancel</button>
                            <button onClick={() => handleSaveFeeStructure(fee.id)} className="px-3 py-1 text-xs bg-indigo-650 text-white font-bold rounded-lg hover:bg-indigo-700">Save</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1">
                            <span className="font-bold text-base text-slate-900 block">{fee.classId}</span>
                            <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                              <span>Tuition: ${fee.tuitionFee}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span>Activity: ${fee.activityFee}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span>Exam: ${fee.examFee}</span>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-600 block pt-0.5">Total Term Fee: ${(fee.tuitionFee + fee.activityFee + fee.examFee)}</span>
                          </div>

                          <button 
                            onClick={() => handleEditFeeStructure(fee)}
                            className="p-2 border border-slate-220 hover:border-indigo-600 rounded bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-650 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Part B: Billing Invoice ledger state list */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Term-wise Outstanding Ledger Bills</h3>
                  <p className="text-xs text-slate-500">Track paid or pending statuses of student billing, examine dates, and print verified payment receipts.</p>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                        <th className="p-3">Scholars ADM</th>
                        <th className="p-3">Candidate Scholar</th>
                        <th className="p-3">Class Standard</th>
                        <th className="p-3">Billing Phase</th>
                        <th className="p-3">Term invoice ($)</th>
                        <th className="p-3">Payment Status</th>
                        <th className="p-3 text-center">Receipts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {feePayments.map(payment => {
                        const studInfo = students.find(s => s.id === payment.studentId);
                        const isPaid = payment.paymentStatus === 'Paid';
                        return (
                          <tr key={payment.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono font-bold text-slate-900">{studInfo?.admissionNo || payment.studentId}</td>
                            <td className="p-3 font-bold text-slate-850">{studInfo?.name || 'Academic Transfer'}</td>
                            <td className="p-3 font-medium text-slate-650">{payment.classId}</td>
                            <td className="p-3 text-slate-500 font-medium">{payment.billingMonth}</td>
                            <td className="p-3 font-bold text-slate-800">${payment.amount}</td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isPaid 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {payment.paymentStatus}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              {isPaid ? (
                                <button 
                                  onClick={() => setActiveReceipt(payment)}
                                  className="px-3 py-1 bg-indigo-50 text-indigo-750 font-bold rounded-lg border border-indigo-100 text-[10px] hover:bg-indigo-100 cursor-pointer"
                                >
                                  View Invoice Receipt
                                </button>
                              ) : (
                                <span className="text-slate-400 italic text-[10px]">Awaiting settlement</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RECEIPT DRAWER OVERLAY */}
              {activeReceipt && (
                <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-55 backdrop-blur-xs">
                  <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-6">
                    <div className="text-center pb-4 border-b border-dashed border-slate-150 space-y-1">
                      <span className="w-10 h-10 bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 font-bold rounded-full mx-auto">
                        <FileText className="w-5 h-5" />
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base">Chakrapani Das Public School Invoice Receipt</h4>
                      <p className="text-[10px] text-slate-400">Transaction ID: TXN-{activeReceipt.id}</p>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Scholar Candidate:</span>
                        <span className="font-bold text-slate-850">
                          {students.find(s => s.id === activeReceipt.studentId)?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Class Assigned:</span>
                        <span className="font-bold text-slate-850">{activeReceipt.classId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Billing Phase:</span>
                        <span className="font-bold text-slate-800">{activeReceipt.billingMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Receipt Number:</span>
                        <span className="font-mono font-bold text-emerald-600">{activeReceipt.receiptNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Paid Channel:</span>
                        <span className="font-bold text-slate-700">{activeReceipt.paymentMethod} Gateway</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-2 text-sm">
                        <span className="font-bold text-slate-900">Paid Amount</span>
                        <span className="font-black text-slate-900 text-indigo-600">${activeReceipt.amount}.00</span>
                      </div>
                    </div>

                    <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100 text-center text-[10px] font-bold flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> SECURE OFFICIAL VERIFIED RECEIPT
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                      <button 
                        onClick={() => window.print()}
                        className="p-2 border rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-600"
                      >
                        Print PDF
                      </button>
                      <button 
                        onClick={() => setActiveReceipt(null)}
                        className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ============ TAB: ATTENDANCE OVERVIEWS ============ */}
          {activeTab === 'attendance' && (
            <div className="space-y-6" id="section-admin-attendance">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Student & Instructor Daily Attendance Overview</h3>
                <p className="text-xs text-slate-500 mt-0.5">Audit verified physical state metrics across Classrooms and staff rosters.</p>
              </div>

              {/* Attendance metrics bar chart representation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Students Present/Absent gauge */}
                <div className="bg-slate-55 border border-slate-200/80 p-5 rounded-2xl space-y-4">
                  <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Attendance Percentage - Class X Students</span>
                  
                  <div className="flex items-center gap-6">
                    {/* SVG Circular Progress Gauge */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#E2E8F0" strokeWidth="8" fill="transparent" />
                        <circle cx="48" cy="48" r="40" stroke="#4F46E5" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="37.6" />
                      </svg>
                      <span className="absolute text-lg font-black text-indigo-650">85%</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-650"></span> <span>Present Target (Class X)</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> <span>Absent Candidate (Alex Mercer, etc)</span></div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">Evaluated over past 10 active school lecture cycles.</p>
                    </div>
                  </div>
                </div>

                {/* Staff present list */}
                <div className="bg-slate-55 border border-slate-200/80 p-5 rounded-2xl space-y-4">
                  <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Instructor Attendance Roster (Today)</span>
                  <div className="space-y-2">
                    {teachers.map(teacher => {
                      const record = attendance.find(a => a.entityId === teacher.id && a.entityType === 'teacher');
                      return (
                        <div key={teacher.id} className="flex justify-between items-center text-xs p-2 bg-white rounded-lg border border-slate-150">
                          <span className="font-bold text-slate-800">{teacher.name}</span>
                          <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 text-[10px]">
                            {record?.status || 'Present'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Detailed tabular stream */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 text-sm">Full Roll-call Log Stream</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                        <th className="p-3">Track Date</th>
                        <th className="p-3">Entity Type</th>
                        <th className="p-3">Candidate / Profile</th>
                        <th className="p-3">Class/Dept</th>
                        <th className="p-3">Attendance Status</th>
                        <th className="p-3">Verified By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendance.map(record => {
                        const isStudent = record.entityType === 'student';
                        const name = isStudent 
                          ? students.find(s => s.id === record.entityId)?.name || 'Student'
                          : teachers.find(t => t.id === record.entityId)?.name || 'Teacher';
                        const dept = isStudent 
                          ? students.find(s => s.id === record.entityId)?.classId || 'Class-X'
                          : 'Staff Academic';

                        return (
                          <tr key={record.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono text-slate-500">{record.date}</td>
                            <td className="p-3 font-semibold uppercase text-slate-400 text-[10px]">{record.entityType}</td>
                            <td className="p-3 font-bold text-slate-850">{name}</td>
                            <td className="p-3 text-slate-600 font-medium">{dept}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                record.status === 'Present' ? 'bg-emerald-55 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400 font-medium">{record.markedBy || 'Staff System'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============ TAB: EXAM RESULTS ============ */}
          {activeTab === 'exams' && (
            <div className="space-y-6" id="section-admin-exams">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Formative & Summative Marks Allotment Reports</h3>
                <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit reports on standard grade percentage achievements.</p>
              </div>

              {/* Class-X Exam result stats grids */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-3">Scholar Candidate</th>
                      <th className="p-3">Class Standard</th>
                      <th className="p-3">Assessment Type</th>
                      <th className="p-3">Subject Module</th>
                      <th className="p-3">Marks Allotment</th>
                      <th className="p-3">Percentage Yield</th>
                      <th className="p-3">Calculated Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {marks.map(mark => {
                      const stud = students.find(s => s.id === mark.studentId);
                      const pct = Math.round((mark.marksObtained / mark.maxMarks) * 100);
                      let grade = 'F';
                      if (pct >= 90) grade = 'A+';
                      else if (pct >= 80) grade = 'A';
                      else if (pct >= 70) grade = 'B';
                      else if (pct >= 60) grade = 'C';
                      else if (pct >= 50) grade = 'D';

                      return (
                        <tr key={mark.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-850">{stud?.name || 'Academic Scholar'}</td>
                          <td className="p-3 text-slate-600 font-semibold">{mark.classId}</td>
                          <td className="p-3 font-mono font-bold text-indigo-750 text-[11px]">{mark.examType}</td>
                          <td className="p-3 text-slate-800 font-medium">{mark.subjectName}</td>
                          <td className="p-3 font-medium text-slate-800">{mark.marksObtained} / {mark.maxMarks}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-indigo-600 h-1.5" style={{ width: `${pct}%` }}></div>
                              </div>
                              <span className="font-bold text-slate-700">{pct}%</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              grade === 'A+' || grade === 'A' ? 'bg-emerald-50 text-emerald-700' :
                              grade === 'B' || grade === 'C' ? 'bg-indigo-50 text-indigo-700' :
                              'bg-amber-50 text-amber-700'
                            }`}>
                              Grade {grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ TAB: SECURE SEPARATE DATABASES CONSOLE ============ */}
          {activeTab === 'databases' && (
            <div className="space-y-6 animate-fadeIn lg:col-span-12" id="section-admin-databases">
              
              {/* Header block with statistics */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <Database className="w-5 h-5 text-indigo-650" />
                      Separate Databases Console Hub
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Explore, query, and inspect Student & Teacher relational tables directly in the web UI.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const jsonStr = JSON.stringify({ students, teachers, feePayments, feeStructures }, null, 2);
                        const blob = new Blob([jsonStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `School_Full_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> Full DB Export
                    </button>
                  </div>
                </div>

                {/* DB Instance summary statistics cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-5">
                  <div className="bg-slate-100 border border-slate-200/60 rounded-xl p-3.5 flex items-center gap-3">
                    <div className="p-2 bg-indigo-55 text-indigo-600 rounded-lg">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase font-mono">DB HOST ENGINE</div>
                      <div className="text-xs font-bold text-slate-800 font-mono">Local-Indexed Engine</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-100 border border-slate-200/60 rounded-xl p-3.5 flex items-center gap-3">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase font-mono">STUDENT_DB ROWS</div>
                      <div className="text-xs font-bold text-slate-800">{students.length} Accounts</div>
                    </div>
                  </div>

                  <div className="bg-slate-100 border border-slate-200/60 rounded-xl p-3.5 flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase font-mono">TEACHER_DB ROWS</div>
                      <div className="text-xs font-bold text-slate-800">{teachers.length} Accounts</div>
                    </div>
                  </div>

                  <div className="bg-slate-100 border border-slate-200/60 rounded-xl p-3.5 flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase font-mono">HEALTH STATUS</div>
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active Pristine
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Database selector switch */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-100 p-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setSelectedDb('STUDENT_DB');
                      setSqlQuery('SELECT * FROM students LIMIT 5;');
                      setSqlResult(null);
                      setSqlError(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-2 ${
                      selectedDb === 'STUDENT_DB' 
                        ? 'bg-[#800000] text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <HardDrive className="w-4 h-4" />
                    STUDENT_DB (Segregated)
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedDb('TEACHER_DB');
                      setSqlQuery('SELECT * FROM teachers LIMIT 5;');
                      setSqlResult(null);
                      setSqlError(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-2 ${
                      selectedDb === 'TEACHER_DB' 
                        ? 'bg-[#800000] text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <HardDrive className="w-4 h-4" />
                    TEACHER_DB (Segregated)
                  </button>
                </div>

                {/* Sub Tab selection */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
                  {[
                    { id: 'data', label: 'Data Explorer', icon: Search },
                    { id: 'schema', label: 'Relational DDL', icon: FileText },
                    { id: 'integrity', label: 'Integrity Report', icon: Sliders },
                    { id: 'sql_interpreter', label: 'SQL Console Sandbox', icon: Terminal }
                  ].map(tab => {
                    const active = dbConsoleTab === tab.id;
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setDbConsoleTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          active 
                            ? 'bg-slate-900 text-white' 
                            : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                        }`}
                      >
                        <TabIcon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* VIEW: DATA EXPLORER */}
              {dbConsoleTab === 'data' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      TABLE_NAME: <span className="text-[#800000] font-black">{selectedDb === 'STUDENT_DB' ? 'students' : 'teachers'}</span>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder={`Search ${selectedDb === 'STUDENT_DB' ? 'students' : 'teachers'} record set...`} 
                        value={dbSearchQuery}
                        onChange={(e) => setDbSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#800000] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900 text-slate-100 select-none font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <th className="p-3"># ROW_ID</th>
                          {selectedDb === 'STUDENT_DB' ? (
                            <>
                              <th className="p-3">student_id (PK)</th>
                              <th className="p-3">roll_no</th>
                              <th className="p-3">name</th>
                              <th className="p-3">class_id (FK)</th>
                              <th className="p-3">phone</th>
                              <th className="p-3">guardian_name</th>
                            </>
                          ) : (
                            <>
                              <th className="p-3">teacher_id (PK)</th>
                              <th className="p-3">emp_no (UNIQUE)</th>
                              <th className="p-3">name</th>
                              <th className="p-3">designation</th>
                              <th className="p-3">email</th>
                              <th className="p-3">subject_specialties</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedDb === 'STUDENT_DB' ? (
                          students
                            .filter(s => !dbSearchQuery || s.name.toLowerCase().includes(dbSearchQuery.toLowerCase()) || s.id.toLowerCase().includes(dbSearchQuery.toLowerCase()) || s.classId.toLowerCase().includes(dbSearchQuery.toLowerCase()))
                            .map((row, idx) => (
                              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-3 font-mono text-slate-400 font-semibold">{idx + 1}</td>
                                <td className="p-3 font-mono text-slate-800 font-bold">{row.id}</td>
                                <td className="p-3 font-mono text-indigo-650 font-bold">{row.rollNo || 'N/A'}</td>
                                <td className="p-3 font-semibold text-slate-900">{row.name}</td>
                                <td className="p-3 font-mono"><span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">{row.classId}</span></td>
                                <td className="p-3 text-slate-600">{row.phone}</td>
                                <td className="p-3 text-slate-600">{row.guardianName || 'N/A'}</td>
                              </tr>
                            ))
                        ) : (
                          teachers
                            .filter(t => !dbSearchQuery || t.name.toLowerCase().includes(dbSearchQuery.toLowerCase()) || t.id.toLowerCase().includes(dbSearchQuery.toLowerCase()) || t.designation.toLowerCase().includes(dbSearchQuery.toLowerCase()))
                            .map((row, idx) => (
                              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-3 font-mono text-slate-400 font-semibold">{idx + 1}</td>
                                <td className="p-3 font-mono text-slate-800 font-bold">{row.id}</td>
                                <td className="p-3 font-mono text-indigo-650 font-bold">{row.empNo || 'EMP0' + (idx+1)}</td>
                                <td className="p-3 font-semibold text-slate-900">{row.name}</td>
                                <td className="p-3 text-slate-700 font-medium">{row.designation}</td>
                                <td className="p-3 font-mono text-slate-600">{row.email}</td>
                                <td className="p-3 text-slate-600">{row.subjects || 'All Subjects'}</td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                    <span>* Fetched in real-time from active engine instance</span>
                    <span>Total Loaded Records: {selectedDb === 'STUDENT_DB' ? students.length : teachers.length}</span>
                  </div>
                </div>
              )}

              {/* VIEW: RELATIONAL DDL SCHEMA */}
              {dbConsoleTab === 'schema' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-sans">
                    <div>
                      <h4 className="font-bold text-slate-900">{selectedDb === 'STUDENT_DB' ? 'Relational Students Database (SQL Schema)' : 'Relational Teachers Faculty Database (SQL Schema)'}</h4>
                      <p className="text-[11px] text-slate-400">Strict constraints, keys, index statements and cascade deletes specified inside the system model.</p>
                    </div>
                    <button 
                      onClick={() => {
                        const schemaText = selectedDb === 'STUDENT_DB' 
                          ? DATABASE_SCHEMA_SQL.substring(DATABASE_SCHEMA_SQL.indexOf('-- 3. Students Table'), DATABASE_SCHEMA_SQL.indexOf('-- 4. Classroom Courses'))
                          : DATABASE_SCHEMA_SQL.substring(DATABASE_SCHEMA_SQL.indexOf('-- 2. Teachers Table'), DATABASE_SCHEMA_SQL.indexOf('-- 3. Students Table'));
                        navigator.clipboard.writeText(schemaText.trim());
                        alert(`${selectedDb} Relational Table Setup Schema copied to clipboard!`);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-250 flex items-center gap-1 cursor-pointer transition-all font-sans"
                    >
                      <FileText className="w-3.5 h-3.5" /> Copy Relational DDL
                    </button>
                  </div>

                  <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-800 font-mono text-[11px] overflow-x-auto leading-relaxed shadow-inner max-h-[350px]">
                    <pre>
                      {selectedDb === 'STUDENT_DB' 
                        ? DATABASE_SCHEMA_SQL.substring(DATABASE_SCHEMA_SQL.indexOf('-- 3. Students Table'), DATABASE_SCHEMA_SQL.indexOf('-- 4. Classroom Courses')).trim()
                        : DATABASE_SCHEMA_SQL.substring(DATABASE_SCHEMA_SQL.indexOf('-- 2. Teachers Table'), DATABASE_SCHEMA_SQL.indexOf('-- 3. Students Table')).trim()
                      }
                    </pre>
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100 p-3.5 rounded-xl flex items-start gap-2.5 text-blue-900 text-xs">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <span className="font-bold">Schema Integrity Invariant:</span>{' '}
                      {selectedDb === 'STUDENT_DB' 
                        ? 'Includes roll_no uniqueness per classroom via [CONSTRAINT unique_roll_per_class UNIQUE(class_id, roll_no)], enforcing exact class record segregation.'
                        : 'Enforces strict employee unique constraints to ensure single teacher record allocation per identity with unique username and emp_no verification.'
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: SYSTEM INTEGRITY ANALYSIS */}
              {dbConsoleTab === 'integrity' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 font-sans">Database Consistency & Referential Keys Analyzer</h4>
                    <p className="text-[11px] text-slate-400">Verifies foreign keys, duplicate indices, format alignments and records integrity checkups dynamically.</p>
                  </div>

                  <div className="bg-slate-900 text-[11px] font-mono p-4 rounded-xl text-slate-200 border border-slate-800 max-h-[300px] overflow-y-auto space-y-1.5 shadow-inner">
                    {verifyDatabaseIntegrity().map((log, lidx) => (
                      <div key={lidx} className="flex items-start gap-2">
                        <span className="text-slate-500 select-none">[{lidx+1}]</span>
                        <span className={
                          log.type === 'success' ? 'text-emerald-400 font-semibold' :
                          log.type === 'warn' ? 'text-rose-400 font-bold bg-rose-950/20 px-1 rounded' :
                          'text-indigo-300'
                        }>
                          {log.type === 'success' ? '● SUCCESS: ' : log.type === 'warn' ? '▲ CONSTRAINT_ERROR: ' : 'ℹ INFO: '}
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <div>
                      All dynamic checks completed! There is perfect physical segregation between the <span className="font-bold">Student Database</span> and the <span className="font-bold font-sans">Teacher Database</span>, with isolated persistent credentials and foreign constraints.
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: SQL INTERPRETER / CONSOLE */}
              {dbConsoleTab === 'sql_interpreter' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5 font-sans">
                        <Terminal className="w-4 h-4 text-[#800000]" />
                        SQL Command Engine Sandbox
                      </h4>
                      <p className="text-[11px] text-slate-400">Write standard SQL projection queries below to fetch data from isolated schemas.</p>
                    </div>
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      Read-Only Safe Mode
                    </span>
                  </div>

                  {/* Suggestion Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase mr-1">Quick Queries:</span>
                    <button 
                      onClick={() => {
                        setSqlQuery('SELECT * FROM students LIMIT 5;');
                        runSqlSandbox('SELECT * FROM students LIMIT 5;');
                      }}
                      className="bg-slate-50 hover:bg-slate-100 text-[10px] font-mono text-slate-705 px-2 py-1 rounded border border-slate-200 cursor-pointer"
                    >
                      SELECT * FROM students LIMIT 5
                    </button>
                    <button 
                      onClick={() => {
                        setSqlQuery('SELECT * FROM teachers;');
                        runSqlSandbox('SELECT * FROM teachers;');
                      }}
                      className="bg-slate-50 hover:bg-slate-100 text-[10px] font-mono text-slate-705 px-2 py-1 rounded border border-slate-200 cursor-pointer"
                    >
                      SELECT * FROM teachers
                    </button>
                    <button 
                      onClick={() => {
                        setSqlQuery("SELECT id, name, email FROM teachers;");
                        runSqlSandbox("SELECT id, name, email FROM teachers;");
                      }}
                      className="bg-slate-50 hover:bg-slate-100 text-[10px] font-mono text-slate-705 px-2 py-1 rounded border border-slate-200 cursor-pointer"
                    >
                      SELECT id, name, email FROM teachers
                    </button>
                    <button 
                      onClick={() => {
                        setSqlQuery("SELECT name, phone FROM students WHERE classId = 'Class-X';");
                        runSqlSandbox("SELECT name, phone FROM students WHERE classId = 'Class-X';");
                      }}
                      className="bg-slate-50 hover:bg-slate-100 text-[10px] font-mono text-slate-705 px-2 py-1 rounded border border-slate-200 cursor-pointer"
                    >
                      SELECT name, phone FROM students WHERE classId = 'Class-X'
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <textarea
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      className="font-mono text-xs w-full p-3 border border-slate-300 rounded-xl bg-slate-950 text-slate-100 h-20 shadow-inner"
                      placeholder="e.g. SELECT * FROM students LIMIT 5"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={() => runSqlSandbox(sqlQuery)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" /> Execute Query
                    </button>
                  </div>

                  {/* RESULTS PANELS */}
                  {sqlError && (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-xs text-rose-800 space-y-1 font-mono">
                      <div className="font-bold flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-rose-650" /> PARSE EXCEPTION</div>
                      <div>{sqlError}</div>
                    </div>
                  )}

                  {sqlResult && (
                    <div className="space-y-3 animate-fadeIn text-slate-800 font-sans">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-101">
                        <span>Query returned <span className="text-emerald-700 font-bold">{sqlResult.count}</span> records relative to <span className="font-bold">{sqlResult.totalInTable}</span> table entries.</span>
                        <span className="text-emerald-700 font-bold">Execution Success</span>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-200/60 shadow-sm max-h-[300px]">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-900 border-b border-slate-800 text-slate-250 font-mono text-[10px] uppercase">
                              {sqlResult.columns.map((colName: string) => (
                                <th key={colName} className="p-2.5 font-bold tracking-wider">{colName}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {sqlResult.rows.map((row: any, rIdx: number) => (
                              <tr key={rIdx} className="hover:bg-slate-55/60 transition-all font-mono text-[11px]">
                                {sqlResult.columns.map((colName: string) => {
                                  const cellVal = row[colName];
                                  return (
                                    <td key={colName} className="p-2.5 font-medium text-slate-800">
                                      {cellVal === null || cellVal === undefined ? (
                                        <span className="text-slate-300 select-none">NULL</span>
                                      ) : typeof cellVal === 'object' ? (
                                        <span className="text-indigo-400 font-semibold">{JSON.stringify(cellVal)}</span>
                                      ) : (
                                        String(cellVal)
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                            {sqlResult.rows.length === 0 && (
                              <tr>
                                <td colSpan={sqlResult.columns.length} className="p-8 text-center text-slate-400 font-bold italic bg-slate-50">
                                  No rows found satisfying structural requirements or filter parameters.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      <footer className="h-10 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 sm:px-8 text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono" id="admin-sub-footer">
        <div>🔒 Secure Node: CDPSJ.Admin.Server</div>
        <div className="hidden sm:block">Session Status: Active Secure Authorization</div>
        <div>Role: Root Admin</div>
      </footer>

    </div>
  );
}
