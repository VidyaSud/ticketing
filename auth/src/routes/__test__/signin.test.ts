import request from "supertest";
import { app } from "../../app";

it("Email does not existing", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "sdasddsa",
    })
    .expect(400);
});

it("Should sign in after valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "sdasddsa",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "sdasddsa",
    })
    .expect(200);
});

it("Should provide password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "sdasddsa",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "",
    })
    .expect(400);
});

it("Fails when an incorrect email provided", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "sdasddsa",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "sdfdsfdsfdffs",
    })
    .expect(400);
});

it("Get the cookie in the header", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "sdasddsa",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "sdasddsa",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
