//I use this object to keep track of all sockets clients connected to server
//I will also eep track of all connected users that made requests for assistance
//it will be easier to go trough 200 users a day that are connected than 1000s of
//requests made.
var SocketStorage = (function(){
    this.count = 0;
    this.sockets = {};

    //add just connected socket to the object
    this.addSocket = function (socketId) {
        SocketStorage.sockets[socketId] = {
            id: socketId
        };
        this.count++;
    };

    //remove connected socket
    this.removeSocket = function (socketId) {
        console.log("::socket-storage:: socket remove-" + socketId);
        delete SocketStorage.sockets[socketId];
        this.count --;
    };

    //find connected socket by id
    this.findById = function (socketId) {
        console.log(this.sockets[socketId]);
        return this.sockets[socketId];
    };

    //display all connected sockets
    this.displayAll = function () {
        console.log("--------------");
        for (var item in this.sockets) {
            if(SocketStorage.sockets.hasOwnProperty(item)) {
                console.log("------>>>>>>>  " + item)
                console.log(Object.keys(SocketStorage.sockets[item]));
                if(SocketStorage.sockets[item].requestMade !== undefined) {
                    console.log(SocketStorage.sockets[item].requestMade);
                }
                console.log("------>>>>>>>  END")
            }
        }
        console.log("--------------");
    };

    // //keep track of which online/connected sockets made requests today
    // //I will use this to retrieve on staff page only requests of users that still
    // //connected to the server
    // this.recordRequest = function (socketId) {
    //     this.sockets[socketId].requestMade = true;
    // };

    return this;
}());
//
// SocketStorage
//
// SocketStorage.prototype
//
// SocketStorage.prototype
//
// SocketStorage.prototype
//
// SocketStorage.prototype



module.exports = SocketStorage;