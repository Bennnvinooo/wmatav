import { useState, useEffect, useMemo } from 'react';
import { RoomBooking, FilterOptions } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';

export function useBookings() {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Changed to false so we show content right away in preview
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
    
    try {
      // Store for both admin use and public visitors
      localStorage.setItem('roomBookings', JSON.stringify(data));
      localStorage.setItem('lastUpdate', new Date().toISOString());
      
      // Also store in sessionStorage for cross-tab communication
      sessionStorage.setItem('roomBookings', JSON.stringify(data));
      
      console.log("Stored bookings in localStorage and sessionStorage");
    } catch (error) {
      console.error("Error storing bookings:", error);
    }
    
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
    console.log("useBookings: Initial load");
    
    try {
      // Simplified check for public mode - preview will default to admin mode
      const hostname = window.location.hostname;
      const isPublicMode = hostname === 'wmatav.lovable.app';
      console.log("Is public mode:", isPublicMode);
      
      // Try loading saved data from storage
      const loadSavedBookings = () => {
        try {
          // Generate some sample data for preview if nothing is found
          const sampleData: RoomBooking[] = [
            {
              id: '1',
              roomName: 'Conference Room A',
              bookedBy: 'John Smith',
              date: '2025-05-15',
              startTime: '09:00',
              endTime: '10:00',
              purpose: 'Team Meeting',
              status: 'confirmed'
            },
            {
              id: '2',
              roomName: 'Training Room B',
              bookedBy: 'Sarah Johnson',
              date: '2025-05-16',
              startTime: '13:00',
              endTime: '15:00',
              purpose: 'New Hire Orientation',
              status: 'pending'
            },
            {
              id: '3',
              roomName: 'Executive Suite',
              bookedBy: 'Michael Brown',
              date: '2025-05-17',
              startTime: '10:00',
              endTime: '11:30',
              purpose: 'Board Meeting',
              status: 'confirmed'
            },
            {
              id: '4',
              roomName: 'Meeting Room C',
              bookedBy: 'Lisa Davis',
              date: '2025-05-18',
              startTime: '14:00',
              endTime: '16:00',
              purpose: 'Client Presentation',
              status: 'confirmed'
            },
            {
              id: '5',
              roomName: 'Conference Room A',
              bookedBy: 'Robert Wilson',
              date: '2025-05-19',
              startTime: '11:00',
              endTime: '12:00',
              purpose: 'Department Update',
              status: 'confirmed'
            }
          ];

          try {
            // First try localStorage
            const savedBookings = localStorage.getItem('roomBookings');
            if (savedBookings) {
              const parsedBookings = JSON.parse(savedBookings) as RoomBooking[];
              if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
                console.log("Loaded saved bookings from localStorage:", parsedBookings.length);
                setBookings(parsedBookings);
                toast({
                  title: "Loaded saved data",
                  description: `${parsedBookings.length} bookings loaded from your last session`,
                });
                return true;
              }
            }
            
            // Then try sessionStorage
            const sessionBookings = sessionStorage.getItem('roomBookings');
            if (sessionBookings) {
              const parsedBookings = JSON.parse(sessionBookings) as RoomBooking[];
              if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
                console.log("Loaded saved bookings from sessionStorage:", parsedBookings.length);
                setBookings(parsedBookings);
                return true;
              }
            }
            
            // If no saved data found, use sample data for preview
            console.log("No saved bookings found, using sample data");
            setBookings(sampleData);
            console.log("Loaded sample bookings:", sampleData.length);
            
            // Store sample data so it's available on reload
            localStorage.setItem('roomBookings', JSON.stringify(sampleData));
            sessionStorage.setItem('roomBookings', JSON.stringify(sampleData));
            
            return true;
          } catch (error) {
            console.error('Failed to load saved bookings:', error);
            // Fall back to sample data
            setBookings(sampleData);
            console.log("Fallback to sample data:", sampleData.length);
            return true;
          }
        } catch (error) {
          console.error('Error loading bookings:', error);
          return false;
        }
      };
      
      // Try to load bookings
      loadSavedBookings();
      
      // In preview, always show the bookings by default
      setShowUploadForm(false);
      
    } catch (error) {
      console.error("Error in use-bookings effect:", error);
      // Default behavior if there's an error - show upload form
      setShowUploadForm(true);
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
