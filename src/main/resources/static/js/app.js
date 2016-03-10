angular.module('main', []).controller('mainController', ['$scope', '$http', 'socketService', '$log', MainController]);

function MainController($scope, $http, socketService, $log) {

    var width = 800;
    var height = 800;

    var circleCount = 7;

    var maxCircleRadius = (height / 2 - 100);
    var minCircleRadius = 175;

    //Style
    var startColor = '#8ea1c6';
    var endColor = '#333844';

    $http.get('rest/data').then(function(res) {

        $scope.data = res.data;
        var elementCount = $scope.data.length;

        var circleScale = d3.scale.linear().domain([0, circleCount - 1]).range([minCircleRadius, maxCircleRadius]);
        var colorScale = d3.scale.linear().domain([0, circleCount - 1]).range([startColor, endColor]);

        var valueScale = d3.scale.linear().domain([0, 1000]).range([0, maxCircleRadius]);

        var svg = d3.select('body').append('svg').attr("id", "root")
            .attr('width', width)
            .attr('height', height);

        svg.selectAll('.circle')
            .data(d3.range(0, circleCount).reverse())
            .enter()
            .append('circle')
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .attr('r', function(d) {return circleScale(d)})
            .attr('class', 'circle')
            .attr('fill', function(d) {
                return colorScale(d)
            });

        svg.selectAll('.axis')
            .data(d3.range(0, elementCount).reverse())
            .enter()
            .append('line')
            .attr('x1', width / 2)
            .attr('y1', height / 2)
            .attr('x2', width / 2)
            .attr('y2', (height - 2 * maxCircleRadius) / 2)
            .attr('class', 'axis')
            .attr('transform', function(d) {
                return 'rotate(' + d * (360 / elementCount) + ' ' + width / 2 + ' ' + height / 2 + ')'
            });

        var axisPointsData = [];
        d3.range(0, elementCount).forEach(function(elementIndex) {
            d3.range(0, circleCount + 1, 2).forEach(function(circleIndex) {
                axisPointsData.push({elementIndex: elementIndex, circleIndex: circleIndex})
            });
        });

        svg.selectAll('.axisPoint')
            .data(axisPointsData)
            .enter()
            .append('circle')
            .attr('cx', width / 2)
            .attr('cy', function(d) {
                return (height - 2 * circleScale(d.circleIndex)) / 2
            })
            .attr('r', '4')
            .attr('class', 'axisPoint')
            .attr('transform', function(d) {
                return 'rotate(' + d.elementIndex * (360 / elementCount) + ' ' + width / 2 + ' ' + height / 2 + ')'
            });

        var points = svg.selectAll('.point')
            .data($scope.data)
            .enter()
            .append('circle')
            .attr('cx', width / 2)
            .attr('cy', function(d) {
                return (height - 2 * valueScale(d.value)) / 2
            })
            .attr('r', '4')
            .attr('class', 'point')
            .attr('transform', function(d, i) {
                return 'rotate(' + i * (360 / elementCount) + ' ' + width / 2 + ' ' + height / 2 + ')'
            });

        /*var chart = svg.selectAll('polygon')
            .data(points)
            .enter()
            .append('polygon')
            .attr('class', 'chart')
            .attr('points', function(d){
                //var newPoint = point.matrixTransform(d[0].getCTM());//new point after the transform
                //console.log(d.map(function(d){return d.getCMT()}));
                //return null;

                return d.map(function(d) {

                    var matrix = d.getScreenCTM().translate(d.getAttribute("cx"), d.getAttribute("cy"));
                    console.log(d.getScreenCTM());

                    /!*var cx = d3.select(d).attr('cx');
                    var cy = d3.select(d).attr('cy');
                    var ctm = d.getCTM();
                    var x = cx + d3.transform(d3.select(d).attr("transform")).translate[0];
                    var y = cy + d3.transform(d3.select(d).attr("transform")).translate[1];*!/

                    return [matrix.e - 10, matrix.f - 10].join(",");
                }).join(" ");
            })[0];*/

        /*function getElementCoords(element, coords) {
            var ctm = element.getCTM(),
                xn = ctm.e + coords.cx * ctm.a,
                yn = ctm.f + coords.cy * ctm.d;
            console.log(ctm);
            return { x: xn, y: yn };
        };
*/

    });
    /*$http.get('/rest').then(function(res){
        $scope.data = 'Rest: ' + res.data.result;
    });

    $scope.connect = function() {
        $scope.socketMessages = [];
        socketService.connect(function(response){
            $scope.socketMessages.unshift(response.body.replace(/'/g,''));
            $scope.$apply();
        });
    };

    $scope.disconnect = function() {
        socketService.disconnect();
    }*/

    /*var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select('body').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(d3.time.months);
    var yAxis = d3.svg.axis().scale(y).orient('left');

    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.value); })
        .interpolate('cardinal');

    var  area = d3.svg.area()
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.value); })
        .interpolate('cardinal');

    var parseDate = d3.time.format('%d-%b-%y').parse;*/


   /* d3.csv('rest/data', function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
        return d;
    }, function(errors, data) {

        x.domain(d3.extent(data, function(d) {return d.date;}));
        y.domain([0, d3.max(data, function(d) {return d.value;}) + 50]);

        svg.append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", y(50))
            .attr("x2", 0).attr("y2", y(120))
            .selectAll("stop")
            .data([
                {offset: "0%", color: "#ec5c75"},
                {offset: "50%", color: "#9d56b6"},
                {offset: "80%", color: "#5451f5"}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });

        svg.append("linearGradient")
            .attr("id", "area-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", y(20))
            .attr("x2", 0).attr("y2", y(60))
            .selectAll("stop")
            .data([
                {offset: "0%", color: "white"},
                {offset: "100%", color: "#eef4fb"}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });

        console.log(data);

        svg.append('path')
            .datum(data)
            .attr('class', 'area')
            .attr('d', area);

        svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', line);

        /!*svg.selectAll(".point")
            .data(data)
            .enter().append("circle")
            .attr("class", "point")
            .attr("r", 4.5)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.value); })
            .append("title")
            .text(function(d) { return d.value; });*!/

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);
    });*/
}
