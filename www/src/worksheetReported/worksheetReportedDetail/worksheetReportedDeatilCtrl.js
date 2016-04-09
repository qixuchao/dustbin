worksheetReportModule.controller('WorksheetListReportedDetailCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'$ionicHistory',
	'$ionicScrollDelegate',
	'ionicMaterialInk',
	'ionicMaterialMotion',
	'$timeout',
	'$cordovaDialogs',
	'$ionicModal',
	'$ionicPopover',
	'$cordovaToast',
	'$cordovaDatePicker',
	'Prompter',
	function ($scope, $rootScope,$state, $ionicHistory, $ionicScrollDelegate,
			  ionicMaterialInk, ionicMaterialMotion, $timeout, $cordovaDialogs, $ionicModal, $ionicPopover,
			  $cordovaToast, $cordovaDatePicker, Prompter) {
		//下拉框
		$ionicPopover.fromTemplateUrl('src/worksheetReported/worksheetReportedDetail/model/worksheetReported_select.html', {
			scope: $scope
		}).then(function(popover) {
			$scope.relatedpopover = popover;
		});
		$scope.relatedPopoverShow = function() {
			console.log("--");
			$scope.relatedpopover.show();
			//document.getElementsByClassName('popover-arrow')[0].addClassName ="popover-arrow";
		};
		$scope.relatedPopoverhide = function() {
			$scope.relatedpopover.hide();
			//document.getElementsByClassName('popover-arrow')[0].removeClass ="popover-arrow";
		};
		$scope.related_types = ['报工','已取消'];
		$scope.relatedqueryType = function(type){
			$scope.relatedPopoverhide();
		};

		//弹窗
		$ionicPopover.fromTemplateUrl('src/worksheetReported/worksheetReportedDetail/model/worksheetReported_point.html', {
			scope: $scope
		}).then(function (popover) {
			$scope.createPop = popover;
		});
		$scope.openpoint = function () {
			console.log("==");
			$scope.createPop.show();
		};


		ionicMaterialInk.displayEffect();

		$scope.goBack = function () {
				$rootScope.goBack();

		};
		$scope.showTitle = false;
		$scope.showTitleStatus = false;

		var position;
		var maxTop;
		$scope.onScroll = function () {
			position = $ionicScrollDelegate.getScrollPosition().top;
			if (position > 10) {
				$scope.TitleFlag = true;
				$scope.showTitle = true;
				if (position > 26) {
					$scope.customerFlag = true;
				} else {
					$scope.customerFlag = false;
				}
				if (position > 54) {
					$scope.placeFlag = true;
				} else {
					$scope.placeFlag = false;
				}
				//if (position > 80) {
				//	$scope.typeFlag = true;
				//} else {
				//	$scope.typeFlag = false;
				//}
				//if (position > 109) {
				//	$scope.statusFlag = true;
				//} else {
				//	$scope.statusFlag = false;
				//}
				if (position > 80) {
					if (maxTop == undefined) {
						maxTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;
					}
					$scope.showTitleStatus = true;
				} else {
					$scope.showTitleStatus = false;
				}
				if (position > maxTop) {
					//$ionicScrollDelegate.scrollBottom(false)
				}
			} else {
				$scope.customerFlag = false;
				$scope.placeFlag = false;
				$scope.typeFlag = false;
				$scope.statusFlag = false;
				$scope.showTitle = false;
				$scope.TitleFlag = false;
				$scope.showTitleStatus = false;
			}
			if(!$scope.$$phase) {
				$scope.$apply();
			}

		};
		$scope.edit = function (){
			//$state.go("worksheetReportedInfosList");
		}
		$scope.reportedInfos = function(){
			$state.go("worksheetReportedCreate");
		}
	}])


			
