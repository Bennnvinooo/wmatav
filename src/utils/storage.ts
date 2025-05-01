
import { RoomBooking } from '@/types/booking';

/**
 * Storage utility functions for handling booking data
 */

// Save bookings to both localStorage and sessionStorage
export const saveBookings = (bookings: RoomBooking[]): void => {
  try {
    // Store in localStorage for persistence across sessions
    localStorage.setItem('roomBookings', JSON.stringify(bookings));
    localStorage.setItem('lastUpdate', new Date().toISOString());
    
    // Store in sessionStorage too for sharing across tabs
    sessionStorage.setItem('roomBookings', JSON.stringify(bookings));
    
    console.log(`Saved ${bookings.length} bookings to storage`);
  } catch (error) {
    console.error('Failed to save bookings to storage:', error);
  }
};

// Load bookings from storage (tries localStorage first, then sessionStorage)
export const loadBookings = (): { bookings: RoomBooking[], source: string } | null => {
  try {
    // First try localStorage
    const savedBookings = localStorage.getItem('roomBookings');
    if (savedBookings) {
      const parsedBookings = JSON.parse(savedBookings) as RoomBooking[];
      if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
        console.log("Loaded saved bookings from localStorage:", parsedBookings.length);
        return { bookings: parsedBookings, source: 'localStorage' };
      }
    }
    
    // Then try sessionStorage
    const sessionBookings = sessionStorage.getItem('roomBookings');
    if (sessionBookings) {
      const parsedBookings = JSON.parse(sessionBookings) as RoomBooking[];
      if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
        console.log("Loaded saved bookings from sessionStorage:", parsedBookings.length);
        return { bookings: parsedBookings, source: 'sessionStorage' };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load bookings from storage:', error);
    return null;
  }
};

// Check if we're running in public mode
export const isPublicMode = (): boolean => {
  return window.location.hostname === 'wmatav.lovable.app';
};

// Clear all booking storage
export const clearBookingStorage = (): void => {
  localStorage.removeItem('roomBookings');
  localStorage.removeItem('lastUpdate');
  sessionStorage.removeItem('roomBookings');
};
