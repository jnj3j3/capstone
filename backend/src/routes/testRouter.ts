/**
 * @swagger
 * tags:
 *   - name: "Test"
 *     description: "Test related routes"
 */
import express, { Response, Request } from "express";
var router = express.Router();

router.get("/test/test1", async (req: Request, res: Response) => {
  try {
    return res.send("ok");
  } catch (err) {
    return res.status(500).send({
      message: err || "Some error occured.",
    });
  }
});

export const testRouter = router;
