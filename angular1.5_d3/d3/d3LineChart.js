'use strict';

dashboardApp.service('D3Line',['STATS_CONFIG', 'D3Legend', '$timeout',
    function(STATS_CONFIG, D3Legend, $timeout){
        var chart; //local reference

        function init(_chart) {
            chart = _chart;
            initLayout();

            chart.lines = [ drawLine(STATS_CONFIG.CONST.INTERACTION, 'area2', 'data-line2', 'data-point2'),
                            drawLine(STATS_CONFIG.CONST.USERS, 'area', 'data-line', 'data-point') ];
            
            D3Legend.create(chart);
            initZoomControl();
        }

        function initLayout() {
            //Custom xAxis & yAxis formatters based on chart's 'type'
            chart.formatXAxis = function() {
                return (chart.type === STATS_CONFIG.CONST.HOUR) ? d3.time.format('%I-%p') : d3.time.format('%d-%b-%y');
            };
            chart.xAxisCustomFormatter = function() {
                return (chart.type === STATS_CONFIG.CONST.HOUR) ? chart.xAxisHourFormatter : chart.xAxisDayFormatter; 
            };
            chart.xAxisDayFormatter = d3.time.format.multi([
                ['.%L', function(d) { return d.getMilliseconds(); }],
                [':%S', function(d) { return d.getSeconds(); }],
                ['%I:%M', function(d) { return d.getMinutes(); }],
                ['', function(d) { return d.getHours(); }],//%I-%p
                // ['%a-%d', function(d) { return d.getDay() && d.getDate() != 1; }],
                ['%d-%b-%y', function(d) { return d.getDate() !== 1; }],
                ['%b-%y', function(d) { return d.getMonth(); }],
                ['%Y', function() { return true; }]
            ]);

            chart.xAxisHourFormatter = d3.time.format.multi([
                ['.%L', function(d) { return d.getMilliseconds(); }],
                [':%S', function(d) { return d.getSeconds(); }],
                ['%I:%M', function(d) { return d.getMinutes(); }],
                ['%I-%p', function(d) { return d.getHours(); }],
                ['%d-%b-%y', function(d) { return d.getDate() !== 1; }],
                ['%Y', function() { return true; }]
            ]);
            
            chart.getXAxisTicks = function() {
                var w = chart.width - (chart.margin * 2);
                return Math.min( chart.data.length, Math.round(w/100) );
            };
            chart.getYAxisTicks = function() {
                var w = chart.height - (chart.margin * 2);
                return Math.min(chart.max, Math.round(w/50) );
            };

            chart.max = Math.max( d3.max(chart.data, function(d) { return d[ STATS_CONFIG.CONST.USERS ]; }), 
                                 d3.max(chart.data, function(d) { return d[ STATS_CONFIG.CONST.INTERACTION ]; })  );
            chart.max = chart.max + (chart.max*0.05); //add extra height 

            chart.x = d3.time.scale().range([0, chart.width - chart.margin * 2])
                    .domain([chart.data[0].date, chart.data[chart.data.length - 1].date]);

            chart.y = d3.scale.linear().range([chart.height - chart.margin * 2, 0])
                    .domain([chart.min, chart.max]);

            chart.xAxis = d3.svg.axis().scale(chart.x)
                .tickSize(chart.height - chart.margin * 2)
                .tickPadding(8)
                .ticks( chart.getXAxisTicks() )
                .tickFormat( chart.xAxisCustomFormatter() );

            chart.yAxis = d3.svg.axis().scale(chart.y)
                .orient('left')
                .tickSize( -chart.width + chart.margin * 2 )
                .tickPadding(3)
                .ticks( chart.getYAxisTicks() )
                .tickFormat( d3.format('.2s') );

            //clip-path (mask)
            if(!chart.clipPath) {
                chart.clipPath = chart.svg.append('clipPath')
                    .attr('id', 'clip')
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', chart.width-chart.margin * 2)
                    .attr('height', chart.height-chart.margin);
            } else {
                chart.clipPath.attr('width', chart.width-chart.margin * 2).attr('height', chart.height-chart.margin);
            }

            chart.transition = chart.svg.transition().duration( chart.transitionDuration );
            // y ticks and labels
            if (!chart.yAxisGroup) {
                chart.yAxisGroup = chart.svg.append('svg:g')
                    .attr('class', 'yTick')
                    .call(chart.yAxis);
            }
            else {
                chart.transition.select('.yTick').call(chart.yAxis);
            }

            // x ticks and labels
            if (!chart.xAxisGroup) {
                chart.xAxisGroup = chart.svg.append('svg:g')//.attr('clip-path', chart.clipUrl)
                    .attr('class', 'xTick')
                    .call(chart.xAxis);
            } else {
                chart.transition.select('.xTick').call(chart.xAxis);
            }

            // Draw the lines
            if (!chart.dataLinesGroup) {
                chart.dataLinesGroup = chart.svg.append('svg:g').attr('clip-path', chart.clipUrl);
            }

            // Draw the points
            if (!chart.dataCirclesGroup) {
                chart.dataCirclesGroup = chart.svg.append('svg:g').attr('class', 'circleGroup').attr('clip-path', chart.clipUrl);
            }
        }

        function drawLine(dataField, areaClass, lineClass, dotClass) {

           var props = {
                name        : dataField,
                visible     : true,

                dataLines : chart.dataLinesGroup.selectAll( '.'+ lineClass )
                    .data([chart.data]),

                dataAreas : chart.dataLinesGroup.selectAll( '.'+ areaClass )
                    .data([chart.data]),

                dataCircles : chart.dataCirclesGroup.selectAll( '.' + dotClass )
                    .data(chart.data),

                //line
                line : d3.svg.line()
                    .interpolate('linear') //basis //linear //cardinal
                    .x(function(d){ return chart.x(d.date); })
                    .y(function(d){ return chart.y(d[dataField]); }),
                    
                //area
                area : d3.svg.area()
                    .interpolate('linear')
                    .x(function(d) { return chart.x(d.date); })
                    .y0(chart.height - (chart.margin * 2) )
                    .y1(function(d) { return chart.y(d[dataField]); }),

                //show tooltips
                tip : d3.tip()
                     .attr('class', 'd3-tip')
                     .offset([-10, 0])
                     .html(function (d) {
                        var date = chart.formatXAxis()( new Date( d[ STATS_CONFIG.CONST.DATE ]) );
                        var str = '<strong>'+chart.type+':</strong> <span style="color:#f69d1c">' + date + '</span></br>';
                        return str+'<strong>'+ dataField +':</strong> <span style="color:#f69d1c">' + d[dataField] + '</span>'; 
                    }),

                hide : function(value) {
                    props.dataLines.classed('hidden',  value);
                    props.dataAreas.classed('hidden',  value);
                    props.dataCircles.classed('hidden',  value);
                },

                showDots:function(value) {
                    if(chart.data.length > chart.maxDataPointsForDots) {
                        props.dataCircles.classed('show-on-hover', value);
                    }
                },
                
                //zoom area & lines
                zoom : function() {
                    chart.svg.select( 'path.' + areaClass ).attr('d', props.area);
                    chart.svg.select( 'path.' + lineClass ).attr('d', props.line);
                    //zoom dots 
                    chart.svg.selectAll('.' + dotClass)
                        .data(chart.data)
                        .attr('cx', function(d) { return chart.x(d.date); })
                        .attr('cy', function(d) { return chart.y(d[dataField]); });
                },
                // toggle line,area & dots
                toggle : function() {
                    props.hide(props.visible);
                    props.visible = !props.visible;
                }
            };
            
            //line
            props.dataLines.enter().append('path')
                 .attr('class', lineClass)
                 .style('opacity', 1)
                 .attr('d', props.line);

            props.dataLines.transition()
                .attr('d', props.line)
                .duration( chart.transitionDuration )
                .style('opacity', 1);

            props.dataLines.exit()
                .transition()
                .attr('d', props.line)
                .duration( chart.transitionDuration )
                .attr('transform', function(d) { return 'translate(' + chart.x(d.date) + ',' + chart.y(0) + ')'; })
                .style('opacity', 1e-6)
                .remove();

            //area 
            props.dataAreas.enter().append('path')
                .attr('class', areaClass)
                .attr('d', props.area);

            props.dataAreas.transition()
                .attr('d', props.area)
                .duration( chart.transitionDuration );

            d3.selectAll( '.' + areaClass )
                .transition()
                .duration( chart.transitionDuration )
                .attr('d', props.area(chart.data));

            // Draw the points
            props.dataCircles.enter()
                .append('svg:circle')
                    //.attr('class', dotClass)
                    .attr('class', function() { return (chart.data.length <= chart.maxDataPointsForDots) ? dotClass : dotClass +' show-on-hover';} )
                    .style('opacity', 1e-6)
                    .attr('cx', function(d) { return chart.x(d.date); })
                    .attr('cy', function() { return chart.y(0); })
                    .attr('r', function() { return (chart.data.length <= chart.maxDataPointsForDots) ? chart.pointRadius : chart.pointRadius; })
                .on('mouseover', props.tip.show)
                .on('mouseout', props.tip.hide)
                .transition()
                .duration( chart.transitionDuration )
                    .style('opacity', 1)
                    .attr('cx', function(d) { return chart.x(d.date); })
                    .attr('cy', function(d) { return chart.y(d[dataField]); });

            props.dataCircles.transition()
                .duration( chart.transitionDuration )
                    .attr('cx', function(d) { return chart.x(d.date); })
                    .attr('cy', function(d) { return chart.y(d[dataField]); })
                    .attr('class', function() { return (chart.data.length <= chart.maxDataPointsForDots) ? dotClass : dotClass +' show-on-hover';} )
                    .attr('r', function() { return (chart.data.length <= chart.maxDataPointsForDots) ? chart.pointRadius : chart.pointRadius; })
                    .style('opacity', 1);

            props.dataCircles.exit().transition()
                .duration( chart.transitionDuration )
                    .attr('cy', function() { return chart.y(0); })
                    .style('opacity', 1e-6)
                    .remove();

            //apply tip
            chart.svg.call( props.tip );
            
            props.color = props.dataLines.style('stroke');

            return props;
        } // end of drawLine function


        function initZoomControl(){
            //zoom controlls
            chart.zoom = d3.behavior.zoom().x(chart.x)
                .scaleExtent([0, 100])
                .on('zoom', chart.zoomed)
                .on('zoomend', chart.zoomEnd);

            //reset zoom sttus after resize panel/window
            if(chart.zoomStatus) { 
                $timeout(function(){
                    chart.zoom.scale( chart.zoomStatus.scale );
                    chart.zoom.translate( chart.zoomStatus.translate );
                    chart.zoom.event( chart.svg.transition().duration(500) );
                });
            }

            chart.zoomed = function() {
                chart.svg.select('.xTick').call(chart.xAxis);
                chart.svg.select('.yTick').call(chart.yAxis);
                var scale = chart.zoom.scale();

                for(var line in chart.lines) {
                    chart.lines[line].zoom();
                    // show/hide dots while zoom in/out
                    chart.lines[line].showDots( (scale <= 10) );
                }
            };

            chart.zoomEnd = function(){
                chart.zoomStatus = {};
                chart.zoomStatus.scale = chart.zoom.scale();
                chart.zoomStatus.translate = chart.zoom.translate();
            };

            chart.svg.selectAll('.zoompan').data([]).exit().remove();
            chart.svg.insert('rect', '.circleGroup') // insert before .circleGroup
                .attr('class', 'zoompan')
                .attr('width', chart.width)
                .attr('height', chart.height)
                .call(chart.zoom);
            // end of zoom
        }

        function reset() {
            if(chart) {
                chart.zoomStatus = null;
                D3Legend.reset(chart);
                for(var line in chart.lines) {
                    chart.lines[line].hide(false);
                }
            }
        }

        return {
            init        : init,
            reset       : reset
        };
    }
]);
