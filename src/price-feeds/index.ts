import { ponder } from "@/generated";

ponder.on("MXNUSDFeed:AnswerUpdated", async ({ event, context }) => {
  const { MedianMXNUSDRate } = context.db;

  await MedianMXNUSDRate.create({
    id: event.args.roundId,
    data: {
      rate: Number(event.args.current) / 1e8, // 8 decimals
      inverseRate: 1e8 / Number(event.args.current), // 8 decimals
      timestamp: Number(event.block.timestamp),
      network: context.network.chainId,
    },
  });
});

ponder.on("USDCUSDFeed:AnswerUpdated", async ({ event, context }) => {
  const { MedianUSDCUSDRate, MedianMXNUSDRate, MedianUSDCMXNRate } = context.db;

  const decimals = 8;
  const usdusdc = Number(event.args.current) / 10 ** decimals;
  const usdcusd = 10 ** decimals / Number(event.args.current);

  await MedianUSDCUSDRate.create({
    id: event.args.roundId,
    data: {
      rate: usdcusd,
      inverseRate: usdusdc,
      timestamp: Number(event.block.timestamp),
      network: context.network.chainId,
    },
  });

  const medians = await MedianMXNUSDRate.findMany({
    limit: 1,
    where: {
      timestamp: { lte: Number(event.block.timestamp) }, // Get the latest price for the corresponding timestamp
    },
    orderBy: { timestamp: "desc" },
  });

  if (!medians.items?.[0]) return; // No MXNUSD price

  const usdmxn = medians.items[0].inverseRate;

  await MedianUSDCMXNRate.create({
    id: event.args.roundId,
    data: {
      rate: usdmxn / usdcusd,
      inverseRate: usdcusd / usdmxn,
      timestamp: Number(event.block.timestamp),
      network: context.network.chainId,
    },
  });
});
