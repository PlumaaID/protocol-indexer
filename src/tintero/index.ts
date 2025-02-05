import { and, eq, gte, isNull, lt, lte } from "ponder";
import { ponder } from "ponder:registry";
import {
  tinteroLoan,
  tinteroPayment,
  tinteroTranche,
  tinteroVault,
  wallet,
} from "ponder:schema";

ponder.on("TinteroVaultUSDC:LoanCreated", async ({ event, context }) => {
  await context.db
    .insert(wallet)
    .values({
      id: event.args.beneficiary,
    })
    .onConflictDoNothing();

  await context.db
    .insert(tinteroVault)
    .values({
      id: event.log.address,
      asset: event.args.collateralCollection,
    })
    .onConflictDoNothing();

  await context.db.insert(tinteroLoan).values({
    id: event.args.loan,
    collateralAsset: event.args.collateralCollection,
    beneficiary: event.args.beneficiary,
    defaultThreshold: event.args.defaultThreshold,
    vault: event.log.address,
  });
});

ponder.on("TinteroLoanUSDC:PaymentCreated", async ({ event, context }) => {
  await context.db.insert(tinteroPayment).values({
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
  await context.db.insert(tinteroTranche).values({
    loan: event.log.address,
    index: event.args.index,
    paymentIndex: event.args.paymentIndex,
    receiver: event.args.receiver,
  });

  const payments = await context.db.sql
    .select()
    .from(tinteroPayment)
    .where(
      and(
        // Tranche not assigned
        isNull(tinteroPayment.trancheIndex),
        // Loan matches up to the payment index
        and(
          eq(tinteroPayment.loan, event.log.address),
          lte(tinteroPayment.index, event.args.paymentIndex)
        )
      )
    );

  for (const payment of payments) {
    await context.db
      .update(tinteroPayment, {
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
    .from(tinteroPayment)
    .where(
      and(
        eq(tinteroPayment.loan, event.log.address),
        and(
          gte(tinteroPayment.index, event.args.startIndex),
          lt(tinteroPayment.index, event.args.endIndex)
        )
      )
    );

  for (const payment of payments) {
    await context.db
      .update(tinteroPayment, {
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
    .from(tinteroPayment)
    .where(
      and(
        eq(tinteroPayment.loan, event.log.address),
        and(
          gte(tinteroPayment.index, event.args.startIndex),
          lt(tinteroPayment.index, event.args.endIndex)
        )
      )
    );

  for (const payment of payments) {
    const maturedAt = payment.fundedAt + payment.maturityPeriod;
    const interest = (elapsed: bigint) =>
      // Math.mulDiv(self.principal * rate, elapsed, YEAR_IN_SECONDS) / INTEREST_SCALE
      (payment.principal * payment.interestRate * elapsed * 31536000n) / 10000n;
    await context.db
      .update(tinteroPayment, {
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
    .from(tinteroPayment)
    .where(
      and(
        eq(tinteroPayment.loan, event.log.address),
        and(
          gte(tinteroPayment.index, event.args.startIndex),
          lt(tinteroPayment.index, event.args.endIndex)
        )
      )
    );

  for (const payment of payments) {
    await context.db
      .update(tinteroPayment, {
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
    .from(tinteroPayment)
    .where(
      and(
        eq(tinteroPayment.loan, event.log.address),
        and(
          gte(tinteroPayment.index, event.args.startIndex),
          lt(tinteroPayment.index, event.args.endIndex)
        )
      )
    );

  for (const payment of payments) {
    await context.db
      .update(tinteroPayment, {
        loan: payment.loan,
        index: payment.index,
      })
      .set({
        withdrawn: true,
      });
  }
});
