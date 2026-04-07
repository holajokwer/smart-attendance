'use client';

import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Download, FileText, TrendingUp } from 'lucide-react';
import Papa from 'papaparse';

export default function AdminReportsPage() {
  const { users, classes, sessions, attendance } = useApp();
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');

  const cls = classes.find(c => c.id === selectedClass);
  const buildSummary = (classId: string) => {
    const classData = classes.find(c => c.id === classId);
    if (!classData) return [];
    const classSessions = sessions.filter(s => s.classId === classId);
    const totalSessions = classSessions.length;
    return classData.studentIds.map(sid => {
      const student = users.find(u => u.id === sid);
      const studentAtt = attendance.filter(a => a.classId === classId && a.studentId === sid);
      const present = studentAtt.filter(a => a.status === 'present').length;
      const percentage = totalSessions > 0 ? Math.round((present / totalSessions) * 100) : 0;
      return { studentName: student?.name || '—', enrollmentNo: student?.enrollmentNo || '—', present, absent: totalSessions - present, total: totalSessions, percentage };
    });
  };

  const summary = cls ? buildSummary(cls.id) : [];

  const exportCSV = () => {
    if (!cls) return;
    const csv = Papa.unparse(summary.map(s => ({ 'Enrollment': s.enrollmentNo, 'Name': s.studentName, 'Present': s.present, 'Absent': s.absent, 'Percentage': `${s.percentage}%` })));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `admin-report-${cls.subject}.csv`;
    a.click();
  };

  const exportPDF = async () => {
    if (!cls) return;
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Smart Attendance System — Admin Report', 14, 15);
    doc.setFontSize(11);
    doc.text(`Subject: ${cls.subject}    Class: ${cls.name}`, 14, 25);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);
    autoTable(doc, {
      startY: 42,
      head: [['Enrollment', 'Student', 'Present', 'Absent', 'Percentage']],
      body: summary.map(s => [s.enrollmentNo, s.studentName, s.present, s.absent, `${s.percentage}%`]),
      headStyles: { fillColor: [79, 70, 229] },
    });
    doc.save(`admin-${cls.subject}-report.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Reports</h1>
          <p className="text-slate-500 text-sm mt-1">System-wide attendance analytics and exports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn btn-secondary btn-sm"><Download size={14} /> CSV</button>
          <button onClick={exportPDF} className="btn btn-primary btn-sm"><FileText size={14} /> PDF</button>
        </div>
      </div>

      <div className="card p-4">
        <label className="label">Select Class</label>
        <select className="input max-w-sm" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          {classes.map(c => <option key={c.id} value={c.id}>{c.subject} — {c.name}</option>)}
        </select>
      </div>

      {cls && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', value: summary.length, color: 'stat-blue' },
              { label: 'Total Sessions', value: sessions.filter(s => s.classId === cls.id).length, color: 'stat-indigo' },
              { label: 'Overall Avg', value: `${summary.length > 0 ? Math.round(summary.reduce((a, s) => a + s.percentage, 0) / summary.length) : 0}%`, color: 'stat-green' },
              { label: 'Below 75%', value: summary.filter(s => s.percentage < 75).length, color: 'stat-red' },
            ].map((s, i) => (
              <div key={i} className={`${s.color} rounded-xl p-4`}>
                <div className="text-2xl font-extrabold text-slate-800">{s.value}</div>
                <div className="text-sm text-slate-600">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">{cls.subject} — Report</h2>
            </div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Enrollment</th><th>Name</th><th>Total</th><th>Present</th><th>Absent</th><th>%</th><th>Status</th></tr></thead>
                <tbody>
                  {summary.map((s, i) => (
                    <tr key={i}>
                      <td className="font-mono text-sm text-slate-500">{s.enrollmentNo}</td>
                      <td className="font-medium text-slate-800">{s.studentName}</td>
                      <td>{s.total}</td>
                      <td className="text-emerald-700 font-semibold">{s.present}</td>
                      <td className="text-red-600 font-semibold">{s.absent}</td>
                      <td className="font-bold" style={{ color: s.percentage >= 75 ? '#059669' : '#DC2626' }}>{s.percentage}%</td>
                      <td><span className={`badge ${s.percentage >= 75 ? 'badge-green' : 'badge-red'}`}>{s.percentage >= 75 ? 'Good' : 'At Risk'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
