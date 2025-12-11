import { useState } from 'react';
import { User as UserType } from '../../App';
import { UserCircle, Mail, Shield, Edit2, Save, X } from 'lucide-react';
import { userAPI } from '../../utils/api';

interface ProfilePageProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
}

export default function ProfilePage({ user, onUpdateUser }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await userAPI.update(user.id, {
        name: editForm.name,
        email: editForm.email
      });

      // Update local user state
      onUpdateUser({
        ...user,
        name: updatedUser.name,
        email: updatedUser.email
      });

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email
    });
    setIsEditing(false);
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-[#1f2937] mb-2">My Profile</h1>
        <p className="text-[#6b7280] text-sm md:text-base">
          Manage your personal information
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-6 md:p-8 border border-[#e5e7eb] mb-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#2a6ef0] to-[#1e5dd8] p-6 rounded-full">
              <UserCircle className="size-16 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-[#1f2937] mb-2">{user.name}</h2>
              <p className="text-[#6b7280] mb-3">{user.email}</p>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                user.role === 'admin'
                  ? 'bg-[#fce7f3] text-[#ec4899]'
                  : 'bg-[#dcfce7] text-[#16a34a]'
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#2a6ef0] text-white rounded-lg hover:bg-[#1e5dd8] transition-colors"
              >
                <Edit2 className="size-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {isEditing ? (
              <>
                {/* Edit Form */}
                <div>
                  <label className="block text-[#364153] mb-2 text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0]"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#364153] mb-2 text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0]"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#2a6ef0] text-white px-6 py-3 rounded-lg hover:bg-[#1e5dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="size-5" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#f3f4f6] text-[#4a5565] px-6 py-3 rounded-lg hover:bg-[#e5e7eb] transition-colors disabled:opacity-50"
                  >
                    <X className="size-5" />
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className="bg-[#f9fafb] p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <UserCircle className="size-5 text-[#6b7280]" />
                    <p className="text-[#6b7280] text-sm font-medium">Full Name</p>
                  </div>
                  <p className="text-[#1f2937] ml-8">{user.name}</p>
                </div>

                <div className="bg-[#f9fafb] p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="size-5 text-[#6b7280]" />
                    <p className="text-[#6b7280] text-sm font-medium">Email Address</p>
                  </div>
                  <p className="text-[#1f2937] ml-8">{user.email}</p>
                </div>

                <div className="bg-[#f9fafb] p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="size-5 text-[#6b7280]" />
                    <p className="text-[#6b7280] text-sm font-medium">Role</p>
                  </div>
                  <p className="text-[#1f2937] ml-8 capitalize">{user.role}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-[#f0f5ff] border border-[#2a6ef0]/20 rounded-xl p-4 md:p-6">
          <div className="flex gap-3">
            <div className="bg-[#2a6ef0] p-2 rounded-lg h-fit">
              <Shield className="size-5 text-white" />
            </div>
            <div>
              <h3 className="text-[#1f2937] font-medium mb-1">Account Security</h3>
              <p className="text-[#6b7280] text-sm">
                Your account information is securely stored. Only you can edit your profile details.
                {user.role === 'admin' && ' As an admin, you can also manage other users from the User Management page.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
