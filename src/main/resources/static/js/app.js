angular.module('main', []).controller('mainController', ['$scope', '$http', 'socketService', MainController]);

function MainController($scope, $http, socketService) {
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

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
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

    var parseDate = d3.time.format('%d-%b-%y').parse;

    d3.csv('rest/data', function(d) {
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

        /*svg.selectAll(".point")
            .data(data)
            .enter().append("circle")
            .attr("class", "point")
            .attr("r", 4.5)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.value); })
            .append("title")
            .text(function(d) { return d.value; });*/

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);
    });
}
