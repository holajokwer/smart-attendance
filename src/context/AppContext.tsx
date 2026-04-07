'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Class, Session, AttendanceRecord } from '@/types';
import { fetchAllData, seedDemoData, dbAddClass, dbAddSession, dbUpdateSession, dbMarkAttendance } from '@/lib/db';
import { DEMO_USERS, DEMO_CLASSES, DEMO_SESSIONS, DEMO_ATTENDANCE } from '@/lib/demoData';

interface AppState {
  currentUser: User | null;
  users: User[];
  classes: Class[];
  sessions: Session[];
  attendance: AttendanceRecord[];
  loading: boolean;
  dbError: string | null;
}

interface AppActions {
  login: (userId: string) => void;
  logout: () => void;
  addClass: (cls: Class) => Promise<void>;
  addSession: (session: Session) => Promise<void>;
  updateSession: (sessionId: string, updates: Partial<Session>) => Promise<void>;
  markAttendance: (record: AttendanceRecord) => Promise<void>;
  hasMarkedAttendance: (sessionId: string, studentId: string) => boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<(AppState & AppActions) | null>(null);
const USER_KEY = 'smartattend_user';

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Restore logged-in user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) {
        try { setCurrentUser(JSON.parse(saved)); } catch {}
      }
    }
  }, []);

  // Load all data from Supabase on mount
  const refreshData = useCallback(async () => {
    setLoading(true);
    setDbError(null);
    try {
      // Try to seed and load from Supabase
      await seedDemoData();
      const data = await fetchAllData();
      setUsers(data.users.length > 0 ? data.users : DEMO_USERS);
      setClasses(data.classes);
      setSessions(data.sessions);
      setAttendance(data.attendance);
    } catch (err: any) {
      if (err?.message === 'TABLES_NOT_FOUND') {
        // Tables don't exist yet — fall back to full demo data
        console.warn('Supabase tables not found. Running in demo mode.');
        setDbError('Database tables not set up yet. Visit /setup for instructions. Running with local demo data.');
        setUsers(DEMO_USERS);
        // Load from localStorage as fallback
        if (typeof window !== 'undefined') {
          try {
            const savedClasses = localStorage.getItem('sas_classes');
            const savedSessions = localStorage.getItem('sas_sessions');
            const savedAttendance = localStorage.getItem('sas_attendance');
            setClasses(savedClasses ? JSON.parse(savedClasses) : DEMO_CLASSES);
            setSessions(savedSessions ? JSON.parse(savedSessions) : DEMO_SESSIONS);
            setAttendance(savedAttendance ? JSON.parse(savedAttendance) : DEMO_ATTENDANCE);
          } catch {
            setClasses(DEMO_CLASSES);
            setSessions(DEMO_SESSIONS);
            setAttendance(DEMO_ATTENDANCE);
          }
        }
      } else {
        console.error('Supabase error:', err);
        setDbError('Could not connect to Supabase. Running with demo data.');
        // Fallback to demo data
        setUsers(DEMO_USERS);
        setClasses(DEMO_CLASSES);
        setSessions(DEMO_SESSIONS);
        setAttendance(DEMO_ATTENDANCE);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const login = (userId: string) => {
    const user = users.find(u => u.id === userId) || DEMO_USERS.find(u => u.id === userId) || null;
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') localStorage.removeItem(USER_KEY);
  };

  const addClass = async (cls: Class) => {
    // Optimistic update
    setClasses(prev => [...prev, cls]);
    try {
      await dbAddClass(cls);
    } catch (err) {
      console.error('Failed to add class to Supabase:', err);
    }
  };

  const addSession = async (session: Session) => {
    setSessions(prev => [session, ...prev]);
    try {
      await dbAddSession(session);
    } catch (err) {
      console.error('Failed to add session to Supabase:', err);
    }
  };

  const updateSession = async (sessionId: string, updates: Partial<Session>) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ...updates } : s));
    try {
      await dbUpdateSession(sessionId, updates);
    } catch (err) {
      console.error('Failed to update session in Supabase:', err);
    }
  };

  const markAttendance = async (record: AttendanceRecord) => {
    setAttendance(prev => [record, ...prev]);
    try {
      await dbMarkAttendance(record);
    } catch (err) {
      console.error('Failed to mark attendance in Supabase:', err);
    }
  };

  const hasMarkedAttendance = (sessionId: string, studentId: string) => {
    return attendance.some(a => a.sessionId === sessionId && a.studentId === studentId);
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, classes, sessions, attendance,
      loading, dbError,
      login, logout, addClass, addSession, updateSession, markAttendance,
      hasMarkedAttendance, refreshData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
