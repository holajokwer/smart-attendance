'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { QrCode, CheckCircle, XCircle, Camera, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AttendanceRecord } from '@/types';

type ScanState = 'idle' | 'scanning' | 'success' | 'error' | 'duplicate';

export default function ScanPage() {
  const { currentUser, sessions, attendance, markAttendance, hasMarkedAttendance } = useApp();
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [message, setMessage] = useState('');
  const [scannedSession, setScannedSession] = useState<string>('');
  const scannerRef = useRef<any>(null);
  const containerId = 'qr-scanner-container';

  const startScanner = async () => {
    setScanState('scanning');
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          handleScan(decodedText);
          scanner.stop().catch(() => {});
          scannerRef.current = null;
        },
        () => {}
      );
    } catch (err: any) {
      setScanState('error');
      setMessage('Camera access denied or not available. Please allow camera permissions.');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
      scannerRef.current = null;
    }
    setScanState('idle');
  };

  useEffect(() => {
    return () => { if (scannerRef.current) { scannerRef.current.stop().catch(() => {}); } };
  }, []);

  const handleScan = (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);
      const session = sessions.find(s => s.qrToken === data.token && s.id === data.sessionId);

      if (!session) {
        setScanState('error');
        setMessage('Invalid or expired QR code. Please ask your teacher to show a valid QR.');
        return;
      }

      if (!session.isActive) {
        setScanState('error');
        setMessage('This session has already ended. You cannot mark attendance now.');
        return;
      }

      if (hasMarkedAttendance(session.id, currentUser!.id)) {
        setScanState('duplicate');
        setMessage(`Your attendance for "${session.subject}" was already marked for this session.`);
        return;
      }

      const record: AttendanceRecord = {
        id: `att-${Date.now()}`,
        sessionId: session.id,
        classId: session.classId,
        className: session.className,
        subject: session.subject,
        studentId: currentUser!.id,
        studentName: currentUser!.name,
        enrollmentNo: currentUser!.enrollmentNo || '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        status: 'present',
      };
      markAttendance(record);
      setScannedSession(session.subject);
      setScanState('success');
      setMessage(`Attendance marked successfully for ${session.subject}!`);
    } catch {
      setScanState('error');
      setMessage('Invalid QR code format. Please scan a valid Smart Attendance QR code.');
    }
  };

  // Demo manual scan for testing without camera
  const demoScan = () => {
    const activeSession = sessions.find(s => s.isActive);
    if (!activeSession) {
      setScanState('error');
      setMessage('No active session found. Ask your teacher to start a session first.');
      return;
    }
    const fakeQR = JSON.stringify({ token: activeSession.qrToken, sessionId: activeSession.id });
    handleScan(fakeQR);
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/student" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <ArrowLeft size={18} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Scan QR Code</h1>
          <p className="text-slate-500 text-sm">Point your camera at the teacher's QR code</p>
        </div>
      </div>

      {scanState === 'idle' && (
        <div className="card p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', border: '2px solid #C7D2FE' }}>
            <QrCode size={36} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Ready to Scan</h2>
            <p className="text-slate-500 text-sm">Click below to open your camera and scan the QR code displayed by your teacher.</p>
          </div>
          <button onClick={startScanner} className="btn btn-primary btn-lg w-full" style={{ width: '100%', justifyContent: 'center' }}>
            <Camera size={18} /> Open Camera & Scan
          </button>
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-400 mb-3">Testing without camera? Use demo mode:</p>
            <button onClick={demoScan} className="btn btn-secondary btn-sm w-full" style={{ width: '100%', justifyContent: 'center' }}>
              🎮 Demo Scan (Simulate)
            </button>
          </div>
        </div>
      )}

      {scanState === 'scanning' && (
        <div className="card overflow-hidden">
          <div id={containerId} className="w-full"></div>
          <div className="p-4 text-center">
            <p className="text-slate-600 text-sm mb-3">Scanning... Point at the QR code</p>
            <button onClick={stopScanner} className="btn btn-secondary btn-sm">Cancel</button>
          </div>
        </div>
      )}

      {scanState === 'success' && (
        <div className="card p-8 text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: '2px solid #6EE7B7' }}>
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-emerald-700 mb-1">Attendance Marked! ✓</h2>
            <p className="text-slate-600 text-sm">{message}</p>
          </div>
          <div className="p-4 rounded-xl stat-green">
            <p className="font-bold text-slate-800">Subject: {scannedSession}</p>
            <p className="text-sm text-slate-600 mt-1">
              {new Date().toLocaleDateString()} at {new Date().toTimeString().slice(0, 5)}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setScanState('idle')} className="btn btn-secondary flex-1">Scan Another</button>
            <Link href="/dashboard/student" className="btn btn-primary flex-1">Dashboard</Link>
          </div>
        </div>
      )}

      {scanState === 'error' && (
        <div className="card p-8 text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
            style={{ background: '#FFF1F2', border: '2px solid #FECDD3' }}>
            <XCircle size={32} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-1">Scan Failed</h2>
            <p className="text-slate-600 text-sm">{message}</p>
          </div>
          <button onClick={() => setScanState('idle')} className="btn btn-primary w-full" style={{ width: '100%', justifyContent: 'center' }}>
            Try Again
          </button>
        </div>
      )}

      {scanState === 'duplicate' && (
        <div className="card p-8 text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
            style={{ background: '#FFFBEB', border: '2px solid #FDE68A' }}>
            <AlertCircle size={32} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-700 mb-1">Already Marked</h2>
            <p className="text-slate-600 text-sm">{message}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setScanState('idle')} className="btn btn-secondary flex-1">Scan Another</button>
            <Link href="/dashboard/student/attendance" className="btn btn-primary flex-1">My Attendance</Link>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4 p-4 rounded-xl" style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
        <p className="text-xs font-semibold text-indigo-700 mb-2">📱 Tips for a successful scan</p>
        <ul className="text-xs text-indigo-600 space-y-1">
          <li>• Hold your phone steady while scanning</li>
          <li>• Ensure good lighting in the room</li>
          <li>• Keep the camera 20-30cm from the QR code</li>
          <li>• Each session can only be marked once</li>
        </ul>
      </div>
    </div>
  );
}
