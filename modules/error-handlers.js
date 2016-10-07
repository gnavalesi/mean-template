function developmentHandler(err, req, res) {
	res.status(err.status || 500);
	if(active) {
		res.send('error', {
			message: err.message,
			error: err
		});
	} else {
		res.send();
	}
}

function productionHandler(err, req, res) {
	res.status(err.status || 500);
	if(active) {
		res.render('error', {
			message: err.message,
			error: {}
		});
	} else {
		res.send();
	}
}

module.exports = {
	productionHandler: productionHandler,
	developmentHandler: developmentHandler
};