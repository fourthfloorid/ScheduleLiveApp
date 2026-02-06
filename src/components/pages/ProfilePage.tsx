import { useState, useEffect } from 'react';
import { User as UserType } from '../../App';
import { User, Mail, Tag, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ProfilePhotoUpload } from '../ProfilePhotoUpload';
import { projectId } from '../../utils/supabase/info';

interface ProfilePageProps {
  user: UserType;
  onUserUpdate?: (user: UserType) => void;
}

interface Brand {
  id: string;
  name: string;
  description?: string;
}

export function ProfilePage({ user, onUserUpdate }: ProfilePageProps) {
  const [profile, setProfile] = useState<any>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  useEffect(() => {
    fetchProfile();
    if (user.role === 'host') {
      fetchBrands();
    }
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-df75f45f/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.user);
      setName(data.user.user_metadata?.name || '');
      setSelectedBrands(data.user.user_metadata?.brandTags || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-df75f45f/brands`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands || []);
      }
    } catch (err) {
      console.error('Fetch brands error:', err);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-df75f45f/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            brandTags: selectedBrands,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.user);
      setSuccess('Profile updated successfully!');
      
      // Update user in parent component if callback provided
      if (onUserUpdate) {
        onUserUpdate({
          ...user,
          name: data.user.user_metadata?.name || user.name,
        });
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      console.error('Save profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpdated = (photoUrl: string) => {
    setProfile((prev: any) => ({
      ...prev,
      user_metadata: {
        ...prev.user_metadata,
        photoUrl,
      },
    }));
    
    // Update user in parent component
    if (onUserUpdate) {
      onUserUpdate({
        ...user,
        photoUrl,
      });
    }
    
    setSuccess('Profile photo updated successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your profile information and preferences</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Photo Section */}
          <div className="p-8 bg-gradient-to-br from-[#2a6ef0] to-[#1e5dd8]">
            <ProfilePhotoUpload
              currentPhotoUrl={profile?.user_metadata?.photoUrl}
              onPhotoUpdated={handlePhotoUpdated}
            />
          </div>

          {/* Profile Information */}
          <div className="p-6 space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label className="block text-[#364153] mb-2 text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-2.5 border border-[#d1d5dc] rounded-lg bg-[#f9fafb] text-[#6b7280] cursor-not-allowed"
              />
              <p className="text-xs text-[#6b7280] mt-1">Email cannot be changed</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-[#364153] mb-2 text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 border border-[#d1d5dc] rounded-lg bg-white focus:ring-2 focus:ring-[#2a6ef0] focus:outline-none"
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label className="block text-[#364153] mb-2 text-sm font-medium">Role</label>
              <div className="px-4 py-2.5 border border-[#d1d5dc] rounded-lg bg-[#f9fafb]">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                  profile?.user_metadata?.role === 'admin'
                    ? 'bg-[#fef3c7] text-[#92400e]'
                    : 'bg-[#dbeafe] text-[#1e40af]'
                }`}>
                  {profile?.user_metadata?.role === 'admin' ? 'Admin' : 'Host'}
                </span>
              </div>
            </div>

            {/* Brand Tags (Host only) */}
            {user.role === 'host' && (
              <div>
                <label className="block text-[#364153] mb-2 text-sm font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Brand Tags
                </label>
                <p className="text-sm text-[#6b7280] mb-3">
                  Select the brands you can work with. Leave empty to work with all brands.
                </p>
                
                {brands.length === 0 ? (
                  <p className="text-sm text-[#9ca3af] py-4 text-center bg-[#f9fafb] rounded-lg border border-[#e5e7eb]">
                    No brands available yet
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => toggleBrand(brand.id)}
                        className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                          selectedBrands.includes(brand.id)
                            ? 'border-[#2a6ef0] bg-[#f0f5ff]'
                            : 'border-[#e5e7eb] bg-white hover:border-[#2a6ef0]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              selectedBrands.includes(brand.id)
                                ? 'border-[#2a6ef0] bg-[#2a6ef0]'
                                : 'border-[#d1d5dc] bg-white'
                            }`}
                          >
                            {selectedBrands.includes(brand.id) && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-[#1f2937]">{brand.name}</p>
                            {brand.description && (
                              <p className="text-xs text-[#6b7280]">{brand.description}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {selectedBrands.length === 0 && (
                  <p className="text-xs text-[#f59e0b] mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    No brands selected - you can work with any brand
                  </p>
                )}
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-[#e5e7eb]">
              <button
                onClick={handleSaveProfile}
                disabled={saving || !name.trim()}
                className="w-full md:w-auto px-6 py-3 bg-[#2a6ef0] text-white rounded-lg hover:bg-[#1e5dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}