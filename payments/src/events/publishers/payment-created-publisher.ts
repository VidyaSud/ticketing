import { Subjects, Publisher, PaymentCreatedEvent } from "@vidyatickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
