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

    datePiker(svg, monthRange, 7, function (date) {
        console.log(date)
    });

    function datePiker(svg, dateArray, visibleMonthCount, datePikerCallback) {
        var width = svg.attr('width');
        var height = svg.attr('height');

        var buttonPanelSize = 50;
        var monthRadius = 5;
        var monthMargin = (width - buttonPanelSize * 2  - monthRadius * 2) / (visibleMonthCount - 1);

        var scrollPosition = visibleMonthCount - 1;
        var middleMonthCount = Math.ceil(visibleMonthCount / 2) - 1;

        var monthFormat = d3.time.format("%b");
        var yearFormat = d3.time.format("%Y");

        var yearRange = d3.range(yearFormat(dateArray[0]), parseInt(yearFormat(dateArray[dateArray.length - 1])) + 1);

        svg.append('line')
            .attr('x1', buttonPanelSize + monthRadius)
            .attr('y1', height / 2)
            .attr('x2', function () {
                return buttonPanelSize + monthRadius + (visibleMonthCount - 1) * monthMargin
            })
            .attr('y2', height / 2)
            .attr('class', 'month-line');

        //year selector
        var yearPickerContainer = svg.append('g');

        yearPickerContainer.insert('line', ":first-child")
            .attr('x1', function () {
                return buttonPanelSize + monthRadius + monthMargin * middleMonthCount;
            })
            .attr('y1', 0)
            .attr('x2', function () {
                return buttonPanelSize + monthRadius + monthMargin * middleMonthCount;
            })
            .attr('y2', height / 2 - monthRadius)
            .attr('class', 'year-line');

        var foreignObject = yearPickerContainer.append('foreignObject');
        var yearSelect = foreignObject.attr('x', function () {
            return buttonPanelSize + monthRadius + monthMargin * middleMonthCount + 1;
        })
            .attr('y', 0)
            .attr('width', 30)
            .append('xhtml:select')
            .attr('class', 'year-select')
            .on('change', function () {
                scrollTo(getYearIndex(this.value) + middleMonthCount);
            });

        var image = new Image();
        image.onload = function () {
            yearPickerContainer.append('image')
                .attr('x', function () {
                    return buttonPanelSize + monthRadius + monthMargin * middleMonthCount + foreignObject.node().getBBox().width;
                })
                .attr('y', image.height / 2)
                .attr('width', image.width)
                .attr('height', image.height)
                .attr('xlink:href', image.src)
                .style('pointer-events', 'none')
        };
        image.src = 'img/expand.svg';

        createYearSelectOptions(yearSelect);

        //month selector
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

        addScrollButton('img/left_button.svg', buttonPanelSize, true, function () {
            scrollTo(scrollPosition - 1)
        }, function (buttonWidth) {
            addScrollButton('img/left_end_button.svg', buttonPanelSize - buttonWidth * 2, true, function () {
                scrollTo(visibleMonthCount - 1)
            });
        });

        addScrollButton('img/right_button.svg', width - buttonPanelSize, false, function () {
            scrollTo(scrollPosition + 1)
        }, function (buttonWidth) {
            addScrollButton('img/right_end_button.svg', width - buttonPanelSize + buttonWidth * 2, false, function () {
                scrollTo(lastMonthIndex);
            });
        });

        /**
         * Load svg image and create button with this image as icon
         *
         * @param src source url for button
         * @param x position of button on x axes
         * @param alignRight if true then button will be aligned by right side
         * @param action function for button's onclick event
         * @param callback function which will be invoked after button creation, will take as parameters width and height of created button
         */
        function addScrollButton(src, x, alignRight, action, callback) {
            var icon;
            //load svg file
            d3.xml(src, 'image/svg+xml', function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);
                var iconWidth = 0;
                var iconHeight = 0;
                var xPosition = 0;
                var yPosition = 0;

                //create group container for button
                var g = svg.append('g');
                g.each(
                    //load icon from svg file
                    function() {
                        icon = this.appendChild(importedNode.cloneNode(true));
                        iconWidth = d3.select(icon).attr('width');
                        iconHeight = d3.select(icon).attr('height');

                        //calculate position based on icon size and alignment
                        xPosition = x - (alignRight ? iconWidth : 0);
                        yPosition = height / 2  - iconHeight / 2;
                        d3.select(icon).attr('class', 'scroll-button-icon')
                    })
                    .attr('width', d3.select(icon).attr('width'))
                    .attr('height', d3.select(icon).attr('height'))
                    .attr('transform', 'translate(' + xPosition + ', ' + yPosition + ')');

                //create rect around icon which allow click on any place of icon with transparent elements
                var buttonWidth = d3.select(icon).select('path').node().getBBox().width;
                var buttonHeight = d3.select(icon).select('path').node().getBBox().height;
                g.append('rect')
                    .attr('width', buttonWidth)
                    .attr('height', buttonHeight)
                    .attr('transform', 'translate(' + (iconWidth / 2 - buttonWidth / 2) + ', ' + (iconHeight / 2 - buttonHeight / 2) + ')')
                    .attr('class', 'scroll-button')
                    .on('click', action);

                //run callback function with created button width and height as parameters
                if (callback != undefined) {
                    callback(buttonWidth, buttonHeight)
                }
            });
        }

        function createYearSelectOptions(select) {
            for (var i = 0; i < yearRange.length; i++) {
                var year = yearRange[i];
                select.append('option').attr('label', year).attr('value', year);
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

            if (datePikerCallback != undefined) {
                datePikerCallback(dateArray[i]);
            }
        }

        function scrollTo(monthIndex) {
            monthIndex = monthIndex < visibleMonthCount ? visibleMonthCount - 1 : monthIndex;
            monthIndex = monthIndex > lastMonthIndex ? lastMonthIndex : monthIndex;
            scrollPosition = monthIndex;
            var translate = -(monthMargin * monthIndex - monthMargin * (visibleMonthCount - 1));
            datePickerContainer.transition().attr("transform", "translate(" + translate + ", 0)");

            yearSelect.node().value = yearFormat(dateArray[monthIndex - middleMonthCount]);
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
