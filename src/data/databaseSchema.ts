/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const DATABASE_SCHEMA_SQL = `-- ==========================================
-- School Management System - Database Schema
-- Target Relational Engine: PostgreSQL / MySQL
-- ==========================================

-- 1. Classes Table
CREATE TABLE classes (
    class_id VARCHAR(20) PRIMARY KEY, -- e.g., 'Class-X', 'LKG'
    name VARCHAR(100) NOT NULL,       -- e.g., 'Class Ten', 'Lower Kindergarten'
    section VARCHAR(10) NOT NULL,     -- e.g., 'A', 'B'
    room_number VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Teachers Table
CREATE TABLE teachers (
    teacher_id VARCHAR(50) PRIMARY KEY,      -- Unique identifier / UI login
    emp_no VARCHAR(20) UNIQUE NOT NULL,      -- Employee ID (e.g. EMP101)
    name VARCHAR(150) NOT NULL,
    designation VARCHAR(100) NOT NULL,       -- e.g. 'Senior Physics Teacher'
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,     -- Secure hashed password
    joining_date DATE NOT NULL,
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Students Table
CREATE TABLE students (
    student_id VARCHAR(50) PRIMARY KEY,
    roll_no VARCHAR(20) NOT NULL,
    admission_no VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    class_id VARCHAR(20) REFERENCES classes(class_id),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    guardian_name VARCHAR(150) NOT NULL,
    dob DATE NOT NULL,
    address TEXT,
    admission_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_roll_per_class UNIQUE (class_id, roll_no)
);

-- 4. Classroom Courses / Subjects Lookup Table
CREATE TABLE subjects (
    subject_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL
);

-- 5. Teacher-Class-Subject Assignment (Junction Table)
CREATE TABLE teacher_assignments (
    assignment_id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(50) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    class_id VARCHAR(20) REFERENCES classes(class_id) ON DELETE CASCADE,
    subject_id VARCHAR(50) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    academic_year VARCHAR(10) NOT NULL, -- e.g., '2026-2027'
    UNIQUE(teacher_id, class_id, subject_id, academic_year)
);

-- 6. Fees Structure Table
CREATE TABLE fee_structures (
    fee_structure_id SERIAL PRIMARY KEY,
    class_id VARCHAR(20) REFERENCES classes(class_id) UNIQUE,
    tuition_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    activity_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    exam_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    term VARCHAR(20) NOT NULL DEFAULT 'Monthly', -- Monthly, Quarterly, Yearly
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Fees Invoices / Payments Tracking
CREATE TABLE fee_payments (
    payment_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES students(student_id) ON DELETE CASCADE,
    class_id VARCHAR(20) REFERENCES classes(class_id),
    billing_month VARCHAR(50) NOT NULL,          -- e.g., 'June 2026'
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,         -- 'Paid', 'Pending'
    paid_at TIMESTAMP WITH TIME ZONE,
    receipt_no VARCHAR(50) UNIQUE,
    payment_method VARCHAR(50),                  -- 'Upi', 'Card', 'Cash'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Attendance Table (Covers Students and Teachers)
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    attendance_date DATE NOT NULL,
    entity_id VARCHAR(50) NOT NULL,              -- References student_id or teacher_id
    entity_type VARCHAR(10) NOT NULL,            -- 'student' or 'teacher'
    status VARCHAR(15) NOT NULL,                 -- 'Present', 'Absent', 'Late', 'Excused'
    marked_by VARCHAR(50) NOT NULL,              -- User ID of marker (Teacher or Admin)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_attendance_per_day UNIQUE(entity_id, attendance_date)
);

-- 9. Exams Configuration
CREATE TABLE exams (
    exam_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,                -- e.g. 'Formative Assessment I'
    exam_type VARCHAR(10) NOT NULL,              -- 'FA-I', 'FA-II', 'SA-I', 'SA-II'
    class_id VARCHAR(20) REFERENCES classes(class_id) ON DELETE CASCADE,
    max_marks INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Student Marks Table
CREATE TABLE student_marks (
    mark_id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES students(student_id) ON DELETE CASCADE,
    class_id VARCHAR(20) REFERENCES classes(class_id),
    exam_type VARCHAR(10) NOT NULL,              -- 'FA-I', 'FA-II', 'SA-I', 'SA-II'
    subject_name VARCHAR(100) NOT NULL,          -- e.g. 'Mathematics'
    marks_obtained DECIMAL(5, 2) NOT NULL,
    max_marks INTEGER NOT NULL DEFAULT 100,
    graded_by VARCHAR(50) NOT NULL,              -- Teacher ID
    remarks TEXT,
    graded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_exam_subject UNIQUE(student_id, exam_type, subject_name)
);

-- 11. Announcements Table
CREATE TABLE announcements (
    announcement_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    announcement_date DATE NOT NULL,
    category VARCHAR(20) NOT NULL,               -- 'General', 'Academic', 'Exam', 'Event'
    target_role VARCHAR(20) NOT NULL,            -- 'all', 'teachers', 'students', 'parents'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX idx_student_class ON students(class_id);
CREATE INDEX idx_fee_student ON fee_payments(student_id);
CREATE INDEX idx_attendance_date_entity ON attendance(attendance_date, entity_id);
CREATE INDEX idx_student_marks_lookup ON student_marks(student_id, exam_type);
`;
