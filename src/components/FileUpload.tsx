
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { parseExcelFile, generateSampleFile } from '@/utils/excelParser';
import { RoomBooking } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onDataLoaded: (data: RoomBooking[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded, isLoading, setIsLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid Excel file (.xlsx, .xls, or .csv)');
      toast({
        title: "Invalid file type",
        description: "Please upload a valid Excel file (.xlsx, .xls, or .csv)",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    toast({
      title: "File selected",
      description: `"${file.name}" has been selected.`
    });
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const processFile = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await parseExcelFile(selectedFile);
      
      if (data.length === 0) {
        throw new Error('No valid booking data found in the file');
      }
      
      onDataLoaded(data);
      toast({
        title: "Data loaded successfully",
        description: `${data.length} bookings imported from ${selectedFile.name}`,
        variant: "default"
      });
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Error processing file",
        description: (err as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSample = () => {
    const sampleFile = generateSampleFile();
    const url = URL.createObjectURL(sampleFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-room-bookings.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Upload Room Booking Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
          } transition-all duration-200 ease-in-out`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleChange}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  className="h-8 w-8 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
            </div>
            
            <div>
              <p className="text-md font-medium">
                {selectedFile 
                  ? `Selected: ${selectedFile.name}`
                  : 'Drag and drop your Excel file here'
                }
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports .xlsx, .xls, and .csv files
              </p>
            </div>
            
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={onButtonClick}
                disabled={isLoading}
                className="mr-2"
              >
                Browse Files
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={downloadSample}
                disabled={isLoading}
              >
                Download Sample
              </Button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 rounded-md text-destructive text-sm">
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={processFile}
          disabled={!selectedFile || isLoading}
          className="w-full md:w-auto"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : "Process File"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
