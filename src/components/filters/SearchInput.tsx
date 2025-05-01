
import { Input } from '@/components/ui/input';
import { FilterOptions } from '@/types/booking';

interface SearchInputProps {
  searchTerm: string;
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  searchTerm, 
  filterOptions, 
  setFilterOptions 
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions({
      ...filterOptions,
      searchTerm: e.target.value
    });
  };
  
  return (
    <div className="relative flex-grow max-w-md">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
      <Input
        type="search"
        placeholder="Search bookings..."
        className="pl-9"
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};
