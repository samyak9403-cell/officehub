// Dates are stored as UTC midnight, so format them in UTC to avoid off-by-one days in other time zones.
export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' }) : '';
