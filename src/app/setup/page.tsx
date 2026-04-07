'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Copy, ExternalLink, QrCode, Loader } from 'lucide-react';
import Link from 'next/link';

const TABLES = ['profiles', 'classes', 'class_students', 'sessions', 'attendance_records'];

const SQL = `-- Smart Attendance System — Supabase Schema
-- Paste this in: Supabase Dashboard → SQL Editor → New Query → Run

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  department TEXT,
  enrollment_no TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS class_students (
  class_id TEXT REFERENCES classes(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (class_id, student_id)
);

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
  UNIQUE (session_id, student_id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon" ON profiles FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON classes FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON class_students FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON sessions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON attendance_records FOR ALL TO anon USING (true) WITH CHECK (true);`;

type TableStatus = 'checking' | 'ready' | 'missing';

export default function SetupPage() {
  const [tableStatus, setTableStatus] = useState<Record<string, TableStatus>>(
    Object.fromEntries(TABLES.map(t => [t, 'checking' as TableStatus]))
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkTables();
  }, []);

  const checkTables = async () => {
    setTableStatus(Object.fromEntries(TABLES.map(t => [t, 'checking' as TableStatus])));
    for (const table of TABLES) {
      const { data, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      // Supabase returns an error with 'relation' or 'does not exist' in message for missing tables
      const isMissing = error && (
        error.message?.toLowerCase().includes('relation') ||
        error.message?.toLowerCase().includes('does not exist') ||
        (error as any).code === '42P01' ||
        (error as any).status === 404
      );
      const status: TableStatus = isMissing ? 'missing' : 'ready';
      setTableStatus(prev => ({ ...prev, [table]: status }));
    }
  };

  const copySQL = async () => {
    await navigator.clipboard.writeText(SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allReady = Object.values(tableStatus).every(s => s === 'ready');
  const anyMissing = Object.values(tableStatus).some(s => s === 'missing');

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F8FAFC, #EEF2FF)' }}>
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)', borderRadius: '12px', padding: '10px' }}>
            <QrCode className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Supabase Setup</h1>
            <p className="text-slate-500 text-sm">Smart Attendance System — Database Configuration</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Database Tables</h2>
            <button onClick={checkTables} className="btn btn-secondary btn-sm">
              <Loader size={14} /> Re-check
            </button>
          </div>
          <div className="space-y-3">
            {TABLES.map(table => {
              const status = tableStatus[table];
              return (
                <div key={table} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: status === 'ready' ? '#ECFDF5' : status === 'missing' ? '#FFF1F2' : '#F8FAFC',
                    border: `1px solid ${status === 'ready' ? '#A7F3D0' : status === 'missing' ? '#FECDD3' : '#E2E8F0'}` }}>
                  <div className="flex items-center gap-3">
                    {status === 'checking' && <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-indigo-500 animate-spin"></div>}
                    {status === 'ready' && <CheckCircle size={16} className="text-emerald-500" />}
                    {status === 'missing' && <XCircle size={16} className="text-red-400" />}
                    <code className="text-sm font-mono font-semibold text-slate-700">{table}</code>
                  </div>
                  <span className={`badge ${status === 'ready' ? 'badge-green' : status === 'missing' ? 'badge-red' : 'badge-indigo'}`}>
                    {status === 'checking' ? 'Checking...' : status === 'ready' ? '✓ Ready' : '✗ Not Found'}
                  </span>
                </div>
              );
            })}
          </div>

          {allReady && (
            <div className="mt-4 p-4 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: '1px solid #6EE7B7' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} className="text-emerald-600" />
                <span className="font-bold text-emerald-800">All tables ready!</span>
              </div>
              <p className="text-emerald-700 text-sm">Your Supabase database is configured. Demo data will auto-seed on first login.</p>
              <Link href="/login" className="btn btn-success btn-sm mt-3 inline-flex">Go to Login →</Link>
            </div>
          )}
        </div>

        {(anyMissing || Object.values(tableStatus).some(s => s === 'checking')) && (
          <div className="card p-6">
            <h2 className="font-bold text-slate-800 mb-2">Setup Instructions</h2>
            <p className="text-slate-500 text-sm mb-4">Follow these steps to create the database tables:</p>

            <ol className="space-y-3 mb-5">
              {[
                { step: '1', text: 'Open your Supabase Dashboard', link: 'https://supabase.com/dashboard/project/cldhmhkbvqwcuguvlalt/sql/new', linkLabel: 'Open SQL Editor ↗' },
                { step: '2', text: 'Click "New Query" in the SQL Editor' },
                { step: '3', text: 'Copy the SQL below and paste it into the editor' },
                { step: '4', text: 'Click the green "Run" button (or press Ctrl+Enter)' },
                { step: '5', text: 'Come back here and click "Re-check" to verify' },
              ].map(s => (
                <li key={s.step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)' }}>{s.step}</span>
                  <div>
                    <span className="text-sm text-slate-700">{s.text}</span>
                    {s.link && (
                      <a href={s.link} target="_blank" rel="noopener noreferrer"
                        className="ml-2 text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1">
                        {s.linkLabel} <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            {/* SQL Block */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
              <div className="flex items-center justify-between px-4 py-2"
                style={{ background: '#1E293B' }}>
                <span className="text-xs text-slate-400 font-mono">supabase-schema.sql</span>
                <button onClick={copySQL} className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                  <Copy size={12} />
                  {copied ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              <pre className="p-4 text-xs overflow-auto max-h-64"
                style={{ background: '#0F172A', color: '#94A3B8', fontFamily: 'monospace' }}>
                {SQL}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
