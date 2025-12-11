import { useState, useEffect } from 'react';
import { useRoomStore, RoomAssignment } from '../../store/roomStore';
import { useBrandStore } from '../../store/brandStore';
import { useScheduleStore } from '../../store/scheduleStore';
import { Plus, Edit2, Trash2, UserPlus, Users, Tv, ChevronDown, Calendar, Tag } from 'lucide-react';
import { userAPI } from '../../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminRoomView() {
  const rooms = useRoomStore(state => state.rooms);
  const addRoom = useRoomStore(state => state.addRoom);
  const updateRoom = useRoomStore(state => state.updateRoom);
  const deleteRoom = useRoomStore(state => state.deleteRoom);
  const brands = useBrandStore(state => state.brands);
  const schedules = useScheduleStore(state => state.schedules);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [assigningRoomId, setAssigningRoomId] = useState<string | null>(null);
  
  const [roomForm, setRoomForm] = useState({
    name: '',
    description: ''
  });

  const [assignmentForm, setAssignmentForm] = useState({
    brandId: '',
    hostId: '',
    sessions: 1
  });

  const [availableHosts, setAvailableHosts] = useState<User[]>([]);

  useEffect(() => {
    fetchHosts();
  }, []);

  const fetchHosts = async () => {
    try {
      const users = await userAPI.getAll();
      const hosts = users.filter((u: User) => u.role === 'host');
      setAvailableHosts(hosts);
    } catch (error) {
      console.error('Failed to fetch hosts:', error);
    }
  };

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomForm.name.trim()) return;

    if (editingId) {
      const existingRoom = rooms.find(r => r.id === editingId);
      updateRoom(editingId, {
        ...roomForm,
        assignments: existingRoom?.assignments || []
      });
      setEditingId(null);
    } else {
      addRoom({ ...roomForm, assignments: [] });
      setIsAdding(false);
    }
    setRoomForm({ name: '', description: '' });
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentForm.brandId || !assignmentForm.hostId || !assigningRoomId) return;

    const room = rooms.find(r => r.id === assigningRoomId);
    const brand = brands.find(b => b.id === assignmentForm.brandId);
    const host = availableHosts.find(h => h.id === assignmentForm.hostId);
    
    if (!room || !brand || !host) return;

    // Check if this host is already assigned to this brand in this room
    const existingAssignment = room.assignments?.find(
      a => a.hostId === host.id && a.brandId === brand.id
    );

    if (existingAssignment) {
      alert(`${host.name} is already assigned to ${brand.name} in this room`);
      return;
    }

    const newAssignment: RoomAssignment = {
      brandId: brand.id,
      brandName: brand.name,
      hostId: host.id,
      hostName: host.name,
      sessions: assignmentForm.sessions
    };

    updateRoom(assigningRoomId, {
      ...room,
      assignments: [...(room.assignments || []), newAssignment]
    });

    setAssignmentForm({ brandId: '', hostId: '', sessions: 1 });
    setAssigningRoomId(null);
  };

  const removeAssignment = (roomId: string, assignmentIndex: number) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const newAssignments = room.assignments?.filter((_, idx) => idx !== assignmentIndex) || [];
    updateRoom(roomId, { ...room, assignments: newAssignments });
  };

  const handleEdit = (id: string) => {
    const room = rooms.find(r => r.id === id);
    if (room) {
      setRoomForm({
        name: room.name,
        description: room.description
      });
      setEditingId(id);
      setIsAdding(true);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setRoomForm({ name: '', description: '' });
  };

  const getHostAvailability = (hostId: string) => {
    const hostSchedules = schedules.filter(s => s.hostId === hostId);
    const totalAvailable = hostSchedules.reduce((sum, s) => sum + s.availableSessions, 0);
    const totalAssigned = hostSchedules.reduce((sum, s) => sum + s.assignedSessions, 0);
    return {
      totalAvailable,
      totalAssigned,
      remaining: totalAvailable - totalAssigned
    };
  };

  // Group assignments by brand
  const getAssignmentsByBrand = (room: any) => {
    const grouped: { [brandId: string]: any } = {};
    
    room.assignments?.forEach((assignment: RoomAssignment, index: number) => {
      if (!grouped[assignment.brandId]) {
        grouped[assignment.brandId] = {
          brandId: assignment.brandId,
          brandName: assignment.brandName,
          hosts: []
        };
      }
      grouped[assignment.brandId].hosts.push({ ...assignment, index });
    });

    return Object.values(grouped);
  };

  return (
    <div className="max-w-6xl">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <p className="text-[#6b7280] text-sm md:text-base">Total Rooms: {rooms.length}</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2a6ef0] text-white px-4 py-2 rounded-lg hover:bg-[#1e5dd8] transition-colors touch-manipulation"
          >
            <Plus className="size-5" />
            Create Room
          </button>
        )}
      </div>

      {/* Add/Edit Room Form */}
      {isAdding && (
        <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb] mb-6">
          <h3 className="text-[#1f2937] mb-4">
            {editingId ? 'Edit Room' : 'Create New Room'}
          </h3>
          <form onSubmit={handleRoomSubmit} className="space-y-4">
            <div>
              <label className="block text-[#364153] mb-2 text-sm md:text-base">Room Name</label>
              <input
                type="text"
                value={roomForm.name}
                onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] text-base"
                placeholder="e.g. Studio A, Studio B"
                required
              />
            </div>
            <div>
              <label className="block text-[#364153] mb-2 text-sm md:text-base">Description</label>
              <textarea
                value={roomForm.description}
                onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] text-base"
                placeholder="Room description"
                rows={3}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#2a6ef0] text-white px-6 py-2 rounded-lg hover:bg-[#1e5dd8] transition-colors touch-manipulation"
              >
                {editingId ? 'Update' : 'Create'} Room
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto bg-[#f3f4f6] text-[#4a5565] px-6 py-2 rounded-lg hover:bg-[#e5e7eb] transition-colors touch-manipulation"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms List */}
      <div className="grid gap-6">
        {rooms.map(room => {
          const assignmentsByBrand = getAssignmentsByBrand(room);
          
          return (
            <div
              key={room.id}
              className="bg-white rounded-xl p-5 md:p-6 border border-[#e5e7eb]"
            >
              {/* Room Header */}
              <div className="flex justify-between items-start gap-3 mb-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="bg-[#f0f5ff] p-3 rounded-xl flex-shrink-0">
                    <Tv className="size-6 text-[#2a6ef0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#1f2937] mb-1">{room.name}</h3>
                    <p className="text-[#6b7280] text-sm">{room.description || 'No description'}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(room.id)}
                    className="p-2 text-[#2a6ef0] hover:bg-[#f3f4f6] rounded-lg transition-colors touch-manipulation"
                    title="Edit room"
                  >
                    <Edit2 className="size-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this room?')) {
                        deleteRoom(room.id);
                      }
                    }}
                    className="p-2 text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors touch-manipulation"
                    title="Delete room"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              {/* Assignments Section */}
              <div className="border-t border-[#e5e7eb] pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="size-5 text-[#6b7280]" />
                    <h4 className="text-[#1f2937] text-sm">
                      Assignments ({room.assignments?.length || 0})
                    </h4>
                  </div>
                  {assigningRoomId !== room.id && (
                    <button
                      onClick={() => setAssigningRoomId(room.id)}
                      className="flex items-center gap-1 text-[#2a6ef0] text-sm hover:underline"
                    >
                      <UserPlus className="size-4" />
                      Assign Host
                    </button>
                  )}
                </div>

                {/* Assignment Form */}
                {assigningRoomId === room.id && (
                  <form onSubmit={handleAssignmentSubmit} className="bg-[#f9fafb] p-4 rounded-lg mb-4 space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      {/* Brand Select */}
                      <div>
                        <label className="block text-[#364153] mb-2 text-sm">Select Brand</label>
                        <div className="relative">
                          <select
                            value={assignmentForm.brandId}
                            onChange={(e) => setAssignmentForm({ ...assignmentForm, brandId: e.target.value })}
                            className="w-full px-3 py-2 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] text-sm appearance-none pr-8"
                            required
                          >
                            <option value="">Select brand...</option>
                            {brands.map(brand => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-5 text-[#6b7280] pointer-events-none" />
                        </div>
                      </div>

                      {/* Host Select */}
                      <div>
                        <label className="block text-[#364153] mb-2 text-sm">Select Host</label>
                        <div className="relative">
                          <select
                            value={assignmentForm.hostId}
                            onChange={(e) => setAssignmentForm({ ...assignmentForm, hostId: e.target.value })}
                            className="w-full px-3 py-2 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] text-sm appearance-none pr-8"
                            required
                          >
                            <option value="">Select host...</option>
                            {availableHosts.map(host => {
                              const availability = getHostAvailability(host.id);
                              return (
                                <option key={host.id} value={host.id}>
                                  {host.name} ({availability.remaining}/{availability.totalAvailable} available)
                                </option>
                              );
                            })}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-5 text-[#6b7280] pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Sessions Input */}
                    <div>
                      <label className="block text-[#364153] mb-2 text-sm">Number of Sessions</label>
                      <input
                        type="number"
                        min="1"
                        value={assignmentForm.sessions}
                        onChange={(e) => setAssignmentForm({ ...assignmentForm, sessions: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] text-sm"
                        required
                      />
                      {assignmentForm.hostId && (
                        <p className="text-xs text-[#6b7280] mt-1">
                          Host has {getHostAvailability(assignmentForm.hostId).remaining} sessions available
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-[#2a6ef0] text-white px-4 py-2 rounded-lg hover:bg-[#1e5dd8] transition-colors text-sm touch-manipulation"
                      >
                        Assign
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAssigningRoomId(null);
                          setAssignmentForm({ brandId: '', hostId: '', sessions: 1 });
                        }}
                        className="flex-1 bg-[#f3f4f6] text-[#4a5565] px-4 py-2 rounded-lg hover:bg-[#e5e7eb] transition-colors text-sm touch-manipulation"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Assignments List - Grouped by Brand */}
                {assignmentsByBrand.length > 0 ? (
                  <div className="space-y-4">
                    {assignmentsByBrand.map((brandGroup: any) => (
                      <div key={brandGroup.brandId} className="border border-[#e5e7eb] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="size-4 text-[#ec4899]" />
                          <h5 className="text-[#1f2937] font-medium text-sm">{brandGroup.brandName}</h5>
                          <span className="text-xs text-[#6b7280]">
                            ({brandGroup.hosts.length} host{brandGroup.hosts.length !== 1 ? 's' : ''})
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {brandGroup.hosts.map((assignment: any) => {
                            const availability = getHostAvailability(assignment.hostId);
                            return (
                              <div
                                key={assignment.index}
                                className="flex items-center justify-between p-2 bg-[#f9fafb] rounded-lg"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-[#1f2937] text-sm font-medium truncate">
                                    {assignment.hostName}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <p className="text-xs text-[#6b7280]">
                                      {assignment.sessions} session{assignment.sessions !== 1 ? 's' : ''}
                                    </p>
                                    <p className="text-xs text-[#16a34a]">
                                      {availability.remaining} remaining
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remove ${assignment.hostName} from ${brandGroup.brandName}?`)) {
                                      removeAssignment(room.id, assignment.index);
                                    }
                                  }}
                                  className="p-2 text-[#ef4444] hover:bg-[#fee] rounded-lg transition-colors touch-manipulation flex-shrink-0"
                                  title="Remove assignment"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#9ca3af] text-sm text-center py-4">No assignments yet</p>
                )}
              </div>
            </div>
          );
        })}

        {rooms.length === 0 && !isAdding && (
          <div className="bg-white rounded-xl p-8 md:p-12 border border-[#e5e7eb] text-center">
            <div className="bg-[#f0f5ff] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Tv className="size-8 text-[#2a6ef0]" />
            </div>
            <p className="text-[#9ca3af] mb-4">No rooms created yet</p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-[#2a6ef0] hover:underline"
            >
              Create your first room
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
