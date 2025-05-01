
import React from 'react';
import { ViewMode, FilterOptions } from '@/types/booking';
import CalendarView from '@/components/CalendarView';
import ListView from '@/components/ListView';

interface ViewSelectorProps {
  viewMode: ViewMode;
  filteredBookings: any[];
  filterOptions: FilterOptions;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({
  viewMode,
  filteredBookings,
  filterOptions
}) => {
  return viewMode === 'calendar' ? (
    <CalendarView bookings={filteredBookings} filterOptions={filterOptions} />
  ) : (
    <ListView bookings={filteredBookings} filterOptions={filterOptions} />
  );
};

export default ViewSelector;
