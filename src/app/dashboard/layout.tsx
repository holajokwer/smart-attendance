'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  QrCode, LayoutDashboard, Users, BookOpen, ClipboardList, BarChart3,
  Settings, LogOut, Menu, X, Bell, ChevronRight, Shield, GraduationCap, UserCheck
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const NAV_ADMIN = [
  { href: '/dashboard/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/admin/users', icon: Users, label: 'Users' },
  { href: '/dashboard/admin/classes', icon: BookOpen, label: 'Classes' },
  { href: '/dashboard/admin/attendance', icon: ClipboardList, label: 'Attendance' },
  { href: '/dashboard/admin/reports', icon: BarChart3, label: 'Reports' },
];

const NAV_TEACHER = [
  { href: '/dashboard/teacher', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/teacher/classes', icon: BookOpen, label: 'My Classes' },
  { href: '/dashboard/teacher/session', icon: QrCode, label: 'Start Session' },
  { href: '/dashboard/teacher/attendance', icon: ClipboardList, label: 'Attendance' },
  { href: '/dashboard/teacher/reports', icon: BarChart3, label: 'Reports' },
];

const NAV_STUDENT = [
  { href: '/dashboard/student', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/student/scan', icon: QrCode, label: 'Scan QR' },
  { href: '/dashboard/student/attendance', icon: ClipboardList, label: 'My Attendance' },
];

const ROLE_NAV: Record<string, typeof NAV_ADMIN> = {
  admin: NAV_ADMIN,
  teacher: NAV_TEACHER,
  student: NAV_STUDENT,
};

const ROLE_ICON: Record<string, React.ElementType> = {
  admin: Shield,
  teacher: GraduationCap,
  student: UserCheck,
};

const ROLE_COLOR: Record<string, string> = {
  admin: 'badge-purple',
  teacher: 'badge-blue',
  student: 'badge-green',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, loading, dbError } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  // Show full-screen loading while Supabase data loads
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8FAFC' }}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Connecting to Supabase...</p>
          <p className="text-slate-400 text-sm mt-1">Loading your data</p>
        </div>
      </div>
    );
  }

  const navItems = ROLE_NAV[currentUser.role] || [];
  const RoleIcon = ROLE_ICON[currentUser.role] || Shield;
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-200 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ minHeight: '100vh' }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-3">
            <div style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)', borderRadius: '10px', padding: '8px' }}>
              <QrCode className="text-white" size={20} />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Smart Attendance</div>
              <div className="text-xs text-slate-400">Management System</div>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 mt-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', border: '1px solid #C7D2FE' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)' }}>
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 text-sm truncate">{currentUser.name}</div>
              <span className={`badge ${ROLE_COLOR[currentUser.role]}`} style={{ fontSize: '10px' }}>
                <RoleIcon size={10} className="mr-1" />{currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 mt-2 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== `/dashboard/${currentUser.role}` && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className={`nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-indigo-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <Link href="/dashboard/profile" className="nav-link" onClick={() => setSidebarOpen(false)}>
            <Settings size={18} />
            <span>Profile & Settings</span>
          </Link>
          <button onClick={handleLogout} className="nav-link w-full" style={{ color: '#EF4444', textAlign: 'left' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              {/* Breadcrumb */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                <span className="capitalize font-medium text-slate-600">{currentUser.role} Portal</span>
                <ChevronRight size={14} />
                <span className="text-slate-400">
                  {navItems.find(n => n.href === pathname || (n.href !== `/dashboard/${currentUser.role}` && pathname.startsWith(n.href)))?.label || 'Overview'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
                <Bell size={18} className="text-slate-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)' }}>
                  {initials}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">{currentUser.name.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        </header>

        {/* DB Error Banner */}
        {dbError && (
          <div className="mx-4 mt-4 p-3 rounded-xl flex items-center gap-3"
            style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
            <span className="text-amber-500">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Supabase connection issue</p>
              <p className="text-xs text-amber-600">{dbError} — Demo mode active with local data.</p>
            </div>
          </div>
        )}
        {/* Supabase Live Indicator */}
        {!dbError && (
          <div className="hidden lg:flex absolute top-2 right-20 items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-700">Supabase Live</span>
          </div>
        )}
        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
