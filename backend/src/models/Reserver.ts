import { sequelize, seq } from "./db.config";

interface ReserveAttributes {
  id: number;
  userId: number;
  seatId: number;
  created: Date;
  updated: Date;
  state: "pending" | "completed" | "canceled";
}

export class Reserve
  extends seq.Model<ReserveAttributes>
  implements ReserveAttributes
{
  public readonly id!: number;
  public userId!: number;
  public seatId!: number;
  public created: Date;
  public updated: Date;
  public state!: "pending" | "completed" | "canceled";
}

Reserve.init(
  {
    id: {
      type: seq.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: seq.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    seatId: {
      type: seq.INTEGER,
      references: {
        model: "TicketSeat",
        key: "id",
      },
    },
    created: {
      type: seq.DATE,
      defaultValue: seq.NOW,
    },
    updated: {
      type: seq.DATE,
      defaultValue: seq.NOW,
    },
    state: {
      type: seq.ENUM("pending", "completed", "canceled"),
      defaultValue: "completed",
    },
  },
  {
    modelName: "Reserve",
    tableName: "Reserve",
    sequelize,
    timestamps: false,
    freezeTableName: true,
  }
);
