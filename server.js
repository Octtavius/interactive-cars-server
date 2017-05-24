var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');


var port = process.env.PORT || 3000;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');

var configDB = require('./config/database.js');
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB_URI || process.env.MONGOLAB_SILVER_URI || configDB.url);

// //++++++++++++++++++++++++++++++++++++++++++++++++++
// //++++++++++++++++++++++++++++++++++++++++++++++++++
// //++++++++++++++++++++++++++++++++++++++++++++++++++
// //++++++++++++++++++++++++++++++++++++++++++++++++++
//
//
// var request = require('request')
//
//
//
// var url = 'https://couchdb-77cd9f.smileupps.com/'
// var db = 'alice'
// var id = 'document_id';
//
// // request(url + db + id, function(err, res, body) {
// //
// //       var ob = JSON.parse(body)
// //       console.log(ob.user + ' : ' + ob.message)
// //     });
//
// var db = require('./database/db');
//
// var data = {
//     _id: (new Date().toJSON()) + ':myid',
//     message: "My messaged"
// }
//
// db.save('alice', data, function(err, doc) {
//     console.log("saved to couch dv");
// })
//
// // // // Create a database/collection inside CouchDB
// // // request.put(url + db, function(err, resp, body) {
// // //   // Add a document with an ID
// // //   request.put({
// // //     url: url + db + id,
// // //     body: {"message":'New Shiny Document', "user": 'stefan'},
// // //     json: true,
// // //   }, function(err, resp, body) {
// // //     // Read the document
// // //     request(url + db + id, function(err, res, body) {
// // //       console.log(body.user + ' : ' + body.message)
// // //     })
// // //   })
// // // })
//
// //++++++++++++++++++++++++++++++++++++++++++++++++++
// //++++++++++++++++++++++++++++++++++++++++++++++++++
// //++++++++++++++++++++++++++++++++++++++++++++++++++
// //++++++++++++++++++++++++++++++++++++++++++++++++++

var Routes =  require('./routes/routes-index');
var users = require('./routes/users');

app.use(express.static('public'));

app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'www')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'shhsecret',
    proxy: true,
    resave: true,
    saveUninitialized: true
     }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use('/', Routes);
// app.use('/users', users);

require('./config/passport')(passport);

var Request = require('./models/request');
var socketStorage = require('./modules/SocketStorage');
var dbManager = require('./modules/DBManager');

io.on('connection', function(socket){
    console.log('a user connected: ' + socket.id);
    socketStorage.addSocket(socket.id);
    socketStorage.displayAll();

    // console.log(SocketStorage.hello());
    // // console.log(Object.keys(io)[0]);
    // // console.log(Object.keys(io)[1]);
    // // console.log(Object.keys(io)[2]);
    // // console.log(Object.keys(io)[3]);
    // // console.log(Object.keys(io)[4]);
    // // console.log(Object.keys(io)[5]);
    // // console.log(Object.keys(io)[6]);
    // // console.log("===============================");
    // // console.log("*******************************************");
    // // console.log(socket.connected);
    // // console.log(io.sockets.sockets[socket.id].connected);
    // // console.log(io.sockets.sockets['DeP2U_2ebNbQ9gyeAAAA'].connected);
    // // console.log(io.sockets.sockets[socket.id]);
    // // console.log("*******************************************");
    // // console.log("*******************************************");
    // // console.log(io.sockets.sockets);
    // // console.log("===============================");
    // // console.log("===============================");
    // // // console.log(io);
    socket.on("notify:accepted", function (data) {
        // console.log("******************************")
        // console.log(data.socketId)
        // console.log(data.staffEmail)
        Request.findOne({socketId: data.socket}, function (err, request) {
            console.log(request);
            console.log(request.length);
            console.log("heheheheh")
            request.staffEmail = data.staffEmail
                request.staffAcceptedRequest = true;
                request.save(function (err) {
                    if(err) throw err;
                    console.log("requests updated successfully");
                })
            })
        io.to(data.socket).emit("staff:accepted:request")
    });

    socket.on("met:assistant", function () {
        console.log("met assistant");
        Request.findOne({socketId: socket.id}, function (err, request) {
            request.assistanceProvided = true;
            console.log(request);
            request.save(function (err) {
                if(err) throw err;
                console.log("requests updated successfully");
            })
        })
        io.emit("client:met", socket.id)
    });

    socket.on("notify:canceled", function (clientId) {
        console.log("notify client that staff canceld the rquests");
        Request.findOne({socketId: clientId}, function (err, request) {
            request.staffCanceled = true;
            console.log(request);
            request.save(function (err) {
                if(err) throw err;
                console.log("requests updated successfully");
            })
        })
        io.to(clientId).emit("staff:canceled:request")
    });

    socket.on("notify:done", function (clientId) {
        Request.findOne({socketId: clientId}, function (err, request) {
            request.assistanceProvided = true;
            request.assistanceProvidedOn = Date.now();
            console.log(request);
            request.save(function (err) {
                if(err) throw err;
                console.log("requests updated successfully");
            })
        });
        io.to(clientId).emit("staff:reply")
    });

    //client cancels the requests
    socket.on('client:cancel:request', function () {
        console.log("client canceled request: ");
        io.emit("client:send:cancel", socket.id);
        Request.findOne({socketId: socket.id}, function (err, request) {
            request.canceledByUser = true;
            console.log(request);
            request.save(function (err) {
                if(err) throw err;
                console.log("requests updated successfully");
                // socket.disconnect()
            })
        })
    });

    //client sent request
    socket.on('send:request', function(data){
      console.log(data.carName)
        data.socketId = socket.id;

        var req = new Request({
            socketId: socket.id,
            carId: data.carId,
            carName: data.carName
        });

        req.save(function (err) {
            if(err) throw err;

            console.log("request saved successfully")
        })

        io.emit('request', data);

        // socketStorage.recordRequest(socket.id)
    });

    socket.on('notifyOf:arrival', function(clientId){
        Request.findOne({socketId: clientId}, function (err, request) {
            request.staffArrived = Date.now();
            console.log(request);
            request.save(function (err) {
                if(err) throw err;
                console.log("requests updated successfully");
            })
        });
        io.to(clientId).emit("staff:arrived")
    });

    //notiy staff that app is in background, and user might not care about getting response
    socket.on('notification:from:client:app:paused', function(){
        console.log("client paused the app");

        io.emit('client:paused:app', socket.id);

        // socketStorage.recordRequest(socket.id)
    });

    socket.on('disconnect', function(){
      io.emit("client:disconnected", socket.id);
        socketStorage.removeSocket(socket.id);
        // dbManager.setClientCanceledByUser(socket.id, !socket.connected)
    });
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


http.listen(port, function(){
    console.log('listening on *:' + port);
});

// http.listen(process.env.PORT, function(){
//     console.log('listening on *:' + port);
// });