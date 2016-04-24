// takePictureCtrl
worksheetModule.controller("worksheetTakePictureCtrl",[
	"$scope",
	"$timeout",
	"$ionicActionSheet",
	"$ionicPosition",
	"$ionicBackdrop",
	"$ionicGesture",
	"$ionicModal",
	"$state",
	"HttpAppService",
	"worksheetHttpService",
	"$ionicPopup",
	"worksheetDataService",
	"Prompter",
	function($scope, $timeout, $ionicActionSheet, $ionicPosition,$ionicBackdrop, $ionicGesture, $ionicModal, $state,
			HttpAppService, worksheetHttpService, $ionicPopup, worksheetDataService){

		function __initModal(){
			var ele = angular.element(".modal-backdrop");
		};

		$scope.goBackForPicture = function(){
			var hasLoading = false;
			var needUploadNum = 0;
			var isLoadingNum = 0;
			for(var i = 0; i < $scope.datas.imageDatas.length; i++){
				if($scope.datas.imageDatas[i].uploading){
					hasLoading = true;
					isLoadingNum++;
				}
				if(!$scope.datas.imageDatas[i].isServerHolder){
					needUploadNum++;
				}
			}
			if(isLoadingNum > 0){
				Prompter.wsConfirm("提示",isLoadingNum+'张图片正在上传,确定放弃?',"确定", "取消");
				/*var confirmPopup = $ionicPopup.confirm({
					title: '提示',
					template: isLoadingNum+'张图片正在上传',
					buttons: [
						{
							text: '取消',
							type: 'button-default',
							onTap: function(e){

							}
						},
						{
							text: '放弃',
							type: 'button-default',
							onTap: function(e){
								$scope.$ionicGoBack();
							}
						}
					]
				});*/
				/*confirmPopup.then(function(res) {
			       if(res) {
			         $scope.$ionicGoBack();
			       }else{}
			     });*/
			     return;
			}
			if(needUploadNum > 0){
				Prompter.wsConfirm("提示",'还有'+needUploadNum+"张图片需要上传!确定放弃？","确定", "取消");
				/*var confirmPopup2 = $ionicPopup.confirm({
					title: '提示',
					template: '还有'+needUploadNum+"张图片需要上传!",
					buttons: [
						{
							text: '取消',
							type: 'button-default',
							onTap: function(e){
							}
						},
						{
							text: '放弃上传',
							type: 'button-default',
							onTap: function(e){
								$scope.$ionicGoBack();
							}
						}
					]
				});*/
				return;
			}			
			$scope.$ionicGoBack();
		};

		$scope.$on('modal.hidden', function($event, child) {
			var modalEle = child.el;
			var imgEle = modalEle.getElementsByTagName('img')[0];			
			angular.element(imgEle).removeClass("inited");

			var backdropEleJQ = angular.element(".modal-backdrop");

			var wrapperEleJQ = angular.element(".takePicture-image-modal-wrapper");
			var wrapperEle = wrapperEleJQ[0];
			wrapperEle.style.backgroundColor = "transparent";
			
			$timeout(function (){				
				//img元素取消 transformOrigin 属性
				imgEle.style.transformOrigin = "";
				
			}, 400);
			$timeout(function (){
				backdropEleJQ[0].style="";
				$scope.closeImageModal();
			}, 600);
		});
		$scope.$on('modal.removed', function() {
		    //debugger;
		});
		
		$scope.$on("$destroy", function(){
			__destroyModal();
		});
		function __destroyModal(){
			if($scope.config.imageModal != null){
				if($scope.config.imageModal.isShown()){
					$scope.config.imageModal.hide();
				}
				$scope.config.imageModal.remove();
				$scope.config.imageModal = null;
			}
		}

		$scope.config = {
			actionSheet: null,
			imageModal: null,

			OBJECT_ID: null,
			PROCESS_TYPE: null,

			

			pageNum: 1,
			hasMoreData: true,
			isReloading: false,
			isLoading: false,
			loadingErrorMsg: null
		};

		$scope.datas = {
			imageDatas: [],
			showImageItem: {},
			selectedImages:[],
			selectedImagesTest: [
				{	
					filepath: '',
					base64Str: '../../../img/login/login_bg@3x.png',
					isFromServer: false,
					text: 'test'
				},
				{	
					filepath: '',
					base64Str: '../../../img/login/login_bg@3x.png',
					isFromServer: false,
					text: 'test'
				},
				{
					filepath: '',
					base64Str: '../../../img/login/login_bg@3x.png',
					isFromServer: false,
					text: 'test'
				},
				{
					base64Str: '../../../img/login/login_bg@3x.png',
					isServerHolder: true,
					isFromServer: false,
					isFromPhotos: false,
					uploadOk: true,
					text: 'test'
				}
			]
		};

		$scope.loadMoreData = function(){
			__requestImageList();
		};
		$scope.reloadData = function(){
			console.log("  ----------------   reloadData   ---------------   ");
			__requestImageList();
		};

		$scope.deleteImage = function(item, index){
			__deleteImageInServer(item, index);
		};

		$scope.saveImage = function(item){
		
		};

		$scope.uploadImage = function(item){
			//console.log("uploadImage    :"+JSON.stringify(item));
			var inbond = {
				I_SYSNAME: { 
					SysName: "CATL" 
				},
				IS_AUTHORITY: { 
					BNAME: "HANDLCX02" 
				},
				IS_URL: {
					OBJECT_ID: $scope.config.OBJECT_ID,//  "5200000315",
					PROCESS_TYPE: $scope.config.PROCESS_TYPE,// "ZPRO",
					CREATED_BY: "HANDLCX",
					LINE: ""
				}
			};
			__uploadImage(item, "http://117.28.248.23:9388/test/api/bty/uploadImage", JSON.stringify(inbond));
		};

		function __requestImageList(isRealod){
			var loadingStr = "正在加载";
	        var params = $scope.config.requestParams;
	        var queryParams = {
			    "I_SYSNAME": { "SysName": "CATL" },
			    "IS_AUTHORITY": { "BNAME": "HANDLCX" },
			    "IS_PAGE": {
			    	"CURRPAGE": $scope.config.pageNum++,
			    	"ITEMS": 10
			    },
			    "IS_URL": {
			    	"OBJECT_ID": $scope.config.OBJECT_ID,//'5200000315',
			    	"PROCESS_TYPE": $scope.config.PROCESS_TYPE,//"ZPRO"
			    }
			} 
	        //var promise = HttpAppService.post(worksheetHttpService.imageInfos.listUrl,queryParams);
	        var promise = HttpAppService.post(worksheetHttpService.imageInfos.listUrl,queryParams);
	        $scope.config.isLoading = true;
	        $scope.config.loadingErrorMsg = null;
	        $scope.config.hasMoreData = true;
	        if($scope.config.pageNum <= 1){
	        	$scope.config.isReloading = true;
	        }
	        promise.success(function(response){
	        	$scope.$broadcast('scroll.refreshComplete');
	        	if($scope.config.pageNum <= 1){
	        		$scope.$broadcast('scroll.refreshComplete');
	        	}
	        	$scope.config.isLoading = false;
	        	$scope.config.isReloading = false;
	        	if(response && !response.ES_RESULT){
	        		//Prompter.showLoadingAutoHidden(response, false, 2000);
	        		$scope.config.loadingErrorMsg = response;
	        	}
	        	if(response.ES_RESULT && response.ES_RESULT.ZFLAG && response.ES_RESULT.ZFLAG != "S"){ // 未加载到数据
	        		$scope.config.hasMoreData = false;
	        		$scope.config.loadingErrorMsg = response.ES_RESULT.ZRESULT;
	        		//Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
	        		return;
	        	}

	        	if(!response && !response.ET_OUT_LIST && response.ET_OUT_LIST == ""){
	        		//无返回数据
	        		$scope.config.hasMoreData = false;
	        	}
	        	if(response && response.ET_OUT_LIST && response.ET_OUT_LIST.item && response.ET_OUT_LIST.item.length > 0){
	        		for(var i = 0; i < response.ET_OUT_LIST.item.length; i++){
	        			var item = response.ET_OUT_LIST.item[i];
	        			item.displaySrc=item.LINE;
	        			item.isFromServer = true;
	        			item.isServerHolder = true;
	        			$scope.datas.imageDatas.push(item);
	        		}
	        	}
	        })
	        .error(function(errorResponse){
	        	$scope.$broadcast('scroll.refreshComplete');
	        	$scope.config.isLoading = false;		        	
	        	$scope.config.loadingErrorMsg = "数据加载失败,请检查网络!";
	        	if($scope.config.pageNum <= 1){
	        		$scope.config.isReloading = false;
	        		$scope.$broadcast('scroll.refreshComplete');
	        	}    	
	        });
		};

		/*
			isServerHolder
			isNetworking
            networkTip
			
			isDeleting
            deletedError
            deletedOk
			
            uploading
            uploadOk
            uploadError
		*/
		function __deleteImageInServer(fileItem, index){
			var loadingStr = "正在加载";
	        var queryParams = {
			    "I_SYSNAME": { "SysName": "CATL" },
			    "IS_AUTHORITY": { "BNAME": "HANDLCX" },
			    "IS_URL": {
			      "OBJECT_ID": fileItem.OBJECT_ID,
			      "PROCESS_TYPE": fileItem.PROCESS_TYPE,
			      "OBJIDLO": fileItem.OBJIDLO,
			      "OBJTYPELO": fileItem.OBJTYPELO,
			      "CLASSLO": fileItem.CLASSLO
			    }
			};
	        //var promise = HttpAppService.post(worksheetHttpService.imageInfos.listUrl,queryParams);
	        var promise = HttpAppService.post(worksheetHttpService.imageInfos.deleteUrl,queryParams);
	        fileItem.isNetworking = true;
	        fileItem.networkTip = "正在删除中...请稍候";
	        fileItem.isDeleting = true;
	        promise.success(function(response){
	        	//fileItem.isDeleting = false;
	        	fileItem.isNetworking = false;
	        	fileItem.isDeleting = false;
	        	if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG && response.ES_RESULT.ZFLAG=="S"){
	        		//删除成功
	        		fileItem.deletedOk = true;
	        		fileItem.deletedError = false;
	        		fileItem.isServerHolder = false;
	        		for(var i = 0; i < $scope.datas.imageDatas.length; i++){
	        			if(fileItem == $scope.datas.imageDatas[i]){
	        				// 服务器图片已经删除，此时需要删除本地图片数组中对应的图片对象
	        				//var tempDatas = angular.copy($scope.datas.imageDatas);
	        				$scope.datas.imageDatas.splice(index, 1);
	        				if(!$scope.$$phase){
								$scope.$apply();
							}
	        			}
	        		}
	        	}else{
	        		//fileItem.deletedError = "删除失败,点击重新上传!";
	        		fileItem.networkTip = "删除失败，点击重新上传!";
	        		fileItem.deletedError = true;
	        		fileItem.deletedOk = false;
	        	}
	        })
	        .error(function(errorResponse){
	        	fileItem.isNetworking = false; 
	        	fileItem.deletedOk = false;
	        	fileItem.deletedError = true;
	        });
		}

		$scope.networkClickHandler = function(fileItem, index){
			if(fileItem.isServerHolder){   //对服务器端图片进行操作
				if(fileItem.deletedError){
					__deleteImageInServer(fileItem, index);
				}
			}else if(!fileItem.isServerHolder){		 //对本地且未上传过或未上传成功的图片进行操作
				if(fileItem.uploadError){
					$scope.uploadImage(fileItem);
				}
			}
		};

		$scope.init = function(){

			$scope.config.OBJECT_ID = worksheetDataService.wsDetailToPaiZHao.OBJECT_ID;
			$scope.config.PROCESS_TYPE = worksheetDataService.wsDetailToPaiZHao.PROCESS_TYPE;

			__requestImageList();
		};

		$scope.init();

		$scope.closeImageModal = function(){
			$scope.datas.showImageItem = null;
			__destroyModal();
		};

		$scope.initImageModal = function(){
		};

		$scope.showImage = function($event, imageInfo){
			// 创建并准备显示modal层dome元素
			$scope.datas.showImageItem = imageInfo;
			if($scope.config.imageModal == null){
				$scope.config.imageModal = $ionicModal.fromTemplate("<div ng-init='initImageModal();' class='takePicture-image-modal-wrapper'><div class='close-div'><span ng-click='closeImageModal();'>关闭</span></div><img src='{{datas.showImageItem.displaySrc}}'></img></div>", {
					scope: $scope,
					animation: 'slide-in-up',
					hardwareBackButtonClose: true,
					backdropClickToClose: true
				});
			}
			if(!$scope.config.imageModal.isShown()){
				$scope.config.imageModal.show();
			}

			// modal-backdrop 层设置为display:block; 防止 hide(class)导致界面元素突然消失			
			var backdropEleJQ = angular.element(".modal-backdrop");
			backdropEleJQ[0].style.display = "block";
			
			var wrapperEleJQ = angular.element(".takePicture-image-modal-wrapper");
			var wrapperEle = wrapperEleJQ[0];
			wrapperEle.style.backgroundColor = "rgba(4, 4, 4, 0.49)";
			var eleTempJQ = wrapperEleJQ.find(".img");
			if(eleTempJQ){
				eleTempJQ.removeClass("inited");			
			}

			//alert($event);
			var eleJQ = angular.element($event.target);
			//var elePos = $ionicPosition.position(eleJQ);
			var eleOffset = $ionicPosition.offset(eleJQ);
			//console.log(elePos);
			//console.log(eleOffset);
			var initY = eleOffset.top + eleOffset.height/2;
			var initX = eleOffset.left + eleOffset.width/2;
			
			

			var ele2JQ = angular.element(".takePicture-image-modal-wrapper img");
			var ele2 = ele2JQ[0];
			ele2.style.transformOrigin = initX+"px"+" "+initY+"px";
			ele2JQ.addClass("inited");
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
	            quality: 30,
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
	            	/*if(errorRes == "no image selected"){
	            		alert("未选择照片!");
	            	}else if(errorRes == "Camera cancelled"){
	            		alert("取消拍照!");
	            	}else if(errorRes == ""){
	            		alert("未选择照片!");
	            	}else{
	            		alert("照片选择失败!");
	            	}*/
	            }, options);
	        }else{
	            alert("Camera 插件未安装!");
	        }
		};
		
		function getBase64FromFilepath(filepath){
			//alert(filepath);
			window.plugins.Base64.encodeFile(filepath, function (successRes){
				$scope.datas.imageDatas.push({
			        	filepath: filepath,
			        	displaySrc: successRes
			        });
				if(!$scope.$$phase){
					$scope.$apply();
				}
	        }, function(errorRes){
	        	//$scope.alert("选择图片出错!");
	            //alert("getBase64FromFilepath errorRes:    "+JSON.stringify(errorRes));
	        }, {
	            //max_width: 80,
	            //max_height: 80
	        });
		}

		function __uploadImage(file, url, inbond){
			//alert("__uploadImage2");
			var filepath = file.filepath;
			//var url = encodeURI("http://192.168.31.101:8080/h5uploader/upload");
			var url = encodeURI("http://117.28.248.23:9388/test/api/bty/uploadImage");
			var options = new FileUploadOptions();
			options.fileKey = "image";
			options.fileName = file.name;
			options.mimeType = "image/jpeg";
			options.params = {
				inbond: inbond
			};
			//options.httpMethod = "POST";
			if(FileTransfer){
				//$scope.config.uploadFilesing = true;
				//$scope.config.canShowSelectImageBtn = false;
				var ft = new FileTransfer();
				file.uploading = true;
				file.uploadOk = false;
				file.uploadError = false;
				
				file.isNetworking = true;
	        	file.networkTip = "正在上传中...";
				//alert("开始上传了。。。");
				ft.upload(filepath, url, function (winRes){
					//alert("上传成功:   "+JSON.stringify(winRes));
					file.isServerHolder = true;
					file.uploading = false;
					file.uploadOk = true;
					file.uploadError = false;

					file.isNetworking = false;
	        		file.networkTip = "";

					if(!$scope.$$phase){
						$scope.$apply();
					}
				}, function (errorRes){
					file.isServerHolder = false;
					file.uploading = false;
					file.uploadOk = false;
					file.uploadError = true;
					file.isNetworking = false;
	        		file.networkTip = "";
					$ionicPopup.alert({
						title: '提示',
						template: "上传失败:   "+JSON.stringify(errorRes)
					});
				}, options);
				//alert(filepath+"   "+url+"   "+JSON.stringify(options));
			}else{
				$scope.alert("FileTransfer 插件未安装");
			}
		}



	}]);