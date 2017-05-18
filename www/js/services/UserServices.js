(function(){

    angular.module('serverApp')
        .factory('UserService', ['$http', '$rootScope', '$location', SocketService]);

    function SocketService($http, $rootScope, $location){

        var isLogged = function () {
            $http.get('/profile').then(function (result) {
                if(result.data.user !== undefined && result.data.user !== null) {
                    console.log(result);
                    $rootScope.loginSuccess = false;
                    console.log(result.data.user);
                    if(result.data.user !== $rootScope.user) {
                        $rootScope.loginSuccess = true;
                        $rootScope.user = result.data.user;
                    }
                    return true;
                }
                else{
                    $location.path("/login")
                    return false;
                }
            });
        };
        return {
            isLoggedIn: isLogged
        }
    }
})();