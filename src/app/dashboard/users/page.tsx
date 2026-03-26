'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthenticatedHeader from '@/components/AuthenticatedHeader';

interface UserData {
  id: string;
  email: string;
  displayName: string | null;
  company: string | null;
  subscriptionStatus: string;
  subscriptionId: string | null;
  stripeCustomerId: string | null;
  reportsUsedThisMonth: number;
  reportsLimit: number;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  totalReports: number;
  completedReports: number;
  failedReports: number;
}

export default function UsersManagementPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editForm, setEditForm] = useState({
    subscriptionStatus: '',
    reportsLimit: 1,
  });

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[Users Page] Checking authentication...');
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        console.log('[Users Page] Auth response:', data);
        if (!data.authenticated) {
          console.log('[Users Page] Not authenticated, redirecting...');
          router.push('/access-reports');
          return;
        }
        console.log('[Users Page] Authenticated as:', data.email);
        setIsAuthenticated(data.authenticated);
        setUserEmail(data.email || '');
        setSubscriptionStatus(data.subscriptionStatus || 'free');
      } catch (err) {
        console.error('[Users Page] Failed to check auth:', err);
        router.push('/access-reports');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  // Filter users when search or filter changes
  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(term) ||
          user.displayName?.toLowerCase().includes(term) ||
          user.company?.toLowerCase().includes(term)
      );
    }

    // Filter by subscription status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => user.subscriptionStatus === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('[Users Page] Fetching users from /api/admin/users...');
      const response = await fetch('/api/admin/users');
      console.log('[Users Page] Response status:', response.status);
      const data = await response.json();
      console.log('[Users Page] Response data:', data);

      if (!response.ok) {
        console.log('[Users Page] Response not OK, setting error:', data.error);
        setError(data.error || 'Failed to fetch users');
        return;
      }

      if (data.success) {
        console.log('[Users Page] Successfully fetched', data.users?.length || 0, 'users');
        setUsers(data.users);
        setFilteredUsers(data.users);
      }
    } catch (err) {
      console.error('[Users Page] Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setEditForm({
      subscriptionStatus: user.subscriptionStatus,
      reportsLimit: user.reportsLimit,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          subscriptionStatus: editForm.subscriptionStatus,
          reportsLimit: editForm.reportsLimit,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers();
        setEditingUser(null);
        alert('User updated successfully!');
      } else {
        alert(data.error || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'starter':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-700';
      case 'past_due':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Stats summary
  const stats = {
    total: users.length,
    free: users.filter((u) => u.subscriptionStatus === 'free').length,
    starter: users.filter((u) => u.subscriptionStatus === 'starter').length,
    active: users.filter((u) => u.subscriptionStatus === 'active').length,
    totalReports: users.reduce((sum, u) => sum + u.totalReports, 0),
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent' }}
          ></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedHeader
          email={userEmail}
          subscriptionStatus={subscriptionStatus}
          pageTitle="Manage Users"
          showUpgradeButton={false}
        />
        <main className="container mx-auto max-w-6xl px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <Link href="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <AuthenticatedHeader
        email={userEmail}
        subscriptionStatus={subscriptionStatus}
        pageTitle="Manage Users"
        showUpgradeButton={false}
      />

      <main className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              View and manage all registered users
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Free</p>
            <p className="text-2xl font-bold text-gray-600">{stats.free}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Starter</p>
            <p className="text-2xl font-bold text-blue-600">{stats.starter}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Pro</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Reports</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalReports}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by email, name, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="active">Pro (Active)</option>
              <option value="cancelled">Cancelled</option>
              <option value="past_due">Past Due</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reports
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{user.email}</p>
                          {(user.displayName || user.company) && (
                            <p className="text-sm text-gray-500">
                              {user.displayName}
                              {user.displayName && user.company && ' · '}
                              {user.company}
                            </p>
                          )}
                          {user.emailVerified && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                            user.subscriptionStatus
                          )}`}
                        >
                          {user.subscriptionStatus === 'active' ? 'Pro' : user.subscriptionStatus}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {user.reportsUsedThisMonth}/{user.reportsLimit} reports
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <p className="font-semibold text-gray-900">{user.totalReports}</p>
                        <p className="text-xs text-gray-500">
                          {user.completedReports} done · {user.failedReports} failed
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDate(user.lastLoginAt)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </main>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit User</h3>
            <p className="text-sm text-gray-600 mb-6">{editingUser.email}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subscription Status
                </label>
                <select
                  value={editForm.subscriptionStatus}
                  onChange={(e) => setEditForm({ ...editForm, subscriptionStatus: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="active">Pro (Active)</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="past_due">Past Due</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Reports Limit
                </label>
                <input
                  type="number"
                  min="0"
                  value={editForm.reportsLimit}
                  onChange={(e) =>
                    setEditForm({ ...editForm, reportsLimit: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
