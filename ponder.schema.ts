import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  Wallet: p.createTable({
    id: p.hex(),
    endorsables: p.many("Endorsable.ownerId"),

    endorseFromEvents: p.many("EndorseEvent.fromId"),
    endorseToEvents: p.many("EndorseEvent.toId"),
  }),
  Endorsable: p.createTable({
    id: p.bigint(),
    ownerId: p.hex().references("Wallet.id"),
    timestamp: p.int(),

    owner: p.one("ownerId"),
    endorseEvents: p.many("EndorseEvent.digest"),
  }),
  EndorseEvent: p.createTable({
    id: p.string(),
    timestamp: p.int(),
    fromId: p.hex().references("Wallet.id"),
    toId: p.hex().references("Wallet.id"),
    digest: p.bigint().references("Endorsable.id"),

    from: p.one("fromId"),
    to: p.one("toId"),
    token: p.one("digest"),
  }),
}));
