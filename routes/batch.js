const express = require('express');
const settings = require('../settings');
const requestBuilder = require('../services/requestBuilder');
const requestWrapper = require('../services/requestWrapper');
const router = express.Router();

/**
 * @swagger
 * /batch:
 *   post:
 *     summary: Return statuses of a batch operations
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Batch operations need to be performed
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: "#/definitions/Coordinates"
 *         examples:
 *           application/json:
 *             {
 *               "status": "success",
 *               "result": [
 *                  {
 *                      "status": "success",
 *                      "statusCode": 200,
 *                      "path": "/user/ja2S-hs81-ksn3-iQI9"
 *                  },
 *                  {
 *                      "status": "fail",
 *                      "msg": "Request failed with status code 503",
 *                      "path": "/user/29"
 *                  },
 *                  {
 *                      "status": "success",
 *                      "statusCode": 200,
 *                      "path": "/user/103"
 *                  }
 *              ]
 *          }
 *       520:
 *         description: Internal Server Error
 */
router.post('/batch', (req, res) => {
    const rawRequests = requestBuilder.build(req.body.endpoint, req.body.payload);
    if (rawRequests instanceof Error) {
        req.log.error({method: 'POST', path: '/batch', error: error});
        res.status(405).json({status: 'fail', msg: error.toString()})
    }
    const requests = rawRequests.map(request => requestWrapper.execute(request, settings.retries));

    Promise.all(requests).then(values => {
        //building array of results that requests returned
        let responses = values.map(resp => {
            if (resp instanceof Error) {
                //included path key to identify what request has failed
                return {"status": "fail", msg: resp.message, "path": resp.request.path}
            }
            return {"status": "success", statusCode: resp.status, "path": resp.request.path}
        });
        res.json({status: 'success', result: responses})
    }).catch(error => {
        req.log.error({errorMessage: 'Uncaught error batch action', method: 'POST', path: '/batch', error: error});
        res.status(520).json({status: 'fail', msg: error.toString()})
    })
});

module.exports = router;