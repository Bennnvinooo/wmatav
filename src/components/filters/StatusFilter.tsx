
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FilterOptions } from '@/types/booking';

interface StatusFilterProps {
  status: ('confirmed' | 'pending' | 'cancelled')[] | null;
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ 
  status, 
  filterOptions, 
  setFilterOptions 
}) => {
  const handleStatusChange = (statusValue: 'confirmed' | 'pending' | 'cancelled', checked: boolean) => {
    const currentStatuses = filterOptions.status || [];
    
    let newStatuses;
    if (checked) {
      newStatuses = [...currentStatuses, statusValue];
    } else {
      newStatuses = currentStatuses.filter(s => s !== statusValue);
    }
    
    setFilterOptions({
      ...filterOptions,
      status: newStatuses.length > 0 ? newStatuses : null
    });
  };
  
  return (
    <div className="space-y-2">
      <Label>Status</Label>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="status-confirmed" 
            checked={status?.includes('confirmed') ?? false}
            onCheckedChange={(checked) => 
              handleStatusChange('confirmed', checked as boolean)
            }
          />
          <label
            htmlFor="status-confirmed"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Confirmed
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="status-pending" 
            checked={status?.includes('pending') ?? false}
            onCheckedChange={(checked) => 
              handleStatusChange('pending', checked as boolean)
            }
          />
          <label
            htmlFor="status-pending"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Pending
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="status-cancelled" 
            checked={status?.includes('cancelled') ?? false}
            onCheckedChange={(checked) => 
              handleStatusChange('cancelled', checked as boolean)
            }
          />
          <label
            htmlFor="status-cancelled"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Cancelled
          </label>
        </div>
      </div>
    </div>
  );
};
