(function() {

    'use strict';

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


    bollitoController.controller('buscaminasController', ['$scope', '$http', function ($scope, $http) {

        window.scope = $scope;

        $scope.boardSize = 14;

        $scope.Buscaminas = function (size) {

            var self = this;

            $scope.unlockCell = function  (cell) {
                cell.blocked = false;
            };

            var Cell = function () {
                this.player  = '';
                this.value   = 0;
                this.label   = null;
                this.isBomb  = false;
                this.blocked = true;


                Cell.prototype.setBomb = function () {
                        this.value = 0;
                        this.label = '@';
                        this.isBomb = true;
                };

                Cell.prototype.setBomb = function () {

                    this.label = '@';
                    this.isBomb = true;
                };

                Cell.prototype.play = function(player) {
                    this.player = player;
                    this.blocked = false;
                };

                Cell.prototype.setGuide = function() {
                        this.value +=  1;
                };

                Cell.prototype.getValue = function() {
                    return this.value;
                };
            };


            var Board = function(size) {
                var self = this;
                    self.size = size;
                    self.cells = [];
                    self.totalBombs = (self.size*self.size/4);

                console.log(self.cells);

                for(var i=0; i<self.size; i++) {
                    self.cells[i] = [];
                    for(var j=0; j<self.size; j++) {
                        self.cells[i][j] = new Cell();
                    }
                }
            };


            Board.prototype.addBombs = function() {
                var self = this,
                    totalBombs = self.totalBombs;

                while(totalBombs !== 0) {
                    var x = Math.floor((Math.random() * self.size) );
                    var y = Math.floor((Math.random() * self.size) );

                    if(!this.cells[x][y].isBomb) {
                        this.cells[x][y].setBomb();
                        totalBombs--;
                    }
                }
                console.log('Finish');
            };

            Board.prototype.addBoardGuide = function() {
                for(var i = 0; i < this.size; i++)
                    for(var j = 0; j < this.size; j++)
                        if(this.cells[i][j].isBomb)
                        {
                            for(var k =-1; k<=1; k++) {
                                this.addGuide(i+1, j+k);
                                this.addGuide(i-1, j+k);
                            }
                            this.addGuide(i, j-1);
                            this.addGuide(i, j+1);
                        }
            };

            Board.prototype.playCell = function() {
                if(this.isValidCell(x, y)) {
                    if(this.board[x][y].blocked())
                        if(this.board[x][y].getValue() == 0) {
                            this.board[x][y].play();
                            this.playCell(x+1, y);
                            this.playCell(x+1, y+1);
                            this.playCell(x+1, y-1);
                            this.playCell(x-1, y);
                            this.playCell(x, y-1);
                            this.playCell(x, y+1);
                        } else
                            this.board[x][y].play();
                }
            };


            Board.prototype.addGuide = function(x,y) {
                if (this.isValidCell(x,y))
                    this.cells[x][y].setGuide();
            };


            Board.prototype.isValidCell = function(x, y) {
                return ( (x >= 0 && x < this.size) &&  (y >= 0 && y<this.size));
            };

            Board.prototype.initGame = function() {
                this.addBombs();
                this.addBoardGuide();
            };

            var game = new Board($scope.boardSize);
            game.initGame();

            return game;

        };


        $scope.board = new $scope.Buscaminas(14);
        //$scope.board


    }]);
})();