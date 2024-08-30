import { createSchema } from "@ponder/core";

const createMedianRate = (p: any) =>
  p.createTable({
    id: p.bigint(),
    rate: p.float(),
    inverseRate: p.float(),
    timestamp: p.int(),
    network: p.int(),
  });

const createBucket = (p: any) =>
  p.createTable({
    id: p.int(),
    // Regular
    open: p.float(),
    close: p.float(),
    low: p.float(),
    high: p.float(),
    average: p.float(),
    // Inverse
    inverseOpen: p.float(),
    inverseClose: p.float(),
    inverseLow: p.float(),
    inverseHigh: p.float(),
    inverseAverage: p.float(),
    count: p.int(),
  });

export default createSchema((p) => ({
  Wallet: p.createTable({
    id: p.hex(),
    endorsables: p.many("Endorsable.ownerId"),

    endorseFromEvents: p.many("EndorseEvent.fromId"),
    endorseToEvents: p.many("EndorseEvent.toId"),
  }),

  // Plumaa ID protocol
  Endorsable: p.createTable({
    id: p.bigint(),
    ownerId: p.hex().references("Wallet.id"),
    timestamp: p.int(),
    network: p.int(),

    owner: p.one("ownerId"),
    endorseEvents: p.many("EndorseEvent.digest"),
  }),
  EndorseEvent: p.createTable({
    id: p.string(),
    timestamp: p.int(),
    fromId: p.hex().references("Wallet.id"),
    toId: p.hex().references("Wallet.id"),
    digest: p.bigint().references("Endorsable.id"),
    network: p.int(),

    from: p.one("fromId"),
    to: p.one("toId"),
    token: p.one("digest"),
  }),

  // Price feeds
  MedianMXNUSDRate: createMedianRate(p),
  DailyBucketMXNUSDRate: createBucket(p),
  WeeklyBucketMXNUSDRate: createBucket(p),
  MonthlyBucketMXNUSDRate: createBucket(p),

  MedianUSDCUSDRate: createMedianRate(p),
  DailyBucketUSDCUSDRate: createBucket(p),
  WeeklyBucketUSDCUSDRate: createBucket(p),
  MonthlyBucketUSDCUSDRate: createBucket(p),

  MedianUSDCMXNRate: createMedianRate(p),
  DailyBucketUSDCMXNRate: createBucket(p),
  WeeklyBucketUSDCMXNRate: createBucket(p),
  MonthlyBucketUSDCMXNRate: createBucket(p),
}));
