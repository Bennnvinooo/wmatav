
import React from 'react';
import { FilterSkeleton, BookingCardSkeleton } from '@/components/SkeletonLoader';

const BookingsLoadingState: React.FC = () => {
  return (
    <>
      <FilterSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
};

export default BookingsLoadingState;
