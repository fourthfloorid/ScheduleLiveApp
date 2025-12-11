import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  minDate?: string; // YYYY-MM-DD format
  maxDate?: string; // YYYY-MM-DD format
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select date',
  disabled = false,
  className = ''
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize current month based on selected value or today
  useEffect(() => {
    if (value) {
      setCurrentMonth(new Date(value + 'T00:00:00'));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    return { daysInMonth, startDayOfWeek, year, month };
  };

  const { daysInMonth, startDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(year, month, day);
    const dateString = selectedDate.toISOString().split('T')[0];
    
    // Check if date is within min/max range
    if (minDate && dateString < minDate) return;
    if (maxDate && dateString > maxDate) return;

    onChange(dateString);
    setIsOpen(false);
  };

  const isDateDisabled = (day: number) => {
    const dateString = new Date(year, month, day).toISOString().split('T')[0];
    if (minDate && dateString < minDate) return true;
    if (maxDate && dateString > maxDate) return true;
    return false;
  };

  const isDateSelected = (day: number) => {
    if (!value) return false;
    const dateString = new Date(year, month, day).toISOString().split('T')[0];
    return dateString === value;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days including empty slots for alignment
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Field */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2.5 border border-[#d1d5dc] rounded-lg bg-white text-left transition-all ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-[#2a6ef0] focus:outline-none focus:ring-2 focus:ring-[#2a6ef0]'
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <Calendar className="size-5 text-[#6b7280] flex-shrink-0" />
          <span className={value ? 'text-[#1f2937]' : 'text-[#9ca3af]'}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>
        <ChevronRight
          className={`size-5 text-[#6b7280] transition-transform ${
            isOpen ? 'rotate-90' : ''
          }`}
        />
      </button>

      {/* Dropdown Calendar */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-[#e5e7eb] rounded-xl shadow-lg z-50 p-4 w-full min-w-[320px]">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 hover:bg-[#f3f4f6] rounded-lg transition-colors"
            >
              <ChevronLeft className="size-5 text-[#4a5565]" />
            </button>
            <div className="font-medium text-[#1f2937]">
              {monthNames[month]} {year}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 hover:bg-[#f3f4f6] rounded-lg transition-colors"
            >
              <ChevronRight className="size-5 text-[#4a5565]" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((dayName) => (
              <div
                key={dayName}
                className="text-center text-xs font-medium text-[#6b7280] py-2"
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} />;
              }

              const disabled = isDateDisabled(day);
              const selected = isDateSelected(day);
              const today = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => !disabled && handleDateSelect(day)}
                  disabled={disabled}
                  className={`
                    aspect-square p-2 rounded-lg text-sm font-medium transition-all
                    ${disabled ? 'text-[#d1d5dc] cursor-not-allowed' : 'hover:bg-[#f0f5ff]'}
                    ${selected ? 'bg-[#2a6ef0] text-white hover:bg-[#1e5dd8]' : 'text-[#1f2937]'}
                    ${today && !selected ? 'ring-2 ring-[#2a6ef0] ring-inset' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today Button */}
          <div className="mt-4 pt-3 border-t border-[#e5e7eb]">
            <button
              type="button"
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                if (minDate && today < minDate) return;
                if (maxDate && today > maxDate) return;
                onChange(today);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-sm text-[#2a6ef0] hover:bg-[#f0f5ff] rounded-lg transition-colors font-medium"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
