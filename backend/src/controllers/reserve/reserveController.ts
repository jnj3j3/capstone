import { Request, Response } from "express";
import { db } from "../../models/index";
import { errConfig } from "../../config/err.config";
import {
  findTicketSeatForUpdate,
  findTicketSeatForCancel,
} from "../ticketSeat/ticketSeatFunction";
export async function reserveTicket(req: Request, res: Response) {
  const transaction = await db.sequelize.transaction();
  try {
    const ticketId = parseInt(req.params.ticketId);
    const seatNumber = req.body.seatNumber;
    const userId = (req as any).user?.id;
    const ticketSeat = await findTicketSeatForUpdate(
      ticketId,
      seatNumber,
      transaction
    ).catch((err) => {
      throw new Error(err);
    });
    // 결제시스템이 없음으로 reserve의 state를 바로 reserved로 바꿔주었다.
    // 이후 결제 시스템을 넣고 싶으면 reserve테이블에서 state의 deafult값을 pending으로 두고
    // 결제시스템에서 결제가 완료되면 reserved로 바꿔주는 로직을 추가해야할듯
    const reserve = await db.Reserve.create(
      {
        userId: userId,
        seatId: ticketSeat.id,
      },
      { transaction }
    );
    await transaction.commit();
    res.send("success");
  } catch (err) {
    await transaction.rollback();
    return errConfig(
      res,
      err,
      "this error occurred while reserving the ticket"
    );
  }
}

export async function cancelReserve(req: Request, res: Response) {
  const transaction = await db.sequelize.transaction();
  try {
    const reserveId = parseInt(req.params.reserveId);
    const userId = (req as any).user?.id;
    const reserve = await db.Reserve.findOne({
      where: {
        id: reserveId,
        userId: userId,
        state: "completed",
      },
      lock: transaction.LOCK.UPDATE,
      transaction: transaction,
    });
    if (!reserve) {
      return errConfig(res, null, "this reserveId is not exist");
    }
    await findTicketSeatForCancel(reserve.seatId, transaction).catch((err) => {
      throw new Error(err);
    });
    await db.Reserve.update(
      {
        state: "canceled",
        updated: new Date(),
      },
      {
        where: {
          id: reserve.id,
        },
        transaction: transaction,
      }
    );
    await transaction.commit();
    res.send("success");
  } catch (err) {
    await transaction.rollback();
    return errConfig(
      res,
      err,
      "this error occurred while cancelling the reserve"
    );
  }
}
