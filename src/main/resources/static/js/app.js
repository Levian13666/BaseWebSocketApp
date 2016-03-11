angular.module('main', []).controller('mainController', ['$scope', '$http', MainController]);

function MainController($scope, $http) {

    var width = 900;
    var height = 900;

    var circleCount = 7;

    var maxCircleRadius = (height / 2 - 110);
    var minCircleRadius = 175;

    //style
    var startColor = '#8ea1c6';
    var endColor = '#333844';

    $http.get('rest/data').then(function(res) {

        $scope.data = res.data;
        var elementCount = $scope.data.length;

        var circleScale = d3.scale.linear().domain([0, circleCount - 1]).range([minCircleRadius, maxCircleRadius]);
        var colorScale = d3.scale.linear().domain([0, circleCount - 1]).range([startColor, endColor]);

        var valueScale = d3.scale.linear().domain([0, 1000]).range([0, maxCircleRadius]);

        $scope.data.forEach(function(d, i){
            d.index = i;
            d.textPosition = rotateAroundPoint([width / 2, height / 2], [width / 2, (height + 2 * maxCircleRadius) / 2 + 70], - i * (360 / elementCount));
            d.pointPosition = rotateAroundPoint([width / 2, height / 2], [width / 2, (height + 2 * valueScale(d.value)) / 2], - i * (360 / elementCount));
            d.axisPosition = rotateAroundPoint([width / 2, height / 2], [width / 2, (height + 2 * maxCircleRadius) / 2], i * (360 / elementCount));
        });

        var svg = d3.select('body').append('svg').attr('id', 'root')
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
            .data($scope.data)
            .enter()
            .append('line')
            .attr('x1', width / 2)
            .attr('y1', height / 2)
            .attr('x2', function(d) {return d.axisPosition.x})
            .attr('y2', function(d) {return d.axisPosition.y})
            .attr('class', 'axis');

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

        svg.selectAll('polygon')
            .data([$scope.data])
            .enter()
            .append('polygon')
            .attr('class', 'chart')
            .attr('points', function(d){
                return d.map(function(d) {
                    return [d.pointPosition.x, d.pointPosition.y].join(',');
                }).join(' ');
            });

        svg.selectAll('.point')
            .data($scope.data)
            .enter()
            .append('circle')
            .attr('cx', function(d) { return d.pointPosition.x})
            .attr('cy', function(d) { return d.pointPosition.y})
            .attr('r', '5')
            .attr('class', 'point')
            ;

        svg.selectAll('.labels')
            .data($scope.data)
            .enter()
            .append('text')
            .attr('x', function(d) {return d.textPosition.x})
            .attr('y', function(d) {return d.textPosition.y})
            .attr('text-anchor', 'middle')
            .attr('class', 'label')
            .text(function(d) {return d.name})
            .call(processText, 120, function(d) {return d.value})
        /*    .on('click', select);

        var selectorArc = d3.svg.arc()
            .innerRadius(maxCircleRadius + 12)
            .outerRadius(maxCircleRadius + 14);

        var selector = svg.append('path')
            .datum({index: 0, startAngle: -0.25, endAngle: 0.25})
            .attr('class', 'selector')
            .attr('d', selectorArc)
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 +')');

        function select() {
            var index = d3.select(this).datum().index;
            console.log(index + '/' + selector.datum().index);
            if (index == 11 && selector.datum().index == 0) {
                selector.datum().index = 12;
            }
            var rotation = index - selector.datum().index;

            selector.datum().index = index;
            selector.transition()
                .duration(500)
                .call(function(transition, rotation) {
                    transition.attrTween("d", function(d) {
                        var interpolateStartAngle = d3.interpolate(d.startAngle, d.startAngle + rotation * .5);
                        var interpolateEndAngle = d3.interpolate(d.endAngle, d.endAngle + rotation * .5);
                        return function(t) {
                            d.startAngle = interpolateStartAngle(t);
                            d.endAngle = interpolateEndAngle(t);
                            return selectorArc(d);
                        };
                    });
                }, rotation);
        }*/



        function processText(text, width, value) {
            text.each(function () {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    x = text.attr('x'),
                    y = text.attr('y'),
                    dy = 0,
                    tspan = text.text(null)
                        .append('tspan')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('dy', dy + 'em'),
                    dx = null,
                    trigger = false;
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(' '));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(' '));
                        if (!trigger) {
                            dx = tspan.node().getComputedTextLength() / 2;
                            trigger = true;
                        }
                        line = [word];
                        tspan = text.append('tspan')
                            .attr('text-anchor', 'start')
                            .attr('x', x - (trigger ? dx : 0))
                            .attr('y', y)
                            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                            .text(word);
                    }
                }
                if (dx == null) {
                    dx = tspan.node().getComputedTextLength() / 2;
                }

                //TODO remove this!
                tspan = text.append('tspan')
                    .attr('text-anchor', 'start')
                    .attr('x', x - dx)
                    .attr('y', y)
                    .attr('dy', ++lineNumber * lineHeight + dy - (lineNumber * 0.1) + 'em')
                    .attr('class', 'labelValue')
                    .text(value);
            });
        }

        function rotateAroundPoint(point, position, angle) {
            var sin = Math.sin(angle * Math.PI / 180);
            var cos = Math.cos(angle * Math.PI / 180);
            var dx = position[0] - point[0];
            var dy = position[1] - point[1];

            return {
                x: point[0] + (dx * cos - dy * sin),
                y: point[0] + (dx * sin - dy * cos)
            }
        }

    });

}
