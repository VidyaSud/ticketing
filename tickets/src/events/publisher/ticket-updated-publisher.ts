import { Publisher, Subjects, TicketUpdatedEvent } from "@vidyatickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
