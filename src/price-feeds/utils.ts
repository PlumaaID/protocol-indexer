import { ponder } from "@/generated";

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
  id: number,
  bucket: any,
  rate: number,
  inverseRate: number
) => {
  await bucket.upsert({
    id,
    create: {
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
    },
    update: ({ current }: { current: any }) => ({
      close: rate,
      low: current.low > rate ? rate : current.low,
      high: current.high < rate ? rate : current.high,
      average: (current.average * current.count + rate) / (current.count + 1),
      inverseClose: inverseRate,
      inverseLow:
        current.inverseLow > inverseRate ? inverseRate : current.inverseLow,
      inverseHigh:
        current.inverseHigh < inverseRate ? inverseRate : current.inverseHigh,
      inverseAverage:
        (current.inverseAverage * current.count + inverseRate) /
        (current.count + 1),
      count: current.count + 1,
    }),
  });
};

const saveDailyBucket = async (
  bucket: any,
  rate: number,
  inverseRate: number,
  timestamp: number
) => saveBucket(toHourId(Number(timestamp)), bucket, rate, inverseRate);

const saveWeeklyBucket = async (
  bucket: any,
  rate: number,
  inverseRate: number,
  timestamp: number
) => saveBucket(toWeekId(Number(timestamp)), bucket, rate, inverseRate);

const saveMonthlyBucket = async (
  bucket: any,
  rate: number,
  inverseRate: number,
  timestamp: number
) => saveBucket(toMonthId(Number(timestamp)), bucket, rate, inverseRate);

export { saveDailyBucket, saveWeeklyBucket, saveMonthlyBucket };
