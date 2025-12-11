import { useState } from 'react';
import { User } from '../../App';
import { useScheduleStore } from '../../store/scheduleStore';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';

interface HostScheduleProps {
  user: User;
}

export default function HostSchedule({ user }: HostScheduleProps) {
  const schedules = useScheduleStore(state => state.schedules);
  const submitAvailability = useScheduleStore(state => state.submitAvailability);
  const deleteAvailability = useScheduleStore(state => state.deleteAvailability);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [sessions, setSessions] = useState<number>(2);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const userSchedules = schedules.filter(s => s.hostId === user.id);

  // Generate week dates (7 days starting from today)
  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(new Date(), i));
    }
    return dates;
  };

  const weekDates = generateWeekDates();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || sessions < 1) {
      alert('Please select a date and enter number of sessions');
      return;
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    // Check if availability already exists for this date
    const existingAvailability = userSchedules.find(s => s.date === dateStr);
    if (existingAvailability) {
      alert('You already submitted availability for this date. Please delete it first to update.');
      return;
    }

    await submitAvailability(dateStr, sessions);
    setSelectedDate(undefined);
    setSessions(2);
    setIsCalendarOpen(false);
  };

  const handleQuickAdd = async (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingAvailability = userSchedules.find(s => s.date === dateStr);
    
    if (existingAvailability) {
      alert('You already submitted availability for this date');
      return;
    }

    await submitAvailability(dateStr, 2); // Default 2 sessions
  };

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return userSchedules.find(s => s.date === dateStr);
  };

  const getTotalAvailableSessions = () => {
    return userSchedules.reduce((sum, s) => sum + s.availableSessions, 0);
  };

  const getTotalAssignedSessions = () => {
    return userSchedules.reduce((sum, s) => sum + s.assignedSessions, 0);
  };

  const getWeeklyStats = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 });
    
    const weekSchedules = userSchedules.filter(s => {
      const scheduleDate = parseISO(s.date);
      return scheduleDate >= weekStart && scheduleDate <= weekEnd;
    });

    const available = weekSchedules.reduce((sum, s) => sum + s.availableSessions, 0);
    const assigned = weekSchedules.reduce((sum, s) => sum + s.assignedSessions, 0);
    
    return { available, assigned };
  };

  const weeklyStats = getWeeklyStats();

  return (
    <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
      {/* Submit Availability Form */}
      <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb]">
        <h2 className="text-[#1f2937] mb-4 md:mb-6 flex items-center gap-2">
          <Plus className="size-5" />
          Submit Availability
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#364153] mb-2 text-sm md:text-base">Select Date</label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] flex items-center justify-between text-left"
                >
                  <span className={selectedDate ? 'text-[#1f2937]' : 'text-[#9ca3af]'}>
                    {selectedDate ? format(selectedDate, 'PPP') : 'Select a date'}
                  </span>
                  <CalendarIcon className="size-4 text-[#6b7280]" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-[#364153] mb-2 text-sm md:text-base">
              Number of Sessions (1 hour each)
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={sessions}
              onChange={(e) => setSessions(parseInt(e.target.value) || 1)}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] text-base"
              placeholder="e.g. 2"
              required
            />
            <p className="text-[#6b7280] text-xs mt-1">Minimum 2 sessions per day recommended</p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2a6ef0] text-white px-6 py-2 md:py-3 rounded-lg hover:bg-[#1e5dd8] transition-colors touch-manipulation"
          >
            Submit Availability
          </button>
        </form>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-[#e5e7eb]">
          <h3 className="text-[#1f2937] mb-3 text-sm">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f0f5ff] p-3 rounded-lg">
              <p className="text-[#6b7280] text-xs mb-1">This Week Available</p>
              <p className="text-[#2a6ef0] font-semibold">{weeklyStats.available} sessions</p>
            </div>
            <div className="bg-[#dcfce7] p-3 rounded-lg">
              <p className="text-[#6b7280] text-xs mb-1">This Week Assigned</p>
              <p className="text-[#16a34a] font-semibold">{weeklyStats.assigned} sessions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Calendar View */}
      <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb]">
        <h2 className="text-[#1f2937] mb-4 flex items-center gap-2">
          <CalendarIcon className="size-5" />
          Weekly Availability
        </h2>

        <div className="space-y-3">
          {weekDates.map((date, index) => {
            const availability = getAvailabilityForDate(date);
            const isToday = isSameDay(date, new Date());
            const hasMinimum = availability && availability.availableSessions >= 2;
            const isBelow = availability && availability.availableSessions < 2;

            return (
              <div
                key={index}
                className={`p-3 md:p-4 rounded-lg border transition-all ${
                  isToday
                    ? 'border-[#2a6ef0] bg-[#f0f5ff]'
                    : availability
                    ? 'border-[#d1d5db] bg-[#f9fafb]'
                    : 'border-[#e5e7eb] bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className={`text-sm ${isToday ? 'text-[#2a6ef0] font-semibold' : 'text-[#1f2937]'}`}>
                        {format(date, 'EEEE')}
                      </p>
                      <p className="text-xs text-[#6b7280]">{format(date, 'MMM d, yyyy')}</p>
                    </div>
                    {isToday && (
                      <span className="bg-[#2a6ef0] text-white text-xs px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </div>

                  {availability ? (
                    <button
                      onClick={() => deleteAvailability(availability.id)}
                      className="p-2 text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors touch-manipulation"
                      title="Delete availability"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuickAdd(date)}
                      className="text-[#2a6ef0] text-sm hover:underline"
                    >
                      Quick Add (2 sessions)
                    </button>
                  )}
                </div>

                {availability ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="size-4 text-[#6b7280]" />
                        <span className="text-sm text-[#1f2937]">
                          {availability.availableSessions} session{availability.availableSessions !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {availability.assignedSessions > 0 && (
                        <div className="text-xs text-[#16a34a] bg-[#dcfce7] px-2 py-1 rounded">
                          {availability.assignedSessions} assigned
                        </div>
                      )}
                    </div>
                    
                    {hasMinimum ? (
                      <CheckCircle className="size-5 text-[#16a34a]" />
                    ) : isBelow ? (
                      <AlertCircle className="size-5 text-[#f59e0b]" />
                    ) : null}
                  </div>
                ) : (
                  <p className="text-[#9ca3af] text-sm">No availability submitted</p>
                )}
              </div>
            );
          })}
        </div>

        {userSchedules.length === 0 && (
          <div className="text-center py-8 text-[#9ca3af]">
            <CalendarIcon className="size-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No availability submitted yet</p>
            <p className="text-xs mt-1">Start by selecting dates above</p>
          </div>
        )}
      </div>

      {/* Overall Stats */}
      <div className="lg:col-span-2 grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 md:p-5 border border-[#e5e7eb]">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#dbeafe] p-2 rounded-lg">
              <CalendarIcon className="size-5 text-[#2a6ef0]" />
            </div>
            <div>
              <p className="text-[#6b7280] text-xs md:text-sm">Total Available</p>
              <p className="text-[#1f2937] font-semibold text-lg">{getTotalAvailableSessions()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-5 border border-[#e5e7eb]">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#dcfce7] p-2 rounded-lg">
              <CheckCircle className="size-5 text-[#16a34a]" />
            </div>
            <div>
              <p className="text-[#6b7280] text-xs md:text-sm">Assigned</p>
              <p className="text-[#1f2937] font-semibold text-lg">{getTotalAssignedSessions()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-5 border border-[#e5e7eb]">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#fef3c7] p-2 rounded-lg">
              <Clock className="size-5 text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-[#6b7280] text-xs md:text-sm">Remaining</p>
              <p className="text-[#1f2937] font-semibold text-lg">
                {getTotalAvailableSessions() - getTotalAssignedSessions()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
