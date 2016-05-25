signinModule.controller('signinDetailCtrl', [
	'$scope',
	"$timeout", 
	"signinService",
	"$state",
	"HttpAppService",
	"Prompter",
	function ($scope, $timeout, signinService, $state, HttpAppService, Prompter) {

	
	$scope.config = {
		isEditMode: false
	};
	$scope.datas = {
		detail: null
	};
	$scope.init = function(){
		$scope.datas.detail = signinService.currentSigninDetail;
		$scope.datas.detail.comment_edit = $scope.datas.detail.comment;
		$scope.datas.detail.address_edit = $scope.datas.detail.address;
	};
	$scope.init();

	$scope.cancleEdit = function(){
		$scope.config.isEditMode = false;
	};
	$scope.enterEditMode = function(){
		$scope.config.isEditMode = true;
	};
	$scope.editConfirm = function(){
		__requestSaveSignin();
	};

	function __requestSaveSignin(){
		__requestSaveSignin({
			"attendance_id": $scope.datas.detail.attendance_id,
			"comment": $scope.datas.detail.comment_edit
		}, function(response){
			$scope.datas.detail.comment = $scope.datas.detail.comment_edit;
			$scope.config.isEditMode = false;
		});
	}

	function __requestSaveSignin(options, successCallback){
        var url = signinService.signin_list.url;
        // var postDatas = signinService.signin_list.defaults;
        // angular.extend(postDatas, options);
        var promise = HttpAppService.post(url, options);
        Prompter.showLoading("正在保存");
        promise.success(function(response, status, obj, config){
        	
        	//Prompter.hideLoading();
        })
        .error(function(errorResponse){
        	Prompter.showLoadingAutoHidden("数据加载失败,请检查网络!");
        });
	}



}]);

