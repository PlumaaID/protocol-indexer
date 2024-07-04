import { ponder } from "@/generated";

ponder.on("Endorser:Transfer", async ({ event, context }) => {
  const { Wallet, Endorsable, EndorseEvent } = context.db;

  // Create an Wallet for the sender, or update the balance if it already exists.
  await Wallet.upsert({
    id: event.args.from,
  });

  // Create an Wallet for the recipient, or update the balance if it already exists.
  await Wallet.upsert({
    id: event.args.to,
  });

  // Create or update a Endorsable.
  await Endorsable.upsert({
    id: event.args.id,
    create: {
      ownerId: event.args.to,
    },
    update: {
      ownerId: event.args.to,
    },
  });

  // Create a EndorseEvent.
  await EndorseEvent.create({
    id: event.log.id,
    data: {
      fromId: event.args.from,
      toId: event.args.to,
      digest: event.args.id,
      timestamp: Number(event.block.timestamp),
    },
  });
});
