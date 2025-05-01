
import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { FilterOptions, RoomBooking } from '@/types/booking';

interface RoomFilterProps {
  bookings: RoomBooking[];
  roomName: string | null;
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const RoomFilter: React.FC<RoomFilterProps> = ({ 
  bookings, 
  roomName, 
  filterOptions,
  setFilterOptions 
}) => {
  const uniqueRooms = useMemo(() => {
    const roomSet = new Set(bookings.map(booking => booking.roomName));
    return Array.from(roomSet).sort();
  }, [bookings]);
  
  const handleRoomChange = (room: string | null) => {
    setFilterOptions({
      ...filterOptions,
      roomName: room
    });
  };
  
  return (
    <div>
      <Label htmlFor="room-filter">Room</Label>
      <select
        id="room-filter"
        className="w-full mt-1 h-9 rounded-md border border-input bg-background p-2 text-sm ring-offset-background"
        value={roomName || ''}
        onChange={(e) => handleRoomChange(e.target.value || null)}
      >
        <option value="">All Rooms</option>
        {uniqueRooms.map((room) => (
          <option key={room} value={room}>
            {room}
          </option>
        ))}
      </select>
    </div>
  );
};
