'use client';

import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Download, FileText, TrendingUp, Users } from 'lucide-react';
import Papa from 'papaparse';

export default function TeacherReportsPage() {
  const { currentUser, classes, sessions, attendance, users } = useApp();
  const [selectedClass, setSelectedClass] = useState('');

  const myClasses = classes.filter(c => c.teacherId === currentUser?.id);
  const mySessions = sessions.filter(s => s.teacherId === currentUser?.id);
  const myAttendance = attendance.filter(a => mySessions.some(s => s.id === a.sessionId));

  const cls = myClasses.find(c => c.id === selectedClass) || myClasses[0];

  const buildSummary = (classId: string) => {
    const classData = classes.find(c => c.id === classId);
    if (!classData) return [];
    const classSessions = sessions.filter(s => s.classId === classId && s.teacherId === currentUser?.id);
    const totalSessions = classSessions.length;
    return classData.studentIds.map(sid => {
      const student = users.find(u => u.id === sid);
      const studentAtt = attendance.filter(a => a.classId === classId && a.studentId === sid);
      const present = studentAtt.filter(a => a.status === 'present').length;
      const percentage = totalSessions > 0 ? Math.round((present / totalSessions) * 100) : 0;
      return { studentId: sid, studentName: student?.name || 'Unknown', enrollmentNo: student?.enrollmentNo || '', present, absent: totalSessions - present, total: totalSessions, percentage };
    });
  };

  const summary = cls ? buildSummary(cls.id) : [];

  const exportCSV = () => {
    if (!cls) return;
    const data = summary.map(s => ({
      'Enrollment No': s.enrollmentNo,
      'Student Name': s.studentName,
      'Total Sessions': s.total,
      'Present': s.present,
      'Absent': s.absent,
      'Percentage': `${s.percentage}%`,
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cls.subject}-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    if (!cls) return;
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Smart Attendance System - Report', 14, 15);
    doc.setFontSize(11);
    doc.text(`Subject: ${cls.subject}`, 14, 25);
    doc.text(`Class: ${cls.name}`, 14, 32);
    doc.text(`Teacher: ${currentUser?.name}`, 14, 39);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 46);
    autoTable(doc, {
      startY: 55,
      head: [['Enrollment No', 'Student Name', 'Total', 'Present', 'Absent', 'Percentage']],
      body: summary.map(s => [s.enrollmentNo, s.studentName, s.total, s.present, s.absent, `${s.percentage}%`]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] },
    });
    doc.save(`${cls.subject}-report.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Per-student attendance summary with export options</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn btn-secondary btn-sm" disabled={!cls}>
            <Download size={14} /> CSV
          </button>
          <button onClick={exportPDF} className="btn btn-primary btn-sm" disabled={!cls}>
            <FileText size={14} /> PDF
          </button>
        </div>
      </div>

      {/* Class Selector */}
      <div className="card p-4">
        <label className="label">Select Class for Report</label>
        <select className="input max-w-sm" value={selectedClass || cls?.id || ''} onChange={e => setSelectedClass(e.target.value)}>
          {myClasses.map(c => <option key={c.id} value={c.id}>{c.subject} — {c.name}</option>)}
        </select>
      </div>

      {cls ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', value: summary.length, color: 'stat-blue' },
              { label: 'Total Sessions', value: sessions.filter(s => s.classId === cls.id).length, color: 'stat-indigo' },
              { label: 'Avg Attendance', value: `${summary.length > 0 ? Math.round(summary.reduce((a, s) => a + s.percentage, 0) / summary.length) : 0}%`, color: 'stat-green' },
              { label: 'Below 75%', value: summary.filter(s => s.percentage < 75).length, color: 'stat-red' },
            ].map((s, i) => (
              <div key={i} className={`${s.color} rounded-xl p-4`}>
                <div className="text-2xl font-extrabold text-slate-800">{s.value}</div>
                <div className="text-sm text-slate-600 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Student Summary Table */}
          <div className="card">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">{cls.subject} — Student Report</h2>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Enrollment No</th><th>Student Name</th><th>Total</th><th>Present</th><th>Absent</th><th>Percentage</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {summary.map(s => (
                    <tr key={s.studentId}>
                      <td className="font-mono text-sm text-slate-500">{s.enrollmentNo}</td>
                      <td className="font-medium text-slate-800">{s.studentName}</td>
                      <td>{s.total}</td>
                      <td className="text-emerald-700 font-semibold">{s.present}</td>
                      <td className="text-red-600 font-semibold">{s.absent}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="progress-bar flex-1" style={{ minWidth: '80px' }}>
                            <div className="progress-fill" style={{
                              width: `${s.percentage}%`,
                              background: s.percentage >= 75 ? 'linear-gradient(90deg, #059669, #10B981)' : 'linear-gradient(90deg, #DC2626, #EF4444)'
                            }}></div>
                          </div>
                          <span className="font-bold text-sm" style={{ color: s.percentage >= 75 ? '#059669' : '#DC2626', minWidth: '36px' }}>{s.percentage}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${s.percentage >= 75 ? 'badge-green' : 'badge-red'}`}>
                          {s.percentage >= 75 ? 'Good' : 'At Risk'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card p-16 text-center">
          <TrendingUp size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-400">No classes found. Create a class first to generate reports.</p>
        </div>
      )}
    </div>
  );
}
