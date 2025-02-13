const request = require("supertest");
const app = require("../server");
const { generateHmac } = require("../utils/hmac/generate-hmac");

// here we will add quote, like quote and comment quote

describe("Authentication Controller", () => {
  let accessToken;

  beforeAll(async () => {
    // Simulate login to get the tokens

    let data = {
      email: "shreyas121@gmail.com",
      password: "shreyas123",
    };

    const signature = await generateHmac(JSON.stringify(data));
    const response = await request(app)
      .post("/login")
      .set("x-signature", signature)
      .send(data)
      .expect(200);

    accessToken = response.body.data.item.token;

    // Set tokens in the global object for use in other test files
    global.accessToken = accessToken;
  });

  describe("quote Controller", () => {
    it("should return quote", async () => {
      let data = {
        quote: "one life again one two",
        tags: ["life"],
      };
      const signature = await generateHmac(JSON.stringify(data));
      const response = await request(app)
        .post("/quote/create")
        .set("x-signature", signature)
        .set("Authorization", `Bearer ${global.accessToken}`)
        .send(data)
        .expect(200);
    });
  });
});
