import { Home, Calendar, Tv, Tag, LogOut, Users, UserCircle } from 'lucide-react';
import { User } from '../App';
import { Page } from './Dashboard';

interface BottomNavProps {
  user: User;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export default function BottomNav({ user, currentPage, onNavigate, onLogout }: BottomNavProps) {
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e7eb] z-20 md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {availableMenuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-lg transition-colors touch-manipulation ${
                isActive 
                  ? 'text-[#2a6ef0]' 
                  : 'text-[#6b7280]'
              }`}
            >
              <Icon className={`size-6 mb-1 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}