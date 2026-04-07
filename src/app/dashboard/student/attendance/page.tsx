'use client';

import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export default function StudentAttendancePage() {
  const { currentUser, attendance, classes } = useApp();
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const myAttendance = attendance.filter(a => a.studentId === currentUser?.id);
  const mySubjects = [...new Set(myAttendance.map(a => ({ id: a.classId, subject: a.subject })))];

  const filtered = myAttendance.filter(a => {
    const matchClass = classFilter === 'all' || a.classId === classFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchSearch = a.subject.toLowerCase().includes(search.toLowerCase());
    return matchClass && matchStatus && matchSearch;
  });

  const present = filtered.filter(a => a.status === 'present').length;
  const absent = filtered.filter(a => a.status === 'absent').length;
  const percentage = filtered.length > 0 ? Math.round((present / filtered.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Attendance</h1>
        <p className="text-slate-500 text-sm mt-1">Track all your attendance records across subjects</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-green rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-slate-800">{present}</div>
          <div className="text-sm text-slate-600">Present</div>
        </div>
        <div className="stat-red rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-slate-800">{absent}</div>
          <div className="text-sm text-slate-600">Absent</div>
        </div>
        <div className={`${percentage >= 75 ? 'stat-green' : 'stat-amber'} rounded-xl p-4 text-center`}>
          <div className="text-2xl font-extrabold text-slate-800">{percentage}%</div>
          <div className="text-sm text-slate-600">Attendance</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search subject..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" />
        </div>
        <select className="input sm:w-44" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
          <option value="all">All Subjects</option>
          {[...new Map(myAttendance.map(a => [a.classId, a])).values()].map(a => (
            <option key={a.classId} value={a.classId}>{a.subject}</option>
          ))}
        </select>
        <select className="input sm:w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>#</th><th>Subject</th><th>Date</th><th>Time</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400">No records found</td></tr>
              ) : [...filtered].reverse().map((rec, i) => (
                <tr key={rec.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-medium text-slate-800">{rec.subject}</td>
                  <td className="text-slate-500">{rec.date}</td>
                  <td className="text-slate-500">{rec.time}</td>
                  <td><span className={`badge ${rec.status === 'present' ? 'badge-green' : 'badge-red'}`}>{rec.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          {filtered.length} records · {present} present · {absent} absent
        </div>
      </div>
    </div>
  );
}
