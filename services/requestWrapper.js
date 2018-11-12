'use strict';

const axios = require('axios');
// Executes retrying logic.
const execute = (options, retries) => {
    return axios(options)
        .then(resp => {
            return resp
        })
        .catch(error => {
            if (retries > 0) {
                return execute(options, retries - 1)
            }
            return error
        })
};

module.exports = {
    execute: execute,
};