import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Health check endpoint
app.get("/make-server-df75f45f/health", (c) => {
  return c.json({ 
    status: "ok",
    supabaseUrl: Deno.env.get('SUPABASE_URL'),
    hasServiceKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
  });
});

// Auth endpoints
app.post("/make-server-df75f45f/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    console.log('Signup request received:', { email: body.email, role: body.role });
    
    const { email, password, name, role } = body;
    
    if (!email || !password || !name || !role) {
      console.log('Missing required fields');
      return c.json({ error: 'All fields are required' }, 400);
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true, // Auto-confirm since email server is not configured
    });

    if (error) {
      console.log(`Signup error: ${error.message}`, error);
      return c.json({ error: error.message }, 400);
    }

    console.log('Signup successful:', data.user.id);
    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup exception:`, error);
    return c.json({ error: String(error) }, 500);
  }
});

app.post("/make-server-df75f45f/auth/signin", async (c) => {
  try {
    const body = await c.req.json();
    console.log('Signin request received:', { email: body.email });
    
    const { email, password } = body;
    
    if (!email || !password) {
      console.log('Missing email or password');
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Signin error: ${error.message}`, error);
      return c.json({ error: error.message }, 400);
    }

    console.log('Signin successful:', data.user.id);
    return c.json({ 
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.log(`Signin exception:`, error);
    return c.json({ error: String(error) }, 500);
  }
});

// Middleware to verify authentication
const verifyAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('Auth error: Missing or invalid Authorization header');
    return c.json({ error: 'Unauthorized', code: 401, message: 'Missing or invalid Authorization header' }, 401);
  }

  const token = authHeader.split(' ')[1];
  
  if (!token || token === 'undefined' || token === 'null') {
    console.log('Auth error: Invalid token value');
    return c.json({ error: 'Unauthorized', code: 401, message: 'Invalid token value' }, 401);
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.log(`Auth verification error: ${error?.message || 'User not found'}`);
    console.log(`Token used (first 20 chars): ${token.substring(0, 20)}...`);
    return c.json({ error: 'Unauthorized', code: 401, message: error?.message || 'Invalid JWT' }, 401);
  }

  c.set('user', user);
  await next();
};

// Brand endpoints
app.get("/make-server-df75f45f/brands", verifyAuth, async (c) => {
  try {
    const brands = await kv.getByPrefix('brand:');
    return c.json({ brands });
  } catch (error) {
    console.log(`Get brands error: ${error}`);
    return c.json({ error: 'Failed to fetch brands' }, 500);
  }
});

app.post("/make-server-df75f45f/brands", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const { name, description } = await c.req.json();
    const id = `brand:${Date.now()}`;
    const brand = { id, name, description };
    
    await kv.set(id, brand);
    return c.json({ brand });
  } catch (error) {
    console.log(`Create brand error: ${error}`);
    return c.json({ error: 'Failed to create brand' }, 500);
  }
});

app.put("/make-server-df75f45f/brands/:id", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const id = c.req.param('id');
    const { name, description } = await c.req.json();
    const brand = { id, name, description };
    
    await kv.set(id, brand);
    return c.json({ brand });
  } catch (error) {
    console.log(`Update brand error: ${error}`);
    return c.json({ error: 'Failed to update brand' }, 500);
  }
});

app.delete("/make-server-df75f45f/brands/:id", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete brand error: ${error}`);
    return c.json({ error: 'Failed to delete brand' }, 500);
  }
});

// Room endpoints
app.get("/make-server-df75f45f/rooms", verifyAuth, async (c) => {
  try {
    const rooms = await kv.getByPrefix('room:');
    return c.json({ rooms });
  } catch (error) {
    console.log(`Get rooms error: ${error}`);
    return c.json({ error: 'Failed to fetch rooms' }, 500);
  }
});

app.post("/make-server-df75f45f/rooms", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const { name, description, assignments } = await c.req.json();
    const id = `room:${Date.now()}`;
    const room = { id, name, description, assignments: assignments || [] };
    
    await kv.set(id, room);
    return c.json({ room });
  } catch (error) {
    console.log(`Create room error: ${error}`);
    return c.json({ error: 'Failed to create room' }, 500);
  }
});

app.put("/make-server-df75f45f/rooms/:id", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const id = c.req.param('id');
    const { name, description, assignments } = await c.req.json();
    const room = { id, name, description, assignments };
    
    await kv.set(id, room);
    return c.json({ room });
  } catch (error) {
    console.log(`Update room error: ${error}`);
    return c.json({ error: 'Failed to update room' }, 500);
  }
});

app.delete("/make-server-df75f45f/rooms/:id", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete room error: ${error}`);
    return c.json({ error: 'Failed to delete room' }, 500);
  }
});

