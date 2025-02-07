import { ponder } from "ponder:registry";
import {
  AccessManager,
  AccessManagerMember,
  AccessManagerOperation,
  AccessManagerRole,
  AccessManagerTarget,
  AccessManagerTargetFunction,
} from "ponder:schema";

enum AccessManagerOperationStatus {
  SCHEDULED,
  EXECUTED,
  CANCELED,
}

const ADMIN_ROLE = 0n;

ponder.on("AccessManager:OperationScheduled", async ({ event, context }) => {
  await context.db
    .insert(AccessManagerOperation)
    .values({
      id: event.args.operationId,
      nonce: event.args.nonce,
      schedule: event.args.schedule,
      caller: event.args.caller,
      targetId: event.args.target,
      data: event.args.data,
      status: AccessManagerOperationStatus.SCHEDULED,
      managerId: event.log.address,
    })
    .onConflictDoNothing(); // There should be no duplicates
});

ponder.on("AccessManager:OperationCanceled", async ({ event, context }) => {
  await context.db
    .update(AccessManagerOperation, {
      id: event.args.operationId,
      managerId: event.log.address,
    })
    .set({
      status: AccessManagerOperationStatus.CANCELED,
    });
});

ponder.on("AccessManager:OperationExecuted", async ({ event, context }) => {
  await context.db
    .update(AccessManagerOperation, {
      id: event.args.operationId,
      managerId: event.log.address,
    })
    .set({
      status: AccessManagerOperationStatus.EXECUTED,
    });
});

ponder.on("AccessManager:RoleGranted", async ({ event, context }) => {
  await context.db
    .insert(AccessManager)
    .values({
      id: event.log.address,
    })
    .onConflictDoNothing();

  await context.db
    .insert(AccessManagerRole)
    .values({
      id: event.args.roleId,
      managerId: event.log.address,
      adminId: ADMIN_ROLE,
      guardianId: ADMIN_ROLE,
      grantDelay: 0,
      grantDelayEffectDate: BigInt(0),
    })
    .onConflictDoNothing();

  await context.db
    .insert(AccessManagerMember)
    .values({
      id: event.args.account,
      managerId: event.log.address,
      roleId: event.args.roleId,
      since: event.args.since,
      executionDelay: event.args.delay,
      executionDelayEffectDate:
        event.block.timestamp + BigInt(event.args.delay),
    })
    .onConflictDoUpdate((prev) => ({
      ...prev,
      since: event.args.since,
      oldExecutionDelay: prev.executionDelay,
      executionDelay: event.args.delay,
      executionDelayEffectDate:
        event.block.timestamp + BigInt(event.args.delay),
    }));
});

ponder.on("AccessManager:RoleRevoked", async ({ event, context }) => {
  await context.db
    .insert(AccessManager)
    .values({
      id: event.log.address,
    })
    .onConflictDoNothing();

  await context.db
    .insert(AccessManagerRole)
    .values({
      id: event.args.roleId,
      managerId: event.log.address,
      adminId: ADMIN_ROLE,
      guardianId: ADMIN_ROLE,
      grantDelay: 0,
      grantDelayEffectDate: BigInt(0),
    })
    .onConflictDoNothing();

  await context.db.delete(AccessManagerMember, {
    id: event.args.account,
    managerId: event.log.address,
    roleId: event.args.roleId,
  });
});

ponder.on("AccessManager:RoleAdminChanged", async ({ event, context }) => {
  await context.db
    .insert(AccessManager)
    .values({
      id: event.log.address,
    })
    .onConflictDoNothing();

  await context.db
    .insert(AccessManagerRole)
    .values({
      id: event.args.roleId,
      managerId: event.log.address,
      adminId: ADMIN_ROLE,
      guardianId: ADMIN_ROLE,
      grantDelay: 0,
      grantDelayEffectDate: BigInt(0),
    })
    .onConflictDoNothing();

  await context.db
    .insert(AccessManagerRole)
    .values({
      id: event.args.admin,
      managerId: event.log.address,
      adminId: ADMIN_ROLE,
      guardianId: ADMIN_ROLE,
      grantDelay: 0,
      grantDelayEffectDate: BigInt(0),
    })
    .onConflictDoNothing();

  await context.db
    .insert(AccessManagerRole)
    .values({
      id: event.args.roleId,
      managerId: event.log.address,
      adminId: event.args.admin,
      guardianId: ADMIN_ROLE,
      grantDelay: 0,
      grantDelayEffectDate: BigInt(0),
    })
    .onConflictDoUpdate({
      adminId: event.args.admin,
    });
});

