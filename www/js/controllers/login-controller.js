(function () {
    /**
     * Created by I323506 on 25/01/2017.
     */
    var app = angular.module('serverApp');

    var LoginController = function ($scope, SocketService, $http, $location, $rootScope) {

        $scope.title = "Home Page";

        $scope.admin = {}

        $scope.submit = function () {
            $http.post('/login', $scope.admin)
                .then(function (result) {
                    if(result.status === 200) {
                        $rootScope.user = result.data.user;
                        console.log($rootScope.user);
                        $location.path('/home')
                    }
                    else {
                        console.log("some error")
                    }
                });
            // // SocketService.emit("register:admin", $scope.admin, function (confirmation) {
            // //     console.log(confirmation)
            // // })
            //
            // //this is the password to be used to encrypt the adminn data
            // var myPassword = "valgros";
            //
            // //encrypt the email and passwod by using the pass above.
            // var encryptedEmail = CryptoJS.AES.encrypt($scope.admin.email, myPassword);
            // var encryptedPassword = CryptoJS.AES.encrypt($scope.admin.password, myPassword);
            //
            // //this object will be sent to server
            // var encryptedObject = {
            //     email: encryptedEmail,
            //     password: encryptedPassword
            // };
            //
            // //stringify the encypted data, we need CircularJSON as the encrypted data has references
            // //to itself and cannot be sent via netwoks
            // var CircularJSON = window.CircularJSON;
            //
            // //stringify the encruption
            // var stringified = CircularJSON.stringify(encryptedObject);
            //
            // //send to server
            // $http.post('login', stringified)
            //
            //
            // // var decrypted = CryptoJS.AES.decrypt(encrypted, myPassword);
            //
            // // document.getElementById("demo0").innerHTML = myString;
            // // document.getElementById("demo1").innerHTML = encrypted;
            // // document.getElementById("demo2").innerHTML = decrypted;
            // // document.getElementById("demo3").innerHTML = decrypted.toString(CryptoJS.enc.Utf8);
        }


    };

    app.controller('LoginCtrl', LoginController);
}());
