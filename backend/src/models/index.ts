import { sequelize, seq } from "./db.config";
import { User, UserReq } from "./User";
export const db = {
  Sequelize: seq, // 그대로 유지
  sequelize,
  User: User,
};

export { UserReq };
