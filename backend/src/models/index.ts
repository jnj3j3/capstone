import { sequelize, seq } from "./db.config";
import { User, UserReq } from "./User";
import { Ticket, TicketReq } from "./Ticket";
export const db = {
  Sequelize: seq, // 그대로 유지
  sequelize,
  User,
  Ticket,
};

export { UserReq, TicketReq };
