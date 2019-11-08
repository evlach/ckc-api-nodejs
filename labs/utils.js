const inquirer = require('inquirer');

const getUserAnswers = async (defaults) => {
	const questions = Object.entries(defaults).map(([key, value]) => {
		return { message: key, name: key, default: value, type: 'input' };
	});
	return new Promise((resolve, reject) => {
		inquirer.prompt(questions).then((answers) => {
			resolve(answers);
		});
	})
};

module.exports = {
	getUserAnswers
};
