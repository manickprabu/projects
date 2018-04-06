'use strict';

dashboardApp.controller('StatShareModalCtrl', [
'$scope', 'campaign', '$modalInstance', 'shareStatsUrlFilter',
function($scope, campaign, $modalInstance, shareStatsUrl) {

    if (campaign.ShareToken) {
        $scope.shareLink = shareStatsUrl(campaign);
    } else {
        angular.copy(campaign).$getSharedToken().then(function(data) {
            campaign.ShareToken = data.ShareToken;
            $scope.shareLink = shareStatsUrl(campaign);
        }).catch(function(errResponse) {
            $.gritter.error('Sorry, something went wrong while getting a link to share. Please try again later.');
            $modalInstance.dismiss();
        });
    }

}]);
