const _ = require('lodash');
require('dotenv').config();

const settings = {
    env: _.get(process.env, 'NODE_ENV', 'development'),
    port: _.get(process.env, 'PORT', 3000),
    log: require('./log')('api-batch'),
    jwt_secret: _.get(process.env, 'JWT_SECRET'),
    retries: _.get(process.env, 'RETRIES_AMOUNT')
};

// export the configuration object
module.exports = settings;
