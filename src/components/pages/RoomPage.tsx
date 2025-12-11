import { useState, useEffect } from 'react';
import { User as UserType } from '../../App';
import { Tv, Plus, Calendar, Tag, UserCircle, Clock, Trash2, Edit2, ChevronDown } from 'lucide-react';
import { roomAPI, brandAPI, assignmentAPI, scheduleAPI } from '../../utils/api';
import DatePicker from '../ui/DatePicker';

interface RoomPageProps {
  user: UserType;
}

interface Room {
  id: string;
  name: string;
  description: string;
}

interface Brand {
  id: string;
  name: string;
  description: string;
}

interface Assignment {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  brandId: string;
  brandName: string;
  hostId: string;
  hostName: string;
  timeSlots: string[];
  createdAt: string;
}

interface HostAvailability {
  id: string;
  hostId: string;
  hostName: string;
  date: string;
  timeSlots: string[];
}

export default function RoomPage({ user }: RoomPageProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [hostAvailability, setHostAvailability] = useState<HostAvailability[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  
  // Room form
  const [roomForm, setRoomForm] = useState({ name: '', description: '' });
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  // Assignment form
  const [assignForm, setAssignForm] = useState({
    roomId: '',
    date: '',
    brandId: '',
    hostId: '',
    timeSlots: [] as string[]
  });

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (assignForm.date) {
      fetchHostAvailability(assignForm.date);
    } else {
      setHostAvailability([]);
    }
  }, [assignForm.date]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedRooms, fetchedBrands, fetchedAssignments] = await Promise.all([
        roomAPI.getAll(),
        brandAPI.getAll(),
        assignmentAPI.getAll()
      ]);
      setRooms(fetchedRooms);
      setBrands(fetchedBrands);
      setAssignments(fetchedAssignments);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHostAvailability = async (date: string) => {
    try {
      const availability = await scheduleAPI.getHostAvailability(date);
      setHostAvailability(availability);
    } catch (error) {
      console.error('Failed to fetch host availability:', error);
      setHostAvailability([]);
    }
  };

  // Room CRUD
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await roomAPI.update(editingRoom.id, roomForm);
      } else {
        await roomAPI.create(roomForm);
      }
      await fetchData();
      setShowRoomModal(false);
      setRoomForm({ name: '', description: '' });
      setEditingRoom(null);
    } catch (error: any) {
      alert(error.message || 'Failed to save room');
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setRoomForm({ name: room.name, description: room.description });
    setShowRoomModal(true);
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      await roomAPI.delete(id);
      await fetchData();
    } catch (error: any) {
      alert(error.message || 'Failed to delete room');
    }
  };

  // Assignment CRUD
  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (assignForm.timeSlots.length === 0) {
      alert('Please select at least one time slot');
      return;
    }

    try {
      const room = rooms.find(r => r.id === assignForm.roomId);
      const brand = brands.find(b => b.id === assignForm.brandId);
      const host = hostAvailability.find(h => h.hostId === assignForm.hostId);

      await assignmentAPI.create({
        roomId: assignForm.roomId,
        roomName: room?.name || '',
        date: assignForm.date,
        brandId: assignForm.brandId,
        brandName: brand?.name || '',
        hostId: assignForm.hostId,
        hostName: host?.hostName || '',
        timeSlots: assignForm.timeSlots
      });

      await fetchData();
      setShowAssignModal(false);
      setAssignForm({ roomId: '', date: '', brandId: '', hostId: '', timeSlots: [] });
      alert('Host assigned successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to create assignment');
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await assignmentAPI.delete(id);
      await fetchData();
    } catch (error: any) {
      alert(error.message || 'Failed to delete assignment');
    }
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    // Check if time slot is in the past (for today's date)
    if (isTimeSlotPast(timeSlot)) {
      return; // Don't allow selection of past time slots
    }
    
    setAssignForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.includes(timeSlot)
        ? prev.timeSlots.filter(t => t !== timeSlot)
        : [...prev.timeSlots, timeSlot].sort()
    }));
  };

  // Check if a time slot is in the past
  const isTimeSlotPast = (timeSlot: string): boolean => {
    if (!assignForm.date) return false;
    
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    
    // Only check for today's date
    if (assignForm.date !== currentDate) return false;
    
    const currentHour = now.getHours();
    const timeHour = parseInt(timeSlot.split(':')[0]);
    
    // Disable if time slot hour has passed or is current hour
    return timeHour <= currentHour;
  };

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Selected host's available time slots
  const selectedHostAvailability = hostAvailability.find(h => h.hostId === assignForm.hostId);

  // Group assignments by room
  const assignmentsByRoom = assignments.reduce((acc, assignment) => {
    if (!acc[assignment.roomId]) {
      acc[assignment.roomId] = [];
    }
    acc[assignment.roomId].push(assignment);
    return acc;
  }, {} as Record<string, Assignment[]>);

  if (!isAdmin) {
    return (
      <div className="p-4 md:p-8">
        {/* Host View - Show their assignments */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-[#1f2937] mb-2">My Room Assignments</h1>
          <p className="text-[#6b7280] text-sm md:text-base">
            Your scheduled live streaming sessions
          </p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl p-12 text-center border border-[#e5e7eb]">
              <p className="text-[#6b7280]">Loading assignments...</p>
            </div>
          ) : assignments.length > 0 ? (
            assignments
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#f0f5ff] p-3 rounded-lg">
                        <Tv className="size-6 text-[#2a6ef0]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280]">Room</p>
                        <p className="text-[#1f2937] font-medium">{assignment.roomName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-[#fef3c7] p-3 rounded-lg">
                        <Tag className="size-6 text-[#f59e0b]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280]">Brand</p>
                        <p className="text-[#1f2937] font-medium">{assignment.brandName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-[#dcfce7] p-3 rounded-lg">
                        <Calendar className="size-6 text-[#16a34a]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280]">Date</p>
                        <p className="text-[#1f2937] font-medium">
                          {new Date(assignment.date + 'T00:00:00').toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-[#fce7f3] p-3 rounded-lg">
                        <Clock className="size-6 text-[#ec4899]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280]">Time Slots</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {assignment.timeSlots.map(slot => (
                            <span key={slot} className="text-xs px-2 py-0.5 bg-[#f3f4f6] text-[#4a5565] rounded">
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-[#e5e7eb]">
              <Tv className="size-16 mx-auto mb-4 text-[#9ca3af] opacity-20" />
              <p className="text-[#9ca3af]">No room assignments yet</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#1f2937] mb-2">Room Management</h1>
          <p className="text-[#6b7280] text-sm md:text-base">
            Manage rooms and assign hosts to live streaming sessions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingRoom(null);
              setRoomForm({ name: '', description: '' });
              setShowRoomModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#2a6ef0] text-white rounded-lg hover:bg-[#1e5dd8] transition-colors"
          >
            <Plus className="size-5" />
            Add Room
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition-colors"
          >
            <Plus className="size-5" />
            Assign Host
          </button>
        </div>
      </div>

      {/* Rooms List */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center border border-[#e5e7eb]">
            <p className="text-[#6b7280]">Loading rooms...</p>
          </div>
        ) : rooms.length > 0 ? (
          rooms.map((room) => {
            const roomAssignments = assignmentsByRoom[room.id] || [];
            
            return (
              <div key={room.id} className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
                {/* Room Header */}
                <div className="p-6 bg-[#f9fafb] border-b border-[#e5e7eb]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#2a6ef0] p-3 rounded-lg">
                        <Tv className="size-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-[#1f2937]">{room.name}</h2>
                        <p className="text-[#6b7280] text-sm">{room.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="p-2 text-[#2a6ef0] hover:bg-[#f0f5ff] rounded-lg transition-colors"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="p-2 text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Assignments */}
                <div className="p-6">
                  {roomAssignments.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-[#6b7280] mb-3">Scheduled Sessions</h3>
                      {roomAssignments
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .map((assignment) => (
                          <div key={assignment.id} className="bg-[#f9fafb] rounded-lg p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                                <div>
                                  <p className="text-xs text-[#6b7280] mb-1">Date</p>
                                  <p className="text-sm font-medium text-[#1f2937]">
                                    {new Date(assignment.date + 'T00:00:00').toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-[#6b7280] mb-1">Brand</p>
                                  <p className="text-sm font-medium text-[#1f2937]">{assignment.brandName}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-[#6b7280] mb-1">Host</p>
                                  <p className="text-sm font-medium text-[#1f2937]">{assignment.hostName}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-[#6b7280] mb-1">Time Slots</p>
                                  <div className="flex flex-wrap gap-1">
                                    {assignment.timeSlots.map(slot => (
                                      <span key={slot} className="text-xs px-2 py-0.5 bg-white text-[#4a5565] rounded border border-[#e5e7eb]">
                                        {slot}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteAssignment(assignment.id)}
                                className="p-2 text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors flex-shrink-0"
                                title="Delete assignment"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#9ca3af]">
                      <Calendar className="size-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No sessions scheduled yet</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-[#e5e7eb]">
            <Tv className="size-16 mx-auto mb-4 text-[#9ca3af] opacity-20" />
            <p className="text-[#9ca3af] mb-4">No rooms created yet</p>
            <button
              onClick={() => setShowRoomModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a6ef0] text-white rounded-lg hover:bg-[#1e5dd8] transition-colors"
            >
              <Plus className="size-5" />
              Create First Room
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-[#1f2937] mb-4">
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </h2>
            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div>
                <label className="block text-[#364153] mb-2 text-sm">Room Name</label>
                <input
                  type="text"
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0]"
                  placeholder="e.g., Room A"
                  required
                />
              </div>
              <div>
                <label className="block text-[#364153] mb-2 text-sm">Description</label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0]"
                  placeholder="Brief description"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#2a6ef0] text-white px-6 py-2 rounded-lg hover:bg-[#1e5dd8] transition-colors"
                >
                  {editingRoom ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRoomModal(false);
                    setEditingRoom(null);
                    setRoomForm({ name: '', description: '' });
                  }}
                  className="flex-1 bg-[#f3f4f6] text-[#4a5565] px-6 py-2 rounded-lg hover:bg-[#e5e7eb] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Host Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
            <h2 className="text-[#1f2937] mb-4">Assign Host to Room</h2>
            <form onSubmit={handleSaveAssignment} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#364153] mb-2 text-sm">Select Room</label>
                  <div className="relative">
                    <select
                      value={assignForm.roomId}
                      onChange={(e) => setAssignForm({ ...assignForm, roomId: e.target.value })}
                      className="w-full px-4 py-2 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] appearance-none pr-8"
                      required
                    >
                      <option value="">Choose a room...</option>
                      {rooms.map(room => (
                        <option key={room.id} value={room.id}>{room.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-[#6b7280] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[#364153] mb-2 text-sm">Select Date</label>
                  <DatePicker
                    value={assignForm.date}
                    onChange={(date) => setAssignForm({ ...assignForm, date, hostId: '', timeSlots: [] })}
                    minDate={today}
                    placeholder="Choose a date"
                  />
                </div>

                <div>
                  <label className="block text-[#364153] mb-2 text-sm">Select Brand</label>
                  <div className="relative">
                    <select
                      value={assignForm.brandId}
                      onChange={(e) => setAssignForm({ ...assignForm, brandId: e.target.value })}
                      className="w-full px-4 py-2 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] appearance-none pr-8"
                      required
                    >
                      <option value="">Choose a brand...</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-[#6b7280] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[#364153] mb-2 text-sm">Select Host</label>
                  <div className="relative">
                    <select
                      value={assignForm.hostId}
                      onChange={(e) => setAssignForm({ ...assignForm, hostId: e.target.value, timeSlots: [] })}
                      className="w-full px-4 py-2 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] appearance-none pr-8"
                      required
                      disabled={!assignForm.date}
                    >
                      <option value="">
                        {!assignForm.date ? 'Select date first...' : hostAvailability.length > 0 ? 'Choose a host...' : 'No hosts available'}
                      </option>
                      {hostAvailability.map(host => (
                        <option key={host.hostId} value={host.hostId}>
                          {host.hostName} ({host.timeSlots.length} slots)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-[#6b7280] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Time Slots Selection */}
              {selectedHostAvailability && (
                <div>
                  <label className="block text-[#364153] mb-3 text-sm">Select Time Slots</label>
                  <div className="bg-[#f9fafb] rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {selectedHostAvailability.timeSlots.map((timeSlot) => {
                        const isSelected = assignForm.timeSlots.includes(timeSlot);
                        const isPast = isTimeSlotPast(timeSlot);
                        return (
                          <button
                            key={timeSlot}
                            type="button"
                            onClick={() => handleTimeSlotToggle(timeSlot)}
                            disabled={isPast}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isPast
                                ? 'bg-[#f3f4f6] text-[#d1d5dc] cursor-not-allowed opacity-50'
                                : isSelected
                                ? 'bg-[#2a6ef0] text-white'
                                : 'bg-white text-[#4a5565] border border-[#e5e7eb] hover:border-[#2a6ef0]'
                            }`}
                          >
                            {timeSlot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-xs text-[#6b7280] mt-2">
                    Selected: {assignForm.timeSlots.length} slot(s)
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={!selectedHostAvailability || assignForm.timeSlots.length === 0}
                  className="flex-1 bg-[#16a34a] text-white px-6 py-2 rounded-lg hover:bg-[#15803d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign Host
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssignForm({ roomId: '', date: '', brandId: '', hostId: '', timeSlots: [] });
                  }}
                  className="flex-1 bg-[#f3f4f6] text-[#4a5565] px-6 py-2 rounded-lg hover:bg-[#e5e7eb] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}