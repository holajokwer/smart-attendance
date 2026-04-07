'use client';

import { useApp } from '@/context/AppContext';
import { QrCode, CheckCircle, XCircle, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const { currentUser, classes, sessions, attendance } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const myAttendance = attendance.filter(a => a.studentId === currentUser?.id);
  const present = myAttendance.filter(a => a.status === 'present').length;
  const absent = myAttendance.filter(a => a.status === 'absent').length;
  const percentage = myAttendance.length > 0 ? Math.round((present / myAttendance.length) * 100) : 0;
  const todayAtt = myAttendance.filter(a => a.date === today);
  const activeSession = sessions.find(s => s.isActive);

  // Per subject breakdown
  const subjectsMap: Record<string, { present: number; total: number; subject: string }> = {};
  myAttendance.forEach(a => {
    if (!subjectsMap[a.classId]) subjectsMap[a.classId] = { present: 0, total: 0, subject: a.subject };
    subjectsMap[a.classId].total++;
    if (a.status === 'present') subjectsMap[a.classId].present++;
  });
  const subjectSummaries = Object.values(subjectsMap);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hi, {currentUser?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')} · {currentUser?.enrollmentNo}</p>
        </div>
        <Link href="/dashboard/student/scan" className="btn btn-primary animate-pulse-ring">
          <QrCode size={16} /> Scan QR Code
        </Link>
      </div>

      {/* Active Session Alert */}
      {activeSession && (
        <div className="rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4"
          style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', border: '2px solid #93C5FD' }}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-bold text-blue-800">Active Session Available!</p>
              <p className="text-blue-600 text-sm">{activeSession.subject} — Scan QR to mark attendance</p>
            </div>
          </div>
          <Link href="/dashboard/student/scan" className="btn btn-sm"
            style={{ background: '#2563EB', color: 'white' }}>
            Scan Now <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Overall Stats */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-800">Overall Attendance</h2>
          <span className={`badge ${percentage >= 75 ? 'badge-green' : percentage >= 50 ? 'badge-amber' : 'badge-red'}`}>
            {percentage >= 75 ? 'Good Standing' : percentage >= 50 ? 'Below Average' : 'At Risk'}
          </span>
        </div>
        <div className="flex items-center gap-6">
          {/* Big percentage circle */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#E2E8F0" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={percentage >= 75 ? '#10B981' : percentage >= 50 ? '#F59E0B' : '#EF4444'}
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-extrabold text-slate-800">{percentage}%</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-sm text-slate-600">Present</span>
              </div>
              <span className="font-bold text-slate-800">{present}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-sm text-slate-600">Absent</span>
              </div>
              <span className="font-bold text-slate-800">{absent}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <span className="text-sm text-slate-600">Total</span>
              </div>
              <span className="font-bold text-slate-800">{myAttendance.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject Breakdown */}
        <div className="card p-6">
          <h2 className="font-bold text-slate-800 mb-4">Subject-wise Attendance</h2>
          {subjectSummaries.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-400 text-sm">No attendance recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subjectSummaries.map((s, i) => {
                const pct = s.total > 0 ? Math.round((s.present / s.total) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">{s.subject}</span>
                      <span className="text-sm font-bold" style={{ color: pct >= 75 ? '#059669' : '#D97706' }}>{pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: `${pct}%`,
                        background: pct >= 75 ? 'linear-gradient(90deg, #059669, #10B981)' : 'linear-gradient(90deg, #D97706, #F59E0B)'
                      }}></div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{s.present}/{s.total} classes</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Today's Attendance */}
        <div className="card p-6">
          <h2 className="font-bold text-slate-800 mb-4">Today's Attendance</h2>
          {todayAtt.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-400 text-sm mb-4">No attendance yet today</p>
              {activeSession ? (
                <Link href="/dashboard/student/scan" className="btn btn-primary btn-sm">
                  <QrCode size={14} /> Scan QR Now
                </Link>
              ) : (
                <p className="text-xs text-slate-400">No active sessions at the moment</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {todayAtt.map(rec => (
                <div key={rec.id} className={`flex items-center gap-3 p-3 rounded-xl ${rec.status === 'present' ? 'stat-green' : 'stat-red'}`}>
                  {rec.status === 'present' ? <CheckCircle size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-red-400" />}
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 text-sm">{rec.subject}</div>
                    <div className="text-xs text-slate-500">{rec.time}</div>
                  </div>
                  <span className={`badge ${rec.status === 'present' ? 'badge-green' : 'badge-red'}`}>{rec.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
