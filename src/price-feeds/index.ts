// import { ponder } from "ponder:registry";
// import { saveDailyBucket, saveMonthlyBucket, saveWeeklyBucket } from "./utils";
// import {
//   dailyBucketMXNUSDRate,
//   dailyBucketUSDCMXNRate,
//   dailyBucketUSDCUSDRate,
//   medianMXNUSDRate,
//   medianUSDCMXNRate,
//   medianUSDCUSDRate,
//   monthlyBucketMXNUSDRate,
//   monthlyBucketUSDCMXNRate,
//   monthlyBucketUSDCUSDRate,
//   weeklyBucketMXNUSDRate,
//   weeklyBucketUSDCMXNRate,
//   weeklyBucketUSDCUSDRate,
// } from "ponder:schema";
// import { desc, eq, lte } from "ponder";

// ponder.on("MXNUSDFeed:AnswerUpdated", async ({ event, context }) => {
//   const timestamp = Number(event.block.timestamp);
//   const decimals = 8;
//   const rate = Number(event.args.current) / 10 ** decimals;
//   const inverseRate = 10 ** decimals / Number(event.args.current);

//   await context.db.insert(medianMXNUSDRate).values({
//     id: event.args.roundId,
//     rate,
//     inverseRate,
//     timestamp,
//     network: context.network.chainId,
//   });
//   await saveDailyBucket(
//     context,
//     dailyBucketMXNUSDRate,
//     rate,
//     inverseRate,
//     timestamp
//   );
//   await saveWeeklyBucket(
//     context,
//     weeklyBucketMXNUSDRate,
//     rate,
//     inverseRate,
//     timestamp
//   );
//   await saveMonthlyBucket(
//     context,
//     monthlyBucketMXNUSDRate,
//     rate,
//     inverseRate,
//     timestamp
//   );
// });

// ponder.on("USDCUSDFeed:AnswerUpdated", async ({ event, context }) => {
//   const decimals = 8;
//   const usdusdc = Number(event.args.current) / 10 ** decimals;
//   const usdcusd = 10 ** decimals / Number(event.args.current);
//   const timestamp = Number(event.block.timestamp);

//   await context.db.insert(medianUSDCUSDRate).values({
//     id: event.args.roundId,
//     rate: usdcusd,
//     inverseRate: usdusdc,
//     timestamp,
//     network: context.network.chainId,
//   });

//   await saveDailyBucket(
//     context,
//     dailyBucketUSDCUSDRate,
//     usdcusd,
//     usdusdc,
//     timestamp
//   );
//   await saveWeeklyBucket(
//     context,
//     weeklyBucketUSDCUSDRate,
//     usdcusd,
//     usdusdc,
//     timestamp
//   );
//   await saveMonthlyBucket(
//     context,
//     monthlyBucketUSDCUSDRate,
//     usdcusd,
//     usdusdc,
//     timestamp
//   );

//   const medians = await context.db.sql
//     .select()
//     .from(medianMXNUSDRate)
//     // Get the latest price for the corresponding timestamp
//     .where(lte(medianMXNUSDRate.timestamp, timestamp))
//     .orderBy(desc(medianMXNUSDRate.timestamp))
//     .limit(1);
//   if (!medians?.[0]) return; // No MXNUSD price

//   const usdmxn = medians[0].inverseRate;

//   const usdcmxn = usdmxn / usdcusd;
//   const mxncusdc = usdcusd / usdmxn;

//   await context.db.insert(medianUSDCMXNRate).values({
//     id: event.args.roundId,
//     rate: usdcmxn,
//     inverseRate: mxncusdc,
//     timestamp,
//     network: context.network.chainId,
//   });

//   await saveDailyBucket(
//     context,
//     dailyBucketUSDCMXNRate,
//     usdcmxn,
//     mxncusdc,
//     timestamp
//   );
//   await saveWeeklyBucket(
//     context,
//     weeklyBucketUSDCMXNRate,
//     usdcmxn,
//     mxncusdc,
//     timestamp
//   );
//   await saveMonthlyBucket(
//     context,
//     monthlyBucketUSDCMXNRate,
//     usdcmxn,
//     mxncusdc,
//     timestamp
//   );
// });
