const bunyan = require('bunyan');
let logger;

const getLogger = (name, level = 1) => {
	if(!logger) {
		logger = bunyan.createLogger({
			name,
			level
		});
	}
	return logger;
};


module.exports = {
	getLogger
};
