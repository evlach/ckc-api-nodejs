const { postRequest, authRequest } = require("./utils");
const Logger = require("./logger");

// Ignore invalid Certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const URLS = {
  GET_CUSTOMER_CAPABILITIES: "cdp/v1/capabilities/customer",
  GET_DEVICES: "cdp/v1/devices"
};

const logger = Logger.getLogger("API", process.env.CKC_API_LOG_LEVEL);

class Client {
  constructor(config) {
    this.config = config;
    this.authData = null;
    this.loginUrl =
      config.loginUrl || "https://ckcsandbox.cisco.com/corev4/token";
    this.platformUrl =
      config.platformUrl || "https://ckcsandbox.cisco.com/t/devnet.com";
  }

  getApiUrl(path) {
    return `${this.platformUrl}/${path}`;
  }

  static async connect(config) {
    const loginUrl =
      config.loginUrl || "https://ckcsandbox.cisco.com/corev4/token";
    const { username, password, client_secret, client_id } = config;
    const postData = {
      grant_type: "password",
      client_secret,
      client_id,
      username,
      password
    };
    try {
      const response = await postRequest(loginUrl, postData);
      logger.info("Authenticated Successfully");
      const client = new Client(config);
      client.authData = response;
      // this.userId = respose.
      return client;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getCustomerCapabilities() {
    const options = {
      method: "GET",
      url: this.getApiUrl(URLS.GET_CUSTOMER_CAPABILITIES),
      headers: {
        ...this.config.headers
      }
    };
    return authRequest(options, this.authData);
  }

  async query(query) {
    const options = {
      method: "POST",
      url: this.getApiUrl(URLS.GET_DEVICES),
      headers: { "cache-control": "no-cache", Connection: "keep-alive" },
      body: {
        Query: query
      },
      json: true
    };
    return authRequest(options, this.authData);
  }

  async find(findQuery) {
    const query = {
      Find: findQuery
    };
    const response = await this.query(query);
    return response.Find.Result;
  }
}

module.exports = Client;
