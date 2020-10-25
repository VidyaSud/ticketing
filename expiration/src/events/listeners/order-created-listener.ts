import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

import { OrderCreatedEvent, Subjects, Listener } from "@vidyatickets/common";

import { queueGroupName } from "./queueGroupName";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log("waiting this many min for order to expire", delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      { delay }
    );

    msg.ack();
  }
}
