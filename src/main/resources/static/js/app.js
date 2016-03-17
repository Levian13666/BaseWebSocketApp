angular.module('main', []).controller('mainController', ['$scope', '$http', MainController]);

function MainController($scope, $http) {

    var width = 400;
    var height = 100;
    var margin = 40;
    var yearMarginStart = margin - 7;
    var yearMarginEnd = margin - 35;

    var monthFormat = d3.time.format("%b");
    var yearFormat = d3.time.format("%Y");

    var svg = d3.select('body').append('svg').attr('id', 'root')
        .attr('width', width)
        .attr('height', height);

    var g = svg.append('g');

    var dateRange = d3.time.month.range(new Date(2015, 8, 1), new Date());

    g.append('line')
        .attr('x1', margin)
        .attr('y1', margin)
        .attr('x2', function() {
            return margin * (dateRange.length - 1) + margin})
        .attr('y2', margin)
        .attr('class', 'month-line');

    g.selectAll("date-month")
        .data(dateRange)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr('cx', function(d, i) {return margin * i + margin;})
        .attr('cy', margin)
        .attr('id', function(d, i) {return 'date-month-' + i})
        .attr('class', 'date-month')
        .on('click', function(d, i) {
            select(i);
        }).filter(function (d) {
            return monthFormat(d) == 'Jan';
        });

    g.selectAll(".date-month").each(function(d, i){
        if (monthFormat(d) == 'Jan') {
            g.insert('line', ":first-child")
                .attr('x1', function () {
                    return margin * i + margin;
                })
                .attr('y1', yearMarginStart)
                .attr('x2', function () {
                    return margin * i + margin;
                })
                .attr('y2', yearMarginEnd)
                .attr('class', 'year-line');

            g.insert('text', ":first-child")
                .attr('x', function () {
                    return margin * i + margin + 5;
                })
                .attr('y', yearMarginEnd + 5)
                .text(yearFormat(d))
                .attr('class', 'date-year-label');
        }
    });

    g.selectAll("label")
        .data(dateRange)
        .enter()
        .append("text")
        .attr('x', function(d, i) {return margin * i + margin;})
        .attr('y', margin + 20)
        .attr('text-anchor', 'middle')
        .attr('id', function(d, i) {return 'date-label-' + i})
        .attr('class', 'date-label')
        .text(function(d) {
            return monthFormat(d);
        })
        .on('click', function(d, i) {
            select(i);
        });

    function select(i) {
        d3.selectAll('.date-label').classed('date-label-selected', false);
        d3.select('#date-label-' + i).classed('date-label-selected', true);
        d3.selectAll('.date-month').classed('date-month-selected', false);
        d3.select('#date-month-' + i).classed('date-month-selected', true);
    }

    /*Gradients*/
    svg.append("linearGradient")
        .attr("id", "year-line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", yearMarginStart)
        .attr("x2", 0).attr("y2", yearMarginEnd)
        .selectAll("stop")
        .data([
            {offset: "10%", color: "#2adaf8"},
            {offset: "100%", color: "#383d48"}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    svg.append("linearGradient")
        .attr("id", "month-line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", margin)
        .attr("x2", width).attr("y2", margin)
        .selectAll("stop")
        .data([
            {offset: "1%", color: "#383d48"},
            {offset: "100%", color: "#2adaf8"}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    /*Shadow Filter*/
    var defs = svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "shadow")
        .attr("x", "-100%")
        .attr("y", "-100%")
        .attr("height", "300%")
        .attr("width", "300%");

    filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 4)
        .attr('result', 'blur');

    filter.append('feOffset')
        .attr('in', 'blur')
        .attr('result', 'offsetBlur');

    filter.append("feFlood")
        .attr("in", "offsetBlur")
        .attr("flood-color", '#2adaf8')
        .attr("flood-opacity", "1")
        .attr("result", "offsetColor");

    filter.append("feComposite")
        .attr("in", "offsetColor")
        .attr("in2", "offsetBlur")
        .attr("operator", "in")
        .attr("result", "offsetBlur");

    var feMerge = filter.append('feMerge');

    feMerge.append('feMergeNode')
        .attr('in', 'offsetBlur');
    feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');

}
