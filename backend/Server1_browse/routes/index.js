const express = require('express');
const router = express.Router();
const axios = require('axios');

// const jsdom = require('jsdom');
// const {JSDOM} = jsdom;

// const exec = require( "child_process" ).exec;
// const sys = require( "sys" );

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/location', async function(req, res, next) {
    let mapUrl = "https://www.google.com/maps/place/";

    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    mapUrl += latitude + '+' + longitude;
    console.log(mapUrl);

    const result = await axios.post('http://localhost:3001/url', {
        url: mapUrl
    });

    if(result != null) {
        console.log('success')
        res.send('OK')
    } else {
        console.log('fail')
        res.send('ERROR')
    }

});

module.exports = router;
