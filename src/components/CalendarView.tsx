
import { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isWithinInterval } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoomBooking, CalendarViewMode, FilterOptions } from '@/types/booking';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import BookingCard from './BookingCard';

interface CalendarViewProps {
  bookings: RoomBooking[];
  filterOptions: FilterOptions;
}

const CalendarView: React.FC<CalendarViewProps> = ({ bookings, filterOptions }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('day');
  const isMobile = useIsMobile();

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

  // Filter bookings for the current view
  const visibleBookings = useMemo(() => {
    return bookings.filter(booking => {
      const bookingDate = parseISO(booking.date);
      return isWithinInterval(bookingDate, {
        start: dateRange.start,
        end: dateRange.end
      });
    });
  }, [bookings, dateRange]);

  // Navigate to previous period
  const goToPrevious = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(prev => addDays(prev, -1));
        break;
      case 'week':
        setCurrentDate(prev => addDays(prev, -7));
        break;
      case 'month':
        setCurrentDate(prev => {
          const prevMonth = new Date(prev);
          prevMonth.setMonth(prev.getMonth() - 1);
          return prevMonth;
        });
        break;
    }
  };

  // Navigate to next period
  const goToNext = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(prev => addDays(prev, 1));
        break;
      case 'week':
        setCurrentDate(prev => addDays(prev, 7));
        break;
      case 'month':
        setCurrentDate(prev => {
          const nextMonth = new Date(prev);
          nextMonth.setMonth(prev.getMonth() + 1);
          return nextMonth;
        });
        break;
    }
  };

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

  // Get bookings for a specific day
  const getDayBookings = (date: Date) => {
    return visibleBookings.filter(booking => {
      const bookingDate = parseISO(booking.date);
      return isSameDay(bookingDate, date);
    }).sort((a, b) => {
      // Sort by start time
      return a.startTime.localeCompare(b.startTime);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 pb-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            aria-label="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left w-4 h-4"><path d="m15 18-6-6 6-6"/></svg>
          </Button>
          <div className="text-lg font-semibold">{periodTitle}</div>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            aria-label="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-4 h-4"><path d="m9 18 6-6-6-6"/></svg>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('day')}
            className="flex-1 md:flex-none"
          >
            Day
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
            className="flex-1 md:flex-none"
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
            className="flex-1 md:flex-none"
          >
            Month
          </Button>
        </div>
      </div>

      {viewMode === 'day' ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{format(currentDate, 'MMMM d, yyyy')}</h3>
          <div className="space-y-3">
            {getDayBookings(currentDate).length > 0 ? (
              getDayBookings(currentDate).map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground">No bookings for this day</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dateRange.days.map(date => {
            const dayBookings = getDayBookings(date);
            return (
              <Card key={date.toISOString()} className={cn(
                "h-full",
                isSameDay(date, new Date()) && "border-primary"
              )}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-semibold">
                    {format(date, 'EEE, MMM d')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2 max-h-[240px] overflow-y-auto">
                    {dayBookings.length > 0 ? (
                      dayBookings.map(booking => (
                        <BookingCard key={booking.id} booking={booking} compact={isMobile || viewMode === 'month'} />
                      ))
                    ) : (
                      <p className="text-xs text-center py-2 text-muted-foreground">No bookings</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
