import express, { Request, Response } from "express";
import { requireauth } from "@vidyatickets/common";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireauth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.send(orders);
});

export { router as indexOrderRouter };
