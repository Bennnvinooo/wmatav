
import { RoomBooking } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export function useBookingsPersistence() {
  const { toast } = useToast();
  
  // Add a storage event listener to sync data across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'roomBookings' && event.newValue) {
        console.log("Data changed in another tab, syncing...");
        // This will cause reload to get the latest data
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const saveBookingsToStorage = (data: RoomBooking[]) => {
    try {
      const dataString = JSON.stringify(data);
      
      // Store in localStorage for persistence across sessions
      localStorage.setItem('roomBookings', dataString);
      localStorage.setItem('lastUpdate', new Date().toISOString());
      
      // Also store in sessionStorage for reference
      sessionStorage.setItem('roomBookings', dataString);
      
      console.log(`Stored ${data.length} bookings in storage`);
      
      // Show confirmation toast
      toast({
        title: "Data saved",
        description: `${data.length} bookings saved successfully`,
      });
    } catch (error) {
      console.error("Error storing bookings:", error);
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to save booking data",
        variant: "destructive",
      });
    }
  };

  const loadBookingsFromStorage = (): RoomBooking[] | null => {
    try {
      // Attempt to load data from localStorage
      const storedData = localStorage.getItem('roomBookings');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log(`Found ${parsedData.length} stored bookings data`);
        return parsedData;
      }
      
      console.log("No stored booking data found");
      return null;
    } catch (error) {
      console.error("Error loading bookings:", error);
      
      // Show warning toast
      toast({
        title: "Warning",
        description: "Could not load previously saved data",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    saveBookingsToStorage,
    loadBookingsFromStorage
  };
}
