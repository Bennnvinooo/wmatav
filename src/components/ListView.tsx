
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { RoomBooking, FilterOptions } from '@/types/booking';
import BookingCard from './BookingCard';

interface ListViewProps {
  bookings: RoomBooking[];
  filterOptions: FilterOptions;
}

const ListView: React.FC<ListViewProps> = ({ bookings, filterOptions }) => {
  // Group bookings by date
  const groupedBookings = useMemo(() => {
    const groups: Record<string, RoomBooking[]> = {};
    
    // Sort bookings by date and then by start time
    const sortedBookings = [...bookings].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
    
    sortedBookings.forEach(booking => {
      if (!groups[booking.date]) {
        groups[booking.date] = [];
      }
      groups[booking.date].push(booking);
    });
    
    return groups;
  }, [bookings]);
  
  // Convert grouped bookings into array for rendering
  const groupedBookingsArray = useMemo(() => {
    return Object.entries(groupedBookings)
      .map(([date, bookings]) => ({
        date,
        bookings
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [groupedBookings]);
  
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No bookings match the current filters</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {groupedBookingsArray.map(group => (
        <div key={group.date} className="space-y-4">
          <h3 className="sticky top-0 z-10 bg-background py-2 text-lg font-semibold border-b">
            {format(parseISO(group.date), 'EEEE, MMMM d, yyyy')}
          </h3>
          <div className="space-y-3">
            {group.bookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView;
