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

export const AccessManager = onchainTable("access_manager", (t) => ({
  id: t.hex().primaryKey().notNull(),
}));

export const AccessManagerRelationships = relations(
  AccessManager,
  ({ many }) => ({
    targets: many(AccessManagerTarget),
    roles: many(AccessManagerRole),
    members: many(AccessManagerMember),
    operations: many(AccessManagerOperation),
  })
);

export const AccessManagerTarget = onchainTable(
  "access_manager_target",
  (t) => ({
    id: t.hex().notNull(),
    managerId: t.hex().notNull(),
    oldAdminDelay: t.integer(),
    adminDelay: t.integer().notNull(),
    adminDelayEffectDate: t.bigint().notNull(),
    closed: t.boolean().notNull(),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.id, t.managerId] }),
  })
);

export const AccessManagerTargetRelationships = relations(
  AccessManagerTarget,
  ({ one, many }) => ({
    manager: one(AccessManager, {
      fields: [AccessManagerTarget.managerId],
      references: [AccessManager.id],
    }),
    functions: many(AccessManagerTargetFunction),
    operations: many(AccessManagerOperation),
  })
);

export const AccessManagerRole = onchainTable(
  "access_manager_role",
  (t) => ({
    id: t.bigint().notNull(),
    managerId: t.hex().notNull(),
    adminId: t.bigint().notNull(),
    guardianId: t.bigint().notNull(),
    label: t.text(),
    oldGrantDelay: t.integer(),
    grantDelay: t.integer().notNull(),
    grantDelayEffectDate: t.bigint().notNull(),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.id, t.managerId] }),
  })
);

export const AccessManagerRoleRelationships = relations(
  AccessManagerRole,
  ({ one, many }) => ({
    manager: one(AccessManager, {
      fields: [AccessManagerRole.managerId],
      references: [AccessManager.id],
    }),
    admin: one(AccessManagerRole, {
      fields: [AccessManagerRole.adminId, AccessManagerRole.managerId],
      references: [AccessManagerRole.id, AccessManagerRole.managerId],
    }),
    guardian: one(AccessManagerRole, {
      fields: [AccessManagerRole.guardianId, AccessManagerRole.managerId],
      references: [AccessManagerRole.id, AccessManagerRole.managerId],
    }),
    adminOf: many(AccessManagerRole),
    guardianOf: many(AccessManagerRole),
    members: many(AccessManagerMember),
    functions: many(AccessManagerTargetFunction),
  })
);

export const AccessManagerMember = onchainTable(
  "access_manager_member",
  (t) => ({
    id: t.hex().notNull(),
    managerId: t.hex().notNull(),
    roleId: t.bigint().notNull(),
    since: t.integer().notNull(),
    oldExecutionDelay: t.integer(),
    executionDelay: t.integer().notNull(),
    executionDelayEffectDate: t.bigint().notNull(),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.id, t.managerId, t.roleId] }),
  })
);

export const AccessManagerMemberRelationships = relations(
  AccessManagerMember,
  ({ one }) => ({
    role: one(AccessManagerRole, {
      fields: [AccessManagerMember.roleId, AccessManagerMember.managerId],
      references: [AccessManagerRole.id, AccessManagerRole.managerId],
    }),
    manager: one(AccessManager, {
      fields: [AccessManagerMember.managerId],
      references: [AccessManager.id],
    }),
  })
);

export const AccessManagerOperation = onchainTable(
  "access_manager_operation",
  (t) => ({
    id: t.hex().notNull(),
    nonce: t.integer().notNull(),
    schedule: t.integer().notNull(),
    caller: t.hex().notNull(),
    targetId: t.hex().notNull(),
    data: t.hex().notNull(),
    status: t.integer().notNull(),
    managerId: t.hex().notNull(),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.id, t.managerId] }),
  })
);

export const AccessManagerOperationRelationships = relations(
  AccessManagerOperation,
  ({ one }) => ({
    manager: one(AccessManager, {
      fields: [AccessManagerOperation.managerId],
      references: [AccessManager.id],
    }),
    target: one(AccessManagerTarget, {
      fields: [AccessManagerOperation.targetId],
      references: [AccessManagerTarget.id],
    }),
  })
);

export const AccessManagerTargetFunction = onchainTable(
  "access_manager_target_function",
  (t) => ({
    id: t.hex().notNull(),
    managerId: t.hex().notNull(),
    targetId: t.hex().notNull(),
    roleId: t.bigint().notNull(),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.id, t.targetId] }),
  })
);

export const AccessManagerTargetFunctionRelationships = relations(
  AccessManagerTargetFunction,
  ({ one }) => ({
    target: one(AccessManagerTarget, {
      fields: [AccessManagerTargetFunction.targetId],
      references: [AccessManagerTarget.id],
    }),
    role: one(AccessManagerRole, {
      fields: [AccessManagerTargetFunction.roleId],
      references: [AccessManagerRole.id],
    }),
  })
);

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
