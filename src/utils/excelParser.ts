import * as XLSX from 'xlsx';
import { RoomBooking, ColumnMapping } from '@/types/booking';
import { v4 as uuidv4 } from 'uuid';

// Common column variations for each field
const COLUMN_VARIATIONS: ColumnMapping = {
  roomName: ['room', 'room name', 'location', 'venue', 'meeting room', 'space', 'station'],
  date: ['date', 'booking date', 'meeting date', 'day', 'when', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  startTime: ['start time', 'start', 'from', 'begins at', 'beginning', 'time start', 'start at', 'from time', 'time', 'meeting hours'],
  endTime: ['end time', 'end', 'to', 'until', 'ending at', 'time end', 'finish', 'finish time', 'meeting hours'],
  bookedBy: ['booked by', 'organizer', 'booking person', 'booker', 'reserved by', 'host', 'department', 'team', 'organization', 'organization/group'],
  purpose: ['purpose', 'reason', 'description', 'meeting title', 'event name', 'subject', 'title', 'about', 'set-up guide'],
  status: ['status', 'booking status', 'state', 'condition']
};

// Function to find the best match column for a field
const findMatchingColumn = (headers: string[], fieldVariations: string[]): number => {
  for (const variation of fieldVariations) {
    const matchIndex = headers.findIndex(h => 
      h.toLowerCase().trim() === variation ||
      h.toLowerCase().trim().includes(variation)
    );
    if (matchIndex !== -1) return matchIndex;
  }
  return -1;
};

// Normalize date format to YYYY-MM-DD
const normalizeDate = (dateValue: string | number): string => {
  if (!dateValue) return '';
  
  // If it's an Excel date number
  if (typeof dateValue === 'number') {
    const excelDate = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
    return excelDate.toISOString().split('T')[0]; // YYYY-MM-DD
  }
  
  // Handle string dates in various formats
  const dateStr = String(dateValue).trim();
  
  // Try to parse with Date constructor
  const parsedDate = new Date(dateStr);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().split('T')[0];
  }
  
  // Common date formats: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
  const mmddyyyy = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/;
  const ddmmyyyy = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/;
  
  let match = dateStr.match(mmddyyyy);
  if (match) {
    // Assuming MM/DD/YYYY
    const [_, month, day, year] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  match = dateStr.match(ddmmyyyy);
  if (match) {
    // Assuming DD/MM/YYYY
    const [_, day, month, year] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // If all else fails, return the original string
  console.warn(`Could not normalize date: ${dateStr}`);
  return dateStr;
};

// Extract time from strings like "Meeting Hours: 7:00AM – 5:00PM"
const extractTimeRange = (timeStr: string): { startTime: string, endTime: string } => {
  if (!timeStr) return { startTime: '', endTime: '' };
  
  // Handle format like "Meeting Hours: 7:00AM – 5:00PM"
  const meetingHoursMatch = timeStr.match(/hours?:?\s*(\d{1,2}:\d{2}\s*(?:am|pm)?)\s*[-–]\s*(\d{1,2}:\d{2}\s*(?:am|pm)?)/i);
  if (meetingHoursMatch) {
    const startTimeStr = meetingHoursMatch[1];
    const endTimeStr = meetingHoursMatch[2];
    return {
      startTime: normalizeTime(startTimeStr),
      endTime: normalizeTime(endTimeStr)
    };
  }
  
  return { startTime: '', endTime: '' };
};

// Normalize time format to HH:MM (24-hour)
const normalizeTime = (timeValue: string | number): string => {
  if (!timeValue) return '';
  
  // If it's an Excel time number (fraction of 24 hours)
  if (typeof timeValue === 'number') {
    const totalMinutes = Math.round(timeValue * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  // Handle string times
  const timeStr = String(timeValue).trim().toLowerCase();
  
  // Try 24-hour format: HH:MM or H:MM
  const militaryTime = /^(\d{1,2}):(\d{2})$/;
  let match = timeStr.match(militaryTime);
  if (match) {
    const [_, hours, minutes] = match;
    return `${hours.padStart(2, '0')}:${minutes}`;
  }
  
  // Try 12-hour format: HH:MM AM/PM or H:MM AM/PM
  const twelveHour = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i;
  match = timeStr.match(twelveHour);
  if (match) {
    let [_, hours, minutes, ampm] = match;
    let hour = parseInt(hours, 10);
    if (ampm.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  }

  // Parse time ranges like "7:00AM" from "7:00AM - 5:00PM"
  const singleTime = /^(\d{1,2}):(\d{2})\s*(am|pm)?/i;
  match = timeStr.match(singleTime);
  if (match) {
    let [_, hours, minutes, ampm] = match;
    let hour = parseInt(hours, 10);
    if (ampm && ampm.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (ampm && ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  }
  
  // If all else fails, return the original string
  console.warn(`Could not normalize time: ${timeStr}`);
  return timeStr;
};

// Normalize status to one of: 'confirmed', 'pending', 'cancelled'
const normalizeStatus = (statusValue: string): 'confirmed' | 'pending' | 'cancelled' => {
  if (!statusValue) return 'pending';
  
  const status = String(statusValue).trim().toLowerCase();
  
  if (status.includes('confirm') || status.includes('approved') || status === 'yes' || status === 'y') {
    return 'confirmed';
  } else if (status.includes('cancel') || status.includes('declined') || status === 'no' || status === 'n') {
    return 'cancelled';
  } else {
    return 'pending';
  }
};

export const parseExcelFile = async (file: File): Promise<RoomBooking[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error('Failed to read file');
        }
        
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Find the most relevant sheet (prefer sheets with "booking" in the name)
        let sheetName = workbook.SheetNames[0]; // Default to first sheet
        const bookingSheet = workbook.SheetNames.find(name => 
          name.toLowerCase().includes('booking') || 
          name.toLowerCase().includes('schedule') ||
          name.toLowerCase().includes('room')
        );
        if (bookingSheet) sheetName = bookingSheet;
        
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as unknown[];
        
        if (!Array.isArray(rawData) || rawData.length < 2) {
          throw new Error('File contains insufficient data');
        }
        
        // Find header row (first non-empty row)
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(10, rawData.length); i++) {
          const row = rawData[i] as unknown[];
          if (Array.isArray(row) && row.filter(Boolean).length > 3) { // At least 3 non-empty cells
            headerRowIndex = i;
            break;
          }
        }
        
        const headers = ((rawData[headerRowIndex] as unknown[]) || []).map(h => 
          h ? String(h).toLowerCase().trim() : ''
        );
        
        // Find column indexes for each required field
        const columnIndexes = {
          roomName: findMatchingColumn(headers, COLUMN_VARIATIONS.roomName),
          date: findMatchingColumn(headers, COLUMN_VARIATIONS.date),
          startTime: findMatchingColumn(headers, COLUMN_VARIATIONS.startTime),
          endTime: findMatchingColumn(headers, COLUMN_VARIATIONS.endTime),
          bookedBy: findMatchingColumn(headers, COLUMN_VARIATIONS.bookedBy),
          purpose: findMatchingColumn(headers, COLUMN_VARIATIONS.purpose),
          status: findMatchingColumn(headers, COLUMN_VARIATIONS.status),
        };
        
        console.log("Found column indexes:", columnIndexes);
        console.log("Headers:", headers);
        
        // Special handling for meeting hours column that contains both start and end times
        const meetingHoursIndex = headers.findIndex(h => 
          h.includes('meeting hours') || h.includes('time') || h.includes('hours')
        );
        
        // Check if minimum required fields are found
        const missingFields = [];
        
        // Required fields check - handle the case where meeting hours contains both start and end times
        if (columnIndexes.roomName === -1) missingFields.push('roomName');
        if (columnIndexes.date === -1) missingFields.push('date');
        
        if (columnIndexes.startTime === -1 && columnIndexes.endTime === -1 && meetingHoursIndex === -1) {
          missingFields.push('startTime');
          missingFields.push('endTime');
        }
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required columns: ${missingFields.join(', ')}`);
        }
        
        // Process data rows
        const bookings: RoomBooking[] = [];
        for (let i = headerRowIndex + 1; i < rawData.length; i++) {
          const row = rawData[i] as any[];
          
          // Skip empty rows
          if (!Array.isArray(row) || row.filter(Boolean).length < 3) continue;
          
          const roomName = columnIndexes.roomName !== -1 ? String(row[columnIndexes.roomName] || '') : 'Unknown';
          const date = columnIndexes.date !== -1 ? normalizeDate(row[columnIndexes.date]) : '';
          
          let startTime = '';
          let endTime = '';
          
          // Handle cases where time information is in a single "Meeting Hours" column
          if (meetingHoursIndex !== -1 && meetingHoursIndex >= 0) {
            const timeRange = extractTimeRange(String(row[meetingHoursIndex] || ''));
            startTime = timeRange.startTime;
            endTime = timeRange.endTime;
          } else {
            startTime = columnIndexes.startTime !== -1 ? normalizeTime(row[columnIndexes.startTime]) : '';
            endTime = columnIndexes.endTime !== -1 ? normalizeTime(row[columnIndexes.endTime]) : '';
          }
          
          // Skip rows with missing essential data
          if (!roomName || !date) continue;
          
          // If we have a time range but couldn't parse it, skip this row
          if ((meetingHoursIndex !== -1 && (!startTime || !endTime)) && 
             (columnIndexes.startTime === -1 || columnIndexes.endTime === -1)) {
            continue;
          }
          
          const booking: RoomBooking = {
            id: uuidv4(),
            roomName,
            date,
            startTime,
            endTime,
            bookedBy: columnIndexes.bookedBy !== -1 ? String(row[columnIndexes.bookedBy] || 'Unknown') : 'Unknown',
            purpose: columnIndexes.purpose !== -1 ? String(row[columnIndexes.purpose] || 'No description') : 'No description',
            status: columnIndexes.status !== -1 
              ? normalizeStatus(String(row[columnIndexes.status] || ''))
              : 'confirmed'
          };
          
          bookings.push(booking);
        }
        
        resolve(bookings);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const generateSampleFile = (): Blob => {
  const sampleData = [
    ['Date', 'Organization/Group', 'Station', 'Location', 'Meeting Hours', 'Set-up Guide', 'Coordinator Contact Information', 'Color'],
    ['Monday May 14th', 'SAFETY CERTIFICATION TRAINING', 'New Carrolton', 'NC - Multipurpose Rooms: 101-17, 101-18 & 101-19', 'Meeting Hours: 7:00AM – 5:00PM', 'Expected Guests: 40\nSet-up Style: CLASSROOM\nSet-up Time: 6:00AM', 'Alvin Addison | 202 – 381-8266\nAAddison@wmata.com', ''],
    ['Tuesday May 15th', 'METRO TRANSIT POLICE', 'College Park', 'CP - Room 112A', 'Meeting Hours: 9:00AM – 12:00PM', 'Expected Guests: 15\nSet-up Style: CLASSROOM\nSet-up Time: 8:00AM', 'Sarah Johnson | 202-555-1234\nSJohnson@wmata.com', ''],
    ['Wednesday May 16th', 'IT DEPARTMENT', 'Greenbelt', 'GB - Conference Room 203', 'Meeting Hours: 1:00PM – 3:00PM', 'Expected Guests: 10\nSet-up Style: BOARDROOM\nSet-up Time: 12:00PM', 'Michael Chen | 202-555-7890\nMChen@wmata.com', ''],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Room Bookings');
  
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};
