'use client';

import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Search, Download } from 'lucide-react';
import Papa from 'papaparse';

export default function TeacherAttendancePage() {
  const { currentUser, classes, sessions, attendance } = useApp();
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const myClasses = classes.filter(c => c.teacherId === currentUser?.id);
  const mySessions = sessions.filter(s => s.teacherId === currentUser?.id);
  const myAttendance = attendance.filter(a => mySessions.some(s => s.id === a.sessionId));

  const filtered = myAttendance.filter(a => {
    const matchClass = classFilter === 'all' || a.classId === classFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchSearch = a.studentName.toLowerCase().includes(search.toLowerCase()) || a.enrollmentNo.toLowerCase().includes(search.toLowerCase());
    return matchClass && matchStatus && matchSearch;
  });

  const exportCSV = () => {
    const csv = Papa.unparse(filtered.map(r => ({
      'Student Name': r.studentName,
      'Enrollment No': r.enrollmentNo,
      'Subject': r.subject,
      'Date': r.date,
      'Time': r.time,
      'Status': r.status,
    })));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Records</h1>
          <p className="text-slate-500 text-sm mt-1">{myAttendance.length} total records across your sessions</p>
        </div>
        <button onClick={exportCSV} className="btn btn-secondary">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" />
        </div>
        <select className="input sm:w-48" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
          <option value="all">All Classes</option>
          {myClasses.map(c => <option key={c.id} value={c.id}>{c.subject}</option>)}
        </select>
        <select className="input sm:w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>#</th><th>Student</th><th>Enrollment</th><th>Subject</th><th>Date</th><th>Time</th><th>Status</th></tr>
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
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filtered.length} of {myAttendance.length} records</span>
          <span>Present: {filtered.filter(a => a.status === 'present').length} &nbsp;|&nbsp; Absent: {filtered.filter(a => a.status === 'absent').length}</span>
        </div>
      </div>
    </div>
  );
}
