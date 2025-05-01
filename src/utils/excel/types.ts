
import { RoomBooking } from '@/types/booking';

export interface ColumnMapping {
  roomName: string[];
  date: string[];
  startTime: string[];
  endTime: string[];
  bookedBy: string[];
  purpose: string[];
  status: string[];
  color: string[];
}

// Common column variations for each field
export const COLUMN_VARIATIONS: ColumnMapping = {
  roomName: ['room', 'room name', 'location', 'venue', 'meeting room', 'space', 'station'],
  date: ['date', 'booking date', 'meeting date', 'day', 'when', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  startTime: ['start time', 'start', 'from', 'begins at', 'beginning', 'time start', 'start at', 'from time', 'time'],
  endTime: ['end time', 'end', 'to', 'until', 'ending at', 'time end', 'finish', 'finish time'],
  bookedBy: ['booked by', 'organizer', 'booking person', 'booker', 'reserved by', 'host', 'department', 'team', 'organization', 'organization/group'],
  purpose: ['purpose', 'reason', 'description', 'meeting title', 'event name', 'subject', 'title', 'about', 'set-up guide'],
  status: ['status', 'booking status', 'state', 'condition'],
  color: ['color', 'colour', 'background', 'highlight']
};

// New spreadsheet column mapping - exact column headers from the provided spreadsheet
export const EXACT_COLUMN_HEADERS = {
  date: "Date",
  organization: "Organization/Group",
  station: "Station",
  location: "Location",
  time: "Time",
  setupGuide: "Set-up Guide",
  contactInfo: "Coordinator Contact Information",
  color: "Color"
};
