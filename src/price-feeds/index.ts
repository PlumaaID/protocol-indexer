import { ponder } from "ponder:registry";
import { saveDailyBucket, saveMonthlyBucket, saveWeeklyBucket } from "./utils";
import {
  dailyBucketMXNUSDRates,
  dailyBucketUSDCMXNRates,
  dailyBucketUSDCUSDRates,
  medianMXNUSDRates,
  medianUSDCMXNRates,
  medianUSDCUSDRates,
  monthlyBucketMXNUSDRates,
  monthlyBucketUSDCMXNRates,
  monthlyBucketUSDCUSDRates,
  weeklyBucketMXNUSDRates,
  weeklyBucketUSDCMXNRates,
  weeklyBucketUSDCUSDRates,
} from "ponder:schema";
import { desc, eq, lte } from "ponder";

ponder.on("MXNUSDFeed:AnswerUpdated", async ({ event, context }) => {
  const timestamp = Number(event.block.timestamp);
  const decimals = 8;
  const rate = Number(event.args.current) / 10 ** decimals;
  const inverseRate = 10 ** decimals / Number(event.args.current);

  await context.db.insert(medianMXNUSDRates).values({
    id: event.args.roundId,
    rate,
    inverseRate,
    timestamp,
    network: context.network.chainId,
  });
  await saveDailyBucket(
    context,
    dailyBucketMXNUSDRates,
    rate,
    inverseRate,
    timestamp
  );
  await saveWeeklyBucket(
    context,
    weeklyBucketMXNUSDRates,
    rate,
    inverseRate,
    timestamp
  );
  await saveMonthlyBucket(
    context,
    monthlyBucketMXNUSDRates,
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

  await context.db.insert(medianUSDCUSDRates).values({
    id: event.args.roundId,
    rate: usdcusd,
    inverseRate: usdusdc,
    timestamp,
    network: context.network.chainId,
  });

  await saveDailyBucket(
    context,
    dailyBucketUSDCUSDRates,
    usdcusd,
    usdusdc,
    timestamp
  );
  await saveWeeklyBucket(
    context,
    weeklyBucketUSDCUSDRates,
    usdcusd,
    usdusdc,
    timestamp
  );
  await saveMonthlyBucket(
    context,
    monthlyBucketUSDCUSDRates,
    usdcusd,
    usdusdc,
    timestamp
  );

  const medians = await context.db.sql
    .select()
    .from(medianMXNUSDRates)
    // Get the latest price for the corresponding timestamp
    .where(lte(medianMXNUSDRates.timestamp, timestamp))
    .orderBy(desc(medianMXNUSDRates.timestamp))
    .limit(1);
  if (!medians?.[0]) return; // No MXNUSD price

  const usdmxn = medians[0].inverseRate;

  const usdcmxn = usdmxn / usdcusd;
  const mxncusdc = usdcusd / usdmxn;

  await context.db.insert(medianUSDCMXNRates).values({
    id: event.args.roundId,
    rate: usdcmxn,
    inverseRate: mxncusdc,
    timestamp,
    network: context.network.chainId,
  });

  await saveDailyBucket(
    context,
    dailyBucketUSDCMXNRates,
    usdcmxn,
    mxncusdc,
    timestamp
  );
  await saveWeeklyBucket(
    context,
    weeklyBucketUSDCMXNRates,
    usdcmxn,
    mxncusdc,
    timestamp
  );
  await saveMonthlyBucket(
    context,
    monthlyBucketUSDCMXNRates,
    usdcmxn,
    mxncusdc,
    timestamp
  );
});
