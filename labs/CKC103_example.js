const {getUserAnswers} = require('./utils');
const CKC = require('../index');
const CONFIG = require('./config');

const askAuthData = async () => {
	const entries = {
		client_secret: CONFIG.client_secret,
		client_id: CONFIG.client_id,
		username: CONFIG.username,
		password: CONFIG.password
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
		const devices = await client.getDevicesBy({
			"Light" : {
				"sid": {
					"ne": ""
				}
			}
		});
		console.info(devices)


	} catch (e) {
		console.log(e);
	}


};

runAll();



