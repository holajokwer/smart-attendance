-- =============================================
-- Smart Attendance System - Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================

-- 1. Profiles (Users)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  department TEXT,
  enrollment_no TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Classes
CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  teacher_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  teacher_name TEXT NOT NULL,
  department TEXT,
  semester TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Class-Student Junction
CREATE TABLE IF NOT EXISTS class_students (
  class_id TEXT REFERENCES classes(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (class_id, student_id)
);

-- 4. Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  class_id TEXT REFERENCES classes(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  teacher_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  teacher_name TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  qr_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Attendance Records
CREATE TABLE IF NOT EXISTS attendance_records (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  class_id TEXT NOT NULL,
  class_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  student_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  enrollment_no TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure a student can only be marked once per session
  UNIQUE (session_id, student_id)
);

-- =============================================
-- Row Level Security: Allow anon access (Demo)
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon key (demo mode)
CREATE POLICY "Allow all for anon" ON profiles FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON classes FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON class_students FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON sessions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON attendance_records FOR ALL TO anon USING (true) WITH CHECK (true);

-- =============================================
-- Done! The app will auto-seed demo data on
-- first launch. No manual data entry needed.
-- =============================================
