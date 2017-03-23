'use strict';

dashboardApp.controller('StatsController',
 ['$scope', 'statProvider', 'showErrorPage', 'CampaignModel', 'BlippModel', '$routeParams', '$filter', '$location', 'STATS_CONFIG', 'StatDataModel', 'setDocumentTitle', '$log',
function($scope, statProvider, showErrorPage, CampaignModel, BlippModel, $routeParams, $filter, $location, STATS_CONFIG, statDataModel, setDocumentTitle, $log)
    {
        var entityData = {
            error   : false,
            loading : true,
            date    : null,
            data    : statDataModel.data(),
            onReady : statDataModel.ready
        };
        $scope.entityData = entityData;
        $scope.campaignId = $routeParams.campaignId;
        $scope.blippId = $routeParams.blippId;
        $scope.publishedBlipps = [];

        CampaignModel.get({id: $scope.campaignId}).$promise.then(function(campaign) {
            var startDate = (campaign.PublishDate.Valid) ? campaign.PublishDate.Time : STATS_CONFIG.DEFAULT_START_DATE;

            $scope.campaign = campaign;
            $scope.entityData.startDate = $filter('date')(startDate, STATS_CONFIG.DATE_FORMAT_API);
            $scope.entityData.endDate   = $filter('date')(new Date(), STATS_CONFIG.DATE_FORMAT_API);
            $scope.update();

            getBlipps();
            setTitles();
        }).catch(showErrorPage.bind(null, 'campaign'));

        function getBlipps() {
            BlippModel.ofCampaign({campaignId: $scope.campaign.Id}).$promise.then(function(blipps) {
                $scope.campaign.setBlipps(blipps);

                angular.forEach($scope.campaign.Blipps, function(blipp) {
                    if (blipp.Id === Number($scope.blippId)) {
                        $scope.blipp = blipp;
                        setTitles();
                    }
                    if (blipp.PublishDate.Valid) {
                        $scope.publishedBlipps.push(blipp);
                    }
                });
            }).catch(showErrorPage.bind(null, 'campaign blipps'));
        }

        $scope.switchBlipp = function(blipp) {
            $scope.blipp = blipp;
            $scope.blippId = (blipp || {}).Id;
            $scope.update();
            $location.path($filter('statsUrl')($scope.campaign, $scope.blipp), false);
        };

        $scope.update = function() {
            entityData.error = false;
            entityData.loading = true;
            setInteraction({});

            if ($scope.entityData.startDate && $scope.entityData.endDate) {
                var startDate = $scope.entityData.startDate;
                var endDate = $scope.entityData.endDate;

                if ($scope.blippId) {
                    statProvider.getBlipp($scope.blippId, startDate, endDate).then(statsLoaded);
                    $log.log('Loading blipps stats > S.Date, E.Date', startDate, endDate);
                } else if ($scope.campaign) {
                    statProvider.getCampaign($scope.campaign.Id, startDate, endDate).then(statsLoaded);
                    $log.log('Loading campaign stats > S.Date, E.Date', startDate, endDate);
                }
            }

            setTitles();
        };

        function setTitles() {
            if ($scope.blippId) {
                $scope.title = $scope.blipp ? $scope.blipp.Name : '…';
                setDocumentTitle('Blipp Stats');
            } else {
                $scope.title = $scope.campaign ? $scope.campaign.Name : '…';
                setDocumentTitle('Campaign Stats');
            }
        }

        function statsLoaded()  {
            entityData.loading = false;
            $scope.activeBlippId = $scope.blippId;
            setInteraction(statDataModel.data());
        }

        function setInteraction(data) {
            $scope.totalInteraction      = data.totalInteraction || 0;
            $scope.totalUsers            = data.totalUsers || 0;
            $scope.averageUserInteraction= data.averageInteraction || 0;

            entityData.error = (data.totalInteraction === 0 || data.totalUsers === 0);
        }
        $scope.$on('$destroy', function(){
            setInteraction({});
            statDataModel.reset();
        });
    }
]);

