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
		ionicMaterialInk.displayEffect();
		$scope.statusArr = [{
			value: '未处理',
			code: '',
			color:'#e24976'
		}, {
			value: '处理中',
			code: '',
			color:'#a0cb00'
		}, {
			value: '已完成',
			code: '',
			color:'#a0cb00'
		}, {
			value: '已取消',
			code: '',
			color:'#e24976'
		}];;
		$scope.mySelect = {
			status: $scope.statusArr[2]
		};
		$scope.isEdit = false;
		$scope.editText = "编辑";
		$scope.goBack = function () {
				$rootScope.goBack();

		};
		$scope.showTitle = false;
		$scope.showTitleStatus = false;
		//$timeout(function () {
		//    $('#relativeId').css('height', window.screen.height-112+'px');
		//},100)

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



		$scope.relationsPopArr = [{
			text: 'CATL销售',
		}, {
			text: '联系人',
		}, {
			text: '正式客户',
		}, {
			text: '潜在客户',
		}, {
			text: '竞争对手',
		}, {
			text: '合作伙伴',
		}];
		$scope.openFollow = function () {
			$scope.followUpModal.show();
		};
	}])


			
