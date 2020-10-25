import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/tickets";
import { OrderCreatedEvent, OrderStatus } from "@vidyatickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  //Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create the data for Ticket model
  const ticket = Ticket.build({
    title: "Concert",
    price: 34,
    userId: "ererere",
  });

  await ticket.save();

  // Create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    expiresAt: "ddd",
    userID: "ddd",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // create the message object
  //@ts-ignore to remove the error on msg
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);
  const ticketafterListening = await Ticket.findById(ticket.id);

  expect(ticketafterListening!.orderId).toEqual(data.id);
});

it("calls the ack message", async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  //expect(natsWrapper.client.publish).toHaveBeenCalled();

  //@ts-ignore
  //console.log(natsWrapper.client.publish.mock.calls);

  // const ticketUpdatedData = JSON.parse(
  //   (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  // );
  // expect(data.id).toEqual(ticketUpdatedData.orderid);
});
