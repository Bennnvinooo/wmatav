
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const PageHeader: React.FC = () => {
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
          variant="default"
          className="mt-4 md:mt-0"
          onClick={() => {
            // Find and click the hidden file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
              fileInput.click();
            }
          }}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
