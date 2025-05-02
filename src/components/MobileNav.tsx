
import React from 'react';
import { ViewMode } from '@/types/booking';
import { cn } from '@/lib/utils';
import { CalendarDays, List, Upload, RefreshCw } from 'lucide-react';

interface MobileNavProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onUploadClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ viewMode, setViewMode, onUploadClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around items-center py-3 md:hidden z-10 shadow-lg safe-area-bottom">
      <button
        onClick={() => setViewMode('calendar')}
        className={cn(
          "flex flex-col items-center py-1 px-2 rounded-md",
          viewMode === 'calendar' ? "text-primary" : "text-muted-foreground"
        )}
      >
        <CalendarDays className="w-6 h-6" />
        <span className="text-xs mt-1">Calendar</span>
      </button>

      <button
        onClick={() => setViewMode('list')}
        className={cn(
          "flex flex-col items-center py-1 px-2 rounded-md",
          viewMode === 'list' ? "text-primary" : "text-muted-foreground"
        )}
      >
        <List className="w-6 h-6" />
        <span className="text-xs mt-1">List</span>
      </button>

      <button
        onClick={() => window.location.reload()}
        className="flex flex-col items-center py-1 px-2 rounded-md text-muted-foreground"
      >
        <RefreshCw className="w-6 h-6" />
        <span className="text-xs mt-1">Refresh</span>
      </button>

      <button
        onClick={onUploadClick}
        className="flex flex-col items-center py-1 px-2 rounded-md text-muted-foreground"
      >
        <Upload className="w-6 h-6" />
        <span className="text-xs mt-1">Upload</span>
      </button>
    </div>
  );
};

export default MobileNav;
