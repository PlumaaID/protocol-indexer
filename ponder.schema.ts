import { onchainTable, primaryKey, relations } from "ponder";

const createMedianRate = (t: any) => ({
  id: t.bigint().primaryKey().notNull(),
  rate: t.real().notNull(),
  inverseRate: t.real().notNull(),
  timestamp: t.integer().notNull(),
  network: t.integer().notNull(),
});

const createBucket = (t: any) => ({
  id: t.integer().primaryKey().notNull(),
  // Regular
  open: t.real().notNull(),
  close: t.real().notNull(),
  low: t.real().notNull(),
  high: t.real().notNull(),
  average: t.real().notNull(),
  /// Inverse
  inverseOpen: t.real().notNull(),
  inverseClose: t.real().notNull(),
  inverseLow: t.real().notNull(),
  inverseHigh: t.real().notNull(),
  inverseAverage: t.real().notNull(),
  count: t.integer().notNull(),
});

export const Endorsable = onchainTable("endorsable", (t) => ({
  id: t.bigint().primaryKey().notNull(),
  ownerId: t.hex().notNull(),
  timestamp: t.integer().notNull(),
  network: t.integer().notNull(),
}));

export const EndorsableRelationships = relations(
  Endorsable,
  ({ one, many }) => ({
    owner: one(Wallet, {
      fields: [Endorsable.ownerId],
      references: [Wallet.id],
    }),
    endorseEvents: many(EndorseEvent),
  })
);

export const EndorseEvent = onchainTable("endorse_event", (t) => ({
  id: t.text().primaryKey().notNull(),
  timestamp: t.integer().notNull(),
  fromId: t.hex().notNull(),
  toId: t.hex().notNull(),
  digest: t.bigint().notNull(),
  network: t.integer().notNull(),
}));

export const EndorseEventRelationships = relations(EndorseEvent, ({ one }) => ({
  from: one(Wallet, {
    fields: [EndorseEvent.fromId],
    references: [Wallet.id],
  }),
  to: one(Wallet, {
    fields: [EndorseEvent.toId],
    references: [Wallet.id],
  }),
  token: one(Endorsable, {
    fields: [EndorseEvent.digest],
    references: [Endorsable.id],
  }),
}));

export const Wallet = onchainTable("wallet", (t) => ({
  id: t.hex().primaryKey(),
}));

export const WalletRelationships = relations(Wallet, ({ many }) => ({
  endorsables: many(Endorsable),
  endorseFromEvents: many(EndorseEvent),
  endorseToEvents: many(EndorseEvent),
}));

export const TinteroVault = onchainTable("tintero_vault", (t) => ({
  id: t.hex().primaryKey().notNull(),
  asset: t.hex().notNull(),
}));

export const TinteroVaultRelationships = relations(
  TinteroVault,
  ({ many }) => ({
    loans: many(TinteroLoan),
  })
);

export const TinteroLoan = onchainTable("tintero_loan", (t) => ({
  id: t.hex().primaryKey().notNull(),
  collateralAsset: t.hex().notNull(),
  beneficiary: t.hex().notNull(),
  defaultThreshold: t.integer().notNull(),
  vault: t.hex().notNull(),
  totalFunded: t.integer().notNull(),
  totalPaid: t.integer().notNull(),
  defaultAt: t.bigint(),
}));

export const TinteroLoanRelationships = relations(
  TinteroLoan,
  ({ one, many }) => ({
    vault: one(TinteroVault, {
      fields: [TinteroLoan.vault],
      references: [TinteroVault.id],
    }),
    payments: many(TinteroPayment),
    tranches: many(TinteroTranche),
  })
);

export const TinteroPayment = onchainTable(
  "tintero_payment",
  (t) => ({
    loan: t.hex().notNull(),
    index: t.bigint().notNull(),
    collateralId: t.bigint().notNull(),
    principal: t.bigint().notNull(),
    fundedAt: t.bigint().notNull(),
    maturityPeriod: t.bigint().notNull(),
    gracePeriod: t.bigint().notNull(),
    interestRate: t.bigint().notNull(),
    premiumRate: t.bigint().notNull(),
    trancheIndex: t.bigint(),
    funded: t.boolean().notNull(),
    paid: t.boolean().notNull(),
    withdrawn: t.boolean().notNull(),
    repossessed: t.boolean().notNull(),
    interestPaid: t.bigint().notNull(),
    premiumInterestPaid: t.bigint().notNull(),
    repossessionRecipient: t.hex(),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.loan, t.index] }),
  })
);

export const TinteroPaymentRelationships = relations(
  TinteroPayment,
  ({ one }) => ({
    loan: one(TinteroLoan, {
      fields: [TinteroPayment.loan],
      references: [TinteroLoan.id],
    }),
    tranche: one(TinteroTranche, {
      fields: [TinteroPayment.loan, TinteroPayment.trancheIndex],
      references: [TinteroTranche.loan, TinteroTranche.index],
    }),
  })
);

export const TinteroTranche = onchainTable(
  "tintero_tranche",
  (t) => ({
    loan: t.hex().notNull(),
    index: t.bigint().notNull(),
    paymentIndex: t.bigint().notNull(),
    receiver: t.hex().notNull(),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.loan, t.index] }),
  })
);

export const TinteroTrancheRelationships = relations(
  TinteroTranche,
  ({ one, many }) => ({
    loan: one(TinteroLoan, {
      fields: [TinteroTranche.loan],
      references: [TinteroLoan.id],
    }),
    payments: many(TinteroPayment),
  })
);

// Price feeds

export const MedianMXNUSDRate = onchainTable(
  "median_mxn_usd_rate",
  createMedianRate
);
export const DailyBucketMXNUSDRate = onchainTable(
  "daily_bucket_mxn_usd_rate",
  createBucket
);
export const WeeklyBucketMXNUSDRate = onchainTable(
  "weekly_bucket_mxn_usd_rate",
  createBucket
);
export const MonthlyBucketMXNUSDRate = onchainTable(
  "monthly_bucket_mxn_usd_rate",
  createBucket
);
export const MedianUSDCUSDRate = onchainTable(
  "median_usdc_usd_rate",
  createMedianRate
);
export const DailyBucketUSDCUSDRate = onchainTable(
  "daily_bucket_usdc_usd_rate",
  createBucket
);
export const WeeklyBucketUSDCUSDRate = onchainTable(
  "weekly_bucket_usdc_usd_rate",
  createBucket
);
export const MonthlyBucketUSDCUSDRate = onchainTable(
  "monthly_bucket_usdc_usd_rate",
  createBucket
);
export const MedianUSDCMXNRate = onchainTable(
  "median_usdc_mxn_rate",
  createMedianRate
);
export const DailyBucketUSDCMXNRate = onchainTable(
  "daily_bucket_usdc_mxn_rate",
  createBucket
);
export const WeeklyBucketUSDCMXNRate = onchainTable(
  "weekly_bucket_usdc_mxn_rate",
  createBucket
);
export const MonthlyBucketUSDCMXNRate = onchainTable(
  "monthly_bucket_usdc_mxn_rate",
  createBucket
);
