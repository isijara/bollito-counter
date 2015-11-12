<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="bower_components/angular/angular.js"></script>
  <script src="bower_components/angular-route/angular-route.js"></script>
  <script src="bower_components/angular-resource/angular-resource.js"></script>
  <script src="js/app.js"></script>
  <script src="js/controllers.js"></script>
  <script src="js/services.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r73/three.min.js"></script>

  <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">

  <title>Bollito</title>
</head>
<body ng-app="bollito">

  <nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">

      <center>
        <a class="navbar-brand" href="#/">
          El precio de un bollo
        </a>
      </center>

    </div>


  </div><!-- /.container-fluid -->
</nav>

    <div class="container" ng-view></div>

</body>
</html>