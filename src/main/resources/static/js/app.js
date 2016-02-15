angular.module('main', []).controller('mainController', ['$scope', '$http', 'socketService', '$log', MainController]);

function MainController($scope, $http, socketService, $log) {
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

    var armGroup = Body.nextGroup(true);

    var armPartA = Bodies.rectangle(385, 480, 100, 10, {
        isStatic: true,
        collisionFilter: {
            group: armGroup
        },
        render: {
            strokeStyle: Common.shadeColor('#C44D58', -20),
            fillStyle: '#C44D58'
        }
    });
    bodies.push(armPartA);
    var armPartB = Bodies.rectangle(340, 525, 15, 100, {
        isStatic: true,
        collisionFilter: {
            group: armGroup
        },
        render: {
            strokeStyle: Common.shadeColor('#C44D58', -20),
            fillStyle: '#C44D58'
        }
    });
    bodies.push(armPartB);
    var armJoinA = Bodies.circle(340, 480, 5, {
        isStatic: true,
        collisionFilter: {
            group: armGroup
        },
        render: {
            strokeStyle: Common.shadeColor('green', -20),
            fillStyle: 'green'
        }
    });
    bodies.push(armJoinA);
    var armJoinB = Bodies.circle(340, 570, 5, {
        isStatic: true,
        collisionFilter: {
            group: armGroup
        },
        render: {
            strokeStyle: Common.shadeColor('green', -20),
            fillStyle: 'green'
        }
    });
    bodies.push(armJoinB);



    var speed = 0.005;
    Events.on(engine, 'afterUpdate', function() {
        var oldX = armJoinA.position.x;
        var oldY = armJoinA.position.y;
        if ($scope.engine.b != 0) {
            var stepB = $scope.engine.b > 0 ? speed : -speed;
            rotate(Body, armPartB, stepB, {
                x: armJoinB.position.x,
                y: armJoinB.position.y
            });
            rotate(Body, armJoinA, stepB, {
                x: armJoinB.position.x,
                y: armJoinB.position.y
            });
            $scope.engine.b -= stepB;
            if ((stepB < 0 && $scope.engine.b >= 0) || (stepB > 0 && $scope.engine.b <= 0)) {
                $scope.engine.a = 0;
            }
            if ($scope.engine.a == 0) {
                Body.translate(armPartA, {
                    x: armJoinA.position.x - oldX,
                    y: armJoinA.position.y - oldY
                });
            }
        }
        if ($scope.engine.a != 0) {
            var stepA = $scope.engine.a > 0 ? speed : -speed;
            rotate(Body, armPartA, stepA, {
                x: armJoinA.position.x,
                y: armJoinA.position.y
            });

            $scope.engine.a -= stepA;
            if ((stepA < 0 && $scope.engine.a >= 0) || (stepA > 0 && $scope.engine.a <= 0)) {
                $scope.engine.a = 0;
            }
            if (oldX != armJoinA.position.x || oldY != armJoinA.position.y) {
                Body.translate(armPartA, {
                    x: armJoinA.position.x - oldX,
                    y: armJoinA.position.y - oldY
                });
            }
        }

        /*rotate(Body, armPartA, -0.01, {
            x: armJoinA.position.x,
            y: armJoinA.position.y
        });*/
        /*Body.translate(point, {
            x: Math.sin(time * 0.001), y: Math.cos(time * 0.001)
        });*/
        /*Body.translate(armPartA, {
            x: Math.sin(time * 0.001), y: Math.cos(time * 0.001)
        })*/
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

    $scope.applyToEngines = function () {
        $scope.engine.a = parseFloat($scope.aEngineAngle);
        $scope.engine.b = parseFloat($scope.bEngineAngle);
        $scope.engine.a = isNaN($scope.engine.a) ? 0 : $scope.engine.a;
        $scope.engine.b = isNaN($scope.engine.b) ? 0 : $scope.engine.b;

        $scope.aEngineAngle = '';
        $scope.bEngineAngle = '';
    }

}

function rotate(MatterBody, body, rotation, point) {
    var cos = Math.cos(rotation),
        sin = Math.sin(rotation),
        dx = body.position.x - point.x,
        dy = body.position.y - point.y;

    MatterBody.setPosition(body, {
        x: point.x + (dx * cos - dy * sin),
        y: point.y + (dx * sin + dy * cos)
    });

    MatterBody.rotate(body, rotation);
}
