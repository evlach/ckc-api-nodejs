const { getUserAnswers } = require("./utils");
const CKC = require("../index");

const askAuthData = async () => {
  const entries = {
    client_secret:'' || process.env.CKC_CLIENT_SECRET,
    client_id:'' || process.env.CKC_CLIENT_ID,
    username: '' || process.env.CKC_CLIENT_USERNAME,
    password: '' || process.env.CKC_CLIENT_PASSWORD,
  };
  return getUserAnswers(entries);
};

const runAll = async () => {
  try {
    const authConfig = await askAuthData();
    const client = await CKC.Client.connect(authConfig);
    console.info(client.authData);
    // const info = await client.getCustomerCapabilities();
    // console.info(info);
    const devices = await client.find({
      Light: {
        sid: {
          ne: ""
        }
      }
    });
    console.info(devices);
  } catch (e) {
    console.log(e);
  }
};

runAll();
