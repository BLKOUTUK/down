import { prisma } from './db';

export interface TimeWindowCheck {
  isWithinWindow: boolean;
  nextWindowStart?: Date;
  nextWindowEnd?: Date;
  timeUntilNext?: number;
  currentWindowEnd?: Date;
}

export async function checkTimeWindow(): Promise<TimeWindowCheck> {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 4 = Thursday, 5 = Friday
  const currentHour = now.getHours();
  
  // Try to get custom window from database, otherwise use default
  let window = {
    dayOfWeek: 4,      // Thursday
    startHour: 16,     // 4pm
    endDayOfWeek: 5,   // Friday
    endHour: 24        // Midnight (end of Friday)
  };
  
  try {
    const dbWindows = await prisma.timeWindow.findMany({
      where: { isActive: true }
    });
    
    if (dbWindows?.[0]) {
      window = dbWindows[0];
    }
  } catch (e) {
    // Use default if database not available
  }
  
  // Check if currently within window
  let isWithinWindow = false;
  let currentWindowEnd: Date | undefined;
  
  // Thursday from startHour onwards
  if (currentDay === window.dayOfWeek && currentHour >= window.startHour) {
    isWithinWindow = true;
    currentWindowEnd = getEndOfWindow(now, window);
  }
  
  // Friday before endHour
  if (currentDay === window.endDayOfWeek && currentHour < window.endHour) {
    isWithinWindow = true;
    currentWindowEnd = getEndOfWindow(now, window);
  }
  
  // Calculate next window start
  let nextWindowStart: Date | undefined;
  let nextWindowEnd: Date | undefined;
  let timeUntilNext: number | undefined;
  
  if (!isWithinWindow) {
    nextWindowStart = getNextWindowStart(now, window);
    nextWindowEnd = getEndOfWindow(nextWindowStart, window);
    timeUntilNext = nextWindowStart.getTime() - now.getTime();
  }
  
  return {
    isWithinWindow,
    nextWindowStart,
    nextWindowEnd,
    timeUntilNext,
    currentWindowEnd
  };
}

function getNextWindowStart(from: Date, window: any): Date {
  const next = new Date(from);
  const currentDay = from.getDay();
  const currentHour = from.getHours();
  
  // If we're on Thursday but before start hour
  if (currentDay === window.dayOfWeek && currentHour < window.startHour) {
    next.setHours(window.startHour, 0, 0, 0);
    return next;
  }
  
  // Calculate days until next Thursday
  const daysUntilThursday = (window.dayOfWeek - currentDay + 7) % 7 || 7;
  next.setDate(from.getDate() + daysUntilThursday);
  next.setHours(window.startHour, 0, 0, 0);
  
  return next;
}

function getEndOfWindow(from: Date, window: any): Date {
  const end = new Date(from);
  const dayDiff = window.endDayOfWeek - window.dayOfWeek;
  
  if (from.getDay() === window.dayOfWeek) {
    end.setDate(from.getDate() + dayDiff);
  }
  
  end.setHours(window.endHour, 0, 0, 0);
  return end;
}

export function formatTimeUntil(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}
