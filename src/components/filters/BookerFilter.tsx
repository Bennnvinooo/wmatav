
import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { FilterOptions, RoomBooking } from '@/types/booking';

interface BookerFilterProps {
  bookings: RoomBooking[];
  bookedBy: string | null;
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const BookerFilter: React.FC<BookerFilterProps> = ({ 
  bookings, 
  bookedBy, 
  filterOptions,
  setFilterOptions 
}) => {
  const uniqueBookers = useMemo(() => {
    const bookerSet = new Set(bookings.map(booking => booking.bookedBy));
    return Array.from(bookerSet).sort();
  }, [bookings]);
  
  const handleBookerChange = (booker: string | null) => {
    setFilterOptions({
      ...filterOptions,
      bookedBy: booker
    });
  };
  
  return (
    <div>
      <Label htmlFor="booker-filter">Booked By</Label>
      <select
        id="booker-filter"
        className="w-full mt-1 h-9 rounded-md border border-input bg-background p-2 text-sm ring-offset-background"
        value={bookedBy || ''}
        onChange={(e) => handleBookerChange(e.target.value || null)}
      >
        <option value="">All Bookers</option>
        {uniqueBookers.map((booker) => (
          <option key={booker} value={booker}>
            {booker}
          </option>
        ))}
      </select>
    </div>
  );
};
