import { ponder } from "@/generated";
import { saveDailyBucket, saveMonthlyBucket, saveWeeklyBucket } from "./utils";

ponder.on("MXNUSDFeed:AnswerUpdated", async ({ event, context }) => {
  const {
    MedianMXNUSDRate,
    DailyBucketMXNUSDRate,
    WeeklyBucketMXNUSDRate,
    MonthlyBucketMXNUSDRate,
  } = context.db;

  const timestamp = Number(event.block.timestamp);
  const decimals = 8;
  const rate = Number(event.args.current) / 10 ** decimals;
  const inverseRate = 10 ** decimals / Number(event.args.current);

  await MedianMXNUSDRate.create({
    id: event.args.roundId,
    data: {
      rate,
      inverseRate,
      timestamp,
      network: context.network.chainId,
    },
  });
  await saveDailyBucket(DailyBucketMXNUSDRate, rate, inverseRate, timestamp);
  await saveWeeklyBucket(WeeklyBucketMXNUSDRate, rate, inverseRate, timestamp);
  await saveMonthlyBucket(
    MonthlyBucketMXNUSDRate,
    rate,
    inverseRate,
    timestamp
  );
});

ponder.on("USDCUSDFeed:AnswerUpdated", async ({ event, context }) => {
  const {
    MedianUSDCUSDRate,
    DailyBucketUSDCUSDRate,
    WeeklyBucketUSDCUSDRate,
    MonthlyBucketUSDCUSDRate,
    MedianMXNUSDRate,
    MedianUSDCMXNRate,
    DailyBucketUSDCMXNRate,
    WeeklyBucketUSDCMXNRate,
    MonthlyBucketUSDCMXNRate,
  } = context.db;

  const decimals = 8;
  const usdusdc = Number(event.args.current) / 10 ** decimals;
  const usdcusd = 10 ** decimals / Number(event.args.current);
  const timestamp = Number(event.block.timestamp);

  await MedianUSDCUSDRate.create({
    id: event.args.roundId,
    data: {
      rate: usdcusd,
      inverseRate: usdusdc,
      timestamp,
      network: context.network.chainId,
    },
  });

  await saveDailyBucket(DailyBucketUSDCUSDRate, usdcusd, usdusdc, timestamp);
  await saveWeeklyBucket(WeeklyBucketUSDCUSDRate, usdcusd, usdusdc, timestamp);
  await saveMonthlyBucket(
    MonthlyBucketUSDCUSDRate,
    usdcusd,
    usdusdc,
    timestamp
  );

  const medians = await MedianMXNUSDRate.findMany({
    limit: 1,
    where: {
      timestamp: { lte: timestamp }, // Get the latest price for the corresponding timestamp
    },
    orderBy: { timestamp: "desc" },
  });

  if (!medians.items?.[0]) return; // No MXNUSD price

  const usdmxn = medians.items[0].inverseRate;

  const usdcmxn = usdmxn / usdcusd;
  const mxncusdc = usdcusd / usdmxn;

  await MedianUSDCMXNRate.create({
    id: event.args.roundId,
    data: {
      rate: usdcmxn,
      inverseRate: mxncusdc,
      timestamp,
      network: context.network.chainId,
    },
  });

  await saveDailyBucket(DailyBucketUSDCMXNRate, usdcmxn, mxncusdc, timestamp);
  await saveWeeklyBucket(WeeklyBucketUSDCMXNRate, usdcmxn, mxncusdc, timestamp);
  await saveMonthlyBucket(
    MonthlyBucketUSDCMXNRate,
    usdcmxn,
    mxncusdc,
    timestamp
  );
});
