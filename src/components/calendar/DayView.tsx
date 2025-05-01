
import { format, parse } from 'date-fns';
import { RoomBooking } from '@/types/booking';
import BookingCard from '../BookingCard';
import { cn } from '@/lib/utils';

interface DayViewProps {
  currentDate: Date;
  dayBookings: RoomBooking[];
}

const DayView: React.FC<DayViewProps> = ({ currentDate, dayBookings }) => {
  // Create array of hours for the day (7am to 9pm)
  const hourSlots = Array.from({ length: 15 }, (_, i) => i + 7);
  
  // Group bookings by hour
  const bookingsByHour: Record<number, RoomBooking[]> = {};
  
  // Initialize empty arrays for each hour slot
  hourSlots.forEach(hour => {
    bookingsByHour[hour] = [];
  });
  
  // Sort bookings into their respective hour slots
  dayBookings.forEach(booking => {
    try {
      // Parse the start time (assuming format like "09:00" or "14:30")
      const timeStr = booking.startTime;
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      if (!isNaN(hours) && hours >= 0 && hours < 24) {
        // Place the booking in the correct hour slot
        if (bookingsByHour[hours]) {
          bookingsByHour[hours].push(booking);
        } else if (hours < 7) {
          // Early morning bookings go into 7am slot
          bookingsByHour[7].push(booking);
        } else if (hours > 21) {
          // Late evening bookings go into 9pm slot
          bookingsByHour[21].push(booking);
        }
      }
    } catch (error) {
      console.error(`Error parsing booking time: ${booking.startTime}`, error);
    }
  });
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{format(currentDate, 'MMMM d, yyyy')}</h3>
      
      <div className="border rounded-md">
        {dayBookings.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No bookings for this day</p>
        ) : (
          <div className="divide-y">
            {hourSlots.map(hour => {
              const bookingsForHour = bookingsByHour[hour] || [];
              const hourLabel = format(new Date().setHours(hour, 0, 0, 0), 'h:mm a');
              
              return (
                <div key={hour} className={cn(
                  "grid grid-cols-[80px_1fr] gap-4",
                  "hover:bg-muted/50 transition-colors"
                )}>
                  <div className="py-3 px-4 text-muted-foreground text-sm font-medium border-r">
                    {hourLabel}
                  </div>
                  
                  <div className={cn(
                    "py-2 pr-3",
                    bookingsForHour.length === 0 ? "min-h-[60px]" : "space-y-2"
                  )}>
                    {bookingsForHour.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DayView;
