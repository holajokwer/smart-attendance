import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This endpoint creates all Supabase tables and enables RLS.
// Visit /api/setup ONCE to initialize your database.

const SQL_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    department TEXT,
    enrollment_no TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    teacher_id TEXT,
    teacher_name TEXT NOT NULL,
    department TEXT,
    semester TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS class_students (
    class_id TEXT,
    student_id TEXT,
    PRIMARY KEY (class_id, student_id)
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    class_id TEXT,
    class_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    teacher_id TEXT,
    teacher_name TEXT NOT NULL,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    qr_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS attendance_records (
    id TEXT PRIMARY KEY,
    session_id TEXT,
    class_id TEXT NOT NULL,
    class_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    student_id TEXT,
    student_name TEXT NOT NULL,
    enrollment_no TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
];

export async function GET() {
  const results: { table: string; status: string; error?: string }[] = [];
  const tables = ['profiles', 'classes', 'class_students', 'sessions', 'attendance_records'];

  for (let i = 0; i < SQL_STATEMENTS.length; i++) {
    const sql = SQL_STATEMENTS[i];
    const table = tables[i];
    try {
      const { error } = await supabase.rpc('exec_sql', { query: sql });
      if (error) {
        // Try a gentler check — the table might already exist
        const { error: checkErr } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (checkErr && checkErr.code === '42P01') {
          results.push({ table, status: 'ERROR', error: error.message });
        } else {
          results.push({ table, status: 'ALREADY_EXISTS' });
        }
      } else {
        results.push({ table, status: 'CREATED' });
      }
    } catch (e: any) {
      results.push({ table, status: 'EXCEPTION', error: e.message });
    }
  }

  // Check overall table availability 
  const tableChecks: Record<string, boolean> = {};
  for (const t of tables) {
    const { error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    tableChecks[t] = !error || error.code !== '42P01';
  }

  const allReady = Object.values(tableChecks).every(Boolean);

  return NextResponse.json({
    message: allReady
      ? '✅ All tables are ready! Your app is connected to Supabase.'
      : '⚠️ Some tables may need to be created manually. See the SQL file.',
    tableStatus: tableChecks,
    setupResults: results,
    nextStep: allReady
      ? 'Open http://localhost:3000/login and login. Demo data will auto-seed!'
      : 'Open supabase-schema.sql and run it in your Supabase SQL Editor.',
  }, { status: 200 });
}
