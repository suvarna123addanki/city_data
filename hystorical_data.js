var sleep = require('sleep');
var moment = require('moment');
var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var Array = require('node-array');
var MongoClient = require('mongodb');
//var mongojs = require('mongojs')
//var db = mongojs('test')
//var request = require('request');
app.use(bodyParser.json());
var request = require('request');
app.post('/city/:city/state/:state', function(req, res) {
var state=req.params.state;
var city=req.params.city;
MongoClient.connect('mongodb://localhost/test', function(err, db) {
if(err) throw err;
request("https://api.smartystreets.com/zipcode?auth-id=64aaa0c4-1137-2e06-15a9-034aa838a572&auth-token=QHwFglyDPv5yEwkNs3wL&city="+city+"&state="+state+"", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);
 
            //var weatherdata = obj.data.weather.map(function (weather) { return weather.data; });
 
            db.collection(""+city+"/"+state+"").insert(obj, function (err, data) {
                    if(err) throw err;
 
                    console.dir(data);
 			res.json(data);
                   // db.close();
            });
    };
	});
	});
});
app.post('/city/:city/state/:state/zipcode/:zipcode/', function(req, res) {
var zipcode=req.params.zipcode;
//var starteDate=req.params.startDate;
//var endDate=req.params.endDate;
var a = moment('1990-01-01');
var b = moment('2016-01-01');
var state=req.params.state;
var city=req.params.city
MongoClient.connect('mongodb://localhost/test', function(err, db) {
if(err) throw err;
for (var m =a; m.isBefore(b); m.add(1,'years')) {
request("http://cleanedobservations.wsi.com/CleanedObs.svc/GetObs?version=1&zipcode="+zipcode+"&startDate="+m.format('MM/DD/YYYY')+"&endDate="+moment(a).add(1,'years').format('MM/DD/YYYY')+"&interval=daily&units=metric&format=json&userKey=4b146b388f7011cebe838b14f62bb61c", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);
 
            //var weatherdata = obj.data.weather.map(function (weather) { return weather.data; });
 
            db.collection(""+city+"/"+state+"/"+zipcode+"").insert(obj, function (err, data) {
                    if(err) throw err;
 
                    console.dir(data);
			//res.json(data);
		    //res.json("sucessfuly retrive the required data please enter the get request to fetch the data");
			//db.open()
            });
        };
    });
};
});
});
app.get('/city/:city/state/:state/zipcode/:zipcode/', function(req, res) {
var city=req.params.city;
var state=req.params.state;
var zipcode=req.params.zipcode;
MongoClient.connect('mongodb://localhost/test', function(err, db) {
if(err) throw err;
var collection=""+city+"/"+state+"/"+zipcode+"";
db.collection.find({},function(err, data){
if(err) throw err;
//console.dir(data);
//var obj = JSON.parse(data);
res.json(data);
});
});
});
//sleep.sleep(20);

app.listen(3005);
console.log('Listening on port 3005...');
