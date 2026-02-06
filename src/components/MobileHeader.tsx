import { LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../App';
import { Page } from './Dashboard';

interface MobileHeaderProps {
  user: User;
  currentPage: Page;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
}

const pageTitle: Record<Page, string> = {
  home: 'Home',
  schedule: 'Schedule',
  room: 'Room',
  brand: 'Brand',
  'brand-schedule': 'Brand Schedule',
  users: 'Users',
  profile: 'Profile'
};

export default function MobileHeader({ user, currentPage, onLogout, onNavigate }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-[#e5e7eb] z-20 md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Profile Photo & User Info */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => onNavigate('profile')}
            className="relative flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#f3f4f6] border-2 border-white shadow-sm">
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-[#9ca3af]" />
                </div>
              )}
            </div>
          </button>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-[#1f2937] truncate">{pageTitle[currentPage]}</h1>
            <p className="text-[#9ca3af] text-xs truncate">{user.name}</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="p-2 text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors touch-manipulation flex-shrink-0"
          title="Logout"
        >
          <LogOut className="size-5" />
        </button>
      </div>
    </header>
  );
}