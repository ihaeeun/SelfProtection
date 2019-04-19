const express = require('express');
const router = express.Router();
const axios = require('axios');

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

    mapUrl += latitude + '+' + longitude;
    console.log(mapUrl);

    const result = await axios.post('http://localhost:3001/url', {
        latitude: latitude,
        longitude: longitude
    });


    if (result != null) {
        console.log('success')
        res.render("convert", {latitude: latitude, longitude: longitude});
    } else {
        console.log('fail')
        res.send('ERROR')
    }
});

module.exports = router;