import { User, Class, Session, AttendanceRecord } from '@/types';
import { v4 as uuid } from 'crypto';

function genId() {
  return Math.random().toString(36).substring(2, 15);
}

const now = new Date().toISOString();
const today = new Date().toISOString().split('T')[0];

export const DEMO_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Dr. Rajesh Kumar',
    email: 'admin@smartattend.com',
    role: 'admin',
    department: 'Administration',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'teacher-1',
    name: 'Prof. Anita Sharma',
    email: 'anita@smartattend.com',
    role: 'teacher',
    department: 'Computer Applications',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'teacher-2',
    name: 'Prof. Suresh Patel',
    email: 'suresh@smartattend.com',
    role: 'teacher',
    department: 'Computer Applications',
    createdAt: '2024-01-12T00:00:00Z',
  },
  {
    id: 'student-1',
    name: 'Karan Mehta',
    email: 'karan@student.com',
    role: 'student',
    department: 'BCA',
    enrollmentNo: 'BCA2024001',
    createdAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'student-2',
    name: 'Priya Singh',
    email: 'priya@student.com',
    role: 'student',
    department: 'BCA',
    enrollmentNo: 'BCA2024002',
    createdAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'student-3',
    name: 'Arjun Verma',
    email: 'arjun@student.com',
    role: 'student',
    department: 'BCA',
    enrollmentNo: 'BCA2024003',
    createdAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'student-4',
    name: 'Sneha Joshi',
    email: 'sneha@student.com',
    role: 'student',
    department: 'BCA',
    enrollmentNo: 'BCA2024004',
    createdAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'student-5',
    name: 'Rahul Gupta',
    email: 'rahul@student.com',
    role: 'student',
    department: 'BCA',
    enrollmentNo: 'BCA2024005',
    createdAt: '2024-07-01T00:00:00Z',
  },
];

export const DEMO_CLASSES: Class[] = [
  {
    id: 'class-1',
    name: 'BCA - 6th Semester A',
    subject: 'Web Technologies',
    teacherId: 'teacher-1',
    teacherName: 'Prof. Anita Sharma',
    department: 'Computer Applications',
    semester: '6th',
    studentIds: ['student-1', 'student-2', 'student-3', 'student-4', 'student-5'],
    createdAt: '2024-07-15T00:00:00Z',
  },
  {
    id: 'class-2',
    name: 'BCA - 6th Semester A',
    subject: 'Database Management',
    teacherId: 'teacher-1',
    teacherName: 'Prof. Anita Sharma',
    department: 'Computer Applications',
    semester: '6th',
    studentIds: ['student-1', 'student-2', 'student-3', 'student-4', 'student-5'],
    createdAt: '2024-07-15T00:00:00Z',
  },
  {
    id: 'class-3',
    name: 'BCA - 6th Semester A',
    subject: 'Software Engineering',
    teacherId: 'teacher-2',
    teacherName: 'Prof. Suresh Patel',
    department: 'Computer Applications',
    semester: '6th',
    studentIds: ['student-1', 'student-2', 'student-3', 'student-4', 'student-5'],
    createdAt: '2024-07-15T00:00:00Z',
  },
];

