
export interface RoomBooking {
  id: string;
  roomName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24-hour)
  endTime: string; // HH:MM (24-hour)
  bookedBy: string;
  purpose: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface ColumnMapping {
  roomName: string[];
  date: string[];
  startTime: string[];
  endTime: string[];
  bookedBy: string[];
  purpose: string[];
  status: string[];
}

export type ViewMode = 'calendar' | 'list';

export type CalendarViewMode = 'day' | 'week' | 'month';

export interface FilterOptions {
  roomName: string | null;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  bookedBy: string | null;
  status: ('confirmed' | 'pending' | 'cancelled')[] | null;
  searchTerm: string;
}
