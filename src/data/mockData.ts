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
  Exam, 
  Mark, 
  AttendanceRecord, 
  ClassTimetable, 
  Announcement 
} from '../types';

export const INITIAL_CLASSES: SchoolClass[] = [
  { id: 'LKG', name: 'Lower Kindergarten', section: 'A', classTeacherId: 'T02' },
  { id: 'UKG', name: 'Upper Kindergarten', section: 'A', classTeacherId: 'T02' },
  { id: 'Class-I', name: 'Class I', section: 'A', classTeacherId: 'T02' },
  { id: 'Class-V', name: 'Class V', section: 'A', classTeacherId: 'T03' },
  { id: 'Class-VIII', name: 'Class VIII', section: 'A', classTeacherId: 'T01' },
  { id: 'Class-X', name: 'Class X', section: 'A', classTeacherId: 'T01' }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'T01',
    empNo: 'EMP101',
    name: 'Sarah Jenkins',
    designation: 'Senior Faculty & Mathematics Head',
    email: 'sarah.jenkins@zenith.edu',
    phone: '+1 (555) 123-0192',
    username: 'sarahj',
    password: 'sarah123',
    subjects: ['Mathematics', 'Science'],
    classes: ['Class-VIII', 'Class-X'],
    joiningDate: '2020-08-15',
    address: 'East Academic Quarter 4, School Campus',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    id: 'T02',
    empNo: 'EMP102',
    name: 'David Alroy',
    designation: 'Pre-Primary Coordinator & Languages Head',
    email: 'david.alroy@zenith.edu',
    phone: '+1 (555) 123-0142',
    username: 'davida',
    password: 'david456',
    subjects: ['English', 'Social Studies'],
    classes: ['LKG', 'UKG', 'Class-I'],
    joiningDate: '2021-06-10',
    address: '742 Vista Boulevard, Heights District',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    id: 'T03',
    empNo: 'EMP103',
    name: 'Michael Chen',
    designation: 'Senior Physics & Technology Instructor',
    email: 'michael.chen@zenith.edu',
    phone: '+1 (555) 123-0184',
    username: 'michaelc',
    password: 'michael789',
    subjects: ['Science', 'Computer Studies', 'Mathematics'],
    classes: ['Class-V', 'Class-VIII', 'Class-X'],
    joiningDate: '2019-11-01',
    address: '112 Pine Arbor Drive, Pinecrest',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250&h=250'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  // Class LKG
  {
    id: 'S01',
    rollNo: '01',
    admissionNo: 'ADM2026-LKG-101',
    name: 'Toby Smith',
    classId: 'LKG',
    section: 'A',
    email: 'toby.smith@parents.com',
    phone: '+1 (555) 234-0091',
    username: 'tobys',
    password: 'toby101',
    guardianName: 'Richard Smith',
    dob: '2021-04-12',
    address: '42 Main St, Greenfield',
    admissionDate: '2026-03-10',
    photoUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    id: 'S02',
    rollNo: '02',
    admissionNo: 'ADM2026-LKG-102',
    name: 'Liam Davis',
    classId: 'LKG',
    section: 'A',
    email: 'liam.davis@parents.com',
    phone: '+1 (555) 234-0092',
    username: 'liamd',
    password: 'liam102',
    guardianName: 'Clara Davis',
    dob: '2021-07-22',
    address: '58 Maple Ave, Greenfield',
    admissionDate: '2026-03-11',
    photoUrl: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=250&h=250'
  },

  // Class UKG
  {
    id: 'S03',
    rollNo: '01',
    admissionNo: 'ADM2025-UKG-201',
    name: 'Sophie Green',
    classId: 'UKG',
    section: 'A',
    email: 'sophie.green@parents.com',
    phone: '+1 (555) 345-0010',
    username: 'sophieg',
    password: 'sophie201',
    guardianName: 'Mark Green',
    dob: '2020-01-15',
    address: '12 Oak Lane, Riverdale',
    admissionDate: '2025-03-14',
    photoUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd1102636?auto=format&fit=crop&q=80&w=250&h=250'
  },

  // Class I
  {
    id: 'S04',
    rollNo: '01',
    admissionNo: 'ADM2025-C1-301',
    name: 'Daniel Miller',
    classId: 'Class-I',
    section: 'A',
    email: 'daniel.miller@parents.com',
    phone: '+1 (555) 456-0210',
    username: 'danielm',
    password: 'daniel301',
    guardianName: 'Alice Miller',
    dob: '2019-09-02',
    address: '88 Riverview Rd, Riverdale',
    admissionDate: '2025-03-15',
    photoUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=250&h=250'
  },

  // Class V
  {
    id: 'S05',
    rollNo: '01',
    admissionNo: 'ADM2023-C5-401',
    name: 'Ethan Hunt',
    classId: 'Class-V',
    section: 'A',
    email: 'ethanh@parents.com',
    phone: '+1 (555) 567-0044',
    username: 'ethanh',
    password: 'ethan401',
    guardianName: 'William Hunt',
    dob: '2015-11-30',
    address: '900 Intelligence Dr, Cyber City',
    admissionDate: '2023-04-01',
    photoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    id: 'S06',
    rollNo: '02',
    admissionNo: 'ADM2023-C5-402',
    name: 'Maya Patel',
    classId: 'Class-V',
    section: 'A',
    email: 'maya.patel@parents.com',
    phone: '+1 (555) 567-1234',
    username: 'mayap',
    password: 'maya402',
    guardianName: 'Rohan Patel',
    dob: '2016-02-18',
    address: '14 Lotus Enclave, West End',
    admissionDate: '2023-04-05',
    photoUrl: 'https://images.unsplash.com/photo-1547841243-eacb14453cd9?auto=format&fit=crop&q=80&w=250&h=250'
  },

  // Class VIII
  {
    id: 'S07',
    rollNo: '01',
    admissionNo: 'ADM2022-C8-501',
    name: 'Chloe White',
    classId: 'Class-VIII',
    section: 'A',
    email: 'chloe.white@parents.com',
    phone: '+1 (555) 678-4321',
    username: 'chloew',
    password: 'chloe501',
    guardianName: 'Robert White',
    dob: '2013-05-14',
    address: '22 Blossom Path, Floral Parks',
    admissionDate: '2022-04-10',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250&h=250'
  },

  // Class X (Alex Mercer is our target student for student login)
  {
    id: 'S08',
    rollNo: '01',
    admissionNo: 'ADM2020-C10-601',
    name: 'Alex Mercer',
    classId: 'Class-X',
    section: 'A',
    email: 'alex.mercer@parents.com',
    phone: '+1 (555) 987-6543',
    username: 'alexm',
    password: 'alex601',
    guardianName: 'Thomas Mercer',
    dob: '2011-03-24',
    address: '956 Cyberdyne Way, Silicon Valley',
    admissionDate: '2020-04-01',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    id: 'S09',
    rollNo: '02',
    admissionNo: 'ADM2020-C10-602',
    name: 'Priyah Sharma',
    classId: 'Class-X',
    section: 'A',
    email: 'priyah.sharma@parents.com',
    phone: '+1 (555) 789-1122',
    username: 'priyahs',
    password: 'priyah602',
    guardianName: 'Devendra Sharma',
    dob: '2011-08-01',
    address: '42 Orchid Residency, Central Circle',
    admissionDate: '2020-04-02',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    id: 'S10',
    rollNo: '03',
    admissionNo: 'ADM2020-C10-603',
    name: 'Jordan Taylor',
    classId: 'Class-X',
    section: 'A',
    email: 'jordan.taylor@parents.com',
    phone: '+1 (555) 789-3344',
    username: 'jordant',
    password: 'jordan603',
    guardianName: 'Leslie Taylor',
    dob: '2011-12-10',
    address: '39 Timberline Ridge, North Slope',
    admissionDate: '2020-04-15',
    photoUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=250&h=250'
  }
];

