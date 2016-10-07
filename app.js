//var favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandlers = require('./modules/error-handlers');

const config = require(['.', 'config', 'config'].join(path.sep));

const app = require(['.', 'config', 'express'].join(path.sep));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cookieParser());
app.use(require('connect-livereload')(config.livereload));

// catch 404 and forward to error handler
app.use((req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(errorHandlers.developmentHandler);
}

// production error handler
// no stacktraces leaked to user
app.use(errorHandlers.productionHandler);

module.exports = app;
