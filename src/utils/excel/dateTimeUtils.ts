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
  
  // Try formats like "MM/DD/YYYY" or "YYYY-MM-DD"
  try {
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      return format(parsedDate, 'yyyy-MM-dd');
    }
  } catch (e) {
    console.error(`Failed to parse date with Date constructor: ${dateStr}`, e);
  }
  
  // Handle numerical dates (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)
  const datePattern = /^(\d{1,4})[-\/\.](\d{1,2})[-\/\.](\d{1,4})$/;
  const dateMatch = dateStr.match(datePattern);
  
  if (dateMatch) {
    let year, month, day;
    const [, part1, part2, part3] = dateMatch;
    
    // Determine the order based on the values and lengths
    if (part1.length === 4) {
      // Format is likely YYYY-MM-DD
      year = parseInt(part1, 10);
      month = parseInt(part2, 10);
      day = parseInt(part3, 10);
    } else if (part3.length === 4) {
      // Format is likely MM/DD/YYYY or DD/MM/YYYY
      year = parseInt(part3, 10);
      
      // Guess if it's MM/DD or DD/MM based on values
      const p1 = parseInt(part1, 10);
      const p2 = parseInt(part2, 10);
      
      if (p1 > 12 && p2 <= 12) {
        // First part is likely a day
        day = p1;
        month = p2;
      } else {
        // Assume MM/DD format as default
        month = p1;
        day = p2;
      }
    } else {
      // Can't determine format with confidence, try standard parsing
      return '';
    }
    
    // Validate components
    if (year < 100) year += 2000; // Assume 2-digit years are 2000s
    if (month < 1 || month > 12) return '';
    if (day < 1 || day > 31) return '';
    
    // Format to YYYY-MM-DD
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
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
  const timeRangePattern = /(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*[–\-\—]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i;
  const meetingHoursMatch = timeStr.match(timeRangePattern);
  
  if (meetingHoursMatch) {
    const startTimeStr = meetingHoursMatch[1];
    const endTimeStr = meetingHoursMatch[2];
    console.log(`Found time range: start=${startTimeStr}, end=${endTimeStr}`);
    return {
      startTime: normalizeTime(startTimeStr),
      endTime: normalizeTime(endTimeStr)
    };
  }
  
  // Try to find patterns like "9:00 AM" or "9AM" without a range
  const timePattern = /(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i;
  const timeMatch = timeStr.match(timePattern);
  
  if (timeMatch) {
    const startTimeStr = timeMatch[1];
    console.log(`Found single time: ${startTimeStr}`);
    const startTime = normalizeTime(startTimeStr);
    
    // Assume 1 hour duration if only start time is found
    let endHour = parseInt(startTime.split(':')[0], 10) + 1;
    if (endHour > 23) endHour = 23;
    
    const endTime = `${endHour.toString().padStart(2, '0')}:${startTime.split(':')[1]}`;
    
    return {
      startTime,
      endTime
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
  
  // Handle simple hour without AM/PM (assume working hours 8am-6pm)
  const hourOnly = /^(\d{1,2})$/;
  match = timeStr.match(hourOnly);
  if (match) {
    const hour = parseInt(match[1], 10);
    // If hour is small, assume it's during working hours (8am-6pm)
    if (hour <= 12) {
      return `${hour.toString().padStart(2, '0')}:00`;
    } else {
      // Otherwise use 24-hour format
      return `${hour.toString().padStart(2, '0')}:00`;
    }
  }
  
  // Return a safe default time if we can't parse the input
  console.warn(`Could not normalize time: ${timeStr}`);
  return '09:00'; // Default to 9:00 AM
};