/*
* adjust clsss according to interaction length to small or xsmall
*/
dashboardApp.directive('statsInteraction', function(){
    return {
        restrict:'A',
        link : function(scope, element, attr){
            scope.$watch(attr.statsInteraction, function(value) {
                element.html(value);

                element.removeClass('xsmall small');
                var style = (value && value.length>14) ? 'xsmall' : (value && value.length>11) ? 'small' : '';
                element.addClass(style);
            });
        }
    };
});


//========================================================================================//
//                          Filter controllers                                            //
//========================================================================================//

dashboardApp.controller('StatsDateSelectorCtrl', ['$scope', '$filter', 'STATS_CONFIG', 'StatBlippModel', 'statWidgetAccess',
    function($scope, $filter, STATS_CONFIG, statBlippModel, statWidgetAccess) {
        //**************************************************
        //    reference: http://www.daterangepicker.com/#examples
        //**************************************************

        $scope.ready = false;
        var pickerReference;
        var picker;
        $scope.onEnter = function() {
            onApply(null, pickerReference);
        };

        function onShown(ev, _picker) {
            pickerReference = _picker;
        }

        function onApply(ev, picker) {
           $scope.entityData.startDate  = picker.startDate.format(STATS_CONFIG.DATE_FORMAT_API.toUpperCase());
           $scope.entityData.endDate    = picker.endDate.format(STATS_CONFIG.DATE_FORMAT_API.toUpperCase());
           // $scope.entityData.endDate  = $filter('date')(statBlippModel.lastInteraction(), STATS_CONFIG.DATE_FORMAT_UI);
           $scope.update();
        }

        function dateReady() {
            if($scope.campaign && (!$scope.startDate || !$scope.endDate) && statBlippModel.lastInteraction()) {
                var momentDateFormat = STATS_CONFIG.DATE_FORMAT_UI.toUpperCase();
                var startDate   = ($scope.campaign.PublishDate.Valid) ? $scope.campaign.PublishDate.Time : STATS_CONFIG.DEFAULT_START_DATE;

                $scope.startDate= $filter('date')(startDate, STATS_CONFIG.DATE_FORMAT_UI);
                $scope.endDate  = $filter('date')(new Date(), STATS_CONFIG.DATE_FORMAT_UI);

                var activeData  = [ moment($scope.startDate, momentDateFormat), moment(statBlippModel.lastInteraction() ) ];
                var allData     = [ moment($scope.startDate, momentDateFormat), moment($scope.endDate, momentDateFormat) ];

                //set selection range
                picker = $('#daterange').daterangepicker({
                    'locale'        : {
                        format: momentDateFormat
                    },
                    'startDate'     : $scope.startDate,
                    'endDate'       : $scope.endDate,
                    'minDate'       : $scope.startDate,
                    'maxDate'       : $scope.endDate,
                    'buttonClasses' : 'btn btn-sm',
                    'applyClass'    : 'btn-default',
                    'cancelClass'   : 'btn-default',
                    'applyLabel'    : 'Done',
                    'cancelLabel'   : 'Cancel',
                    'ranges'        : {
                       'Yesterday': [moment().subtract(1, 'days'), moment()],
                       'Last 7 Days': [moment().subtract(7, 'days'), moment()],
                       'Last 30 Days': [moment().subtract(30, 'days'), moment()],
                       'Active Days': activeData,
                       'From Start' : allData
                    }
                })
                .on('apply.daterangepicker', onApply)
                .on('show.daterangepicker', onShown);

                //set pre-selected range
                // picker.data('daterangepicker').setStartDate(startDate);
                // picker.data('daterangepicker').setEndDate(endDate);
                $scope.ready = true;
            }
        }

        statWidgetAccess.go($scope, [ ]);

        $scope.refresh = function() {
            dateReady();
        };
    }
]);


