import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, Search, AlertCircle, CheckCircle2, Users, Building2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { User } from '../../App';
import DatePicker from '../ui/DatePicker';

interface Brand {
  id: string;
  name: string;
  description?: string;
}

interface BrandSchedule {
  id: string;
  brandId: string;
  brandName: string;
  daysOfWeek: string[];
  timeSlots: string[];
  createdAt: string;
}

interface Room {
  id: string;
  name: string;
  description?: string;
  occupiedSlots: string[];
  availableSlots: string[];
  isFullyAvailable: boolean;
  currentAssignments: any[];
}

interface Host {
  id: string;
  name: string;
  email: string;
  brandTags: string[];
  availableSlots: string[];
  matchingSlots: string[];
  isFullyAvailable: boolean;
}

interface MatchResult {
  brandSchedule: BrandSchedule;
  date: string;
  dayOfWeek: string;
  availableRooms: Room[];
  availableHosts: Host[];
  summary: {
    totalRooms: number;
    fullyAvailableRooms: number;
    totalHosts: number;
    fullyAvailableHosts: number;
  };
}

interface BrandSchedulePageProps {
  user: User;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIME_SLOTS = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

export function BrandSchedulePage({ user }: BrandSchedulePageProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandSchedules, setBrandSchedules] = useState<BrandSchedule[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create form state
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  // Matching state
  const [matchingScheduleId, setMatchingScheduleId] = useState<string | null>(null);
  const [matchingDate, setMatchingDate] = useState('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedHost, setSelectedHost] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('Fetching brands and schedules...');
      console.log('Project ID:', projectId);
      console.log('Token:', token ? 'exists' : 'missing');
      
      const brandsUrl = `https://${projectId}.supabase.co/functions/v1/make-server-df75f45f/brands`;
      const schedulesUrl = `https://${projectId}.supabase.co/functions/v1/make-server-df75f45f/brand-schedules`;
      
      console.log('Brands URL:', brandsUrl);
      console.log('Schedules URL:', schedulesUrl);
      
      const [brandsRes, schedulesRes] = await Promise.all([
        fetch(brandsUrl, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(schedulesUrl, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      console.log('Brands response:', brandsRes.status, brandsRes.ok);
      console.log('Schedules response:', schedulesRes.status, schedulesRes.ok);

      if (!brandsRes.ok) {
        const errorData = await brandsRes.json().catch(() => ({}));
        console.error('Brands fetch error:', errorData);
        throw new Error(`Failed to fetch brands: ${errorData.error || brandsRes.statusText}`);
      }

      if (!schedulesRes.ok) {
        const errorData = await schedulesRes.json().catch(() => ({}));
        console.error('Schedules fetch error:', errorData);
        throw new Error(`Failed to fetch schedules: ${errorData.error || schedulesRes.statusText}`);
      }

      const brandsData = await brandsRes.json();
      const schedulesData = await schedulesRes.json();
      
      console.log('Brands data:', brandsData);
      console.log('Schedules data:', schedulesData);

      setBrands(brandsData.brands || []);
      setBrandSchedules(schedulesData.brandSchedules || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    if (!selectedBrand || selectedDays.length === 0 || selectedTimes.length === 0) {
      setError('Please select brand, days, and time slots');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      const brand = brands.find(b => b.id === selectedBrand);

      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-df75f45f/brand-schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          brandId: selectedBrand,
          brandName: brand?.name,
          daysOfWeek: selectedDays,
          timeSlots: selectedTimes
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create brand schedule');
      }

      setSuccess('Brand schedule created successfully!');
      setIsCreating(false);
      setSelectedBrand('');
      setSelectedDays([]);
      setSelectedTimes([]);
      fetchData();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      console.error('Create error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand schedule?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-df75f45f/brand-schedules/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Failed to delete brand schedule');
      }

      setSuccess('Brand schedule deleted successfully!');
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchSchedule = async () => {
    if (!matchingScheduleId || !matchingDate) {
      setError('Please select a schedule and date');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      
      // Get the selected schedule to show info
      const selectedSchedule = brandSchedules.find(s => s.id === matchingScheduleId);
      console.log('Selected brand schedule:', selectedSchedule);
      console.log('Selected date:', matchingDate);
      console.log('Date object:', new Date(matchingDate + 'T00:00:00'));
      console.log('Day of week:', new Date(matchingDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }));
      
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-df75f45f/match-brand-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          brandScheduleId: matchingScheduleId,
          date: matchingDate
        })
      });

      const data = await res.json();
      console.log('Match response:', data);

      if (!res.ok) {
        // Show more detailed error message
        const errorMsg = data.message || data.error || 'Failed to match schedule';
        console.error('Match error response:', data);
        throw new Error(errorMsg);
      }

      setMatchResult(data);
      setSelectedRoom(null);
      setSelectedHost(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Match error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignHost = async () => {
    if (!selectedRoom || !selectedHost || !matchResult) {
      setError('Please select both room and host');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      const room = matchResult.availableRooms.find(r => r.id === selectedRoom);
      const host = matchResult.availableHosts.find(h => h.id === selectedHost);

      if (!room || !host) {
        throw new Error('Room or host not found');
      }

      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-df75f45f/room-assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: room.id,
          roomName: room.name,
          date: matchResult.date,
          brandId: matchResult.brandSchedule.brandId,
          brandName: matchResult.brandSchedule.brandName,
          hostId: host.id,
          hostName: host.name,
          timeSlots: host.matchingSlots
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to assign host');
      }

      setSuccess(`Successfully assigned ${host.name} to ${room.name}!`);
      setMatchResult(null);
      setMatchingScheduleId(null);
      setMatchingDate('');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      console.error('Assign error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleTime = (time: string) => {
    setSelectedTimes(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  if (loading && !matchResult && !error && brands.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">Brand Schedule</h1>
          <p className="text-gray-600">
            Manage recurring schedules for brands and match them with available rooms and hosts
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Create Schedule Button */}
        {!isCreating && !matchResult && (
          <button
            onClick={() => setIsCreating(true)}
            className="mb-6 flex items-center gap-2 px-6 py-3 bg-[#2a6ef0] text-white rounded-lg hover:bg-[#1e5dd8] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Brand Schedule
          </button>
        )}

        {/* Create Form */}
        {isCreating && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-4">Create New Brand Schedule</h2>

            {/* Select Brand */}
            <div className="mb-4">
              <label className="block text-[#364153] mb-2 text-sm font-medium">Select Brand *</label>
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#d1d5dc] rounded-lg bg-white focus:ring-2 focus:ring-[#2a6ef0] focus:outline-none appearance-none cursor-pointer transition-all hover:border-[#2a6ef0]"
                >
                  <option value="">Select brand</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-5 h-5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Select Days */}
            <div className="mb-4">
              <label className="block text-[#364153] mb-2 text-sm font-medium">Select Days of Week *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {DAYS_OF_WEEK.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedDays.includes(day)
                        ? 'bg-[#2a6ef0] text-white border-[#2a6ef0]'
                        : 'bg-white text-[#4a5565] border-[#e5e7eb] hover:border-[#2a6ef0]'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Time Slots */}
            <div className="mb-6">
              <label className="block text-[#364153] mb-2 text-sm font-medium">Select Time Slots *</label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {TIME_SLOTS.map(time => (
                  <button
                    key={time}
                    onClick={() => toggleTime(time)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      selectedTimes.includes(time)
                        ? 'bg-[#2a6ef0] text-white border-[#2a6ef0]'
                        : 'bg-white text-[#4a5565] border-[#e5e7eb] hover:border-[#2a6ef0]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCreateSchedule}
                disabled={loading || !selectedBrand || selectedDays.length === 0 || selectedTimes.length === 0}
                className="px-6 py-3 bg-[#2a6ef0] text-white rounded-lg hover:bg-[#1e5dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Schedule'}
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setSelectedBrand('');
                  setSelectedDays([]);
                  setSelectedTimes([]);
                }}
                className="px-6 py-3 bg-[#f3f4f6] text-[#4a5565] rounded-lg hover:bg-[#e5e7eb] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Match Schedule Section */}
        {!isCreating && !matchResult && brandSchedules.length > 0 && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-2">Match Brand Schedule</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Select a brand schedule and date to find available rooms and hosts
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[#364153] mb-2 text-sm font-medium">Select Brand Schedule *</label>
                <div className="relative">
                  <select
                    value={matchingScheduleId || ''}
                    onChange={(e) => setMatchingScheduleId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#d1d5dc] rounded-lg bg-white focus:ring-2 focus:ring-[#2a6ef0] focus:outline-none appearance-none cursor-pointer transition-all hover:border-[#2a6ef0]"
                  >
                    <option value="">Select schedule</option>
                    {brandSchedules.map(schedule => (
                      <option key={schedule.id} value={schedule.id}>
                        {schedule.brandName} - {schedule.daysOfWeek.join(', ')} ({schedule.timeSlots.length} slots)
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[#364153] mb-2 text-sm font-medium">Select Date *</label>
                <DatePicker
                  value={matchingDate}
                  onChange={(date) => setMatchingDate(date)}
                  minDate={new Date().toISOString().split('T')[0]}
                  placeholder="Choose a date"
                />
              </div>
            </div>

            <button
              onClick={handleMatchSchedule}
              disabled={loading || !matchingScheduleId || !matchingDate}
              className="w-full md:w-auto bg-[#2a6ef0] text-white px-6 py-3 rounded-lg hover:bg-[#1e5dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Searching...' : 'Find Available Matches'}
            </button>
          </div>
        )}

        {/* Match Results */}
        {matchResult && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-gray-900">Match Results</h2>
                  <p className="text-gray-600 text-sm">
                    {matchResult.brandSchedule.brandName} - {matchResult.dayOfWeek}, {new Date(matchResult.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Time slots: {matchResult.brandSchedule.timeSlots.join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMatchResult(null);
                    setMatchingScheduleId(null);
                    setMatchingDate('');
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-900">Available Rooms</span>
                  </div>
                  <p className="text-blue-800 text-sm">
                    {matchResult.summary.totalRooms} rooms ({matchResult.summary.fullyAvailableRooms} fully available)
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="text-green-900">Available Hosts</span>
                  </div>
                  <p className="text-green-800 text-sm">
                    {matchResult.summary.totalHosts} hosts ({matchResult.summary.fullyAvailableHosts} fully available)
                  </p>
                </div>
              </div>
            </div>

            {/* Rooms & Hosts Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Available Rooms */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4">Select Room</h3>
                <div className="space-y-3">
                  {matchResult.availableRooms.map(room => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedRoom === room.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-gray-900">{room.name}</h4>
                          {room.description && (
                            <p className="text-gray-600 text-sm">{room.description}</p>
                          )}
                        </div>
                        {room.isFullyAvailable && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Fully Available
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Available: {room.availableSlots.join(', ')}
                      </div>
                      {room.occupiedSlots.length > 0 && (
                        <div className="text-sm text-red-600 mt-1">
                          Occupied: {room.occupiedSlots.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                  {matchResult.availableRooms.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No rooms available for this schedule</p>
                  )}
                </div>
              </div>

              {/* Available Hosts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4">Select Host</h3>
                <div className="space-y-3">
                  {matchResult.availableHosts.map(host => (
                    <div
                      key={host.id}
                      onClick={() => setSelectedHost(host.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedHost === host.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-gray-900">{host.name}</h4>
                          <p className="text-gray-600 text-sm">{host.email}</p>
                        </div>
                        {host.isFullyAvailable && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Full Match
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-green-700">
                        Matching slots: {host.matchingSlots.join(', ')}
                      </div>
                      {host.brandTags.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Brands: {host.brandTags.map(tag => brands.find(b => b.id === tag)?.name || tag).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                  {matchResult.availableHosts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No hosts available for this schedule</p>
                  )}
                </div>
              </div>
            </div>

            {/* Assign Button */}
            {selectedRoom && selectedHost && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <button
                  onClick={handleAssignHost}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Assigning...' : 'Assign Host to Room'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Existing Schedules List */}
        {!isCreating && !matchResult && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-gray-900">Brand Schedules</h2>
              <p className="text-gray-600 text-sm">Recurring schedules for brands</p>
            </div>

            <div className="divide-y divide-gray-200">
              {brandSchedules.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No brand schedules yet</p>
                  <p className="text-gray-400 text-sm mt-1">Create your first brand schedule to get started</p>
                </div>
              ) : (
                brandSchedules.map(schedule => (
                  <div key={schedule.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{schedule.brandName}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{schedule.daysOfWeek.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{schedule.timeSlots.length} time slots</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {schedule.timeSlots.map(time => (
                            <span
                              key={time}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                            >
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete schedule"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}