// Schedule endpoints (Host Availability)
app.get("/make-server-df75f45f/schedules", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const schedules = await kv.getByPrefix('schedule:');
    
    // Filter schedules for host role
    if (user.user_metadata?.role === 'host') {
      const userSchedules = schedules.filter((s: any) => s.hostId === user.id);
      return c.json({ schedules: userSchedules });
    }
    
    return c.json({ schedules });
  } catch (error) {
    console.log(`Get schedules error: ${error}`);
    return c.json({ error: 'Failed to fetch schedules' }, 500);
  }
});

app.post("/make-server-df75f45f/schedules", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const { date, timeSlots } = await c.req.json();
    
    if (!date || !timeSlots || !Array.isArray(timeSlots) || timeSlots.length < 2) {
      return c.json({ error: 'Date and at least 2 time slots are required' }, 400);
    }

    const id = `schedule:${user.id}:${date}:${Date.now()}`;
    const schedule = {
      id,
      hostId: user.id,
      hostName: user.user_metadata?.name || user.email,
      date,
      timeSlots, // Array of time strings like ['09:00', '10:00', '11:00']
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(id, schedule);
    return c.json({ schedule });
  } catch (error) {
    console.log(`Create schedule error: ${error}`);
    return c.json({ error: 'Failed to create schedule' }, 500);
  }
});

app.delete("/make-server-df75f45f/schedules/:id", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const id = c.req.param('id');
    
    // Check if schedule exists and belongs to user (if host)
    const schedule = await kv.get(id);
    if (!schedule) {
      return c.json({ error: 'Schedule not found' }, 404);
    }
    
    if (user.user_metadata?.role === 'host' && schedule.hostId !== user.id) {
      return c.json({ error: 'Permission denied' }, 403);
    }
    
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete schedule error: ${error}`);
    return c.json({ error: 'Failed to delete schedule' }, 500);
  }
});

// Get available hosts for a specific date
app.get("/make-server-df75f45f/host-availability/:date", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const date = c.req.param('date');
    const schedules = await kv.getByPrefix('schedule:');
    
    // Filter schedules for the specific date
    const availableSchedules = schedules.filter((s: any) => s.date === date);
    
    return c.json({ schedules: availableSchedules });
  } catch (error) {
    console.log(`Get host availability error: ${error}`);
    return c.json({ error: 'Failed to fetch host availability' }, 500);
  }
});

// Room Assignment endpoints
app.get("/make-server-df75f45f/room-assignments", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const assignments = await kv.getByPrefix('assignment:');
    
    // Filter assignments for host role
    if (user.user_metadata?.role === 'host') {
      const userAssignments = assignments.filter((a: any) => a.hostId === user.id);
      return c.json({ assignments: userAssignments });
    }
    
    return c.json({ assignments });
  } catch (error) {
    console.log(`Get room assignments error: ${error}`);
    return c.json({ error: 'Failed to fetch room assignments' }, 500);
  }
});

app.post("/make-server-df75f45f/room-assignments", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const { roomId, roomName, date, brandId, brandName, hostId, hostName, timeSlots } = await c.req.json();
    
    if (!roomId || !date || !brandId || !hostId || !timeSlots || !Array.isArray(timeSlots)) {
      return c.json({ error: 'Room, date, brand, host, and time slots are required' }, 400);
    }

    const id = `assignment:${roomId}:${date}:${brandId}:${hostId}:${Date.now()}`;
    const assignment = {
      id,
      roomId,
      roomName,
      date,
      brandId,
      brandName,
      hostId,
      hostName,
      timeSlots,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    };
    
    await kv.set(id, assignment);
    return c.json({ assignment });
  } catch (error) {
    console.log(`Create room assignment error: ${error}`);
    return c.json({ error: 'Failed to create room assignment' }, 500);
  }
});

app.delete("/make-server-df75f45f/room-assignments/:id", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete room assignment error: ${error}`);
    return c.json({ error: 'Failed to delete room assignment' }, 500);
  }
});