export const INITIAL_FEE_STRUCTURES: FeeStructure[] = [
  { id: 'FS1', classId: 'LKG', tuitionFee: 450, activityFee: 100, examFee: 50, term: 'Quarterly' },
  { id: 'FS2', classId: 'UKG', tuitionFee: 470, activityFee: 100, examFee: 50, term: 'Quarterly' },
  { id: 'FS3', classId: 'Class-I', tuitionFee: 600, activityFee: 120, examFee: 80, term: 'Quarterly' },
  { id: 'FS4', classId: 'Class-V', tuitionFee: 650, activityFee: 130, examFee: 80, term: 'Quarterly' },
  { id: 'FS5', classId: 'Class-VIII', tuitionFee: 800, activityFee: 150, examFee: 100, term: 'Quarterly' },
  { id: 'FS6', classId: 'Class-X', tuitionFee: 950, activityFee: 200, examFee: 120, term: 'Quarterly' }
];

export const INITIAL_FEE_PAYMENTS: FeePayment[] = [
  // Payments for LKG (Toby Smith)
  { id: 'FP01', studentId: 'S01', classId: 'LKG', billingMonth: 'Term 1 (Apr-Jun)', amount: 600, paymentStatus: 'Paid', paidAt: '2026-04-05', receiptNo: 'REC-2026-901', paymentMethod: 'Card' },
  { id: 'FP02', studentId: 'S01', classId: 'LKG', billingMonth: 'Term 2 (Jul-Sep)', amount: 600, paymentStatus: 'Pending' },

  // Payments for Class X (Alex Mercer)
  { id: 'FP03', studentId: 'S08', classId: 'Class-X', billingMonth: 'Term 1 (Apr-Jun)', amount: 1270, paymentStatus: 'Paid', paidAt: '2026-04-02', receiptNo: 'REC-2026-015', paymentMethod: 'UPI' },
  { id: 'FP04', studentId: 'S08', classId: 'Class-X', billingMonth: 'Term 2 (Jul-Sep)', amount: 1270, paymentStatus: 'Pending' },

  // Priyah Sharma fee payments
  { id: 'FP05', studentId: 'S09', classId: 'Class-X', billingMonth: 'Term 1 (Apr-Jun)', amount: 1270, paymentStatus: 'Paid', paidAt: '2026-04-03', receiptNo: 'REC-2026-022', paymentMethod: 'Cash' },
  { id: 'FP06', studentId: 'S09', classId: 'Class-X', billingMonth: 'Term 2 (Jul-Sep)', amount: 1270, paymentStatus: 'Paid', paidAt: '2026-06-10', receiptNo: 'REC-2026-218', paymentMethod: 'UPI' }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'A01',
    title: 'School Reopening & Academic Planning',
    content: 'We welcome all new and returning students to the 2026-2027 Academic Session. Regular lectures begin Monday, June 15, 2026. Please check your timetables of the new term.',
    date: '2026-06-05',
    category: 'Academic',
    target: 'all'
  },
  {
    id: 'A02',
    title: 'Upcoming Formative Assessment I (FA-I)',
    content: 'The FA-I exams for Class V to X are tentatively scheduled from June 24, 2026. Detailed class-wise schedules, syllabi, and marks allotments can be accessed in current panels.',
    date: '2026-06-10',
    category: 'Exam',
    target: 'all'
  },
  {
    id: 'A03',
    title: 'Staff Meeting on Grading Standards',
    content: 'All senior and junior teachers must attend the syllabus synchronization and grading framework meet in the Principal Conference Room at 3:30 PM, Tuesday.',
    date: '2026-06-11',
    category: 'General',
    target: 'teachers'
  },
  {
    id: 'A04',
    title: 'Annual Inter-School Sports Gala 2026',
    content: 'Registration for track, football, and swimming meets are now open. Interested students can coordinate with the Athletic Coordinator to verify physical eligibility criteria.',
    date: '2026-06-08',
    category: 'Event',
    target: 'students'
  }
];

