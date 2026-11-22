const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

export function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < MINUTE) return 'hace instantes';
  if (seconds < HOUR) return `hace ${Math.floor(seconds / MINUTE)} min`;
  if (seconds < DAY) return `hace ${Math.floor(seconds / HOUR)} h`;
  if (seconds < MONTH) return `hace ${Math.floor(seconds / DAY)} d`;
  if (seconds < YEAR) return `hace ${Math.floor(seconds / MONTH)} m`;

  return `hace ${Math.floor(seconds / YEAR)} años`;
}
