"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.login = login;
exports.deleteUser = deleteUser;
exports.checkJwt = checkJwt;
exports.refreshToken = refreshToken;
require("dotenv").config();
const index_1 = require("../../models/index");
const err_config_1 = require("../../config/err.config");
const User = index_1.db.User;
const sequelize = index_1.db.sequelize;
const userFunc = __importStar(require("./userFunction"));
const authToken = __importStar(require("../../utils/authToken"));
function createUser(req, res) {
    const user = {
        name: req.body.name,
        password: userFunc.encryption(req.body.password),
    };
    userFunc
        .checkList(User, [{ name: "name", value: user.name }])
        .then((data) => {
        if (typeof data === "boolean") {
            User.create(user)
                .then((data) => {
                return res.send("success");
            })
                .catch((err) => {
                return (0, err_config_1.errConfig)(res, err, "this error occured while create-userCreate");
            });
        }
        else
            return res.send(data);
    })
        .catch((err) => {
        return (0, err_config_1.errConfig)(res, err, "this error occured while create-checkDuplication");
    });
}
function login(req, res) {
    //  #swagger.tags = ['user']
    let password = userFunc.encryption(req.body.password);
    const obj = {
        name: req.body.name,
        password: password,
        state: 1,
    };
    User.findOne({ where: obj })
        .then((data) => __awaiter(this, void 0, void 0, function* () {
        if (data) {
            const accessToken = authToken.createAccessToken({
                id: data.id,
                name: data.name,
            });
            const refreshToken = authToken.createRefreshToken({
                id: data.id,
                name: data.name,
            });
            res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        }
        else
            return (0, err_config_1.errConfig)(res, null, "login failed");
    }))
        .catch((err) => {
        return (0, err_config_1.errConfig)(res, err, "user login");
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const transaction = yield sequelize.transaction();
        try {
            const id = req.body.id;
            const password = userFunc.encryption(req.body.password);
            const userUpdateData = yield User.update({ state: 0 }, {
                where: { id: id, password: password, state: 1 },
                transaction: transaction,
            }).catch((err) => {
                throw new Error(err);
            });
            if (userUpdateData[0] == 0)
                return res.send("id or password is wrong");
            else {
                yield transaction.commit();
                return res.send("success");
            }
        }
        catch (err) {
            yield transaction.rollback();
            return (0, err_config_1.errConfig)(res, err, "user delete");
        }
    });
}
function checkJwt(req, res) {
    const id = req.body.id;
    const name = req.body.name;
    if (Boolean(id) && Boolean(name)) {
        const Obj = {
            id: id,
            name: name,
        };
        return res.send(Obj);
    }
    else
        return (0, err_config_1.errConfig)(res, null, "not logined");
}
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accessToken = req.headers.authorization;
            const refreshToken = req.headers.refresh || "";
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
                    }
                    else
                        return (0, err_config_1.errConfig)(res, null, "refreshToken is not valid");
                }
                else {
                    return (0, err_config_1.errConfig)(res, null, "No authorized or not expired");
                }
            }
        }
        catch (err) {
            return (0, err_config_1.errConfig)(res, err, "refreshToken");
        }
    });
}
//# sourceMappingURL=userController.js.map