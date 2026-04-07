'use client';

import Link from 'next/link';
import { QrCode, Users, BarChart3, Shield, Clock, CheckCircle, ArrowRight, Zap, Globe, Lock } from 'lucide-react';

const features = [
  { icon: QrCode, title: 'QR-Based Attendance', desc: 'Generate unique QR codes per session. Students scan with their phone camera.', color: 'stat-indigo' },
  { icon: Shield, title: 'Anti-Duplication', desc: 'Smart checks prevent duplicate attendance marking for each session.', color: 'stat-green' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Instant attendance insights, percentages, and visual reports.', color: 'stat-amber' },
  { icon: Users, title: 'Role-Based Access', desc: 'Separate portals for Admin, Teacher, and Student with proper permissions.', color: 'stat-purple' },
  { icon: Clock, title: 'Session Management', desc: 'Start and end attendance sessions with time-bound QR codes.', color: 'stat-blue' },
  { icon: Globe, title: 'Export Reports', desc: 'Download attendance as CSV or PDF for records and governance.', color: 'stat-red' },
];

const steps = [
  { no: '01', title: 'Teacher creates a session', desc: 'Start an attendance session for the class and a unique QR code is generated instantly.' },
  { no: '02', title: 'Students scan the QR', desc: 'Students open the app on their phones and scan the displayed QR code in seconds.' },
  { no: '03', title: 'Attendance is recorded', desc: 'The system marks attendance, prevents duplicates, and updates records in real-time.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 50%, #F8FAFC 100%)' }}>
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)', borderRadius: '12px', padding: '8px' }}>
              <QrCode className="text-white" size={22} />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900">Smart Attendance</span>
              <span className="text-xs text-slate-400 block -mt-0.5">System</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-secondary btn-sm">Sign In</Link>
            <Link href="/login" className="btn btn-primary btn-sm">Get Started <ArrowRight size={14} /></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-12 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in"
          style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
          <Zap size={14} className="text-indigo-500" />
          <span className="text-sm font-semibold text-indigo-700">BCA Final Year Project · Demo Ready</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6 animate-fade-in delay-100">
          Smarter Attendance.<br />
          <span className="gradient-text">Zero Paperwork.</span>
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 animate-fade-in delay-200">
          The modern QR-based attendance system for colleges. Generate a QR code, students scan it, attendance is done — instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-300 w-full sm:w-auto">
          <Link href="/login" className="btn btn-primary btn-lg w-full sm:w-auto" style={{ justifyContent: 'center' }}>
            Start Demo <ArrowRight size={18} />
          </Link>
          <a href="#how-it-works" className="btn btn-secondary btn-lg w-full sm:w-auto" style={{ justifyContent: 'center' }}>
            See How It Works
          </a>
        </div>

        {/* Hero Visual */}
        <div className="mt-12 sm:mt-16 animate-fade-in delay-400 relative overflow-hidden">
          <div className="absolute inset-0 blur-3xl opacity-20 rounded-3xl"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)' }}></div>
          <div className="relative card p-4 sm:p-6 max-w-4xl mx-auto overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(79, 70, 229, 0.15)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Teacher Panel */}
              <div className="stat-indigo rounded-xl p-5 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Users size={14} className="text-white" />
                  </div>
                  <span className="font-semibold text-sm text-slate-700">Teacher Dashboard</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Active Session</span>
                    <span className="badge badge-green">Live</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Students Present</span>
                    <span className="font-bold text-slate-800">42/48</span>
                  </div>
                </div>
              </div>

              {/* QR Panel */}
              <div className="bg-white rounded-xl p-5 text-center border border-slate-200">
                <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Scan QR Code</p>
                <div className="w-24 h-24 mx-auto rounded-xl border-4 border-indigo-500 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)' }}>
                  <QrCode size={48} className="text-indigo-600" />
                </div>
                <p className="text-xs text-slate-400 mt-3">Expires in 45:00</p>
              </div>

              {/* Student Panel */}
              <div className="stat-green rounded-xl p-5 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                  <span className="font-semibold text-sm text-slate-700">Student View</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Attendance</span>
                    <span className="font-bold text-emerald-700">87%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '87%', background: 'linear-gradient(90deg, #059669, #10B981)' }}></div>
                  </div>
                  <p className="text-xs text-emerald-600 font-medium mt-1">✓ Attendance Marked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y border-slate-200" style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: '3', label: 'User Roles' },
              { val: '100%', label: 'Browser-based' },
              { val: 'QR', label: 'Instant Scanning' },
              { val: 'Live', label: 'Real-time Records' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-extrabold gradient-text mb-1">{stat.val}</div>
                <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-6xl mx-auto px-6" id="features">
        <div className="text-center mb-12">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Features</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">Everything you need</h2>
          <p className="text-slate-500 mt-2">Built for modern classrooms and presentations</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className={`${f.color} rounded-2xl p-6 animate-fade-in`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <f.icon size={20} className="text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" id="how-it-works" style={{ background: 'white' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Workflow</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">How It Works</h2>
          </div>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-indigo-600"
                  style={{ background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', border: '2px solid #C7D2FE' }}>
                  {s.no}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{s.title}</h3>
                  <p className="text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Access Levels</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">Three Roles, One System</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { role: 'Admin', icon: Lock, color: 'stat-purple', desc: 'Full visibility of all users, classes, attendance records and system analytics.', features: ['Manage all users', 'View all classes', 'System-wide reports', 'Export any data'] },
            { role: 'Teacher', icon: Users, color: 'stat-indigo', desc: 'Create classes, start attendance sessions, generate QR codes and view class reports.', features: ['Create & manage classes', 'Start QR sessions', 'View class attendance', 'Export class reports'] },
            { role: 'Student', icon: CheckCircle, color: 'stat-green', desc: 'Scan QR codes to mark attendance and track personal attendance history and percentage.', features: ['Scan QR to attend', 'View own attendance', 'Attendance percentage', 'Attendance history'] },
          ].map((r, i) => (
            <div key={i} className={`${r.color} rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <r.icon size={20} className="text-indigo-600" />
                </div>
                <span className="font-bold text-lg text-slate-800">{r.role}</span>
              </div>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{r.desc}</p>
              <ul className="space-y-2">
                {r.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-indigo-500 flex-shrink-0" />
                    <span className="text-slate-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20"
        style={{ background: 'linear-gradient(135deg, #3730A3, #4F46E5, #6366F1)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to see it in action?</h2>
          <p className="text-indigo-200 text-lg mb-8">Login with any demo account to explore the full system.</p>
          <Link href="/login" className="btn btn-lg"
            style={{ background: 'white', color: '#4F46E5', fontWeight: 700 }}>
            Open Demo <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)', borderRadius: '8px', padding: '5px' }}>
              <QrCode className="text-white" size={16} />
            </div>
            <span className="font-bold text-slate-800">Smart Attendance System</span>
          </div>
          <p className="text-slate-400 text-sm">BCA Final Year Project · Built with Next.js · Demo Mode</p>
        </div>
      </footer>
    </div>
  );
}