// User Management endpoints
app.get("/make-server-df75f45f/users", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    // Get all users from Supabase Auth
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log(`List users error: ${error.message}`);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }

    // Format users
    const formattedUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || u.email,
      role: u.user_metadata?.role || 'host',
      brandTags: u.user_metadata?.brandTags || [], // Brand tags for hosts
      createdAt: u.created_at
    }));

    return c.json({ users: formattedUsers });
  } catch (error) {
    console.log(`Get users error: ${error}`);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

app.put("/make-server-df75f45f/users/:id", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const targetUserId = c.req.param('id');
    
    // Admin can update any user, host can only update themselves
    if (user.user_metadata?.role !== 'admin' && user.id !== targetUserId) {
      return c.json({ error: 'Permission denied' }, 403);
    }

    const { name, role, email, brandTags } = await c.req.json();
    
    const updateData: any = {
      user_metadata: { 
        name,
        brandTags: brandTags || [] // Include brand tags in metadata
      }
    };

    // Only admin can change role and email
    if (user.user_metadata?.role === 'admin') {
      if (role) {
        updateData.user_metadata.role = role;
      }
      if (email) {
        updateData.email = email;
      }
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
      targetUserId,
      updateData
    );

    if (error) {
      console.log(`Update user error: ${error.message}`);
      return c.json({ error: 'Failed to update user' }, 500);
    }

    const updatedUser = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || data.user.email,
      role: data.user.user_metadata?.role || 'host',
      brandTags: data.user.user_metadata?.brandTags || []
    };

    return c.json({ user: updatedUser });
  } catch (error) {
    console.log(`Update user error: ${error}`);
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

app.delete("/make-server-df75f45f/users/:id", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const userId = c.req.param('id');
    
    // Prevent deleting yourself
    if (user.id === userId) {
      return c.json({ error: 'Cannot delete your own account' }, 400);
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.log(`Delete user error: ${error.message}`);
      return c.json({ error: 'Failed to delete user' }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete user error: ${error}`);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

// Get host schedule statistics (admin only)
app.get("/make-server-df75f45f/host-schedule-stats", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const schedules = await kv.getByPrefix('schedule:');
    
    // Group schedules by host and date
    const hostStats: any = {};
    
    schedules.forEach((schedule: any) => {
      const hostId = schedule.hostId;
      const date = schedule.date;
      
      if (!hostStats[hostId]) {
        hostStats[hostId] = {
          hostId,
          hostName: schedule.hostName,
          totalSessions: 0,
          sessionsByDate: {},
        };
      }
      
      hostStats[hostId].totalSessions++;
      
      if (!hostStats[hostId].sessionsByDate[date]) {
        hostStats[hostId].sessionsByDate[date] = 0;
      }
      hostStats[hostId].sessionsByDate[date]++;
    });
    
    return c.json({ hostStats: Object.values(hostStats) });
  } catch (error) {
    console.log(`Get host schedule stats error: ${error}`);
    return c.json({ error: 'Failed to fetch host schedule statistics' }, 500);
  }
});

// Get rooms assigned to current user (host only)
app.get("/make-server-df75f45f/my-rooms", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    const userName = user.user_metadata?.name || user.email;
    
    const allRooms = await kv.getByPrefix('room:');
    
    // Filter rooms where user is assigned
    const myRooms = allRooms.filter((room: any) => {
      return room.assignments?.some((assignment: any) => 
        assignment.hostName === userName || assignment.hostId === user.id
      );
    });
    
    return c.json({ rooms: myRooms });
  } catch (error) {
    console.log(`Get my rooms error: ${error}`);
    return c.json({ error: 'Failed to fetch assigned rooms' }, 500);
  }
});

// ============================================================================
// ROOM AVAILABILITY VALIDATION & MATCHING SYSTEM
// ============================================================================

/**
 * Validates if a host is compatible with a brand based on brand tags
 * - If host has no brand tags (empty array), they can work with any brand (flexible host)
 * - If host has brand tags, they can only work with brands in their tag list
 * - If brand is not in host's tags, they are not compatible
 */
function isHostBrandCompatible(hostBrandTags: string[], targetBrandId: string): boolean {
  // Empty brand tags means host is flexible and can work with any brand
  if (!hostBrandTags || hostBrandTags.length === 0) {
    return true;
  }
  
  // Check if target brand is in host's allowed brands
  return hostBrandTags.includes(targetBrandId);
}

/**
 * Checks if a specific time slot is available in a room
 * Returns true if the slot is NOT already assigned
 */
function isTimeSlotAvailable(
  existingAssignments: any[],
  roomId: string,
  date: string,
  timeSlot: string
): boolean {
  // Check all existing assignments for this room and date
  const conflicts = existingAssignments.filter((assignment: any) => {
    return (
      assignment.roomId === roomId &&
      assignment.date === date &&
      assignment.timeSlots.includes(timeSlot)
    );
  });
  
  return conflicts.length === 0;
}

/**
 * Validates if requested time slots match host's availability
 * All requested slots must be in the host's available schedule
 */
function areTimeSlotsAvailableForHost(
  hostSchedules: any[],
  hostId: string,
  date: string,
  requestedTimeSlots: string[]
): boolean {
  // Find host's schedule for the specific date
  const hostSchedule = hostSchedules.find((s: any) => 
    s.hostId === hostId && s.date === date
  );
  
  if (!hostSchedule) {
    return false; // Host has no availability for this date
  }
  
  // Check if ALL requested time slots are in host's available slots
  return requestedTimeSlots.every(slot => 
    hostSchedule.timeSlots.includes(slot)
  );
}

/**
 * Main validation endpoint for room assignment
 * Validates:
 * 1. Brand compatibility with host
 * 2. Room time slot availability
 * 3. Host schedule availability
 */
app.post("/make-server-df75f45f/validate-room-assignment", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const { roomId, date, brandId, hostId, timeSlots } = await c.req.json();
    
    if (!roomId || !date || !brandId || !hostId || !timeSlots || !Array.isArray(timeSlots)) {
      return c.json({ 
        valid: false,
        error: 'Missing required fields: roomId, date, brandId, hostId, timeSlots' 
      }, 400);
    }

    // Get host information to check brand compatibility
    const { data: { user: hostUser }, error: hostError } = await supabase.auth.admin.getUserById(hostId);
    
    if (hostError || !hostUser) {
      return c.json({ 
        valid: false,
        error: 'Host not found',
        details: hostError?.message 
      }, 404);
    }

    const hostBrandTags = hostUser.user_metadata?.brandTags || [];

    // Validation 1: Check brand compatibility
    if (!isHostBrandCompatible(hostBrandTags, brandId)) {
      return c.json({
        valid: false,
        error: 'Brand compatibility failed',
        reason: `Host is not authorized for this brand. Host's allowed brands: ${hostBrandTags.join(', ') || 'All brands (flexible host)'}`,
        code: 'BRAND_INCOMPATIBLE'
      });
    }

    // Get all existing assignments and schedules
    const [allAssignments, allSchedules] = await Promise.all([
      kv.getByPrefix('assignment:'),
      kv.getByPrefix('schedule:')
    ]);

    // Validation 2: Check room time slot availability
    const unavailableSlots: string[] = [];
    for (const slot of timeSlots) {
      if (!isTimeSlotAvailable(allAssignments, roomId, date, slot)) {
        unavailableSlots.push(slot);
      }
    }

    if (unavailableSlots.length > 0) {
      return c.json({
        valid: false,
        error: 'Room time slots not available',
        reason: `The following time slots are already assigned: ${unavailableSlots.join(', ')}`,
        unavailableSlots,
        code: 'ROOM_SLOT_OCCUPIED'
      });
    }

    // Validation 3: Check host schedule availability
    if (!areTimeSlotsAvailableForHost(allSchedules, hostId, date, timeSlots)) {
      const hostSchedule = allSchedules.find((s: any) => 
        s.hostId === hostId && s.date === date
      );
      
      return c.json({
        valid: false,
        error: 'Host not available for requested time slots',
        reason: hostSchedule 
          ? `Host is only available at: ${hostSchedule.timeSlots.join(', ')}` 
          : 'Host has no availability scheduled for this date',
        hostAvailableSlots: hostSchedule?.timeSlots || [],
        code: 'HOST_NOT_AVAILABLE'
      });
    }

    // All validations passed!
    return c.json({
      valid: true,
      message: 'Room assignment is valid',
      validation: {
        brandCompatible: true,
        roomSlotsAvailable: true,
        hostAvailable: true
      }
    });

  } catch (error) {
    console.log(`Validate room assignment error: ${error}`);
    return c.json({ 
      valid: false,
      error: 'Validation failed', 
      details: String(error) 
    }, 500);
  }
});

