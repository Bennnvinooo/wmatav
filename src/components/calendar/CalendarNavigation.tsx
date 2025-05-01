
import { Button } from '@/components/ui/button';
import { CalendarViewMode } from '@/types/booking';

interface CalendarNavigationProps {
  periodTitle: string;
  viewMode: CalendarViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  periodTitle,
  viewMode,
  onPrevious,
  onNext,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-3 pb-2">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevious}
          aria-label="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left w-4 h-4"><path d="m15 18-6-6 6-6"/></svg>
        </Button>
        <div className="text-lg font-semibold">{periodTitle}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-4 h-4"><path d="m9 18 6-6-6-6"/></svg>
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant={viewMode === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('day')}
          className="flex-1 md:flex-none"
        >
          Day
        </Button>
        <Button
          variant={viewMode === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('week')}
          className="flex-1 md:flex-none"
        >
          Week
        </Button>
        <Button
          variant={viewMode === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('month')}
          className="flex-1 md:flex-none"
        >
          Month
        </Button>
      </div>
    </div>
  );
};

export default CalendarNavigation;
