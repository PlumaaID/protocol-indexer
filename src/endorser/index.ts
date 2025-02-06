import { ponder } from "ponder:registry";
import { Endorsable, EndorseEvent, Wallet } from "ponder:schema";

ponder.on("Endorser:Transfer", async ({ event, context }) => {
  // Create an Wallet for the sender, or update the balance if it already exists.
  await context.db
    .insert(Wallet)
    .values({
      id: event.args.from,
    })
    .onConflictDoNothing();

  // Create an Wallet for the recipient, or update the balance if it already exists.
  await context.db
    .insert(Wallet)
    .values({
      id: event.args.to,
    })
    .onConflictDoNothing();

  const timestamp = Number(event.block.timestamp);

  // Create or update a Endorsable.
  await context.db
    .insert(Endorsable)
    .values({
      id: event.args.id,
      ownerId: event.args.to,
      timestamp,
      network: context.network.chainId,
    })
    .onConflictDoUpdate(() => ({
      ownerId: event.args.to,
    }));

  // Create a EndorseEvent.
  await context.db.insert(EndorseEvent).values({
    id: event.log.id,
    fromId: event.args.from,
    toId: event.args.to,
    digest: event.args.id,
    timestamp,
    network: context.network.chainId,
  });
});
