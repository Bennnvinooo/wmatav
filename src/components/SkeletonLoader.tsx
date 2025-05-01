
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const BookingCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-l-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="w-3/4">
            <div className="h-5 mb-2 skeleton rounded" />
            <div className="h-4 w-1/2 skeleton rounded" />
          </div>
          <div className="h-6 w-20 skeleton rounded-full" />
        </div>
        <div className="h-4 w-1/3 mt-4 skeleton rounded" />
      </CardContent>
    </Card>
  );
};

export const CalendarSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 skeleton rounded-full" />
          <div className="h-6 w-40 skeleton rounded" />
          <div className="h-10 w-10 skeleton rounded-full" />
        </div>
        <div className="flex space-x-2">
          <div className="h-9 w-20 skeleton rounded" />
          <div className="h-9 w-20 skeleton rounded" />
          <div className="h-9 w-20 skeleton rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="h-full">
            <CardHeader className="py-3">
              <div className="h-5 w-24 skeleton rounded" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="h-20 skeleton rounded-md" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const FilterSkeleton = () => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-2 justify-between">
        <div className="h-10 w-full md:w-64 skeleton rounded-md" />
        <div className="flex space-x-2">
          <div className="h-10 w-32 skeleton rounded-md" />
          <div className="h-10 w-32 skeleton rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-4 w-16 skeleton rounded" />
            <div className="h-10 w-full skeleton rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const UploadSkeleton = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="h-6 w-48 skeleton rounded" />
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed rounded-lg p-6 space-y-4">
          <div className="flex justify-center">
            <div className="h-14 w-14 skeleton rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-48 mx-auto skeleton rounded" />
            <div className="h-4 w-36 mx-auto skeleton rounded" />
          </div>
          <div className="flex justify-center space-x-2">
            <div className="h-9 w-28 skeleton rounded-md" />
            <div className="h-9 w-28 skeleton rounded-md" />
          </div>
        </div>
      </CardContent>
      <div className="p-6 pt-0 flex justify-end">
        <div className="h-9 w-full md:w-32 skeleton rounded-md" />
      </div>
    </Card>
  );
};
