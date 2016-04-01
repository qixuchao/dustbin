// takePictureCtrl
worksheetModule.controller("worksheetTakePictureCtrl",[
	"$scope",
	"$timeout",
	"$ionicActionSheet",
	"$ionicBackdrop",
	"$ionicGesture",
	"$ionicModal",
	"$state",
	function($scope, $timeout, $ionicActionSheet, $ionicBackdrop, $ionicGesture, $ionicModal, $state){

		$scope.config = {
			actionSheet: null,
			imageModal: null
		};

		$scope.datas = {
			showImageItem: {},
			selectedImages:[],
			selectedImagesTest: [
				{	
					filepath: '',
					base64Str: '../../../img/login/login_bg@3x.png',
					text: 'test'
				},
				{
					base64Str: '../../../img/login/login_bg@3x.png',
					text: 'test'
				},
				{
					base64Str: '../../../img/login/login_bg@3x.png',
					text: 'test'
				},
				{
					base64Str: '../../../img/login/login_bg@3x.png',
					text: 'test'
				},
				{
					base64Str: '../../../img/login/login_bg@3x.png',
					text: 'test'
				},
				{
					base64Str: '../../../img/login/login_bg@3x.png',
					text: 'test'
				},
				{
					base64Str: '../../../img/login/login_bg@3x.png',
					text: 'test'
				},
				{
					base64Str: '../../../img/login/login_bg@3x.png',
					text: 'test'
				},
				{
					base64Str: '../../../img/login/login_bg@3x.png',
					text: 'test'
				}
			]
		};

		$scope.init = function(){
			
		};

		$scope.init();

		$scope.closeImageModal = function(){
			$scope.datas.showImageItem = null;
			$scope.config.imageModal.hide();
			$scope.config.imageModal.remove();
			$scope.config.imageModal = null;
		};

		$scope.showImage = function($event, imageInfo){
			//alert($event);
			$scope.datas.showImageItem = imageInfo;
			if($scope.config.imageModal == null){
				$scope.config.imageModal = $ionicModal.fromTemplate("<div class='takePicture-image-modal-wrapper'><div class='close-div'><span ng-click='closeImageModal();'>关闭</span></div><img src='{{datas.showImageItem.base64Str}}'></img></div>", {
					scope: $scope,
					animation: 'slide-in-up',
					hardwareBackButtonClose: true,
					backdropClickToClose: true
				});
			}
			if(!$scope.config.imageModal.isShown()){
				$scope.config.imageModal.show();
			}
		};

		$scope.takePicture = function(){
			$scope.config.actionSheet = $ionicActionSheet.show({
				buttons: [
					{text: '拍照'},
					{text: '相册'}
				],
				//destructiveText: 'Delete',
			    titleText: '选择相片',
			    cancelText: '取消',
			    cssClass: 'image-take-actionsheet',
			    cancel: function(){
			    	//$scope.config.actionSheet();
			    },
			    buttonClicked: function(index){
			    	if(index == 0){ //拍照
			    		$scope.selectImage(0);
			    		return true;
			    	}else if(index == 1){ //相册
			    		$scope.selectImage(1);
			    		return true;
			    	}
			    	//return false;
			    }
			});
		};
		
		$scope.selectImage = function(sourceTypeInt){
			if(angular.isUndefined(Camera) || angular.isUndefined(navigator.camera)){
				alert("Camera 插件未安装!");
				return;
			}
			if(angular.isUndefined(window.plugins) || angular.isUndefined(angular.isUndefined(window.plugins.Base64))){
				alert("Camera 插件未安装!");
				return;
			}
			var sourceType;
	        if(sourceTypeInt == 0){
	            sourceType = Camera.PictureSourceType.CAMERA;
	        }else if(sourceTypeInt == 1){
	            sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
	        }else if(sourceTypeInt == 2){
	            sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
	        }
	        var options = {
	            quality: 50,
	            sourceType: sourceType,
	            destinationType: Camera.DestinationType.FILE_URL, //1, //'FILE_URL',
	            encodingType: Camera.EncodingType.JPEG, //0, //'JPEG',
	            mediaType: Camera.MediaType.PICTURE, //0, //'PICTURE',
	            saveToPhotoAlbum: true,
	            cameraDirection: Camera.Direction.BACK // 0, //'BACK'
	        };
	        if(navigator.camera){
	            navigator.camera.getPicture(function (successRes){
	            	getBase64FromFilepath(successRes);
	            }, function (errorRes){
	            	if(errorRes == "no image selected"){
	            		alert("未选择照片!");
	            	}else if(errorRes == "Camera cancelled"){
	            		alert("取消拍照!");
	            	}else if(errorRes == ""){
	            		alert("未选择照片!");
	            	}else{
	            		alert("照片选择失败!");
	            	}
	            }, options);
	        }else{
	            alert("Camera 插件未安装!");
	        }
		};
		
		function getBase64FromFilepath(filepath){
			//alert(filepath);
			window.plugins.Base64.encodeFile(filepath, function (successRes){
	            $scope.$apply(function(){
	                //$scope.config.showImgSrc = "data:image/jpeg;base64," +successRes;
	                //$scope.config.showImgSrc = successRes;
	                //console.log($scope.config.showImgSrc);
					$scope.datas.selectedImages.unshift({
			        	filepath: filepath,
			        	base64Str: successRes
			        });
			        //alert("getBase64FromFilepath successRes:    "+JSON.stringify($scope.config.uploadFiles2[$scope.config.uploadFiles2.length-1]));
	            });
	        }, function(errorRes){
	        	$scope.alert("选择图片出错!");
	            //alert("getBase64FromFilepath errorRes:    "+JSON.stringify(errorRes));
	        }, {
	            //max_width: 80,
	            //max_height: 80
	        });
		}



	}]);