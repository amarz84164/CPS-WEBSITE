/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Student, 
  Teacher, 
  SchoolClass, 
  SyllabusItem, 
  FeeStructure, 
  FeePayment, 
  Mark, 
  AttendanceRecord,
  Announcement
} from '../types';

import {
  INITIAL_CLASSES,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_FEE_STRUCTURES,
  INITIAL_FEE_PAYMENTS,
  INITIAL_ANNOUNCEMENTS,
  SYLLABUS_DATA,
  INITIAL_MARKS,
  INITIAL_ATTENDANCE
} from '../data/mockData';

const KEYS = {
  CLASSES: 'zenith_classes',
  TEACHERS: 'zenith_teachers',
  STUDENTS: 'zenith_students',
  FEE_STRUCTURES: 'zenith_fee_structures',
  FEE_PAYMENTS: 'zenith_fee_payments',
  ANNOUNCEMENTS: 'zenith_announcements',
  MARKS: 'zenith_marks',
  ATTENDANCE: 'zenith_attendance'
};

export function initializeSchoolStorage() {
  // Clear old outdated template credentials if they exist in localStorage cache
  const rawTeachers = localStorage.getItem(KEYS.TEACHERS);
  const rawStudents = localStorage.getItem(KEYS.STUDENTS);
  if (rawTeachers && (rawTeachers.includes('"teacher1"') || !rawTeachers.includes('"password"'))) {
    localStorage.removeItem(KEYS.TEACHERS);
    localStorage.removeItem(KEYS.MARKS); // clear dependent marks too for consistent integrity
    localStorage.removeItem(KEYS.ATTENDANCE);
  }
  if (rawStudents && (rawStudents.includes('"student1"') || !rawStudents.includes('"password"'))) {
    localStorage.removeItem(KEYS.STUDENTS);
    localStorage.removeItem(KEYS.FEE_PAYMENTS);
  }

  if (!localStorage.getItem(KEYS.CLASSES)) {
    localStorage.setItem(KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
  }
  if (!localStorage.getItem(KEYS.TEACHERS)) {
    localStorage.setItem(KEYS.TEACHERS, JSON.stringify(INITIAL_TEACHERS));
  }
  if (!localStorage.getItem(KEYS.STUDENTS)) {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  }
  if (!localStorage.getItem(KEYS.FEE_STRUCTURES)) {
    localStorage.setItem(KEYS.FEE_STRUCTURES, JSON.stringify(INITIAL_FEE_STRUCTURES));
  }
  if (!localStorage.getItem(KEYS.FEE_PAYMENTS)) {
    localStorage.setItem(KEYS.FEE_PAYMENTS, JSON.stringify(INITIAL_FEE_PAYMENTS));
  }
  if (!localStorage.getItem(KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem(KEYS.MARKS)) {
    localStorage.setItem(KEYS.MARKS, JSON.stringify(INITIAL_MARKS));
  }
  if (!localStorage.getItem(KEYS.ATTENDANCE)) {
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
  }
}

// Low-level getters/setters
export function getClasses(): SchoolClass[] {
  initializeSchoolStorage();
  return JSON.parse(localStorage.getItem(KEYS.CLASSES) || '[]');
}

export function saveClasses(classes: SchoolClass[]) {
  localStorage.setItem(KEYS.CLASSES, JSON.stringify(classes));
}

export function getTeachers(): Teacher[] {
  initializeSchoolStorage();
  return JSON.parse(localStorage.getItem(KEYS.TEACHERS) || '[]');
}

export function saveTeachers(teachers: Teacher[]) {
  localStorage.setItem(KEYS.TEACHERS, JSON.stringify(teachers));
}

export function getStudents(): Student[] {
  initializeSchoolStorage();
  return JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]');
}

export function saveStudents(students: Student[]) {
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
}

export function getFeeStructures(): FeeStructure[] {
  initializeSchoolStorage();
  return JSON.parse(localStorage.getItem(KEYS.FEE_STRUCTURES) || '[]');
}

export function saveFeeStructures(structures: FeeStructure[]) {
  localStorage.setItem(KEYS.FEE_STRUCTURES, JSON.stringify(structures));
}

export function getFeePayments(): FeePayment[] {
  initializeSchoolStorage();
  return JSON.parse(localStorage.getItem(KEYS.FEE_PAYMENTS) || '[]');
}

export function saveFeePayments(payments: FeePayment[]) {
  localStorage.setItem(KEYS.FEE_PAYMENTS, JSON.stringify(payments));
}

export function getAnnouncements(): Announcement[] {
  initializeSchoolStorage();
  return JSON.parse(localStorage.getItem(KEYS.ANNOUNCEMENTS) || '[]');
}

export function saveAnnouncements(announcements: Announcement[]) {
  localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
}

export function getMarks(): Mark[] {
  initializeSchoolStorage();
  return JSON.parse(localStorage.getItem(KEYS.MARKS) || '[]');
}

export function saveMarks(marks: Mark[]) {
  localStorage.setItem(KEYS.MARKS, JSON.stringify(marks));
}

export function getAttendance(): AttendanceRecord[] {
  initializeSchoolStorage();
  return JSON.parse(localStorage.getItem(KEYS.ATTENDANCE) || '[]');
}

export function saveAttendance(attendance: AttendanceRecord[]) {
  localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(attendance));
}

