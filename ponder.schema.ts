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

export const endorsables = onchainTable("endorsable", (t) => ({
  id: t.bigint().primaryKey().notNull(),
  ownerId: t.hex().notNull(),
  timestamp: t.integer().notNull(),
  network: t.integer().notNull(),
}));

export const endorsableRelationships = relations(
  endorsables,
  ({ one, many }) => ({
    owner: one(wallets, {
      fields: [endorsables.ownerId],
      references: [wallets.id],
    }),
    endorseEvents: many(endorseEvents),
  })
);

export const endorseEvents = onchainTable("endorse_event", (t) => ({
  id: t.text().primaryKey().notNull(),
  timestamp: t.integer().notNull(),
  fromId: t.hex().notNull(),
  toId: t.hex().notNull(),
  digest: t.bigint().notNull(),
  network: t.integer().notNull(),
}));

export const endorseEventRelationships = relations(
  endorseEvents,
  ({ one }) => ({
    from: one(wallets, {
      fields: [endorseEvents.fromId],
      references: [wallets.id],
    }),
    to: one(wallets, {
      fields: [endorseEvents.toId],
      references: [wallets.id],
    }),
    token: one(endorsables, {
      fields: [endorseEvents.digest],
      references: [endorsables.id],
    }),
  })
);

export const wallets = onchainTable("wallet", (t) => ({
  id: t.hex().primaryKey(),
}));

export const walletRelationships = relations(wallets, ({ many }) => ({
  endorsables: many(endorsables),
  endorseFromEvents: many(endorseEvents),
  endorseToEvents: many(endorseEvents),
}));

export const tinteroVaults = onchainTable("tintero_vault", (t) => ({
  id: t.hex().primaryKey().notNull(),
  asset: t.hex().notNull(),
}));

export const tinteroVaultRelationships = relations(
  tinteroVaults,
  ({ many }) => ({
    loans: many(tinteroLoans),
  })
);

export const tinteroLoans = onchainTable("tintero_loan", (t) => ({
  id: t.hex().primaryKey().notNull(),
  collateralAsset: t.hex().notNull(),
  beneficiary: t.hex().notNull(),
  defaultThreshold: t.integer().notNull(),
  vault: t.hex().notNull(),
}));

export const tinteroLoanRelationships = relations(
  tinteroLoans,
  ({ one, many }) => ({
    vault: one(tinteroVaults, {
      fields: [tinteroLoans.vault],
      references: [tinteroVaults.id],
    }),
    payments: many(tinteroPayments),
  })
);

export const tinteroPayments = onchainTable(
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

export const tinteroPaymentRelationships = relations(
  tinteroPayments,
  ({ one }) => ({
    loan: one(tinteroLoans, {
      fields: [tinteroPayments.loan],
      references: [tinteroLoans.id],
    }),
    tranche: one(tinteroTranches, {
      fields: [tinteroPayments.loan, tinteroPayments.trancheIndex],
      references: [tinteroTranches.loan, tinteroTranches.index],
    }),
  })
);

export const tinteroTranches = onchainTable(
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

export const tinteroTrancheRelationships = relations(
  tinteroTranches,
  ({ one, many }) => ({
    loan: one(tinteroLoans, {
      fields: [tinteroTranches.loan],
      references: [tinteroLoans.id],
    }),
    payment: many(tinteroPayments),
  })
);

// Price feeds

export const medianMXNUSDRates = onchainTable(
  "median_mxn_usd_rate",
  createMedianRate
);
export const dailyBucketMXNUSDRates = onchainTable(
  "daily_bucket_mxn_usd_rate",
  createBucket
);
export const weeklyBucketMXNUSDRates = onchainTable(
  "weekly_bucket_mxn_usd_rate",
  createBucket
);
export const monthlyBucketMXNUSDRates = onchainTable(
  "monthly_bucket_mxn_usd_rate",
  createBucket
);
export const medianUSDCUSDRates = onchainTable(
  "median_usdc_usd_rate",
  createMedianRate
);
export const dailyBucketUSDCUSDRates = onchainTable(
  "daily_bucket_usdc_usd_rate",
  createBucket
);
export const weeklyBucketUSDCUSDRates = onchainTable(
  "weekly_bucket_usdc_usd_rate",
  createBucket
);
export const monthlyBucketUSDCUSDRates = onchainTable(
  "monthly_bucket_usdc_usd_rate",
  createBucket
);
export const medianUSDCMXNRates = onchainTable(
  "median_usdc_mxn_rate",
  createMedianRate
);
export const dailyBucketUSDCMXNRates = onchainTable(
  "daily_bucket_usdc_mxn_rate",
  createBucket
);
export const weeklyBucketUSDCMXNRates = onchainTable(
  "weekly_bucket_usdc_mxn_rate",
  createBucket
);
export const monthlyBucketUSDCMXNRates = onchainTable(
  "monthly_bucket_usdc_mxn_rate",
  createBucket
);
