var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/location', function(req, res, next) {
    let mapUrl = "https://www.google.com/maps/place/";

    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    mapUrl += latitude + ',' + longitude;

    res.redirect(mapUrl);
});


module.exports = router;
