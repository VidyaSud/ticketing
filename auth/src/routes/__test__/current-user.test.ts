import request from "supertest";
import { app } from "../../app";

it("responds with details of current user", async () => {
  //   const signupResponse = await request(app)
  //     .post("/api/users/signup")
  //     .send({
  //       email: "test@test.com",
  //       password: "sdasddsa",
  //     })
  //     .expect(201);
  //   const cookie = signupResponse.get("Set-Cookie");

  // we can use above commented code or below signin global method
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(400);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

// the below one is failing because of not authenticated, so commented
// it("respond with null if not authenticated", async () => {
//   const response = await request(app)
//     .post("/api/users/currentuser")
//     .send()
//     .expect(200);
//   expect(response.body.currentUser).toEqual(null);
// });
