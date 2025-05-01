
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
        return { backgroundColor: 'rgba(199, 92, 17, 0.4)' }; // Darker Orange for New Carrolton
      }
      
      // Updated colors according to user's specification with darker shades
      if (booking.roomName.includes("L'Enfant") || booking.roomName.includes("LEnfant") || booking.roomName.includes("Le Enfant")) {
        return { backgroundColor: 'rgba(192, 202, 180, 0.5)' }; // Darker Green for L'Enfant
      }
      
      if (booking.roomName.includes("Eisenhower")) {
        return { backgroundColor: 'rgba(123, 166, 180, 0.5)' }; // Darker Light blue for Eisenhower
      }
    }
    
    if (!booking.color) return {};
    
    const colorValue = booking.color.toLowerCase();
    
    // Map color names to specific RGB values - darker shades
    if (colorValue.includes('blue')) {
      return { backgroundColor: 'rgba(123, 166, 180, 0.5)' }; // Darker Light Blue
    } else if (colorValue.includes('green')) {
      return { backgroundColor: 'rgba(192, 202, 180, 0.5)' }; // Darker Soft Green
    } else if (colorValue.includes('orange')) {
      return { backgroundColor: 'rgba(199, 92, 17, 0.4)' }; // Darker Bright Orange
    } else if (colorValue.includes('red')) {
      return { backgroundColor: 'rgba(199, 92, 17, 0.4)' }; // Darker orange for red
    } else if (colorValue.includes('purple')) {
      return { backgroundColor: 'rgba(171, 110, 171, 0.5)' }; // Darker Light purple
    } else if (colorValue.includes('yellow')) {
      return { backgroundColor: 'rgba(192, 202, 180, 0.5)' }; // Darker green for yellow
    }
    
    // Default to darker blue if color doesn't match any of the specified colors
    return { backgroundColor: 'rgba(123, 166, 180, 0.5)' };
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
