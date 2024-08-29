import { createSchema } from "@ponder/core";

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
  MedianMXNUSDRate: p.createTable({
    id: p.bigint(),
    rate: p.float(),
    inverseRate: p.float(),
    timestamp: p.int(),
    network: p.int(),
  }),
  MedianUSDCUSDRate: p.createTable({
    id: p.bigint(),
    rate: p.float(),
    inverseRate: p.float(),
    timestamp: p.int(),
    network: p.int(),
  }),
  MedianUSDCMXNRate: p.createTable({
    id: p.bigint(),
    rate: p.float(),
    inverseRate: p.float(),
    timestamp: p.int(),
    network: p.int(),
  }),
}));