export const SYLLABUS_DATA: SyllabusItem[] = [
  {
    id: 'SY1',
    classId: 'LKG',
    subjectName: 'English',
    chapters: [
      { title: 'Alphabet Recognition', description: 'Interactive learning of uppercase letters A to Z.', duration: '4 Weeks' },
      { title: 'Phonics Sounds', description: 'Early phonetic sound correlation for short vowels.', duration: '4 Weeks' },
      { title: 'Pre-writing Skills', description: 'Tracing practice with straight lines, curves, and patterns.', duration: '3 Weeks' }
    ],
    pdfAvailable: true
  },
  {
    id: 'SY2',
    classId: 'LKG',
    subjectName: 'Mathematics',
    chapters: [
      { title: 'Numbers Counting 1-20', description: 'Oral counting, written tracing, and quantity association.', duration: '5 Weeks' },
      { title: 'Shapes & Colors', description: 'Identifying circles, squares, triangles, and primary colors.', duration: '3 Weeks' }
    ],
    pdfAvailable: true
  },
  {
    id: 'SY3',
    classId: 'Class-V',
    subjectName: 'Mathematics',
    chapters: [
      { title: 'Large Numbers', description: 'Place values, international and regional systems, and rounding values.', duration: '3 Weeks' },
      { title: 'Fractional Arithmetic', description: 'Addition/subtraction of like/unlike fractions, fraction conversions.', duration: '4 Weeks' },
      { title: 'Decimal Introduction', description: 'Mapping place values of decimals, correlation with units.', duration: '3 Weeks' }
    ],
    pdfAvailable: true
  },
  {
    id: 'SY4',
    classId: 'Class-X',
    subjectName: 'Mathematics',
    chapters: [
      { title: 'Real Numbers', description: 'Euclid Division Lemma, fundamental theorem of arithmetic, irrationality proofs.', duration: '3 Weeks' },
      { title: 'Polynomials & Quadratics', description: 'Zeroes of quadratic polynomials, algebraic solving techniques.', duration: '4 Weeks' },
      { title: 'Trigonometry Introduction', description: 'Trigonometric ratios, standard angles (30, 45, 60, 90), simple identities.', duration: '4 Weeks' },
      { title: 'Coordinate Geometry', description: 'Distance formula, section formula, area calculation of standard plane coordinates.', duration: '3 Weeks' }
    ],
    pdfAvailable: true
  },
  {
    id: 'SY5',
    classId: 'Class-X',
    subjectName: 'Science',
    chapters: [
      { title: 'Chemical Reactions', description: 'Balancing chemical equation, displacement, combined synthesis, redox.', duration: '4 Weeks' },
      { title: 'Life Processes', description: 'Nutrition, respiration, and fluid transport models in organic systems.', duration: '4 Weeks' },
      { title: 'Light: Reflection & Refraction', description: 'Spherical mirror formulas, magnification ratios, refractive index math.', duration: '5 Weeks' }
    ],
    pdfAvailable: true
  }
];

