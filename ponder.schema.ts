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

export const endorsable = onchainTable("endorsable", (t) => ({
  id: t.bigint().primaryKey().notNull(),
  ownerId: t.hex().notNull(),
  timestamp: t.integer().notNull(),
  network: t.integer().notNull(),
}));

export const endorsableRelationships = relations(
  endorsable,
  ({ one, many }) => ({
    owner: one(wallet, {
      fields: [endorsable.ownerId],
      references: [wallet.id],
    }),
    endorseEvents: many(endorseEvent),
  })
);

export const endorseEvent = onchainTable("endorse_event", (t) => ({
  id: t.text().primaryKey().notNull(),
  timestamp: t.integer().notNull(),
  fromId: t.hex().notNull(),
  toId: t.hex().notNull(),
  digest: t.bigint().notNull(),
  network: t.integer().notNull(),
}));

export const endorseEventRelationships = relations(endorseEvent, ({ one }) => ({
  from: one(wallet, {
    fields: [endorseEvent.fromId],
    references: [wallet.id],
  }),
  to: one(wallet, {
    fields: [endorseEvent.toId],
    references: [wallet.id],
  }),
  token: one(endorsable, {
    fields: [endorseEvent.digest],
    references: [endorsable.id],
  }),
}));

export const wallet = onchainTable("wallet", (t) => ({
  id: t.hex().primaryKey(),
}));

export const walletRelationships = relations(wallet, ({ many }) => ({
  endorsables: many(endorsable),
  endorseFromEvents: many(endorseEvent),
  endorseToEvents: many(endorseEvent),
}));

export const tinteroVault = onchainTable("tintero_vault", (t) => ({
  id: t.hex().primaryKey().notNull(),
  asset: t.hex().notNull(),
}));

export const tinteroVaultRelationships = relations(
  tinteroVault,
  ({ many }) => ({
    loans: many(tinteroLoan),
  })
);

export const tinteroLoan = onchainTable("tintero_loan", (t) => ({
  id: t.hex().primaryKey().notNull(),
  collateralAsset: t.hex().notNull(),
  beneficiary: t.hex().notNull(),
  defaultThreshold: t.integer().notNull(),
  vault: t.hex().notNull(),
  totalFunded: t.integer().notNull(),
  totalPaid: t.integer().notNull(),
  defaultAt: t.bigint(),
}));

export const tinteroLoanRelationships = relations(
  tinteroLoan,
  ({ one, many }) => ({
    vault: one(tinteroVault, {
      fields: [tinteroLoan.vault],
      references: [tinteroVault.id],
    }),
    payments: many(tinteroPayment),
  })
);

export const tinteroPayment = onchainTable(
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
  tinteroPayment,
  ({ one }) => ({
    loan: one(tinteroLoan, {
      fields: [tinteroPayment.loan],
      references: [tinteroLoan.id],
    }),
    tranche: one(tinteroTranche, {
      fields: [tinteroPayment.loan, tinteroPayment.trancheIndex],
      references: [tinteroTranche.loan, tinteroTranche.index],
    }),
  })
);

export const tinteroTranche = onchainTable(
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
  tinteroTranche,
  ({ one, many }) => ({
    loan: one(tinteroLoan, {
      fields: [tinteroTranche.loan],
      references: [tinteroLoan.id],
    }),
    payments: many(tinteroPayment),
  })
);

// Price feeds

export const medianMXNUSDRate = onchainTable(
  "median_mxn_usd_rate",
  createMedianRate
);
export const dailyBucketMXNUSDRate = onchainTable(
  "daily_bucket_mxn_usd_rate",
  createBucket
);
export const weeklyBucketMXNUSDRate = onchainTable(
  "weekly_bucket_mxn_usd_rate",
  createBucket
);
export const monthlyBucketMXNUSDRate = onchainTable(
  "monthly_bucket_mxn_usd_rate",
  createBucket
);
export const medianUSDCUSDRate = onchainTable(
  "median_usdc_usd_rate",
  createMedianRate
);
export const dailyBucketUSDCUSDRate = onchainTable(
  "daily_bucket_usdc_usd_rate",
  createBucket
);
export const weeklyBucketUSDCUSDRate = onchainTable(
  "weekly_bucket_usdc_usd_rate",
  createBucket
);
export const monthlyBucketUSDCUSDRate = onchainTable(
  "monthly_bucket_usdc_usd_rate",
  createBucket
);
export const medianUSDCMXNRate = onchainTable(
  "median_usdc_mxn_rate",
  createMedianRate
);
export const dailyBucketUSDCMXNRate = onchainTable(
  "daily_bucket_usdc_mxn_rate",
  createBucket
);
export const weeklyBucketUSDCMXNRate = onchainTable(
  "weekly_bucket_usdc_mxn_rate",
  createBucket
);
export const monthlyBucketUSDCMXNRate = onchainTable(
  "monthly_bucket_usdc_mxn_rate",
  createBucket
);
