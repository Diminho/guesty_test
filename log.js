'use strict';

const bunyan = require('bunyan');

module.exports = (name, level) => {
    return (module) => bunyan.createLogger({
        name: name,
        level: level || process.env.LOG_LEVEL || 'info'
    }).child({module: module})
};