/**
 * Get available hosts for a specific room, brand, date, and time slots
 * Returns only hosts that are:
 * 1. Compatible with the brand
 * 2. Available at the requested time slots
 * 3. Not already assigned to another room at those times
 */
app.post("/make-server-df75f45f/get-available-hosts", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const { roomId, date, brandId, timeSlots } = await c.req.json();
    
    if (!date || !brandId || !timeSlots || !Array.isArray(timeSlots)) {
      return c.json({ error: 'date, brandId, and timeSlots are required' }, 400);
    }

    // Get all users, schedules, and assignments
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      return c.json({ error: 'Failed to fetch users' }, 500);
    }

    const [allSchedules, allAssignments] = await Promise.all([
      kv.getByPrefix('schedule:'),
      kv.getByPrefix('assignment:')
    ]);

    // Filter to get only hosts
    const hosts = users.filter(u => u.user_metadata?.role === 'host');

    // Find available hosts
    const availableHosts = hosts.filter(host => {
      const hostBrandTags = host.user_metadata?.brandTags || [];
      
      // Check 1: Brand compatibility
      if (!isHostBrandCompatible(hostBrandTags, brandId)) {
        return false;
      }

      // Check 2: Host has availability for the requested date and time slots
      if (!areTimeSlotsAvailableForHost(allSchedules, host.id, date, timeSlots)) {
        return false;
      }

      // Check 3: Host is not already assigned to another room at these times
      const hasConflict = allAssignments.some((assignment: any) => {
        return (
          assignment.hostId === host.id &&
          assignment.date === date &&
          assignment.timeSlots.some((slot: string) => timeSlots.includes(slot))
        );
      });

      return !hasConflict;
    }).map(host => {
      const hostSchedule = allSchedules.find((s: any) => 
        s.hostId === host.id && s.date === date
      );

      // Get all time slots that the host has already booked on this date (across all rooms)
      const hostBookedSlots = allAssignments
        .filter((a: any) => a.hostId === host.id && a.date === date)
        .flatMap((a: any) => a.timeSlots);

      // Filter out booked slots from host's available slots
      const availableSlots = (hostSchedule?.timeSlots || []).filter(
        (slot: string) => !hostBookedSlots.includes(slot)
      );

      return {
        id: host.id,
        email: host.email,
        name: host.user_metadata?.name || host.email,
        brandTags: host.user_metadata?.brandTags || [],
        availableSlots: availableSlots,
        matchingSlots: timeSlots.filter((slot: string) => 
          availableSlots.includes(slot)
        )
      };
    });

    return c.json({ 
      hosts: availableHosts,
      totalAvailable: availableHosts.length 
    });

  } catch (error) {
    console.log(`Get available hosts error: ${error}`);
    return c.json({ error: 'Failed to fetch available hosts', details: String(error) }, 500);
  }
});

