'use strict';

const jwt = require('jsonwebtoken');

let AUTHORIZATION_HEADER = 'Authorization';
let AUTHORIZATION_REGEX = /Bearer (.+)/;

function jwtMiddleware(options) {
    return (req, res, next) => {

        let headerVal = req.get(AUTHORIZATION_HEADER);
        if (!headerVal) {
            // return Promise.reject({code: 'missing_header', message: 'authorization header was missing'})
            res.status(500).send({code: 'missing_header', message: 'authorization header was missing'})
        }

        // the value should be in 'Bearer <JWT>' format... let's extract the JWT
        let match = headerVal.match(AUTHORIZATION_REGEX);
        if (!match) {
            // return Promise.reject({code: 'missing_token', message: 'authorization header was missing the token'})
            res.status(500).send({code: 'missing_token', message: 'authorization header was missing the token'})
        }
        let token = match[1];


        jwt.verify(token, options.secret, (err, decoded) => {
            let msg = {auth: false, message: 'Failed to authenticate token.'};
            if (err) {
                res.status(500).send(msg);
                return;
            }
            next();
        });
    }
}

module.exports = jwtMiddleware;