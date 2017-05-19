var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    crypto = require('crypto-js')
var Request = require('../models/request');
router.get('/', function (req, res) {
    res.sendFile('/www/index.html')
});

router.get('/allRequests', function(req, res) {
    var query = {
        $and: [
            {requestedOn: new Date("2017-05-18")}
            // {staffCanceled:false},
            // {assistanceProvided: false},
            // {canceledByUser: false}
            ]
            }
    Request.find(query, function (err, requests) {
        if(err) throw err;
        
        res.json(requests)
    })
})


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