import { User } from '../../App';
import { Calendar, Tv, Clock, TrendingUp, Tag } from 'lucide-react';
import { useScheduleStore } from '../../store/scheduleStore';
import { useBrandStore } from '../../store/brandStore';
import { useRoomStore } from '../../store/roomStore';
import { format, addDays, isToday, startOfDay, parseISO, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { useState } from 'react';

interface HomePageProps {
  user: User;
}

export default function HomePage({ user }: HomePageProps) {
  const schedules = useScheduleStore(state => state.schedules);
  const brands = useBrandStore(state => state.brands);
  const rooms = useRoomStore(state => state.rooms);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // For host: get their availability stats
  const userAvailability = user.role === 'host' 
    ? schedules.filter(s => s.hostId === user.id)
    : schedules;

  // For host: get their assigned sessions from rooms
  const getHostAssignments = () => {
    if (user.role !== 'host') return [];
    
    const assignments: any[] = [];
    rooms.forEach(room => {
      room.assignments?.forEach(assignment => {
        if (assignment.hostId === user.id) {
          assignments.push({
            roomId: room.id,
            roomName: room.name,
            brandId: assignment.brandId,
            brandName: assignment.brandName,
            sessions: assignment.sessions
          });
        }
      });
    });
    return assignments;
  };

  const hostAssignments = user.role === 'host' ? getHostAssignments() : [];

  // Stats calculations
  const totalAvailable = userAvailability.reduce((sum, s) => sum + s.availableSessions, 0);
  const totalAssigned = userAvailability.reduce((sum, s) => sum + s.assignedSessions, 0);
  
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 });
  
  const weekAvailability = userAvailability.filter(s => {
    const scheduleDate = parseISO(s.date);
    return scheduleDate >= weekStart && scheduleDate <= weekEnd;
  });
  
  const thisWeekAvailable = weekAvailability.reduce((sum, s) => sum + s.availableSessions, 0);

  // Generate week dates starting from today
  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(new Date(), i));
    }
    return dates;
  };

  const weekDates = generateWeekDates();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-[#1f2937] mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-[#6b7280]">
          {user.role === 'host' 
            ? 'Manage your availability and view assignments' 
            : 'Overview of all hosts and schedules'}
        </p>
      </div>

      {/* Week Date Selector */}
      <div className="mb-6 md:mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 p-[8px]">
          {weekDates.map((date, index) => {
            const isTodayDate = isToday(date);
            const isSelected = isSameDay(date, selectedDate);
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center px-3 py-3 md:px-4 md:py-3 rounded-3xl min-w-[52px] md:min-w-[80px] transition-all ${
                  isSelected
                    ? 'bg-[#1c64f2] text-white scale-105' 
                    : isTodayDate
                    ? 'bg-[#dbeafe] text-[#1c64f2] border border-[#1c64f2]'
                    : 'bg-[#f5f5f4] text-[#888888] hover:bg-[#e5e7eb]'
                }`}
              >
                {/* Mobile: Show initial only */}
                <p className={`block md:hidden text-xs tracking-tight mb-1 ${
                  isSelected || isTodayDate ? 'font-semibold' : 'font-medium'
                }`}>
                  {format(date, 'EEE').charAt(0)}
                </p>
                
                {/* Desktop: Show full day name */}
                <p className={`hidden md:block text-xs tracking-tight mb-1 ${
                  isSelected || isTodayDate ? 'font-semibold' : 'font-medium'
                }`}>
                  {format(date, 'EEE')}
                </p>
                
                <p className={`text-[10px] md:text-xs tracking-tight ${
                  isSelected || isTodayDate ? 'font-medium' : 'font-normal'
                }`}>
                  {format(date, 'd MMM')}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {user.role === 'host' ? (
          <>
            <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb]">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="bg-[#dbeafe] p-2 md:p-3 rounded-lg">
                  <Calendar className="size-4 md:size-6 text-[#2a6ef0]" />
                </div>
              </div>
              <p className="text-[#6b7280] mb-1 text-sm md:text-base">This Week</p>
              <p className="text-[#1f2937]">{thisWeekAvailable} sessions</p>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb]">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="bg-[#dcfce7] p-2 md:p-3 rounded-lg">
                  <Clock className="size-4 md:size-6 text-[#16a34a]" />
                </div>
              </div>
              <p className="text-[#6b7280] mb-1 text-sm md:text-base">Available</p>
              <p className="text-[#1f2937]">{totalAvailable}</p>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb]">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="bg-[#fce7f3] p-2 md:p-3 rounded-lg">
                  <TrendingUp className="size-4 md:size-6 text-[#ec4899]" />
                </div>
              </div>
              <p className="text-[#6b7280] mb-1 text-sm md:text-base">Assigned</p>
              <p className="text-[#1f2937]">{totalAssigned}</p>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb]">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="bg-[#fef3c7] p-2 md:p-3 rounded-lg">
                  <Tv className="size-4 md:size-6 text-[#f59e0b]" />
                </div>
              </div>
              <p className="text-[#6b7280] mb-1 text-sm md:text-base">Rooms</p>
              <p className="text-[#1f2937]">{hostAssignments.length}</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb]">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="bg-[#dbeafe] p-2 md:p-3 rounded-lg">
                  <Calendar className="size-4 md:size-6 text-[#2a6ef0]" />
                </div>
              </div>
              <p className="text-[#6b7280] mb-1 text-sm md:text-base">Total Hosts</p>
              <p className="text-[#1f2937]">{new Set(schedules.map(s => s.hostId)).size}</p>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb]">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="bg-[#dcfce7] p-2 md:p-3 rounded-lg">
                  <Clock className="size-4 md:size-6 text-[#16a34a]" />
                </div>
              </div>
              <p className="text-[#6b7280] mb-1 text-sm md:text-base">Available</p>
              <p className="text-[#1f2937]">
                {schedules.reduce((sum, s) => sum + s.availableSessions, 0)}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb]">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="bg-[#fef3c7] p-2 md:p-3 rounded-lg">
                  <Tv className="size-4 md:size-6 text-[#f59e0b]" />
                </div>
              </div>
              <p className="text-[#6b7280] mb-1 text-sm md:text-base">Rooms</p>
              <p className="text-[#1f2937]">{rooms.length}</p>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb]">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="bg-[#fce7f3] p-2 md:p-3 rounded-lg">
                  <Tag className="size-4 md:size-6 text-[#ec4899]" />
                </div>
              </div>
              <p className="text-[#6b7280] mb-1 text-sm md:text-base">Brands</p>
              <p className="text-[#1f2937]">{brands.length}</p>
            </div>
          </>
        )}
      </div>

      {/* My Assignments (Host Only) */}
      {user.role === 'host' && (
        <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb] mb-6 md:mb-8">
          <h2 className="text-[#1f2937] mb-4 flex items-center gap-2">
            <Tv className="size-5" />
            My Room Assignments
          </h2>

          {hostAssignments.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {hostAssignments.map((assignment, index) => (
                <div
                  key={index}
                  className="border border-[#e5e7eb] rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-[#f0f5ff] p-2 rounded-lg">
                      <Tv className="size-5 text-[#2a6ef0]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#1f2937] font-medium truncate">{assignment.roomName}</h3>
                      <p className="text-[#6b7280] text-sm truncate">{assignment.brandName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="size-4 text-[#6b7280]" />
                    <span className="text-[#1f2937]">
                      {assignment.sessions} session{assignment.sessions !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#9ca3af]">
              <Tv className="size-12 mx-auto mb-3 opacity-20" />
              <p>No room assignments yet</p>
              <p className="text-sm mt-1">Wait for admin to assign you to rooms</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb]">
        <h2 className="text-[#1f2937] mb-4">Quick Stats</h2>
        <div className="space-y-4">
          {user.role === 'host' ? (
            <>
              <div className="flex justify-between items-center py-3 border-b border-[#f3f4f6]">
                <span className="text-[#6b7280] text-sm md:text-base">Total Submitted</span>
                <span className="text-[#1f2937]">{totalAvailable} sessions</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f3f4f6]">
                <span className="text-[#6b7280] text-sm md:text-base">Total Assigned</span>
                <span className="text-[#1f2937]">{totalAssigned} sessions</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[#6b7280] text-sm md:text-base">Remaining Available</span>
                <span className="text-[#16a34a] font-medium">{totalAvailable - totalAssigned} sessions</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center py-3 border-b border-[#f3f4f6]">
                <span className="text-[#6b7280] text-sm md:text-base">Total Hosts</span>
                <span className="text-[#1f2937]">
                  {new Set(schedules.map(s => s.hostId)).size}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f3f4f6]">
                <span className="text-[#6b7280] text-sm md:text-base">Total Available Sessions</span>
                <span className="text-[#1f2937]">
                  {schedules.reduce((sum, s) => sum + s.availableSessions, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[#6b7280] text-sm md:text-base">Total Assigned Sessions</span>
                <span className="text-[#1f2937]">
                  {schedules.reduce((sum, s) => sum + s.assignedSessions, 0)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
