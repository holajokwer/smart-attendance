'use client';

import { useApp } from '@/context/AppContext';
import { Users, BookOpen, ClipboardList, TrendingUp, Activity, Eye, Download } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { users, classes, sessions, attendance } = useApp();

  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalTeachers = users.filter(u => u.role === 'teacher').length;
  const totalSessions = sessions.length;
  const attendanceRate = attendance.length > 0
    ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
    : 0;

  const recentAttendance = [...attendance].reverse().slice(0, 8);

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: Users, color: 'stat-indigo', textColor: '#4F46E5' },
    { label: 'Total Teachers', value: totalTeachers, icon: Users, color: 'stat-blue', textColor: '#2563EB' },
    { label: 'Total Classes', value: classes.length, icon: BookOpen, color: 'stat-purple', textColor: '#7C3AED' },
    { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: TrendingUp, color: 'stat-green', textColor: '#059669' },
    { label: 'Total Sessions', value: totalSessions, icon: Activity, color: 'stat-amber', textColor: '#D97706' },
    { label: 'Total Records', value: attendance.length, icon: ClipboardList, color: 'stat-red', textColor: '#DC2626' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">System overview · {format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <Link href="/dashboard/admin/reports" className="btn btn-primary btn-sm">
          <Download size={14} /> Export Reports
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`${s.color} rounded-2xl p-5 animate-fade-in`} style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <s.icon size={18} style={{ color: s.textColor }} />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-800 mb-1">{s.value}</div>
            <div className="text-sm font-medium text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800">System Users</h2>
            <Link href="/dashboard/admin/users" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
              View All <Eye size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {users.slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)' }}>
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 text-sm truncate">{user.name}</div>
                  <div className="text-xs text-slate-400">{user.email}</div>
                </div>
                <span className={`badge ${user.role === 'admin' ? 'badge-purple' : user.role === 'teacher' ? 'badge-blue' : 'badge-green'}`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800">Recent Attendance</h2>
            <Link href="/dashboard/admin/attendance" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
              View All <Eye size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentAttendance.map(rec => (
              <div key={rec.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${rec.status === 'present' ? 'bg-emerald-500' : 'bg-red-400'}`}></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 text-sm truncate">{rec.studentName}</div>
                  <div className="text-xs text-slate-400">{rec.subject} · {rec.time}</div>
                </div>
                <span className={`badge ${rec.status === 'present' ? 'badge-green' : 'badge-red'}`}>
                  {rec.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Classes Overview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-800">Active Classes</h2>
          <Link href="/dashboard/admin/classes" className="text-xs font-semibold text-indigo-600 hover:underline">View All</Link>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Students</th>
                <th>Sessions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map(cls => {
                const classSessions = sessions.filter(s => s.classId === cls.id);
                return (
                  <tr key={cls.id}>
                    <td className="font-medium text-slate-800">{cls.name}</td>
                    <td>{cls.subject}</td>
                    <td className="text-slate-500">{cls.teacherName}</td>
                    <td><span className="badge badge-blue">{cls.studentIds.length}</span></td>
                    <td><span className="badge badge-indigo">{classSessions.length}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
