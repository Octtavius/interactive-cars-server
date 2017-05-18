(function () {
    var app = angular.module("serverApp", ["ngRoute", 'btford.socket-io'])
        .run(function($rootScope) {
            $rootScope.user = null;
        }); 

    app.config(function ($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "templates/home.html",
                controller: "HomeCtrl",
                resolve: {
                    officeList: function(UserService) {

                        console.log("offive");
                        return {
                            check: UserService.isLoggedIn
                        }
                    }
                }
            })
            .when("/login", {
                templateUrl: "templates/login-page.html",
                controller: "LoginCtrl"
            })

            .when("/signup", {
                templateUrl: "templates/signup-page.html",
                controller: "SignupCtrl"
            })


            // .when("/user/:username", {
            //     templateUrl: "partials/user.html",
            //     controller: "UserCtrl"
            // })
            // .when("/repo/:username/:reponame", {
            //     templateUrl: "partials/repo.html",
            //     controller: "RepoCtrl"
            // })
            .otherwise({redirectTo: "/home"});
    });

}());

