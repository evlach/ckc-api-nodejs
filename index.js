const Client = require('./src/client');
const Logger = require('./src/logger');

module.exports = {
	Client,
	getLogger : Logger.getLogger
};
