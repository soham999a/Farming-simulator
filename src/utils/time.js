// Time utility functions for the farming game

// Format milliseconds to human readable time
export const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

// Format time for countdown display
export const formatCountdown = (milliseconds) => {
  if (milliseconds <= 0) return "Ready!";
  
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `0:${seconds.toString().padStart(2, '0')}`;
};

// Get time elapsed since planting
export const getTimeElapsed = (plantedAt) => {
  return Date.now() - plantedAt;
};

// Check if enough time has passed
export const hasTimeElapsed = (startTime, duration) => {
  return Date.now() - startTime >= duration;
};

// Get progress percentage (0-100)
export const getProgressPercentage = (startTime, duration) => {
  const elapsed = getTimeElapsed(startTime);
  const percentage = (elapsed / duration) * 100;
  return Math.min(100, Math.max(0, percentage));
};

// Get remaining time
export const getRemainingTime = (startTime, duration) => {
  const elapsed = getTimeElapsed(startTime);
  const remaining = duration - elapsed;
  return Math.max(0, remaining);
};

// Format money with currency symbol
export const formatMoney = (amount) => {
  return `₹${amount.toLocaleString()}`;
};

// Get relative time string (e.g., "2 minutes ago")
export const getRelativeTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
};
