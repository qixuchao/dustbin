// takePictureCtrl
worksheetModule.controller("selectStaffCtrl",[
	"$scope",
	"$timeout",
	"$ionicActionSheet",
	"$ionicPosition",
	"$ionicBackdrop",
	"$ionicGesture",
	"$ionicModal",
	"$state",
	"$ionicPopup",
	function($scope, $timeout, $ionicActionSheet, $ionicPosition,$ionicBackdrop, $ionicGesture, $ionicModal, $state, $ionicPopup){
		
		$scope.config = {
			actionSheet: null,
			imageModal: null,
			myPopup: null,
			//template: '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>'
		};
		
		$scope.datas = {
			selectedUsers: [],
			userQueryResults:[
				{
					user_name: '李德军',
					user_title: '销售人员',
					user_phone: '15966532465'
				},
				{
					user_name: '王氏林',
					user_title: '销售人员',
					user_phone: '15966532465'
				},
				{
					user_name: '黄景川',
					user_title: '销售人员',
					user_phone: '15966532465'
				},
				{
					user_name: '张敏敏',
					user_title: '销售人员',
					user_phone: '15966532465'
				}
			]
		};
		
		$scope.init = function(){
		};

		$scope.init();

		$scope.queryUsers = function(){

		};

		$scope.confirmSelected = function($event){
			$scope.showPopup();
		};

		$scope.showPopup = function(){
			$scope.config.myPopup = $ionicPopup.show({
				template: '<div>状态已变更为   “<span>已派工</span>”</div><div>并分配至   “<span>李德军</span>”</div>',
				title: '提示',
				cssClass: 'select-staff-mypopup',
				scope: $scope,
				buttons: [
					{text: '确定'}
				]
			});
		};
		

		$scope.$on("$destroy", function(){
			
		});


	}]);







