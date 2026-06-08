export const SOBRIETY_START = new Date('2022-12-22T00:00:00');

export function getSobrietyStats(startDate = SOBRIETY_START) {
  const now = new Date();
  const diffMs = now - startDate;

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalMonths = Math.floor(totalDays / 30.44);
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30.44);
  const days = totalDays % 365 % 30;

  return {
    totalDays,
    totalHours,
    years,
    months,
    days,
    startDate,
  };
}

export function getMilestone(totalDays) {
  const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365, 730];
  return milestones.find(m => totalDays === m) || null;
}

export function getNextMilestone(totalDays) {
  const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365, 730, 1095];
  return milestones.find(m => m > totalDays) || null;
}
