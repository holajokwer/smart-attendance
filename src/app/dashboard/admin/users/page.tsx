'use client';

import { useApp } from '@/context/AppContext';
import { Search, Users, Shield, GraduationCap, UserCheck } from 'lucide-react';
import { useState } from 'react';

export default function AdminUsersPage() {
  const { users } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleIcons: Record<string, React.ElementType> = { admin: Shield, teacher: GraduationCap, student: UserCheck };
  const roleColors: Record<string, string> = { admin: 'badge-purple', teacher: 'badge-blue', student: 'badge-green' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 text-sm mt-1">All registered users in the system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Admins', count: users.filter(u => u.role === 'admin').length, color: 'stat-purple', icon: Shield },
          { label: 'Teachers', count: users.filter(u => u.role === 'teacher').length, color: 'stat-blue', icon: GraduationCap },
          { label: 'Students', count: users.filter(u => u.role === 'student').length, color: 'stat-green', icon: UserCheck },
        ].map((s, i) => (
          <div key={i} className={`${s.color} rounded-xl p-4 flex items-center gap-3`}>
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <s.icon size={18} className="text-indigo-500" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-800">{s.count}</div>
              <div className="text-sm text-slate-600">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <select className="input sm:w-40" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Enrollment No.</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400">No users found</td></tr>
              ) : filtered.map(user => {
                const RoleIcon = roleIcons[user.role];
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)' }}>
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-slate-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="text-slate-500">{user.email}</td>
                    <td><span className={`badge ${roleColors[user.role]}`}><RoleIcon size={10} className="mr-1" />{user.role}</span></td>
                    <td className="text-slate-500">{user.department || '—'}</td>
                    <td className="text-slate-500">{user.enrollmentNo || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}
