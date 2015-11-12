var app = angular.module('bollito', ['ngRoute', 'appControllers', 'appServices']);

app.config(['$routeProvider', function($routeProvider) {

    $routeProvider.
        when('/', {
            templateUrl: 'partials/home.html',
            controller: 'homeController'
        }).
        otherwise({
            redirectTo: '/'
        });

}]);