export function getSyllabus(): SyllabusItem[] {
  return SYLLABUS_DATA; // Static read-only for chapters, defined as standard syllabus content
}

// Helpers for higher level tasks
export function addStudent(student: Omit<Student, 'id' | 'admissionNo' | 'rollNo' | 'admissionDate'>): Student {
  const students = getStudents();
  const classStudents = students.filter(s => s.classId === student.classId);
  const nextRollNo = String(classStudents.length + 1).padStart(2, '0');
  const admissionNo = `ADM2026-${student.classId.toUpperCase()}-${100 + students.length + 1}`;
  const id = `S${String(students.length + 1).padStart(2, '0')}`;
  
  const defaultPhotos = [
    'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1519238263530-99bdd1102636?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=250&h=250'
  ];
  const photoUrl = student.photoUrl || defaultPhotos[students.length % defaultPhotos.length];

  const newStudent: Student = {
    ...student,
    id,
    rollNo: nextRollNo,
    admissionNo,
    admissionDate: new Date().toISOString().split('T')[0],
    photoUrl
  };

  students.push(newStudent);
  saveStudents(students);

  // Generate pending fee payments for the newly registered student
  const feeStructures = getFeeStructures();
  const classFee = feeStructures.find(fs => fs.classId === student.classId);
  if (classFee) {
    const totalFee = classFee.tuitionFee + classFee.activityFee + classFee.examFee;
    const payments = getFeePayments();
    
    // Create prefilled Billing period bills
    payments.push({
      id: `FP_GEN_${id}_1`,
      studentId: id,
      classId: student.classId,
      billingMonth: 'Term 1 (Apr-Jun)',
      amount: totalFee,
      paymentStatus: 'Pending'
    });
    payments.push({
      id: `FP_GEN_${id}_2`,
      studentId: id,
      classId: student.classId,
      billingMonth: 'Term 2 (Jul-Sep)',
      amount: totalFee,
      paymentStatus: 'Pending'
    });
    saveFeePayments(payments);
  }

  return newStudent;
}

export function addTeacher(teacher: Omit<Teacher, 'id' | 'empNo' | 'joiningDate'>): Teacher {
  const teachers = getTeachers();
  const empNo = `EMP${100 + teachers.length + 1}`;
  const id = `T${String(teachers.length + 1).padStart(2, '0')}`;

  const defaultTeacherPhotos = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250&h=250'
  ];
  const photoUrl = teacher.photoUrl || defaultTeacherPhotos[teachers.length % defaultTeacherPhotos.length];

  const newTeacher: Teacher = {
    ...teacher,
    id,
    empNo,
    joiningDate: new Date().toISOString().split('T')[0],
    photoUrl
  };

  teachers.push(newTeacher);
  saveTeachers(teachers);
  return newTeacher;
}

export function markStudentFeeAsPaid(paymentId: string, method: string): FeePayment | null {
  const payments = getFeePayments();
  const idx = payments.findIndex(p => p.id === paymentId);
  if (idx !== -1) {
    payments[idx].paymentStatus = 'Paid';
    payments[idx].paidAt = new Date().toISOString().split('T')[0];
    payments[idx].receiptNo = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;
    payments[idx].paymentMethod = method;
    saveFeePayments(payments);
    return payments[idx];
  }
  return null;
}

export function addBulkMarks(newMarks: Omit<Mark, 'id' | 'date'>[]): void {
  const marks = getMarks();
  const dateStr = new Date().toISOString().split('T')[0];
  
  newMarks.forEach((m, idx) => {
    // Check if item already exists to update it, or push new one
    const existingIdx = marks.findIndex(
      item => item.studentId === m.studentId && 
              item.classId === m.classId && 
              item.examType === m.examType && 
              item.subjectName === m.subjectName
    );

    const markItem: Mark = {
      ...m,
      id: existingIdx !== -1 ? marks[existingIdx].id : `M_GEN_${Date.now()}_${idx}`,
      date: dateStr
    };

    if (existingIdx !== -1) {
      marks[existingIdx] = markItem;
    } else {
      marks.push(markItem);
    }
  });

  saveMarks(marks);
}

export function saveDailyAttendance(records: Omit<AttendanceRecord, 'id'>[]): void {
  const list = getAttendance();
  records.forEach(rec => {
    const existingIdx = list.findIndex(
      item => item.date === rec.date && item.entityId === rec.entityId && item.entityType === rec.entityType
    );

    const fullRecord: AttendanceRecord = {
      ...rec,
      id: existingIdx !== -1 ? list[existingIdx].id : `A_GEN_${rec.entityId}_${rec.date}`
    };

    if (existingIdx !== -1) {
      list[existingIdx] = fullRecord;
    } else {
      list.push(fullRecord);
    }
  });
  saveAttendance(list);
}