dashboardApp.controller('StatInteractionCtrl', ['$scope', 'statHelper', 'statWidgetAccess', 'StatBlippModel', 'STATS_CONFIG',
    function($scope, statHelper, statWidgetAccess, statBlippModel, STATS_CONFIG){
        var CONST = STATS_CONFIG.CONST;

        $scope.data = statBlippModel.empty();
        $scope.tabs = [ {name:CONST.DAY, icon:'fa-calendar'},
                        {name:CONST.HOUR, icon:'fa-clock-o'} ];
        statWidgetAccess.go($scope, [ ]);
        setType( CONST.DAY );

        $scope.refreshInteraction = function() {
            $scope.update($scope.type);
            $scope.error = ($scope.data.length === 0);
        };

        $scope.update = function(target) {
            var chartData = (target === CONST.HOUR) ? statBlippModel.hourly() :
                            (target === CONST.WEEK) ? statBlippModel.weekly() :
                            (target === CONST.MONTH) ? statBlippModel.monthly() :
                            statBlippModel.daily();

            setType( target );
            $scope.data  = chartData;
        };

        function setType(value) {
            $scope.type = value;
            switch(value) {
                case CONST.DAY:
                    $scope.header = 'Interactions & users by day';
                    $scope.tips = 'Total number of interactions and users for each day within your chosen date range.';
                    break;
                case CONST.HOUR:
                    $scope.header = 'Interactions & users by time of day';
                    $scope.tips = 'Total number of interactions and users by time of day within your chosen date range. All times UTC (Coordinated Universal Time).';
                    break;
            }
        }
    }]
);


dashboardApp.controller('StatGoogleMapCtrl', ['$scope', 'statWidgetAccess',
    function($scope, statWidgetAccess){

        statWidgetAccess.go($scope, []);

        $scope.refreshLocation = function(data) {
            $scope.locations = data.locations;
        };
    }]
);

dashboardApp.controller('StatCampaignBreakdownCtrl', ['$scope', 'statHelper', 'statWidgetAccess', 'StatFunctions', '$filter',
    function($scope, statHelper, statWidgetAccess, statFunctions, $filter){

        var blipps,
            publishedBlipps,
            totalInteraction = 0,
            breakdown = [];

        statWidgetAccess.go($scope, [
            statHelper.isCampaignWidget
            ]);

        $scope.name = 'INTERACTIONS';
        $scope.headerLabel = {Key:'Key', Label:'Blipp name', Value:'Interactions', Percentage:'Percentage'};
        $scope.clickable = true;

        $scope.refreshBlipps = function(data) {
            if( !$scope.show ){ return; }

            var blippList   = [];
            publishedBlipps = $scope.publishedBlipps;
            breakdown       = data.campaignBreakdown;

            _.map(breakdown, function(item){
                totalInteraction += item.Value;
            });

            if(breakdown && breakdown.length && totalInteraction) {
                //filter by breakdown which blipp has publish_date
                blipps = $scope.campaign.Blipps;
                angular.forEach(publishedBlipps, function(blipp) {
                    var item = $filter('filter')(breakdown, {Id: blipp.Id}, true)[0];
                    if(item) {
                        item.Label = statFunctions.getBlippName(blipps, blipp.Id );
                        blippList.push(item);
                    }
                });
            } else {
                //prepare one dummy list-item when there is no breakdown.
                angular.forEach(publishedBlipps, function(blipp) {
                    var item    = angular.copy( data.noBreakdownData[0] );
                    item.Label  = blipp.Name;
                    item.Id     = blipp.Id;
                    item.Value  = item.Percentage = 0;
                    blippList.push( item );
                });
            }

            $scope.name = (totalInteraction === 0) ? 'NO DATA' : 'INTERACTIONS';
            $scope.data = (totalInteraction === 0) ? data.noBreakdownData : blippList;
            $scope.interactionBlipp = blippList;
        };

        $scope.onMouseover = function(data) {
            if(breakdown && breakdown.length && totalInteraction){
                $scope.mouseover = data;
            }
        };
        $scope.onMouseleave = function(data) {
            $scope.mouseleave = data;
        };

        $scope.loadBlippStats = function(data) {
            blipps = $scope.campaign.Blipps;
            var blipp = $filter('filter')(blipps, {Id: data.Id}, true)[0];
            $scope.update( blipp );
        };

        $scope.$watch('blippHover', function(value) {
            if(value) {
                var newHash = 'anchor' + value.Id;
                var elem = document.getElementById(newHash);
                elem.scrollIntoView(!$scope.maximize);
            }
        });

    }]
);


