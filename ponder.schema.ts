import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  Wallet: p.createTable({
    id: p.hex(),
    tokens: p.many("Token.ownerId"),

    transferFromEvents: p.many("TransferEvent.fromId"),
    transferToEvents: p.many("TransferEvent.toId"),
  }),
  Token: p.createTable({
    id: p.bigint(),
    ownerId: p.hex().references("Wallet.id"),

    owner: p.one("ownerId"),
    transferEvents: p.many("TransferEvent.tokenId"),
  }),
  TransferEvent: p.createTable({
    id: p.string(),
    timestamp: p.int(),
    fromId: p.hex().references("Wallet.id"),
    toId: p.hex().references("Wallet.id"),
    tokenId: p.bigint().references("Token.id"),

    from: p.one("fromId"),
    to: p.one("toId"),
    token: p.one("tokenId"),
  }),
}));
