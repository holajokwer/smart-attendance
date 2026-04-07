'use client';

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Building, BookOpen, IdCard, LogOut, Shield, GraduationCap, UserCheck } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, logout, attendance, classes, sessions } = useApp();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!currentUser) return null;

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const roleIcon = { admin: Shield, teacher: GraduationCap, student: UserCheck }[currentUser.role];
  const roleColor = { admin: 'badge-purple', teacher: 'badge-blue', student: 'badge-green' }[currentUser.role];
  const RoleIcon = roleIcon || Shield;

  const myStats = currentUser.role === 'student' ? [
    { label: 'Attendance Records', value: attendance.filter(a => a.studentId === currentUser.id).length },
    { label: 'Present', value: attendance.filter(a => a.studentId === currentUser.id && a.status === 'present').length },
    { label: 'Absent', value: attendance.filter(a => a.studentId === currentUser.id && a.status === 'absent').length },
  ] : currentUser.role === 'teacher' ? [
    { label: 'My Classes', value: classes.filter(c => c.teacherId === currentUser.id).length },
    { label: 'Sessions Run', value: sessions.filter(s => s.teacherId === currentUser.id).length },
    { label: 'Records Created', value: attendance.filter(a => sessions.filter(s => s.teacherId === currentUser.id).some(s => s.id === a.sessionId)).length },
  ] : [
    { label: 'Total Users', value: 8 },
    { label: 'Total Classes', value: classes.length },
    { label: 'Total Sessions', value: sessions.length },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile & Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Your account information</p>
      </div>

      {/* Profile Hero */}
      <div className="card p-8 text-center"
        style={{ background: 'linear-gradient(135deg, #EEF2FF, #F8F9FF)' }}>
        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-extrabold mb-4"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)' }}>
          {initials}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">{currentUser.name}</h2>
        <p className="text-slate-500 mb-3">{currentUser.email}</p>
        <span className={`badge ${roleColor}`}>
          <RoleIcon size={12} className="mr-1" /> {currentUser.role}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {myStats.map((s, i) => (
          <div key={i} className="stat-indigo rounded-xl p-4 text-center">
            <div className="text-2xl font-extrabold text-slate-800">{s.value}</div>
            <div className="text-xs text-slate-600 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-slate-800">Account Details</h3>
        {[
          { icon: User, label: 'Full Name', value: currentUser.name },
          { icon: Mail, label: 'Email Address', value: currentUser.email },
          { icon: Building, label: 'Department', value: currentUser.department || 'N/A' },
          ...(currentUser.enrollmentNo ? [{ icon: IdCard, label: 'Enrollment Number', value: currentUser.enrollmentNo }] : []),
          { icon: RoleIcon, label: 'Role', value: currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 stat-indigo rounded-lg flex items-center justify-center flex-shrink-0">
              <item.icon size={16} className="text-indigo-600" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">{item.label}</div>
              <div className="font-semibold text-slate-800">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* System Info */}
      <div className="card p-6 space-y-3">
        <h3 className="font-bold text-slate-800">System Information</h3>
        <div className="p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <p className="text-xs text-slate-500 mb-1">Mode</p>
          <p className="font-semibold text-slate-800">🎮 Demo Mode — All data stored in browser</p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <p className="text-xs text-slate-500 mb-1">Version</p>
          <p className="font-semibold text-slate-800">Smart Attendance System v1.0 · BCA Project 2024</p>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="btn btn-danger btn-lg w-full"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  );
}
