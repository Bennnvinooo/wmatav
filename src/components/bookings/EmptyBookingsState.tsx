
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Upload, RefreshCw } from 'lucide-react';

interface EmptyBookingsStateProps {
  hasBookings: boolean;
  clearFilters: () => void;
  onUploadClick?: () => void;
  onRefreshClick?: () => void;
}

const EmptyBookingsState: React.FC<EmptyBookingsStateProps> = ({
  hasBookings,
  clearFilters,
  onUploadClick,
  onRefreshClick
}) => {
  if (!hasBookings) {
    return (
      <div className="bg-background border rounded-lg shadow-md p-6 mx-auto max-w-md mt-4 flex flex-col items-center text-center">
        <AlertCircle className="h-14 w-14 mb-3 text-primary" />
        <h2 className="text-xl font-semibold mb-3">No booking data available</h2>
        <p className="mb-5 text-center text-muted-foreground">
          Please check back later when data has been uploaded.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          {onRefreshClick && (
            <Button 
              onClick={onRefreshClick}
              className="w-full py-6 text-base"
              variant="default"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Refresh Data
            </Button>
          )}
          
          {onUploadClick && (
            <Button 
              onClick={onUploadClick}
              className="w-full py-6 text-base"
              variant={onRefreshClick ? "outline" : "default"}
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Data
            </Button>
          )}
        </div>
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
        className="mt-5 py-6 px-6 text-base"
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default EmptyBookingsState;
