var appServices = angular.module('appServices', ['ngResource']);

appServices.factory('Counter', ['$resource',
    function ($resource) {
        return $resource('counter', {}, {
            query: { method: 'GET', params: {}, isArray: false }
        });
    }]);

appServices.factory('mySocket', function  (socketFactory) {
    var socket = io.connect('192.168.1.66:3000');
    mySocket = socketFactory({
        ioSocket : socket
    });
    return mySocket;
});
