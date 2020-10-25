import { Subjects, Listener, OrderCreatedEvent } from "@vidyatickets/common";
import { queueGroupName } from "./queue-groupname";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userID,
      version: data.version,
    });

    await order.save();

    msg.ack();
  }
}
