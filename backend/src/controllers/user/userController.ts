require("dotenv").config();
import { db, UserReq } from "../../models/index";
import { errConfig } from "../../config/err.config";
const User = db.User;
const sequelize = db.sequelize;

import { Request, Response } from "express";
import * as userFunc from "./userFunction";
import * as authToken from "../../utils/authToken";

export function createUser(req: Request, res: Response) {
  const user: UserReq = {
    name: req.body.name,
    password: userFunc.encryption(req.body.password),
  };
  userFunc
    .checkList(User, [{ name: "name", value: user.name }])
    .then((data) => {
      if (typeof data === "boolean") {
        User.create(user)
          .then((data: any) => {
            return res.send("success");
          })
          .catch((err: any) => {
            return errConfig(
              res,
              err,
              "this error occured while create-userCreate"
            );
          });
      } else return res.send(data);
    })
    .catch((err) => {
      return errConfig(
        res,
        err,
        "this error occured while create-checkDuplication"
      );
    });
}

export function login(req: Request, res: Response) {
  //  #swagger.tags = ['user']
  let password = userFunc.encryption(req.body.password);
  const obj = {
    name: req.body.name,
    password: password,
    state: 1,
  };
  User.findOne({ where: obj })
    .then(async (data: any) => {
      if (data) {
        const accessToken = authToken.createAccessToken({
          id: data.id,
          name: data.name,
        });
        const refreshToken = authToken.createRefreshToken({
          id: data.id,
          name: data.name,
        });

        return res.status(200).send({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } else return errConfig(res, null, "login failed");
    })
    .catch((err: any) => {
      return errConfig(res, err, "user login");
    });
}
export async function deleteUser(req: Request, res: Response) {
  const transaction = await sequelize.transaction();
  try {
    const id = (req as any).user?.id;
    const password = userFunc.encryption(req.body.password);
    const userUpdateData = await User.update(
      { state: 0 },
      {
        where: { id: id, password: password, state: 1 },
        transaction: transaction,
      }
    ).catch((err) => {
      throw new Error(err);
    });
    if (userUpdateData[0] == 0) throw new Error("user not found");
    else {
      await transaction.commit();
      return res.send("success");
    }
  } catch (err) {
    await transaction.rollback();
    return errConfig(res, err, "user delete");
  }
}

export function checkJwt(req: Request, res: Response) {
  const id = (req as any).user?.id;
  const name = (req as any).user?.name;
  if (Boolean(id) && Boolean(name)) {
    const Obj = {
      id: id,
      name: name,
    };
    return res.send(Obj);
  } else return errConfig(res, null, "not logined");
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const accessToken = req.headers.authorization;
    const refreshToken = (req.headers.refresh as string) || "";
    if (accessToken != null && refreshToken != null) {
      const decodeAccessToken = authToken.accessTokenDecrypt(accessToken);
      if (decodeAccessToken != null && decodeAccessToken.exp < Date.now()) {
        const refreshResult = authToken.refreshTokenDecrypt(refreshToken);
        if (refreshResult.exp > Date.now()) {
          const newAccessToken = authToken.createAccessToken({
            id: refreshResult.id,
            name: refreshResult.name,
          });
          const newRefreshToken = authToken.createRefreshToken({
            id: refreshResult.id,
            name: refreshResult.name,
          });
          return res.status(200).send({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        } else return errConfig(res, null, "refreshToken is not valid");
      } else {
        return errConfig(res, null, "No authorized or not expired");
      }
    }
  } catch (err) {
    return errConfig(res, err, "refreshToken");
  }
}
