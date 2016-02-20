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
        var fill = d3.scale.linear()
            .domain([5, 35, 75])
            .range(['#ec5c75', '#9d56b6', '#5451f5']);

        //Construct the word cloud's SVG element
        var svg = d3.select(selector).append('svg')
            .attr('width', 800)
            .attr('height', 800)
            .append('g')
            .attr('transform', 'translate(400,400)');


        //Draw the word cloud
        function draw(words) {
            var cloud = svg.selectAll('g text')
                .data(words, function (d) {
                    return d.text;
                });

            //Entering words
            cloud.enter()
                .append('text')
                .style('font-family', 'Impact')
                .style('fill', function (d, i) {
                    return fill(d.size);
                })
                .attr('text-anchor', 'middle')
                .attr('font-size', 1)
                .text(function (d) {
                    return d.text;
                });

            //Entering and existing words
            cloud
                .transition()
                .duration(300)
                .style('font-size', function (d) {
                    return d.size + 'px';
                })
                .attr('transform', function (d) {
                    return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
                })
                .style('fill-opacity', 1);

            //Exiting words
            cloud.exit()
                .transition()
                .duration(100)
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
                d3.layout.cloud().size([800, 800])
                    .words(words)
                    .padding(1)
                    .rotate(function () {
                        return ~~(Math.random() * 2) * 90;
                    })
                    .spiral('archimedean')
                    .font('Impact')
                    .fontSize(function (d) {
                        return d.size;
                    })
                    .on('end', draw)
                    .start();
            }
        }

    }

    //Create a new instance of the word cloud visualisation.
    var myWordCloud = wordCloud('body');

    d3.csv('rest/data', function(data) {
        var words = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].rate * .07 >= 10) {
                words.push({text: data[i].word, size: data[i].rate * .07 })
            }
        }
        console.log(words);

        function update() {
            myWordCloud.update(words);
            setTimeout(function () {
                update();
            }, 1500)
        }
        update();
    });

    var svg = d3.select('body').append('svg')
        .attr('width', 500)
        .attr('height', 500)
        .append('g')
        .attr('transform', 'translate(250,250)');
    
    var text = svg.append('text').text('text').attr('x', -50).attr('y', 0).attr('font-family', 'sans-serif').style('font-size', '50px');


    var color = d3.scale.linear()
        .domain([20, 40])
        .range(['gray', 'black']);

    function update(time) {
        var x = Math.sin(time) * 100 - 50;
        var size = ((Math.cos(time) * 1.1) + 3) * 10;
        text.attr('x', x)
            .style('font-size', function() {
                return size + 'px';
            })
            .attr('fill', function(){
                return color(size)
            });
        setTimeout(function () {
            time += 0.1;
            update(time);
        }, 50);
    }

    update(0);
}