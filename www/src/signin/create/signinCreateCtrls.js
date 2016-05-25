signinModule.controller('signinCreateCtrl', [
	'$scope',
	"$timeout", 
	"signinService",
	"$state",
	function ($scope, $timeout, signinService, $state) {

	$scope.config = {
		address: '',
		signInDate: '',
		signInTime: '',
		comment: ''
	};

	$scope.datas = {

	};

	$scope.init = function(){
		$scope.config.signInDate = '';
		$scope.config.signInTime = '';
	};
	$scope.init();

	$scope.saveNewSingin = function(){
		var options = {
		    "person_code":"60000051",
		    "person_name":"刘 楚兴",
		    "address": $scope.config.address,
		    "sign_in_date": $scope.config.signInDate,
		    "sign_in_time": $scope.config.signInTime,
		    "comment": $scope.config.comment
		};
		__requestSaveNewSingin(options);
	};

	function __requestSaveNewSingin(options){

	}


}]);