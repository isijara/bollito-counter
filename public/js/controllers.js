var bollitoController = angular.module('appControllers', []);

bollitoController.controller('homeController', ['$scope', '$http', 'Counter', function($scope, $http, Counter) {

    window.$scope = $scope;
    $scope.wtf = Counter.query();
    $scope.wtf.$promise.then(function(result) {
        $scope.counter = result.counter;
    });

}]);