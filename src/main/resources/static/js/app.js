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

    function wordCloud(selector) {

        var fill = d3.scale.category20();

        //Construct the word cloud's SVG element
        var svg = d3.select(selector).append("svg")
            .attr("width", 500)
            .attr("height", 500)
            .append("g")
            .attr("transform", "translate(250,250)");


        //Draw the word cloud
        function draw(words) {
            var cloud = svg.selectAll("g text")
                .data(words, function (d) {
                    return d.text;
                });

            //Entering words
            cloud.enter()
                .append("text")
                .style("font-family", "Impact")
                .style("fill", function (d, i) {
                    return fill(i);
                })
                .attr("text-anchor", "middle")
                .attr('font-size', 1)
                .text(function (d) {
                    return d.text;
                });

            //Entering and existing words
            cloud
                .transition()
                .duration(600)
                .style("font-size", function (d) {
                    return d.size + "px";
                })
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

            //Exiting words
            cloud.exit()
                .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
        }


        //Use the module pattern to encapsulate the visualisation code. We'll
        // expose only the parts that need to be public.
        return {

            //Recompute the word cloud for a new set of words. This method will
            // asycnhronously call draw when the layout has been computed.
            //The outside world will need to call this function, so make it part
            // of the wordCloud return value.
            update: function (words) {
                d3.layout.cloud().size([500, 500])
                    .words(words)
                    .padding(1)
                    .rotate(function () {
                        return ~~(Math.random() * 2) * 30;
                    })
                    .font("Impact")
                    .fontSize(function (d) {
                        return d.size;
                    })
                    .on("end", draw)
                    .start();
            }
        }

    }

    //Create a new instance of the word cloud visualisation.
    var myWordCloud = wordCloud('body');

    d3.csv('rest/data', function(data) {
        var words = data.map(function(d){return {text: d.word, size: d.count * 1.7 }});
        console.log(words);

        function update() {
            myWordCloud.update(words);
            setTimeout(function () {
                update();
            }, 2000)
        };
        update();
    });
}
