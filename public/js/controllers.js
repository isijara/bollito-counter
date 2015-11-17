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


    bollitoController.controller('buscaminasController', ['$scope', '$http', 'mySocket', function ($scope, $http, socket) {


        window.scope = $scope;

        $scope.player = '';

         $scope.players = {
                'p1': {
                    nick: '',
                    totalPoints : 0
                },

                'p2': {
                    nick: '',
                    totalPoints : 0
                }

            };





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
                this.classType      = 'btn-info';
                this.fontColor      = '';
            };

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
                    if(!this.isBomb) { //this.getValue() === 0 &&
                        this.classType = 'btn-warning';
                    }

                    if(this.isBomb && player == 'p1') {
                        this.classType = 'btn-danger';
                    }
                    if(this.isBomb && player == 'p2') {
                        this.classType = 'btn-primary';
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
                        this.fontColor = 'land';
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
                            this.fontColor = 'black';
                            break;
                        case 5:
                            this.fontColor = 'blue';
                            break;
                    }
                };


            var Board = function(size) {
                var self = this;
                    self.size = size;
                    self.cells = [];
                    self.totalBombs = 51;//(self.size*self.size/8);

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
                var x = cell.coordinateX,
                    y = cell.coordinateY;




                if (this.isValidCell(x, y)) {
                    if(cell.blocked)
                        if(cell.getValue() === 0 && !cell.isBomb) {
                            cell.play(player);
                            var cells = this.getAdyacentCells(cell);
                            for(var index in cells) {
                                var adyacentCell = cells[index];
                                if (adyacentCell.getValue() === 0) {
                                    this.playCell(adyacentCell, player);
                                } else {
                                    adyacentCell.play(player);
                                }
                            }

                        } else {
                            cell.play(player);

                            this.totalBombs--;
                            $scope.players[player].totalPoints++;

                        }

                }


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

        $scope.replicateBoard = function(board) {
            for(var i = 0; i < $scope.board.cells.length; i++) {
                for(var j = 0; j < $scope.board.cells.length; j++) {
                    $scope.board.cells[i][j].player         = board.cells[i][j].player;
                    $scope.board.cells[i][j].value          = board.cells[i][j].value;
                    $scope.board.cells[i][j].label          = board.cells[i][j].label;
                    $scope.board.cells[i][j].isBomb         = board.cells[i][j].isBomb;

                    $scope.board.cells[i][j].blocked        = board.cells[i][j].blocked;

                    $scope.board.cells[i][j].coordinateX    = board.cells[i][j].coordinateX;
                    $scope.board.cells[i][j].coordinateY    = board.cells[i][j].coordinateY;
                    $scope.board.cells[i][j].classType      = board.cells[i][j].classType;
                    $scope.board.cells[i][j].fontColor      = board.cells[i][j].fontColor;
                }
            }
        };

        $scope.sendBoard = function() {
            var gameData = {
                gameBoard : $scope.board,
                totalPointsP1: $scope.players['p1'].totalPoints,
                totalPointsP2: $scope.players['p2'].totalPoints
            };

            socket.emit('movement', gameData);
        };

        socket.on('initGame', function (gameData) {
            console.log('initGame');
            $scope.board = new $scope.Buscaminas(16);
            socket.emit('setGameBoard', $scope.board);
            console.log('board', $scope.board);
            $scope.player = gameData.player;
            $scope.players['p1'].totalPoints = 0;
            $scope.players['p2'].totalPoints = 0;
        });



        socket.on('joinGame', function (gameData) {

            $scope.board = new $scope.Buscaminas(16);
            $scope.replicateBoard(gameData.gameBoard);
            $scope.player = 'p2';
        });

        socket.on('rivalsMove', function (gameData) {
            console.log('acepto movimiento rival');
            $scope.replicateBoard(gameData.gameBoard);
            $scope.players['p1'].totalPoints = gameData.totalPointsP1;
            $scope.players['p2'].totalPoints = gameData.totalPointsP2;
            $scope.board.totalBombs = 51 - (gameData.totalPointsP1 + gameData.totalPointsP2);
        });




    }]);
})();