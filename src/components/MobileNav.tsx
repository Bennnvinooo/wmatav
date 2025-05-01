
import { ViewMode } from '@/types/booking';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onUploadClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ viewMode, setViewMode, onUploadClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around items-center py-2 md:hidden z-10">
      <button
        onClick={() => setViewMode('calendar')}
        className={cn(
          "flex flex-col items-center py-1 px-2 rounded-md",
          viewMode === 'calendar' ? "text-primary" : "text-muted-foreground"
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        <span className="text-xs mt-1">Calendar</span>
      </button>

      <button
        onClick={() => setViewMode('list')}
        className={cn(
          "flex flex-col items-center py-1 px-2 rounded-md",
          viewMode === 'list' ? "text-primary" : "text-muted-foreground"
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3" y1="6" y2="6"/><line x1="3" x2="3" y1="12" y2="12"/><line x1="3" x2="3" y1="18" y2="18"/></svg>
        <span className="text-xs mt-1">List</span>
      </button>

      <button
        onClick={onUploadClick}
        className="flex flex-col items-center py-1 px-2 rounded-md text-muted-foreground"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        <span className="text-xs mt-1">Upload</span>
      </button>
    </div>
  );
};

export default MobileNav;
