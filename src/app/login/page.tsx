'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, ChevronDown, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const DEMO_ACCOUNTS = [
  { id: 'admin-1', label: 'Admin — Dr. Rajesh Kumar', role: 'admin', email: 'admin@smartattend.com' },
  { id: 'teacher-1', label: 'Teacher — Prof. Anita Sharma', role: 'teacher', email: 'anita@smartattend.com' },
  { id: 'teacher-2', label: 'Teacher — Prof. Suresh Patel', role: 'teacher', email: 'suresh@smartattend.com' },
  { id: 'student-1', label: 'Student — Karan Mehta', role: 'student', email: 'karan@student.com' },
  { id: 'student-2', label: 'Student — Priya Singh', role: 'student', email: 'priya@student.com' },
  { id: 'student-3', label: 'Student — Arjun Verma', role: 'student', email: 'arjun@student.com' },
];

const ROLE_REDIRECTS: Record<string, string> = {
  admin: '/dashboard/admin',
  teacher: '/dashboard/teacher',
  student: '/dashboard/student',
};

export default function LoginPage() {
  const [selectedId, setSelectedId] = useState('');
  const [showDrop, setShowDrop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useApp();
  const router = useRouter();

  const selectedAccount = DEMO_ACCOUNTS.find(a => a.id === selectedId);

  const handleLogin = async () => {
    if (!selectedId) {
      setError('Please select a demo account to continue.');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(res => setTimeout(res, 800)); // simulate network
    login(selectedId);
    const account = DEMO_ACCOUNTS.find(a => a.id === selectedId);
    router.push(ROLE_REDIRECTS[account?.role || 'student']);
  };

  const roleColor: Record<string, string> = {
    admin: 'badge-purple',
    teacher: 'badge-blue',
    student: 'badge-green',
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 50%, #EEF2FF 100%)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(160deg, #3730A3 0%, #4F46E5 60%, #6366F1 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-xl p-2">
            <QrCode className="text-white" size={24} />
          </div>
          <span className="text-white font-bold text-xl">Smart Attendance</span>
        </div>

        <div>
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="text-white" size={20} />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Demo Mode Active</p>
                <p className="text-indigo-200 text-sm leading-relaxed">
                  Select any demo account to explore the full system — Admin, Teacher, or Student portal. No real credentials needed.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Attendance,<br />Reimagined.
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            QR-based attendance management for modern classrooms. Fast, secure, and paperless.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { val: '3', label: 'Roles' },
              { val: 'QR', label: 'Based' },
              { val: '100%', label: 'Online' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold text-white">{s.val}</div>
                <div className="text-indigo-200 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-300 text-sm">BCA Final Year Project · 2024</p>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)', borderRadius: '10px', padding: '7px' }}>
              <QrCode className="text-white" size={20} />
            </div>
            <span className="font-bold text-slate-800 text-lg">Smart Attendance</span>
          </div>

          <div className="card p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm mb-8">Select a demo account to continue</p>

            {/* Account Picker */}
            <div className="mb-6">
              <label className="label">Demo Account</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDrop(!showDrop)}
                  className="input flex items-center justify-between cursor-pointer"
                  style={{ textAlign: 'left' }}
                >
                  {selectedAccount ? (
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)' }}>
                        {selectedAccount.label[selectedAccount.label.indexOf('—') + 2]}
                      </div>
                      <span className="text-slate-800 font-medium">{selectedAccount.label}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">Choose a demo account...</span>
                  )}
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${showDrop ? 'rotate-180' : ''}`} />
                </button>

                {showDrop && (
                  <div className="absolute top-full left-0 right-0 mt-1 card py-1 z-50" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
                    {['admin', 'teacher', 'student'].map(role => {
                      const accounts = DEMO_ACCOUNTS.filter(a => a.role === role);
                      return (
                        <div key={role}>
                          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                            {role}
                          </div>
                          {accounts.map(acc => (
                            <button
                              key={acc.id}
                              type="button"
                              onClick={() => { setSelectedId(acc.id); setShowDrop(false); setError(''); }}
                              className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-50 transition-colors text-left ${selectedId === acc.id ? 'bg-indigo-50' : ''}`}
                            >
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)' }}>
                                {acc.label[acc.label.indexOf('—') + 2]}
                              </div>
                              <div>
                                <div className="font-medium text-sm text-slate-800">{acc.label.split('—')[1].trim()}</div>
                                <div className="text-xs text-slate-400">{acc.email}</div>
                              </div>
                              <span className={`badge ${roleColor[acc.role]} ml-auto`}>{acc.role}</span>
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Password hint */}
            <div className="mb-6">
              <label className="label">Password</label>
              <div className="input flex items-center justify-between text-slate-400" style={{ cursor: 'default' }}>
                <span>demo1234</span>
                <Eye size={16} />
              </div>
              <p className="text-xs text-slate-400 mt-1">Demo mode — any password works</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl text-sm font-medium"
                style={{ background: '#FFF1F2', color: '#BE123C', border: '1px solid #FECDD3' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
              style={{ width: '100%' }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>

            <div className="mt-6 p-4 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <p className="text-xs font-semibold text-slate-500 mb-2">🎯 Quick Demo Tips</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Select <strong>Admin</strong> to see user management & analytics</li>
                <li>• Select <strong>Teacher</strong> to create classes & generate QR</li>
                <li>• Select <strong>Student</strong> to scan QR & track attendance</li>
              </ul>
            </div>
          </div>

          <p className="text-center text-slate-400 text-xs mt-6">
            Smart Attendance System · BCA Final Year Project
          </p>
        </div>
      </div>
    </div>
  );
}