export const INITIAL_MARKS: Mark[] = [
  // Marks for S08 (Alex Mercer) in Class X
  // FA-I
  { id: 'M01', studentId: 'S08', classId: 'Class-X', examType: 'FA-I', subjectName: 'Mathematics', marksObtained: 23, maxMarks: 25, gradedBy: 'T01', date: '2026-05-15' },
  { id: 'M02', studentId: 'S08', classId: 'Class-X', examType: 'FA-I', subjectName: 'Science', marksObtained: 22, maxMarks: 25, gradedBy: 'T03', date: '2026-05-16' },
  { id: 'M03', studentId: 'S08', classId: 'Class-X', examType: 'FA-I', subjectName: 'English', marksObtained: 24, maxMarks: 25, gradedBy: 'T02', date: '2026-05-17' },
  
  // FA-II
  { id: 'M04', studentId: 'S08', classId: 'Class-X', examType: 'FA-II', subjectName: 'Mathematics', marksObtained: 21, maxMarks: 25, gradedBy: 'T01', date: '2026-06-02' },
  { id: 'M05', studentId: 'S08', classId: 'Class-X', examType: 'FA-II', subjectName: 'Science', marksObtained: 24, maxMarks: 25, gradedBy: 'T03', date: '2026-06-03' },
  { id: 'M06', studentId: 'S08', classId: 'Class-X', examType: 'FA-II', subjectName: 'English', marksObtained: 22, maxMarks: 25, gradedBy: 'T02', date: '2026-06-04' },

  // SA-I (Out of 100)
  { id: 'M07', studentId: 'S08', classId: 'Class-X', examType: 'SA-I', subjectName: 'Mathematics', marksObtained: 88, maxMarks: 100, gradedBy: 'T01', date: '2026-10-12' },
  { id: 'M08', studentId: 'S08', classId: 'Class-X', examType: 'SA-I', subjectName: 'Science', marksObtained: 92, maxMarks: 100, gradedBy: 'T03', date: '2026-10-14' },
  { id: 'M09', studentId: 'S08', classId: 'Class-X', examType: 'SA-I', subjectName: 'English', marksObtained: 85, maxMarks: 100, gradedBy: 'T02', date: '2026-10-16' },

  // Marks for S09 (Priyah Sharma)
  { id: 'M10', studentId: 'S09', classId: 'Class-X', examType: 'FA-I', subjectName: 'Mathematics', marksObtained: 24, maxMarks: 25, gradedBy: 'T01', date: '2026-05-15' },
  { id: 'M11', studentId: 'S09', classId: 'Class-X', examType: 'FA-I', subjectName: 'Science', marksObtained: 23, maxMarks: 25, gradedBy: 'T03', date: '2026-05-16' },
  { id: 'M12', studentId: 'S09', classId: 'Class-X', examType: 'FA-I', subjectName: 'English', marksObtained: 25, maxMarks: 25, gradedBy: 'T02', date: '2026-05-17' },
  
  // Marks for S10 (Jordan Taylor)
  { id: 'M13', studentId: 'S10', classId: 'Class-X', examType: 'FA-I', subjectName: 'Mathematics', marksObtained: 18, maxMarks: 25, gradedBy: 'T01', date: '2026-05-15' },
  { id: 'M14', studentId: 'S10', classId: 'Class-X', examType: 'FA-I', subjectName: 'Science', marksObtained: 19, maxMarks: 25, gradedBy: 'T03', date: '2026-05-16' },
  { id: 'M15', studentId: 'S10', classId: 'Class-X', examType: 'FA-I', subjectName: 'English', marksObtained: 20, maxMarks: 25, gradedBy: 'T02', date: '2026-05-17' }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Today's student attendance (Class X)
  { id: 'A_S01_TODAY', date: '2026-06-12', entityId: 'S08', entityType: 'student', status: 'Present', markedBy: 'T01' },
  { id: 'A_S02_TODAY', date: '2026-06-12', entityId: 'S09', entityType: 'student', status: 'Present', markedBy: 'T01' },
  { id: 'A_S03_TODAY', date: '2026-06-12', entityId: 'S10', entityType: 'student', status: 'Absent', markedBy: 'T01' },

  // Yesterday's attendance for Class X
  { id: 'A_S01_YEST', date: '2026-06-11', entityId: 'S08', entityType: 'student', status: 'Present', markedBy: 'T01' },
  { id: 'A_S02_YEST', date: '2026-06-11', entityId: 'S09', entityType: 'student', status: 'Present', markedBy: 'T01' },
  { id: 'A_S03_YEST', date: '2026-06-11', entityId: 'S10', entityType: 'student', status: 'Present', markedBy: 'T01' },

  // Standard past month logs for Alex Mercer (S08) to display nice percentages on Student board
  { id: 'A_S01_1', date: '2026-06-01', entityId: 'S08', entityType: 'student', status: 'Present', markedBy: 'T01' },
  { id: 'A_S01_2', date: '2026-06-02', entityId: 'S08', entityType: 'student', status: 'Present', markedBy: 'T01' },
  { id: 'A_S01_3', date: '2026-06-03', entityId: 'S08', entityType: 'student', status: 'Present', markedBy: 'T01' },
  { id: 'A_S01_4', date: '2026-06-04', entityId: 'S08', entityType: 'student', status: 'Absent', markedBy: 'T01' },
  { id: 'A_S01_5', date: '2026-06-05', entityId: 'S08', entityType: 'student', status: 'Present', markedBy: 'T01' },
  { id: 'A_S01_8', date: '2026-06-08', entityId: 'S08', entityType: 'student', status: 'Present', markedBy: 'T01' },
  { id: 'A_S01_9', date: '2026-06-09', entityId: 'S08', entityType: 'student', status: 'Present', markedBy: 'T01' },
  { id: 'A_S01_10', date: '2026-06-10', entityId: 'S08', entityType: 'student', status: 'Present', markedBy: 'T01' },

  // Teacher attendance log for today
  { id: 'A_T01_TODAY', date: '2026-06-12', entityId: 'T01', entityType: 'teacher', status: 'Present', markedBy: 'admin' },
  { id: 'A_T02_TODAY', date: '2026-06-12', entityId: 'T02', entityType: 'teacher', status: 'Present', markedBy: 'admin' },
  { id: 'A_T03_TODAY', date: '2026-06-12', entityId: 'T03', entityType: 'teacher', status: 'Present', markedBy: 'admin' }
];

