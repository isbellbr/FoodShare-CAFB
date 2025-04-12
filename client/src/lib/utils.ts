import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getReadableDistance(distance: number): string {
  if (distance < 0.1) {
    return 'Very close';
  } else if (distance < 1) {
    return `${(distance * 10).toFixed(0) / 10} miles`;
  } else {
    return `${distance.toFixed(1)} miles`;
  }
}

export function calculateWalkingTime(distance: number): string {
  // Average walking speed is about 3.1 mph
  const walkingTimeMinutes = Math.round(distance / 3.1 * 60);
  
  if (walkingTimeMinutes < 1) {
    return 'Less than a minute';
  } else if (walkingTimeMinutes === 1) {
    return '1 minute walk';
  } else if (walkingTimeMinutes < 60) {
    return `${walkingTimeMinutes} min walk`;
  } else {
    const hours = Math.floor(walkingTimeMinutes / 60);
    const minutes = walkingTimeMinutes % 60;
    return `${hours}h ${minutes}m walk`;
  }
}

export function formatOpeningHours(openingHours: any) {
  if (!openingHours) return 'Hours not available';
  
  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date().getDay(); // 0 for Sunday, 6 for Saturday
  
  const todayKey = weekdays[today];
  
  if (!openingHours[todayKey]) {
    return 'Closed today';
  }
  
  return `${openingHours[todayKey].open} - ${openingHours[todayKey].close}`;
}

export function getPantryStatus(openingHours: any): { status: string; statusText: string } {
  if (!openingHours) return { status: 'closed', statusText: 'Closed' };
  
  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date().getDay(); // 0 for Sunday, 6 for Saturday
  const todayKey = weekdays[today];
  
  if (!openingHours[todayKey]) {
    // Find the next day that has hours
    let nextOpenDay = null;
    let daysUntilOpen = 0;
    
    for (let i = 1; i <= 7; i++) {
      const nextDay = (today + i) % 7;
      const nextDayKey = weekdays[nextDay];
      
      if (openingHours[nextDayKey]) {
        nextOpenDay = nextDayKey;
        daysUntilOpen = i;
        break;
      }
    }
    
    if (nextOpenDay) {
      if (daysUntilOpen === 1) {
        return { status: 'closed', statusText: 'Opens Tomorrow' };
      } else {
        return { status: 'closed', statusText: `Opens in ${daysUntilOpen} days` };
      }
    } else {
      return { status: 'closed', statusText: 'Temporarily Closed' };
    }
  }
  
  // Check if currently open
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  
  const [openHour, openMinute] = openingHours[todayKey].open.split(':').map(Number);
  const [closeHour, closeMinute] = openingHours[todayKey].close.split(':').map(Number);
  
  const openTimeMinutes = openHour * 60 + openMinute;
  const closeTimeMinutes = closeHour * 60 + closeMinute;
  
  if (currentTimeMinutes >= openTimeMinutes && currentTimeMinutes < closeTimeMinutes) {
    // Check if closing soon (within 1 hour)
    const minutesUntilClose = closeTimeMinutes - currentTimeMinutes;
    
    if (minutesUntilClose <= 60) {
      return { status: 'closing', statusText: `Closing in ${minutesUntilClose} mins` };
    }
    
    return { status: 'open', statusText: 'Open Now' };
  } else if (currentTimeMinutes < openTimeMinutes) {
    // Opening later today
    const minutesUntilOpen = openTimeMinutes - currentTimeMinutes;
    
    if (minutesUntilOpen <= 60) {
      return { status: 'closed', statusText: `Opens in ${minutesUntilOpen} mins` };
    }
    
    return { status: 'closed', statusText: `Opens at ${openingHours[todayKey].open}` };
  } else {
    return { status: 'closed', statusText: 'Closed' };
  }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(d)) {
    return `Today, ${format(d, 'h:mm a')}`;
  } else if (isTomorrow(d)) {
    return `Tomorrow, ${format(d, 'h:mm a')}`;
  } else {
    return format(d, 'MMM d, yyyy, h:mm a');
  }
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function getInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}
