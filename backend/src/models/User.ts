import { sequelize, seq } from "./db.config";

interface UserAttributes {
  id: number;
  name: string;
  password: string;
  created: Date;
  state: number;
}

export class User extends seq.Model<UserAttributes> implements UserAttributes {
  public readonly id!: number;
  public name!: string;
  public password!: string;
  public created!: Date;
  public state!: number;
}

User.init(
  {
    id: {
      type: seq.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: seq.STRING,
      unique: true,
    },
    password: {
      type: seq.STRING,
    },
    created: {
      type: seq.DATE,
    },
    state: {
      type: seq.INTEGER,
    },
  },
  {
    modelName: "User",
    tableName: "User",
    sequelize,
    timestamps: false,
    freezeTableName: true,
  }
);

export interface UserReq {
  name: string;
  password: string;
}
