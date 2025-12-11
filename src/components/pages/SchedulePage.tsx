import { useState, useEffect } from 'react';
import { User as UserType } from '../../App';
import { Calendar, Clock, Plus, Trash2, Check, UserCircle } from 'lucide-react';
import { scheduleAPI } from '../../utils/api';
import DatePicker from '../ui/DatePicker';

interface SchedulePageProps {
  user: UserType;
}

interface Schedule {
  id: string;
  hostId: string;
  hostName: string;
  date: string;
  timeSlots: string[];
  createdAt: string;
}

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

export default function SchedulePage({ user }: SchedulePageProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const fetchedSchedules = await scheduleAPI.getAll();
      setSchedules(fetchedSchedules);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    // Check if time slot is in the past (for today's date)
    if (isTimeSlotPast(timeSlot)) {
      return; // Don't allow selection of past time slots
    }
    
    setSelectedTimeSlots(prev => {
      if (prev.includes(timeSlot)) {
        return prev.filter(t => t !== timeSlot);
      } else {
        return [...prev, timeSlot].sort();
      }
    });
  };

  // Check if a time slot is in the past
  const isTimeSlotPast = (timeSlot: string): boolean => {
    if (!selectedDate) return false;
    
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    
    // Only check for today's date
    if (selectedDate !== currentDate) return false;
    
    const currentHour = now.getHours();
    const timeHour = parseInt(timeSlot.split(':')[0]);
    
    // Disable if time slot hour has passed or is current hour
    return timeHour <= currentHour;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    
    if (selectedTimeSlots.length < 2) {
      alert('Please select at least 2 time slots (minimum 2 sessions)');
      return;
    }

    setIsSubmitting(true);
    try {
      await scheduleAPI.create({
        date: selectedDate,
        timeSlots: selectedTimeSlots
      });
      
      await fetchSchedules();
      setSelectedDate('');
      setSelectedTimeSlots([]);
      alert('Availability submitted successfully!');
    } catch (error: any) {
      console.error('Failed to submit availability:', error);
      alert(error.message || 'Failed to submit availability');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this availability?')) return;

    try {
      await scheduleAPI.delete(id);
      await fetchSchedules();
    } catch (error: any) {
      console.error('Failed to delete availability:', error);
      alert(error.message || 'Failed to delete availability');
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Group schedules by date
  const schedulesByDate = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.date]) {
      acc[schedule.date] = [];
    }
    acc[schedule.date].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-[#1f2937] mb-2">My Availability</h1>
        <p className="text-[#6b7280] text-sm md:text-base">
          Submit your available time slots for live streaming sessions
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Submit Availability Form */}
        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#f0f5ff] p-3 rounded-lg">
              <Plus className="size-6 text-[#2a6ef0]" />
            </div>
            <div>
              <h2 className="text-[#1f2937]">Submit Availability</h2>
              <p className="text-[#6b7280] text-sm">Select date and time slots</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Date Selection */}
            <div>
              <label className="block text-[#364153] mb-2 text-sm font-medium">
                Select Date
              </label>
              <DatePicker
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={today}
                placeholder="Choose a date"
              />
            </div>

            {/* Time Slots Selection */}
            <div>
              <label className="block text-[#364153] mb-3 text-sm font-medium">
                Select Time Slots (Minimum 2 sessions)
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto p-2 bg-[#f9fafb] rounded-lg">
                {TIME_SLOTS.map((timeSlot) => {
                  const isSelected = selectedTimeSlots.includes(timeSlot);
                  const isPast = isTimeSlotPast(timeSlot);
                  return (
                    <button
                      key={timeSlot}
                      type="button"
                      onClick={() => handleTimeSlotToggle(timeSlot)}
                      disabled={isPast}
                      className={`relative px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isPast
                          ? 'bg-[#f3f4f6] text-[#d1d5dc] cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-[#2a6ef0] text-white shadow-sm'
                          : 'bg-white text-[#4a5565] border border-[#e5e7eb] hover:border-[#2a6ef0]'
                      }`}
                    >
                      <Clock className="size-4 mx-auto mb-1" />
                      {timeSlot}
                      {isSelected && !isPast && (
                        <Check className="size-4 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#6b7280] mt-2">
                Selected: {selectedTimeSlots.length} session(s) ({selectedTimeSlots.length} hour{selectedTimeSlots.length !== 1 ? 's' : ''})
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || selectedTimeSlots.length < 2}
              className="w-full bg-[#2a6ef0] text-white px-6 py-3 rounded-lg hover:bg-[#1e5dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="size-5" />
              {isSubmitting ? 'Submitting...' : 'Submit Availability'}
            </button>
          </form>
        </div>

        {/* My Submitted Schedules */}
        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#dcfce7] p-3 rounded-lg">
                <Calendar className="size-6 text-[#16a34a]" />
              </div>
              <div>
                <h2 className="text-[#1f2937]">My Schedules</h2>
                <p className="text-[#6b7280] text-sm">Submitted availability</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-[#6b7280]">
                Loading schedules...
              </div>
            ) : Object.keys(schedulesByDate).length > 0 ? (
              Object.entries(schedulesByDate)
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .map(([date, dateSchedules]) => (
                  <div key={date} className="border border-[#e5e7eb] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-5 text-[#2a6ef0]" />
                        <span className="font-medium text-[#1f2937]">
                          {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <span className="text-xs text-[#6b7280] bg-[#f3f4f6] px-2 py-1 rounded">
                        {dateSchedules.reduce((sum, s) => sum + (s.timeSlots?.length || 0), 0)} session(s)
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {dateSchedules.map((schedule) => (
                        <div key={schedule.id} className="bg-[#f9fafb] rounded-lg p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="bg-[#2a6ef0] p-1.5 rounded">
                                <UserCircle className="size-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-[#1f2937]">
                                {schedule.hostName}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDelete(schedule.id)}
                              className="p-1.5 text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors flex-shrink-0"
                              title="Delete"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(schedule.timeSlots || []).map((timeSlot) => (
                              <span
                                key={timeSlot}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-[#2a6ef0] text-white text-xs rounded"
                              >
                                <Clock className="size-3" />
                                {timeSlot}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12 text-[#9ca3af]">
                <Calendar className="size-12 mx-auto mb-3 opacity-20" />
                <p>No availability submitted yet</p>
                <p className="text-sm mt-1">Submit your first availability to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-[#f0f5ff] border border-[#2a6ef0]/20 rounded-xl p-4 md:p-6">
        <div className="flex gap-3">
          <div className="bg-[#2a6ef0] p-2 rounded-lg h-fit">
            <Clock className="size-5 text-white" />
          </div>
          <div>
            <h3 className="text-[#1f2937] font-medium mb-1">Session Guidelines</h3>
            <ul className="text-[#6b7280] text-sm space-y-1">
              <li>• 1 session = 1 hour of live streaming</li>
              <li>• Minimum 2 sessions required per submission</li>
              <li>• You can submit multiple time slots for different dates</li>
              <li>• Admin will assign you to rooms based on your availability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}