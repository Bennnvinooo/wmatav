
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface PageHeaderProps {
  onAdminAccess?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onAdminAccess }) => {
  const handleUploadClick = () => {
    if (onAdminAccess) {
      onAdminAccess();
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-center md:text-left mb-2">Upload Excel File</h1>
          <p className="text-center md:text-left text-muted-foreground">
            Please upload your WMATA AV room booking spreadsheet
          </p>
        </div>
        
        <Button 
          onClick={handleUploadClick}
          variant="default"
          className="mt-4 md:mt-0"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
