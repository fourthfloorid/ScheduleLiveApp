import { useState, useEffect } from 'react';
import { User } from '../App';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import RoomPage from './pages/RoomPage';
import BrandPage from './pages/BrandPage';
import { BrandSchedulePage } from './pages/BrandSchedulePage';
import UserManagementPage from './pages/UserManagementPage';
import { ProfilePage } from './pages/ProfilePage';
import { useBrandStore } from '../store/brandStore';
import { useRoomStore } from '../store/roomStore';
import { useScheduleStore } from '../store/scheduleStore';

export type Page = 'home' | 'schedule' | 'room' | 'brand' | 'brand-schedule' | 'users' | 'profile';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

export default function Dashboard({ user, onLogout, onUpdateUser }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fetchBrands = useBrandStore(state => state.fetchBrands);
  const fetchRooms = useRoomStore(state => state.fetchRooms);
  const fetchSchedules = useScheduleStore(state => state.fetchSchedules);

  useEffect(() => {
    // Fetch all data when dashboard loads
    fetchBrands();
    fetchRooms();
    fetchSchedules();
  }, [fetchBrands, fetchRooms, fetchSchedules]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage user={user} />;
      case 'schedule':
        return <SchedulePage user={user} />;
      case 'room':
        return <RoomPage user={user} />;
      case 'brand':
        return <BrandPage user={user} />;
      case 'brand-schedule':
        return <BrandSchedulePage user={user} />;
      case 'users':
        return <UserManagementPage user={user} />;
      case 'profile':
        return <ProfilePage user={user} onUpdateUser={onUpdateUser} />;
      default:
        return <HomePage user={user} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fa] md:flex-row">
      {/* Mobile Header - Only shown on mobile */}
      <MobileHeader 
        user={user}
        currentPage={currentPage}
        onLogout={onLogout}
        onNavigate={handleNavigate}
      />
      
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <Sidebar 
        user={user} 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 pb-20 md:pt-0 md:pb-0">
        {renderPage()}
      </main>
      
      {/* Bottom Navigation - Only shown on mobile */}
      <BottomNav
        user={user}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />
    </div>
  );
}