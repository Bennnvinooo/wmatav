
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
          color: findMatchingColumn(headers, COLUMN_VARIATIONS.color)
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
            color: colorValue
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
