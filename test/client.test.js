const assert = require("assert");
const CKC = require("../index");

describe("#client", () => {
  describe("#connect", () => {
    it("should authenticate, get auth data and cache it for further requests", async () => {
      const client = await CKC.Client.connect();
      assert(client.authData !== null);
      assert(typeof client.authData.access_token === "string");
      assert(client.authData.access_token.length > 0);
    });
  });
});
