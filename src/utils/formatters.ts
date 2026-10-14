// Utility formatters for Indian locale & CoreNode GymOS standards

export const formatINR = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
};

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
};

export const formatTime = (timeStr?: string): string => {
  if (!timeStr) return '—';
  // If already in 12-hr format like "07:30 AM"
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  try {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${m} ${ampm}`;
  } catch {
    return timeStr;
  }
};

export const formatDateTime = (isoString?: string): string => {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const day = String(d.getDate()).padStart(2, '0');
    const month = MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  } catch {
    return isoString;
  }
};

export const getDaysRemaining = (expiryDateStr: string, fromDateStr = '2026-10-14'): number => {
  try {
    const expiry = new Date(expiryDateStr);
    const today = new Date(fromDateStr);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

export const addMonthsToDate = (startDateStr: string, months: number): string => {
  try {
    const d = new Date(startDateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  } catch {
    return startDateStr;
  }
};

export const addDaysToDate = (startDateStr: string, days: number): string => {
  try {
    const d = new Date(startDateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  } catch {
    return startDateStr;
  }
};

export const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
