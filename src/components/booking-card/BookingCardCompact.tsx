
import { RoomBooking } from '@/types/booking';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import BookingCardBase, { useStatusColors, useContactInfo } from './BookingCardBase';

interface BookingCardCompactProps {
  booking: RoomBooking;
  onClick: () => void;
}

const BookingCardCompact: React.FC<BookingCardCompactProps> = ({ 
  booking,
  onClick
}) => {
  const statusColors = useStatusColors(booking.status);
  const contactInfo = useContactInfo(booking.purpose);
  
  // Extract information from purpose field
  const purposeParts = {
    guests: booking.purpose.match(/Expected Guests:\s*(\d+)/i)?.[1] || '',
    setup: booking.purpose.match(/Set-up Style:\s*([^|]+)/i)?.[1]?.trim() || '',
    catering: booking.purpose.includes('Catering: YES') ? 'YES' : 'NO',
    contactName: contactInfo.name || booking.bookedBy,
  };
  
  // Handle room name display - extract the station and room numbers
  const roomNameParts = booking.roomName.split('-').map(part => part.trim());
  const station = roomNameParts[0] || '';
  const location = roomNameParts.length > 1 ? roomNameParts.slice(1).join(' - ') : '';

  return (
    <BookingCardBase booking={booking} onClick={onClick}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-0 shadow-none bg-transparent rounded-xl">
        <CardContent className="p-3 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              {/* Display the extracted information from purpose field */}
              <h4 className="text-sm font-semibold mb-1">
                {purposeParts.guests && (
                  <span className="mr-1">
                    Expected Guests: {purposeParts.guests} |
                  </span>
                )}
                {purposeParts.setup && (
                  <span className="mr-1">
                    {' '}Set-up Style: {purposeParts.setup} |
                  </span>
                )}
                {' '}Catering: {purposeParts.catering}
              </h4>
              
              {/* Room name with better formatting */}
              <p className="text-sm font-medium mb-1">
                {station}
                {location && (
                  <span className="text-muted-foreground text-xs"> - {location}</span>
                )}
              </p>
              
              {/* Contact information */}
              {(contactInfo.name || contactInfo.phone || contactInfo.email) && (
                <p className="text-xs text-muted-foreground">
                  Contact: {contactInfo.name || booking.bookedBy}
                  {contactInfo.phone && ` | ${contactInfo.phone}`}
                  {contactInfo.email && ` | ${contactInfo.email}`}
                </p>
              )}
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
          
          <div className="flex items-center text-muted-foreground mt-2">
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
