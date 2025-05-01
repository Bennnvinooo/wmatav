
import { useState, useEffect, useMemo } from 'react';
import { RoomBooking, FilterOptions } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';

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
    
    // Store for both admin use and public visitors
    localStorage.setItem('roomBookings', JSON.stringify(data));
    localStorage.setItem('lastUpdate', new Date().toISOString());
    
    // IMPORTANT: Store in sessionStorage too, which is shared across all tabs/windows on the public domain
    sessionStorage.setItem('roomBookings', JSON.stringify(data));
    
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
  
  // Load saved bookings from localStorage or sessionStorage on initial load
  useEffect(() => {
    setIsLoading(true);
    
    // First, check if we're on the public domain
    const isPublicMode = window.location.hostname === 'wmatav.lovable.app';
    console.log("Is public mode:", isPublicMode);
    
    // Try different storage locations in order of preference
    const tryGetBookings = () => {
      // First try localStorage (for both admin and public modes)
      const savedBookings = localStorage.getItem('roomBookings');
      if (savedBookings) {
        try {
          const parsedBookings = JSON.parse(savedBookings) as RoomBooking[];
          if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
            console.log("Loaded saved bookings from localStorage:", parsedBookings.length);
            setBookings(parsedBookings);
            
            if (!isPublicMode) {
              toast({
                title: "Loaded saved data",
                description: `${parsedBookings.length} bookings loaded from your last session`,
              });
            }
            return true;
          }
        } catch (error) {
          console.error('Failed to load saved bookings from localStorage:', error);
        }
      }
      
      // Then try sessionStorage (useful for shared data across tabs)
      const sessionBookings = sessionStorage.getItem('roomBookings');
      if (sessionBookings) {
        try {
          const parsedBookings = JSON.parse(sessionBookings) as RoomBooking[];
          if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
            console.log("Loaded saved bookings from sessionStorage:", parsedBookings.length);
            setBookings(parsedBookings);
            return true;
          }
        } catch (error) {
          console.error('Failed to load saved bookings from sessionStorage:', error);
        }
      }
      
      return false;
    };
    
    // Try to load bookings from storage
    const foundBookings = tryGetBookings();
    
    // For public mode, show upload only if no data was found
    if (isPublicMode) {
      setShowUploadForm(false);
      
      if (!foundBookings) {
        // In public mode with no saved data, show an empty state
        console.log("No saved bookings found in public mode");
        setBookings([]);
        toast({
          title: "No booking data available",
          description: "Please check back later when the administrator has uploaded data.",
          variant: "destructive"
        });
      }
    } else {
      // In admin mode, show upload form if no data was found
      setShowUploadForm(!foundBookings);
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
