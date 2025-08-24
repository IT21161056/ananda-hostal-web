// Function to get current week number in the month (simpler version)
export const getWeekNumberInMonth = (date: Date): number => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Adjust for week starting on Monday
  const adjustedFirstDay = (firstDayOfWeek + 6) % 7; // Now 0 = Monday, 6 = Sunday
  
  const currentDate = date.getDate();
  return Math.ceil((currentDate + adjustedFirstDay) / 7);
};

