import { ponder } from "ponder:registry";
import { saveDailyBucket, saveMonthlyBucket, saveWeeklyBucket } from "./utils";
import {
  DailyBucketMXNUSDRate,
  DailyBucketUSDCMXNRate,
  DailyBucketUSDCUSDRate,
  MedianMXNUSDRate,
  MedianUSDCMXNRate,
  MedianUSDCUSDRate,
  MonthlyBucketMXNUSDRate,
  MonthlyBucketUSDCMXNRate,
  MonthlyBucketUSDCUSDRate,
  WeeklyBucketMXNUSDRate,
  WeeklyBucketUSDCMXNRate,
  WeeklyBucketUSDCUSDRate,
} from "ponder:schema";
import { desc, lte } from "ponder";

ponder.on("MXNUSDFeed:AnswerUpdated", async ({ event, context }) => {
  const timestamp = Number(event.block.timestamp);
  const decimals = 8;
  const rate = Number(event.args.current) / 10 ** decimals;
  const inverseRate = 10 ** decimals / Number(event.args.current);

  await context.db.insert(MedianMXNUSDRate).values({
    id: event.args.roundId,
    rate,
    inverseRate,
    timestamp,
    network: context.network.chainId,
  });
  await saveDailyBucket(
    context,
    DailyBucketMXNUSDRate,
    rate,
    inverseRate,
    timestamp
  );
  await saveWeeklyBucket(
    context,
    WeeklyBucketMXNUSDRate,
    rate,
    inverseRate,
    timestamp
  );
  await saveMonthlyBucket(
    context,
    MonthlyBucketMXNUSDRate,
    rate,
    inverseRate,
    timestamp
  );
});

ponder.on("USDCUSDFeed:AnswerUpdated", async ({ event, context }) => {
  const decimals = 8;
  const usdusdc = Number(event.args.current) / 10 ** decimals;
  const usdcusd = 10 ** decimals / Number(event.args.current);
  const timestamp = Number(event.block.timestamp);

  await context.db.insert(MedianUSDCUSDRate).values({
    id: event.args.roundId,
    rate: usdcusd,
    inverseRate: usdusdc,
    timestamp,
    network: context.network.chainId,
  });

  await saveDailyBucket(
    context,
    DailyBucketUSDCUSDRate,
    usdcusd,
    usdusdc,
    timestamp
  );
  await saveWeeklyBucket(
    context,
    WeeklyBucketUSDCUSDRate,
    usdcusd,
    usdusdc,
    timestamp
  );
  await saveMonthlyBucket(
    context,
    MonthlyBucketUSDCUSDRate,
    usdcusd,
    usdusdc,
    timestamp
  );

  const medians = await context.db.sql
    .select()
    .from(MedianMXNUSDRate)
    .where(lte(MedianMXNUSDRate.timestamp, timestamp))
    .orderBy(desc(MedianMXNUSDRate.timestamp))
    .limit(1);

  if (!medians?.[0]) return; // No MXNUSD price

  const usdmxn = medians[0].inverseRate;

  const usdcmxn = usdmxn / usdcusd;
  const mxncusdc = usdcusd / usdmxn;

  await context.db.insert(MedianUSDCMXNRate).values({
    id: event.args.roundId,
    rate: usdcmxn,
    inverseRate: mxncusdc,
    timestamp,
    network: context.network.chainId,
  });

  await saveDailyBucket(
    context,
    DailyBucketUSDCMXNRate,
    usdcmxn,
    mxncusdc,
    timestamp
  );
  await saveWeeklyBucket(
    context,
    WeeklyBucketUSDCMXNRate,
    usdcmxn,
    mxncusdc,
    timestamp
  );
  await saveMonthlyBucket(
    context,
    MonthlyBucketUSDCMXNRate,
    usdcmxn,
    mxncusdc,
    timestamp
  );
});
