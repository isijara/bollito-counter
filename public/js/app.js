var app = angular.module('bollito', ['ngRoute', 'appControllers']);

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