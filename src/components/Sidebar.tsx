import { Home, Calendar, Tv, Tag, LogOut, X, Users, UserCircle } from 'lucide-react';
import { User } from '../App';
import { Page } from './Dashboard';

interface SidebarProps {
  user: User;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ user, currentPage, onNavigate, onLogout, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'home' as Page, label: 'Home', icon: Home, roles: ['host', 'admin'] },
    { id: 'schedule' as Page, label: 'Schedule', icon: Calendar, roles: ['host', 'admin'] },
    { id: 'room' as Page, label: 'Room', icon: Tv, roles: ['host', 'admin'] },
    { id: 'brand' as Page, label: 'Brand', icon: Tag, roles: ['admin'] },
    { id: 'users' as Page, label: 'Users', icon: Users, roles: ['admin'] },
    { id: 'profile' as Page, label: 'Profile', icon: UserCircle, roles: ['host', 'admin'] },
  ];

  const availableMenuItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <div 
      className={`
        hidden md:flex
        w-64 bg-white border-r border-[#e5e7eb] flex-col
      `}
    >
      <div className="p-6 border-b border-[#e5e7eb]">
        <h1 className="text-[#2a6ef0] mb-2">Live Schedule</h1>
        <p className="text-[#6b7280]">{user.name}</p>
        <p className="text-[#9ca3af] capitalize">{user.role}</p>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        {availableMenuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive 
                  ? 'bg-[#2a6ef0] text-white' 
                  : 'text-[#4a5565] hover:bg-[#f3f4f6]'
              }`}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#e5e7eb]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
        >
          <LogOut className="size-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}