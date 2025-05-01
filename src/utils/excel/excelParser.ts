
import * as XLSX from 'xlsx';
import { RoomBooking } from '@/types/booking';
import { v4 as uuidv4 } from 'uuid';
import { COLUMN_VARIATIONS } from './types';
import { findMatchingColumn } from './columnUtils';
import { normalizeDate, normalizeTime, extractTimeRange } from './dateTimeUtils';
import { normalizeStatus, normalizeColor } from './dataUtils';

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
        
        console.log("Raw Excel data:", rawData.slice(0, 5)); // Log first few rows
        
        // Find header row (first non-empty row)
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(10, rawData.length); i++) {
          const row = rawData[i] as unknown[];
          if (Array.isArray(row) && row.filter(Boolean).length > 3) { // At least 3 non-empty cells
            headerRowIndex = i;
            break;
          }
        }
        
        // Process headers
        const headers = ((rawData[headerRowIndex] as unknown[]) || []).map(h => 
          h ? String(h).toLowerCase().trim() : ''
        );
        
        console.log("Excel headers:", headers);
        
        // Special handling for data with no formal headers (like your example)
        if (!headers.some(h => 
          COLUMN_VARIATIONS.date.some(variant => h.includes(variant)) || 
          COLUMN_VARIATIONS.roomName.some(variant => h.includes(variant))
        )) {
          console.log("Using first row data pattern recognition since no clear headers found");
          
          // Try to guess the columns based on their content in the data rows
          // For example, column 0 might contain dates like "Monday April 14th 2025"
          const sampleRow = rawData[headerRowIndex + 1] as unknown[];
          if (sampleRow && Array.isArray(sampleRow)) {
            console.log("Sample data row:", sampleRow);
            
            // Use column index mapping based on the sample spreadsheet image
            const columnIndexes = {
              date: 0,           // "Monday April 14th 2025"
              bookedBy: 1,       // "SAFETY CERTIFICATION TRAINING"
              location: 2,       // "New Carrolton"
              roomName: 3,       // "NC – Multiurpose Rooms: 101-17, 101-18 & 101-19"
              timeRange: 4,      // "Meeting Hours: 7:00AM – 5:00PM"
              purpose: 5,        // "Expected Guests: 45 | Set-up Style: CLASSROOM | Catering: YES"
              contact: 6,        // "Alvin Addison | 202 – 381 – 8266 | AAddison@wmata.com"
              color: -1          // Use background color of cell if available
            };
            
            // Process data rows - skip header row
            const bookings: RoomBooking[] = [];
            for (let i = headerRowIndex + 1; i < rawData.length; i++) {
              const row = rawData[i] as any[];
              
              // Skip empty rows
              if (!Array.isArray(row) || row.filter(Boolean).length < 3) continue;
              
              console.log(`Processing row ${i}:`, row);
              
              // Extract date from format like "Monday April 14th 2025"
              let dateValue = row[columnIndexes.date] || '';
              let date = '';
              
              try {
                date = normalizeDate(String(dateValue));
                console.log("Normalized date:", date, "from", dateValue);
              } catch (error) {
                console.error("Date normalization failed:", error);
                continue; // Skip rows with invalid dates
              }
              
              // Extract time range
              const timeRangeValue = row[columnIndexes.timeRange] || '';
              let startTime = '09:00';
              let endTime = '17:00';
              
              if (timeRangeValue) {
                try {
                  const times = extractTimeRange(String(timeRangeValue));
                  startTime = times.startTime || startTime;
                  endTime = times.endTime || endTime;
                  console.log("Extracted times:", startTime, endTime, "from", timeRangeValue);
                } catch (error) {
                  console.error("Time extraction failed:", error);
                }
              }
              
              // Skip rows with missing essential data
              if (!date) {
                console.log("Skipping row with missing date");
                continue;
              }
              
              // Create the booking object
              const booking: RoomBooking = {
                id: uuidv4(),
                roomName: row[columnIndexes.roomName] ? String(row[columnIndexes.roomName]) : 
                          (row[columnIndexes.location] ? String(row[columnIndexes.location]) : 'Unknown Room'),
                date,
                startTime,
                endTime,
                bookedBy: row[columnIndexes.bookedBy] ? String(row[columnIndexes.bookedBy]) : 'Unknown',
                purpose: row[columnIndexes.purpose] ? String(row[columnIndexes.purpose]) : 'No description',
                status: 'confirmed',
                // Use cell background color from Excel if possible
                color: row.length > columnIndexes.color && columnIndexes.color >= 0 ? 
                       normalizeColor(String(row[columnIndexes.color])) : getRowColor(i)
              };
              
              bookings.push(booking);
              console.log("Created booking:", booking);
            }
            
            console.log(`Parsed ${bookings.length} bookings from the file`);
            resolve(bookings);
            return;
          }
        }
        
        // Standard column mapping (fallback to original logic)
        const columnIndexes = {
          roomName: findMatchingColumn(headers, COLUMN_VARIATIONS.roomName),
          date: findMatchingColumn(headers, COLUMN_VARIATIONS.date),
          startTime: findMatchingColumn(headers, COLUMN_VARIATIONS.startTime),
          endTime: findMatchingColumn(headers, COLUMN_VARIATIONS.endTime),
          bookedBy: findMatchingColumn(headers, COLUMN_VARIATIONS.bookedBy),
          purpose: findMatchingColumn(headers, COLUMN_VARIATIONS.purpose),
          status: findMatchingColumn(headers, COLUMN_VARIATIONS.status),
          color: findMatchingColumn(headers, COLUMN_VARIATIONS.color)
        };
        
        console.log("Found column indexes:", columnIndexes);
        
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
          console.warn(`Missing columns: ${missingFields.join(', ')}, will try to infer from data`);
        }
        
        // Process data rows
        const bookings: RoomBooking[] = [];
        for (let i = headerRowIndex + 1; i < rawData.length; i++) {
          const row = rawData[i] as any[];
          
          // Skip empty rows
          if (!Array.isArray(row) || row.filter(Boolean).length < 2) continue;
          
          const roomName = columnIndexes.roomName !== -1 ? String(row[columnIndexes.roomName] || '') : 'Unknown';
          let date = '';
          
          try {
            date = columnIndexes.date !== -1 ? normalizeDate(row[columnIndexes.date]) : '';
          } catch (error) {
            console.error(`Error normalizing date for row ${i}:`, error);
            continue; // Skip this row if date parsing fails
          }
          
          let startTime = '';
          let endTime = '';
          
          try {
            // Handle cases where time information is in a single "Meeting Hours" column
            if (meetingHoursIndex !== -1 && meetingHoursIndex >= 0) {
              const timeRange = extractTimeRange(String(row[meetingHoursIndex] || ''));
              startTime = timeRange.startTime;
              endTime = timeRange.endTime;
            } else {
              startTime = columnIndexes.startTime !== -1 ? normalizeTime(row[columnIndexes.startTime]) : '09:00';
              endTime = columnIndexes.endTime !== -1 ? normalizeTime(row[columnIndexes.endTime]) : '10:00';
            }
          } catch (error) {
            console.error(`Error normalizing time for row ${i}:`, error);
            startTime = '09:00';
            endTime = '10:00';
          }
          
          // Add color handling
          const colorValue = columnIndexes.color !== -1 ? normalizeColor(String(row[columnIndexes.color] || '')) : '';
          
          // Skip rows with missing essential data
          if (!date) continue; // Only require date to be present
          
          const booking: RoomBooking = {
            id: uuidv4(),
            roomName: roomName || 'Unknown Room',
            date,
            startTime,
            endTime,
            bookedBy: columnIndexes.bookedBy !== -1 ? String(row[columnIndexes.bookedBy] || 'Unknown') : 'Unknown',
            purpose: columnIndexes.purpose !== -1 ? String(row[columnIndexes.purpose] || 'No description') : 'No description',
            status: columnIndexes.status !== -1 
              ? normalizeStatus(String(row[columnIndexes.status] || ''))
              : 'confirmed',
            color: colorValue || getRowColor(i)
          };
          
          bookings.push(booking);
        }
        
        console.log("Parsed bookings:", bookings);
        if (bookings.length > 0) {
          console.log("Sample booking:", bookings[0]);
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

// Helper function to get colors based on row number (for striped effect)
function getRowColor(rowIndex: number): string {
  // Cycle through some colors based on row index
  const colors = ['#FF9800', '#2196F3', '#4CAF50', '#9C27B0', '#E91E63'];
  return colors[rowIndex % colors.length];
}
