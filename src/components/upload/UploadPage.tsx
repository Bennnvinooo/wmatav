
import React, { useState } from 'react';
import { RoomBooking } from '@/types/booking';
import FileUpload from '@/components/FileUpload';
import { UploadSkeleton } from '@/components/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { LockKeyhole } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadPageProps {
  handleDataLoaded: (data: RoomBooking[]) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ 
  handleDataLoaded, 
  isLoading, 
  setIsLoading 
}) => {
  // Check if we're running in public mode (on wmatav.lovable.app)
  const isPublicMode = window.location.hostname === 'wmatav.lovable.app';
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  
  // Admin password - in a real app, this should be stored securely
  const ADMIN_PASSWORD = "wmata2024";
  
  const form = useForm({
    defaultValues: {
      password: ''
    }
  });

  const handleRefresh = () => {
    // Clear any cached data to force a fresh load
    localStorage.removeItem('lastViewedBookings');
    window.location.reload();
  };
  
  const handlePasswordSubmit = (values: { password: string }) => {
    if (values.password === ADMIN_PASSWORD) {
      setIsPasswordCorrect(true);
      setIsSheetOpen(false);
      toast({
        title: "Admin Access Granted",
        description: "You can now upload booking data."
      });
    } else {
      toast({
        title: "Invalid Password",
        description: "Please try again with the correct password.",
        variant: "destructive"
      });
      form.reset();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">WMATA AV Booking</h1>
        <p className="text-center text-muted-foreground">
          AV Room Booking Information
        </p>
      </div>
      
      {isLoading ? (
        <UploadSkeleton />
      ) : (
        <>
          {!isPasswordCorrect ? (
            <div className="text-center">
              <Card className="mx-auto max-w-md">
                <CardHeader>
                  <CardTitle>Room Booking Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    {isPublicMode 
                      ? "View the latest WMATA AV room booking information." 
                      : "Upload or view the WMATA AV room booking information."}
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <Button onClick={handleRefresh} variant="outline" className="w-full">
                      Refresh Data
                    </Button>
                    
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                      <SheetTrigger asChild>
                        <Button variant="default" className="w-full">
                          <LockKeyhole className="mr-2 h-4 w-4" />
                          Admin Access
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Admin Authentication</SheetTitle>
                        </SheetHeader>
                        <div className="py-4">
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                              <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input 
                                        type="password" 
                                        placeholder="Enter admin password" 
                                        {...field}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <Button type="submit" className="w-full">
                                Unlock Admin Access
                              </Button>
                            </form>
                          </Form>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <FileUpload 
              onDataLoaded={handleDataLoaded} 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UploadPage;
