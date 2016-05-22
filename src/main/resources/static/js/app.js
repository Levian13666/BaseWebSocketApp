angular.module('main', []).controller('mainController', ['$scope', '$http', MainController]);

function MainController($scope, $http) {


    var startDate = new Date(2001, 1, 1);
    var endDate = new Date();

    var width = 420;
    var height = 100;
    var monthCircleMargin = 40;
    var yearMarginStart = monthCircleMargin - 7;
    var yearMarginEnd = monthCircleMargin - 35;

    var monthCircleRadius = 5;

    var datePickerMargin = 40;
    var visibleMonthCount = 7;

    var scrollPosition = visibleMonthCount - 1;

    var monthFormat = d3.time.format("%b");
    var yearFormat = d3.time.format("%Y");

    var svg = d3.select('body').append('svg').attr('id', 'root')
        .attr('width', width)
        .attr('height', height);

    var dateRange = d3.time.month.range(startDate, endDate);
    var yearRange = d3.time.year.range(startDate, endDate);

    svg.append('line')
        .attr('x1', monthCircleMargin)
        .attr('y1', monthCircleMargin)
        .attr('x2', function() {
            return monthCircleMargin * (visibleMonthCount - 1) + monthCircleMargin - monthCircleRadius})
        .attr('y2', monthCircleMargin)
        .attr('class', 'month-line')
        .attr("transform", "translate(" + datePickerMargin + ", 0)");

    var datePicker = svg.append('g')
        .attr("transform", "translate(" + datePickerMargin + ", 0)");

    datePicker.selectAll(".date-month")
        .data(dateRange)
        .enter()
        .append("circle")
        .attr("r", monthCircleRadius)
        .attr('cx', function(d, i) {return monthCircleMargin * i + monthCircleMargin;})
        .attr('cy', monthCircleMargin)
        .attr('id', function(d, i) {return 'date-month-' + i})
        .attr('class', 'date-month')
        .on('click', function(d, i) {
            select(i);
        }).filter(function (d) {
            return monthFormat(d) == 'Jan';
        });

    datePicker.selectAll(".date-month").each(function(d, i){
        if (monthFormat(d) == 'Jan') {
            datePicker.insert('line', ":first-child")
                .attr('x1', function () {
                    return monthCircleMargin * i + monthCircleMargin;
                })
                .attr('y1', yearMarginStart)
                .attr('x2', function () {
                    return monthCircleMargin * i + monthCircleMargin;
                })
                .attr('y2', yearMarginEnd)
                .attr('class', 'year-line');


            var select = datePicker.append('foreignObject')
                .attr('x', function () {
                    return monthCircleMargin * i + monthCircleMargin + 5;
                })
                .attr('y', yearMarginEnd + 5)
                .attr('width', 100)
                .append('xhtml:select')
                .attr('class', 'year-select')
                .on('change', function (d, i) {
                    scrollTo(getYearIndex(this.value) + 3);
                    this.value = d3.select(this).select('option[selected="selected"]').attr('value');
                });

            createYearSelectOptions(select, yearFormat(d));
        }
    });

    function createYearSelectOptions(select, selectedYear) {
        for (var i = 0; i < yearRange.length; i++) {
            var year = yearFormat(yearRange[i]);
            var option = select.append('option').attr('label', year).attr('value', year);
            if (year == selectedYear) {
                option.attr('selected', 'selected');
            }
        }
    }

    function getYearIndex(year) {
        var result = 0;
        for (var i = 0; i < dateRange.length; i++) {
            if (year == yearFormat(dateRange[i])) {
                result = i;
                break
            }
        }
        return result;
    }

    datePicker.selectAll("label")
        .data(dateRange)
        .enter()
        .append("text")
        .attr('x', function(d, i) {return monthCircleMargin * i + monthCircleMargin;})
        .attr('y', monthCircleMargin + 20)
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

    var lastMonthIndex = svg.selectAll(".date-month")[0].length - 1;

    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", monthCircleMargin + datePickerMargin - monthCircleRadius * 2)
        .attr("height", height)
        .attr("class", "scroll-button-panel");

    svg.append("rect")
        .attr("x", monthCircleMargin * visibleMonthCount + datePickerMargin + 30)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("class", "scroll-button-panel");

    var leftScroll = svg.append("g");

    leftScroll.append("path")
        .attr("transform", "translate(45," + (height / 2) + ") rotate(90)")
        .attr('class', 'scroll-button')
        .attr("d", d3.svg.symbol().type("triangle-down").size(100))
        .on('click', function(d, i) {
            scrollTo(scrollPosition - 1);
        });

    var rightScroll = svg.append("g");

    rightScroll.append("path")
        .attr("transform", "translate(" + (width - 65) + "," + (height / 2) + ") rotate(-90)")
        .attr('class', 'scroll-button')
        .attr("d", d3.svg.symbol().type("triangle-down").size(100))
        .on('click', function(d, i) {
            scrollTo(scrollPosition + 1);
        });

    var rightEndScroll = svg.append("g");

    rightEndScroll.append("path")
        .attr("transform", "translate(" + (width - 30) + "," + (height / 2) + ") rotate(-90)")
        .attr('class', 'scroll-button')
        .attr("d", d3.svg.symbol().type("triangle-down").size(100))
        .on('click', function(d, i) {
            scrollTo(lastMonthIndex);
        });

    var leftEndScroll = svg.append("g");

    leftEndScroll.append("path")
        .attr("transform", "translate(10," + (height / 2) + ") rotate(90)")
        .attr('class', 'scroll-button')
        .attr("d", d3.svg.symbol().type("triangle-down").size(100))
        .on('click', function(d, i) {
            scrollTo(visibleMonthCount - 1);
        });

    function scrollTo(monthIndex) {
        monthIndex = monthIndex < visibleMonthCount ? visibleMonthCount - 1 : monthIndex;
        scrollPosition = monthIndex;
        var month = svg.selectAll(".date-month")[0][monthIndex];
        var x = -d3.select(month).attr("cx") + visibleMonthCount * monthCircleMargin;
        datePicker.transition().attr("transform", "translate(" + (datePickerMargin + x) + ", 0)");
    }

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
        .attr("x1", 0).attr("y1", monthCircleMargin)
        .attr("x2", width).attr("y2", monthCircleMargin)
        .selectAll("stop")
        .data([
            {offset: "1%", color: "#383d48"},
            {offset: "100%", color: "#2adaf8"}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });
}
