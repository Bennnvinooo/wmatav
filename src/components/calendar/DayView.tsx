
import { format } from 'date-fns';
import { RoomBooking } from '@/types/booking';
import BookingCard from '../BookingCard';

interface DayViewProps {
  currentDate: Date;
  dayBookings: RoomBooking[];
}

const DayView: React.FC<DayViewProps> = ({ currentDate, dayBookings }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{format(currentDate, 'MMMM d, yyyy')}</h3>
      <div className="space-y-3">
        {dayBookings.length > 0 ? (
          dayBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <p className="text-center py-8 text-muted-foreground">No bookings for this day</p>
        )}
      </div>
    </div>
  );
};

export default DayView;
