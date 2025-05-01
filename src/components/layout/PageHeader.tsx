
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { RoomBooking } from '@/types/booking';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Settings, ChevronDown } from 'lucide-react';

interface PageHeaderProps {
  lastUpdate: string;
  onUploadClick: () => void;
  bookings?: RoomBooking[];
}

const PageHeader: React.FC<PageHeaderProps> = ({
  lastUpdate,
  onUploadClick,
  bookings = []
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isPublicMode, setIsPublicMode] = useState(false);
  
  // Check if we're in public mode
  useEffect(() => {
    const hostname = window.location.hostname;
    setIsPublicMode(hostname === 'wmatav.lovable.app');
  }, []);
  
  const handleDownloadExcel = () => {
    if (!bookings || bookings.length === 0) {
      console.log("No bookings data to download");
      return;
    }
    
    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Map the bookings data to a format suitable for Excel
    const excelData = bookings.map(booking => ({
      'Room Name': booking.roomName,
      'Date': booking.date,
      'Start Time': booking.startTime,
      'End Time': booking.endTime,
      'Booked By': booking.bookedBy,
      'Purpose': booking.purpose,
      'Status': booking.status,
    }));
    
    // Convert the data to worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    
    // Generate the Excel file and trigger download
    const fileName = `wmata_bookings_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };
  
  return <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-1">
          {!isPublicMode ? (
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1 hover:text-primary transition-colors focus:outline-none rounded-md px-2 py-1 hover:bg-accent/50"
              aria-label="Toggle settings"
            >
              <h1 className="text-2xl md:text-3xl font-bold">WMATA AV Booking</h1>
              <ChevronDown className={`h-5 w-5 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold">WMATA AV Booking</h1>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdate}
        </p>
        
        {showSettings && !isPublicMode && (
          <Card className="mt-3 w-full md:max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Access settings and configuration options for the WMATA AV Booking system.
                </p>
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowSettings(false)}
                    className="w-full"
                  >
                    Close Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-2">
        <Button 
          onClick={handleDownloadExcel} 
          variant="outline"
          className="md:w-auto w-full order-2 md:order-1"
          disabled={!bookings || bookings.length === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Download Sheet
        </Button>
        
        <Button onClick={onUploadClick} className="md:w-auto w-full order-1 md:order-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
          Upload New File
        </Button>
      </div>
    </div>;
};

export default PageHeader;
