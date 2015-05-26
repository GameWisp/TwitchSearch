var express = require("express");
var bodyParser = require("body-parser");
var htmlBuilder = require("./data/htmlbuilder");
var dbaccess = require("./data/database/dbaccess");
var queries = require("./data/database/sqlqueries");
var app = express();
var port = 3700;
var path = require('path');
var ROOT = __dirname;
var error_message = "Error processing your request. Try again, later.";

// Setup database access
dbaccess.start();

// Setup app
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/js", express.static(path.join(ROOT, 'public/js')));
app.use("/css", express.static(path.join(ROOT, 'public/css')));
app.use("/img", express.static(path.join(ROOT, 'public/img')));

// Handle requests
app.get("/", function(req, res){
    var params = req.query;
    //console.log(params);
    var searchQuery = queries.buildSearchQuery(params, false);
    dbaccess.query(searchQuery[0], searchQuery[1], function(ds){
        res.end(htmlBuilder.buildPage(ds));
    }, function (err) {
        console.log(err);
        res.end(error_message);
    });
});
app.post("/ajax/languages", function(req, res){
    dbaccess.query(queries.getQuery('select_languages'), [], function(ds){
        res.end(JSON.stringify(ds));
    }, function (err) {
        console.log(err);
        res.end(error_message);
    });
});
app.post("/ajax/pagination", function(req, res){
    var params = req.body;
    var searchQuery = queries.buildSearchQuery(params, true);
    dbaccess.query(searchQuery[0], searchQuery[1], function(ds){
        var count = ds[0].Count;
        var pages = Math.ceil(count / queries.getResultsPerPage());
        res.end(JSON.stringify(pages));
    }, function (err) {
        console.log(err);
        res.end(error_message);
    });
});
app.post("/ajax/games_list", function(req, res){
    dbaccess.query(queries.getQuery('select_games_list'), [], function(ds){
        var n = [];
        for(var i=0; i<ds.length; i++){
            n[i] = ds[i].Game.trim();
        }
        res.end(JSON.stringify(n));
    }, function (err) {
        console.log(err);
        res.end(error_message);
    });
});

var server = app.listen(port, function () {
    console.log("Listening on port " + port);
});