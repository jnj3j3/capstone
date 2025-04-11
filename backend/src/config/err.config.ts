import { Response } from "express";

export function errConfig(res: Response, err: any, message: string): void {
  if (err != null) console.log(err + " error occured while " + message);
  res.status(500).send({
    message: " This error occured while " + message,
  });
}
