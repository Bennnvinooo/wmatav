
import React from 'react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { RoomBooking } from '@/types/booking';

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
        <h1 className="text-2xl md:text-3xl font-bold">WMATA AV Booking </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdate}
        </p>
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
