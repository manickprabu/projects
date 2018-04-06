'use strict';

dashboardApp.factory('StatDataModel', ['$filter', 'StatFunctions', 'StatBlippModel',
function($filter, statFunctions, statBlippModel) {
    var data = {}, ready = {};

    function initProperty(){
        data.startDate           = '';   // 01/01/2013
        data.endDate             = '';   // 06/07/2015
        data.markersBreakdown    = [];
        data.campaignBreakdown   = [];
        data.noBreakdownData     = [{Color:'#bbbbbc', Id:-1, Label:'NO DATA', Percentage:1, Value: 1 }];
        data.blippInteraction    = [];
        data.locations           = [];   // [{ 'location':'40.746,-73.990', 'all':1} ]
        data.totalUsers          = 0;
        data.totalInteraction    = 0;
        data.averageInteraction  = 0;
        data.pollResult          = [ {all:20, name:'Survey-1'}, {all:40, name:'Survey-2'}, 
                                     {all:50, name:'Survey-3'}, {all:10, name:'Survey-4'} ];
        data.tapThrough          = [];   // [ {name:'Unknown', 'interaction':0} ]
        data.tapThroughRate      = {userInteraction:0, buttonTaps:0, tapRate:0};

        //status
        ready.interaction       = false;
        ready.googlemap         = false;
        ready.blippsBreakdown   = false;
        ready.markersBreakdown  = false;
        ready.blippLinks        = false;
    }
    initProperty();

    function setInteraction(value, startDate, endDate) {
        statBlippModel.setData(value.interactions, value.users, startDate, endDate);

        data.totalUsers         = value.users.total;
        data.totalInteraction   = value.interactions.total;
        data.averageInteraction = averageInteraction();

        ready.interaction = true;
    
        //TO DO
        // data.tapThroughRate.userInteraction = data.totalInteraction;
        // data.tapThroughRate.tapRate = (data.totalInteraction/data.tapThroughRate.buttonTaps*100);
        // data.tapThroughRate.tapRate = angular.isNumber( data.tapThroughRate.tapRate ) ? data.tapThroughRate.tapRate.toFixed(2) : '0.0';
        // data.pollResult        = getPoll( value.pollResult || pollResult );
        // //set links
        // data.tapThroughRate.buttonTaps = value.total;
        // delete value.total;
        // data.tapThrough = format(value, 'Link', 'Value');
        // data.tapThrough = statFunctions.percentage(data.tapThrough, 'Value');
    }

    function averageInteraction() {
        var average = Number( data.totalInteraction / data.totalUsers ) || 0;
        return angular.isNumber( average ) ? average.toFixed(1) : '0.0';
    }

    function setLocation(value) {
        data.locations = format(value, 'location', 'all');
        ready.googlemap = true;
    }
    function setBlipps(value) {
        data.campaignBreakdown = getCampaignBreakdown( value );
        ready.blippsBreakdown = true;
    }
    function setMarkers(value) {
        data.markersBreakdown  = getMarkerBreakdown( value );
        ready.markersBreakdown = true;
    }
    
    function getMarkerBreakdown(data) {
        angular.forEach(data, function(value, key) {
            value.Id = Number(value.ID);
            value.Color = statFunctions.color(key);
            statFunctions.renameProperty(value, 'Total', 'Value');
        });
        return statFunctions.percentage(data, 'Value');
    }

    function getCampaignBreakdown(data) {
        data = format(data, 'Id', 'Value');
        statFunctions.percentage(data, 'Value');
        
        //add colors
        angular.forEach(data, function(value, key) {
            value.Id = Number(value.Id);
            value.Color = statFunctions.color(key);
        });
        return data;
    }

    function getPoll(data) {
        var pollResult = {list:[], value:[], label:[], color:[]};

        angular.forEach(data, function(item, key){
            this.list.push(item);
            this.value.push(item.all);
            this.label.push(item.name);
            this.color.push( statFunctions.color(key) );
        }, pollResult);

        return pollResult;
    }

    function getTapThrough(data) {
        return statFunctions.percentage(data, 'interaction');
    }

    function format(data, keyName, valueName) {
        var formated = [];
        angular.forEach(data, function(value, key) {
            var item        = {};
            item[keyName]   = (key === '') ? 'Unknown' : key;
            item[valueName] = value;
            this.push( item );
        }, formated);

        return formated;
    }
    function getData(){
        return data;
    }

    return {
        data:getData,
        setBlipps:setBlipps,
        setInteraction:setInteraction,
        setMarkers:setMarkers,
        setLocation: setLocation,
        getTapThrough:getTapThrough,
        reset:initProperty,
        ready:ready
    };
    
}]);


/* Stat Blipp Model */
dashboardApp.factory('StatBlippModel', ['$filter', 'StatFunctions', 'STATS_CONFIG',
    function($filter, statFunctions, STATS_CONFIG) {
        var daily, hourly, weekly, monthly;
        var startDate, endDate;
        var lastInteractionDate;

        function setData(interaction, users, sDate, eDate) {
            daily = []; hourly = []; weekly = []; monthly = []; lastInteractionDate=null;

            startDate  = sDate;
            endDate    = eDate;

            //find last interaction Date.
            angular.forEach(interaction.daily, function(value, key){
                if(key !== 'total'){ 
                    lastInteractionDate = new Date(key.replace(/-/ig,'/')); 
                }
            });

            //fill empty data based on start & end date..
            var collection = statFunctions.fill(startDate, endDate, STATS_CONFIG.CONST.DAY);
            angular.extend(collection, interaction.daily);

            //daily
            angular.forEach(collection, function(value, key){
                var item = {};
                item.date = new Date( key.replace(/-/ig,'/') );
                item[STATS_CONFIG.CONST.INTERACTION] = value;
                item[STATS_CONFIG.CONST.USERS] = users.daily[key] || 0;
                daily.push( item );
            });

            //hourly
            angular.forEach(interaction.hourly, function(value, key){
                var item = {};
                item.date = new Date(new Date().setHours( key.replace(/-/ig,'/'), 0, 0));
                item[STATS_CONFIG.CONST.INTERACTION] = value;
                item[STATS_CONFIG.CONST.USERS] = users.hourly[key] || 0;
                hourly.push( item );
            });

            //TO DO - weekly, monthly
            // weekly  = statFunctions.fill(startDate, endDate, STATS_CONFIG.WEEK);
            // monthly = statFunctions.fill(startDate, endDate, STATS_CONFIG.MONTH);
        }

        //create empty record for last 3 months from now
        function empty() {
            var data = [];
            for(var i=12;i>0; i--) {
                var now = new Date();
                var obj = {};
                obj[STATS_CONFIG.CONST.DATE] = new Date( now.setMonth(now.getMonth() - i) );
                obj[STATS_CONFIG.CONST.USERS] = 0;
                obj[STATS_CONFIG.CONST.INTERACTION] = 0;
                data.push(obj);
            }
            return data;
        }

        function getHourly() {
            return hourly;
        }
        function getDaily() {
            return daily;
        }
        function getWeekly() {
            return weekly;
        }
        function getMonthly() {
            return monthly;
        }
        function getLastInteractionDate() {
            return lastInteractionDate;
        }

        return {
            empty           : empty,
            setData         : setData,
            hourly          : getHourly,
            daily           : getDaily,
            weekly          : getWeekly,
            monthly         : getMonthly,
            lastInteraction : getLastInteractionDate
        };
    }
]);