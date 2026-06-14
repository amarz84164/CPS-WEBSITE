/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  Award, 
  Calendar, 
  Activity, 
  History, 
  Heart, 
  UserCheck, 
  Download, 
  FileCheck,
  CheckCircle,
  Menu,
  X,
  Camera,
  Image as ImageIcon,
  Trash2,
  Filter,
  Plus,
  Search,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAnnouncements, getSyllabus, getTeachers } from '../lib/schoolStorage';
import { SyllabusItem } from '../types';
import SchoolLogo from './SchoolLogo';
// @ts-ignore
import recreationalTurfImg from '../assets/images/recreational_turf_1781332683926.jpg';
// @ts-ignore
import principalAmarendraBoroImg from '../assets/images/principal_amarendra_boro_1781354636151.jpg';

const sectionLabels: Record<string, string> = {
  home: 'Home',
  about: 'About Us',
  academics: 'Academics',
  students: 'Student Hub',
  teachers: 'Teacher Hub',
  admissions: 'Admissions',
  gallery: 'Student Gallery',
  contact: 'Contact'
};

const STUDENT_CLUBS = [
  { id: 'club-1', prefix: 'RL', name: 'Robotics & AI Lab', description: 'Design physics models, print 3D prototypes, program autonomous micro-vehicles, and study python algorithmic coding logic.', timings: 'Wednesdays, 03:00 PM - 04:30 PM' },
  { id: 'club-2', prefix: 'DS', name: 'Socrates Debate Society', description: 'Master critical reasoning structure, analysis of current social events, public platform presence, and high-school tournaments.', timings: 'Tuesdays, 03:00 PM - 04:30 PM' },
  { id: 'club-3', prefix: 'MC', name: 'Mercury Coding Society', description: 'Learn web development in React, debug algorithm challenges, build functional micro-projects, and secure district awards.', timings: 'Fridays, 03:00 PM - 04:30 PM' },
  { id: 'club-4', prefix: 'EW', name: 'CDPSJ Eco-Warriors', description: 'Monitor high-school botanical greenhouses, manage solar grid variables, and lead green conservation programs.', timings: 'Mondays, 03:00 PM - 04:30 PM' }
];

const INITIAL_PRESET_GALLERY = [
  {
    id: 'gal-p1',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800&h=600',
    title: 'High-school Physics Circuit Lab',
    description: 'Class X students designing parallel circuit boards during their continuous assessment projects under academic coordinators.',
    uploaderName: 'Professor Sarah Jenkins',
    classId: 'Class-X',
    category: 'Science',
    uploadDate: '2026-05-18'
  },
  {
    id: 'gal-p2',
    url: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800&h=600',
    title: 'Inter-School Soccer Triumph',
    description: 'The moment of celebration after scoring the winning penalty during the Jalah regional athletic qualifiers.',
    uploaderName: 'Coach Athletic Staff',
    classId: 'Class-IX',
    category: 'Sports',
    uploadDate: '2026-06-02'
  },
  {
    id: 'gal-p3',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800&h=600',
    title: 'Socrates Philosophy & Debate Society',
    description: 'Team leaders debating current socio-economic development metrics at our central administrative amphitheater.',
    uploaderName: 'David Alroy (Debate Instructor)',
    classId: 'Class-X',
    category: 'Academics',
    uploadDate: '2026-04-10'
  },
  {
    id: 'gal-p4',
    url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800&h=600',
    title: 'Watercolor Sketching Workshop',
    description: 'Vibrant sketches, landscapes, and custom design portraits made during the primary Division spring arts cluster.',
    uploaderName: 'Auxiliary Art Assistant',
    classId: 'Class-V',
    category: 'Art',
    uploadDate: '2026-06-11'
  },
  {
    id: 'gal-p5',
    url: recreationalTurfImg,
    title: 'Fresh Turf Play Hours',
    description: 'Energetic Class VIII students enjoying outdoor competitive running tasks and field sports routines.',
    uploaderName: 'CDPSJ Registrar Cell',
    classId: 'Class-VIII',
    category: 'Sports',
    uploadDate: '2026-06-12'
  }
];

const TEACHER_VACANCIES = [
  { id: 'vac-1', title: 'Secondary Computer Science Specialist (Class VI - X)', type: 'Full-time', salary: '$55,000 - $72,000 / Yr', description: 'Instruct structural programming logic, basic algorithms, TypeScript/Python logic, and guide high-school board examinations.', requirements: 'B.Ed, B.Tech/M.Tech in CS or related degree with 3+ years lecturing.' },
  { id: 'vac-2', title: 'Primary English Language Educator (Class I - V)', type: 'Full-time', salary: '$42,000 - $55,000 / Yr', description: 'Nurture phonics spelling tracing matrices, active reading comprehension programs, and children prose workshops.', requirements: 'B.Ed or BA in English Literature, 2+ years children mentoring.' },
  { id: 'vac-3', title: 'Resident Guidance Counselor', type: 'Part-time', salary: '$35 - $50 / Hr', description: 'Monitor children developmental parameters, academic mental health schedules, and administer guardian assistance programs.', requirements: 'Masters in Psychology or Counseling, licensed state certification, 3+ years in high school environments.' }
];

