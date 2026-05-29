export const PeriodInSetFunc = {
  MONTH: (date, count) => date.setUTCMonth(date.getUTCMonth() + count),
  YEAR: (date, count) => date.setUTCFullYear(date.getUTCFullYear() + count),
  DAY: (date, count) => date.setUTCDate(date.getUTCDate() + count),
  LIFE: (date, count) => (date = null),
  WEEK: (date, count) => date.setUTCDate(date.getUTCDate() + count * 7),
};

export const getLeftDate = {
  WEEK: (date) => {
    const daysToMonday = date.getUTCDay() === 0 ? 6 : date.getUTCDay() - 1;
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() - daysToMonday,
        0,
        0,
        0,
        0,
      ),
    );
  },
  DAY: (date) =>
    new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    ),
  MONTH: (date) =>
    new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0),
    ),
  YEAR: (date) => new Date(Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0)),
};

export const MapperPeriodInDays = {
  DAY: 1,
  WEEK: 7,
  MONTH: 31,
  YEAR: 365,
};
