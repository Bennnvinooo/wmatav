
import { useMemo, useState } from 'react';
import { RoomBooking } from '@/types/booking';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingCardProps {
  booking: RoomBooking;
  compact?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, compact = false }) => {
  const [expanded, setExpanded] = useState(false);

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
  
  // Generate background color based on the color column value or room name
  const cardBackgroundStyle = useMemo(() => {
    // First check if the room name contains "New Carrolton" and make it orange
    if (booking.roomName && booking.roomName.includes("New Carrolton")) {
      return { backgroundColor: 'rgba(249, 115, 22, 0.3)' }; // Bright Orange with 0.3 opacity
    }
    
    if (!booking.color) return {};
    
    const colorValue = booking.color.toLowerCase();
    
    // Map color names to specific RGB values
    if (colorValue.includes('blue')) {
      return { backgroundColor: 'rgba(30, 174, 219, 0.3)' }; // Bright Blue with 0.3 opacity
    } else if (colorValue.includes('green')) {
      return { backgroundColor: 'rgba(242, 252, 226, 0.5)' }; // Soft Green with 0.5 opacity
    } else if (colorValue.includes('orange')) {
      return { backgroundColor: 'rgba(249, 115, 22, 0.3)' }; // Bright Orange with 0.3 opacity
    } else if (colorValue.includes('red')) {
      return { backgroundColor: 'rgba(249, 115, 22, 0.3)' }; // Use orange for red
    } else if (colorValue.includes('purple')) {
      return { backgroundColor: 'rgba(30, 174, 219, 0.3)' }; // Use blue for purple
    } else if (colorValue.includes('yellow')) {
      return { backgroundColor: 'rgba(242, 252, 226, 0.5)' }; // Use green for yellow
    }
    
    // Default to blue if color doesn't match any of the specified colors
    return { backgroundColor: 'rgba(30, 174, 219, 0.3)' };
  }, [booking.color, booking.roomName]);

  // Extract contact information
  const contactInfo = useMemo(() => {
    // Look for email and phone in purpose
    const purpose = booking.purpose || '';
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /(\+\d{1,2}\s)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    
    const email = purpose.match(emailRegex)?.[0] || '';
    const phone = purpose.match(phoneRegex)?.[0] || '';
    
    return { email, phone };
  }, [booking.purpose]);

  // Handle toggle expanded view
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // If not expanded and compact, show compact view
  if (!expanded && compact) {
    return (
      <Card 
        className={cn(
          "overflow-hidden border-l-4 cursor-pointer hover:shadow-md transition-shadow duration-200",
          statusColors.border
        )}
        style={cardBackgroundStyle}
        onClick={toggleExpanded}
      >
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
    );
  }

  // Expanded or non-compact view
  return (
    <Card 
      className={cn(
        "overflow-hidden border-l-4 hover:shadow-md transition-all duration-300",
        statusColors.border,
        expanded && "animate-scale-in shadow-lg"
      )}
      style={cardBackgroundStyle}
      onClick={!expanded ? toggleExpanded : undefined}
    >
      <CardHeader className={cn("p-4 pb-2", expanded && "pb-1")}>
        <div className="flex justify-between items-start">
          <CardTitle className={cn("font-medium", expanded ? "text-lg" : "text-base")}>
            {booking.purpose.split('\n')[0]}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={cn(
              "ml-2 capitalize",
              statusColors.text,
              statusColors.bg
            )}
          >
            {booking.status}
          </Badge>
        </div>
        {expanded && (
          <CardDescription className="mt-1">
            {booking.roomName}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn("p-4 pt-1", expanded && "pb-2")}>
        <div className="space-y-2">
          {expanded && booking.purpose.includes('\n') && (
            <p className="text-sm whitespace-pre-line">
              {booking.purpose.split('\n').slice(1).join('\n')}
            </p>
          )}
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("mr-1", expanded ? "w-4 h-4" : "w-4 h-4")}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>
                {booking.date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1')} · {booking.startTime} - {booking.endTime}
              </span>
            </div>
            <div className="flex items-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("mr-1", expanded ? "w-4 h-4" : "w-4 h-4")}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>{booking.bookedBy}</span>
            </div>
          </div>
        </div>
      </CardContent>
      {expanded && (contactInfo.phone || contactInfo.email) && (
        <CardFooter className="p-4 pt-0 flex gap-2 justify-end">
          {expanded && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setExpanded(false)}
              className="mr-auto"
            >
              Close
            </Button>
          )}
          
          {contactInfo.phone && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${contactInfo.phone.replace(/\D/g, '')}`;
              }}
            >
              <Phone className="w-4 h-4 mr-2" /> Call
            </Button>
          )}
          
          {contactInfo.email && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `mailto:${contactInfo.email}`;
              }}
            >
              <Mail className="w-4 h-4 mr-2" /> Email
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default BookingCard;
