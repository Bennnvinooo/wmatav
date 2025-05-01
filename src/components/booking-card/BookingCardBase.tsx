
import { RoomBooking } from '@/types/booking';
import { useMemo } from 'react';

export interface BookingCardBaseProps {
  booking: RoomBooking;
  children: React.ReactNode;
  onClick?: () => void;
}

export const useStatusColors = (status: RoomBooking['status']) => {
  return useMemo(() => {
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
    
    return colors[status] || colors.pending;
  }, [status]);
};

export const useCardBackgroundStyle = (booking: RoomBooking) => {
  return useMemo(() => {
    // First check if the room name contains specific station names
    if (booking.roomName) {
      if (booking.roomName.includes("New Carrolton")) {
        return { backgroundColor: 'rgba(249, 115, 22, 0.3)' }; // Orange for New Carrolton
      }
      
      // Add specific colors for other stations
      if (booking.roomName.includes("L'Enfant") || booking.roomName.includes("LEnfant")) {
        return { backgroundColor: 'rgba(139, 92, 246, 0.3)' }; // Purple for L'Enfant
      }
      
      if (booking.roomName.includes("Eisenhower")) {
        return { backgroundColor: 'rgba(16, 185, 129, 0.3)' }; // Green for Eisenhower
      }
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
};

export const useContactInfo = (purpose: string) => {
  return useMemo(() => {
    // Look for email and phone in purpose
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /(\+\d{1,2}\s)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    
    const email = purpose.match(emailRegex)?.[0] || '';
    const phone = purpose.match(phoneRegex)?.[0] || '';
    
    return { email, phone };
  }, [purpose]);
};

const BookingCardBase: React.FC<BookingCardBaseProps> = ({ 
  booking, 
  children, 
  onClick 
}) => {
  const statusColors = useStatusColors(booking.status);
  const cardBackgroundStyle = useCardBackgroundStyle(booking);

  return (
    <div 
      className={`overflow-hidden border-l-4 ${statusColors.border}`}
      style={cardBackgroundStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default BookingCardBase;
