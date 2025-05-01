
import { useMemo } from 'react';
import { RoomBooking } from '@/types/booking';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BookingCardProps {
  booking: RoomBooking;
  compact?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, compact = false }) => {
  const statusColors = useMemo(() => {
    const colors = {
      confirmed: {
        text: 'text-booking-confirmed',
        bg: 'bg-booking-confirmBg',
        border: 'border-booking-confirmed'
      },
      pending: {
        text: 'text-booking-pending',
        bg: 'bg-booking-pendingBg',
        border: 'border-booking-pending'
      },
      cancelled: {
        text: 'text-booking-cancelled',
        bg: 'bg-booking-cancelledBg',
        border: 'border-booking-cancelled'
      }
    };
    
    return colors[booking.status];
  }, [booking.status]);
  
  return (
    <Card className={cn(
      "overflow-hidden border-l-4 hover:shadow-md transition-shadow duration-200",
      statusColors.border
    )}>
      <CardContent className={cn(
        "p-4 flex flex-col",
        compact && "p-2"
      )}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className={cn(
              "font-medium",
              compact ? "text-sm line-clamp-1" : "text-base"
            )}>
              {booking.purpose}
            </h4>
            <p className={cn(
              "text-muted-foreground",
              compact ? "text-xs" : "text-sm"
            )}>
              {booking.roomName}
            </p>
          </div>
          
          <Badge 
            variant="outline" 
            className={cn(
              "ml-2 capitalize",
              statusColors.text,
              statusColors.bg,
              compact ? "text-xs px-1.5 py-0" : ""
            )}
          >
            {booking.status}
          </Badge>
        </div>
        
        {!compact && (
          <p className="text-sm text-muted-foreground mb-2">
            {booking.bookedBy}
          </p>
        )}
        
        <div className="flex items-center text-muted-foreground mt-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("mr-1", compact ? "w-3 h-3" : "w-4 h-4")}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span className={cn(compact ? "text-xs" : "text-sm")}>
            {booking.startTime} - {booking.endTime}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