export const DEMO_SESSIONS: Session[] = [
  {
    id: 'session-1',
    classId: 'class-1',
    className: 'BCA - 6th Semester A',
    subject: 'Web Technologies',
    teacherId: 'teacher-1',
    teacherName: 'Prof. Anita Sharma',
    date: today,
    startTime: '09:00',
    endTime: '10:00',
    isActive: false,
    qrToken: 'tok-session-1',
    expiresAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'session-2',
    classId: 'class-2',
    className: 'BCA - 6th Semester A',
    subject: 'Database Management',
    teacherId: 'teacher-1',
    teacherName: 'Prof. Anita Sharma',
    date: today,
    startTime: '11:00',
    endTime: '12:00',
    isActive: false,
    qrToken: 'tok-session-2',
    expiresAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'session-3',
    classId: 'class-3',
    className: 'BCA - 6th Semester A',
    subject: 'Software Engineering',
    teacherId: 'teacher-2',
    teacherName: 'Prof. Suresh Patel',
    date: today,
    startTime: '14:00',
    isActive: false,
    qrToken: 'tok-session-3',
    expiresAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const DEMO_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', sessionId: 'session-1', classId: 'class-1', className: 'BCA - 6th Semester A', subject: 'Web Technologies', studentId: 'student-1', studentName: 'Karan Mehta', enrollmentNo: 'BCA2024001', date: today, time: '09:05', status: 'present' },
  { id: 'att-2', sessionId: 'session-1', classId: 'class-1', className: 'BCA - 6th Semester A', subject: 'Web Technologies', studentId: 'student-2', studentName: 'Priya Singh', enrollmentNo: 'BCA2024002', date: today, time: '09:07', status: 'present' },
  { id: 'att-3', sessionId: 'session-1', classId: 'class-1', className: 'BCA - 6th Semester A', subject: 'Web Technologies', studentId: 'student-3', studentName: 'Arjun Verma', enrollmentNo: 'BCA2024003', date: today, time: '09:10', status: 'present' },
  { id: 'att-4', sessionId: 'session-1', classId: 'class-1', className: 'BCA - 6th Semester A', subject: 'Web Technologies', studentId: 'student-4', studentName: 'Sneha Joshi', enrollmentNo: 'BCA2024004', date: today, time: '09:12', status: 'present' },
  { id: 'att-5', sessionId: 'session-1', classId: 'class-1', className: 'BCA - 6th Semester A', subject: 'Web Technologies', studentId: 'student-5', studentName: 'Rahul Gupta', enrollmentNo: 'BCA2024005', date: today, time: '09:15', status: 'absent' },
  { id: 'att-6', sessionId: 'session-2', classId: 'class-2', className: 'BCA - 6th Semester A', subject: 'Database Management', studentId: 'student-1', studentName: 'Karan Mehta', enrollmentNo: 'BCA2024001', date: today, time: '11:02', status: 'present' },
  { id: 'att-7', sessionId: 'session-2', classId: 'class-2', className: 'BCA - 6th Semester A', subject: 'Database Management', studentId: 'student-2', studentName: 'Priya Singh', enrollmentNo: 'BCA2024002', date: today, time: '11:05', status: 'present' },
  { id: 'att-8', sessionId: 'session-2', classId: 'class-2', className: 'BCA - 6th Semester A', subject: 'Database Management', studentId: 'student-3', studentName: 'Arjun Verma', enrollmentNo: 'BCA2024003', date: today, time: '11:08', status: 'absent' },
  { id: 'att-9', sessionId: 'session-2', classId: 'class-2', className: 'BCA - 6th Semester A', subject: 'Database Management', studentId: 'student-4', studentName: 'Sneha Joshi', enrollmentNo: 'BCA2024004', date: today, time: '11:11', status: 'present' },
  { id: 'att-10', sessionId: 'session-2', classId: 'class-2', className: 'BCA - 6th Semester A', subject: 'Database Management', studentId: 'student-5', studentName: 'Rahul Gupta', enrollmentNo: 'BCA2024005', date: today, time: '11:14', status: 'present' },
  { id: 'att-11', sessionId: 'session-3', classId: 'class-3', className: 'BCA - 6th Semester A', subject: 'Software Engineering', studentId: 'student-1', studentName: 'Karan Mehta', enrollmentNo: 'BCA2024001', date: today, time: '14:02', status: 'present' },
  { id: 'att-12', sessionId: 'session-3', classId: 'class-3', className: 'BCA - 6th Semester A', subject: 'Software Engineering', studentId: 'student-2', studentName: 'Priya Singh', enrollmentNo: 'BCA2024002', date: today, time: '14:05', status: 'present' },
  { id: 'att-13', sessionId: 'session-3', classId: 'class-3', className: 'BCA - 6th Semester A', subject: 'Software Engineering', studentId: 'student-3', studentName: 'Arjun Verma', enrollmentNo: 'BCA2024003', date: today, time: '14:08', status: 'present' },
  { id: 'att-14', sessionId: 'session-3', classId: 'class-3', className: 'BCA - 6th Semester A', subject: 'Software Engineering', studentId: 'student-4', studentName: 'Sneha Joshi', enrollmentNo: 'BCA2024004', date: today, time: '14:11', status: 'absent' },
  { id: 'att-15', sessionId: 'session-3', classId: 'class-3', className: 'BCA - 6th Semester A', subject: 'Software Engineering', studentId: 'student-5', studentName: 'Rahul Gupta', enrollmentNo: 'BCA2024005', date: today, time: '14:14', status: 'absent' },
];
