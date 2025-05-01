
import { format, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoomBooking } from '@/types/booking';
import { useIsMobile } from '@/hooks/use-mobile';
import BookingCard from '../BookingCard';
import { cn } from '@/lib/utils';

interface GridViewProps {
  days: Date[];
  getDayBookings: (date: Date) => RoomBooking[];
  viewMode: 'week' | 'month';
}

const GridView: React.FC<GridViewProps> = ({ days, getDayBookings, viewMode }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {days.map(date => {
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
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      compact={isMobile || viewMode === 'month'} 
                    />
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
  );
};

export default GridView;
