function Arm() {

    var armParts = [];
    var armJoins = [];
    var joinForces = [];

    function render(world) {
        Matter.World.add(world, armParts);
        Matter.World.add(world, armJoins);
    }

    function update() {
        for (var i = 0; i < joinForces.length; i++) {
            var force = joinForces[i];
            if (force) {
                var armPart = armParts[force.index];
                var armJoin = armJoins[force.index];

                var step = force.angle < 0 ? -force.speed : force.speed;

                rotateAroundPoint(armPart, step, armJoin.position);
                if (force.index != armParts.length - 1) {
                    for (var j = force.index + 1; j < armParts.length; j++) {
                        var childPart = armParts[j];
                        var childJoin = armJoins[j];

                        var parentJoin = armJoins[j - 1];
                        var parentPart = armParts[j - 1];

                        var oldX = childJoin.position.x;
                        var oldY = childJoin.position.y;

                        var dx = parentPart.position.x - parentJoin.position.x;
                        var dy = parentPart.position.y - parentJoin.position.y;

                        Matter.Body.setPosition(childJoin, {
                            x: parentPart.position.x + dx,
                            y: parentPart.position.y + dy
                        });
                        Matter.Body.translate(childPart, {
                            x: childJoin.position.x - oldX,
                            y: childJoin.position.y - oldY
                        });
                    }
                }

                force.angle -= step;
                if ((step > 0 && force.angle <= 0) || (step < 0 && force.angle >= 0)) {
                    joinForces.splice(i, 1);
                }
            }
        }
    }

    function applyForceToJoin(force) {
        var exist = false;
        for (var i = 0; i < joinForces.length; i++) {
            if (force.index == joinForces[i].index) {
                exist = true;
                break
            }
        }
        if (!exist) {
            joinForces.push(force);
        }
    }

    return {
        armParts: armParts,
        armJoins: armJoins,
        render: render,
        update: update,
        applyForceToJoin: applyForceToJoin
    };
}


(function() {

    Arm.create = function (x, y, r, parts) {
        var xx = x;
        var yy = y;

        var arm = new Arm();

        var armGroup = Matter.Body.nextGroup(true);

        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            yy -= part.height / 2 - r;
            var armPart = Matter.Bodies.rectangle(xx, yy, part.width, part.height, {
                isStatic: true,
                collisionFilter: {
                    group: armGroup
                },
                render: {
                    strokeStyle: Matter.Common.shadeColor('#C44D58', -20),
                    fillStyle: '#C44D58'
                }
            });
            arm.armParts.push(armPart);
            yy -= part.height / 2 - r;
            var armJoin = Matter.Bodies.circle(xx, yy + part.height - 2 * r, r, {
                isStatic: true,
                collisionFilter: {
                    group: armGroup
                },
                render: {
                    strokeStyle: Matter.Common.shadeColor('green', -20),
                    fillStyle: 'green'
                }
            });
            arm.armJoins.push(armJoin);
        }
        return arm;
    };

})();