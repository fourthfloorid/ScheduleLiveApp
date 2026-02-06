import { useState, useRef } from 'react';
import { Camera, Upload, User, X } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpdated: (photoUrl: string) => void;
}

export function ProfilePhotoUpload({ currentPhotoUrl, onPhotoUpdated }: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PNG, JPEG, JPG, and WEBP images are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadPhoto(file);
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String.split(',')[1]); // Remove data:image/xxx;base64, prefix
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-df75f45f/profile/upload-photo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            photo: base64Data,
            fileName: file.name,
            fileType: file.type,
          }),
        }
      );

      const text = await response.text();
      console.log('Upload response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse response:', text);
        throw new Error('Server returned invalid response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      onPhotoUpdated(data.photoUrl);
      setPreview(data.photoUrl);
    } catch (err: any) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Profile Photo Display */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-[#f3f4f6] border-4 border-white shadow-lg">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-16 h-16 text-[#9ca3af]" />
            </div>
          )}
        </div>

        {/* Upload Button Overlay */}
        <button
          onClick={handleButtonClick}
          disabled={uploading}
          className="absolute bottom-0 right-0 p-2 bg-[#2a6ef0] text-white rounded-full shadow-lg hover:bg-[#1e5dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upload photo"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Instructions */}
      <div className="text-center">
        <button
          onClick={handleButtonClick}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 text-sm text-[#2a6ef0] hover:bg-[#f0f5ff] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Change Photo'}
        </button>
        <p className="text-xs text-[#6b7280] mt-1">
          PNG, JPEG, or WEBP (max 5MB)
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-sm p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg">
          <div className="flex items-start gap-2">
            <X className="w-4 h-4 text-[#ef4444] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#991b1b]">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}