import { Home, Calendar, Tv, Tag, LogOut, X, Users, UserCircle, CalendarCheck, User as UserIcon } from 'lucide-react';
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
    { id: 'brand-schedule' as Page, label: 'Brand Schedule', icon: CalendarCheck, roles: ['admin'] },
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
      {/* User Profile Header */}
      <div className="p-6 border-b border-[#e5e7eb]">
        <button
          onClick={() => onNavigate('profile')}
          className="w-full mb-4 flex items-center gap-3 p-3 rounded-lg hover:bg-[#f3f4f6] transition-colors"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f3f4f6] border-2 border-white shadow-sm flex-shrink-0">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-[#9ca3af]" />
              </div>
            )}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[#1f2937] truncate">{user.name}</p>
            <p className="text-[#9ca3af] text-sm capitalize">{user.role}</p>
          </div>
        </button>
        <h1 className="text-[#2a6ef0]">Live Schedule</h1>
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