ponder.on("AccessManager:RoleGuardianChanged", async ({ event, context }) => {
  await context.db
    .insert(AccessManager)
    .values({
      id: event.log.address,
    })
    .onConflictDoNothing();

  await context.db
    .insert(AccessManagerRole)
    .values({
      id: event.args.roleId,
      managerId: event.log.address,
      adminId: ADMIN_ROLE,
      guardianId: ADMIN_ROLE,
      grantDelay: 0,
      grantDelayEffectDate: BigInt(0),
    })
    .onConflictDoNothing();

  await context.db.insert(AccessManagerRole).values({
    id: event.args.guardian,
    managerId: event.log.address,
    adminId: ADMIN_ROLE,
    guardianId: ADMIN_ROLE,
    grantDelay: 0,
    grantDelayEffectDate: BigInt(0),
  });

  await context.db
    .insert(AccessManagerRole)
    .values({
      id: event.args.roleId,
      managerId: event.log.address,
      adminId: ADMIN_ROLE,
      guardianId: event.args.guardian,
      grantDelay: 0,
      grantDelayEffectDate: BigInt(0),
    })
    .onConflictDoUpdate({
      guardianId: event.args.guardian,
    });
});

ponder.on("AccessManager:RoleGrantDelayChanged", async ({ event, context }) => {
  await context.db
    .insert(AccessManagerRole)
    .values({
      id: event.args.roleId,
      managerId: event.log.address,
      adminId: ADMIN_ROLE,
      guardianId: ADMIN_ROLE,
      grantDelay: 0,
      grantDelayEffectDate: BigInt(0),
    })
    .onConflictDoUpdate((prev) => ({
      oldGrantDelay: prev.grantDelay,
      grantDelay: event.args.delay,
      grantDelayEffectDate: event.block.timestamp + BigInt(event.args.delay),
    }));
});

ponder.on("AccessManager:RoleLabel", async ({ event, context }) => {
  await context.db
    .insert(AccessManagerRole)
    .values({
      id: event.args.roleId,
      managerId: event.log.address,
      adminId: ADMIN_ROLE,
      guardianId: ADMIN_ROLE,
      grantDelay: 0,
      grantDelayEffectDate: BigInt(0),
      label: event.args.label,
    })
    .onConflictDoUpdate({
      label: event.args.label,
    });
});

ponder.on(
  "AccessManager:TargetAdminDelayUpdated",
  async ({ event, context }) => {
    await context.db
      .insert(AccessManager)
      .values({
        id: event.log.address,
      })
      .onConflictDoNothing();

    await context.db
      .insert(AccessManagerRole)
      .values({
        id: ADMIN_ROLE,
        managerId: event.log.address,
        adminId: ADMIN_ROLE,
        guardianId: ADMIN_ROLE,
        grantDelay: 0,
        grantDelayEffectDate: BigInt(0),
      })
      .onConflictDoNothing();

    await context.db
      .insert(AccessManagerTarget)
      .values({
        id: event.args.target,
        managerId: event.log.address,
        adminDelay: event.args.delay,
        adminDelayEffectDate: event.block.timestamp + BigInt(event.args.delay),
        closed: false,
      })
      .onConflictDoUpdate((prev) => ({
        oldAdminDelay: prev.adminDelay,
        adminDelay: event.args.delay,
        adminDelayEffectDate: event.block.timestamp + BigInt(event.args.delay),
      }));
  }
);

ponder.on("AccessManager:TargetClosed", async ({ event, context }) => {
  await context.db
    .insert(AccessManager)
    .values({
      id: event.log.address,
    })
    .onConflictDoNothing();

  await context.db
    .insert(AccessManagerRole)
    .values({
      id: ADMIN_ROLE,
      managerId: event.log.address,
      adminId: ADMIN_ROLE,
      guardianId: ADMIN_ROLE,
      grantDelay: 0,
      grantDelayEffectDate: BigInt(0),
    })
    .onConflictDoNothing();

  await context.db
    .insert(AccessManagerTarget)
    .values({
      id: event.args.target,
      managerId: event.log.address,
      adminDelay: 0,
      adminDelayEffectDate: BigInt(0),
      closed: true,
    })
    .onConflictDoUpdate({
      closed: true,
    });
});

ponder.on(
  "AccessManager:TargetFunctionRoleUpdated",
  async ({ event, context }) => {
    await context.db
      .insert(AccessManager)
      .values({
        id: event.log.address,
      })
      .onConflictDoNothing();

    await context.db
      .insert(AccessManagerTarget)
      .values({
        id: event.args.target,
        managerId: event.log.address,
        adminDelay: 0,
        adminDelayEffectDate: BigInt(0),
        closed: false,
      })
      .onConflictDoNothing();

    await context.db
      .insert(AccessManagerRole)
      .values({
        id: event.args.roleId,
        managerId: event.log.address,
        adminId: ADMIN_ROLE,
        guardianId: ADMIN_ROLE,
        grantDelay: 0,
        grantDelayEffectDate: BigInt(0),
      })
      .onConflictDoNothing();

    await context.db
      .insert(AccessManagerTargetFunction)
      .values({
        id: event.args.selector,
        managerId: event.log.address,
        targetId: event.args.target,
        roleId: event.args.roleId,
      })
      .onConflictDoUpdate({
        roleId: event.args.roleId,
      });
  }
);
