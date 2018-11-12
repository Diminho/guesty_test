const express = require('express');
const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware')

const settings = require('./settings');
const batchRoute = require('./routes/batch');
const healthRoute = require('./routes/health');
const jwtMiddleware = require('./middlewares/jwtMiddleware');

const app = express();
app.disable('x-powered-by');

// create logger
const log = settings.log();

app.use(bodyParser.json());
app.use(bunyanMiddleware({
    headerName: 'X-Request-Id',
    propertyName: 'reqId',
    logName: 'req_id',
    logger: log
}));

app.use(jwtMiddleware({
    secret: settings.jwt_secret,
}));
//Routes
app.use('/', batchRoute);
app.use('/health', healthRoute);

// start up the server
let server = app.listen(settings.port, () => {
    const port = server.address().port;
    log.info('server listening at port %s', port)
});