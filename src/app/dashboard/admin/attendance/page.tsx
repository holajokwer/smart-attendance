'use client';

import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export default function AdminAttendancePage() {
  const { attendance, sessions, classes } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');

  const filtered = attendance.filter(a => {
    const matchSearch = a.studentName.toLowerCase().includes(search.toLowerCase()) || a.enrollmentNo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchClass = classFilter === 'all' || a.classId === classFilter;
    return matchSearch && matchStatus && matchClass;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All Attendance Records</h1>
        <p className="text-slate-500 text-sm mt-1">{attendance.length} total records across all sessions</p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by student name or enrollment no..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" />
        </div>
        <select className="input sm:w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
        <select className="input sm:w-52" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
          <option value="all">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.subject}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>#</th><th>Student</th><th>Enrollment No.</th><th>Subject</th><th>Date</th><th>Time</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-slate-400">No records found</td></tr>
              ) : filtered.map((rec, i) => (
                <tr key={rec.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-medium text-slate-800">{rec.studentName}</td>
                  <td className="text-slate-500 font-mono text-sm">{rec.enrollmentNo}</td>
                  <td className="text-slate-500">{rec.subject}</td>
                  <td className="text-slate-500">{rec.date}</td>
                  <td className="text-slate-500">{rec.time}</td>
                  <td><span className={`badge ${rec.status === 'present' ? 'badge-green' : 'badge-red'}`}>{rec.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {attendance.length} records
        </div>
      </div>
    </div>
  );
}
