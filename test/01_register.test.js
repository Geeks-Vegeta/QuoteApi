const request = require("supertest");
const app = require("../server");
const { generateHmac } = require("../utils/hmac/generate-hmac");

describe("Register Authentication Controller", () => {
  it("should return unauthorized", async () => {
    let registerData = {
      username: "shreyashkjhgfgh",
      email: "shreyas121@gmail.com",
      password: "shreyas123",
    };
    const signature = generateHmac(JSON.stringify(registerData));
    await request(app)
      .post("/register")
      .send(registerData)
      .set("x-signature", signature)
      .expect(200);
  });
});
