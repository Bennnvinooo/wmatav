
import { useState, useEffect, useMemo } from 'react';
import { RoomBooking, FilterOptions, ViewMode } from '@/types/booking';
import FileUpload from '@/components/FileUpload';
import CalendarView from '@/components/CalendarView';
import ListView from '@/components/ListView';
import FilterBar from '@/components/filters/FilterBar';
import MobileNav from '@/components/MobileNav';
import { BookingCardSkeleton, CalendarSkeleton, FilterSkeleton, UploadSkeleton } from '@/components/SkeletonLoader';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [showUploadForm, setShowUploadForm] = useState(true);
  
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
  useEffect(() => {
    const savedBookings = localStorage.getItem('roomBookings');
    if (savedBookings) {
      try {
        const parsedBookings = JSON.parse(savedBookings) as RoomBooking[];
        if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
          console.log("Loaded saved bookings:", parsedBookings.length);
          setBookings(parsedBookings);
          setShowUploadForm(false);
          
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
        }
      } catch (error) {
        console.error('Failed to load saved bookings:', error);
      }
    }
  }, []);
  
  if (showUploadForm) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Room Booking Display System</h1>
          <p className="text-center text-muted-foreground">Upload an Excel file containing your room booking information</p>
        </div>
        
        {isLoading ? <UploadSkeleton /> : (
          <FileUpload 
            onDataLoaded={handleDataLoaded} 
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto pb-20 md:pb-8 px-4 py-4 md:py-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Room Booking Display</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdate}
          </p>
        </div>
        
        <Button onClick={() => setShowUploadForm(true)} className="md:w-auto w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
          Upload New File
        </Button>
      </div>
      
      {isLoading ? (
        <>
          <FilterSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        </>
      ) : (
        <>
          <FilterBar 
            bookings={bookings} 
            filterOptions={filterOptions} 
            setFilterOptions={setFilterOptions}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          
          {viewMode === 'calendar' ? (
            <CalendarView bookings={filteredBookings} filterOptions={filterOptions} />
          ) : (
            <ListView bookings={filteredBookings} filterOptions={filterOptions} />
          )}
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No bookings match the current filters</p>
              <Button 
                variant="outline" 
                onClick={() => setFilterOptions({
                  roomName: null,
                  dateRange: { start: null, end: null },
                  bookedBy: null,
                  status: null,
                  searchTerm: ''
                })}
                className="mt-4"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </>
      )}
      
      <MobileNav 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        onUploadClick={() => setShowUploadForm(true)} 
      />
    </div>
  );
};

export default Index;
