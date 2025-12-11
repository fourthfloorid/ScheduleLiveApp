import { useState, useEffect } from 'react';
import { User as UserType } from '../../App';
import { Users, Edit2, Trash2, Plus, Search, ChevronDown, UserCircle, Tag, X } from 'lucide-react';
import { userAPI } from '../../utils/api';

interface UserManagementPageProps {
  user: UserType;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'host' | 'admin';
  brandTags?: string[]; // Array of brand IDs
  createdAt?: string;
}

interface Brand {
  id: string;
  name: string;
  description?: string;
}

export default function UserManagementPage({ user }: UserManagementPageProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'host' | 'admin'>('all');
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchBrands();
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

  const fetchBrands = async () => {
    try {
      const fetchedBrands = await userAPI.getBrands();
      setBrands(fetchedBrands);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      alert('Failed to fetch brands');
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
        email: editingUser.email,
        brandTags: editingUser.brandTags
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
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Brand Access
                </th>
                <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#6b7280]">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((userData) => {
                  const brandTagCount = userData.brandTags?.length || 0;
                  const isFlexible = brandTagCount === 0;
                  
                  return (
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
                      <td className="px-4 md:px-6 py-4">
                        {userData.role === 'host' ? (
                          <div className="flex items-center gap-2">
                            {isFlexible ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-[#fef3c7] text-[#f59e0b]">
                                🌟 Flexible
                              </span>
                            ) : (
                              <>
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-[#f0f5ff] text-[#2a6ef0]">
                                  🎯 {brandTagCount} {brandTagCount === 1 ? 'Brand' : 'Brands'}
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {userData.brandTags?.slice(0, 2).map((brandId) => {
                                    const brand = brands.find(b => b.id === brandId);
                                    return brand ? (
                                      <span
                                        key={brandId}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#d1d5dc] rounded text-xs text-[#6b7280]"
                                        title={brand.name}
                                      >
                                        <Tag className="size-3" />
                                        {brand.name}
                                      </span>
                                    ) : null;
                                  })}
                                  {brandTagCount > 2 && (
                                    <span className="inline-flex items-center px-2 py-0.5 bg-white border border-[#d1d5dc] rounded text-xs text-[#6b7280]">
                                      +{brandTagCount - 2}
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-[#9ca3af]">-</span>
                        )}
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#9ca3af]">
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

              {/* Brand Tags - Only for Host role */}
              {editingUser.role === 'host' && (
                <div>
                  <label className="block text-[#364153] mb-2 text-sm">
                    Brand Access
                    <span className="text-[#6b7280] ml-2 text-xs"> (Select brands host can work with)</span>
                  </label>
                  
                  {/* Brand Tag Type Toggle */}
                  <div className="mb-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e5e7eb]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#6b7280]">
                        {(!editingUser.brandTags || editingUser.brandTags.length === 0) 
                          ? '🌟 Flexible Host - Can work with ALL brands'
                          : `🎯 Exclusive Host - ${editingUser.brandTags.length} brand(s) only`
                        }
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingUser.brandTags || editingUser.brandTags.length === 0) {
                          // Do nothing - already flexible
                        } else {
                          setEditingUser({ ...editingUser, brandTags: [] });
                        }
                      }}
                      className="text-xs text-[#2a6ef0] hover:underline"
                    >
                      {(!editingUser.brandTags || editingUser.brandTags.length === 0)
                        ? 'Currently flexible (can work with all brands)'
                        : 'Clear all to make flexible'
                      }
                    </button>
                  </div>

                  {/* Brand Selection Grid */}
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-[#d1d5dc] rounded-lg p-3">
                    {brands.length === 0 ? (
                      <div className="text-center py-4 text-[#9ca3af] text-sm">
                        <Tag className="size-8 mx-auto mb-2 opacity-20" />
                        <p>No brands available</p>
                        <p className="text-xs mt-1">Create brands in Brand Management</p>
                      </div>
                    ) : (
                      brands.map((brand) => {
                        const isSelected = editingUser.brandTags?.includes(brand.id) || false;
                        return (
                          <label
                            key={brand.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#f0f5ff] border-[#2a6ef0]'
                                : 'bg-white border-[#e5e7eb] hover:border-[#d1d5dc]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const currentTags = editingUser.brandTags || [];
                                if (e.target.checked) {
                                  setEditingUser({
                                    ...editingUser,
                                    brandTags: [...currentTags, brand.id]
                                  });
                                } else {
                                  setEditingUser({
                                    ...editingUser,
                                    brandTags: currentTags.filter(id => id !== brand.id)
                                  });
                                }
                              }}
                              className="size-4 text-[#2a6ef0] rounded border-[#d1d5dc] focus:ring-2 focus:ring-[#2a6ef0]"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Tag className="size-4 text-[#2a6ef0]" />
                                <span className="text-[#1f2937] text-sm font-medium">
                                  {brand.name}
                                </span>
                              </div>
                              {brand.description && (
                                <p className="text-xs text-[#6b7280] mt-1">
                                  {brand.description}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <div className="bg-[#2a6ef0] text-white px-2 py-1 rounded text-xs">
                                Selected
                              </div>
                            )}
                          </label>
                        );
                      })
                    )}
                  </div>

                  {/* Selected Brands Summary */}
                  {editingUser.brandTags && editingUser.brandTags.length > 0 && (
                    <div className="mt-3 p-3 bg-[#f0f5ff] rounded-lg border border-[#2a6ef0]">
                      <p className="text-xs text-[#6b7280] mb-2">Selected brands:</p>
                      <div className="flex flex-wrap gap-2">
                        {editingUser.brandTags.map((brandId) => {
                          const brand = brands.find(b => b.id === brandId);
                          return brand ? (
                            <span
                              key={brandId}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-[#2a6ef0] rounded-full text-xs text-[#2a6ef0]"
                            >
                              <Tag className="size-3" />
                              {brand.name}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingUser({
                                    ...editingUser,
                                    brandTags: editingUser.brandTags?.filter(id => id !== brandId)
                                  });
                                }}
                                className="ml-1 hover:text-[#ef4444]"
                              >
                                <X className="size-3" />
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

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