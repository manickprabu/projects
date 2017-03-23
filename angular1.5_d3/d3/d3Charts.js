'use strict';

dashboardApp.directive('d3LineChart', ['D3Chart', 'STATS_CONFIG',
    function(D3Chart, STATS_CONFIG) { return new D3Chart.create( STATS_CONFIG.CONST.LINE ); }  ]);

dashboardApp.directive('d3BarChart', ['D3Chart', 'STATS_CONFIG',
    function(D3Chart, STATS_CONFIG) { return new D3Chart.create( STATS_CONFIG.CONST.BAR ); }  ]);

dashboardApp.directive('d3DoughnutChart', ['D3Chart', 'STATS_CONFIG',
    function(D3Chart, STATS_CONFIG) { return new D3Chart.create( STATS_CONFIG.CONST.D3CHART ); }  ]);


dashboardApp.service('D3Chart', ['$timeout', '$location', 'STATS_CONFIG', 'D3Line', 'D3Doughnut', '$window',
  function($timeout, $location, STATS_CONFIG, D3Line, D3Doughnut, $window){
    this.create = function(model) {
        this.restrict = 'E';
        this.replace = true;
        this.transclude = true;
        this.template = '<div class="d3-chart" id="{{chartId}}"></div>';
        this.link = function(scope, element, attrs) {
            var chart = new Chart();
            chart.name = attrs.name;
            scope.chartId = 'chart_'+_.random(10000);

            scope.$watch(attrs.maximize, function() {
                chart.resize();
            });

            scope.$watch(attrs.name, function(value) {
                 if(value){
                    chart.name = value;
                }
            });

            scope.$watch(attrs.type, function(value) {
                if(value){
                    chart.type = value;
                }
            });

            scope.$watchCollection(attrs.data, function(value) {
                if(chart) { 
                    D3Line.reset();
                    toDraw(value);
                }
            });

            scope.$watch(attrs.mouseover, function(blipp) {
                if(chart && blipp){
                    chart.mouseover(blipp);
                }
            });

            scope.$watch(attrs.mouseleave, function(blipp) {
                if(chart && blipp){
                    chart.mouseleave(blipp);
                }
            });

            Chart.prototype.resize = function() {
                if(chart.root && chart.data) {
                    // TO DO proper resize
                    // chart.resize();
                    toDraw(chart.data);
                }
            };

            function eventListener(event) {
                if(event.shiftKey) {
                    d3.select('.zoompan').style('pointer-events', 'all');
                } else {
                    d3.select('.zoompan').style('pointer-events', 'none');
                }
            }

            function toDraw(data) {
                chart.data = data;

                //wait for UI render 
                $timeout(function(){
                    switch(model) {
                        case STATS_CONFIG.CONST.LINE:
                            chart.init();
                            D3Line.init(chart);
                        break;
                        case STATS_CONFIG.CONST.D3CHART:
                            chart.init();
                            D3Doughnut.init(chart, scope);
                        break;
                    }
                }, 60);
            }

            function Chart(){
                this.data   = null;
                this.type   = null;
                this.name   = null;
                this.root   = null;
                this.svg    = null;
                this.width  = 0;
                this.height = 0;
                this.margin = 20;
                this.max    = 0;
                this.min    = 0;
                this.clipUrl        = 'url(' + $location.path() + '#clip)';
                this.paddingTop     = 25;
                this.clipPath       = null;
                this.yAxisGroup     = null;
                this.xAxisGroup     = null;
                this.dataLinesGroup = null;
                this.pointRadius    = 3;
                this.zoomStatus     = null;
                this.dataCirclesGroup       = null;
                this.maxDataPointsForDots   = 90;
                this.transitionDuration     = 500;
            }

            Chart.prototype.init = function() {
                this.width  = angular.element(element).prop('offsetWidth');
                this.height = angular.element(element).prop('offsetHeight') - this.paddingTop;
                this.root   = d3.select('#'+scope.chartId);
                this.svg    = this.root.select('svg').select('g');

                if(this.svg.empty()) {
                    this.svg = this.root.append('svg:svg')
                            .attr('width', this.width)
                            .attr('height', this.height + this.paddingTop)
                          .append('svg:g')
                            .attr('transform', 'translate(' + (this.margin+10) + ',' + (this.margin+20) + ')');
                } else {
                    this.root.select('svg').attr('width', chart.width).attr('height', chart.height+ this.paddingTop);
                }
            };

            //add listener
            $window.addEventListener('resize', chart.resize);
            document.addEventListener('keydown', eventListener, false);
            document.addEventListener('keyup', eventListener, false);

            //destroy
            scope.$on('$destroy', function() {
                $window.removeEventListener('resize', chart.resize);
                document.removeEventListener('keydown', eventListener, false);
                document.removeEventListener('keyup', eventListener, false);
            });

        }; // end of link
      }; // end of function
    }
]);
