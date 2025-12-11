import { useState, useEffect } from 'react';
import { User as UserType } from '../../App';
import { Users, Edit2, Trash2, Plus, Search, ChevronDown, UserCircle } from 'lucide-react';
import { userAPI } from '../../utils/api';

interface UserManagementPageProps {
  user: UserType;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'host' | 'admin';
  createdAt?: string;
}

export default function UserManagementPage({ user }: UserManagementPageProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'host' | 'admin'>('all');
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await userAPI.getAll();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (userData: UserData) => {
    setEditingUser(userData);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await userAPI.update(editingUser.id, {
        name: editingUser.name,
        role: editingUser.role,
        email: editingUser.email
      });
      await fetchUsers();
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (error: any) {
      console.error('Failed to update user:', error);
      alert(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user ${userName}?`)) return;

    try {
      await userAPI.delete(userId);
      await fetchUsers();
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      alert(error.message || 'Failed to delete user');
    }
  };

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const hostCount = users.filter(u => u.role === 'host').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  if (user.role !== 'admin') {
    return (
      <div className="p-4 md:p-8">
        <div className="bg-white rounded-xl p-8 md:p-12 border border-[#e5e7eb] text-center">
          <UserCircle className="size-16 mx-auto mb-4 text-[#9ca3af]" />
          <p className="text-[#9ca3af]">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-[#1f2937] mb-2">User Management</h1>
        <p className="text-[#6b7280] text-sm md:text-base">
          Manage all users in the system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 md:p-5 border border-[#e5e7eb]">
          <div className="flex items-center gap-3">
            <div className="bg-[#dbeafe] p-3 rounded-lg">
              <Users className="size-5 text-[#2a6ef0]" />
            </div>
            <div>
              <p className="text-[#6b7280] text-xs md:text-sm">Total Users</p>
              <p className="text-[#1f2937] font-semibold text-lg">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-5 border border-[#e5e7eb]">
          <div className="flex items-center gap-3">
            <div className="bg-[#dcfce7] p-3 rounded-lg">
              <UserCircle className="size-5 text-[#16a34a]" />
            </div>
            <div>
              <p className="text-[#6b7280] text-xs md:text-sm">Hosts</p>
              <p className="text-[#1f2937] font-semibold text-lg">{hostCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-5 border border-[#e5e7eb]">
          <div className="flex items-center gap-3">
            <div className="bg-[#fce7f3] p-3 rounded-lg">
              <UserCircle className="size-5 text-[#ec4899]" />
            </div>
            <div>
              <p className="text-[#6b7280] text-xs md:text-sm">Admins</p>
              <p className="text-[#1f2937] font-semibold text-lg">{adminCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-5 border border-[#e5e7eb]">
          <div className="flex items-center gap-3">
            <div className="bg-[#fef3c7] p-3 rounded-lg">
              <Search className="size-5 text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-[#6b7280] text-xs md:text-sm">Filtered</p>
              <p className="text-[#1f2937] font-semibold text-lg">{filteredUsers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb] mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#364153] mb-2 text-sm">Search Users</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-[#6b7280]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] text-sm"
                placeholder="Search by name or email..."
              />
            </div>
          </div>

          <div>
            <label className="block text-[#364153] mb-2 text-sm">Filter by Role</label>
            <div className="relative">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="w-full px-4 py-2 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] text-sm appearance-none pr-8"
              >
                <option value="all">All Roles</option>
                <option value="host">Host</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-[#6b7280] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#6b7280]">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((userData) => (
                  <tr key={userData.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#f0f5ff] p-2 rounded-lg">
                          <UserCircle className="size-5 text-[#2a6ef0]" />
                        </div>
                        <div>
                          <p className="text-[#1f2937] font-medium text-sm">{userData.name}</p>
                          {userData.id === user.id && (
                            <span className="text-xs text-[#2a6ef0]">(You)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-[#6b7280] text-sm">
                      {userData.email}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        userData.role === 'admin'
                          ? 'bg-[#fce7f3] text-[#ec4899]'
                          : 'bg-[#dcfce7] text-[#16a34a]'
                      }`}>
                        {userData.role}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(userData)}
                          className="p-2 text-[#2a6ef0] hover:bg-[#f0f5ff] rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        {userData.id !== user.id && (
                          <button
                            onClick={() => handleDeleteUser(userData.id, userData.name)}
                            className="p-2 text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#9ca3af]">
                    <Users className="size-12 mx-auto mb-3 opacity-20" />
                    <p>No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-[#1f2937] mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-[#364153] mb-2 text-sm">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#364153] mb-2 text-sm">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#364153] mb-2 text-sm">Role</label>
                <div className="relative">
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full px-4 py-2 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] appearance-none pr-8"
                    required
                  >
                    <option value="host">Host</option>
                    <option value="admin">Admin</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-[#6b7280] pointer-events-none" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#2a6ef0] text-white px-6 py-2 rounded-lg hover:bg-[#1e5dd8] transition-colors"
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 bg-[#f3f4f6] text-[#4a5565] px-6 py-2 rounded-lg hover:bg-[#e5e7eb] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
