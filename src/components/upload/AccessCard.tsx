
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthenticationSheet from './AuthenticationSheet';

interface AccessCardProps {
  isPublicMode: boolean;
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;
  onRefresh: () => void;
  onAuthenticate: () => void;
  onDirectAccess: () => void;
  onEmergencyAccess: () => void;
}

const AccessCard: React.FC<AccessCardProps> = ({
  isPublicMode,
  isSheetOpen,
  setIsSheetOpen,
  onRefresh,
  onAuthenticate,
  onDirectAccess,
  onEmergencyAccess
}) => {
  return (
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
            <Button onClick={onRefresh} variant="outline" className="w-full">
              Refresh Data
            </Button>
            
            <AuthenticationSheet
              isSheetOpen={isSheetOpen}
              setIsSheetOpen={setIsSheetOpen}
              onAuthenticate={onAuthenticate}
              onDirectAccess={onDirectAccess}
              onEmergencyAccess={onEmergencyAccess}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessCard;
