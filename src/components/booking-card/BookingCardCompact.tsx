
import { RoomBooking } from '@/types/booking';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import BookingCardBase, { useStatusColors } from './BookingCardBase';

interface BookingCardCompactProps {
  booking: RoomBooking;
  onClick: () => void;
}

const BookingCardCompact: React.FC<BookingCardCompactProps> = ({ 
  booking,
  onClick
}) => {
  const statusColors = useStatusColors(booking.status);

  return (
    <BookingCardBase booking={booking} onClick={onClick}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-0 shadow-none">
        <CardContent className="p-2 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h4 className="text-sm line-clamp-1 font-medium">
                {booking.purpose}
              </h4>
              <p className="text-xs text-muted-foreground">
                {booking.roomName}
              </p>
            </div>
            
            <Badge 
              variant="outline" 
              className={cn(
                "ml-2 capitalize",
                statusColors.text,
                statusColors.bg,
                "text-xs px-1.5 py-0"
              )}
            >
              {booking.status}
            </Badge>
          </div>
          
          <div className="flex items-center text-muted-foreground mt-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span className="text-xs">
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
        </CardContent>
      </Card>
    </BookingCardBase>
  );
};

export default BookingCardCompact;
