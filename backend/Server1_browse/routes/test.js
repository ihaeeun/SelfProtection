const express = require('express');
const router = express.Router();
const axios = require('axios');

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const exec = require( "child_process" ).exec;
const sys = require( "sys" );

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/location', function(req, res, next) {
    let mapUrl = "https://www.google.com/maps/place/";

    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    mapUrl += latitude + '+' + longitude;
    console.log(mapUrl);

    axios.post('http://localhost:3001/url', {
        url: mapUrl
    });



    res.send('OK')
    
});

router.post('/test', function(req, res, next) {
    let mapUrl = "https://www.google.com/maps/place/";
    // const window = (new JSDOM(`...`)).window;
    // window.onModulesLoaded = () => {
    //   console.log("ready to roll!");
    // };
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;



    // jsdom.env({
    //     html: mapUrl,
    //     done: function(errors, window) {
    //         console.log(window);
    //     }
    // })

    mapUrl += latitude + '+' + longitude;

    console.log(mapUrl)
    const window = (new JSDOM(``, { runScripts: "outside-only" })).window;
    console.log(window)

    window.eval(`document.body.innerHTML = "<p>Hello, world!</p>";`);
    window.document.body.children.length === 1;
    
});

router.post('/terminal', function (req, res, next) {

    let child;
    let temp;
    let serverLoad = 0;
    
    child = exec("open /Applications/Mail.app", function(error, stdout, stderr) {
        if(error !== null) {
            console.log("getLoad : " + error);
        }
    
        temp = stdout.match(/(load average: )([0-9.]*)/);
        if(temp !== null) {
            sys.puts(temp[2]);
        } else {
            sys.puts("load data is null");
        }
    });
});

module.exports = router;
