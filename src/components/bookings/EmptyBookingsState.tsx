
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Upload } from 'lucide-react';

interface EmptyBookingsStateProps {
  hasBookings: boolean;
  clearFilters: () => void;
  onUploadClick?: () => void;
}

const EmptyBookingsState: React.FC<EmptyBookingsStateProps> = ({
  hasBookings,
  clearFilters,
  onUploadClick
}) => {
  if (!hasBookings) {
    return (
      <div className="bg-blue-100 text-blue-800 p-6 rounded-lg shadow-md mt-8 flex flex-col items-center">
        <AlertCircle className="h-12 w-12 mb-2" />
        <h2 className="text-xl font-bold mb-2">No booking data available</h2>
        <p className="mb-4 text-center">Please check back later or upload new data.</p>
        
        {onUploadClick && (
          <Button 
            onClick={onUploadClick}
            className="mt-2"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Data Now
          </Button>
        )}
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
