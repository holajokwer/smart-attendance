'use client';

import { useApp } from '@/context/AppContext';
import { BookOpen, Users, QrCode, ClipboardList, Plus, ArrowRight, Activity, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function TeacherDashboard() {
  const { currentUser, classes, sessions, attendance } = useApp();

  const myClasses = classes.filter(c => c.teacherId === currentUser?.id);
  const mySessions = sessions.filter(s => s.teacherId === currentUser?.id);
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = mySessions.filter(s => s.date === today);
  const activeSession = mySessions.find(s => s.isActive);
  const myAttendance = attendance.filter(a => mySessions.some(s => s.id === a.sessionId));

  const totalStudents = myClasses.reduce((acc, c) => acc + c.studentIds.length, 0);
  const presentToday = myAttendance.filter(a => a.date === today && a.status === 'present').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {currentUser?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <Link href="/dashboard/teacher/session" className="btn btn-primary animate-pulse-ring">
          <QrCode size={16} /> Start Session
        </Link>
      </div>

      {/* Active Session Banner */}
      {activeSession && (
        <div className="rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4"
          style={{ background: 'linear-gradient(135deg, #059669, #10B981)', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">Active Session</p>
              <p className="text-white font-bold text-lg">{activeSession.subject}</p>
              <p className="text-white/70 text-sm">Started at {activeSession.startTime}</p>
            </div>
          </div>
          <Link href={`/dashboard/teacher/session/${activeSession.id}`} className="btn"
            style={{ background: 'white', color: '#059669', fontWeight: 700 }}>
            View Session <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Classes', value: myClasses.length, icon: BookOpen, color: 'stat-indigo' },
          { label: 'Total Students', value: totalStudents, icon: Users, color: 'stat-blue' },
          { label: "Today's Sessions", value: todaySessions.length, icon: Activity, color: 'stat-amber' },
          { label: 'Present Today', value: presentToday, icon: CheckCircle, color: 'stat-green' },
        ].map((s, i) => (
          <div key={i} className={`${s.color} rounded-2xl p-5 animate-fade-in`} style={{ animationDelay: `${i * 60}ms` }}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3">
              <s.icon size={18} className="text-indigo-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-800 mb-1">{s.value}</div>
            <div className="text-sm font-medium text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Classes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800">My Classes</h2>
            <Link href="/dashboard/teacher/classes" className="text-xs font-semibold text-indigo-600 hover:underline">View All</Link>
          </div>
          {myClasses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-400 text-sm">No classes yet</p>
              <Link href="/dashboard/teacher/classes/create" className="btn btn-primary btn-sm mt-3">
                <Plus size={14} /> Create Class
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myClasses.map(cls => {
                const classSessions = mySessions.filter(s => s.classId === cls.id);
                return (
                  <div key={cls.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl stat-indigo flex items-center justify-center flex-shrink-0">
                      <BookOpen size={16} className="text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 text-sm">{cls.subject}</div>
                      <div className="text-xs text-slate-400">{cls.studentIds.length} students · {classSessions.length} sessions</div>
                    </div>
                    <Link href="/dashboard/teacher/session" className="btn btn-secondary btn-sm">
                      <QrCode size={12} /> Start
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800">Recent Sessions</h2>
            <Link href="/dashboard/teacher/attendance" className="text-xs font-semibold text-indigo-600 hover:underline">View All</Link>
          </div>
          {mySessions.length === 0 ? (
            <div className="text-center py-8">
              <QrCode size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-400 text-sm">No sessions started yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...mySessions].reverse().slice(0, 4).map(session => {
                const sessionAtt = myAttendance.filter(a => a.sessionId === session.id);
                const present = sessionAtt.filter(a => a.status === 'present').length;
                return (
                  <div key={session.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${session.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 text-sm">{session.subject}</div>
                      <div className="text-xs text-slate-400">{session.date} · {session.startTime}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-700">{present}/{sessionAtt.length}</div>
                      <div className="text-xs text-slate-400">present</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/dashboard/teacher/session', label: 'Start Session', icon: QrCode, color: '#4F46E5', bg: '#EEF2FF' },
            { href: '/dashboard/teacher/classes/create', label: 'Create Class', icon: Plus, color: '#059669', bg: '#ECFDF5' },
            { href: '/dashboard/teacher/attendance', label: 'View Attendance', icon: ClipboardList, color: '#D97706', bg: '#FFFBEB' },
            { href: '/dashboard/teacher/reports', label: 'Reports', icon: Activity, color: '#DC2626', bg: '#FFF1F2' },
          ].map((action, i) => (
            <Link key={i} href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl text-center hover:opacity-80 transition-all"
              style={{ background: action.bg, border: `1px solid ${action.bg}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <action.icon size={18} style={{ color: action.color }} />
              </div>
              <span className="text-sm font-semibold text-slate-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
