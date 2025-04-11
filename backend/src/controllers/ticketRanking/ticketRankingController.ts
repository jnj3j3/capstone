import { Request, Response } from "express";
import { db } from "../../models";
import { errConfig } from "../../config/err.config";

export async function getRanking(req: Request, res: Response) {
  try {
    const ranking = await db.TicketRanking.findAll({
      limit: 5,
      order: [["rank", "ASC"]],
      include: [
        {
          model: db.Ticket,
          as: "ticket",
          attributes: ["name", "startDate", "endDate", "image"],
        },
      ],
    });
    return res.send(
      ranking.map((ticket) => {
        ticket.dataValues;
      })
    );
  } catch (err) {
    return errConfig(res, err, "this error occurred while getting ranking");
  }
}
