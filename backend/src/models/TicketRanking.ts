import { sequelize, seq } from "./db.config";

interface TicketRankingAttributes {
  id: number;
  ticketId: number;
  count: number;
  total: number;
  rank: number;
  updated: Date;
}

export class TicketRanking
  extends seq.Model<TicketRankingAttributes>
  implements TicketRankingAttributes
{
  public readonly id!: number;
  public ticketId!: number;
  public count!: number;
  public total!: number;
  public rank!: number;
  public updated!: Date;
}

TicketRanking.init(
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
      unique: true,
    },
    count: {
      type: seq.INTEGER,
      defaultValue: 0,
    },
    total: {
      type: seq.INTEGER,
      defaultValue: 0,
    },
    rank: {
      type: seq.INTEGER,
      defaultValue: 0,
    },
    updated: {
      type: seq.DATE,
      defaultValue: seq.NOW,
    },
  },
  {
    modelName: "TicketRanking",
    tableName: "TicketRanking",
    sequelize,
    timestamps: false,
    freezeTableName: true,
  }
);
