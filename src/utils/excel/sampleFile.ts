
import * as XLSX from 'xlsx';

export const generateSampleFile = (): Blob => {
  const sampleData = [
    ['Date', 'Organization/Group', 'Station', 'Location', 'Time', 'Set-up Guide', 'Coordinator Contact Information', 'Color'],
    ['Monday May 14th', 'SAFETY CERTIFICATION TRAINING', 'New Carrolton', 'NC - Multipurpose Rooms: 101-17, 101-18 & 101-19', '7:00AM – 5:00PM', 'Expected Guests: 40\nSet-up Style: CLASSROOM\nSet-up Time: 6:00AM', 'Alvin Addison | 202 – 381-8266\nAAddison@wmata.com', 'Blue'],
    ['Tuesday May 15th', 'METRO TRANSIT POLICE', 'College Park', 'CP - Room 112A', '9:00AM – 12:00PM', 'Expected Guests: 15\nSet-up Style: CLASSROOM\nSet-up Time: 8:00AM', 'Sarah Johnson | 202-555-1234\nSJohnson@wmata.com', 'Green'],
    ['Wednesday May 16th', 'IT DEPARTMENT', 'Greenbelt', 'GB - Conference Room 203', '1:00PM – 3:00PM', 'Expected Guests: 10\nSet-up Style: BOARDROOM\nSet-up Time: 12:00PM', 'Michael Chen | 202-555-7890\nMChen@wmata.com', 'Red'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Room Bookings');
  
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};