/**
 * Get room availability status for a specific date
 * Shows which time slots are occupied and which are free
 */
app.get("/make-server-df75f45f/room-availability/:roomId/:date", verifyAuth, async (c) => {
  try {
    const user = c.get('user');
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const roomId = c.req.param('roomId');
    const date = c.req.param('date');

    // Get all assignments for this room and date
    const allAssignments = await kv.getByPrefix('assignment:');
    
    const roomAssignments = allAssignments.filter((a: any) => 
      a.roomId === roomId && a.date === date
    );

    // Get all occupied time slots
    const occupiedSlots = new Map<string, any>(); // time -> assignment info
    
    roomAssignments.forEach((assignment: any) => {
      assignment.timeSlots.forEach((slot: string) => {
        occupiedSlots.set(slot, {
          hostId: assignment.hostId,
          hostName: assignment.hostName,
          brandId: assignment.brandId,
          brandName: assignment.brandName,
          assignmentId: assignment.id
        });
      });
    });

    // Common time slots (can be customized)
    const commonTimeSlots = [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
      '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
      '21:00', '22:00'
    ];

    const availability = commonTimeSlots.map(slot => ({
      time: slot,
      available: !occupiedSlots.has(slot),
      assignment: occupiedSlots.get(slot) || null
    }));

    return c.json({
      roomId,
      date,
      availability,
      totalSlots: commonTimeSlots.length,
      occupiedSlots: occupiedSlots.size,
      availableSlots: commonTimeSlots.length - occupiedSlots.size
    });

  } catch (error) {
    console.log(`Get room availability error: ${error}`);
    return c.json({ error: 'Failed to fetch room availability' }, 500);
  }
});

Deno.serve(app.fetch);