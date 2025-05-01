
import { ColumnMapping } from './types';

// Function to find the best match column for a field
export const findMatchingColumn = (headers: string[], fieldVariations: string[]): number => {
  for (const variation of fieldVariations) {
    const matchIndex = headers.findIndex(h => 
      h.toLowerCase().trim() === variation ||
      h.toLowerCase().trim().includes(variation)
    );
    if (matchIndex !== -1) return matchIndex;
  }
  return -1;
};
