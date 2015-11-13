var app = angular.module('bollito', ['ngRoute', 'appControllers', 'appServices']);

app.config(['$routeProvider', function($routeProvider) {

    $routeProvider.
        when('/', {
            templateUrl: 'partials/home.html',
            controller: 'homeController'
        }).
        when('/buscaminas', {
            templateUrl:    'partials/buscaminas.html',
            controller:     'buscaminasController'
        }).
        otherwise({
            redirectTo: '/'
        });

}]);