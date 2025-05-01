
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { FilterOptions } from '@/types/booking';
import { cn } from '@/lib/utils';

interface DateFilterProps {
  dateRange: {
    start: string | null;
    end: string | null;
  };
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({ 
  dateRange, 
  filterOptions, 
  setFilterOptions 
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dateRange.start ? new Date(dateRange.start) : undefined
  );
  
  // Update selectedDate when filterOptions change, but only when the date actually changes
  useEffect(() => {
    if (dateRange.start && (!selectedDate || format(selectedDate, 'yyyy-MM-dd') !== dateRange.start)) {
      setSelectedDate(new Date(dateRange.start));
    } else if (!dateRange.start && selectedDate) {
      setSelectedDate(undefined);
    }
  }, [dateRange.start]);
  
  // Only update filter options when the selected date changes by user action
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFilterOptions({
        ...filterOptions,
        dateRange: {
          start: format(date, 'yyyy-MM-dd'),
          end: format(date, 'yyyy-MM-dd')
        }
      });
    } else {
      setFilterOptions({
        ...filterOptions,
        dateRange: {
          start: null,
          end: null
        }
      });
    }
    setIsCalendarOpen(false);
  };
  
  return (
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
            {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
