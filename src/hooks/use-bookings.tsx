
import { useState, useEffect, useMemo } from 'react';
import { RoomBooking, FilterOptions } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';

// Sample static booking data for public view - updated to match the image
const staticBookings: RoomBooking[] = [
  {
    id: "1",
    roomName: "New Carrolton - NC - Multipurpose Rooms: R10.7, R10.8 & R10.9",
    date: "2025-05-01",
    startTime: "09:00",
    endTime: "17:00",
    bookedBy: "Mary Johnson",
    purpose: "Expected Guests: 60 | Set-up Style: CLASSROOM | Catering: YES Contact: Mary Johnson | 202 - 555-1234 | MJohnson@email.com",
    status: "confirmed",
    color: "orange",
    equipment: ["Projector", "Audio System"]
  },
  {
    id: "2",
    roomName: "Eisenhower - ICA - Multipurpose Rooms: R10.7, R10.8 & R10.9",
    date: "2025-05-02",
    startTime: "10:00",
    endTime: "15:00",
    bookedBy: "James Wilson",
    purpose: "Expected Guests: 35 | Set-up Style: CLASSROOM | Catering: YES Contact: James Wilson | 202 - 555-7890 | JWilson@email.com",
    status: "confirmed",
    color: "blue",
    equipment: ["Projector", "Video Conference"]
  },
  {
    id: "3",
    roomName: "Le Enfant Plaza - LEC - Multipurpose Rooms: R10.7, R10.8 & R10.9",
    date: "2025-05-03",
    startTime: "08:00",
    endTime: "12:00",
    bookedBy: "Sarah Chen",
    purpose: "Expected Guests: 25 | Set-up Style: CLASSROOM | Catering: YES Contact: Sarah Chen | 202 - 555-3456 | SChen@email.com",
    status: "confirmed",
    color: "green",
    equipment: ["Audio System", "Video Conference"]
  },
  {
    id: "4",
    roomName: "Eisenhower - ICA - Multipurpose Rooms: R10.7, R10.8 & R10.9",
    date: "2025-05-06",
    startTime: "09:30",
    endTime: "14:30",
    bookedBy: "Robert Garcia",
    purpose: "Expected Guests: 30 | Set-up Style: CLASSROOM | Catering: YES Contact: Robert Garcia | 202 - 555-4567 | RGarcia@email.com",
    status: "confirmed",
    color: "blue",
    equipment: ["Projector", "Whiteboard"]
  }
];

export function useBookings() {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Changed the default to false so users see the booking content right away
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  // Initialize with empty filters
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    roomName: null,
    dateRange: {
      start: null,
      end: null
    },
    bookedBy: null,
    status: null,
    searchTerm: ''
  });
  
  const { toast } = useToast();
  
  const lastUpdate = useMemo(() => {
    return new Date().toLocaleString();
  }, [bookings]);
  
  // Filter bookings based on filter options
  const filteredBookings = useMemo(() => {
    if (bookings.length === 0) return [];
    
    console.log("Filtering bookings with options:", filterOptions);
    
    return bookings.filter(booking => {
      // Filter by room name
      if (filterOptions.roomName && booking.roomName !== filterOptions.roomName) {
        return false;
      }
      
      // Filter by date range
      if (filterOptions.dateRange.start && booking.date < filterOptions.dateRange.start) {
        return false;
      }
      if (filterOptions.dateRange.end && booking.date > filterOptions.dateRange.end) {
        return false;
      }
      
      // Filter by booker
      if (filterOptions.bookedBy && booking.bookedBy !== filterOptions.bookedBy) {
        return false;
      }
      
      // Filter by status
      if (filterOptions.status && filterOptions.status.length > 0 && !filterOptions.status.includes(booking.status)) {
        return false;
      }
      
      // Filter by search term
      if (filterOptions.searchTerm) {
        const searchTerm = filterOptions.searchTerm.toLowerCase();
        return (
          booking.roomName.toLowerCase().includes(searchTerm) ||
          booking.bookedBy.toLowerCase().includes(searchTerm) ||
          booking.purpose.toLowerCase().includes(searchTerm)
        );
      }
      
      return true;
    });
  }, [bookings, filterOptions]);
  
  const handleDataLoaded = (data: RoomBooking[]) => {
    console.log("Data loaded:", data.length, "bookings");
    setBookings(data);
    setShowUploadForm(false);
    localStorage.setItem('roomBookings', JSON.stringify(data));
    localStorage.setItem('lastUpdate', new Date().toISOString());
    
    // Clear filters first
    setFilterOptions({
      roomName: null,
      dateRange: {
        start: null,
        end: null
      },
      bookedBy: null,
      status: null,
      searchTerm: ''
    });
  };
  
  // Load saved bookings from localStorage on initial load
  // If none exist, use static bookings for public view
  useEffect(() => {
    setIsLoading(true);
    
    // First, check if we're on the public domain
    const isPublicMode = window.location.hostname === 'wmatav.lovable.app';
    
    // For public mode, always use static bookings and don't allow upload
    if (isPublicMode) {
      console.log("Public mode detected - using static bookings");
      setBookings(staticBookings);
      setShowUploadForm(false);
      setIsLoading(false);
      return;
    }
    
    // For non-public mode, try loading from localStorage
    const savedBookings = localStorage.getItem('roomBookings');
    if (savedBookings) {
      try {
        const parsedBookings = JSON.parse(savedBookings) as RoomBooking[];
        if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
          console.log("Loaded saved bookings:", parsedBookings.length);
          setBookings(parsedBookings);
          
          toast({
            title: "Loaded saved data",
            description: `${parsedBookings.length} bookings loaded from your last session`,
          });
        } else {
          console.log("No valid bookings found in localStorage, using static bookings");
          setBookings(staticBookings);
        }
      } catch (error) {
        console.error('Failed to load saved bookings:', error);
        console.log("Using static bookings after error");
        setBookings(staticBookings);
      }
    } else {
      console.log("No saved bookings, using static bookings");
      setBookings(staticBookings);
    }
    
    setIsLoading(false);
  }, []);

  const clearFilters = () => {
    setFilterOptions({
      roomName: null,
      dateRange: { start: null, end: null },
      bookedBy: null,
      status: null,
      searchTerm: ''
    });
  };

  return {
    bookings,
    filteredBookings,
    isLoading,
    setIsLoading,
    showUploadForm,
    setShowUploadForm,
    filterOptions,
    setFilterOptions,
    lastUpdate,
    handleDataLoaded,
    clearFilters
  };
}
