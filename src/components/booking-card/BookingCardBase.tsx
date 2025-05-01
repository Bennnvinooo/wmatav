
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
    // Enhanced logic to detect station names with more variations
    if (booking.roomName) {
      if (booking.roomName.toLowerCase().includes("new carrolton") || 
          booking.roomName.toLowerCase().includes("carrolton") || 
          booking.roomName.toLowerCase().includes("nc")) {
        return { backgroundColor: 'rgba(255, 139, 0, 0.4)' }; // Orange for New Carrolton
      }
      
      if (booking.roomName.toLowerCase().includes("l'enfant") || 
          booking.roomName.toLowerCase().includes("lenfant") || 
          booking.roomName.toLowerCase().includes("le enfant") ||
          booking.roomName.toLowerCase().includes("plaza") ||
          booking.roomName.toLowerCase().includes("lec")) {
        return { backgroundColor: 'rgba(52, 156, 85, 0.4)' }; // Green for L'Enfant Plaza
      }
      
      if (booking.roomName.toLowerCase().includes("eisenhower") || 
          booking.roomName.toLowerCase().includes("ica")) {
        return { backgroundColor: 'rgba(22, 104, 189, 0.4)' }; // Blue for Eisenhower
      }
    }
    
    // Fallback to color property if room name doesn't match
    if (!booking.color) return {};
    
    const colorValue = booking.color.toLowerCase();
    
    // Map color names to specific RGB values with our new colors
    if (colorValue.includes('blue')) {
      return { backgroundColor: 'rgba(22, 104, 189, 0.4)' }; // Blue
    } else if (colorValue.includes('green')) {
      return { backgroundColor: 'rgba(52, 156, 85, 0.4)' }; // Green
    } else if (colorValue.includes('orange') || colorValue.includes('red')) {
      return { backgroundColor: 'rgba(255, 139, 0, 0.4)' }; // Orange
    } else if (colorValue.includes('purple')) {
      return { backgroundColor: 'rgba(22, 104, 189, 0.3)' }; // Blue variant for purple
    } else if (colorValue.includes('yellow')) {
      return { backgroundColor: 'rgba(52, 156, 85, 0.3)' }; // Green variant for yellow
    }
    
    // Default to blue if color doesn't match any of the specified colors
    return { backgroundColor: 'rgba(22, 104, 189, 0.4)' }; 
  }, [booking.color, booking.roomName]);
};

export const useContactInfo = (purpose: string) => {
  return useMemo(() => {
    // Look for email pattern in the purpose text
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const email = purpose.match(emailRegex)?.[0] || '';
    
    // Look for phone pattern (allowing various formats) in purpose text
    const phoneRegex = /(\+\d{1,2}\s)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]+\d{3}[-.\s]+\d{4})/g;
    const phone = purpose.match(phoneRegex)?.[0] || '';
    
    // Look for name in contact format
    const contactRegex = /Contact:\s*([^|]+)/i;
    const nameMatch = purpose.match(contactRegex);
    const name = nameMatch ? nameMatch[1].trim() : '';
    
    return { email, phone, name };
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
      className={`overflow-hidden border-l-4 ${statusColors.border} rounded-xl shadow-md hover:shadow-lg transition-all duration-200`}
      style={{
        ...cardBackgroundStyle,
        transform: 'translateY(-1px)',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default BookingCardBase;
