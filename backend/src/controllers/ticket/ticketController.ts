import { Request, Response } from "express";
import {
  db,
  TicketReq,
  SeatRowRequestBody,
  TicketBody,
} from "../../models/index";
import { errConfig } from "../../config/err.config";
import { seq } from "../../models/db.config";
import { createTicketSeat } from "../ticketSeat/ticketSeatFunction";
const Ticket = db.Ticket;

export async function createTicket(req: Request, res: Response) {
  const transaction = await db.sequelize.transaction();
  try {
    const body = req.body as SeatRowRequestBody & TicketReq;
    const ticket: TicketBody = {
      //안정성은 authToken에서 보장해줌줌
      userId: (req as any).user?.id,
      name: body.name,
      context: body.context,
      image: req.file?.buffer,
      startDate: body.startDate,
      endDate: body.endDate,
    };
    const createdTicket = await Ticket.create(ticket, { transaction }).catch(
      (err) => {
        throw new Error(err);
      }
    );
    const seatRows =
      typeof body.seatRows === "string"
        ? JSON.parse(body.seatRows)
        : body.seatRows;
    for (const seat of seatRows) {
      for (let i = 0; i < parseInt(seat.seats); i++) {
        await createTicketSeat(
          createdTicket.id,
          seat.row + i,
          new Date(),
          transaction
        ).catch((err) => {
          throw new Error(err);
        });
      }
    }
    await transaction.commit();
    return res.send("success");
  } catch (err) {
    await transaction.rollback();
    return errConfig(res, err, "this error occured while createTicket");
  }
}

export async function deleteTicket(req: Request, res: Response) {
  const transaction = await db.sequelize.transaction();
  try {
    const ticketId = req.params.ticketId;
    const ticket = await Ticket.findOne({
      where: {
        id: ticketId,
      },
      lock: transaction.LOCK.UPDATE,
      transaction: transaction,
    });
    if (!ticket) throw new Error("Ticket not found");
    Ticket.destroy({
      where: {
        id: ticketId,
        userId: (req as any).user?.id,
      },
      transaction: transaction,
    });
    await transaction.commit();
    return res.send("success");
  } catch (err) {
    await transaction.rollback();
    return errConfig(res, err, "this error occured while deleteTicket");
  }
}

export function getTicket(req: Request, res: Response) {
  const ticketId = req.params.ticketId;
  Ticket.findOne({
    where: {
      id: ticketId,
    },
  })
    .then((data) => {
      if (data) {
        return res.send(data.dataValues);
      } else {
        return res.send("Ticket not found");
      }
    })
    .catch((err) => {
      return errConfig(res, err, "this error occured while getTicket");
    });
}

export function pageNationg(req: Request, res: Response) {
  try {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    const offset = (page - 1) * limit;
    const searchQuery = req.body.searchQuery;
    if (searchQuery == " " || searchQuery == undefined) {
      Ticket.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [["created", "DESC"]],
        where: {
          endDate: {
            [seq.Op.gte]: new Date(),
          },
        },
      })
        .then((data) => {
          if (data.count == 0) {
            return res.send("Ticket not found");
          }
          data.rows.map((row) => {
            row.dataValues;
          });
          return res.send(data);
        })
        .catch((err) => {
          return errConfig(res, err, "this error occured while getTicket");
        });
    } else {
      Ticket.findAndCountAll({
        where: {
          [seq.Op.and]: [
            seq.Sequelize.literal(
              `MATCH(name, content) AGAINST('${searchQuery}' WITH QUERY EXPANSION)`
            ),
            {
              endDate: {
                [seq.Op.gte]: new Date(),
              },
            },
          ],
        },
        //여기서 with query expansion으로 어느정도의 자연어 처리를 해주지만 허점이 많음음
        limit: limit,
        offset: offset,
        order: [["created", "DESC"]],
      })
        .then((data) => {
          if (data.count == 0) {
            return res.send("Ticket not found");
          }
          data.rows.map((row) => {
            row.dataValues;
          });
          return res.send(data);
        })
        .catch((err) => {
          return errConfig(res, err, "this error occured while getTicket");
        });
    }
  } catch (err) {
    return errConfig(res, err, "this error occured while pageNationg");
  }
}
