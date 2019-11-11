const { postRequest, authRequest } = require("./utils");
const Logger = require("./logger");
require('dotenv').config();

// Ignore invalid Certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const DEF_CONFIG = {
  client_secret:'' || process.env.CKC_CLIENT_SECRET,
  client_id:'' || process.env.CKC_CLIENT_ID,
  username: '' || process.env.CKC_CLIENT_USERNAME,
  password: '' || process.env.CKC_CLIENT_PASSWORD,
};

const URLS = {
  GET_CUSTOMER_CAPABILITIES: "cdp/v1/capabilities/customer",
  GET_DEVICES: "cdp/v1/devices"
};

const logger = Logger.getLogger("API", process.env.CKC_API_LOG_LEVEL);

class Client {
  constructor(config = {}) {
    const conf = {...config, ...DEF_CONFIG};
    this.config = conf;
    this.authData = null;
    this.loginUrl =
      config.loginUrl || "https://ckcsandbox.cisco.com/corev4/token";
    this.platformUrl =
      config.platformUrl || "https://ckcsandbox.cisco.com/t/devnet.com";
  }

  getApiUrl(path) {
    return `${this.platformUrl}/${path}`;
  }

  static async connect(config = {}) {
    const conf = {...config, ...DEF_CONFIG};
    logger.debug(`Trying to connect with config: ${JSON.stringify(conf)}`);

    const loginUrl =
        conf.loginUrl || "https://ckcsandbox.cisco.com/corev4/token";
    const { username, password, client_secret, client_id } = conf;
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
