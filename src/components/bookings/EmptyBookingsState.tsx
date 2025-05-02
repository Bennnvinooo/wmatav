
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
        <AlertCircle className="h-12 w-12 mb-2 text-primary" />
        <h2 className="text-xl font-bold mb-2">No booking data available</h2>
        <p className="mb-4 text-center text-muted-foreground">
          Please check back later when data has been uploaded.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
          {onRefreshClick && (
            <Button 
              onClick={onRefreshClick}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          )}
          
          {onUploadClick && (
            <Button 
              onClick={onUploadClick}
              className="w-full"
              variant={onRefreshClick ? "outline" : "default"}
            >
              <Upload className="mr-2 h-4 w-4" />
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
        className="mt-4"
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default EmptyBookingsState;
