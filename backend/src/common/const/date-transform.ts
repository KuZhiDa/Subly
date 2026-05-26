export const PeriodInSetFunc = {
  MONTH: (date, count) => date.setMonth(date.getMonth() + count),
  YEAR: (date, count) => date.setYear(date.getFullYear() + count),
  DAY: (date, count) => date.setDate(date.getDate() + count),
  LIFE: (date, count) => (date = null),
  WEEK: (date, count) => date.setDate(date.getDate() + count * 7),
};

export const getLeftDate = {
  WEEK: (date) => {
    const daysToMonday = date.getUTCDay() === 0 ? 6 : date.getUTCDay() - 1;
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() - daysToMonday,
      0,
      0,
      0,
      0,
    );
  },
  DAY: (date) =>
    new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  MONTH: (date) =>
    new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0),
    ),
  YEAR: (date) => new Date(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0),
};
