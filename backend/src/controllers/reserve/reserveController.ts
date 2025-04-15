import { Request, Response } from "express";
import { db } from "../../models/index";
import { errConfig } from "../../config/err.config";
import {
  findTicketSeatForUpdate,
  findTicketSeatForCancel,
} from "../ticketSeat/ticketSeatFunction";
import { getQueueRank } from "../../utils/redis/redisUtils";
export async function reserveTicket(req: Request, res: Response) {
  const transaction = await db.sequelize.transaction();
  try {
    const ticketId = req.params.ticketId;
    const seatNumber = req.body.seatNumber;
    const userId = (req as any).user?.id.toString();
    console.log(typeof ticketId, typeof userId);
    const rank = await getQueueRank(ticketId, userId);

    if (rank == null || rank >= 10) {
      return res
        .status(403)
        .json({ allowed: false, message: "Still in queue" });
    }
    const ticketSeat = await findTicketSeatForUpdate(
      parseInt(ticketId),
      seatNumber,
      transaction
    );
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
    return res
      .status(200)
      .json({ success: true, message: "Reservation completed" });
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
      errConfig(res, null, "this reserveId is not exist");
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
    return res.send("success");
  } catch (err) {
    await transaction.rollback();
    return errConfig(
      res,
      err,
      "this error occurred while cancelling the reserve"
    );
  }
}

export async function getReserveList(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const reserves = await db.Reserve.findAll({
      where: {
        userId: userId,
        state: "completed",
      },
      include: [
        {
          model: db.TicketSeat,
          attributes: ["seatNumber", "updated"],
          include: [
            {
              model: db.Ticket,
              attributes: [
                "name",
                "startDate",
                "endDate",
                "image",
                "price",
                "when",
              ],
            },
          ],
        },
      ],
    });
    return res.send(reserves.map((reserve) => reserve.dataValues));
  } catch (err) {
    return errConfig(
      res,
      err,
      "this error occurred while getting reserve list"
    );
  }
}
