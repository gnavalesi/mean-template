function developmentHandler(err, req, res) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: err
	});
}

function productionHandler(err, req, res) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
}

module.exports = {
	productionHandler: productionHandler,
	developmentHandler: developmentHandler
};