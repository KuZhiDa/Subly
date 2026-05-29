export const PeriodInSetFunc = {
  MONTH: (date, count) => date.setMonth(date.getMonth() + count),
  YEAR: (date, count) => date.setYear(date.getFullYear() + count),
  DAY: (date, count) => date.setDate(date.getDate() + count),
  LIFE: (date, count) => (date = null),
  WEEK: (date, count) => date.setDate(date.getDate() + count * 7),
};
