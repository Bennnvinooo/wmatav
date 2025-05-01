import { useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { RoomBooking, FilterOptions, ViewMode } from '@/types/booking';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  bookings: RoomBooking[];
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  bookings, 
  filterOptions, 
  setFilterOptions,
  viewMode,
  setViewMode
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<Date | undefined>(
    filterOptions.dateRange.start ? new Date(filterOptions.dateRange.start) : undefined
  );
  
  const isMobile = useIsMobile();
  
  // Extract unique room names and booker names from bookings
  const uniqueRooms = useMemo(() => {
    const roomSet = new Set(bookings.map(booking => booking.roomName));
    return Array.from(roomSet).sort();
  }, [bookings]);
  
  const uniqueBookers = useMemo(() => {
    const bookerSet = new Set(bookings.map(booking => booking.bookedBy));
    return Array.from(bookerSet).sort();
  }, [bookings]);
  
  // Update dateRange when filterOptions change
  useEffect(() => {
    if (filterOptions.dateRange.start) {
      setDateRange(new Date(filterOptions.dateRange.start));
    } else {
      setDateRange(undefined);
    }
  }, [filterOptions.dateRange]);
  
  useEffect(() => {
    if (dateRange) {
      setFilterOptions({
        ...filterOptions,
        dateRange: {
          start: format(dateRange, 'yyyy-MM-dd'),
          end: format(dateRange, 'yyyy-MM-dd')
        }
      });
    }
  }, [dateRange]);
  
  const handleRoomChange = (room: string | null) => {
    setFilterOptions({
      ...filterOptions,
      roomName: room
    });
  };
  
  const handleBookerChange = (booker: string | null) => {
    setFilterOptions({
      ...filterOptions,
      bookedBy: booker
    });
  };
  
  const handleStatusChange = (status: 'confirmed' | 'pending' | 'cancelled', checked: boolean) => {
    const currentStatuses = filterOptions.status || [];
    
    let newStatuses;
    if (checked) {
      newStatuses = [...currentStatuses, status];
    } else {
      newStatuses = currentStatuses.filter(s => s !== status);
    }
    
    setFilterOptions({
      ...filterOptions,
      status: newStatuses.length > 0 ? newStatuses : null
    });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions({
      ...filterOptions,
      searchTerm: e.target.value
    });
  };
  
  const handleClearFilters = () => {
    setFilterOptions({
      roomName: null,
      dateRange: {
        start: null,
        end: null
      },
      bookedBy: null,
      status: null,
      searchTerm: ''
    });
    setDateRange(undefined);
  };
  
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
        <div className="relative flex-grow max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <Input
            type="search"
            placeholder="Search bookings..."
            className="pl-9"
            value={filterOptions.searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="flex-1 md:flex-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4 mr-1"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            Calendar
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="flex-1 md:flex-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list w-4 h-4 mr-1"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3" y1="6" y2="6"/><line x1="3" x2="3" y1="12" y2="12"/><line x1="3" x2="3" y1="18" y2="18"/></svg>
            List
          </Button>
        </div>
      </div>

      <div className={cn(
        "grid gap-2",
        isMobile ? "grid-cols-1" : "grid-cols-4"
      )}>
        <div>
          <Label htmlFor="room-filter">Room</Label>
          <select
            id="room-filter"
            className="w-full mt-1 h-9 rounded-md border border-input bg-background p-2 text-sm ring-offset-background"
            value={filterOptions.roomName || ''}
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

        <div>
          <Label htmlFor="booker-filter">Booked By</Label>
          <select
            id="booker-filter"
            className="w-full mt-1 h-9 rounded-md border border-input bg-background p-2 text-sm ring-offset-background"
            value={filterOptions.bookedBy || ''}
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

        <div>
          <Label>Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full mt-1 justify-start text-left font-normal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar mr-2 h-4 w-4">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                  <line x1="16" x2="16" y1="2" y2="6"/>
                  <line x1="8" x2="8" y1="2" y2="6"/>
                  <line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                {dateRange ? format(dateRange, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange}
                onSelect={(date) => {
                  setDateRange(date);
                  setIsCalendarOpen(false);
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="status-confirmed" 
                checked={filterOptions.status?.includes('confirmed') ?? false}
                onCheckedChange={(checked) => 
                  handleStatusChange('confirmed', checked as boolean)
                }
              />
              <label
                htmlFor="status-confirmed"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Confirmed
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="status-pending" 
                checked={filterOptions.status?.includes('pending') ?? false}
                onCheckedChange={(checked) => 
                  handleStatusChange('pending', checked as boolean)
                }
              />
              <label
                htmlFor="status-pending"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Pending
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="status-cancelled" 
                checked={filterOptions.status?.includes('cancelled') ?? false}
                onCheckedChange={(checked) => 
                  handleStatusChange('cancelled', checked as boolean)
                }
              />
              <label
                htmlFor="status-cancelled"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cancelled
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
