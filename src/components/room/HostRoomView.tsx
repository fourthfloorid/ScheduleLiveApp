import { Tv, Tag, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRoomStore } from '../../store/roomStore';

interface HostRoomViewProps {
  userName: string;
  userId: string;
}

export default function HostRoomView({ userName, userId }: HostRoomViewProps) {
  const rooms = useRoomStore(state => state.rooms);

  // Get rooms where user is assigned
  const myRooms = rooms.filter(room => 
    room.assignments?.some(a => a.hostId === userId || a.hostName === userName)
  );

  // Get all assignments for this user across all rooms, grouped by brand
  const getMyAssignments = () => {
    const assignments: any[] = [];
    myRooms.forEach(room => {
      room.assignments?.forEach(assignment => {
        if (assignment.hostId === userId || assignment.hostName === userName) {
          assignments.push({
            roomId: room.id,
            roomName: room.name,
            roomDescription: room.description,
            brandId: assignment.brandId,
            brandName: assignment.brandName,
            sessions: assignment.sessions
          });
        }
      });
    });
    return assignments;
  };

  const myAssignments = getMyAssignments();

  // Group assignments by room
  const assignmentsByRoom: { [roomId: string]: any } = {};
  myAssignments.forEach(assignment => {
    if (!assignmentsByRoom[assignment.roomId]) {
      assignmentsByRoom[assignment.roomId] = {
        roomId: assignment.roomId,
        roomName: assignment.roomName,
        roomDescription: assignment.roomDescription,
        brands: []
      };
    }
    assignmentsByRoom[assignment.roomId].brands.push({
      brandName: assignment.brandName,
      sessions: assignment.sessions
    });
  });

  const groupedRooms = Object.values(assignmentsByRoom);

  if (myRooms.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 md:p-12 border border-[#e5e7eb] text-center">
        <div className="bg-[#f0f5ff] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Tv className="size-8 text-[#2a6ef0]" />
        </div>
        <p className="text-[#9ca3af] text-sm md:text-base mb-2">No rooms assigned to you yet</p>
        <p className="text-[#6b7280] text-sm">Please wait for admin to assign you to a room</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {groupedRooms.map((roomData) => (
          <div
            key={roomData.roomId}
            className="bg-white rounded-xl p-5 md:p-6 border border-[#e5e7eb] hover:border-[#2a6ef0] transition-all"
          >
            {/* Room Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-[#f0f5ff] p-3 rounded-xl flex-shrink-0">
                <Tv className="size-6 text-[#2a6ef0]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#1f2937] mb-1 truncate">{roomData.roomName}</h3>
                <p className="text-[#6b7280] text-sm line-clamp-2">
                  {roomData.roomDescription || 'No description'}
                </p>
              </div>
            </div>

            {/* My Brands Assignments */}
            <div className="border-t border-[#e5e7eb] pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="size-4 text-[#ec4899]" />
                <p className="text-[#4a5565] text-sm">Your Brands ({roomData.brands.length})</p>
              </div>
              
              <div className="space-y-2">
                {roomData.brands.map((brand: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-[#fce7f3] p-3 rounded-lg"
                  >
                    <p className="text-[#1f2937] font-medium text-sm mb-1">{brand.brandName}</p>
                    <div className="flex items-center gap-1 text-xs text-[#6b7280]">
                      <Clock className="size-3" />
                      <span>{brand.sessions} session{brand.sessions !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb]">
        <h3 className="text-[#1f2937] mb-4">Assignment Summary</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-[#f0f5ff] p-4 rounded-lg">
            <p className="text-[#6b7280] text-sm mb-1">Total Rooms</p>
            <p className="text-[#2a6ef0] font-semibold text-lg">{myRooms.length}</p>
          </div>
          <div className="bg-[#fce7f3] p-4 rounded-lg">
            <p className="text-[#6b7280] text-sm mb-1">Total Brands</p>
            <p className="text-[#ec4899] font-semibold text-lg">{myAssignments.length}</p>
          </div>
          <div className="bg-[#dcfce7] p-4 rounded-lg">
            <p className="text-[#6b7280] text-sm mb-1">Total Sessions</p>
            <p className="text-[#16a34a] font-semibold text-lg">
              {myAssignments.reduce((sum, a) => sum + a.sessions, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
