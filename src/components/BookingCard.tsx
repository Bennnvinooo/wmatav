
import { useState } from 'react';
import { RoomBooking } from '@/types/booking';
import BookingCardCompact from './booking-card/BookingCardCompact';
import BookingCardExpanded from './booking-card/BookingCardExpanded';

interface BookingCardProps {
  booking: RoomBooking;
  compact?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, compact = false }) => {
  const [expanded, setExpanded] = useState(false);

  // Toggle expanded view
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // If not expanded and compact, show compact view
  if (!expanded && compact) {
    return (
      <BookingCardCompact 
        booking={booking} 
        onClick={toggleExpanded} 
      />
    );
  }

  // Expanded or non-compact view
  return (
    <BookingCardExpanded 
      booking={booking} 
      onClose={() => setExpanded(false)} 
    />
  );
};

export default BookingCard;
