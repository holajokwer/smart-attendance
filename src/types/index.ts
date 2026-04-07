export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
  enrollmentNo?: string;
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  department: string;
  semester: string;
  studentIds: string[];
  createdAt: string;
}

export interface Session {
  id: string;
  classId: string;
  className: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  date: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  qrToken: string;
  expiresAt: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  classId: string;
  className: string;
  subject: string;
  studentId: string;
  studentName: string;
  enrollmentNo: string;
  date: string;
  time: string;
  status: 'present' | 'absent';
}

export interface AttendanceSummary {
  studentId: string;
  studentName: string;
  enrollmentNo: string;
  classId: string;
  className: string;
  totalSessions: number;
  present: number;
  absent: number;
  percentage: number;
}
