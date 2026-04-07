'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { BookOpen, ArrowLeft, Plus, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Class } from '@/types';

const SUBJECTS = ['Web Technologies', 'Database Management', 'Software Engineering', 'Data Structures', 'Computer Networks', 'Operating Systems', 'Python Programming', 'Java Programming', 'Cloud Computing', 'Artificial Intelligence'];
const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
const DEPARTMENTS = ['Computer Applications', 'Computer Science', 'Information Technology', 'Electronics'];

export default function CreateClassPage() {
  const { currentUser, users, addClass } = useApp();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    subject: '',
    department: currentUser?.department || '',
    semester: '',
  });
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const students = users.filter(u => u.role === 'student');

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const selectAll = () => setSelectedStudents(students.map(s => s.id));
  const clearAll = () => setSelectedStudents([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.semester || selectedStudents.length === 0) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const newClass: Class = {
      id: `class-${Date.now()}`,
      name: form.name || `${form.department} - ${form.semester} Semester`,
      subject: form.subject,
      teacherId: currentUser!.id,
      teacherName: currentUser!.name,
      department: form.department,
      semester: form.semester,
      studentIds: selectedStudents,
      createdAt: new Date().toISOString(),
    };
    addClass(newClass);
    setSuccess(true);
    setTimeout(() => router.push('/dashboard/teacher/classes'), 1500);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: '2px solid #6EE7B7' }}>
          <CheckCircle size={32} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Class Created!</h2>
        <p className="text-slate-500">Redirecting to your classes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/teacher/classes" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <ArrowLeft size={18} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Class</h1>
          <p className="text-slate-500 text-sm">Add a class to start managing attendance</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Class Details Card */}
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-slate-700 flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-500" /> Class Details
          </h2>

          <div>
            <label className="label">Subject *</label>
            <select className="input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
              <option value="">Select a subject</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Semester *</label>
              <select className="input" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} required>
                <option value="">Select semester</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s} Semester</option>)}
              </select>
            </div>
            <div>
              <label className="label">Department</label>
              <select className="input" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Class Name (optional)</label>
            <input type="text" className="input" placeholder="e.g. BCA - 6th Semester A" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <p className="text-xs text-slate-400 mt-1">Leave blank to auto-generate from department & semester</p>
          </div>
        </div>

        {/* Student Selection */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-700">
              Add Students <span className="badge badge-indigo ml-2">{selectedStudents.length} selected</span>
            </h2>
            <div className="flex gap-2">
              <button type="button" onClick={selectAll} className="btn btn-secondary btn-sm">Select All</button>
              <button type="button" onClick={clearAll} className="btn btn-secondary btn-sm">Clear</button>
            </div>
          </div>
          <div className="space-y-2">
            {students.map(student => (
              <label key={student.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                  className="w-4 h-4 rounded accent-indigo-600"
                />
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)' }}>
                  {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-800 text-sm">{student.name}</div>
                  <div className="text-xs text-slate-400">{student.enrollmentNo}</div>
                </div>
              </label>
            ))}
          </div>
          {selectedStudents.length === 0 && (
            <p className="text-xs text-red-500 mt-2">Please select at least one student</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !form.subject || !form.semester || selectedStudents.length === 0}
          className="btn btn-primary btn-lg w-full"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              Creating Class...
            </div>
          ) : (
            <><Plus size={16} /> Create Class</>
          )}
        </button>
      </form>
    </div>
  );
}
