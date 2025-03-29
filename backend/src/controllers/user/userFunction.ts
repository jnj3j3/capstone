import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENC_KEY, "utf-8"); // 32바이트 키
const iv = Buffer.from(process.env.ENC_IV, "utf-8");
type resultType = string | boolean;
export function encryption(password: string): string {
  return crypto
    .createHash("sha512")
    .update(password + process.env.SALT)
    .digest("base64");
}

export function checkList(
  db: any,
  list: Array<{ name: string; value: any }>
): Promise<resultType> {
  return new Promise(async (resolve, reject) => {
    var existsName: String = null;
    var errMessage: any;
    for (var element of list) {
      const name = element.name;
      const value = element.value;
      const obj = {
        [name]: value,
        state: 1,
      };
      const data = await db.findOne({ where: obj }).catch((err: any) => {
        errMessage = err;
      });
      if (data !== null) {
        existsName = name;
        console.log(existsName, name, data);
        break;
      }
    }
    if (existsName) return resolve(existsName + " is already exists");
    else if (errMessage) return reject(errMessage);
    else return resolve(true);
  });
}
