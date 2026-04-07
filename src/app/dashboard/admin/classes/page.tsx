'use client';

import { useApp } from '@/context/AppContext';
import { BookOpen, Users, Activity } from 'lucide-react';

export default function AdminClassesPage() {
  const { classes, sessions, attendance } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All Classes</h1>
        <p className="text-slate-500 text-sm mt-1">View all subject classes across departments</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {classes.map((cls, i) => {
          const classSessions = sessions.filter(s => s.classId === cls.id);
          const classAtt = attendance.filter(a => a.classId === cls.id);
          const presentCount = classAtt.filter(a => a.status === 'present').length;
          const percentage = classAtt.length > 0 ? Math.round((presentCount / classAtt.length) * 100) : 0;
          return (
            <div key={cls.id} className="card p-5 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center stat-indigo flex-shrink-0">
                  <BookOpen size={18} className="text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">{cls.subject}</h3>
                  <p className="text-sm text-slate-500">{cls.name}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Teacher</span>
                  <span className="font-medium text-slate-700">{cls.teacherName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Students</span>
                  <span className="badge badge-blue">{cls.studentIds.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Sessions</span>
                  <span className="badge badge-indigo">{classSessions.length}</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Avg. Attendance</span>
                    <span className="font-bold" style={{ color: percentage >= 75 ? '#059669' : percentage >= 50 ? '#D97706' : '#DC2626' }}>{percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${percentage}%`,
                      background: percentage >= 75 ? 'linear-gradient(90deg, #059669, #10B981)' : percentage >= 50 ? 'linear-gradient(90deg, #D97706, #F59E0B)' : 'linear-gradient(90deg, #DC2626, #EF4444)'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
