const secondsInDay = 60 * 60 * 24;
const toHourId = (timestamp: number) =>
  Math.floor(timestamp / secondsInDay) * secondsInDay;

const secondsInWeek = secondsInDay * 7;
const toWeekId = (timestamp: number) =>
  Math.floor(timestamp / secondsInWeek) * secondsInWeek;

const secondsInMonth = secondsInDay * 30;
const toMonthId = (timestamp: number) =>
  Math.floor(timestamp / secondsInMonth) * secondsInMonth;

const saveBucket = async (
  context: any,
  id: number,
  bucket: any,
  rate: number,
  inverseRate: number
) => {
  await context.db
    .insert(bucket)
    .values({
      id,
      open: rate,
      close: rate,
      low: rate,
      high: rate,
      average: rate,
      inverseOpen: inverseRate,
      inverseClose: inverseRate,
      inverseLow: inverseRate,
      inverseHigh: inverseRate,
      inverseAverage: inverseRate,
      count: 1,
    })
    .onConflictDoUpdate((row: any) => ({
      close: rate,
      low: row.low > rate ? rate : row.low,
      high: row.high < rate ? rate : row.high,
      average: (row.average * row.count + rate) / (row.count + 1),
      inverseClose: inverseRate,
      inverseLow: row.inverseLow > inverseRate ? inverseRate : row.inverseLow,
      inverseHigh:
        row.inverseHigh < inverseRate ? inverseRate : row.inverseHigh,
      inverseAverage:
        (row.inverseAverage * row.count + inverseRate) / (row.count + 1),
      count: row.count,
    }));
};

const saveDailyBucket = async (
  context: any,
  bucket: any,
  rate: number,
  inverseRate: number,
  timestamp: number
) =>
  saveBucket(context, toHourId(Number(timestamp)), bucket, rate, inverseRate);

const saveWeeklyBucket = async (
  context: any,

  bucket: any,
  rate: number,
  inverseRate: number,
  timestamp: number
) =>
  saveBucket(context, toWeekId(Number(timestamp)), bucket, rate, inverseRate);

const saveMonthlyBucket = async (
  context: any,
  bucket: any,
  rate: number,
  inverseRate: number,
  timestamp: number
) =>
  saveBucket(context, toMonthId(Number(timestamp)), bucket, rate, inverseRate);

export { saveDailyBucket, saveWeeklyBucket, saveMonthlyBucket };
