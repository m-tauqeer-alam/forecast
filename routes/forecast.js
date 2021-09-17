const Ajv = require('ajv');
const express = require('express');
const weatherApi = require('../models/weatherapi.js')
const CacheControl = require('express-cache-control')

const router = express.Router();
const cache = new CacheControl().middleware;

router.get('/', cache('minutes', 1), function (request, response, next) {

    const schema = {
        type: 'object',
        properties: {
            city: { type: 'string' },
            orderBy: { type: 'string' }
        },
        required: ['city', 'orderBy']
    }

    // validate the request
    const ajv = new Ajv();
    const valid = ajv.validate(schema, request.query);
    if (!valid) {
        return response.status(400).json({
            status: ajv.errors,
            error: ajv.errors.message
        });
    }

    // request is valid. 
    try {
    weatherApi.getData(request.query)
        .then((apiData) => {           
            if (apiData) {
                if (apiData.status === 200) {
                    let sdata = apiData.data.list;

                    const result = sdata.map(item => {
                        return {
                            dt: item.dt,
                            temp: {
                                temp: item.main.temp,
                                temp_min: item.main.temp_min,
                                temp_max: item.main.temp_max,
                                pressure: item.main.pressure,
                                sea_level: item.main.sea_level,
                                grnd_level: item.main.grnd_level,
                                humidity: item.main.humidity,
                                temp_kf: item.main.temp_kf
                            },
                            wind: {
                                speed: item.wind.speed,
                                deg: item.wind.deg
                            }
                        };
                    });
                    //sort the data here before sending it to client
                    request.query.orderBy.toLowerCase() === 'desc' ? result.sort((a, b) => b.dt - a.dt) : result.sort((a, b) => a.dt - b.dt)
                    response.setHeader('Content-Type', 'application/json');
                    response.send(result);
                }
                else if (apiData.status === 404) {
                    response.writeHead(404, { 'Content-Type': 'text/plain' });
                    response.end(apiData.data.message);
                }                
            }
            else {
                let errdata = 'error in getting data';
                response.json(errdata);
            }
        });
    }
    catch (e) {
        response.json(`Error in getting data : ${e.message}`);
    }
});

module.exports = router;
