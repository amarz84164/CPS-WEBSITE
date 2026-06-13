/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'public' | 'admin' | 'teacher' | 'student';

export interface Student {
  id: string;
  rollNo: string;
  admissionNo: string;
  name: string;
  classId: string; // e.g., "LKG", "Class V"
  section: string; // e.g., "A", "B"
  email: string;
  phone: string;
  username: string;
  password?: string;
  guardianName: string;
  dob: string;
  address: string;
  admissionDate: string;
  photoUrl?: string;
}

export interface Teacher {
  id: string;
  empNo: string;
  name: string;
  designation: string; // e.g., "Senior Mathematics Teacher"
  email: string;
  phone: string;
  username: string;
  password?: string;
  subjects: string[]; // e.g., ["Mathematics", "Physics"]
  classes: string[]; // e.g., ["Class VI", "Class VII", "Class VIII"]
  joiningDate: string;
  address: string;
  photoUrl?: string;
}

export interface SchoolClass {
  id: string; // e.g. "LKG"
  name: string; // e.g. "Lower Kindergarten"
  section: string; // e.g. "A"
  classTeacherId: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface SyllabusItem {
  id: string;
  classId: string;
  subjectName: string;
  chapters: { title: string; description: string; duration: string }[];
  pdfAvailable: boolean;
}

export interface FeeStructure {
  id: string;
  classId: string;
  tuitionFee: number;
  activityFee: number;
  examFee: number;
  term: 'Monthly' | 'Quarterly' | 'Yearly';
}

export interface FeePayment {
  id: string;
  studentId: string;
  classId: string;
  billingMonth: string; // e.g., "June 2026", "Quarter 1"
  amount: number;
  paymentStatus: 'Paid' | 'Pending';
  paidAt?: string;
  receiptNo?: string;
  paymentMethod?: string;
}

export type ExamType = 'FA-I' | 'FA-II' | 'SA-I' | 'SA-II';

export interface Exam {
  id: string;
  title: string; // e.g. "Formative Assessment I"
  type: ExamType;
  classId: string;
  maxMarks: number;
}

export interface Mark {
  id: string;
  studentId: string;
  classId: string;
  examType: ExamType;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  gradedBy: string; // Teacher ID
  date: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  entityId: string; // Student ID or Teacher ID
  entityType: 'student' | 'teacher';
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  markedBy: string; // user ID who marked it
}

export interface TimetablePeriod {
  time: string; // e.g. "08:30 AM - 09:15 AM"
  subject: string;
  teacherName: string;
}

export interface DayTimetable {
  day: string; // Monday, Tuesday, etc.
  periods: TimetablePeriod[];
}

export interface ClassTimetable {
  classId: string;
  schedule: DayTimetable[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'General' | 'Academic' | 'Exam' | 'Event' | 'Holiday';
  target: 'all' | 'teachers' | 'students' | 'parents';
}
