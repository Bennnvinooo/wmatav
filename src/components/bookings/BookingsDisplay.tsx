
import React from 'react';
import { FilterOptions, RoomBooking, ViewMode } from '@/types/booking';
import FilterBar from '@/components/filters/FilterBar';
import BookingsLoadingState from './BookingsLoadingState';
import EmptyBookingsState from './EmptyBookingsState';
import ViewSelector from './ViewSelector';

interface BookingsDisplayProps {
  bookings: RoomBooking[];
  filteredBookings: RoomBooking[];
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isLoading: boolean;
  clearFilters: () => void;
  onUploadClick?: () => void;
}

const BookingsDisplay: React.FC<BookingsDisplayProps> = ({
  bookings,
  filteredBookings,
  filterOptions,
  setFilterOptions,
  viewMode,
  setViewMode,
  isLoading,
  clearFilters,
  onUploadClick
}) => {
  console.log("BookingsDisplay rendered with:", filteredBookings.length, "filtered bookings from", bookings.length, "total bookings");
  
  if (isLoading) {
    return <BookingsLoadingState />;
  }

  if (bookings.length === 0) {
    return <EmptyBookingsState hasBookings={false} clearFilters={clearFilters} onUploadClick={onUploadClick} />;
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
      
      <ViewSelector 
        viewMode={viewMode}
        filteredBookings={filteredBookings}
        filterOptions={filterOptions}
      />
      
      {filteredBookings.length === 0 && bookings.length > 0 && (
        <EmptyBookingsState hasBookings={true} clearFilters={clearFilters} />
      )}
    </>
  );
};

export default BookingsDisplay;
