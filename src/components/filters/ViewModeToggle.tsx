
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types/booking';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ 
  viewMode, 
  setViewMode 
}) => {
  return (
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
  );
};
