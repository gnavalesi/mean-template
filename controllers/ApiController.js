const pkg = require('../package.json');

function version(req, res) {
	res.status(200).send({
		version: pkg.version
	});
}

module.exports = {
	version: version
};