// Helper to return a timetable for a selected class (reads mock timetable or generates standard one for variety)
const getTimetableForClass = (classId: string) => {
  if (classId === 'Class-X') {
    return {
      classId: 'Class-X',
      schedule: [
        {
          day: 'Monday',
          periods: [
            { time: '08:30 AM - 09:15 AM', subject: 'Mathematics', teacherName: 'Sarah Jenkins' },
            { time: '09:15 AM - 10:00 AM', subject: 'Science', teacherName: 'Michael Chen' },
            { time: '10:15 AM - 11:00 AM', subject: 'English', teacherName: 'David Alroy' },
            { time: '11:00 AM - 11:45 AM', subject: 'Computer Studies', teacherName: 'Michael Chen' },
            { time: '12:30 PM - 01:15 PM', subject: 'Library Hour', teacherName: 'Interim Assistant' }
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
  }

  if (classId === 'LKG' || classId === 'UKG') {
    return {
      classId,
      schedule: [
        {
          day: 'Monday',
          periods: [
            { time: '08:30 AM - 09:15 AM', subject: 'Creative Tracing', teacherName: 'David Alroy' },
            { time: '09:15 AM - 10:00 AM', subject: 'Shapes Workshop', teacherName: 'David Alroy' },
            { time: '10:15 AM - 11:00 AM', subject: 'Phonics Rhymes', teacherName: 'David Alroy' },
            { time: '11:00 AM - 11:45 AM', subject: 'Sand play & blocks', teacherName: 'Assistant Nurse' }
          ]
        },
        {
          day: 'Tuesday',
          periods: [
            { time: '08:30 AM - 09:15 AM', subject: 'Phonics Sounds', teacherName: 'David Alroy' },
            { time: '09:15 AM - 10:00 AM', subject: 'Basic Counting', teacherName: 'David Alroy' },
            { time: '10:15 AM - 11:00 AM', subject: 'Color Association', teacherName: 'Helper' },
            { time: '11:00 AM - 11:45 AM', subject: 'Cooperative Storytime', teacherName: 'David Alroy' }
          ]
        },
        {
          day: 'Wednesday',
          periods: [
            { time: '08:30 AM - 09:15 AM', subject: 'English Alphabet Letter Tracing', teacherName: 'David Alroy' },
            { time: '09:15 AM - 10:00 AM', subject: 'Handcraft Painting', teacherName: 'Auxiliary Volunteer' },
            { time: '10:15 AM - 11:00 AM', subject: 'Basic Number Tracing', teacherName: 'David Alroy' },
            { time: '11:00 AM - 11:45 AM', subject: 'Musical Chairs', teacherName: 'Assistant Nurse' }
          ]
        },
        {
          day: 'Thursday',
          periods: [
            { time: '08:30 AM - 09:15 AM', subject: 'Oral Counting 1-20', teacherName: 'David Alroy' },
            { time: '09:15 AM - 10:00 AM', subject: 'Phonics Letter Play', teacherName: 'David Alroy' },
            { time: '10:15 AM - 11:00 AM', subject: 'Nature Garden Walk', teacherName: 'David Alroy' },
            { time: '11:00 AM - 11:45 AM', subject: 'Puppet Theater', teacherName: 'Volunteer parent' }
          ]
        },
        {
          day: 'Friday',
          periods: [
            { time: '08:30 AM - 09:15 AM', subject: 'Primary Drawing Activity', teacherName: 'David Alroy' },
            { time: '09:15 AM - 10:00 AM', subject: 'Phonics Sounds Review', teacherName: 'David Alroy' },
            { time: '10:15 AM - 11:00 AM', subject: 'Physical Action Songs', teacherName: 'David Alroy' },
            { time: '11:00 AM - 11:45 AM', subject: 'Weekly Fun Celebration', teacherName: 'All Coordinators' }
          ]
        }
      ]
    };
  }

  return {
    classId,
    schedule: [
      {
        day: 'Monday',
        periods: [
          { time: '08:30 AM - 09:15 AM', subject: 'English Grammar', teacherName: 'David Alroy' },
          { time: '09:15 AM - 10:00 AM', subject: 'Mathematics Basic', teacherName: 'Sarah Jenkins' },
          { time: '10:15 AM - 11:00 AM', subject: 'Environmental Studies', teacherName: 'Michael Chen' },
          { time: '11:00 AM - 11:45 AM', subject: 'Computers Basic', teacherName: 'Michael Chen' },
          { time: '12:30 PM - 01:15 PM', subject: 'Art & Crafting', teacherName: 'Art Scholar' }
        ]
      },
      {
        day: 'Tuesday',
        periods: [
          { time: '08:30 AM - 09:15 AM', subject: 'Environmental Studies', teacherName: 'Michael Chen' },
          { time: '09:15 AM - 10:00 AM', subject: 'Mathematics Basic', teacherName: 'Sarah Jenkins' },
          { time: '10:15 AM - 11:00 AM', subject: 'English Reading Comprehension', teacherName: 'David Alroy' },
          { time: '11:00 AM - 11:45 AM', subject: 'Physical Sports Play', teacherName: 'Athletic Guide' },
          { time: '12:30 PM - 01:15 PM', subject: 'Basic Geography', teacherName: 'David Alroy' }
        ]
      },
      {
        day: 'Wednesday',
        periods: [
          { time: '08:30 AM - 09:15 AM', subject: 'Mathematics Basic', teacherName: 'Sarah Jenkins' },
          { time: '09:15 AM - 10:00 AM', subject: 'English Grammar', teacherName: 'David Alroy' },
          { time: '10:15 AM - 11:00 AM', subject: 'Environmental Studies', teacherName: 'Michael Chen' },
          { time: '11:00 AM - 11:45 AM', subject: 'Computers Practice', teacherName: 'Michael Chen' },
          { time: '12:30 PM - 01:15 PM', subject: 'Creative Sandbox', teacherName: 'Assistant Guide' }
        ]
      },
      {
        day: 'Thursday',
        periods: [
          { time: '08:30 AM - 09:15 AM', subject: 'Environmental Studies', teacherName: 'Michael Chen' },
          { time: '09:15 AM - 10:00 AM', subject: 'Basic Science Lab', teacherName: 'Michael Chen' },
          { time: '10:15 AM - 11:00 AM', subject: 'Mathematics Basic', teacherName: 'Sarah Jenkins' },
          { time: '11:00 AM - 11:45 AM', subject: 'English Oral Phonics', teacherName: 'David Alroy' },
          { time: '12:30 PM - 01:15 PM', subject: 'Group Reading', teacherName: 'Class Instructor' }
        ]
      },
      {
        day: 'Friday',
        periods: [
          { time: '08:30 AM - 09:15 AM', subject: 'English Literature Story', teacherName: 'David Alroy' },
          { time: '09:15 AM - 10:00 AM', subject: 'Social Responsibility', teacherName: 'David Alroy' },
          { time: '10:15 AM - 11:00 AM', subject: 'Basic Botany Garden Class', teacherName: 'Michael Chen' },
          { time: '11:00 AM - 11:45 AM', subject: 'Mathematics Basic', teacherName: 'Sarah Jenkins' },
          { time: '12:30 PM - 01:15 PM', subject: 'Speech & Drama Guild', teacherName: 'Instructor' }
        ]
      }
    ]
  };
};

interface PublicWebsiteProps {
  onLoginClick: () => void;
}

export default function PublicWebsite({ onLoginClick }: PublicWebsiteProps) {
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'academics' | 'students' | 'teachers' | 'admissions' | 'contact' | 'gallery'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Student Hub state
  const [studentSubTab, setStudentSubTab] = useState<'timetable' | 'clubs' | 'announcements' | 'guidelines'>('timetable');
  const [selectedTimetableClass, setSelectedTimetableClass] = useState<string>('Class-X');
  const [clubRegistrations, setClubRegistrations] = useState<{ clubId: string; studentName: string; classId: string }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('zenith_club_registrations') || '[]');
    } catch {
      return [];
    }
  });
  const [selectedClubRegisterId, setSelectedClubRegisterId] = useState<string | null>(null);
  const [clubName, setClubName] = useState('');
  const [clubClass, setClubClass] = useState('Class-X');
  const [activeRegistrationName, setActiveRegistrationName] = useState('');

  // Teacher Hub state
  const [teacherSubTab, setTeacherSubTab] = useState<'directory' | 'careers' | 'announcements' | 'pedagogy'>('directory');
  const [teacherQuery, setTeacherQuery] = useState('');
  const [teacherApps, setTeacherApps] = useState<{ vacancyId: string; name: string; email: string; phone: string; experience: string; pitch: string }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('zenith_teacher_applications') || '[]');
    } catch {
      return [];
    }
  });
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null);
  const [careerName, setCareerName] = useState('');
  const [careerEmail, setCareerEmail] = useState('');
  const [careerPhone, setCareerPhone] = useState('');
  const [careerExperience, setCareerExperience] = useState('');
  const [careerPitch, setCareerPitch] = useState('');
  const [appEmailName, setAppEmailName] = useState('');

  // Admissions Form State
  const [studentName, setStudentName] = useState('');
  const [targetClass, setTargetClass] = useState('LKG');
  const [guardianName, setGuardianName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [admissionsSubmitted, setAdmissionsSubmitted] = useState(false);

  // === STUDENT GALLERY & PHOTO UPLOAD STATE ===
  const [userUploadedPhotos, setUserUploadedPhotos] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('zenith_student_gallery') || '[]');
    } catch {
      return [];
    }
  });
  const [gallerySearchQuery, setGallerySearchQuery] = useState('');
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('All');
  const [selectedGalleryClass, setSelectedGalleryClass] = useState<string>('All');
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState<any | null>(null);
  
  // Upload inputs
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStudentName, setUploadStudentName] = useState('');
  const [uploadPhotoTitle, setUploadPhotoTitle] = useState('');
  const [uploadPhotoDesc, setUploadPhotoDesc] = useState('');
  const [uploadPhotoClass, setUploadPhotoClass] = useState('Class-X');
  const [uploadPhotoCategory, setUploadPhotoCategory] = useState('Science');
  const [uploadPhotoFileBase64, setUploadPhotoFileBase64] = useState('');
  const [dragActiveGallery, setDragActiveGallery] = useState(false);
  const [galleryUploadSuccess, setGalleryUploadSuccess] = useState('');
  const [galleryUploadError, setGalleryUploadError] = useState('');

  // Handle Drag Events
  const handleDragGallery = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveGallery(true);
    } else if (e.type === "dragleave") {
      setDragActiveGallery(false);
    }
  };

  // Convert uploaded image to Base64
  const processImageFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) { // 2MB limit check
      setGalleryUploadError('Please select a photo smaller than 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadPhotoFileBase64(reader.result as string);
      setGalleryUploadError('');
    };
    reader.onerror = () => {
      setGalleryUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDropGallery = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveGallery(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handlePhotoUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGalleryUploadError('');
    setGalleryUploadSuccess('');

    if (!uploadStudentName.trim() || !uploadPhotoTitle.trim() || !uploadPhotoDesc.trim()) {
      setGalleryUploadError('Please populate all fields (Student Name, Title, and Description).');
      return;
    }

    if (!uploadPhotoFileBase64) {
      setGalleryUploadError('Please drag & drop or select a student photo to upload.');
      return;
    }

    try {
      const newPhotoObj = {
        id: `gal-user-${Date.now()}`,
        url: uploadPhotoFileBase64,
        title: uploadPhotoTitle.trim(),
        description: uploadPhotoDesc.trim(),
        uploaderName: uploadStudentName.trim(),
        classId: uploadPhotoClass,
        category: uploadPhotoCategory,
        uploadDate: new Date().toISOString().split('T')[0],
        isUserUploaded: true
      };

      const updated = [newPhotoObj, ...userUploadedPhotos];
      setUserUploadedPhotos(updated);
      localStorage.setItem('zenith_student_gallery', JSON.stringify(updated));

      setGalleryUploadSuccess('Success! Photo added to Student Gallery.');
      
      // Reset upload states after a brief success display delay
      setTimeout(() => {
        setUploadStudentName('');
        setUploadPhotoTitle('');
        setUploadPhotoDesc('');
        setUploadPhotoFileBase64('');
        setGalleryUploadSuccess('');
        setShowUploadModal(false);
      }, 1500);

    } catch (err) {
      setGalleryUploadError('Failed to save to local storage. Your image may be too large.');
    }
  };

  const handleDeleteUserPhoto = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering lightbox click
    if (window.confirm('Are you sure you want to delete this photo from the gallery?')) {
      const updated = userUploadedPhotos.filter(p => p.id !== photoId);
      setUserUploadedPhotos(updated);
      localStorage.setItem('zenith_student_gallery', JSON.stringify(updated));
    }
  };

  // Combine static presets with user uploaded photos
  const allGalleryPhotos = [...userUploadedPhotos, ...INITIAL_PRESET_GALLERY];

  // Apply filters
  const filteredGalleryPhotos = allGalleryPhotos.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(gallerySearchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(gallerySearchQuery.toLowerCase()) ||
      item.uploaderName.toLowerCase().includes(gallerySearchQuery.toLowerCase()) ||
      item.classId.toLowerCase().includes(gallerySearchQuery.toLowerCase());

    const matchesCategory = 
      selectedGalleryCategory === 'All' || 
      item.category.toLowerCase() === selectedGalleryCategory.toLowerCase();

    // Grouping classes for quick class filters
    let matchesClassGroup = true;
    if (selectedGalleryClass !== 'All') {
      if (selectedGalleryClass === 'KG') {
        matchesClassGroup = item.classId.includes('KG') || item.classId.includes('Kindergarten');
      } else if (selectedGalleryClass === 'Primary') {
        matchesClassGroup = item.classId.includes('Class-I') || item.classId.includes('Class-II') || item.classId.includes('Class-III') || item.classId.includes('Class-IV') || item.classId.includes('Class-V');
      } else if (selectedGalleryClass === 'Secondary') {
        matchesClassGroup = item.classId.includes('Class-VI') || item.classId.includes('Class-VII') || item.classId.includes('Class-VIII') || item.classId.includes('Class-IX') || item.classId.includes('Class-X');
      }
    }

    return matchesSearch && matchesCategory && matchesClassGroup;
  });

  const announcements = getAnnouncements().filter(a => a.target === 'all');
  const syllabi = getSyllabus();

  const handleClubRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName || !selectedClubRegisterId) return;

    const newRegistrations = [
      ...clubRegistrations,
      { clubId: selectedClubRegisterId, studentName: clubName, classId: clubClass }
    ];
    setClubRegistrations(newRegistrations);
    localStorage.setItem('zenith_club_registrations', JSON.stringify(newRegistrations));
    setActiveRegistrationName(clubName);
    
    // Clear registration popup
    setSelectedClubRegisterId(null);
    setClubName('');
  };

  const handleCancelClubRegistration = (clubId: string, studentName: string) => {
    const updated = clubRegistrations.filter(r => !(r.clubId === clubId && r.studentName.toLowerCase() === studentName.toLowerCase()));
    setClubRegistrations(updated);
    localStorage.setItem('zenith_club_registrations', JSON.stringify(updated));
  };

  const handleTeacherApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerName || !careerEmail || !selectedVacancyId) return;

    const newApps = [
      ...teacherApps,
      {
        vacancyId: selectedVacancyId,
        name: careerName,
        email: careerEmail,
        phone: careerPhone,
        experience: careerExperience,
        pitch: careerPitch
      }
    ];
    setTeacherApps(newApps);
    localStorage.setItem('zenith_teacher_applications', JSON.stringify(newApps));
    setAppEmailName(careerEmail);

    // Reset popup
    setSelectedVacancyId(null);
    setCareerName('');
    setCareerEmail('');
    setCareerPhone('');
    setCareerExperience('');
    setCareerPitch('');
  };

  const handleCancelVacancyApp = (vacancyId: string, email: string) => {
    const updated = teacherApps.filter(a => !(a.vacancyId === vacancyId && a.email.toLowerCase() === email.toLowerCase()));
    setTeacherApps(updated);
    localStorage.setItem('zenith_teacher_applications', JSON.stringify(updated));
  };

  const filteredTeachers = getTeachers().filter(t => 
    t.name.toLowerCase().includes(teacherQuery.toLowerCase()) || 
    t.subjects.some(s => s.toLowerCase().includes(teacherQuery.toLowerCase())) ||
    t.designation.toLowerCase().includes(teacherQuery.toLowerCase())
  );

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName && guardianName && parentEmail && parentPhone) {
      setAdmissionsSubmitted(true);
      // Reset after brief simulation delay
      setTimeout(() => {
        // Just keep the success state visible, reset form values
        setStudentName('');
        setGuardianName('');
        setParentEmail('');
        setParentPhone('');
      }, 4000);
    }
  };

  const downloadSyllabusPDF = (syllabus: SyllabusItem) => {
    // Generate a simple CSV/text data representation as a simulated PDF download
    const content = `CHAKRAPANI DAS PUBLIC SCHOOL JALAH - OFFICIAL SYLLABUS\nCLASS: ${syllabus.classId}\nSUBJECT: ${syllabus.subjectName}\n\n` + 
      syllabus.chapters.map((ch, i) => `Chapter ${i+1}: ${ch.title}\nDescription: ${ch.description}\nSuggested Timeline: ${ch.duration}`).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chakrapani_Das_Syllabus_${syllabus.classId}_${syllabus.subjectName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col" id="public-root">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm" id="public-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveSection('home')} id="nav-brand">
            <SchoolLogo className="w-12 h-12 shadow-sm drop-shadow-xs hover:scale-105 transition-transform" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight font-display">CHAKRAPANI DAS PUBLIC SCHOOL JALAH</h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Inspiring Excellence, Nurturing character</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" id="nav-desktop-links">
            {(['home', 'about', 'academics', 'students', 'teachers', 'admissions', 'gallery', 'contact'] as const).map((sec) => (
              <button
                key={sec}
                id={`btn-nav-${sec}`}
                onClick={() => setActiveSection(sec)}
                className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-colors ${
                  activeSection === sec 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:text-indigo-650 hover:bg-slate-50'
                }`}
              >
                {sectionLabels[sec]}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4" id="nav-desktop-actions">
            <button 
              onClick={onLoginClick}
              id="btn-portal-login"
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-red-200 transition-all flex items-center gap-2 hover:translate-y-[-1px]"
            >
              School Portal Login <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburguer */}
          <div className="md:hidden flex items-center" id="nav-mobile-hamburger">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Guest Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-100 bg-white overflow-hidden shadow-inner"
              id="mobile-navigation-drawer"
            >
              <div className="px-4 py-3 space-y-1">
                {(['home', 'about', 'academics', 'students', 'teachers', 'admissions', 'gallery', 'contact'] as const).map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setActiveSection(sec);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                      activeSection === sec 
                        ? 'bg-indigo-50 text-indigo-700 font-bold' 
                        : 'text-slate-600 hover:text-indigo-650 hover:bg-slate-50'
                    }`}
                  >
                    {sectionLabels[sec]}
                  </button>
                ))}
                <div className="pt-4 pb-2 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLoginClick();
                    }}
                    className="w-full text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    School Portal Login <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* PUBLIC WEBPAGE CONTENTS VIEWPORT */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* 1. HOME SECTION */}
          {activeSection === 'home' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-16 pb-16"
              key="view-home"
            >
              {/* Hero Banner Grid */}
              <section className="bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="hero-banner">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                  <div className="lg:col-span-7 space-y-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold tracking-widest uppercase font-mono">
                      <Award className="w-3.5 h-3.5" /> Chakrapani Das Academic Excellence
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-tight">
                      Shaping the Visionary leaders of <span className="text-indigo-400">Tomorrow</span>
                    </h2>
                    <p className="text-slate-300 text-lg max-w-xl">
                      A premier academic institution dedicated to cultivating creative minds, strong ethical principles, and sound intellectual grit from Kindergarten (LKG/UKG) through Class X.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <button 
                        onClick={() => setActiveSection('admissions')}
                        className="bg-indigo-500 hover:bg-indigo-600 font-bold px-6 py-3 rounded-xl shadow-lg transition-transform hover:translate-y-[-2px] flex items-center gap-2"
                      >
                        Enroll Online Now <ArrowRight className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setActiveSection('about')}
                        className="bg-white/10 hover:bg-white/15 border border-white/20 font-semibold px-6 py-3 rounded-xl transition-colors"
                      >
                        Explore Our Philosophy
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative w-full max-w-sm space-y-4">
                      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
                      <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-75"></div>
                      
                      {/* School Campus Photo Card */}
                      <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl group transition-all duration-300 hover:border-white/30" id="homepage-campus-photo-hero">
                        <img 
                          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800&h=500" 
                          alt="Chakrapani Das Public School Campus" 
                          referrerPolicy="no-referrer"
                          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-4">
                          <div>
                            <span className="px-2 py-0.5 rounded-md bg-indigo-550 text-[9px] font-bold text-white uppercase tracking-wider font-mono">
                              Principal Campus
                            </span>
                            <h4 className="font-extrabold text-white text-base font-display mt-1">Chakrapani Das Public School</h4>
                            <p className="text-[11px] text-slate-300 font-sans">956 Cyberdyne Way, Silicon Valley District</p>
                          </div>
                        </div>
                      </div>

                      {/* Premium Graphic representation of a classroom or child education */}
                      <div className="relative bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                          <div className="w-10 h-10 bg-indigo-550/80 rounded-xl flex items-center justify-center text-white shrink-0"><Award className="w-5 h-5" /></div>
                          <div>
                            <h4 className="font-bold text-sm">Top Educational Award</h4>
                            <p className="text-[11px] text-slate-400">Accredited Grade A+ State District Board</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] text-slate-300">
                            <span>University Admittance rate</span>
                            <span className="font-bold text-emerald-400">98.5%</span>
                          </div>
                          <div className="w-full bg-slate-750 rounded-full h-1.5">
                            <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center pt-2">
                          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <p className="text-xl font-bold text-yellow-400">22+</p>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest block mt-0.5">Years Legacy</span>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <p className="text-xl font-bold text-indigo-400">1:15</p>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest block mt-0.5">Ratio Staff</span>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <p className="text-xl font-bold text-emerald-400">100%</p>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest block mt-0.5">Modern Labs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Announcements Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="announcements">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Active Announcements</h3>
                    <p className="text-sm text-slate-500">Stay synchronized with school developments and examination alerts.</p>
                  </div>
                  <Calendar className="w-6 h-6 text-indigo-650" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {announcements.map((ann) => (
                    <div 
                      key={ann.id} 
                      className="bg-white rounded-xl border border-slate-150 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                      id={`announcement-card-${ann.id}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            ann.category === 'Exam' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                            ann.category === 'Academic' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                            ann.category === 'Event' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {ann.category}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{ann.date}</span>
                        </div>
                        <h4 className="font-bold text-lg text-slate-900">{ann.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{ann.content}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-400 font-medium">
                        <span>Audiences: {ann.target === 'all' ? 'Everyone' : 'Students & Staff'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Highlights Section */}
              <section className="bg-slate-100/70 border-y border-slate-200/50 py-16 px-4" id="highlights">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Outstanding Highlights</h3>
                    <p className="text-slate-600">Representing milestones in Olympiads, athletics, science expos, and regional ranking charts.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
                        <Award className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-lg text-slate-900">National Math Olympiad Champions</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Class X students secured 3 Gold awards in the National Mathematic Olympiad cluster finals, setting an academy record with a combined perfection ratio!
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                        <Activity className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-lg text-slate-900">State Physical Sports Trophy</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Our junior swimming team and intermediate football pro-team secured individual runner-up titles at the district academic-inter meets this trimester.
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-lg text-slate-900">100% Board Exam Success</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Continuing our legacy, the class of 2025 achieved consecutive 100% passing results, with over 74% achieving distinction honors.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Virtual Campus Gallery of School Facilities */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" id="campus-gallery">
                <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold tracking-wider uppercase font-mono border border-indigo-150">
                    SIGHTS & FACILITIES
                  </span>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight font-display">Campus Tour & Sights</h3>
                  <p className="text-sm text-slate-500">A glance at the modern academic infrastructure, high-fidelity labs, and interactive gardens where our students thrive.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      id: 'gallery-facility-1',
                      title: 'Smart Classrooms',
                      description: 'Equipped with digital screens, interactive whiteboards, ergonomic furniture, and high-speed collaborative study desks.',
                      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=600&h=450',
                      badge: 'Academic Wing'
                    },
                    {
                      id: 'gallery-facility-2',
                      title: 'Senior Science Laboratories',
                      description: 'Vibrant, safe chemistry and physics experimental stations where theories become active hands-on discoveries.',
                      image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=600&h=450',
                      badge: 'Laboratory'
                    },
                    {
                      id: 'gallery-facility-3',
                      title: 'Socrates Reading Commons',
                      description: 'Over 14,000 text directories, research workstations, children book vaults, and quiet advisory halls.',
                      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600&h=450',
                      badge: 'Study Library'
                    },
                    {
                      id: 'gallery-facility-4',
                      title: 'Recreational Turf & Courts',
                      description: 'Immersive green sports turf, competitive running tracks, outdoor play sectors, and basketball courts.',
                      image: recreationalTurfImg,
                      badge: 'Athletics & Play'
                    }
                  ].map((item) => (
                    <div 
                      key={item.id} 
                      className="group bg-white rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
                      id={item.id}
                    >
                      <div className="relative h-44 overflow-hidden shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-[9px] font-bold tracking-widest font-mono uppercase px-2 py-0.5 rounded-md">
                          {item.badge}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-1.5">
                        <h4 className="font-extrabold text-sm text-slate-900 font-display leading-tight">{item.title}</h4>
                        <p className="text-slate-500 text-[11px] leading-relaxed flex-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* 2. ABOUT US SECTION */}
          {activeSection === 'about' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto px-4 py-16 space-y-16"
              key="view-about"
            >
              {/* Cover Layout */}
              <div className="space-y-4 text-center">
                <span className="text-xs uppercase tracking-widest text-indigo-650 font-bold bg-indigo-50 px-3 py-1 rounded-full">About CDPSJ</span>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Our History, Vision & Values</h2>
                <div className="w-12 bg-indigo-650 h-1.5 mx-auto rounded"></div>
              </div>

              {/* History Block Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <History className="w-6 h-6 text-indigo-650" />
                    <h3 className="text-2xl font-bold text-slate-900">Our Rich History</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Founded in the year 2004, Chakrapani Das Public School Jalah began as a humble nursery campus under the core conviction that education should focus on conceptual understanding and logical thought rather than memory loading.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Over those subsequent two decades, the school expanded progressively, building standard computer laboratories, physics/chemistry testing zones, libraries, and establishing guidelines for systematic continuous assessment.
                  </p>
                </div>
                <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 font-mono text-xs block mb-2">FOUNDATION PRINCIPLE</span>
                  <blockquote className="text-slate-700 italic border-l-4 border-indigo-650 pl-4 py-1 text-lg font-medium">
                    "We do not teach for exam results alone; we design academic ecosystems to nurture critical questioning and strong moral structure that endures for a lifetime."
                  </blockquote>
                  <cite className="block text-right mt-4 text-sm font-semibold text-slate-800">— Dr. Arthur Mercer, Founder</cite>
                </div>
              </div>

              {/* Mission & Vision Bento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="bg-indigo-900 text-white p-8 rounded-2xl space-y-4 shadow-xl shadow-indigo-100">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-400/30 text-indigo-300">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold">Our Vision</h4>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    To be a leading educational beacon that shapes globally recognized, ethically strong citizen scholars. We visualize a community of learners who confidently confront challenges through research, logical clarity, and creative problem-solving techniques.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-4 shadow-sm">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100 text-emerald-600">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Our Mission</h4>
                  <ul className="text-slate-600 text-sm leading-relaxed space-y-2 list-disc pl-4">
                    <li>Provide student-centric environments integrating smart-assisted learning mechanisms.</li>
                    <li>Ensure optimal 15:1 classroom student-teacher quotients for highly personal mentorship.</li>
                    <li>Balance rigorous exam preparation (FA & SA series) with athletics, design crafts, computer studies, and debate forums.</li>
                  </ul>
                </div>
              </div>

              {/* Principal Message card */}
              <div className="bg-white border border-slate-150 p-8 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center" id="principal-message">
                <div className="md:col-span-3 text-center">
                  <div className="w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center">
                    <img 
                      src={principalAmarendraBoroImg} 
                      alt="AMARENDRA BORO" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-bold text-slate-900 block text-lg">AMARENDRA BORO</span>
                  <span className="text-xs text-indigo-650 font-semibold uppercase tracking-wider block">Principal Officer, CDPSJ</span>
                </div>
                <div className="md:col-span-9 space-y-4">
                  <h4 className="text-xl font-extrabold text-slate-900">Message from the Principal</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    "I am delighted to lead an exceptional community where teachers, administrative stakeholders, and proactive guardians build the foundation of our student’s academic careers. Each year brings new discoveries in mathematics, science projects, and physical development clusters. Our integrated portal ensures full transparency for parents, enabling real-time monitoring of attendance, formative worksheets, and complete fee trackers. We invite you to join us on this rewarding path of personal transformation."
                  </p>
                </div>
              </div>

            </motion.div>
          )}

          {/* 3. ACADEMICS SECTION */}
          {activeSection === 'academics' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto px-4 py-16 space-y-16"
              key="view-academics"
            >
              <div className="space-y-4 text-center">
                <span className="text-xs uppercase tracking-widest text-indigo-650 font-bold bg-indigo-50 px-3 py-1 rounded-full">Academic Catalogue</span>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Structured Classes & Subjects</h2>
                <div className="w-12 bg-indigo-650 h-1.5 mx-auto rounded"></div>
              </div>

              {/* Educational Phases Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Pre-Primary phase */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold">A</div>
                  <h3 className="font-extrabold text-lg text-slate-900">Pre-Primary (LKG & UKG)</h3>
                  <p className="text-xs text-slate-500">Ages: 3.5 to 5.5 Years</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Focuses on sensorimotor foundations, pre-phonics letters, primary arithmetic shapes, color relationships, and gross-motor group games.
                  </p>
                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-xs font-bold text-slate-700 block mb-1">Subjects Offered:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['English Tracing', 'Maths Counting', 'General Awareness', 'Phonics Workbooks'].map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary phase */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="bg-indigo-100 text-indigo-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold">B</div>
                  <h3 className="font-extrabold text-lg text-slate-900">Primary Division (Class I to V)</h3>
                  <p className="text-xs text-slate-500">Ages: 5.5 to 10.5 Years</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Introduces structural grammar, logical arithmetic fractions, general science investigations, early history models, and computer mouse/typing skills.
                  </p>
                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-xs font-bold text-slate-700 block mb-1">Subjects Offered:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['English Grammar', 'Mathematics Basic', 'Environmental Science', 'Art & Craft', 'Computers Basic'].map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Secondary phase */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="bg-emerald-100 text-emerald-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold">C</div>
                  <h3 className="font-extrabold text-lg text-slate-900">Secondary (Class VI to X)</h3>
                  <p className="text-xs text-slate-500">Ages: 10.5 to 15.5 Years</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Rigorous logic studies. Preparing for national grade certifications. Advanced quadratic fractions, geometry, physics, structural chemical logic, and computing languages.
                  </p>
                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-xs font-bold text-slate-700 block mb-1">Subjects Offered:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Algebra & geometry', 'Physics & Chemistry', 'Biology studies', 'English Literature', 'History & Civics', 'Computer Programming'].map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* 4. ADMISSIONS SECTION */}
          {activeSection === 'admissions' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto px-4 py-16 space-y-16"
              key="view-admissions"
            >
              <div className="space-y-4 text-center">
                <span className="text-xs uppercase tracking-widest text-indigo-650 font-bold bg-indigo-50 px-3 py-1 rounded-full">Admissions Portal</span>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admission Guidelines & Registration</h2>
                <div className="w-12 bg-indigo-650 h-1.5 mx-auto rounded"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="admissions-grid">
                
                {/* Guidelines Left */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">Simplifying the Enrollment Process</h3>
                    <p className="text-sm text-slate-650 leading-relaxed">
                      We accept applications for LKG, UKG and Class I-X student transfers based on availability indices and physical interview clearances.
                    </p>
                  </div>

                  {/* Steps sequence */}
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-650 text-white font-bold flex items-center justify-center shrink-0">1</div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-base">Online Registration</h4>
                        <p className="text-slate-500 text-xs">Fill out the parent details and student metrics using the adjacent secure registration form.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-650 text-white font-bold flex items-center justify-center shrink-0">2</div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-base">Interaction & Assessment Meeting</h4>
                        <p className="text-slate-500 text-xs">A meeting is coordinated at the school campus to map age-eligibility variables and logical interests.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-650 text-white font-bold flex items-center justify-center shrink-0">3</div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-base">Verification & Fee Settlement</h4>
                        <p className="text-slate-500 text-xs">Once selected, finalize document submittals (DOB verification, Transfer Certificate) and settle the term invoice.</p>
                      </div>
                    </div>
                  </div>

                  {/* Class Age Matrix */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">Age Eligibility Criteria Table</h4>
                    <div className="overflow-x-auto text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-150 text-slate-500">
                            <th className="p-2 py-3 font-semibold">Standard Class Target</th>
                            <th className="p-2 py-3 font-semibold">Minimum Age Requirement</th>
                            <th className="p-2 py-3 font-semibold">Required Verification docs</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-650">
                          <tr>
                            <td className="p-2 py-3 font-medium text-slate-900">LKG</td>
                            <td className="p-2 py-3">3 Years 6 Months (as of June 1)</td>
                            <td className="p-2 py-3">Official Birth Certificate Certificate</td>
                          </tr>
                          <tr>
                            <td className="p-2 py-3 font-medium text-slate-900">UKG</td>
                            <td className="p-2 py-3">4 Years 6 Months (as of June 1)</td>
                            <td className="p-2 py-3">Birth Certificate & Kindergarten TC</td>
                          </tr>
                          <tr>
                            <td className="p-2 py-3 font-medium text-slate-900">Class I to X</td>
                            <td className="p-2 py-3">5+ Years proportionally</td>
                            <td className="p-2 py-3">Birth Cert, Last Report Card, Transfer Certificate</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Class-wise Syllabus Section with Download Actions */}
                  <div className="space-y-4" id="class-wise-syllabus-downloader">
                    <h4 className="font-bold text-slate-900 text-base flex items-center gap-2"><FileCheck className="w-5 h-5 text-indigo-650" /> Download Class-wise Syllabus</h4>
                    <p className="text-xs text-slate-500">You can download our syllabus blueprints in text file format to analyze target chapters.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {syllabi.map((syllabus) => (
                        <div key={syllabus.id} className="bg-slate-50 rounded-lg p-4 border border-slate-150 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 block text-sm">{syllabus.classId}</span>
                            <span className="text-[11px] text-indigo-650 font-medium">{syllabus.subjectName} Syllabus</span>
                          </div>
                          <button 
                            onClick={() => downloadSyllabusPDF(syllabus)}
                            className="bg-white hover:bg-slate-100 p-2 rounded-lg border border-slate-200 text-slate-600 flex items-center gap-1 text-xs font-semibold shadow-sm transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> TXT
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Admission Form Right */}
                <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm h-fit">
                  <h3 className="font-extrabold text-slate-900 text-lg mb-4">Online Application Form</h3>
                  
                  {admissionsSubmitted ? (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-150 p-6 text-center space-y-4">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-750 rounded-full mx-auto flex items-center justify-center">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-emerald-850">Application Shared!</h4>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                          Your preliminary request package is registered. The CDPSJ Registrar department will contact you within 48 academic hours on details for your verification meeting.
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded text-left border border-emerald-100 space-y-1 text-xs text-slate-600 text-mono">
                        <p><strong>Receipt:</strong> APP-{Math.floor(1000 + Math.random() * 9000)}</p>
                        <p><strong>Submission:</strong> Verified Pending Status</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleAdmissionSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Student Full Name</label>
                        <input 
                          type="text" 
                          required 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="e.g. Liam Mercer" 
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-650 bg-slate-50/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target Standard Class</label>
                          <select 
                            value={targetClass}
                            onChange={(e) => setTargetClass(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                          >
                            {['LKG', 'UKG', 'Class-I', 'Class-V', 'Class-VIII', 'Class-X'].map(cls => (
                              <option key={cls} value={cls}>{cls}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Guardian Name</label>
                          <input 
                            type="text" 
                            required 
                            value={guardianName}
                            onChange={(e) => setGuardianName(e.target.value)}
                            placeholder="e.g. Thomas Mercer" 
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-650 bg-slate-50/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Parent Email Address</label>
                        <input 
                          type="email" 
                          required 
                          value={parentEmail}
                          onChange={(e) => setParentEmail(e.target.value)}
                          placeholder="your.name@example.com" 
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-650 bg-slate-50/50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Parent Mobile Phone</label>
                        <input 
                          type="tel" 
                          required 
                          value={parentPhone}
                          onChange={(e) => setParentPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000" 
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-650 bg-slate-50/50"
                        />
                      </div>

                      <div className="flex items-start gap-2 pt-2">
                        <input type="checkbox" required id="agree-terms" className="mt-0.5" />
                        <label htmlFor="agree-terms" className="text-[11px] text-slate-500 leading-tight select-none">
                          I hereby declare that the prefilled variables match birth certificates and agree to attend the in-person assessment schedules.
                        </label>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                      >
                        Submit Admission Form <FileCheck className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* STUDENTS HUB SECTION */}
          {activeSection === 'students' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto px-4 py-16 space-y-16"
              key="view-students"
            >
              {/* Cover Layout */}
              <div className="space-y-4 text-center">
                <span className="text-xs uppercase tracking-widest text-indigo-650 font-bold bg-indigo-50 px-3 py-1 rounded-full">Student Section</span>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight font-display">Student Life, Resources & Timetables</h2>
                <p className="max-w-2xl mx-auto text-slate-500 text-sm">
                  Explore interactive weekly schedules, register for student clubs, read class codes of conduct, and monitor dynamic calendar events.
                </p>
                <div className="w-12 bg-indigo-650 h-1.5 mx-auto rounded"></div>
              </div>

              {/* Sub navbar controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Sidebar Controls */}
                <div className="md:col-span-3 space-y-2">
                  <button
                    onClick={() => setStudentSubTab('timetable')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                      studentSubTab === 'timetable'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Weekly Timetable
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  <button
                    onClick={() => setStudentSubTab('clubs')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                      studentSubTab === 'clubs'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Clubs & Registrations
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  <button
                    onClick={() => setStudentSubTab('announcements')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                      studentSubTab === 'announcements'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Student Circulars
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  <button
                    onClick={() => setStudentSubTab('guidelines')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                      studentSubTab === 'guidelines'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4" /> Code of Conduct
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </div>

                {/* Main Content Pane */}
                <div className="md:col-span-9 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm min-h-[420px]">
                  
                  {/* Timetable Sub-tab */}
                  {studentSubTab === 'timetable' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 font-display">Academic Timetable Viewer</h3>
                          <p className="text-xs text-slate-500">Select any standard level to query the updated, official weekly schedule.</p>
                        </div>
                        <select
                          value={selectedTimetableClass}
                          onChange={(e) => setSelectedTimetableClass(e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-650"
                        >
                          {['LKG', 'UKG', 'Class-I', 'Class-V', 'Class-VIII', 'Class-X'].map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-4">
                        {getTimetableForClass(selectedTimetableClass).schedule.map((daySchedule) => (
                          <div key={daySchedule.day} className="border border-slate-150 rounded-xl overflow-hidden bg-white">
                            <div className="bg-slate-50 px-4 py-2 border-b border-slate-150 flex justify-between items-center">
                              <span className="font-bold text-slate-800 text-xs font-mono uppercase tracking-wider">{daySchedule.day} Lectures</span>
                              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded font-mono">CDPSJ Std</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                              {daySchedule.periods.map((period, pIdx) => (
                                <div key={pIdx} className="p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                  <div className="flex items-center gap-3">
                                    <span className="font-mono text-indigo-600 bg-indigo-50/60 px-2 py-1 rounded font-bold whitespace-nowrap">
                                      {period.time}
                                    </span>
                                    <span className="font-bold text-slate-900 text-sm sm:text-xs">
                                      {period.subject}
                                    </span>
                                  </div>
                                  <div className="text-slate-500 font-medium sm:text-right">
                                    Educator: <span className="text-slate-700 font-semibold">{period.teacherName}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clubs Sub-tab */}
                  {studentSubTab === 'clubs' && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <h3 className="text-xl font-bold text-slate-900 font-display">Chakrapani Das Extra-Curricular Clubs</h3>
                        <p className="text-xs text-slate-500">Register with your name and class level to join interactive student activities boards.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {STUDENT_CLUBS.map(club => {
                          const isRegistered = clubRegistrations.some(r => r.clubId === club.id && r.studentName.toLowerCase() === activeRegistrationName.toLowerCase());
                          return (
                            <div key={club.id} className="border border-slate-155 rounded-xl p-5 hover:border-indigo-300 transition-colors bg-slate-50/30 flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black text-xs font-mono">
                                    {club.prefix}
                                  </span>
                                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                                    Co-Curricular
                                  </span>
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm">{club.name}</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{club.description}</p>
                                <p className="text-[10px] text-slate-400 font-semibold font-mono">Weekly Slot: {club.timings}</p>
                              </div>
                              
                              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                {isRegistered ? (
                                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-150 font-bold block w-full text-center">
                                    ✓ Active Register Status
                                  </span>
                                ) : (
                                  <button 
                                    onClick={() => {
                                      setSelectedClubRegisterId(club.id);
                                    }}
                                    className="bg-slate-905 hover:bg-indigo-650 bg-slate-100 hover:text-white text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors w-full text-center"
                                  >
                                    Apply for Enrollment
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Popup registration block */}
                      {selectedClubRegisterId && (
                        <form onSubmit={handleClubRegisterSubmit} className="bg-gradient-to-r from-indigo-50 to-slate-50/50 border border-indigo-150 p-5 rounded-2xl space-y-4 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-indigo-950 text-sm">
                              Enroll in: <span className="text-indigo-650">{STUDENT_CLUBS.find(c => c.id === selectedClubRegisterId)?.name}</span>
                            </h4>
                            <button 
                              type="button"
                              onClick={() => setSelectedClubRegisterId(null)}
                              className="text-slate-400 hover:text-slate-650 text-xs font-mono"
                            >
                              [X] Close
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Student Full Name</label>
                              <input 
                                type="text"
                                required
                                placeholder="e.g. Liam Mercer" 
                                value={clubName}
                                onChange={(e) => setClubName(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Class Standard Level</label>
                              <select
                                value={clubClass}
                                onChange={(e) => setClubClass(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                              >
                                {['Class-I', 'Class-V', 'Class-VIII', 'Class-X'].map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          <button 
                            type="submit"
                            className="bg-indigo-650 hover:bg-slate-900 border border-indigo-700 text-white font-bold w-full py-2 rounded-xl text-xs transition-colors shadow-sm"
                          >
                            Submit Club Registration Request
                          </button>
                        </form>
                      )}

                      {/* Roster database print */}
                      {clubRegistrations.length > 0 && (
                        <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-widest font-mono">Your Registered Club Memberships</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {clubRegistrations.map((reg, idx) => {
                              const info = STUDENT_CLUBS.find(cl => cl.id === reg.clubId);
                              return (
                                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-150 flex items-center justify-between text-xs">
                                  <div>
                                    <p className="font-bold text-slate-900">{info?.name}</p>
                                    <p className="text-slate-400 text-[10px]">Student: <span className="text-slate-600 font-semibold">{reg.studentName}</span> ({reg.classId})</p>
                                  </div>
                                  <button
                                    onClick={() => handleCancelClubRegistration(reg.clubId, reg.studentName)}
                                    className="text-slate-450 hover:text-red-700 font-bold font-mono text-[10px]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Announcements Sub-tab */}
                  {studentSubTab === 'announcements' && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <h3 className="text-xl font-bold text-slate-900 font-display">Student Circulars & Examination Alerts</h3>
                        <p className="text-xs text-slate-500">Official academic mandates, class transfers, and holiday notices targeting scholars.</p>
                      </div>

                      <div className="space-y-4">
                        {getAnnouncements()
                          .filter(a => a.target === 'students' || a.target === 'all')
                          .map(ann => (
                            <div key={ann.id} className="border border-slate-200/85 p-5 rounded-xl hover:shadow-sm transition-all bg-white relative">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono ${
                                  ann.category === 'Exam' ? 'bg-red-50 text-red-700 border border-red-100' :
                                  ann.category === 'Academic' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                  ann.category === 'Holiday' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {ann.category}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono font-semibold">{ann.date}</span>
                              </div>
                              <h4 className="font-bold text-slate-900 text-sm leading-tight font-display">{ann.title}</h4>
                              <p className="text-xs text-slate-600 leading-relaxed mt-2">{ann.content}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Ethics Guidelines */}
                  {studentSubTab === 'guidelines' && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <h3 className="text-xl font-bold text-slate-900 font-display">Academic Code & Scholar Guidelines</h3>
                        <p className="text-xs text-slate-500">Chakrapani Das Public School Jalah establishes the following foundational responsibilities for all students.</p>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            title: '1. Academic Sincerity & Diligence',
                            desc: 'Scholars are anticipated to submit formative worksheets (FA) and school assessment schedules on time. Plagiarism of notes or digital modules will trigger automatic evaluation resets.'
                          },
                          {
                            title: '2. Attendance & Portal Checkins',
                            desc: 'All students must maintain consistent academic presence. The state standard requirement mandates a minimum of 80% attendance compliance to secure examination clearances.'
                          },
                          {
                            title: '3. Campus Dress Protocol',
                            desc: 'The official charcoal gray and navy blue Academy uniforms must be maintained cleanly on all lecture weekdays. Professional PE physical attire is used on practical training periods.'
                          },
                          {
                            title: '4. Digital Device Safety guidelines',
                            desc: 'Personal digital equipment or cellphones are strictly stored in standard lockers during study hours, unless expressly authorized for coding labs or smart classes.'
                          }
                        ].map((rule, idx) => (
                          <div key={idx} className="border border-slate-150 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                            <h4 className="font-bold text-slate-900 text-xs font-mono uppercase tracking-wide text-indigo-950">{rule.title}</h4>
                            <p className="text-xs text-slate-600 leading-relaxed mt-1">{rule.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          )}

          {/* TEACHERS HUB SECTION */}
          {activeSection === 'teachers' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto px-4 py-16 space-y-16"
              key="view-teachers"
            >
              {/* Cover Layout */}
              <div className="space-y-4 text-center">
                <span className="text-xs uppercase tracking-widest text-indigo-650 font-bold bg-indigo-50 px-3 py-1 rounded-full">Teachers Section</span>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight font-display">Faculty Directory, Standards & Careers</h2>
                <p className="max-w-2xl mx-auto text-slate-500 text-sm">
                  Explore active educator profiles, apply online for professional openings, review instructional standards, and access teacher notices.
                </p>
                <div className="w-12 bg-indigo-650 h-1.5 mx-auto rounded"></div>
              </div>

              {/* Sub navbar controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Sidebar Controls */}
                <div className="md:col-span-3 space-y-2">
                  <button
                    onClick={() => setTeacherSubTab('directory')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                      teacherSubTab === 'directory'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4" /> Faculty Directory
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  <button
                    onClick={() => setTeacherSubTab('careers')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                      teacherSubTab === 'careers'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" /> Careers & Vacancies
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  <button
                    onClick={() => setTeacherSubTab('announcements')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                      teacherSubTab === 'announcements'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Staff Circulars
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  <button
                    onClick={() => setTeacherSubTab('pedagogy')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                      teacherSubTab === 'pedagogy'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4" /> Academic Pedagogy
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </div>

                {/* Main Content Pane */}
                <div className="md:col-span-9 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm min-h-[420px]">
                  
                  {/* Directory tab */}
                  {teacherSubTab === 'directory' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 font-display">Faculty Directory Search</h3>
                          <p className="text-xs text-slate-500">Query active teachers, designations, and academic clusters.</p>
                        </div>
                        <input
                          type="text"
                          value={teacherQuery}
                          onChange={(e) => setTeacherQuery(e.target.value)}
                          placeholder="Search by name, subject..."
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-650 max-w-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredTeachers.map((teacher) => (
                          <div key={teacher.id} className="border border-slate-150 p-4 rounded-xl bg-slate-50/40 relative flex gap-4" id={`public-teacher-card-${teacher.id}`}>
                            {teacher.photoUrl ? (
                              <img 
                                src={teacher.photoUrl} 
                                alt={teacher.name} 
                                referrerPolicy="no-referrer" 
                                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0 self-start"
                                id={`public-teacher-photo-${teacher.id}`}
                              />
                            ) : (
                              <span className="w-16 h-16 rounded-xl bg-indigo-50 border border-indigo-150 text-indigo-650 font-sans font-bold flex items-center justify-center text-sm shrink-0 self-start shadow-xs">
                                {teacher.name.charAt(0)}
                              </span>
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="absolute top-4 right-4 text-[9px] font-mono uppercase bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                                {teacher.empNo}
                              </span>
                              <p className="font-extrabold text-slate-900 text-sm font-display truncate pr-14">{teacher.name}</p>
                              <p className="text-[10px] text-indigo-650 font-semibold uppercase tracking-wider font-mono truncate">{teacher.designation}</p>
                              
                              <div className="space-y-1.5 mt-3 border-t border-slate-100 pt-2.5 text-xs text-slate-600">
                                <p className="truncate">📧 <span className="hover:underline font-mono text-[11px] font-semibold">{teacher.email}</span></p>
                                <p>📞 <span className="font-mono text-[10.5px]">{teacher.phone}</span></p>
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {teacher.subjects.map(s => (
                                    <span key={s} className="px-2 py-0.5 bg-white border border-slate-150 rounded text-[9px] font-bold text-slate-500 uppercase tracking-wide font-mono">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {filteredTeachers.length === 0 && (
                          <p className="text-xs text-slate-400 italic text-center col-span-2 py-8 font-mono">No educators matched your query criteria.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Careers sub-tab */}
                  {teacherSubTab === 'careers' && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <h3 className="text-xl font-bold text-slate-900 font-display">Educator Career Vacancies</h3>
                        <p className="text-xs text-slate-500">Become a visionary guide of tomorrow. Apply online to join our professional structure.</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {TEACHER_VACANCIES.map((vac) => {
                          const isApplied = teacherApps.some(a => a.vacancyId === vac.id && a.email.toLowerCase() === appEmailName.toLowerCase());
                          return (
                            <div key={vac.id} className="border border-slate-150 rounded-xl p-5 bg-slate-50/20 hover:border-indigo-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1.5 max-w-xl">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-750 rounded font-mono uppercase tracking-wider">
                                    {vac.type}
                                  </span>
                                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded font-bold font-mono tracking-wide">{vac.salary}</span>
                                </div>
                                <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{vac.title}</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">{vac.description}</p>
                                <p className="text-[10.5px] text-slate-450 font-medium">Requirements: {vac.requirements}</p>
                              </div>
                              {isApplied ? (
                                <div className="bg-emerald-50 text-emerald-800 border border-emerald-150 font-bold px-4 py-2 rounded-xl text-center text-xs whitespace-nowrap">
                                  ✓ Resume Submitted
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setSelectedVacancyId(vac.id)}
                                  className="bg-slate-900 hover:bg-indigo-650 text-white font-bold px-4 py-2 rounded-xl text-[11px] transition-colors whitespace-nowrap self-start sm:self-center"
                                >
                                  Submit Resume
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Resume submit form */}
                      {selectedVacancyId && (
                        <form onSubmit={handleTeacherApplicationSubmit} className="bg-gradient-to-r from-indigo-50 to-slate-50/50 border border-indigo-150 p-5 rounded-2xl space-y-4 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-indigo-950 text-sm">
                              Job Application: <span className="text-indigo-650">{TEACHER_VACANCIES.find(v => v.id === selectedVacancyId)?.title}</span>
                            </h4>
                            <button 
                              type="button"
                              onClick={() => setSelectedVacancyId(null)}
                              className="text-slate-400 hover:text-slate-650 text-xs font-mono"
                            >
                              [X] Close
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Applicant Name</label>
                              <input 
                                type="text" 
                                required
                                placeholder="e.g. Dr. Jane Doe" 
                                value={careerName}
                                onChange={(e) => setCareerName(e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Contact Email</label>
                              <input 
                                type="email" 
                                required
                                placeholder="Jane.doe@example.com" 
                                value={careerEmail}
                                onChange={(e) => setCareerEmail(e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Mobile Phone</label>
                              <input 
                                type="tel" 
                                required
                                placeholder="+1 (555) 000-0000" 
                                value={careerPhone}
                                onChange={(e) => setCareerPhone(e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Teaching Experience (Years)</label>
                              <input 
                                type="number" 
                                required
                                placeholder="e.g. 5" 
                                value={careerExperience}
                                onChange={(e) => setCareerExperience(e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Brief Proposal & Resume Pitch</label>
                            <textarea 
                              rows={3} 
                              required
                              placeholder="Describe your learning methodology and primary credentials..." 
                              value={careerPitch}
                              onChange={(e) => setCareerPitch(e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <button 
                            type="submit"
                            className="bg-indigo-650 hover:bg-slate-900 border border-indigo-750 text-white font-bold w-full py-2.5 rounded-xl text-xs transition-colors"
                          >
                            Submit Professional Candidate Package
                          </button>
                        </form>
                      )}

                      {/* Displaying my applications */}
                      {teacherApps.length > 0 && (
                        <div className="border border-slate-205 rounded-xl p-4 bg-white space-y-3">
                          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-widest font-mono">Your Active Candidate Submissions</h4>
                          <div className="space-y-2">
                            {teacherApps.map((app, idx) => {
                              const vInfo = TEACHER_VACANCIES.find(v => v.id === app.vacancyId);
                              return (
                                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-150 flex items-center justify-between text-xs">
                                  <div>
                                    <p className="font-bold text-slate-900">{vInfo?.title}</p>
                                    <p className="text-slate-400 text-[10px]">Applicant: <span className="text-slate-605 font-semibold">{app.name}</span> ({app.email}) — Exp: {app.experience} Yrs</p>
                                  </div>
                                  <button
                                    onClick={() => handleCancelVacancyApp(app.vacancyId, app.email)}
                                    className="text-red-650 hover:text-red-800 font-bold font-mono text-[10px]"
                                  >
                                    Withdraw
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Staff circulars sub-tab */}
                  {teacherSubTab === 'announcements' && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <h3 className="text-xl font-bold text-slate-900 font-display">Staff & Faculty Communications</h3>
                        <p className="text-xs text-slate-500">Official directives, co-curricular coordination timelines, and professional notices.</p>
                      </div>

                      <div className="space-y-4">
                        {getAnnouncements()
                          .filter(a => a.target === 'teachers' || a.target === 'all')
                          .map(ann => (
                            <div key={ann.id} className="border border-slate-200 p-5 rounded-xl bg-white relative">
                              <div className="flex items-center justify-between mb-2">
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wide">
                                  {ann.category}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono font-semibold">{ann.date}</span>
                              </div>
                              <h4 className="font-bold text-slate-900 text-xs leading-tight font-display">{ann.title}</h4>
                              <p className="text-xs text-slate-600 leading-relaxed mt-1.5">{ann.content}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Pedagogical frameworks */}
                  {teacherSubTab === 'pedagogy' && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <h3 className="text-xl font-bold text-slate-900 font-display">Instructional Guidelines & Pedagogy</h3>
                        <p className="text-xs text-slate-500">Chakrapani Das Public School Jalah enforces a modern, child-centric, continuous-improvement teaching structure.</p>
                      </div>

                      <div className="space-y-4">
                        {[
                          {
                            title: 'A. Flipped Classroom Paradigm',
                            text: 'Instructors must divide subjects into visual prep work (read at home) and intensive logic modeling/collaboration (practiced in classroom periods).'
                          },
                          {
                            title: 'B. Regular Formative Marksheets (FA Series)',
                            text: 'Formative Assessment is carried weekly using interactive custom quizzes, research summaries, and oral presentations. Grades are updated onto student logs instantly.'
                          },
                          {
                            title: 'C. Personal Mentorship & Co-Curricular Tracking',
                            text: 'Keep a healthy 15:1 learner-educator ratio active in classrooms. Map other sports achievements, character developments, and club parameters alongside grades.'
                          }
                        ].map((scheme, sIdx) => (
                          <div key={sIdx} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-150 p-4 rounded-xl transition-all">
                            <h4 className="font-bold text-xs font-mono uppercase tracking-wide text-indigo-950">{scheme.title}</h4>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{scheme.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          )}

          {/* 5. CONTACT SECTION */}
          {activeSection === 'contact' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto px-4 py-16 space-y-16"
              key="view-contact"
            >
              <div className="space-y-4 text-center">
                <span className="text-xs uppercase tracking-widest text-indigo-650 font-bold bg-indigo-50 px-3 py-1 rounded-full">Contact Details</span>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Reach Out to our Officers</h2>
                <div className="w-12 bg-indigo-650 h-1.5 mx-auto rounded"></div>
              </div>

              {/* Grid 2 Column */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                
                {/* Contact Information Cards */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-900">Direct Inquiries</h3>
                    <p className="text-slate-650 text-sm leading-relaxed">
                      For admission transfers, document validation, transcript generation, or immediate fee issues, feel free to contact individual departments.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-white border border-slate-150 rounded-xl shadow-sm">
                      <div className="p-2.5 bg-indigo-50 text-indigo-650 rounded-lg h-fit border border-indigo-100"><MapPin className="w-5 h-5" /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Main Campus Address</h4>
                        <p className="text-slate-600 text-xs mt-0.5">750 Scholastic Boulevard, Academic Valley, CA 94016</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-white border border-slate-150 rounded-xl shadow-sm">
                      <div className="p-2.5 bg-emerald-50 text-emerald-650 rounded-lg h-fit border border-emerald-100"><Phone className="w-5 h-5" /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm font-sans">Administrative Hotlines</h4>
                        <p className="text-slate-600 text-xs mt-0.5">Primary Desk: +1 (555) 123-2004</p>
                        <p className="text-slate-600 text-xs">Admissions Desk: +1 (555) 123-2006</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-white border border-slate-150 rounded-xl shadow-sm">
                      <div className="p-2.5 bg-amber-50 text-amber-650 rounded-lg h-fit border border-amber-100"><Mail className="w-5 h-5" /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Electronic Correspondence</h4>
                        <p className="text-slate-600 text-xs mt-0.5">General Office: info@cdpsj.edu</p>
                        <p className="text-slate-600 text-xs">Admissions cell: enroll@cdpsj.edu</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Beautiful Mock Google Map SVG Container */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">CDPSJ Campus Geo-Location</h4>
                    <span className="text-[10px] uppercase font-bold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded">GPS Track Active</span>
                  </div>
                  
                  {/* Styled SVG Map representing California school zone */}
                  <div className="relative w-full aspect-video bg-indigo-50 border border-indigo-150 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full text-indigo-100/30" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Streets Representation */}
                      <path d="M 0 40 L 400 40" stroke="#FFFFFF" strokeWidth="6" />
                      <path d="M 0 140 L 400 140" stroke="#FFFFFF" strokeWidth="8" />
                      <path d="M 100 0 L 100 200" stroke="#FFFFFF" strokeWidth="10" />
                      <path d="M 280 0 L 280 200" stroke="#FFFFFF" strokeWidth="6" />
                      {/* Grid Accents */}
                      <rect x="20" y="60" width="60" height="60" rx="3" fill="#DCE2F9" />
                      <rect x="120" y="10" width="140" height="40" rx="5" fill="#C7D2FE" />
                      <rect x="120" y="60" width="140" height="70" rx="8" fill="#A5B4FC" />
                      <rect x="120" y="150" width="140" height="40" rx="4" fill="#DCE2F9" />
                      <rect x="300" y="65" width="80" height="60" rx="3" fill="#C7D2FE" />
                    </svg>

                    {/* Campus Pin mark */}
                    <div className="absolute left-[240px] top-[95px] flex flex-col items-center">
                      <div className="w-5 h-5 bg-indigo-650 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold animate-bounce shadow-md">
                        C
                      </div>
                      <div className="bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow mt-1">
                        Main Campus Jalah
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    * Interactive navigation coordinates are embedded. Bus Route 42 and Metro West stop directly beside our East Entry Gates.
                  </p>
                </div>

              </div>
            </motion.div>
          )}

          {/* 6. STUDENT MEMORIES GALLERY SECTION */}
          {activeSection === 'gallery' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 py-16 space-y-12"
              key="view-gallery"
            >
              {/* Gallery Header */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                  <Camera className="w-4 h-4 text-indigo-600 animate-pulse" />
                  CDPSJ Student Life Gallery
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight font-display">
                  Capturing Moments, Nurturing Memories
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-sm leading-relaxed">
                  Celebrate our active classroom workshops, robotic exhibitions, cultural events, and competitive athletic qualifiers. Students, guardians, and teachers are welcome to capture and share active student memories on our digital board.
                </p>
                <div className="w-16 h-1.5 bg-red-650 mx-auto rounded-full"></div>
              </div>

              {/* Toolbar: Search, Filters, and Upload Trigger */}
              <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  {/* Search bar */}
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                      placeholder="Search by title, student name, class..."
                      value={gallerySearchQuery}
                      onChange={(e) => setGallerySearchQuery(e.target.value)}
                    />
                    {gallerySearchQuery && (
                      <button
                        onClick={() => setGallerySearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Upload Action Button */}
                  <button
                    onClick={() => {
                      setGalleryUploadError('');
                      setGalleryUploadSuccess('');
                      setShowUploadModal(true);
                    }}
                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:translate-y-[-1px] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Upload Student Photo
                  </button>
                </div>

                {/* Tag & Filters Cluster */}
                <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
                    <span className="text-xs text-slate-500 font-semibold mr-1">Activity Category:</span>
                    {['All', 'Sports', 'Academics', 'Art', 'Science'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedGalleryCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedGalleryCategory === cat
                            ? 'bg-indigo-650 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'All' ? 'All Activities' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Grade/Class Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-semibold">Grade Scope:</span>
                    <select
                      className="border border-slate-200 bg-slate-50/50 text-xs font-semibold rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                      value={selectedGalleryClass}
                      onChange={(e) => setSelectedGalleryClass(e.target.value)}
                    >
                      <option value="All">All Divisions</option>
                      <option value="KG">Kindergarten</option>
                      <option value="Primary">Primary (Classes I - V)</option>
                      <option value="Secondary">Secondary (Classes VI - X)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGalleryPhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    layoutId={`gallery-item-${photo.id}`}
                    onClick={() => setSelectedLightboxPhoto(photo)}
                    className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group cursor-pointer relative"
                  >
                    {/* Category Label Overlay */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                        {photo.category}
                      </span>
                      {photo.isUserUploaded && (
                        <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm animate-pulse">
                          Student Upload
                        </span>
                      )}
                    </div>

                    {/* Manage uploaded photo trigger */}
                    {photo.isUserUploaded && (
                      <button
                        onClick={(e) => handleDeleteUserPhoto(photo.id, e)}
                        className="absolute top-4 right-4 z-20 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg hover:text-red-700 hover:scale-105 transition-all shadow-md cursor-pointer"
                        title="Remove student photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Image Area */}
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Meta section */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-indigo-650 bg-indigo-50 font-bold px-2.5 py-0.5 rounded-lg">
                          {photo.classId}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium font-mono">
                          {photo.uploadDate}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 leading-snug group-hover:text-indigo-650 transition-colors">
                        {photo.title}
                      </h3>

                      <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                        {photo.description}
                      </p>

                      <div className="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Submitted by:</span>
                        <span className="font-bold text-slate-700 truncate max-w-[150px]">
                          {photo.uploaderName}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* No items matched state */}
              {filteredGalleryPhotos.length === 0 && (
                <div className="text-center py-16 bg-white border border-slate-150 rounded-2xl gap-2 flex flex-col items-center max-w-xl mx-auto shadow-sm">
                  <ImageIcon className="w-12 h-12 text-slate-300" />
                  <h3 className="text-lg font-bold text-slate-800 font-display">No gallery moments match</h3>
                  <p className="text-slate-500 text-xs px-8 leading-relaxed">
                    We could not find student photos matching "{gallerySearchQuery}" or chosen activity categories/grades. Share the first high-school memory now!
                  </p>
                  <button
                    onClick={() => {
                      setGallerySearchQuery('');
                      setSelectedGalleryCategory('All');
                      setSelectedGalleryClass('All');
                    }}
                    className="mt-4 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset Filter Parameters
                  </button>
                </div>
              )}

              {/* UPLOAD student photo pops modal */}
              <AnimatePresence>
                {showUploadModal && (
                  <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100"
                    >
                      <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold font-display">Share a School Moment</h3>
                          <p className="text-slate-450 text-xs mt-0.5">Upload verified student sports milestones, lab tests, or craft work</p>
                        </div>
                        <button
                          onClick={() => setShowUploadModal(false)}
                          className="p-1.5 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-xl transition-all cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handlePhotoUploadSubmit} className="p-6 space-y-6">
                        {/* Error Callouts */}
                        {galleryUploadError && (
                          <div className="p-4 bg-rose-50 border border-rose-150 rounded-xl text-rose-700 text-xs font-medium">
                            {galleryUploadError}
                          </div>
                        )}
                        {galleryUploadSuccess && (
                          <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-800 text-xs font-bold">
                            {galleryUploadSuccess}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Student Submitter Name */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Student or Instructor Name</label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                              placeholder="e.g. Amarendra Boro"
                              value={uploadStudentName}
                              onChange={(e) => setUploadStudentName(e.target.value)}
                              required
                            />
                          </div>

                          {/* Class Selector */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Student Class / Grade</label>
                            <select
                              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-705"
                              value={uploadPhotoClass}
                              onChange={(e) => setUploadPhotoClass(e.target.value)}
                            >
                              <option value="LKG">LKG (Lower Kindergarten)</option>
                              <option value="UKG">UKG (Upper Kindergarten)</option>
                              <option value="Class-I">Class I (Primary Division)</option>
                              <option value="Class-II">Class II (Primary Division)</option>
                              <option value="Class-III">Class III (Primary Division)</option>
                              <option value="Class-IV">Class IV (Primary Division)</option>
                              <option value="Class-V">Class V (Primary Division)</option>
                              <option value="Class-VI">Class VI (Secondary Division)</option>
                              <option value="Class-VII">Class VII (Secondary Division)</option>
                              <option value="Class-VIII">Class VIII (Secondary Division)</option>
                              <option value="Class-IX">Class IX (Secondary Division)</option>
                              <option value="Class-X">Class X (Secondary Board)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Title of Memory */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Moment/Photo Title</label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                              placeholder="e.g. Science Exhibition Winner"
                              value={uploadPhotoTitle}
                              onChange={(e) => setUploadPhotoTitle(e.target.value)}
                              required
                            />
                          </div>

                          {/* Category */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Activity Category</label>
                            <select
                              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-705"
                              value={uploadPhotoCategory}
                              onChange={(e) => setUploadPhotoCategory(e.target.value)}
                            >
                              <option value="Science">Science & Lab Projects</option>
                              <option value="Sports">Sports & Physical Play</option>
                              <option value="Art">Art & Craft Exhibitions</option>
                              <option value="Academics">Academics & Debate</option>
                            </select>
                          </div>
                        </div>

                        {/* Description Textarea */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Brief Description / Story</label>
                          <textarea
                            rows={2}
                            maxLength={250}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 leading-relaxed"
                            placeholder="Share some context about what activities are students doing here... (Max 250 characters)"
                            value={uploadPhotoDesc}
                            onChange={(e) => setUploadPhotoDesc(e.target.value)}
                            required
                          />
                        </div>

                        {/* Drag and Drop Zone Container */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Photo File (Max 2MB)</label>
                          
                          <div
                            onDragEnter={handleDragGallery}
                            onDragOver={handleDragGallery}
                            onDragLeave={handleDragGallery}
                            onDrop={handleDropGallery}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                              dragActiveGallery 
                                ? 'border-indigo-500 bg-indigo-50' 
                                : uploadPhotoFileBase64 
                                  ? 'border-emerald-300 bg-emerald-50/20' 
                                  : 'border-slate-200 hover:border-indigo-400 bg-slate-50'
                            }`}
                            onClick={() => {
                              const inputEl = document.getElementById('gallery-file-field');
                              if (inputEl) inputEl.click();
                            }}
                          >
                            <input
                              type="file"
                              id="gallery-file-field"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  processImageFile(e.target.files[0]);
                                }
                              }}
                            />

                            {uploadPhotoFileBase64 ? (
                              <div className="space-y-3">
                                <div className="w-24 h-16 rounded-lg overflow-hidden border border-emerald-150 mx-auto bg-slate-100 shadow-sm">
                                  <img 
                                    src={uploadPhotoFileBase64} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                <div>
                                  <span className="text-emerald-700 text-xs font-bold block">✓ Photo Selected & Compressed</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setUploadPhotoFileBase64('');
                                    }}
                                    className="text-[10px] text-red-500 underline font-semibold mt-1"
                                  >
                                    Remove selected file
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
                                <div>
                                  <span className="text-sm font-bold text-indigo-600 hover:underline">Click to browse</span> or drag and drop image here
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium block">PNG, JPG, or WEBP under 2 Megabytes</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer Form Toggles */}
                        <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setShowUploadModal(false)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-650 px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Close Form
                          </button>
                          <button
                            type="submit"
                            className="bg-indigo-650 hover:bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold shadow transition-all hover:scale-[1.01] cursor-pointer"
                          >
                            Submit to Gallery
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Lightbox / Zoom full details popup dialog */}
              <AnimatePresence>
                {selectedLightboxPhoto && (
                  <div 
                    className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setSelectedLightboxPhoto(null)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()} // Stop closing on click
                      className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-800"
                    >
                      {/* Left: Interactive Image display */}
                      <div className="flex-1 bg-slate-900 relative min-h-[300px] md:min-h-[450px] flex items-center justify-center p-2">
                        <img
                          src={selectedLightboxPhoto.url}
                          alt={selectedLightboxPhoto.title}
                          className="max-h-[70vh] object-contain rounded-lg"
                        />
                        <button
                          onClick={() => setSelectedLightboxPhoto(null)}
                          className="absolute top-4 left-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl transition-colors cursor-pointer"
                        >
                          ✕ Close View
                        </button>
                      </div>

                      {/* Right: Metadata Panel descriptions */}
                      <div className="w-full md:w-96 p-6 flex flex-col justify-between bg-slate-50 space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="bg-indigo-650 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg">
                              {selectedLightboxPhoto.category}
                            </span>
                            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                              {selectedLightboxPhoto.classId}
                            </span>
                          </div>

                          <h3 className="text-xl font-extrabold text-slate-900 leading-snug font-display">
                            {selectedLightboxPhoto.title}
                          </h3>

                          <div className="w-10 bg-indigo-650 h-1 rounded"></div>

                          <p className="text-slate-650 text-xs leading-relaxed font-sans">
                            {selectedLightboxPhoto.description}
                          </p>
                        </div>

                        <div className="border-t border-slate-200/80 pt-5 space-y-2">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Photographer/Uploader:</span>
                            <span className="font-bold text-slate-800 truncate max-w-[170px]">
                              {selectedLightboxPhoto.uploaderName}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Uploaded Date:</span>
                            <span className="font-semibold text-slate-600 font-mono">
                              {selectedLightboxPhoto.uploadDate}
                            </span>
                          </div>
                          <div className="pt-2 text-center text-[10px] text-slate-400 font-medium">
                            © Chakrapani Das Public School Jalah Student Activities Register.
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800" id="public-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SchoolLogo className="w-14 h-14 bg-white/5 rounded-2xl p-1.5 border border-white/10 shrink-0 shadow-inner" />
              <h4 className="text-white text-base font-bold leading-tight">Chakrapani Das Public School Jalah</h4>
            </div>
            <p className="text-xs text-slate-450 leading-relaxed">
              Serving our community since 2004 with world-class standard curriculum models, modern laboratories, and complete developmental care matrices.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Quick Direct links</h4>
            <ul className="space-y-2 text-xs flex flex-col items-start">
              <li><button onClick={() => setActiveSection('academics')} className="hover:text-white transition-colors cursor-pointer">Academics Overview</button></li>
              <li><button onClick={() => setActiveSection('students')} className="hover:text-white transition-colors cursor-pointer">Student Hub Resources</button></li>
              <li><button onClick={() => setActiveSection('teachers')} className="hover:text-white transition-colors cursor-pointer">Teacher Hub Opportunities</button></li>
              <li><button onClick={() => setActiveSection('admissions')} className="hover:text-white transition-colors cursor-pointer">Admission Form</button></li>
              <li><button onClick={() => setActiveSection('gallery')} className="hover:text-white transition-colors cursor-pointer text-indigo-400">Student Memories Gallery</button></li>
              <li><button onClick={() => setActiveSection('about')} className="hover:text-white transition-colors cursor-pointer">School History & Mission</button></li>
              <li><button onClick={onLoginClick} className="hover:text-white transition-colors text-red-400 font-bold cursor-pointer">Academy Portal Access</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Academics Standards</h4>
            <ul className="space-y-1.5 text-xs">
              <li>Lower & Upper Kindergarten</li>
              <li>Primary Division: Standards I to V</li>
              <li>Secondary Board: Prep to Class X</li>
              <li>Continuous Assessment: FA & SA Levels</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Academy Hours</h4>
            <ul className="space-y-1 text-xs">
              <li>Lectures: Mon - Fri (08:15 AM - 02:45 PM)</li>
              <li>Registrar cell: Mon - Sat (09:00 AM - 04:30 PM)</li>
              <li>Campus Grounds: Mon - Sat (07:30 AM - 06:00 PM)</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Chakrapani Das Public School Jalah. All rights reserved. Registered Grade A+ state educational system.
        </div>
      </footer>

    </div>
  );
}
