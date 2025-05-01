import { useMemo } from 'react';
import { RoomBooking, FilterOptions } from '@/types/booking';
import { isSameDay, isWithinInterval, parseISO } from 'date-fns';

export const useBookingFilter = (bookings: RoomBooking[], dateRange: { start: Date, end: Date }) => {
  // Filter bookings for the current view
  const visibleBookings = useMemo(() => {
    console.log("Filtering bookings:", bookings.length, "with date range:", {
      start: dateRange.start.toISOString().split('T')[0],
      end: dateRange.end.toISOString().split('T')[0]
    });
    
    return bookings.filter(booking => {
      if (!booking.date) {
        console.log("Skipping booking with no date:", booking);
        return false;
      }
      
      try {
        // Safely parse the date string
        const dateStr = booking.date;
        // Assuming date is in YYYY-MM-DD format
        const parts = dateStr.split('-');
        if (parts.length !== 3) {
          console.log("Invalid date format:", dateStr);
          return false;
        }
        
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-based
        const day = parseInt(parts[2], 10);
        
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          console.log("Invalid date parts:", year, month, day);
          return false;
        }
        
        const bookingDate = new Date(year, month, day);
        
        // Check if we're in "day" view mode (when start and end are the same)
        if (isSameDay(dateRange.start, dateRange.end)) {
          const isSameBookingDay = isSameDay(bookingDate, dateRange.start);
          if (!isSameBookingDay) {
            console.log(`Booking date ${dateStr} is not on same day as:`, 
              dateRange.start.toISOString().split('T')[0]);
          }
          return isSameBookingDay;
        }
        
        // Otherwise check if it's within the range
        const isWithin = isWithinInterval(bookingDate, {
          start: dateRange.start,
          end: dateRange.end
        });
        
        if (!isWithin) {
          console.log(`Booking date ${dateStr} is not within range:`, 
            dateRange.start.toISOString().split('T')[0], 
            dateRange.end.toISOString().split('T')[0]
          );
        }
        
        return isWithin;
      } catch (error) {
        console.error("Error parsing date:", booking.date, error);
        return false;
      }
    });
  }, [bookings, dateRange]);

  // Get bookings for a specific day
  const getDayBookings = (date: Date) => {
    console.log("Getting bookings for day:", date.toISOString().split('T')[0]);
    
    const filtered = visibleBookings.filter(booking => {
      if (!booking.date) {
        console.log("Skipping booking with no date:", booking);
        return false;
      }
      
      try {
        // Safely parse the booking date
        const parts = booking.date.split('-');
        if (parts.length !== 3) {
          console.log("Invalid date format for comparison:", booking.date);
          return false;
        }
        
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-based
        const day = parseInt(parts[2], 10);
        
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          console.log("Invalid date parts for comparison:", year, month, day);
          return false;
        }
        
        const bookingDate = new Date(year, month, day);
        const same = isSameDay(bookingDate, date);
        
        if (same) {
          console.log("Found booking for this day:", booking);
        }
        
        return same;
      } catch (error) {
        console.error("Error comparing dates:", booking.date, error);
        return false;
      }
    }).sort((a, b) => {
      // Sort by start time
      return a.startTime.localeCompare(b.startTime);
    });
    
    console.log(`Found ${filtered.length} bookings for ${date.toISOString().split('T')[0]}`);
    return filtered;
  };

  return {
    visibleBookings,
    getDayBookings
  };
};
