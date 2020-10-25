import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  ValidateRequest,
  NotFoundError,
  requireauth,
  NotAuthorizedError,
  BadRequestError,
} from "@vidyatickets/common";
import { Ticket } from "../models/tickets";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireauth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit the reserved ticket");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userID: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
