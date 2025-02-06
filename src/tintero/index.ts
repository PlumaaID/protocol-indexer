import { and, eq, gte, isNull, lt, lte } from "ponder";
import { ponder } from "ponder:registry";
import {
  TinteroLoan,
  TinteroPayment,
  TinteroTranche,
  TinteroVault,
  Wallet,
} from "ponder:schema";

ponder.on("TinteroVaultUSDC:LoanCreated", async ({ event, context }) => {
  await context.db
    .insert(Wallet)
    .values({
      id: event.args.beneficiary,
    })
    .onConflictDoNothing();

  await context.db
    .insert(TinteroVault)
    .values({
      id: event.log.address,
      asset: event.args.collateralCollection,
    })
    .onConflictDoNothing();

  await context.db.insert(TinteroLoan).values({
    id: event.args.loan,
    collateralAsset: event.args.collateralCollection,
    beneficiary: event.args.beneficiary,
    defaultThreshold: event.args.defaultThreshold,
    vault: event.log.address,
    totalFunded: 0,
    totalPaid: 0,
  });
});

ponder.on("TinteroLoanUSDC:PaymentCreated", async ({ event, context }) => {
  await context.db.insert(TinteroPayment).values({
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

  const loan = await context.db.find(TinteroLoan, {
    id: event.log.address,
  });

  if (loan?.defaultThreshold && event.args.index > loan?.defaultThreshold) {
    await context.db
      .update(TinteroLoan, {
        id: event.log.address,
      })
      .set({
        defaultAt:
          event.block.timestamp +
          BigInt(event.args.payment.maturityPeriod) +
          BigInt(event.args.payment.gracePeriod),
      });
  }
});

ponder.on("TinteroLoanUSDC:TrancheCreated", async ({ event, context }) => {
  await context.db.insert(TinteroTranche).values({
    loan: event.log.address,
    index: event.args.index,
    paymentIndex: event.args.paymentIndex,
    receiver: event.args.receiver,
  });

  const payments = await context.db.sql
    .select()
    .from(TinteroPayment)
    .where(
      and(
        // Tranche not assigned
        isNull(TinteroPayment.trancheIndex),
        // Loan matches up to the payment index
        and(
          eq(TinteroPayment.loan, event.log.address),
          lte(TinteroPayment.index, event.args.paymentIndex)
        )
      )
    );

  for (const payment of payments) {
    await context.db
      .update(TinteroPayment, {
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
    .from(TinteroPayment)
    .where(
      and(
        eq(TinteroPayment.loan, event.log.address),
        and(
          gte(TinteroPayment.index, event.args.startIndex),
          lt(TinteroPayment.index, event.args.endIndex)
        )
      )
    );

  for (const payment of payments) {
    await context.db
      .update(TinteroPayment, {
        loan: payment.loan,
        index: payment.index,
      })
      .set({
        funded: true,
      });
  }

  await context.db
    .update(TinteroLoan, {
      id: event.log.address,
    })
    .set((prev) => ({
      totalFunded: prev.totalFunded + payments.length,
    }));
});

ponder.on("TinteroLoanUSDC:PaymentsRepaid", async ({ event, context }) => {
  const payments = await context.db.sql
    .select()
    .from(TinteroPayment)
    .where(
      and(
        eq(TinteroPayment.loan, event.log.address),
        and(
          gte(TinteroPayment.index, event.args.startIndex),
          lt(TinteroPayment.index, event.args.endIndex)
        )
      )
    );

  for (const payment of payments) {
    const maturedAt = payment.fundedAt + payment.maturityPeriod;
    const interest = (elapsed: bigint) =>
      // Math.mulDiv(self.principal * rate, elapsed, YEAR_IN_SECONDS) / INTEREST_SCALE
      (payment.principal * payment.interestRate * elapsed * 31536000n) / 10000n;
    await context.db
      .update(TinteroPayment, {
        loan: payment.loan,
        index: payment.index,
      })
      .set({
        paid: true,
        interestPaid: interest(event.block.timestamp - payment.fundedAt),
        premiumInterestPaid: interest(event.block.timestamp - maturedAt),
      });
  }

  await context.db
    .update(TinteroLoan, {
      id: event.log.address,
    })
    .set((prev) => ({
      totalPaid: prev.totalPaid + payments.length,
    }));

  const loan = await context.db.find(TinteroLoan, {
    id: event.log.address,
  });
  const [newDefaultPayment] = await context.db.sql
    .select()
    .from(TinteroPayment)
    .where(
      and(
        eq(TinteroPayment.loan, event.log.address),
        eq(
          TinteroPayment.index,
          BigInt(payments[payments.length - 1]?.index ?? 0) +
            BigInt(loan?.defaultThreshold ?? 0)
        )
      )
    );
  await context.db
    .update(TinteroLoan, {
      id: event.log.address,
    })
    .set({
      defaultAt: newDefaultPayment
        ? event.block.timestamp +
          newDefaultPayment.maturityPeriod +
          newDefaultPayment.gracePeriod
        : null, // Not enough payments to reach the default threshold
    });
});

ponder.on("TinteroLoanUSDC:PaymentsRepossessed", async ({ event, context }) => {
  const payments = await context.db.sql
    .select()
    .from(TinteroPayment)
    .where(
      and(
        eq(TinteroPayment.loan, event.log.address),
        and(
          gte(TinteroPayment.index, event.args.startIndex),
          lt(TinteroPayment.index, event.args.endIndex)
        )
      )
    );

  for (const payment of payments) {
    await context.db
      .update(TinteroPayment, {
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
    .from(TinteroPayment)
    .where(
      and(
        eq(TinteroPayment.loan, event.log.address),
        and(
          gte(TinteroPayment.index, event.args.startIndex),
          lt(TinteroPayment.index, event.args.endIndex)
        )
      )
    );

  for (const payment of payments) {
    await context.db
      .update(TinteroPayment, {
        loan: payment.loan,
        index: payment.index,
      })
      .set({
        withdrawn: true,
      });
  }
});
