import { and, eq, gte, isNull, lt, lte } from "ponder";
import { ponder } from "ponder:registry";
import {
  tinteroLoans,
  tinteroPayments,
  tinteroTranches,
  tinteroVaults,
  wallets,
} from "ponder:schema";

ponder.on("TinteroVaultUSDC:LoanCreated", async ({ event, context }) => {
  await context.db
    .insert(wallets)
    .values({
      id: event.args.beneficiary,
    })
    .onConflictDoNothing();

  await context.db
    .insert(tinteroVaults)
    .values({
      id: event.log.address,
      asset: event.args.collateralCollection,
    })
    .onConflictDoNothing();

  await context.db.insert(tinteroLoans).values({
    id: event.args.loan,
    collateralAsset: event.args.collateralCollection,
    beneficiary: event.args.beneficiary,
    defaultThreshold: event.args.defaultThreshold,
    vault: event.log.address,
  });
});

ponder.on("TinteroLoanUSDC:PaymentCreated", async ({ event, context }) => {
  await context.db.insert(tinteroPayments).values({
    loan: event.log.address,
    index: event.args.index,
    collateralId: event.args.tokenId,
    principal: event.args.payment.principal,
    fundedAt: BigInt(event.args.payment.fundedAt),
    maturityPeriod: BigInt(event.args.payment.maturityPeriod),
    gracePeriod: BigInt(event.args.payment.gracePeriod),
    interestRate: BigInt(event.args.payment.interestRate),
    premiumRate: BigInt(event.args.payment.premiumRate),
    funded: false,
    paid: false,
    withdrawn: false,
    repossessed: false,
    interestPaid: 0n,
    premiumInterestPaid: 0n,
  });
});

ponder.on("TinteroLoanUSDC:TrancheCreated", async ({ event, context }) => {
  await context.db.insert(tinteroTranches).values({
    loan: event.log.address,
    index: event.args.index,
    paymentIndex: event.args.paymentIndex,
    receiver: event.args.receiver,
  });

  const payments = await context.db.sql
    .select()
    .from(tinteroPayments)
    .where(
      and(
        // Tranche not assigned
        isNull(tinteroPayments.trancheIndex),
        // Loan matches up to the payment index
        and(
          eq(tinteroPayments.loan, event.log.address),
          lte(tinteroPayments.index, event.args.paymentIndex)
        )
      )
    );

  for (const payment of payments) {
    await context.db
      .update(tinteroPayments, {
        loan: payment.loan,
        index: payment.index,
      })
      .set({
        trancheIndex: event.args.index,
      });
  }
});

ponder.on("TinteroLoanUSDC:PaymentsFunded", async ({ event, context }) => {
  const payments = await context.db.sql
    .select()
    .from(tinteroPayments)
    .where(
      and(
        eq(tinteroPayments.loan, event.log.address),
        and(
          gte(tinteroPayments.index, event.args.startIndex),
          lt(tinteroPayments.index, event.args.endIndex)
        )
      )
    );

  for (const payment of payments) {
    await context.db
      .update(tinteroPayments, {
        loan: payment.loan,
        index: payment.index,
      })
      .set({
        funded: true,
      });
  }
});

ponder.on("TinteroLoanUSDC:PaymentsRepaid", async ({ event, context }) => {
  const payments = await context.db.sql
    .select()
    .from(tinteroPayments)
    .where(
      and(
        eq(tinteroPayments.loan, event.log.address),
        and(
          gte(tinteroPayments.index, event.args.startIndex),
          lt(tinteroPayments.index, event.args.endIndex)
        )
      )
    );

  for (const payment of payments) {
    const maturedAt = payment.fundedAt + payment.maturityPeriod;
    const interest = (elapsed: bigint) =>
      // Math.mulDiv(self.principal * rate, elapsed, YEAR_IN_SECONDS) / INTEREST_SCALE
      (payment.principal * payment.interestRate * elapsed * 31536000n) / 10000n;
    await context.db
      .update(tinteroPayments, {
        loan: payment.loan,
        index: payment.index,
      })
      .set({
        paid: true,
        interestPaid: interest(event.block.timestamp - payment.fundedAt),
        premiumInterestPaid: interest(event.block.timestamp - maturedAt),
      });
  }
});

ponder.on("TinteroLoanUSDC:PaymentsRepossessed", async ({ event, context }) => {
  const payments = await context.db.sql
    .select()
    .from(tinteroPayments)
    .where(
      and(
        eq(tinteroPayments.loan, event.log.address),
        and(
          gte(tinteroPayments.index, event.args.startIndex),
          lt(tinteroPayments.index, event.args.endIndex)
        )
      )
    );

  for (const payment of payments) {
    await context.db
      .update(tinteroPayments, {
        loan: payment.loan,
        index: payment.index,
      })
      .set({
        repossessed: true,
        repossessionRecipient: event.args.recipient,
      });
  }
});

ponder.on("TinteroLoanUSDC:PaymentsWithdrawn", async ({ event, context }) => {
  const payments = await context.db.sql
    .select()
    .from(tinteroPayments)
    .where(
      and(
        eq(tinteroPayments.loan, event.log.address),
        and(
          gte(tinteroPayments.index, event.args.startIndex),
          lt(tinteroPayments.index, event.args.endIndex)
        )
      )
    );

  for (const payment of payments) {
    await context.db
      .update(tinteroPayments, {
        loan: payment.loan,
        index: payment.index,
      })
      .set({
        withdrawn: true,
      });
  }
});
