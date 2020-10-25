import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it(" returns 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

// it("returns the ticket if it found", async () => {
//   const title = "new ticket";
//   const price = 40;

//   const ticketResponse = await request(app)
//     .post("/api/tickets")
//     .set("Cookie", global.signin())
//     .send({
//       title,
//       price,
//     })
//     .expect(201);

//   await request(app)
//     .get(`/api/tickets/${ticketResponse.body.id}`)
//     .send()
//     .expect(200);

//   expect(ticketResponse.body.title).toEqual(title);
//   expect(ticketResponse.body.price).toEqual(price);
// });
