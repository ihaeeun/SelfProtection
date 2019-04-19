var express = require('express');
var router = express.Router();

router.post('/url', function(req, res, next) {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  res.render('convert', {
    latitude: latitude,
    longitude: longitude
  });

});

module.exports = router;
