import { db } from "../../models/index";
import { Transaction } from "sequelize";
import { TicketSeat } from "../../models/TicketSeat";
import { it } from "node:test";

export function createTicketSeat(
  ticketId: number,
  seatNumber: string,
  updated: Date,
  transaction: Transaction
) {
  return db.TicketSeat.create(
    {
      ticketId: ticketId,
      seatNumber: seatNumber,
      updated: updated,
    },
    { transaction }
  );
}

export function deleteTicketSeat(seatId: number, transaction: Transaction) {
  return db.TicketSeat.destroy({
    where: {
      id: seatId,
    },
    transaction: transaction,
  });
}

export function findTicketSeatById(seatId: number) {
  return db.TicketSeat.findOne({
    where: {
      id: seatId,
      state: "available",
    },
  });
}
function timeout(ms: number) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  );
}

//find ticketSeat by ticketId and seatNumber for update lock
export async function findTicketSeatForUpdate(
  ticketId: number,
  seatNumbers: string[],
  transaction: Transaction
) {
  try {
    const result = await Promise.race([
      db.TicketSeat.findAll({
        where: {
          ticketId,
          seatNumber: seatNumbers,
          state: "available", // 사용 가능한 좌석만
        },
        lock: transaction.LOCK.UPDATE,
        transaction,
      }),
      timeout(3000),
    ]);
    const ticketSeats = result as TicketSeat[];
    if (!ticketSeats || ticketSeats.length !== seatNumbers.length) {
      throw new Error("Some seats are already reserved or not found");
    }
    // 결제 시스템을 만들 생각은 아직 없음으로 바로 reserved하게 만들어주었다.
    // 만약 결제 시스템을 만들게 된다면, 이 부분은 놔두고 이 함수를 사용하는 함수에 promise race를 걸어 결제되면 reserved로 바꿔주고
    // 결제 실패시 다시 available로 바꿔주는 로직을 추가해야할듯
    const updateResult = await db.TicketSeat.update(
      {
        state: "reserved",
      },
      {
        where: {
          ticketId: ticketId,
          seatNumber: seatNumbers,
          state: "available",
        },
        transaction: transaction,
      }
    );

    if (updateResult[0] !== seatNumbers.length) {
      throw new Error("Failed to reserve all requested seats");
    }
    // ticketSeat.state = "reserved";으로 업데이트 전 값을 return 시킨다
    return ticketSeats.map((it) => it.id);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

export async function findTicketSeatForCancel(
  seatId: number,
  transaction: Transaction
) {
  const ticketSeat = await db.TicketSeat.findOne({
    where: {
      id: seatId,
      state: "reserved",
    },
    lock: transaction.LOCK.UPDATE,
    transaction: transaction,
  }).catch((err) => {
    throw new Error(err instanceof Error ? err.message : String(err));
  });
  if (!ticketSeat) {
    throw new Error("Ticket seat not found or already available");
  }
  await db.TicketSeat.update(
    {
      state: "available",
    },
    {
      where: {
        id: ticketSeat.id,
        state: "reserved",
      },
      transaction: transaction,
    }
  ).catch((err) => {
    throw new Error(err instanceof Error ? err.message : String(err));
  });
  return ticketSeat;
}
