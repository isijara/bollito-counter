var appServices = angular.module('appServices', ['ngResource']);

appServices.factory('Counter', ['$resource',
    function ($resource) {
        return $resource('counter', {}, {
            query: { method: 'GET', params: {}, isArray: false }
        });
    }]);