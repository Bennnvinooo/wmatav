
import React from 'react';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';

interface PageHeaderProps {
  onAdminAccess?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onAdminAccess }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-center md:text-left mb-2">WMATA AV Booking</h1>
          <p className="text-center md:text-left text-muted-foreground">
            AV Room Booking Information
          </p>
        </div>
        
        {onAdminAccess && (
          <Button 
            onClick={onAdminAccess}
            variant="outline"
            className="mt-4 md:mt-0"
          >
            <LockKeyhole className="mr-2 h-4 w-4" />
            Admin Access
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
