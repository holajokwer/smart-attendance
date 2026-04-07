import { supabase } from './supabase';
import { User, Class, Session, AttendanceRecord } from '@/types';
import { DEMO_USERS, DEMO_CLASSES, DEMO_SESSIONS, DEMO_ATTENDANCE } from './demoData';

// Helper: check if a Supabase error is "table not found"
function isTableMissing(error: any): boolean {
  return !!(
    error?.message?.includes('relation') ||
    error?.message?.includes('does not exist') ||
    error?.code === '42P01' ||
    error?.code === 'PGRST116' ||
    error?.status === 404
  );
}

// ─────────────────────────────────────────────
// READ ALL DATA
// ─────────────────────────────────────────────

export async function fetchAllData(): Promise<{
  users: User[];
  classes: Class[];
  sessions: Session[];
  attendance: AttendanceRecord[];
}> {
  const [usersRes, classesRes, classStudentsRes, sessionsRes, attendanceRes] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at'),
    supabase.from('classes').select('*').order('created_at'),
    supabase.from('class_students').select('*'),
    supabase.from('sessions').select('*').order('created_at', { ascending: false }),
    supabase.from('attendance_records').select('*').order('created_at', { ascending: false }),
  ]);

  // If any key table is missing, throw so context can fall back gracefully
  if (isTableMissing(usersRes.error) || isTableMissing(classesRes.error)) {
    throw new Error('TABLES_NOT_FOUND')
  }

  const rawUsers: User[] = (usersRes.data || []).map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department,
    enrollmentNo: u.enrollment_no,
    createdAt: u.created_at,
  }));

  const classStudents: { class_id: string; student_id: string }[] = classStudentsRes.data || [];

  const rawClasses: Class[] = (classesRes.data || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    subject: c.subject,
    teacherId: c.teacher_id,
    teacherName: c.teacher_name,
    department: c.department,
    semester: c.semester,
    studentIds: classStudents.filter(cs => cs.class_id === c.id).map(cs => cs.student_id),
    createdAt: c.created_at,
  }));

  const rawSessions: Session[] = (sessionsRes.data || []).map((s: any) => ({
    id: s.id,
    classId: s.class_id,
    className: s.class_name,
    subject: s.subject,
    teacherId: s.teacher_id,
    teacherName: s.teacher_name,
    date: s.date,
    startTime: s.start_time,
    endTime: s.end_time,
    isActive: s.is_active,
    qrToken: s.qr_token,
    expiresAt: s.expires_at,
  }));

  const rawAttendance: AttendanceRecord[] = (attendanceRes.data || []).map((a: any) => ({
    id: a.id,
    sessionId: a.session_id,
    classId: a.class_id,
    className: a.class_name,
    subject: a.subject,
    studentId: a.student_id,
    studentName: a.student_name,
    enrollmentNo: a.enrollment_no,
    date: a.date,
    time: a.time,
    status: a.status,
  }));

  return { users: rawUsers, classes: rawClasses, sessions: rawSessions, attendance: rawAttendance };
}

// ─────────────────────────────────────────────
// SEED DEMO DATA (run once on first launch)
// ─────────────────────────────────────────────

export async function seedDemoData(): Promise<void> {
  // Check if profiles already seeded
  const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  if ((count ?? 0) > 0) return; // already seeded

  console.log('Seeding demo data to Supabase...');

  // Insert users/profiles
  const profileRows = DEMO_USERS.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department || null,
    enrollment_no: u.enrollmentNo || null,
    created_at: u.createdAt,
  }));
  await supabase.from('profiles').insert(profileRows);

  // Insert classes
  const classRows = DEMO_CLASSES.map(c => ({
    id: c.id,
    name: c.name,
    subject: c.subject,
    teacher_id: c.teacherId,
    teacher_name: c.teacherName,
    department: c.department,
    semester: c.semester,
    created_at: c.createdAt,
  }));
  await supabase.from('classes').insert(classRows);

  // Insert class_students junction
  const csRows: { class_id: string; student_id: string }[] = [];
  DEMO_CLASSES.forEach(c => c.studentIds.forEach(sid => csRows.push({ class_id: c.id, student_id: sid })));
  await supabase.from('class_students').insert(csRows);

  // Insert sessions
  const sessionRows = DEMO_SESSIONS.map(s => ({
    id: s.id,
    class_id: s.classId,
    class_name: s.className,
    subject: s.subject,
    teacher_id: s.teacherId,
    teacher_name: s.teacherName,
    date: s.date,
    start_time: s.startTime,
    end_time: s.endTime || null,
    is_active: s.isActive,
    qr_token: s.qrToken,
    expires_at: s.expiresAt,
  }));
  await supabase.from('sessions').insert(sessionRows);

  // Insert attendance
  const attRows = DEMO_ATTENDANCE.map(a => ({
    id: a.id,
    session_id: a.sessionId,
    class_id: a.classId,
    class_name: a.className,
    subject: a.subject,
    student_id: a.studentId,
    student_name: a.studentName,
    enrollment_no: a.enrollmentNo,
    date: a.date,
    time: a.time,
    status: a.status,
  }));
  await supabase.from('attendance_records').insert(attRows);

  console.log('Demo data seeded successfully!');
}

// ─────────────────────────────────────────────
// WRITE OPERATIONS
// ─────────────────────────────────────────────

export async function dbAddClass(cls: Class): Promise<void> {
  await supabase.from('classes').insert({
    id: cls.id,
    name: cls.name,
    subject: cls.subject,
    teacher_id: cls.teacherId,
    teacher_name: cls.teacherName,
    department: cls.department,
    semester: cls.semester,
  });

  const csRows = cls.studentIds.map(sid => ({ class_id: cls.id, student_id: sid }));
  if (csRows.length > 0) await supabase.from('class_students').insert(csRows);
}

export async function dbAddSession(session: Session): Promise<void> {
  await supabase.from('sessions').insert({
    id: session.id,
    class_id: session.classId,
    class_name: session.className,
    subject: session.subject,
    teacher_id: session.teacherId,
    teacher_name: session.teacherName,
    date: session.date,
    start_time: session.startTime,
    end_time: session.endTime || null,
    is_active: session.isActive,
    qr_token: session.qrToken,
    expires_at: session.expiresAt,
  });
}

export async function dbUpdateSession(sessionId: string, updates: Partial<Session>): Promise<void> {
  const dbUpdates: Record<string, any> = {};
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
  if (updates.endTime !== undefined) dbUpdates.end_time = updates.endTime;
  if (updates.expiresAt !== undefined) dbUpdates.expires_at = updates.expiresAt;
  await supabase.from('sessions').update(dbUpdates).eq('id', sessionId);
}

export async function dbMarkAttendance(record: AttendanceRecord): Promise<void> {
  await supabase.from('attendance_records').insert({
    id: record.id,
    session_id: record.sessionId,
    class_id: record.classId,
    class_name: record.className,
    subject: record.subject,
    student_id: record.studentId,
    student_name: record.studentName,
    enrollment_no: record.enrollmentNo,
    date: record.date,
    time: record.time,
    status: record.status,
  });
}
