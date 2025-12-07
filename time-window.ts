import { prisma } from './db';

export interface TimeWindowCheck {
  isWithinWindow: boolean;
  nextWindowStart?: Date;
  timeUntilNext?: number;
}

export async function checkTimeWindow(): Promise<TimeWindowCheck> {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 4 = Thursday, 5 = Friday
  const currentHour = now.getHours();
  
  // Default window: Thursday 4pm to Friday midnight
  const windows = await prisma.timeWindow.findMany({
    where: { isActive: true }
  });
  
  // If no custom windows, use default
  const window = windows?.[0] ?? {
    dayOfWeek: 4,      // Thursday
    startHour: 16,     // 4pm
    endDayOfWeek: 5,   // Friday
    endHour: 24        // Midnight (end of Friday)
  };
  
  // Check if currently within window
  let isWithinWindow = false;
  
  // Thursday from startHour onwards
  if (currentDay === window.dayOfWeek && currentHour >= window.startHour) {
    isWithinWindow = true;
  }
  
  // Friday before endHour
  if (currentDay === window.endDayOfWeek && currentHour < window.endHour) {
    isWithinWindow = true;
  }
  
  // Calculate next window start
  let nextWindowStart: Date | undefined;
  let timeUntilNext: number | undefined;
  
  if (!isWithinWindow) {
    const nextWindow = new Date(now);
    
    // If before Thursday or after Friday, go to next Thursday
    if (currentDay < window.dayOfWeek || currentDay > window.endDayOfWeek) {
      const daysUntilThursday = (window.dayOfWeek - currentDay + 7) % 7 || 7;
      nextWindow.setDate(now.getDate() + daysUntilThursday);
      nextWindow.setHours(window.startHour, 0, 0, 0);
    }
    // If Thursday but before start hour
    else if (currentDay === window.dayOfWeek && currentHour < window.startHour) {
      nextWindow.setHours(window.startHour, 0, 0, 0);
    }
    // If Friday after end hour
    else if (currentDay === window.endDayOfWeek && currentHour >= window.endHour) {
      const daysUntilThursday = (window.dayOfWeek - currentDay + 7) % 7 || 7;
      nextWindow.setDate(now.getDate() + daysUntilThursday);
      nextWindow.setHours(window.startHour, 0, 0, 0);
    }
    
    nextWindowStart = nextWindow;
    timeUntilNext = nextWindow.getTime() - now.getTime();
  }
  
  return {
    isWithinWindow,
    nextWindowStart,
    timeUntilNext
  };
}
