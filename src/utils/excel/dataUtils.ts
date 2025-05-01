
// Normalize status to one of: 'confirmed', 'pending', 'cancelled'
export const normalizeStatus = (statusValue: string): 'confirmed' | 'pending' | 'cancelled' => {
  if (!statusValue) return 'pending';
  
  const status = String(statusValue).trim().toLowerCase();
  
  if (status.includes('confirm') || status.includes('approved') || status === 'yes' || status === 'y') {
    return 'confirmed';
  } else if (status.includes('cancel') || status.includes('declined') || status === 'no' || status === 'n') {
    return 'cancelled';
  } else {
    return 'pending';
  }
};

// Convert a color name or hex code to valid CSS color
export const normalizeColor = (colorValue: string): string => {
  if (!colorValue) return '';
  
  const colorStr = String(colorValue).trim().toLowerCase();
  
  // If it's already a hex code
  if (colorStr.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)) {
    return colorStr;
  }
  
  // Map common color names to hex codes
  const colorMap: Record<string, string> = {
    'red': '#FF0000',
    'green': '#008000',
    'blue': '#0000FF',
    'yellow': '#FFFF00',
    'purple': '#800080',
    'orange': '#FFA500',
    'pink': '#FFC0CB',
    'brown': '#A52A2A',
    'gray': '#808080',
    'grey': '#808080',
    'black': '#000000',
    'white': '#FFFFFF',
    'cyan': '#00FFFF',
    'magenta': '#FF00FF',
    'lime': '#00FF00',
    'olive': '#808000',
    'teal': '#008080',
    'navy': '#000080',
    'maroon': '#800000',
    'gold': '#FFD700'
  };
  
  return colorMap[colorStr] || '';
};
