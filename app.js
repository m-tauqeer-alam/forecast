const debug = require('debug')('Weather API');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./public/swagger.json');
const routes = require('./routes/index');
const forecast = require('./routes/forecast')
const app = express();

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/forecast', forecast);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        const status = err.status || 500;
        res.status(status).send({
          message: err.message,
          error: err
        });
  });
}

// production error handler no stacktraces leaked to user
app.use(function (err, req, res, next) {
    const status = err.status || 500;
    res.status(status).send(err.message);
});

app.set('port', process.env.PORT);

const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
