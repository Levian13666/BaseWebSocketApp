angular.module('main', []).controller('mainController', ['$scope', '$rootScope', '$http', 'socketService', '$log', MainController]);

function MainController($scope, $rootScope, $http, socketService, $log) {
    /*$http.get('/rest').then(function(res){
     $scope.data = 'Rest: ' + res.data.result;
     });

     $scope.connect = function() {
     $scope.socketMessages = [];
     socketService.connect(function(response){
     $scope.socketMessages.unshift(response.body.replace(/"/g,''));
     $scope.$apply();
     });
     };

     $scope.disconnect = function() {
     socketService.disconnect();
     }*/

    $scope.engine = {a: 0, b: 0};
    $log.log('Start...');

    var Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Events = Matter.Events,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Common = Matter.Common,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint;


    // create a Matter.js engine
    var engine = Engine.create(document.body);

    var bodies = [];

    // create two boxes and a ground

    var ball = Bodies.circle(380, 400, 10, { restitution: 1.3, friction: 0.2 });
    //bodies.push(ball);

    var arm = Arm.create(340, 250, 5, [{width: 15, height: 100}, {width: 10, height: 75}, {width: 25, height: 50}]);
    arm.render(engine.world);

    Events.on(engine, 'afterUpdate', function() {
        arm.update();
        var time = engine.timing.timestamp;

        arm.applyForceToJoin({index: 0, speed: 0.02, angle: 1.5 * Math.sin(time)});
        arm.applyForceToJoin({index: 1, speed: 0.03, angle: Math.cos(time)});
        arm.applyForceToJoin({index: 2, speed: 0.01, angle: -Math.sin(time)});

        if ($scope.angle0 == 0) {
            console.log(1);
            $scope.angle0 = arm.armParts[0].angle;
        }
    });


    var ground = Bodies.rectangle(400, 610, 800, 60, {
        isStatic: true,
        render: {
            strokeStyle: Common.shadeColor('gray', -20),
            fillStyle: 'gray'
        }
    });
    bodies.push(ground);

    // add all of the bodies to the world
    World.add(engine.world, bodies);

    var renderOptions = engine.render.options;
    renderOptions.wireframes = false;
    renderOptions.background = '#222';
    renderOptions.showAxes = true;
    renderOptions.showPositions = true;
    renderOptions.showConvexHulls = true;
    renderOptions.showCollisions = true;
    renderOptions.showVelocity = true;
    renderOptions.showAngleIndicator = true;

    // run the engine
    Engine.run(engine);

    $log.log('Finish...');
}
