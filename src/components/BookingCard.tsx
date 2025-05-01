
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
    
    return colors[booking.status] || colors.pending;
  }, [booking.status]);
  
  // Generate background color with 30% opacity from booking color
  const cardBackgroundStyle = useMemo(() => {
    if (!booking.color) return {};
    
    // Convert hex to rgba with 0.3 (30%) opacity
    if (booking.color.startsWith('#')) {
      let hex = booking.color.slice(1);
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      
      return { backgroundColor: `rgba(${r}, ${g}, ${b}, 0.3)` };
    }
    
    // If not a hex color, use it directly with 0.3 opacity
    return { backgroundColor: `${booking.color}30` };
  }, [booking.color]);
  
  return (
    <Card 
      className={cn(
        "overflow-hidden border-l-4 hover:shadow-md transition-shadow duration-200",
        statusColors.border
      )}
      style={cardBackgroundStyle}
    >
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
