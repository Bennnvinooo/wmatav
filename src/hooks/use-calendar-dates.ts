
import { useMemo } from 'react';
import { 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  format
} from 'date-fns';
import { CalendarViewMode } from '@/types/booking';

export const useCalendarDates = (currentDate: Date, viewMode: CalendarViewMode) => {
  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    let start: Date;
    let end: Date;
    
    switch (viewMode) {
      case 'day':
        start = currentDate;
        end = currentDate;
        break;
      case 'week':
        start = startOfWeek(currentDate, { weekStartsOn: 1 });
        end = endOfWeek(currentDate, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
        break;
    }
    
    return { 
      start, 
      end,
      days: eachDayOfInterval({ start, end }) 
    };
  }, [currentDate, viewMode]);

  // Calculate current period title
  const periodTitle = useMemo(() => {
    switch (viewMode) {
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'week':
        return `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
    }
  }, [currentDate, viewMode, dateRange]);

  // Navigation functions
  const goToPrevious = () => {
    switch (viewMode) {
      case 'day':
        return addDays(currentDate, -1);
      case 'week':
        return addDays(currentDate, -7);
      case 'month':
        const prevMonth = new Date(currentDate);
        prevMonth.setMonth(currentDate.getMonth() - 1);
        return prevMonth;
    }
  };

  const goToNext = () => {
    switch (viewMode) {
      case 'day':
        return addDays(currentDate, 1);
      case 'week':
        return addDays(currentDate, 7);
      case 'month':
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(currentDate.getMonth() + 1);
        return nextMonth;
    }
  };

  return {
    dateRange,
    periodTitle,
    goToPrevious,
    goToNext
  };
};
