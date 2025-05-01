
import { RoomBooking } from '@/types/booking';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import BookingCardBase, { useStatusColors, useContactInfo } from './BookingCardBase';

interface BookingCardExpandedProps {
  booking: RoomBooking;
  onClose: () => void;
}

const BookingCardExpanded: React.FC<BookingCardExpandedProps> = ({ 
  booking, 
  onClose 
}) => {
  const statusColors = useStatusColors(booking.status);
  const contactInfo = useContactInfo(booking.purpose);

  const contactDisplay = () => {
    if (contactInfo.email && contactInfo.phone) {
      return (
        <div className="text-sm text-muted-foreground mt-2">
          <span className="inline-flex items-center">
            <span className="font-medium">{contactInfo.email}</span>
            <span className="mx-2 text-muted-foreground">|</span>
            <span className="font-medium">{contactInfo.phone}</span>
          </span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <BookingCardBase booking={booking}>
      <Card className="hover:shadow-md transition-all duration-300 animate-scale-in shadow-lg border-0 shadow-none bg-transparent rounded-xl">
        <CardHeader className="p-4 pb-1">
          <div className="flex justify-between items-start">
            <CardTitle className="font-medium text-lg">
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
          <CardDescription className="mt-1">
            {booking.roomName}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-1 pb-2">
          <div className="space-y-2">
            {booking.purpose.includes('\n') && (
              <p className="text-sm whitespace-pre-line">
                {booking.purpose.split('\n').slice(1).join('\n')}
              </p>
            )}
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>
                  {booking.date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1')} · {booking.startTime} - {booking.endTime}
                </span>
              </div>
              <div className="flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>{booking.bookedBy}</span>
              </div>
              {contactDisplay()}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex gap-2 justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="mr-auto"
          >
            <Minimize className="w-4 h-4 mr-2" /> Minimize
          </Button>
          
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
      </Card>
    </BookingCardBase>
  );
};

export default BookingCardExpanded;
