import { useScheduleStore } from '../../store/scheduleStore';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function AdminSchedule() {
  const schedules = useScheduleStore(state => state.schedules);

  // Group by host
  const hostGroups: { [hostId: string]: any } = {};
  schedules.forEach(schedule => {
    if (!hostGroups[schedule.hostId]) {
      hostGroups[schedule.hostId] = {
        hostId: schedule.hostId,
        hostName: schedule.hostName,
        schedules: []
      };
    }
    hostGroups[schedule.hostId].schedules.push(schedule);
  });

  const hosts = Object.values(hostGroups);

  // Calculate totals
  const totalAvailable = schedules.reduce((sum, s) => sum + s.availableSessions, 0);
  const totalAssigned = schedules.reduce((sum, s) => sum + s.assignedSessions, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb]">
          <div className="flex items-center gap-3">
            <div className="bg-[#dbeafe] p-3 rounded-lg">
              <Users className="size-5 text-[#2a6ef0]" />
            </div>
            <div>
              <p className="text-[#6b7280] text-sm">Total Hosts</p>
              <p className="text-[#1f2937] font-semibold text-lg">{hosts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb]">
          <div className="flex items-center gap-3">
            <div className="bg-[#dcfce7] p-3 rounded-lg">
              <Clock className="size-5 text-[#16a34a]" />
            </div>
            <div>
              <p className="text-[#6b7280] text-sm">Total Available</p>
              <p className="text-[#1f2937] font-semibold text-lg">{totalAvailable}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb]">
          <div className="flex items-center gap-3">
            <div className="bg-[#fce7f3] p-3 rounded-lg">
              <CheckCircle className="size-5 text-[#ec4899]" />
            </div>
            <div>
              <p className="text-[#6b7280] text-sm">Total Assigned</p>
              <p className="text-[#1f2937] font-semibold text-lg">{totalAssigned}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb]">
          <div className="flex items-center gap-3">
            <div className="bg-[#fef3c7] p-3 rounded-lg">
              <Calendar className="size-5 text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-[#6b7280] text-sm">Remaining</p>
              <p className="text-[#1f2937] font-semibold text-lg">{totalAvailable - totalAssigned}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Host Availability List */}
      <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
        <h2 className="text-[#1f2937] mb-4 flex items-center gap-2">
          <Users className="size-5" />
          Host Availability Overview
        </h2>

        {hosts.length > 0 ? (
          <div className="space-y-6">
            {hosts.map((host: any) => {
              const totalAvail = host.schedules.reduce((sum: number, s: any) => sum + s.availableSessions, 0);
              const totalAssign = host.schedules.reduce((sum: number, s: any) => sum + s.assignedSessions, 0);
              const remaining = totalAvail - totalAssign;

              return (
                <div key={host.hostId} className="border border-[#e5e7eb] rounded-lg p-4">
                  {/* Host Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[#1f2937] font-medium">{host.hostName}</h3>
                      <p className="text-[#6b7280] text-sm mt-1">
                        {host.schedules.length} day{host.schedules.length !== 1 ? 's' : ''} submitted
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-xs text-[#6b7280]">Available</p>
                        <p className="text-[#2a6ef0] font-semibold">{totalAvail}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-[#6b7280]">Assigned</p>
                        <p className="text-[#16a34a] font-semibold">{totalAssign}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-[#6b7280]">Remaining</p>
                        <p className="text-[#f59e0b] font-semibold">{remaining}</p>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {host.schedules
                      .sort((a: any, b: any) => a.date.localeCompare(b.date))
                      .map((schedule: any) => {
                        const date = parseISO(schedule.date);
                        const percentAssigned = (schedule.assignedSessions / schedule.availableSessions) * 100;
                        
                        return (
                          <div
                            key={schedule.id}
                            className="bg-[#f9fafb] p-3 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[#1f2937] text-sm font-medium">
                                {format(date, 'EEE, MMM d')}
                              </p>
                              {schedule.assignedSessions > 0 && (
                                <CheckCircle className="size-4 text-[#16a34a]" />
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <Clock className="size-3 text-[#6b7280]" />
                                <span className="text-[#1f2937]">
                                  {schedule.availableSessions} available
                                </span>
                              </div>
                            </div>
                            
                            {schedule.assignedSessions > 0 && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-[#6b7280]">Assigned</span>
                                  <span className="text-[#16a34a] font-medium">
                                    {schedule.assignedSessions}/{schedule.availableSessions}
                                  </span>
                                </div>
                                <div className="w-full bg-[#e5e7eb] rounded-full h-1.5">
                                  <div
                                    className="bg-[#16a34a] h-1.5 rounded-full transition-all"
                                    style={{ width: `${percentAssigned}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-[#9ca3af]">
            <Calendar className="size-12 mx-auto mb-3 opacity-20" />
            <p>No host availability submitted yet</p>
            <p className="text-sm mt-1">Hosts need to submit their weekly availability first</p>
          </div>
        )}
      </div>
    </div>
  );
}