dashboardApp.controller('StatMarkerBreakdownCtrl', ['$scope', 'statHelper', 'statWidgetAccess', 'blippStatusBtnFilters',
    function($scope, statHelper, statWidgetAccess, blippStatusBtnFilters){

        statWidgetAccess.go($scope, [
               statHelper.isBlippWidget,
                blippStatusBtnFilters.LastVersion.isBlippBuilderV2Version
            ]);

        var totalInteraction = 0;
        $scope.headerLabel = {Key:'Key', Label:'Marker name', Value:'Interactions', Percentage:'Percentage'};
        $scope.name = 'MARKERS';
        $scope.clickable = false;

        //by marker breakdown
        $scope.refresh = function(data) {
            if( !$scope.show ){ return; }

            var breakdown = data.markersBreakdown;
            totalInteraction = data.totalInteraction;

            if($scope.show) {
                $scope.name = (totalInteraction === 0) ? 'NO DATA' : $scope.name;
                $scope.data = (totalInteraction === 0) ? data.noBreakdownData : breakdown;
                $scope.interactionBlipp = breakdown;
            }
        };

        $scope.onMouseover = function(data) {
            if(totalInteraction){
                $scope.mouseover = data;
            }
        };
        $scope.onMouseleave = function(data) {
            $scope.mouseleave = data;
        };

    }]
);

dashboardApp.controller('StatsTapThroughCtrl', ['$scope', 'statHelper', 'statWidgetAccess', 'blippStatusBtnFilters',
    function($scope, statHelper, statWidgetAccess, blippStatusBtnFilters){

        statWidgetAccess.go($scope, [
               statHelper.isBlippWidget,
                blippStatusBtnFilters.LastVersion.isBlippBuilderV2Version
            ]);

        $scope.refresh = function(data) {
           $scope.taps = data.tapThrough;
        };
    }]
);

dashboardApp.controller('StatTotalTapThroughCtrl', ['$scope', 'statHelper', 'statWidgetAccess', 'blippStatusBtnFilters',
    function($scope, statHelper, statWidgetAccess, blippStatusBtnFilters){

        statWidgetAccess.go($scope, [
               statHelper.isBlippWidget,
                blippStatusBtnFilters.LastVersion.isBlippBuilderV2Version
            ]);

        $scope.refresh = function(data) {
           $scope.tap = data.tapThroughRate;
        };
    }]
);

dashboardApp.controller('StatsShareCtrl', ['$scope', 'blippHelpers', '$modal',
    function($scope, blippHelpers, $modal) {
        $scope.btn = angular.copy(blippHelpers.btnBase);
        $scope.btn.show = true;
        $scope.btn.action = function(){
            $modal.open({
                templateUrl: '/core/components/stats/modals/shareStatModal.html',
                controller : 'StatShareModalCtrl',
                resolve: {
                    campaign: function() {
                        return $scope.campaign;
                    }
                }
            });
        };
    }
]);

//========================================================================================//
//              These controllers are de-scoped for this release                         //
//========================================================================================//

dashboardApp.controller('StatsPollResultsCtrl', ['$scope', 'statHelper', 'statWidgetAccess',
    function($scope, statHelper, statWidgetAccess){

        statWidgetAccess.go($scope,  [
                // blippStatusBtnFilters.isBlippBuilderV2Version,
                statHelper.isBlippWidget
            ]);

        $scope.refresh = function(data) {
            if($scope.show) {
                $scope.pollResult = data.pollResult.list;

                $scope.data  = data.pollResult.value;
                $scope.label = data.pollResult.label;
                $scope.color = data.pollResult.color;
            }
        };
    }]
);


dashboardApp.controller('StatsGMTCtrl', ['$scope',
    function($scope) {
        //http://www.freeformatter.com/time-zone-list-html-select.html

        $scope.show = false;

        // TO DO - Enable this code when we need
        // $scope.gmt = [];
        // $resource('/core/data/gmt-data.json').query(function(data){
        //     Array.prototype.push.apply($scope.gmt, data);
        // });

        // $scope.$watch('selected', function() {
        //     $scope.update();
        // });
    }
]);



dashboardApp.controller('StatsDownloadCtrl', ['$scope', 'blippHelpers',
    function($scope, blippHelpers) {
        $scope.btn = angular.copy(blippHelpers.btnBase);

        $scope.btn.show = false;

        //TO DO
        $scope.btn.action = function(){

        };
    }
]);
