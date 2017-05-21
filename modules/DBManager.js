var Request = require('../models/request');

var dbManager = (function () {
    this.setClientCanceledByUser = function (socketId, value) {
        Request.findOne({socketId: socketId}, function (err, request) {
            request.canceledByUser = value;
            request.save(function (err) {
                if(err) throw err;
                console.log("requests updated successfully");
            })
        })
    };

    return this;
}())



module.exports = dbManager;