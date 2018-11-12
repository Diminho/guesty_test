'use strict';

const build = (endpoint, payload) => {
    const verb = endpoint.verb;
    if (Object.prototype.toString.call(verb) !== "[object String]") {
        return new Error('Verb should be string');
    }
    // build right payload for every HTTP method
    switch (verb.toLowerCase()) {
        case 'get':
            return buildGet(endpoint.url, payload.params);
        case 'post':
            return buildPost(endpoint.url, payload);
        case 'put':
            return buildPut(endpoint.url, payload);
        case 'patch':
            return buildPatch(endpoint.url, payload);
        default:
            return new Error('Unknown HTTP verb');
    }
};

const buildGet = (url, params) => {
    url += '/' + params.userId;
    return {
        url: url,
        method: 'get',
    }
};

const buildPatch = (url, payload) => {
    let requests = [];

    payload.params.forEach(param => {
        requests.push({
            url: url + '/' + param.userId,
            method: 'patch',
            data: payload.requestBody
        })
    });

    return requests
};

const buildPost = (url, payload) => {
    let requests = [];

    payload.params.forEach(param => {
        requests.push({
            url: url,
            method: 'post',
            data: payload.requestBody
        })
    });

    return requests
};

const buildPut = (url, payload) => {
    let requests = [];

    payload.params.forEach(param => {
        requests.push({
            url: url + '/' + param.userId,
            method: 'put',
            data: payload.requestBody,
        })
    });

    return requests
};


module.exports = {
    build: build
};