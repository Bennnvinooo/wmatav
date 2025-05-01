
import { useState } from 'react';
import { RoomBooking } from '@/types/booking';
import BookingCardCompact from './booking-card/BookingCardCompact';
import BookingCardExpanded from './booking-card/BookingCardExpanded';

interface BookingCardProps {
  booking: RoomBooking;
  compact?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, compact = true }) => {
  const [expanded, setExpanded] = useState(false);

  // Toggle expanded view
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Show compact view by default (changed default to true, and only show expanded when explicitly toggled)
  if (!expanded) {
    return (
      <BookingCardCompact 
        booking={booking} 
        onClick={toggleExpanded} 
      />
    );
  }

  // Expanded view
  return (
    <BookingCardExpanded 
      booking={booking} 
      onClose={() => setExpanded(false)} 
    />
  );
};

export default BookingCard;
