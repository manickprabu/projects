'use strict';

/* STAT HELPER FUNCTION */
dashboardApp.factory('StatFunctions', ['$filter', 'STATS_CONFIG', function($filter, STATS_CONFIG) {

    function getBlippName(blipps, blippId) {
        for(var index in blipps) {
            if(blipps[index].Id === blippId) {
                return blipps[index].Name;
            }
        }
        return blippId;
    }

    function fill(startDate, endDate, type) {
        startDate = new Date(startDate.replace(/-/ig,'/'));
        endDate = new Date(endDate.replace(/-/ig,'/'));
        var date;
        var collection = {};

        while(startDate<=endDate) {
            if(type === STATS_CONFIG.CONST.DAY) {
                date = [ startDate.getFullYear(), zero(startDate.getMonth()+1), zero(startDate.getDate()) ].join('-');
                startDate.setDate(startDate.getDate()+1);
            } 
            else if(type === STATS_CONFIG.CONST.WEEK) {
                startDate.setDate(startDate.getDate()+7);
                date = [ startDate.getFullYear(), zero(startDate.getMonth()+1), zero(startDate.getDate()) ].join('-');
            }
            else if(type === STATS_CONFIG.CONST.MONTH) {
                startDate.setMonth(startDate.getMonth() + 1);
                date = [ startDate.getFullYear(), zero(startDate.getMonth()+1) ].join('-');
            }

            collection[date] = 0;
        }

        return collection;
    }

    function zero(date){
        return date < 10 ? '0' + date : date;
    }

    function findNearestWeek(target, day) {
        var date = new Date(day);

        while(! target.hasOwnProperty(day) ) {
            date.setDate(date.getDate()+1);
            day = [ date.getFullYear(), zero(date.getMonth()+1), zero(date.getDate()) ].join('-');
        }
        return day;
    }

    //convert list of value into percentage
    //i.e: [40,15,30,40] => [32,12,24,32] (100%)
    function percentage(data, property) {
        var sum = 0;
        angular.forEach(data, function(value){
            sum += value[property];
        });
        angular.forEach(data, function(value){
            value.Percentage = Number( Number(value[property] / sum * 100).toFixed(1) ); 
            value.Percentage = isNaN( value.Percentage ) ? 0.0 : value.Percentage;
        });
        return data;
    }

    function renameProperty(obj, oldName, newName) {
        if(!obj.hasOwnProperty(oldName)) {
            return false;
        }
        obj[newName] = obj[oldName];
        delete obj[oldName];
        return true;
    }

    function color(index) {
        var l = STATS_CONFIG.COLORS.length;
        index = (index % l);
        return STATS_CONFIG.COLORS[ index ];
    }

    return {
        zero                :zero,
        fill                :fill,
        color               :color,
        findNearestWeek     :findNearestWeek,
        percentage          :percentage,
        getBlippName        :getBlippName,
        renameProperty      :renameProperty
    };  
}]);