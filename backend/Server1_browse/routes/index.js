const express = require('express');
const router = express.Router();
const axios = require('axios');

// const jsdom = require('jsdom');
// const {JSDOM} = jsdom;

// const exec = require( "child_process" ).exec;
// const sys = require( "sys" );

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/locate', async function (req, res) {
    let mapUrl = "https://www.google.com/maps/place/";

    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    mapUrl += latitude + '+' + longitude;
    console.log(mapUrl)

    res.render('convert', {
        latitude: latitude,
        longitude: longitude
    });

});

router.get('/axios-location', async function (req, res) {
    let mapUrl = "https://www.google.com/maps/place/";

    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    console.log(mapUrl)
    mapUrl += latitude + '+' + longitude;
    console.log(mapUrl);

    const result = await axios.post('http://localhost:3001/url', {
        url: mapUrl
    });

    if (result != null) {
        console.log('success')
        res.send('OK')
    } else {
        console.log('fail')
        res.send('ERROR')
    }
});

module.exports = router;