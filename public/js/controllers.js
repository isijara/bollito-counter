var bollitoController = angular.module('appControllers', []);

bollitoController.controller('homeController', ['$scope', '$http', 'Counter', function($scope, $http, Counter) {

    window.$scope = $scope;

    // $scope.cells = [
    //     { user: ''}, { user: ''}, { user: ''},
    //     { user: ''}, { user: ''}, { user: ''},
    //     { user: ''}, { user: ''}, { user: ''}
    // ];

    $scope.cells = [];
    for(var i=0; i<3; i++) {
        $scope.cells[i] = [];
        for(var j=0; j<3; j++) {
            $scope.cells[i][j] = {
                user: '',
                content: '·'
            };
        }
    }

    $scope.offset = false;

    $scope.assign = function  (cell, user) {
        cell.user = user;
        cell.content = 'x';
    };




    $scope.wtf = Counter.query();
    $scope.wtf.$promise.then(function(result) {
        $scope.counter = result.counter;
    });

}]);