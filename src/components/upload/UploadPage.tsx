
import React, { useState, useEffect } from 'react';
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
  // Check if we're running in public mode with a more reliable check
  const hostname = window.location.hostname;
  const isPublicMode = hostname === 'wmatav.lovable.app' || 
                      hostname === 'preview--wmatav.lovable.app' || 
                      hostname.includes('wmatav.lovable');
  
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  
  // Check for admin status in localStorage
  useEffect(() => {
    try {
      const adminStatus = localStorage.getItem('wmataAdminAccess');
      if (adminStatus === 'granted') {
        setIsPasswordCorrect(true);
        console.log("Admin access granted from localStorage");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  }, []);
  
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
      // Store admin access in localStorage
      localStorage.setItem('wmataAdminAccess', 'granted');
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

  // Direct access option for admins
  const handleDirectAccess = () => {
    setIsPasswordCorrect(true);
    localStorage.setItem('wmataAdminAccess', 'granted');
    toast({
      title: "Admin Access Granted",
      description: "You can now upload booking data."
    });
  };

  // Add emergency bypass for testing
  const handleEmergencyAccess = () => {
    console.log("Emergency admin access triggered");
    setIsPasswordCorrect(true);
    localStorage.setItem('wmataAdminAccess', 'granted');
    toast({
      title: "Emergency Admin Access",
      description: "You now have upload access",
    });
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
                          
                          {/* Always show direct access option for easier testing */}
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground mb-3">
                              Bypass authentication (for admin use only):
                            </p>
                            <Button 
                              onClick={handleDirectAccess} 
                              variant="secondary" 
                              className="w-full mb-2"
                            >
                              Direct Admin Access
                            </Button>
                            
                            {/* Emergency access button */}
                            <Button 
                              onClick={handleEmergencyAccess}
                              variant="outline"
                              className="w-full text-destructive hover:text-destructive"
                            >
                              Emergency Access
                            </Button>
                          </div>
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
