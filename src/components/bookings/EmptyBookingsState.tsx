
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyBookingsStateProps {
  hasBookings: boolean;
  clearFilters: () => void;
}

const EmptyBookingsState: React.FC<EmptyBookingsStateProps> = ({
  hasBookings,
  clearFilters
}) => {
  if (!hasBookings) {
    return (
      <div className="bg-blue-100 text-blue-800 p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-xl font-bold mb-2">No booking data available</h2>
        <p className="mb-4">Please check back later or upload new data.</p>
      </div>
    );
  }

  // Case where we have bookings but none match the current filters
  return (
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
  );
};

export default EmptyBookingsState;
