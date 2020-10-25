import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "rdsfdfs",
      password: "dsddsds",
    })
    .expect(400);
});

it("returns a 400 with an invalid password ", async () => {
  await request(app) // we can add return or await
    .post("/api/users/signup")
    .send({
      email: "rds@fd.com",
      password: "2s",
    })
    .expect(400);
});

it("returns a 400 with missing email and password ", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "rds@fd.com",
      password: "",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "2sddddd",
    })
    .expect(400);
});

it("Disallow duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "dsdfdsf",
    })
    .expect(400);
});

it("Sets a cookie after successesfull signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
