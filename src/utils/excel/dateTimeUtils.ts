
import { format } from 'date-fns';

// Parse month names to numbers
export const parseMonthName = (monthName: string): number => {
  const months: Record<string, number> = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11
  };
  
  return months[monthName.toLowerCase()] || -1;
};

// Normalize date format to YYYY-MM-DD
export const normalizeDate = (dateValue: string | number): string => {
  if (!dateValue) return '';
  
  // If it's an Excel date number
  if (typeof dateValue === 'number') {
    const excelDate = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
    return format(excelDate, 'yyyy-MM-dd');
  }
  
  // Handle string dates in various formats
  const dateStr = String(dateValue).trim();
  
  console.log("Normalizing date:", dateStr);
  
  // Try to handle formats like "Monday April 14th 2025"
  const dayMonthPattern = /(?:mon|tues|wednes|thurs|fri|satur|sun)?day\s+(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\d{4})/i;
  const dayMonthMatch = dateStr.match(dayMonthPattern);
  if (dayMonthMatch) {
    const [, monthName, dayStr, yearStr] = dayMonthMatch;
    const month = parseMonthName(monthName);
    const day = parseInt(dayStr, 10);
    const year = parseInt(yearStr, 10);
    
    console.log(`Parsed day pattern: ${monthName}(${month}) ${day}, ${year}`);
    
    if (month !== -1 && !isNaN(day) && !isNaN(year)) {
      try {
        // Create a date object and format it as YYYY-MM-DD
        const date = new Date(year, month, day);
        const formatted = format(date, 'yyyy-MM-dd');
        console.log("Successfully formatted date:", formatted);
        return formatted;
      } catch (e) {
        console.error(`Failed to parse date: ${dateStr}`, e);
      }
    }
  }
  
  // Try to parse with Date constructor
  try {
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      return format(parsedDate, 'yyyy-MM-dd');
    }
  } catch (e) {
    console.error(`Failed to parse date with Date constructor: ${dateStr}`, e);
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
  
  // Return a safe default date if we can't parse the input
  console.warn(`Could not normalize date: ${dateStr}`);
  const today = new Date();
  return format(today, 'yyyy-MM-dd');
};

// Extract time range from strings like "Meeting Hours: 7:00AM – 5:00PM"
export const extractTimeRange = (timeStr: string): { startTime: string, endTime: string } => {
  if (!timeStr) return { startTime: '', endTime: '' };
  
  timeStr = timeStr.toLowerCase();
  console.log("Extracting time range from:", timeStr);
  
  // Handle format like "Meeting Hours: 7:00AM – 5:00PM"
  // Also handle different dash types and spacing
  const meetingHoursMatch = timeStr.match(/(?:meeting\s+hours|hours)?:?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*[–\-\—]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (meetingHoursMatch) {
    const startTimeStr = meetingHoursMatch[1];
    const endTimeStr = meetingHoursMatch[2];
    console.log(`Found time range: start=${startTimeStr}, end=${endTimeStr}`);
    return {
      startTime: normalizeTime(startTimeStr),
      endTime: normalizeTime(endTimeStr)
    };
  }
  
  // If we can't extract a range, provide safe default values
  console.log("Could not extract time range, using defaults");
  return { startTime: '09:00', endTime: '10:00' };
};

// Normalize time format to HH:MM (24-hour)
export const normalizeTime = (timeValue: string | number): string => {
  if (!timeValue) return '';
  
  console.log("Normalizing time:", timeValue);
  
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
  const twelveHour = /^(\d{1,2}):?(\d{2})?\s*(am|pm)$/i;
  match = timeStr.match(twelveHour);
  if (match) {
    let [_, hours, minutes, ampm] = match;
    minutes = minutes || '00';
    let hour = parseInt(hours, 10);
    if (ampm.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  }

  // Try format like "7am", "10pm" without minutes
  const simpleTime = /^(\d{1,2})\s*(am|pm)$/i;
  match = timeStr.match(simpleTime);
  if (match) {
    let [_, hours, ampm] = match;
    let hour = parseInt(hours, 10);
    if (ampm.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:00`;
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
  
  // Return a safe default time if we can't parse the input
  console.warn(`Could not normalize time: ${timeStr}`);
  return '09:00'; // Default to 9:00 AM to avoid runtime errors
};
