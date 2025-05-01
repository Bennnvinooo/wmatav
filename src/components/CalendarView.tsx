
import { useState } from 'react';
import { RoomBooking, CalendarViewMode, FilterOptions } from '@/types/booking';
import { useCalendarDates } from '@/hooks/use-calendar-dates';
import { useBookingFilter } from '@/hooks/use-booking-filter';
import CalendarNavigation from './calendar/CalendarNavigation';
import DayView from './calendar/DayView';
import GridView from './calendar/GridView';

interface CalendarViewProps {
  bookings: RoomBooking[];
  filterOptions: FilterOptions;
}

const CalendarView: React.FC<CalendarViewProps> = ({ bookings, filterOptions }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('day');
  
  const { dateRange, periodTitle, goToPrevious, goToNext } = useCalendarDates(currentDate, viewMode);
  const { getDayBookings } = useBookingFilter(bookings, dateRange);

  const handlePrevious = () => {
    setCurrentDate(goToPrevious());
  };

  const handleNext = () => {
    setCurrentDate(goToNext());
  };

  return (
    <div className="space-y-4">
      <CalendarNavigation 
        periodTitle={periodTitle}
        viewMode={viewMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onViewModeChange={setViewMode}
      />

      {viewMode === 'day' ? (
        <DayView 
          currentDate={currentDate} 
          dayBookings={getDayBookings(currentDate)} 
        />
      ) : (
        <GridView 
          days={dateRange.days}
          getDayBookings={getDayBookings}
          viewMode={viewMode}
        />
      )}
    </div>
  );
};

export default CalendarView;
