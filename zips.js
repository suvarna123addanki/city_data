var sleep = require('sleep');
var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
var Array = require('node-array');
var MongoClient = require('mongodb');
var mongojs = require('mongojs');
var db = mongojs('zips',['Us_Zipcode_data']);
var request = require('request');
app.use(bodyParser.json());
app.get('/city/:city/state/:state', function(req, res) {
    db.Us_Zipcode_data.find({"city_states.city":req.params.city,"city_states.state_abbreviation":req.params.state}, function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});
app.post('/city/:city/state/:state', function(req, res) {
var state=req.params.state;
var city=req.params.city;
MongoClient.connect('mongodb://localhost/zips', function(err, db) {
if(err) throw err;
request("https://api.smartystreets.com/zipcode?auth-id=64aaa0c4-1137-2e06-15a9-034aa838a572&auth-token=QHwFglyDPv5yEwkNs3wL&city="+city+"&state="+state+"", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);
 
            //var weatherdata = obj.data.weather.map(function (weather) { return weather.data; });
 
            db.collection('Us_Zipcode_data').insert(obj, function (err, data) {
                    if(err) throw err;
 
                    console.dir(data);
 
                   // db.close();
            });
    };
});
//sleep.sleep(20);
});
});
app.listen(3002);
console.log('Listening on port 3002...');
