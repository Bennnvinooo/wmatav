
import { RoomBooking } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';

export function useBookingsPersistence() {
  const { toast } = useToast();
  
  const saveBookingsToStorage = (data: RoomBooking[]) => {
    try {
      localStorage.setItem('roomBookings', JSON.stringify(data));
      localStorage.setItem('lastUpdate', new Date().toISOString());
      
      // Also store in sessionStorage for cross-tab communication
      sessionStorage.setItem('roomBookings', JSON.stringify(data));
      
      console.log("Stored bookings in localStorage and sessionStorage");
    } catch (error) {
      console.error("Error storing bookings:", error);
      toast({
        title: "Error",
        description: "Failed to save booking data",
        variant: "destructive",
      });
    }
  };

  const loadBookingsFromStorage = (): RoomBooking[] | null => {
    try {
      const storedData = localStorage.getItem('roomBookings');
      if (storedData) {
        console.log("Found stored bookings data");
        return JSON.parse(storedData);
      }
      return null;
    } catch (error) {
      console.error("Error loading bookings:", error);
      return null;
    }
  };

  return {
    saveBookingsToStorage,
    loadBookingsFromStorage
  };
}
