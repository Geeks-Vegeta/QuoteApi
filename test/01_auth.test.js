const request = require("supertest");
const app = require("../server");
const { generateHmac } = require("../utils/hmac/generate-hmac");

describe("Authentication Controller", () => {
  let accessToken;

  beforeAll(async () => {
    // Simulate login to get the tokens

    let data = {
      email: "shreyas@gmail.com",
      password: "shreyas111",
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

  it("should login token", async () => {
    expect(global.accessToken).toBeDefined();
  });
});
