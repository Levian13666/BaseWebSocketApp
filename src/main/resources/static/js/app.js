angular.module('main', []).controller('mainController', ['$scope', '$http', MainController]);

function MainController($scope, $http) {

    var width = 420;
    var height = 100;

    var startDate = new Date(2001, 1, 1);
    var endDate = new Date();

    var monthRange = d3.time.month.range(startDate, endDate);

    var svg = d3.select('body').append('svg').attr('id', 'root')
        .attr('width', width)
        .attr('height', height);

    datePiker(svg, monthRange, 7);

    function datePiker(svg, dateArray, visibleMonthCount) {
        var width = svg.attr('width');
        var height = svg.attr('height');

        var buttonPanelSize = 50;
        var monthRadius = 5;
        var monthMargin = (width - buttonPanelSize * 2  - monthRadius * 2) / (visibleMonthCount - 1);

        var scrollPosition = visibleMonthCount - 1;

        var monthFormat = d3.time.format("%b");
        var yearFormat = d3.time.format("%Y");

        var yearRange = d3.time.year.range(dateArray[0], dateArray[dateArray.length - 1]);

        svg.append('line')
            .attr('x1', buttonPanelSize + monthRadius)
            .attr('y1', height / 2)
            .attr('x2', function () {
                return buttonPanelSize + monthRadius + (visibleMonthCount - 1) * monthMargin
            })
            .attr('y2', height / 2)
            .attr('class', 'month-line');

        var datePickerContainer = svg.append('g');

        datePickerContainer.selectAll(".date-month")
            .data(dateArray)
            .enter()
            .append("circle")
            .attr("r", monthRadius)
            .attr('cx', function (d, i) {
                return buttonPanelSize + monthRadius + monthMargin * i;
            })
            .attr('cy', height / 2)
            .attr('id', function (d, i) {
                return 'date-month-' + i
            })
            .attr('class', 'date-month')
            .on('click', function (d, i) {
                select(i);
            }).filter(function (d) {
                return monthFormat(d) == 'Jan';
            });

        datePickerContainer.selectAll(".date-month").each(function (d, i) {
            if (monthFormat(d) == 'Jan') {
                datePickerContainer.insert('line', ":first-child")
                    .attr('x1', function () {
                        return buttonPanelSize + monthRadius + monthMargin * i;
                    })
                    .attr('y1', 0)
                    .attr('x2', function () {
                        return buttonPanelSize + monthRadius + monthMargin * i;
                    })
                    .attr('y2', height / 2)
                    .attr('class', 'year-line');

                var select = datePickerContainer.append('foreignObject')
                    .attr('x', function () {
                        return buttonPanelSize + monthRadius + monthMargin * i + 1;
                    })
                    .attr('y', 0)
                    .attr('width', 100)
                    .append('xhtml:select')
                    .attr('class', 'year-select')
                    .on('change', function () {
                        scrollTo(getYearIndex(this.value) + 3);
                        this.value = d3.select(this).select('option[selected="selected"]').attr('value');
                    });

                createYearSelectOptions(select, yearFormat(d));
            }
        });

        datePickerContainer.selectAll("label")
            .data(dateArray)
            .enter()
            .append("text")
            .attr('x', function (d, i) {
                return buttonPanelSize + monthRadius + monthMargin * i;
            })
            .attr('y', height / 2 + monthRadius * 3)
            .attr('text-anchor', 'middle')
            .attr('id', function (d, i) {
                return 'date-label-' + i
            })
            .attr('class', 'date-label')
            .text(function (d) {
                return monthFormat(d);
            })
            .on('click', function (d, i) {
                select(i);
            });

        var lastMonthIndex = svg.selectAll(".date-month")[0].length - 1;

        /*Buttons*/
        svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", buttonPanelSize - monthRadius)
            .attr("height", height)
            .attr("class", "scroll-button-panel");

        svg.append("rect")
            .attr("x", width - buttonPanelSize + monthRadius + 30)
            .attr("y", 0)
            .attr("width", buttonPanelSize)
            .attr("height", height)
            .attr("class", "scroll-button-panel");

        scrollButton(
            svg,
            'img/left_scroll.png',
            19,
            36,
            'translate(' + (buttonPanelSize + monthRadius - 25) + ', 41) scale(0.5, 0.5)'
        ).on('click', function () {
            scrollTo(scrollPosition - 1);
        });
        scrollButton(
            svg,
            'img/right_scroll.png',
            19,
            36,
            'translate(' + (width - 40) + ', 41) scale(0.5, 0.5)'
        ).on('click', function () {
            scrollTo(scrollPosition + 1);
        });
        scrollButton(
            svg,
            'img/left_end_scroll.png',
            44,
            20,
            'translate(0, 45) scale(0.5, 0.5)'
        ).on('click', function () {
            scrollTo(visibleMonthCount - 1);
        });
        scrollButton(
            svg,
            'img/right_end_scroll.png',
            44,
            20,
            'translate(' + (width - 44 / 2) + ', 45) scale(0.5, 0.5)'
        ).on('click', function () {
            scrollTo(lastMonthIndex);
        });

        function scrollButton(container, url, imgWidth, imgHeight, transform) {
            return container.append('svg:image')
                .attr({
                    'x': 0,
                    'y': 0,
                    'width': imgWidth,
                    'height': imgHeight,
                    'xlink:href': url,
                    'class': 'scroll-button',
                    'transform': transform
                });
        }

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
            for (var i = 0; i < dateArray.length; i++) {
                if (year == yearFormat(dateArray[i])) {
                    result = i;
                    break
                }
            }
            return result;
        }

        function select(i) {
            d3.selectAll('.date-label').classed('date-label-selected', false);
            d3.select('#date-label-' + i).classed('date-label-selected', true);
            d3.selectAll('.date-month').classed('date-month-selected', false);
            d3.select('#date-month-' + i).classed('date-month-selected', true);
        }

        function scrollTo(monthIndex) {
            monthIndex = monthIndex < visibleMonthCount ? visibleMonthCount - 1 : monthIndex;
            scrollPosition = monthIndex;
            var translate = -(monthMargin * monthIndex - monthMargin * (visibleMonthCount - 1));
            datePickerContainer.transition().attr("transform", "translate(" + translate + ", 0)");
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
            .attr("x1", 0).attr("y1", height / 2)
            .attr("x2", 0).attr("y2", 0)
            .selectAll("stop")
            .data([
                {offset: "10%", color: "#2adaf8"},
                {offset: "100%", color: "#383d48"}
            ])
            .enter().append("stop")
            .attr("offset", function (d) {
                return d.offset;
            })
            .attr("stop-color", function (d) {
                return d.color;
            });

        svg.append("linearGradient")
            .attr("id", "month-line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", monthMargin)
            .attr("x2", width).attr("y2", monthMargin)
            .selectAll("stop")
            .data([
                {offset: "1%", color: "#383d48"},
                {offset: "100%", color: "#2adaf8"}
            ])
            .enter().append("stop")
            .attr("offset", function (d) {
                return d.offset;
            })
            .attr("stop-color", function (d) {
                return d.color;
            });
    }
}
