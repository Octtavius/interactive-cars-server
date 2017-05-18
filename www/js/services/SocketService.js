(function(){

    angular.module('serverApp')
        .service('SocketService', ['socketFactory', SocketService]);

    function SocketService(socketFactory){

        var ioSocket = io.connect('/', {});
        socketFactory = socketFactory({ioSocket: ioSocket})
        socketFactory.disconnect = function () {
            ioSocket.disconnect();
        };

        return socketFactory;

    }
})();

//
// (function(){
//
//     angular.module('myApp')
//         .service('SocketService', ['socketFactory', SocketService]);
//
//     function SocketService(socketFactory){
//         var toCon = function () {
//             var ioSocket = io.connect('/', {});
//             socketFactory = socketFactory({ioSocket: ioSocket})
//             socketFactory.disconnect = function () {
//                 ioSocket.disconnect();
//             };
//         };
//
//         return {
//             toCon: toCon
//         };
//
//     }
// })();

//
// (function(){
//
//     angular.module('myApp')
//         .service('SocketService', ['socketFactory', SocketService]);
//
//     function SocketService(socketFactory){
//         var toCon = function () {
//             var ioSocket = io.connect('/', {});
//             socketFactory = socketFactory({ioSocket: ioSocket})
//             socketFactory.disconnect = function () {
//                 ioSocket.disconnect();
//             };
//         };
//
//         return {
//             toCon: toCon
//         };
//
//     }
// })();