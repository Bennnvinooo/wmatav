
import { FilterOptions, RoomBooking, ViewMode } from '@/types/booking';
import { SearchInput } from './SearchInput';
import { RoomFilter } from './RoomFilter';
import { BookerFilter } from './BookerFilter';
import { DateFilter } from './DateFilter';
import { StatusFilter } from './StatusFilter';
import { ViewModeToggle } from './ViewModeToggle';
import { Button } from '@/components/ui/button';
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
  const isMobile = useIsMobile();
  
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
  };
  
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
        <SearchInput 
          searchTerm={filterOptions.searchTerm} 
          setFilterOptions={setFilterOptions} 
          filterOptions={filterOptions} 
        />
        
        <ViewModeToggle 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
        />
      </div>

      <div className={cn(
        "grid gap-2",
        isMobile ? "grid-cols-1" : "grid-cols-4"
      )}>
        <RoomFilter 
          bookings={bookings} 
          roomName={filterOptions.roomName}
          setFilterOptions={setFilterOptions}
          filterOptions={filterOptions}
        />

        <BookerFilter 
          bookings={bookings} 
          bookedBy={filterOptions.bookedBy}
          setFilterOptions={setFilterOptions}
          filterOptions={filterOptions}
        />

        <DateFilter 
          dateRange={filterOptions.dateRange}
          setFilterOptions={setFilterOptions}
          filterOptions={filterOptions}
        />

        <StatusFilter 
          status={filterOptions.status}
          setFilterOptions={setFilterOptions}
          filterOptions={filterOptions}
        />
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
