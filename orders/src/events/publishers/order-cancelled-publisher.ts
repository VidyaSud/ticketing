import { Publisher, Subjects, OrderCancelledEvent } from "@vidyatickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
