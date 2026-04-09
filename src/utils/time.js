// Perm timezone offset = UTC+5
export const getPermMidnight = () => {
  const now = new Date();
  const permOffset = 5 * 60; // minutes
  const localOffset = -now.getTimezoneOffset(); // minutes
  const diffMs = (permOffset - localOffset) * 60 * 1000;
  const permNow = new Date(now.getTime() + diffMs);
  const midnight = new Date(permNow);
  midnight.setHours(0, 0, 0, 0);
  return new Date(midnight.getTime() - diffMs);
};
