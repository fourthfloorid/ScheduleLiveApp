/**
 * Room Availability Validation Utilities
 * 
 * Provides helper functions for validating room assignments and checking
 * host-brand compatibility based on the backend validation system.
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-df75f45f`;

export interface ValidationResult {
  valid: boolean;
  error?: string;
  reason?: string;
  code?: string;
  unavailableSlots?: string[];
  hostAvailableSlots?: string[];
  validation?: {
    brandCompatible: boolean;
    roomSlotsAvailable: boolean;
    hostAvailable: boolean;
  };
}

export interface AvailableHost {
  id: string;
  email: string;
  name: string;
  brandTags: string[];
  availableSlots: string[];
  matchingSlots: string[];
}

export interface RoomAvailability {
  roomId: string;
  date: string;
  availability: {
    time: string;
    available: boolean;
    assignment: {
      hostId: string;
      hostName: string;
      brandId: string;
      brandName: string;
      assignmentId: string;
    } | null;
  }[];
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
}

/**
 * Validates a room assignment before creating it
 * 
 * Checks:
 * - Brand compatibility between host and brand
 * - Room time slot availability
 * - Host schedule availability
 * 
 * @param accessToken - User's access token
 * @param params - Assignment parameters
 * @returns Validation result with detailed feedback
 */
export async function validateRoomAssignment(
  accessToken: string,
  params: {
    roomId: string;
    date: string;
    brandId: string;
    hostId: string;
    timeSlots: string[];
  }
): Promise<ValidationResult> {
  try {
    const response = await fetch(`${API_BASE}/validate-room-assignment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Validation error:', error);
    return {
      valid: false,
      error: 'Failed to validate room assignment',
      code: 'VALIDATION_ERROR',
    };
  }
}

/**
 * Get available hosts for a specific room assignment
 * 
 * Returns hosts that:
 * - Are compatible with the brand
 * - Have availability at the requested time slots
 * - Are not already assigned to another room at those times
 * 
 * @param accessToken - User's access token
 * @param params - Query parameters
 * @returns List of available hosts with their matching slots
 */
export async function getAvailableHosts(
  accessToken: string,
  params: {
    roomId?: string;
    date: string;
    brandId: string;
    timeSlots: string[];
  }
): Promise<{ hosts: AvailableHost[]; totalAvailable: number }> {
  try {
    const response = await fetch(`${API_BASE}/get-available-hosts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch available hosts');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get available hosts error:', error);
    return { hosts: [], totalAvailable: 0 };
  }
}

/**
 * Get room availability status for a specific date
 * 
 * Shows which time slots are occupied and which are free
 * 
 * @param accessToken - User's access token
 * @param roomId - Room ID
 * @param date - Date in YYYY-MM-DD format
 * @returns Room availability details
 */
export async function getRoomAvailability(
  accessToken: string,
  roomId: string,
  date: string
): Promise<RoomAvailability | null> {
  try {
    const response = await fetch(`${API_BASE}/room-availability/${roomId}/${date}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch room availability');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get room availability error:', error);
    return null;
  }
}

/**
 * Check if a host is compatible with a brand
 * 
 * Client-side check (should be used alongside server validation)
 * 
 * @param hostBrandTags - Host's brand tags
 * @param targetBrandId - Target brand ID
 * @returns true if compatible, false otherwise
 */
export function isHostBrandCompatible(
  hostBrandTags: string[],
  targetBrandId: string
): boolean {
  // Empty brand tags means host is flexible and can work with any brand
  if (!hostBrandTags || hostBrandTags.length === 0) {
    return true;
  }
  
  // Check if target brand is in host's allowed brands
  return hostBrandTags.includes(targetBrandId);
}

/**
 * Format validation error message for user display
 * 
 * @param result - Validation result
 * @returns User-friendly error message
 */
export function formatValidationError(result: ValidationResult): string {
  if (result.valid) {
    return 'Assignment is valid';
  }

  switch (result.code) {
    case 'BRAND_INCOMPATIBLE':
      return `⚠️ Host tidak kompatibel dengan brand ini. ${result.reason}`;
    case 'ROOM_SLOT_OCCUPIED':
      return `⚠️ Jam sudah terisi: ${result.unavailableSlots?.join(', ')}`;
    case 'HOST_NOT_AVAILABLE':
      return `⚠️ Host tidak tersedia. ${result.reason}`;
    default:
      return `⚠️ ${result.error || 'Validasi gagal'}`;
  }
}

/**
 * Get validation status icon
 * 
 * @param result - Validation result
 * @returns Emoji icon representing the status
 */
export function getValidationStatusIcon(result: ValidationResult): string {
  if (result.valid) {
    return '✅';
  }
  
  switch (result.code) {
    case 'BRAND_INCOMPATIBLE':
      return '🚫';
    case 'ROOM_SLOT_OCCUPIED':
      return '⏰';
    case 'HOST_NOT_AVAILABLE':
      return '📅';
    default:
      return '❌';
  }
}

/**
 * Common time slots for room availability
 */
export const COMMON_TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
  '21:00', '22:00'
];

/**
 * Format time slot for display
 * 
 * @param time - Time in HH:mm format
 * @returns Formatted time string
 */
export function formatTimeSlot(time: string): string {
  return `${time} - ${addHour(time)}`;
}

/**
 * Add one hour to a time string
 * 
 * @param time - Time in HH:mm format
 * @returns Time plus one hour
 */
function addHour(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const newHours = (hours + 1) % 24;
  return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
