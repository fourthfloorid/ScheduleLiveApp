import { LogOut } from 'lucide-react';
import { User } from '../App';
import { Page } from './Dashboard';

interface MobileHeaderProps {
  user: User;
  currentPage: Page;
  onLogout: () => void;
}

const pageTitle: Record<Page, string> = {
  home: 'Home',
  schedule: 'Schedule',
  room: 'Room',
  brand: 'Brand'
};

export default function MobileHeader({ user, currentPage, onLogout }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-[#e5e7eb] z-20 md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex-1">
          <h1 className="text-[#1f2937]">{pageTitle[currentPage]}</h1>
          <p className="text-[#9ca3af] text-xs capitalize">{user.name}</p>
        </div>
        
        <button
          onClick={onLogout}
          className="p-2 text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors touch-manipulation"
          title="Logout"
        >
          <LogOut className="size-5" />
        </button>
      </div>
    </header>
  );
}