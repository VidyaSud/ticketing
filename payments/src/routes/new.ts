import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Payment } from "../models/payment";
import {
  requireauth,
  ValidateRequest,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
  BadRequestError,
} from "@vidyatickets/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const route = express.Router();

route.post(
  "/api/payments",
  requireauth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    // the below one is not working , need to check
    // if (order.userId !== req.currentUser!.id) {
    //   throw new NotAuthorizedError();
    // }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("cannot pay fo the cancelled order.");
    }
    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { route as createChargeRouter };
