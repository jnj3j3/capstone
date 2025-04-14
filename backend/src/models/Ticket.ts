import { sequelize, seq } from "./db.config";

interface TicketAttributes {
  id: number;
  name: string;
  context: string;
  created: Date;
  image: Buffer;
  userId: number;
  startDate: Date;
  endDate: Date;
}

export class Ticket
  extends seq.Model<TicketAttributes>
  implements TicketAttributes
{
  public readonly id!: number;
  public name!: string;
  public password!: string;
  public created!: Date;
  public context!: string;
  public image: Buffer;
  public userId!: number;
  public startDate!: Date;
  public endDate!: Date;
}

Ticket.init(
  {
    id: {
      type: seq.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: seq.STRING,
    },
    created: {
      type: seq.DATE,
    },
    context: {
      type: seq.STRING,
    },
    image: {
      type: seq.BLOB("long"),
    },
    userId: {
      type: seq.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    startDate: {
      type: seq.DATE,
    },
    endDate: {
      type: seq.DATE,
    },
  },
  {
    modelName: "Ticket",
    tableName: "Ticket",
    sequelize,
    timestamps: false,
    freezeTableName: true,
  }
);

export interface TicketBody {
  userId: number;
  name: string;
  context: string;
  image: Buffer;
  startDate: Date;
  endDate: Date;
}
export interface TicketReq {
  name: string;
  context: string;
  image: Buffer;
  startDate: Date;
  endDate: Date;
}
