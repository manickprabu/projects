'use strict';

dashboardApp.service('D3Doughnut',
    function() {
        var chart;
        var scope;

        function init(_chart, $scope) {
            chart = _chart;
            scope = $scope;

            //TO DO - with transition
            if(chart.svg) {
                chart.svg.selectAll('.slice').data([]).exit().remove();
                chart.svg.selectAll('text').data([]).exit().remove();
                chart.textTop = chart.textBottom = null;
            }

            if(!chart.data) {return;}

            chart.mouseover  = mouseover;
            chart.mouseleave = mouseleave;
            initLayout();
            draw();
        }

        function initLayout() {
            chart.svg.attr('transform', 'translate(' + (chart.width/2) + ',' + (chart.height/2) + ')');

            if(!chart.textTop) {
                chart.textTop = chart.svg.append('text')
                    .attr('dy', '.35em')
                    .style('text-anchor', 'middle')
                    .attr('class', 'textTop')
                    .text( chart.name )
                    .attr('y', 0);
            }

            if(!chart.textBottom) {
                chart.textBottom = chart.svg.append('text')
                    .attr('dy', '.35em')
                    .style('text-anchor', 'middle')
                    .attr('class', 'textBottom')
                    .text('')
                    .attr('y', 10);
            }

            chart.padding       = 20;
            chart.radius        = Math.min((chart.width-chart.padding)/2, (chart.height-chart.padding)/2);
            chart.innerRadius   = chart.radius-25;

            chart.arc = d3.svg.arc()
                .innerRadius(chart.innerRadius)
                .outerRadius(chart.radius);

            chart.arcOver = d3.svg.arc()
                .innerRadius(chart.innerRadius + 2)
                .outerRadius(chart.radius + 8);
        }

        var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d.Value; });

        function draw() {
            var arcs = chart.svg.selectAll('g.slice')
                .data( pie(chart.data) )
                .enter()
                    .append('svg:g')
                        .attr('class', 'slice')
                        .on('mouseover', function(d) {
                            if(d.data.Id <= 0) {return;} // no data

                            mouseover(d.data);
                            scope.blippHover = d.data;
                            scope.$apply();
                            // d3.select(this).select('path').transition()
                            //     .duration(200)
                            //     .attr('d', arcOver);
                            // self.textTop.text(d3.select(this).datum().data.Label)
                            //     .attr('y', -10);
                            // self.textBottom.text(d3.select(this).datum().data.Value)
                            //     .attr('y', 10);
                        })
                        .on('mouseout', function(d) {
                            if(d.data.Id <= 0) {return;} // no data
                            
                            mouseleave(d.data);
                            scope.blippHover = null;
                            scope.$apply();
                        });
            

            arcs.append('svg:path')
                .attr('rel', function(d) { return d.data.Id; })
                .style('fill', function(d) { return d.data.Color; })
                .attr('d', chart.arc);
        }

        function mouseover(data){
            chart.svg.select('path[rel="'+data.Id+'"]')
                .transition()
                .duration( chart.transitionDuration )
                .attr('d', chart.arcOver);

            chart.textTop.text(data.Label)
                .attr('y', -15);
            chart.textBottom.text(data.Percentage+'%') //data.Value
                .attr('y', 10);

            wrapText(chart.textTop);
        }

        function mouseleave(data) {
            chart.svg.select('path[rel="'+data.Id+'"]')
                .transition()
                .duration( chart.transitionDuration )
                .attr('d', chart.arc);
             chart.textTop.text( chart.name )
                .attr('y', 0);
            chart.textBottom.text('');
        }

        function wrapText(target){
            var textLength = target.node().getComputedTextLength(),
                text = target.text();
            while (textLength > (chart.radius + (chart.padding * 2)) && text.length > 0) {
                text = text.slice(0, -1);
                target.text(text + '...');
                textLength = target.node().getComputedTextLength();
            }
        }

        function reset() {
            if(chart){
                // to do
            }
        }

        return {
            init        : init,
            reset       : reset
        };
    }
);