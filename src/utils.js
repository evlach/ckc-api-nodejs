const Logger = require('./logger');
const request = require('request');

const headers = {
	'Cache-Control': "no-cache",
	'Content-Type': "application/x-www-form-urlencoded",
	'Postman-Token': "2915798c-f468-407c-a2dd-8897e441102b"
};

const _addAuthorization = (headers, authData = {}) => {
	const {access_token, token_type} = authData;
	headers.Authorization = `${authData.token_type} ${authData.access_token}`;
	return headers;
};

const _request = async (options, authData) => {
	if(authData) {
		options.headers = _addAuthorization(options.headers, authData);
	}
	console.debug(JSON.stringify(options));
	return new Promise((resolve, reject) => {
		request(options, (err, res, body) => {
			if(!err && res.statusCode === 200) {
				const json = typeof body === 'string' ? JSON.parse(body) : body;
				resolve(json, res, body)
			} else {
				console.error(options);
				reject(err ||new Error(res.statusCode));
			}
		});
	})
};


const postRequest = async (url, form = {}, authData) => {
	const options = {
		url,
		method: 'POST',
		headers,
		form
	};
	return _request(options);
};


module.exports = {
	postRequest,
	authRequest: _request,
	Logger
};
