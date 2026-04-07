'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { QrCode, Play, Square, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Session } from '@/types';
import dynamic from 'next/dynamic';

const QRCodeSVG = dynamic(() => import('qrcode.react').then(m => m.QRCodeSVG), { ssr: false });

export default function SessionPage() {
  const { currentUser, classes, sessions, attendance, addSession, updateSession } = useApp();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState('');
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  const myClasses = classes.filter(c => c.teacherId === currentUser?.id);
  const activeSession = activeSessionId ? sessions.find(s => s.id === activeSessionId) : null;
  const existingActive = sessions.find(s => s.teacherId === currentUser?.id && s.isActive);

  useEffect(() => {
    if (existingActive) {
      setActiveSessionId(existingActive.id);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession?.isActive) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession?.isActive]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStart = async () => {
    if (!selectedClassId) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const cls = myClasses.find(c => c.id === selectedClassId)!;
    const now = new Date();
    const token = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const session: Session = {
      id: `session-${Date.now()}`,
      classId: cls.id,
      className: cls.name,
      subject: cls.subject,
      teacherId: currentUser!.id,
      teacherName: currentUser!.name,
      date: now.toISOString().split('T')[0],
      startTime: now.toTimeString().slice(0, 5),
      isActive: true,
      qrToken: token,
      expiresAt: new Date(now.getTime() + 3600000).toISOString(),
    };
    addSession(session);
    setActiveSessionId(session.id);
    setStartTime(now.toTimeString().slice(0, 5));
    setTimer(0);
    setLoading(false);
  };

  const handleEnd = async () => {
    if (!activeSessionId) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    updateSession(activeSessionId, {
      isActive: false,
      endTime: new Date().toTimeString().slice(0, 5),
      expiresAt: new Date().toISOString(),
    });
    setActiveSessionId(null);
    setTimer(0);
    setLoading(false);
  };

  const sessionAttendance = activeSession ? attendance.filter(a => a.sessionId === activeSession.id) : [];
  const qrValue = activeSession ? JSON.stringify({ token: activeSession.qrToken, sessionId: activeSession.id, subject: activeSession.subject }) : '';
  const selectedClass = myClasses.find(c => c.id === (activeSession?.classId || selectedClassId));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance Session</h1>
        <p className="text-slate-500 text-sm mt-1">Generate a QR code for students to scan and mark attendance</p>
      </div>

      {!activeSession ? (
        /* Start Session Form */
        <div className="card p-8 max-w-lg mx-auto text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', border: '2px solid #C7D2FE' }}>
            <QrCode size={32} className="text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Start New Session</h2>
          <p className="text-slate-500 text-sm mb-6">Select a class and generate a QR code for attendance</p>

          <div className="text-left mb-6">
            <label className="label">Select Class *</label>
            <select className="input" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
              <option value="">Choose a class...</option>
              {myClasses.map(c => (
                <option key={c.id} value={c.id}>{c.subject} — {c.name}</option>
              ))}
            </select>
            {myClasses.length === 0 && (
              <p className="text-xs text-amber-600 mt-2">⚠️ You have no classes. <a href="/dashboard/teacher/classes/create" className="underline">Create one first</a>.</p>
            )}
          </div>

          <button
            onClick={handleStart}
            disabled={!selectedClassId || loading}
            className="btn btn-primary btn-lg w-full"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? (
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>Starting...</div>
            ) : (
              <><Play size={16} /> Start Session & Generate QR</>
            )}
          </button>
        </div>
      ) : (
        /* Active Session Display */
        <div className="space-y-6">
          {/* Session Status Bar */}
          <div className="rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4"
            style={{ background: 'linear-gradient(135deg, #059669, #10B981)', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)' }}>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <div>
                <p className="text-white/80 text-sm">Session Active — {activeSession.subject}</p>
                <p className="text-white font-bold text-xl">⏱ {formatTime(timer)}</p>
              </div>
            </div>
            <button onClick={handleEnd} disabled={loading} className="btn btn-danger">
              {loading ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div> : <><Square size={14} /> End Session</>}
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* QR Display */}
            <div className="card p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-emerald-600">QR Code Active</span>
              </div>
              <p className="text-slate-500 text-sm mb-6">Students, scan this code with your phone</p>

              <div className="inline-block p-5 rounded-2xl mb-4"
                style={{ background: 'white', border: '3px solid #C7D2FE', boxShadow: '0 8px 30px rgba(79, 70, 229, 0.15)' }}>
                {qrValue && <QRCodeSVG value={qrValue} size={220} level="H" includeMargin={false} />}
              </div>

              <div className="mt-4 p-3 rounded-xl"
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <p className="text-xs text-slate-500 mb-1">Session Details</p>
                <p className="font-bold text-slate-800">{activeSession.subject}</p>
                <p className="text-xs text-slate-400">{activeSession.className} · Started {activeSession.startTime}</p>
              </div>
            </div>

            {/* Attendance Live Feed */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800">Live Attendance</h2>
                <span className="badge badge-green">{sessionAttendance.filter(a => a.status === 'present').length} Present</span>
              </div>

              {selectedClass && (
                <div className="mb-4 p-3 rounded-xl stat-indigo">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total Students</span>
                    <span className="font-bold text-slate-800">{selectedClass.studentIds.length}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-600">Marked Present</span>
                    <span className="font-bold text-emerald-700">{sessionAttendance.filter(a => a.status === 'present').length}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-600">Not Yet Marked</span>
                    <span className="font-bold text-amber-600">{selectedClass.studentIds.length - sessionAttendance.length}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {sessionAttendance.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-400 text-sm">Waiting for students to scan...</p>
                  </div>
                ) : sessionAttendance.map(rec => (
                  <div key={rec.id} className="flex items-center gap-3 p-2 rounded-xl"
                    style={{ background: rec.status === 'present' ? '#ECFDF5' : '#FFF1F2' }}>
                    <CheckCircle size={16} className={rec.status === 'present' ? 'text-emerald-500' : 'text-red-400'} />
                    <div className="flex-1">
                      <div className="font-medium text-slate-800 text-sm">{rec.studentName}</div>
                      <div className="text-xs text-slate-400">{rec.enrollmentNo} · {rec.time}</div>
                    </div>
                    <span className={`badge ${rec.status === 'present' ? 'badge-green' : 'badge-red'}`}>{rec.status}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">Students must scan the QR code from the student portal. Each student can only mark attendance once per session.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
