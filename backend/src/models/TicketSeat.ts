import { sequelize, seq } from "./db.config";

interface TicketSeatAttributes {
  id: number;
  ticketId: number;
  seatNumber: string;
  updated: Date;
  state: "available" | "reserved" | "hold";
}

export class TicketSeat
  extends seq.Model<TicketSeatAttributes>
  implements TicketSeatAttributes
{
  public readonly id!: number;
  public ticketId!: number;
  public seatNumber!: string;
  public updated!: Date;
  public state!: "available" | "reserved" | "hold";
}

TicketSeat.init(
  {
    id: {
      type: seq.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticketId: {
      type: seq.INTEGER,
      references: {
        model: "Ticket",
        key: "id",
      },
    },
    seatNumber: {
      type: seq.STRING,
      unique: true,
    },
    updated: {
      type: seq.DATE,
      defaultValue: seq.NOW,
    },
    state: {
      type: seq.ENUM("available", "reserved", "hold"),
      defaultValue: "available",
    },
  },
  {
    modelName: "TicketSeat",
    tableName: "TicketSeat",
    sequelize,
    timestamps: false,
    freezeTableName: true,
  }
);

export interface SeatRow {
  row: string;
  seats: number;
}

export interface SeatRowRequestBody {
  seatRows: SeatRow[];
}
