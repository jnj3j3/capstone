import { sequelize, seq } from "./db.config";
import { User, UserReq } from "./User";
import { Ticket, TicketReq, TicketBody } from "./Ticket";
import { Reserve } from "./Reserver";
import { TicketSeat, SeatRow, SeatRowRequestBody } from "./TicketSeat";
export const db = {
  Sequelize: seq, // 그대로 유지
  sequelize,
  User,
  Ticket,
  Reserve,
  TicketSeat,
};
Reserve.belongsTo(TicketSeat, { foreignKey: "seatId" });
Reserve.belongsTo(User, { foreignKey: "userId" });
TicketSeat.belongsTo(Ticket, { foreignKey: "ticketId" });
Ticket.belongsTo(TicketSeat, { foreignKey: "userId" });

export { UserReq, TicketReq, SeatRow, SeatRowRequestBody, TicketBody };
