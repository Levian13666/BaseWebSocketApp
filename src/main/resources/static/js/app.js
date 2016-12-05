angular.module('main', []).controller('mainController', ['$scope', '$http', 'socketService', MainController]);

function MainController($scope, $http, socketService) {

    $scope.layer_c = 1;
    $scope.nodes_per_layer = 3;
    $scope.step = 1;
    $scope.iterations = 10000;

    var data = [];

    function Network(step) {
        this.layers = [];
        this.outputNode = new Unit(step);
        this.forward = function (input) {
            for (var i = 0; i < this.layers.length; i++) {
                var xVector = [];
                if (i == 0) {
                    xVector = input;
                } else {
                    for (var j = 0; j < this.layers[i - 1].length; j++) {
                        xVector.push(this.layers[i - 1][j].p);
                    }
                }
                for (var j = 0; j < this.layers[i].length; j++) {
                    this.layers[i][j].forward(xVector);
                }
            }
            var pXVector = [];
            for (var i = 0; i < this.layers[this.layers.length - 1].length; i++) {
                pXVector.push(this.layers[this.layers.length - 1][i].p);
            }
            this.outputNode.forward(pXVector);
            return this.outputNode.p;
        };
        this.backward = function (t) {
            this.outputNode.d = (t - this.outputNode.p) * d_sigm(this.outputNode.p);
            this.outputNode.backward();
            for (var i = this.layers.length - 1; i >= 0; i--) {
                for (var j = 0; j < this.layers[i].length; j++) {
                    if (i == this.layers.length - 1) {
                        this.layers[i][j].d = this.outputNode.w[j] * this.outputNode.d * d_sigm(this.layers[i][j].p);
                    } else {
                        var d = 0;
                        for (var k = 0; k < this.layers[i + 1].length; k++) {
                            d += this.layers[i + 1][k].w[j] * this.layers[i + 1][k].d;
                        }
                        this.layers[i][j].d = d * d_sigm(this.layers[i][j].p);
                    }
                    this.layers[i][j].backward();
                }
            }
        }
    }

    function Unit(step) {
        this.x = null;
        this.w = [];
        this.p = null;
        this.d = null;
        this.b = null;
        this.step = step;
        this.forward = function (x) {
            if (this.w.length == 0) {
                for (var i = 0; i < x.length; i++) {
                    this.w.push(math.random());
                }
                this.b = Math.random(0, 1);
            }
            this.x = x;
            this.p = sigm(math.dot(x, this.w) + this.b);
        };
        this.backward = function () {
            for (var i = 0; i < this.w.length; i++) {
                this.w[i] += this.step * this.d * this.x[i];
            }
            this.b += this.step * this.d;
        }
    }

    function draw() {
        var width = 500;
        var height = 500;

        var dataRange = [{
            x: -20,
            y: 20
        }, {
            x: -40,
            y: -30
        }, {
            x: 0,
            y: 0
        }, {
            x: -20,
            y: -20
        }];

        var svg = d3.select("svg").attr("width", width).attr("height", height).append('g')
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        $scope.svg = svg;

        d3.select("svg").on("click", function () {
            addPoint(d3.mouse(this), 1);
        }).on("contextmenu", function () {
            d3.event.preventDefault();
            addPoint(d3.mouse(this), 0);
        });

        function addPoint(mouse, value) {
            var point = {
                x: (mouse[0] - width / 2),
                y: -(mouse[1] - height / 2),
                value: value,
                coordinates: mouse
            };
            data.push(point);
            svg.append("circle").attr("r", 5).attr("cx", point.x).attr("cy", -point.y).attr("fill", value == 1 ? "red" : "blue").attr("class", "data");
        }

        function resultFX(x) {
            var yRange = d3.range(-1000, 1000);
            var m = nn(x, yRange[0]);
            for (var y = 1; y < yRange.length; y++) {
                if (nn(x, yRange[y]) != m) {
                    return yRange[y];
                }
            }
            return yRange[0];
        }

        function resultFY(y) {
            var xRange = d3.range(-1000, 1000);
            var m = nn(xRange[0], y);
            for (var x = 1; x < xRange.length; x++) {
                if (nn(xRange[x], y) != m) {
                    return xRange[x];
                }
            }
            return xRange[0];
        }

        function nn(x, y) {
            var result = -1;
            if (x > y && x > 10) {
                result = 1;
            }
            return result;
        }
    }

    function sigm(x) {
        return 1 / (1 + Math.exp(-x));
    }

    function d_sigm(x) {
        return x * (1 - x);
    }

//########################################################################

    draw();

    $scope.run = function () {
        var net = new Network($scope.step);
        for (var i = 0; i < $scope.layer_c; i++) {
            net.layers[i] = [];
            for (var j = 0; j < $scope.nodes_per_layer; j++) {
                net.layers[i][j] = new Unit($scope.step);
            }
        }

        for (var i = 0; i < $scope.iterations; i++) {
            var successCount = 0;
            for (var j = 0; j < data.length; j++) {
                var record = data[j];
                net.forward([(record.x + 500) / 1000, (record.y + 500) / 1000]);
                if (math.round(net.outputNode.p * 10) == record.value) {
                    successCount++;
                }
                /*if (i % 200 == 0 && j == 0) {
                 console.log(record.value + " / " + net.outputNode.p.toFixed(2));
                 }*/
                net.backward(record.value / 10);
            }
            var successRate = successCount / data.length * 100;
            if (successRate == 100) {
                console.log("iteration #" + i + " success rate " + successRate.toFixed(2) + "%");
                console.log("#COMPLETE#");
                break;
            }
            if (i % 200 == 0) {
                console.log("iteration #" + i + " success rate " + successRate.toFixed(2) + "%");
            }

        }

        /*for (var y = 0; y < range.length; y += 5) {
            var m = f(net, range[0], range[y]);
            for (var x = 1; x < range.length; x += 1) {
                if (f(net, range[x], range[y]) != m) {
                    console.log('draw');
                    m = f(net, range[x], range[y]);
                    $scope.svg.append("circle").attr("r", 1).attr("cx", range[x]).attr("cy", -range[y]).attr("class", "plot");
                }
            }
        }*/

        draw_plot(net);

        function f(net, x, y) {
            return math.round(net.forward([x, y]) * 10);
        }

        function draw_plot(net) {
            $scope.svg.selectAll(".plot").remove();
            var range = d3.range(-250, 250);
            for (var x = 0; x < range.length; x += 5) {
                for (var y = 0; y < range.length; y += 5) {
                    $scope.svg.append("circle").attr("r", 3).attr("cx", range[x]).attr("cy", -range[y]).attr("class", "plot").attr("fill", f(net, (range[x] + 500) / 1000, (range[y] + 500) / 1000) == 1 ? "red" : "blue").attr("stroke", 0).attr("fill-opacity", .1);
                }
            }
        }
    }

    $scope.clear = function() {
        $scope.svg.selectAll(".plot").remove();
    }

    $scope.clearData = function() {
        data = [];
        $scope.svg.selectAll(".data").remove();
    }

    $scope.data = function() {
        console.log(data);
    }

}
