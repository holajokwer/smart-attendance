'use client';

import { useApp } from '@/context/AppContext';
import { BookOpen, Plus, QrCode, Users, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function TeacherClasses() {
  const { currentUser, classes, sessions, attendance } = useApp();
  const myClasses = classes.filter(c => c.teacherId === currentUser?.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Classes</h1>
          <p className="text-slate-500 text-sm mt-1">{myClasses.length} classes managed</p>
        </div>
        <Link href="/dashboard/teacher/classes/create" className="btn btn-primary">
          <Plus size={16} /> Create Class
        </Link>
      </div>

      {myClasses.length === 0 ? (
        <div className="card p-16 text-center">
          <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="font-bold text-slate-600 text-lg mb-2">No Classes Yet</h3>
          <p className="text-slate-400 text-sm mb-6">Create your first class to start managing attendance</p>
          <Link href="/dashboard/teacher/classes/create" className="btn btn-primary">
            <Plus size={16} /> Create First Class
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {myClasses.map((cls, i) => {
            const classSessions = sessions.filter(s => s.classId === cls.id);
            const classAtt = attendance.filter(a => a.classId === cls.id);
            const presentCount = classAtt.filter(a => a.status === 'present').length;
            const percentage = classAtt.length > 0 ? Math.round((presentCount / classAtt.length) * 100) : 0;
            return (
              <div key={cls.id} className="card p-5 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl stat-indigo flex items-center justify-center flex-shrink-0">
                    <BookOpen size={18} className="text-indigo-600" />
                  </div>
                  <span className="badge badge-indigo">{cls.semester} Sem</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{cls.subject}</h3>
                <p className="text-sm text-slate-500 mb-4">{cls.name}</p>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Students</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1"><Users size={12} />{cls.studentIds.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sessions</span>
                    <span className="font-semibold text-slate-700">{classSessions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Attendance</span>
                    <span className="font-bold" style={{ color: percentage >= 75 ? '#059669' : '#D97706' }}>{percentage}%</span>
                  </div>
                </div>
                <div className="progress-bar mb-4">
                  <div className="progress-fill" style={{
                    width: `${percentage}%`,
                    background: percentage >= 75 ? 'linear-gradient(90deg, #059669, #10B981)' : 'linear-gradient(90deg, #D97706, #F59E0B)'
                  }}></div>
                </div>
                <Link href="/dashboard/teacher/session"
                  className="btn btn-primary w-full"
                  style={{ width: '100%', justifyContent: 'center' }}>
                  <QrCode size={14} /> Start Session
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
