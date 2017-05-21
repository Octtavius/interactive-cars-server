var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    crypto = require('crypto-js');
var http = require('http').Server(express());

var Request = require('../models/request');

// //the socket storage
var sockStorage = require('../modules/SocketStorage');


router.get('/', function (req, res) {
    res.sendFile('/www/index.html')
});

//this request will find all requsts that weren't canceled by client, nor by staff, non of them got supported and clients who
// made those requests are still connected
router.get('/allRequests', function(req, res) {
    var today = new Date();

    var formatMonth = function (month) {
        if (month < 10) {
            month = "0" + month
            return month;
        }
        else {
            return month;
        }
    };

    var formatDay = function (day) {
        if (day < 10) {
            day = "0" + day;
            return day;
        }
        else {
            return day;
        }
    };
    var fullDate = today.getFullYear() + "-"+ formatMonth(today.getMonth()+1) + "-" + formatDay(today.getDate());
    // console.log(fullDate);
    // console.log(today.getDate());
    var query = {
        $and: [
            {'$where': 'this.requestedOn.toJSON().slice(0, 10) == "' + fullDate+'"'},
            {staffCanceled:false},
            {assistanceProvided: false},
            {canceledByUser: false}
        ]
    };

    //store here all sockets that are still connected and have a request made. it will go on mongo with mongoose and find all requests for today
    //then it will check if requests' ids match any conncted sockets, if so it will be displayed.
    var tempArr = [];
    Request.find(query, function (err, requests) {
        if(err) throw err;
        for (var i = 0; i < requests.length; i++) {
            var item = requests[i]
            if(item.socketId === sockStorage.findById(item.socketId)) {
                tempArr.push(item)
            }
        }
        res.json(tempArr)
    })
});


router.get("/loggedin", function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/profile', isLoggedIn, function(req, res) {
    res.json({user:req.user})
});


router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
    {
        console.log("hehhh");
        return next();
    }
    res.redirect('/');
}