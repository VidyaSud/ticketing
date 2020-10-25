import Request from "supertest";
import { app } from "../../app";
import request from "supertest";

const CreateTicket = () => {
  return request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "sdfdsffs",
    price: 20,
  });
};
it("returns the tickets", async () => {
  await CreateTicket();
  await CreateTicket();
  await CreateTicket();

  const response = await request(app).get("/api/tickets").send({}).expect(200);
  expect(response.body.length).toEqual(3);
});
