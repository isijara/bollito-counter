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




        $scope.Buscaminas = function (size) {

            var self = this;
            $scope.boardSize = size;
            $scope.cellWidth = 100/$scope.boardSize;

            $scope.unlockCell = function  (cell) {
                cell.blocked = false;
            };

            var Cell = function (coordinateX, coordinateY) {
                this.player         = '';
                this.value          = 0;
                this.label          = null;
                this.isBomb         = false;
                this.blocked        = true;
                this.coordinateX    = coordinateX;
                this.coordinateY    = coordinateY;
                this.classType      = 'btn-default';
                this.fontColor      = '';


                Cell.prototype.setBomb = function () {
                        this.value = 0;
                        this.label = '@';
                        this.isBomb = true;
                };

                Cell.prototype.setBomb = function () {
                    this.label = '@';
                    this.isBomb = true;
                };

                Cell.prototype.getCoordinateX = function() {
                    return this.coordinateX;
                };

                Cell.prototype.getCoordinateY = function() {
                    return this.coordinateY;
                };

                Cell.prototype.play = function(player) {
                    this.player = player;
                    this.blocked = false;
                    if(this.getValue() === 0 && !this.isBomb) {
                        this.classType = 'btn-info';
                    }

                    if(this.isBomb && player == 'p1') {
                        this.classType = 'btn-danger';
                    }

                    this.setFontColor();

                };

                Cell.prototype.setGuide = function() {
                    if(!this.isBomb)
                        this.value +=  1;

                };

                Cell.prototype.getValue = function() {
                    return this.value;
                };

                Cell.prototype.setFontColor = function() {

                    if(!this.isBomb && this.value === 0) {
                        this.fontColor = 'water';
                    }
                    switch(this.value) {


                        case 1:
                            this.fontColor = 'blue';
                            break;
                        case 2:
                            this.fontColor = 'green';
                            break;
                        case 3:
                            this.fontColor = 'red';
                            break;
                        case 4:
                            this.fontColor = 'blue';
                            break;
                        case 5:
                            this.fontColor = 'blue';
                            break;

                    }
                };
            };


            var Board = function(size) {
                var self = this;
                    self.size = size;
                    self.cells = [];
                    self.totalBombs = 49;//(self.size*self.size/8);

                for(var i=0; i<self.size; i++) {
                    self.cells[i] = [];
                    for(var j=0; j<self.size; j++) {
                        self.cells[i][j] = new Cell(i,j);
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

            Board.prototype.playCell = function(cell, player) {
                var x = cell.getCoordinateX(),
                    y = cell.getCoordinateY();

                if (this.isValidCell(x, y)) {
                    if(cell.blocked)
                        if(cell.getValue() === 0 && !cell.isBomb) {
                            cell.play(player);
                            var cells = this.getAdyacentCells(cell);
                            for(var index in cells) {
                                var adyacentCell = cells[index];
                                if (adyacentCell.getValue() === 0)
                                    this.playCell(adyacentCell, player);
                            }

                        } else
                            cell.play(player);
                }
            };

            Board.prototype.getCell = function(x,y) {
                return this.cells[x][y];
            };

            Board.prototype.getAdyacentCells = function(cell) {
                var self = this;
                var adyacentCells = [];
                var i = cell.getCoordinateX();
                var y = cell.getCoordinateY();
                var celda = {};

                var addValidAdyacentCell = function  (coordI, coordY) {
                    if( self.isValidCell( coordI, coordY ) ) {
                        celda = self.cells[coordI][ coordY ];
                        adyacentCells.push(celda) ;
                    }
                };

                addValidAdyacentCell( i+1, y   );
                addValidAdyacentCell( i+1, y+1 );
                addValidAdyacentCell( i+1, y-1 );

                addValidAdyacentCell( i  , y-1 );
                addValidAdyacentCell( i  , y+1 );

                addValidAdyacentCell( i-1, y+1 );
                addValidAdyacentCell( i-1, y-1 );
                addValidAdyacentCell( i-1, y   );

                return adyacentCells;
            };


            Board.prototype.addGuide = function(x,y) {
                if (this.isValidCell(x,y))
                    this.cells[x][y].setGuide();
            };


            Board.prototype.isValidCell = function(x, y) {
                var result = ( (x >= 0 && x < this.size) &&  (y >= 0 && y<this.size));
                return result;
            };

            Board.prototype.initGame = function() {
                this.addBombs();
                this.addBoardGuide();
            };



            var game = new Board($scope.boardSize);
            game.initGame();

            return game;

        };

        $scope.printBoard = function() {
            for(var i = 0; i  < $scope.board.cells.length; i++ ) {
                var line = '';

                for(var j = 0; j < $scope.board.cells.length; j++) {
                    line = line + "  " + $scope.board.cells[i][j].value;

                }
                console.log(line);

            }
        };

        $scope.board = new $scope.Buscaminas(20);
        //$scope.board


    }]);
})();