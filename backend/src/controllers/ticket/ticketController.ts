import { Request, Response } from "express";
import { db, TicketReq } from "../../models";
import { errConfig } from "../../config/err.config";
const Ticket = db.Ticket;

export async function createTicket(req: Request, res: Response) {
  try {
    const ticket: TicketReq = {
      userId: req.body.id,
      name: req.body.name,
      context: req.body.context,
      image: req.file?.buffer,
    };
    await Ticket.create(ticket).catch((err) => {
      throw new Error(err);
    });
    res.send("success");
  } catch (err) {
    return errConfig(res, err, "code_board create");
  }
}
