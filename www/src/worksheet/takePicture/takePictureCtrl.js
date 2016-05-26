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
	"$sce",  
	"$cordovaToast", 
	function($scope, $timeout, $ionicActionSheet, $ionicPosition,$ionicBackdrop, $ionicGesture, $ionicModal, $state,
			HttpAppService, worksheetHttpService, $ionicPopup, worksheetDataService, Prompter, $sce, $cordovaToast){
		
		$scope.$on("$stateChangeStart", function (event2, toState, toParams, fromState, fromParam){
            if(fromState && fromState.name == 'worksheetTakePicture'){
                /*if(window.event && window.event.type == "popstate"){
                    if($scope.config.__popstateFlag){
                        $scope.config.__popstateFlag = false;
                    }else{
                        event2.preventDefault(); 
                        $scope.config.__popstateFlag = true;
                        $scope.goBackForPicture();
                    }
                }*/
            }
        }); 

		function __initModal(){
			var ele = angular.element(".modal-backdrop");
		};

		$scope.goBackForPicture = function(){
			//console.log("----- goBackForPicture ----- start");
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
			
			//console.log("----- goBackForPicture ----- 1");
			if(isLoadingNum > 0){
				Prompter.wsConfirm("提示",isLoadingNum+'张图片正在上传,确定放弃?',"确定", "取消");
			     return;
			}
			//console.log("----- goBackForPicture ----- 2 "+needUploadNum+ '  --abc');
			if(needUploadNum > 0){
				Prompter.wsConfirm("提示","还有"+needUploadNum+"张图片需要上传!确定放弃？","确定", "取消");
				return;
			}
			console.log("----- goBackForPicture ----- 3");
			$scope.$ionicGoBack();
			console.log("----- goBackForPicture ----- end");
		};
		
		
		$scope.config = {
			actionSheet: null,
			imageModal: null,
			cantnotEdit: false,

			OBJECT_ID: null,
			PROCESS_TYPE: null,
			STATUS_CODE: '',

			

			pageNum: 1,
			hasMoreData: true,
			isReloading: false,
			isLoading: false,
			loadingErrorMsg: null,

			uploadingText: "正在上传中 ... #PROGRESS#",


			fileItemDefaults: {
				originServer: false,
				originPhoto: false,
				originCamera: false,

				isServerHolder: false,
				isNetworking: false,
				networkTip: "",
				networkResultDesc: '',

				isDeleting: false,
				deletedError: false,
				deletedOk: false,

				isSaving: false,
				isSaved: false,
				saveTip: '',

				uploading: false,
				uploadOk: false,
				uploadError: false,
				uploadPercentDesc: "",

				src: "",
				fileLocalPath: ""
			}
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

		$scope.deleteSelectedImage = function(){
			$scope.deleteImage($scope.datas.showImageItem, $scope.datas.showImageItemIndex);
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
					SysName: worksheetDataService.getStoredByKey("sysName") 
				},
				IS_AUTHORITY: { 
					BNAME: worksheetDataService.getStoredByKey("userName")
				},
				IS_URL: {
					OBJECT_ID: $scope.config.OBJECT_ID,//  "5200000315",
					PROCESS_TYPE: $scope.config.PROCESS_TYPE,// "ZPRO",
					CREATED_BY: worksheetDataService.getStoredByKey("userName"), //"HANDLCX",
					LINE: ""
				}
			};
			//ROOTCONFIG.hempConfig.UploadImageUrl;			
			// http://117.28.248.23:9388/test/api/bty/uploadImage
			var url = ROOTCONFIG.hempConfig.basePath + "uploadImage";
			__uploadImage(item, url, JSON.stringify(inbond));
		};


		$scope.reuploadItem = function(item){
			$scope.uploadImage(item);
		};   
		$scope.cancelUploadItem = function(item){
			__deleteItemInLocal(item);
		};


		function __requestImageList(isRealod){
			var loadingStr = "正在加载";
	        var params = $scope.config.requestParams;
	        var queryParams = {
			    "I_SYSNAME": { "SysName": worksheetDataService.getStoredByKey("sysName") },
			    "IS_AUTHORITY": { "BNAME": worksheetDataService.getStoredByKey("userName") },
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
	        			var newFileItem = angular.copy($scope.config.fileItemDefaults);
	        			angular.extend(newFileItem, {
							OBJECT_ID: item.OBJECT_ID,
							PROCESS_TYPE: item.PROCESS_TYPE,
							KW_RELATIVE_URL: item.KW_RELATIVE_URL,
							OBJIDLO: item.OBJIDLO,
							CLASSLO: item.CLASSLO,

					        src: item.LINE,
					        imgObj: new Image(),
					        OBJTYPELO: item.OBJTYPELO,
					        isFromServer: true,
					        isServerHolder: true,

					        sub: '<div class="buttons">\
						        	<div class="button button-clear">删除</div>\
						        	<div class="button button-clear">保存到本地</div>\
						        	<div ng-click="xbrCloseModal();" class="button button-clear button-return">返回</div>\
					        	</div>'
						});
	        			newFileItem.imgObj.src = item.LINE;
	        			newFileItem.imgObj.onload = function(xbrEvent){
	        				this.xbrRealWidth = xbrEvent.currentTarget.width;
	        				this.xbrRealHeight = xbrEvent.currentTarget.height;
	        				//img.imgObj.complete
	        			};
	        			$scope.datas.imageDatas.push(newFileItem);
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
		
		//$scope.config.xbrObj = {};
		/*$scope.xbrCloseModal = function(){
			console.log("xbrCloseModal");
			var eleJQ = angular.element(".modal-backdrop.active .modal-wrapper ion-header-bar");
			eleJQ.scope().closeModal();
		};*/
		
		$scope.ionGalleryClickCallback = function(item){
			console.log("$scope.ionGalleryClickCallback    "+item);
			var scope1 = angular.element("#takepicture-content .image-container").scope();
			scope1.showImage(item.position);
		};
		
		$scope.saveSelectedImage = function(){
			console.log("$scope.saveSelectedImage ");
		};
		
		$scope.deleteThisImage = function(item){
			console.log("$scope.deleteThisImage:   "+item.position);
			__deleteImageInServer(item, item.position);
		};
		
		$scope.saveThisImage = function(item){
			// if(item.isSaved){
			// 	// $cordovaToast.showShortBottom("该图片已保存过!");
			// 	// return;
			// }
			//if(angular.isUndefined(item.imgObj)){// 本地照片
				// $cordovaToast.showShortBottom("本地图片,无须保存!");
				// return;
			//}
			if(item.imgObj && !item.imgObj.complete){
				$cordovaToast.showShortBottom("该图片还未加载完成，请稍候再试!");
				return;
			}
			item.isSaving = true;
			item.saveTip = "正在保存...";
			item.isSaved = true;
			var imageDataUrl = "";
			console.log("$scope.saveThisImage:   "+item.position);
			var imgJQ = angular.element("#crm-pictures-"+item.position);//#takepicture-content
			var imgEle = imgJQ[0];
			/*if(imgEle.src.startsWith("http")){
				imageDataUrl = imgEle.src;
			}else{
			}*/
			
			var tempImage = item.imgObj;
			if(!tempImage || tempImage == null){
				tempImage = new Image();
				tempImage.src = imgEle.src
			}
			//tempImage.src = imgEle.src;
			var canvas = document.createElement('canvas');
			canvas.width = tempImage.width;
			canvas.height = tempImage.height;
			//alert(tempImage.width+"     "+tempImage.height);
			var context = canvas.getContext('2d');
        	context.drawImage(imgEle, 0, 0);
        	imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
			imageDataUrl = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
			window.canvas2ImagePlugin.saveImageDataToLibrary(
		        function(msg){
		            console.log(msg);
		            item.isSaving = false;
					item.saveTip = "已保存成功!";
					item.isSaved = true;
		            $cordovaToast.showShortBottom("已经保存成功!");
		        },
		        function(err){
		            console.log(err);
		            item.isSaving = false;
					item.saveTip = "保存失败!";
					item.isSaved = false;
					$timeout(function(){
						item.saveTip = "重新保存";
					});
					$cordovaToast.showShortBottom("保存失败,请重试!");
		        },
		        canvas
		    );
			
		};
		
		function __deleteImageInServer(fileItem, index){
			//alert(JSON.stringify(fileItem));

			/*var tempSrc = fileItem.src;
    		fileItem.src = "";
    		alert(JSON.stringify(fileItem));
    		fileItem.str = tempSrc;*/

			var loadingStr = "正在加载";
	        var queryParams = {
			    "I_SYSNAME": { "SysName": worksheetDataService.getStoredByKey("sysName") },
			    "IS_AUTHORITY": { "BNAME": worksheetDataService.getStoredByKey("userName") },
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
		
		function __deleteItemInLocal(item){
			for(var i = 0; i < $scope.datas.imageDatas.length; i++){
    			if(item == $scope.datas.imageDatas[i]){
    				$scope.datas.imageDatas.splice(i, 1);
    				if(!$scope.$$phase){
						$scope.$apply();
					}
    			}
    		}
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
			$scope.config.STATUS_CODE = worksheetDataService.wsDetailToPaiZHao.STATUS_CODE;
			$scope.config.cantnotEdit = worksheetDataService.wsDetailToPaiZHao.cantnotEdit;
			__requestImageList();

			var ele = angular.element("body")[0];
			ele.style.pointerEvents = "auto";
		};
		
		$scope.init();

		$scope.closeImageModal = function(){
			/*if($scope.datas.showImageItem && $scope.config.imageModal.isShown()){
				$scope.datas.showImageItem.hide();
				$scope.config.imageModal.remove();
			}*/
			__destroyModal();
			$scope.datas.showImageItem = null;
			angular.element("body").removeClass("modal-open");
		};

		$scope.initImageModal = function(){
		};

		function __removeModalOpenClass(){
		}
		/*
			<div class='images-buttons buttons'>\
				<div class=button button-clear ng-click='deleteImage();'>删除</div>\
				<div class=button button-clear ng-click='saveImage();'>保存在本地</div>\
			</div>\
		*/
		$scope.showImage = function($event, imageInfo, index){
			angular.element("body").removeClass("modal-open");
			// 创建并准备显示modal层dome元素
			$scope.datas.showImageItem = imageInfo;
			$scope.datas.showImageItemIndex = index;
			//if($scope.config.imageModal == null){
				$scope.config.imageModal = $ionicModal.fromTemplate("<div class='takePicture-image-modal-wrapper'>" +
							"<div class='close-div'> <span ng-click='closeImageModal();'>关闭</span> </div>" +
							"<div class='modal-img-wrapper'><img ng-src='{{datas.showImageItem.src}}' style='z-index:20;'></img></div>" +
							"<div class='images-buttons buttons'>" +
								"<div class='button button-clear' ng-click='deleteSelectedImage();'>删        除</div>" +
								"<div class='button button-clear' ng-click='saveSelectedImage();'>保存在本地</div>" +
							"</div>" +
							"</div>", {
					scope: $scope,
					animation: 'slide-in-up',
					hardwareBackButtonClose: true,
					backdropClickToClose: true
				});
			//}
			if(!$scope.config.imageModal.isShown()){
				$scope.config.imageModal.show();
			}
			/*var ele2JQ = angular.element(".takePicture-image-modal-wrapper img");
			ele2JQ.addClass("inited");*/

			// modal-backdrop 层设置为display:block; 防止 hide(class)导致界面元素突然消失			
			var backdropEleJQ = angular.element(".modal-backdrop");
			backdropEleJQ[0].style.display = "block";
			
			var wrapperEleJQ = angular.element(".takePicture-image-modal-wrapper");
			var wrapperEle = wrapperEleJQ[0];
			//wrapperEle.style.backgroundColor = "rgba(4, 4, 4, 0.49)";
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
			console.log(initX+"px"+"     "+initY+"px");
			ele2JQ.addClass("inited");
		};
		$scope.$on('modal.hidden', function($event, child) {
			//console.log(" image modal.hidden ~~~ ");
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
			}, 150); //400
			
			$timeout(function (){
				backdropEleJQ[0].style="";
				$scope.closeImageModal();
			}, 300); //600

			/*var ele2JQ = angular.element(".takePicture-image-modal-wrapper img");
			ele2JQ.removeClass("inited");

			$timeout(function (){
				//$scope.closeImageModal();
			}, 300);*/

		});
		$scope.$on('modal.removed', function() {
		    //debugger;
		});
		$scope.$on("$destroy", function(){
			__destroyModal();
			var ele = angular.element("body")[0];
			ele.style.pointerEvents = "";
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

		/*
			默认参数：
				{
					originServer: false,
					originPhoto: false,
					originCamera: false,

					isServerHolder: false,
					isNetworking: false,
					networkTip: false,
					networkResultDesc: '',

					isDeleting: false,
					deletedError: false,
					deletedOk: false,

					uploading: false,
					uploadOk: false,
					uploadError: false,
					uploadPercentDesc: '',

					src: "",
					fileLocalPath: ""
				}
			originServe		：图片来源为server 	boolean   
			originPhoto		：图片来源为photo     boolean 	
			originCamera	：图片来源为拍照		boolean

			isServerHolder  ：服务器是否存在该图片  boolean
			isNetworking	：是否在上传或者删除    boolean
            networkTip		：上传或删除的提示语句   string
            networkResultDesc ：上传成功或失败、删除成功或失败的原因或描述  string
			
			isDeleting		：正在删除       boolean
            deletedError	：删除失败的原因 boolean
            deletedOk		：删除成功	   boolean
			
            uploading 		：正在上传
            uploadOk		：上传成功
            uploadError 	：上传失败	boolean
		*/
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
	            quality: 5, 
	            sourceType: sourceType,
	            destinationType: Camera.DestinationType.FILE_URL, //1, //'FILE_URL',
	            encodingType: Camera.EncodingType.JPEG, //0, //'JPEG',
	            mediaType: Camera.MediaType.PICTURE, //0, //'PICTURE',
	            saveToPhotoAlbum: true,
	            cameraDirection: Camera.Direction.BACK // 0, //'BACK'
	        };
	        if(navigator.camera){
	            navigator.camera.getPicture(function (successRes){
	            	getBase64FromFilepath(successRes, sourceTypeInt);
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
		
		function getBase64FromFilepath(filepath, sourceTypeInt){
			//alert(filepath);
			window.plugins.Base64.encodeFile(filepath, function (successRes){
				var newFileItem = angular.copy($scope.config.fileItemDefaults);
				var isFromCamera = false;
				if(sourceTypeInt == 0){
					isFromCamera = true;
				}
				angular.extend(newFileItem, {
					fileLocalPath: filepath,
			        src: successRes,
			        isFromCamera: isFromCamera,
			        isFromPhotos: !isFromCamera
				});

				$scope.datas.imageDatas.push(newFileItem);
				$scope.uploadImage(newFileItem);
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
			var filepath = file.fileLocalPath;
			//var url = encodeURI("http://192.168.31.101:8080/h5uploader/upload");
			//var url = encodeURI("http://117.28.248.23:9388/test/api/bty/uploadImage");
			var uploadUrl = ROOTCONFIG.hempConfig.basePath + "uploadImage";
			var url = encodeURI(uploadUrl);
			var options = new FileUploadOptions();
			options.fileKey = "image";
			options.fileName = file.name;
			options.mimeType = "image/jpeg";
			var tokens = HttpAppService.getToken();
			options.headers = {
				token: tokens.token+"",
				timestamp: tokens.timestamp,
				userKey: tokens.userKey,
				timeout: 100000
			};
			// alert(JSON.stringify(tokens));
			// alert(JSON.stringify(options));
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
				/*ft.onprogress = function(progressEvent){
					var percent = progressEvent.loaded / progressEvent.total;
						//file.uploadPercentDesc = $scope.config.uploadingText + "" + percent;
						file.networkTip = $scope.config.uploadingText + percent;
						if(!$scope.$$phase){
							$scope.$apply();
						}
					// uploadingText: "正在上传中 ... ",
					if (progressEvent.lengthComputable) {
						
				      //loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
				    } else {
				      //loadingStatus.increment();
				    }
				};*/
				
				file.isNetworking = true;
	        	file.networkTip = "正在上传中...";
	        	//var startTime = new Date();
				//alert("开始上传了。。。");
				ft.upload(filepath, url, function (winRes){
					//alert("上传成功:   "+JSON.stringify(winRes));
					file.isServerHolder = true;
					file.uploading = false;
					file.uploadOk = true;
					file.uploadError = false;
					
					file.isNetworking = false;
	        		file.networkTip = "";
	        		
	        		//var response = (typeof winRes.response == "string") ? JSON.parse(winRes.response) : winRes.response;
	        		var response = JSON.parse(winRes.response);
	        		if(response.ES_OBJECT){
	        			file.OBJECT_ID = $scope.config.OBJECT_ID;  //  "5200000315
	        			file.PROCESS_TYPE = $scope.config.PROCESS_TYPE;// "ZPRO",;
	        			file.OBJIDLO = response.ES_OBJECT.OBJID;
	        			file.OBJTYPELO = response.ES_OBJECT.OBJTYPE;
	        			file.CLASSLO = response.ES_OBJECT.CLASS;
	        		}
	        		
	        		/*var tempSrc = file.src;
	        		file.src = "";
	        		alert(JSON.stringify(file));
	        		file.str = tempSrc;*/

					if(!$scope.$$phase){
						$scope.$apply();
					}
				}, function (errorRes){
					//var endTime = new Date();
					file.isServerHolder = false;
					file.uploading = false;
					file.uploadOk = false;
					file.uploadError = true;
					file.isNetworking = false;
	        		file.networkTip = "";
	        		var desc = "";
	        		//var  endTime - startTime >= config.timeout;
	        		if(!errorRes || errorRes == null){
	        			desc = ": 请检查网络!";
	        		}
					$ionicPopup.alert({
						title: '提示',
						template: "上传失败"+desc
					});
				}, options);
				//alert(filepath+"   "+url+"   "+JSON.stringify(options));
			}else{
				$scope.alert("FileTransfer 插件未安装");
			}
		}



	}]);