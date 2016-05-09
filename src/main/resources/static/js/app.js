angular.module('main', []).controller('mainController', ['$scope', '$http', 'socketService', MainController]);

function MainController() {
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

    var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(d3.time.months).tickSize(0);
    var yAxis = d3.svg.axis().scale(y).orient('left').tickSize(-width);

    function xCustomAxis(g) {
        g.selectAll('text')
            .attr('dy', 20);
    }

    function yCustomAxis(g) {
        g.selectAll('text')
            .attr('x', -20);
    }

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

        console.log(data);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .call(xCustomAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .call(yCustomAxis);

        svg.append('path')
            .datum(data)
            .attr('class', 'area')
            .attr('d', area);

        svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', line);

        svg.selectAll('.point')
            .data(data)
            .enter().append('circle')
            .attr('class', 'point')
            .attr('r', 5)
            .attr('cx', function(d) { return x(d.date); })
            .attr('cy', function(d) { return y(d.value); });

        var selector = svg.append('g');

        selector.append('line')
            .attr('class', 'selector-line')
            .attr('x1', function() { return x(data[3].date); })
            .attr('y1', function() { return y(data[3].value); })
            .attr('x2', function() { return x(data[3].date); })
            .attr('y2', function() { return height; });

        selector.append('line')
            .attr('class', 'selector-line')
            .attr('stroke-dasharray', '3, 3')
            .attr('x1', function() { return x(data[3].date); })
            .attr('y1', function() { return y(data[3].value); })
            .attr('x2', function() { return x(data[3].date); })
            .attr('y2', function() { return 0; });

        selector.append('circle')
            .attr('class', 'selector-point')
            .attr('r', 6)
            .attr('cx', function() { return x(data[3].date); })
            .attr('cy', function() { return y(data[3].value); });
    });

    /*Gradients*/
    var defs = svg.append('defs');

    //chart gradient
    var chartAreaGradient = defs.append('linearGradient')
        .attr('id', 'chart-area-gradient');

    chartAreaGradient
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

    chartAreaGradient.append('stop')
        .attr('offset', '10%')
        .attr('stop-color', '#6ddce7')
        .attr('stop-opacity', '0.9');


    chartAreaGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#383d48')
        .attr('stop-opacity', '0');

    //shadow filter
    var filter = defs.append('filter')
        .attr('id', 'shadow')
        .attr('x', '-100%')
        .attr('y', '-100%')
        .attr('height', '300%')
        .attr('width', '300%');

    filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 4)
        .attr('result', 'blur');

    filter.append('feOffset')
        .attr('in', 'blur')
        .attr('result', 'offsetBlur');

    filter.append('feFlood')
        .attr('in', 'offsetBlur')
        .attr('flood-color', '#2adaf8')
        .attr('flood-opacity', '1')
        .attr('result', 'offsetColor');

    filter.append('feComposite')
        .attr('in', 'offsetColor')
        .attr('in2', 'offsetBlur')
        .attr('operator', 'in')
        .attr('result', 'offsetBlur');

    var feMerge = filter.append('feMerge');

    feMerge.append('feMergeNode')
        .attr('in', 'offsetBlur');
    feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');
}