export const TIMETABLE_CLASS_X: ClassTimetable = {
  classId: 'Class-X',
  schedule: [
    {
      day: 'Monday',
      periods: [
        { time: '08:30 AM - 09:15 AM', subject: 'Mathematics', teacherName: 'Sarah Jenkins' },
        { time: '09:15 AM - 10:00 AM', subject: 'Science', teacherName: 'Michael Chen' },
        { time: '10:15 AM - 11:00 AM', subject: 'English', teacherName: 'David Alroy' },
        { time: '11:00 AM - 11:45 AM', subject: 'Computer Studies', teacherName: 'Michael Chen' },
        { time: '12:30 PM - 01:15 PM', subject: 'Library', teacherName: 'Interim Assistant' }
      ]
    },
    {
      day: 'Tuesday',
      periods: [
        { time: '08:30 AM - 09:15 AM', subject: 'Science', teacherName: 'Michael Chen' },
        { time: '09:15 AM - 10:00 AM', subject: 'Mathematics', teacherName: 'Sarah Jenkins' },
        { time: '10:15 AM - 11:00 AM', subject: 'English', teacherName: 'David Alroy' },
        { time: '11:00 AM - 11:45 AM', subject: 'Games & PE', teacherName: 'Athletic Coach' },
        { time: '12:30 PM - 01:15 PM', subject: 'Social Studies', teacherName: 'David Alroy' }
      ]
    },
    {
      day: 'Wednesday',
      periods: [
        { time: '08:30 AM - 09:15 AM', subject: 'Mathematics', teacherName: 'Sarah Jenkins' },
        { time: '09:15 AM - 10:00 AM', subject: 'English', teacherName: 'David Alroy' },
        { time: '10:15 AM - 11:00 AM', subject: 'Science', teacherName: 'Michael Chen' },
        { time: '11:00 AM - 11:45 AM', subject: 'Computer Studies', teacherName: 'Michael Chen' },
        { time: '12:30 PM - 01:15 PM', subject: 'Arts & Craft', teacherName: 'Auxiliary Staff' }
      ]
    },
    {
      day: 'Thursday',
      periods: [
        { time: '08:30 AM - 09:15 AM', subject: 'Science', teacherName: 'Michael Chen' },
        { time: '09:15 AM - 10:00 AM', subject: 'Social Studies', teacherName: 'David Alroy' },
        { time: '10:15 AM - 11:00 AM', subject: 'Mathematics', teacherName: 'Sarah Jenkins' },
        { time: '11:00 AM - 11:45 AM', subject: 'English', teacherName: 'David Alroy' },
        { time: '12:30 PM - 01:15 PM', subject: 'Self Study', teacherName: 'Class Proctor' }
      ]
    },
    {
      day: 'Friday',
      periods: [
        { time: '08:30 AM - 09:15 AM', subject: 'English', teacherName: 'David Alroy' },
        { time: '09:15 AM - 10:00 AM', subject: 'Computer Studies', teacherName: 'Michael Chen' },
        { time: '10:15 AM - 11:00 AM', subject: 'Science', teacherName: 'Michael Chen' },
        { time: '11:00 AM - 11:45 AM', subject: 'Mathematics', teacherName: 'Sarah Jenkins' },
        { time: '12:30 PM - 01:15 PM', subject: 'Club Activity', teacherName: 'Club Advisor' }
      ]
    }
  ]
};
