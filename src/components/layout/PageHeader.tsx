import React from 'react';
import { Button } from '@/components/ui/button';
interface PageHeaderProps {
  lastUpdate: string;
  onUploadClick: () => void;
}
const PageHeader: React.FC<PageHeaderProps> = ({
  lastUpdate,
  onUploadClick
}) => {
  return <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">WMATA AV Booking </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdate}
        </p>
      </div>
      
      <Button onClick={onUploadClick} className="md:w-auto w-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
        Upload New File
      </Button>
    </div>;
};
export default PageHeader;