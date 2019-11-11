const assert = require("assert");
const CKC = require("../index");

describe("#client", () =>
{
	describe("#connect", () =>
	{

		it("should authenticate, get auth data and cache it for further requests", async () =>
		{
			const client = await CKC.Client.connect();
			assert.isDefined(client.authData);
		});
	});

});
