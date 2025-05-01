
import React from 'react';
import { FilterOptions, RoomBooking, ViewMode } from '@/types/booking';
import CalendarView from '@/components/CalendarView';
import ListView from '@/components/ListView';
import FilterBar from '@/components/filters/FilterBar';
import { Button } from '@/components/ui/button';
import { FilterSkeleton, BookingCardSkeleton } from '@/components/SkeletonLoader';

interface BookingsDisplayProps {
  bookings: RoomBooking[];
  filteredBookings: RoomBooking[];
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isLoading: boolean;
  clearFilters: () => void;
}

const BookingsDisplay: React.FC<BookingsDisplayProps> = ({
  bookings,
  filteredBookings,
  filterOptions,
  setFilterOptions,
  viewMode,
  setViewMode,
  isLoading,
  clearFilters
}) => {
  if (isLoading) {
    return (
      <>
        <FilterSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <BookingCardSkeleton key={i} />
          ))}
        </div>
      </>
    );
  }

  return (
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
            onClick={clearFilters}
            className="mt-4"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </>
  );
};

export default BookingsDisplay;
