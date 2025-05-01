
import { useState, useEffect, useMemo } from 'react';
import { RoomBooking, FilterOptions } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';

// Sample static booking data for public view
const staticBookings: RoomBooking[] = [
  {
    id: "1",
    roomName: "Conference Room A",
    date: "2025-04-01",
    startTime: "09:00",
    endTime: "10:30",
    bookedBy: "John Smith",
    purpose: "Team Standup",
    status: "confirmed",
    equipment: ["Projector", "Whiteboard"]
  },
  {
    id: "2",
    roomName: "Training Room B",
    date: "2025-04-01",
    startTime: "13:00",
    endTime: "15:00",
    bookedBy: "Sarah Johnson",
    purpose: "New Hire Orientation",
    status: "confirmed",
    equipment: ["Projector", "Audio System"]
  },
  {
    id: "3",
    roomName: "Meeting Room C",
    date: "2025-04-02",
    startTime: "11:00",
    endTime: "12:00",
    bookedBy: "Robert Davis",
    purpose: "Client Meeting",
    status: "confirmed",
    equipment: ["Video Conference"]
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
    
    // If we have dates in April 2025, set date filter to that month
    if (data.length > 0) {
      const aprilData = data.filter(booking => booking.date && booking.date.startsWith('2025-04'));
      if (aprilData.length > 0) {
        // Find earliest booking date
        const earliestDate = aprilData.reduce((earliest, booking) => 
          booking.date < earliest ? booking.date : earliest, 
          aprilData[0].date
        );
        console.log("Setting filter to earliest date:", earliestDate);
        setFilterOptions(prev => ({
          ...prev,
          dateRange: {
            start: earliestDate,
            end: earliestDate
          }
        }));
      }
    }
  };
  
  // Load saved bookings from localStorage on initial load
  // If none exist, use static bookings for public view
  useEffect(() => {
    setIsLoading(true);
    const savedBookings = localStorage.getItem('roomBookings');
    if (savedBookings) {
      try {
        const parsedBookings = JSON.parse(savedBookings) as RoomBooking[];
        if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
          console.log("Loaded saved bookings:", parsedBookings.length);
          setBookings(parsedBookings);
          // Always keep showUploadForm as false since we want to display content
          
          // Clear filters before setting any
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
          
          // Set date filter to April 2025
          const aprilData = parsedBookings.filter(booking => booking.date && booking.date.startsWith('2025-04'));
          if (aprilData.length > 0) {
            // Find earliest booking date
            const earliestDate = aprilData.reduce((earliest, booking) => 
              booking.date < earliest ? booking.date : earliest, 
              aprilData[0].date
            );
            console.log("Setting filter to earliest date:", earliestDate);
            setFilterOptions(prev => ({
              ...prev,
              dateRange: {
                start: earliestDate,
                end: earliestDate
              }
            }));
          }
          
          toast({
            title: "Loaded saved data",
            description: `${parsedBookings.length} bookings loaded from your last session`,
          });
        } else {
          // Use static bookings instead
          console.log("Using static bookings for public view");
          setBookings(staticBookings);
          // Don't show upload form for public view
          setShowUploadForm(false);
        }
      } catch (error) {
        console.error('Failed to load saved bookings:', error);
        // Use static bookings instead
        console.log("Using static bookings for public view after error");
        setBookings(staticBookings);
        // Don't show upload form for public view
        setShowUploadForm(false);
      }
    } else {
      // Use static bookings for public view
      console.log("No saved bookings, using static bookings for public view");
      setBookings(staticBookings);
      // Don't show upload form for public view
      setShowUploadForm(false);
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
