
import React from 'react';
import { useForm } from 'react-hook-form';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { LockKeyhole } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthenticationSheetProps {
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;
  onAuthenticate: () => void;
  onDirectAccess: () => void;
  onEmergencyAccess: () => void;
}

const AuthenticationSheet: React.FC<AuthenticationSheetProps> = ({
  isSheetOpen,
  setIsSheetOpen,
  onAuthenticate,
  onDirectAccess,
  onEmergencyAccess
}) => {
  const { toast } = useToast();
  const ADMIN_PASSWORD = "wmata2024";
  
  const form = useForm({
    defaultValues: {
      password: ''
    }
  });

  const handlePasswordSubmit = (values: { password: string }) => {
    if (values.password === ADMIN_PASSWORD) {
      onAuthenticate();
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
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Bypass authentication (for admin use only):
            </p>
            <Button 
              onClick={onDirectAccess} 
              variant="secondary" 
              className="w-full mb-2"
            >
              Direct Admin Access
            </Button>
            
            <Button 
              onClick={onEmergencyAccess}
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
            >
              Emergency Access
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AuthenticationSheet;
