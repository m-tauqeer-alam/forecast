const axios = require('axios');
require('dotenv').config();

const url = process.env.API_URL;
const appid = process.env.APP_ID;

exports.getData = async function getWeatherData(queryObject) {

    let apiurl = `${url}?q=${queryObject.city}&appid=${appid}`;
    try {
        const data = await axios.get(apiurl);
        return data;
    } catch (err) {
        return err.response;
    }
}
