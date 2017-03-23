'use strict';

/**
 * STAT HELPERS CLASS
 */

dashboardApp.constant('STATS_CONFIG', {
    DEFAULT_START_DATE  : '2013-01-01T12:24:27Z',
    DATE_FORMAT_API     : 'yyyy-MM-dd', //API expected format
    DATE_FORMAT_UI      : 'dd/MM/yyyy',
    COLORS              : ['#fdcf09', '#f79e1c', '#818a8a', '#3d3e3c'], //'#56c4c4'

    CONST : {
      LINE:'Line', BAR:'Bar', D3CHART:'D3Chart',
      HOUR: 'Hour', DAY:'Day', MONTH:'Month', WEEK:'Week', 
      USERS:'User', INTERACTION:'Interaction', DATE:'date'
    }
});

dashboardApp.service('statWidgetAccess', ['$timeout', function($timeout) {
    function executeFns(fns, $scope) {
        for (var i = 0, m = fns.length; i < m; i++){
            if (!fns[i]($scope)) {
                return false;
            }
        }
        return true;
    }

    return {
        go:function($scope, filterFns) {

            function updateVisibility(value) {
               if(value) {
                    $scope.show = executeFns(filterFns, $scope);
               }
            }
            $scope.$watch('blipp', function(value) {
                if(value){
                  updateVisibility(value);
                }
            });

            $scope.$watch('campaign', function(value) {
              if(value){
                updateVisibility(value);
              }
            });

            $scope.$watch('entityData.loading', function(value) {
                if(!angular.isUndefined(value)){
                    //refresh stats-data just after view ready
                    $timeout(function () { 
                        $scope.loading = value;
                        updateVisibility(value);
                    });
                }
            });

            $scope.$watchCollection('entityData.onReady', function(value) {
                if(value) {
                    //refresh stats-data just after view ready
                    $timeout(function () {
                        if(angular.isDefined($scope.refresh)){
                            $scope.refresh($scope.entityData.data);
                            $scope.loading = false;
                        } 
                        else if(value.interaction && angular.isDefined($scope.refreshInteraction)){
                            $scope.refreshInteraction();
                            $scope.loading = value.interaction = false;
                        }
                        else if(value.googlemap && angular.isDefined($scope.refreshLocation)){
                            $scope.refreshLocation($scope.entityData.data);
                            $scope.loading = value.googlemap = false;
                        }
                        else if(value.blippsBreakdown && angular.isDefined($scope.refreshBlipps)){
                            $scope.refreshBlipps($scope.entityData.data);
                            $scope.loading = value.blippsBreakdown= false;
                        }
                        updateVisibility(value);
                    });
                }  
            });
            
        }
    };
}]);

dashboardApp.service('statHelper', [ 
    function(){
       return {
         base: {
          show:false,
         },

         isCampaignWidget:function($scope) {
          return !$scope.blipp;
         },

         isBlippWidget:function($scope) {
          return $scope.blipp;
         }
       };
    }]
);