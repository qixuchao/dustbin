visitModule.controller('visitCreateCtrl', [
	"$scope",
	"BaiduMapServ",
	"$cordovaToast",
	"$ionicActionSheet",
	"$ionicModal",
	"LoginService",
	"saleActService",
	"HttpAppService",
	"$ionicScrollDelegate",
	"$rootScope",
	"relationService",
	function ($scope, BaiduMapServ, $cordovaToast, $ionicActionSheet,
		$ionicModal, LoginService, saleActService, HttpAppService,
		$ionicScrollDelegate, $rootScope,
		relationService){
	$scope.config = {
		isLocationing: false,
		address: '',
		selectedCustomer: null,
		relationObj:{},
		selectedRelations: [
			// {
			// 	NAME:"abc",
			// 	TEL_NUMBER: '110'
			// }
		],
		startTime: '2016-03-01 12:00',
		endTime: '',
		visitComment: '',
		pictures:[
			{
				src: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
			},
			{
				src: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
			},
			{
				src: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
			},
			{
				src: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
			}
		],
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

	$scope.init = function(){
		$scope.caclCurrentLocation();
	};

	$scope.visitCreateConfirm = function(){
		var queryParams = {
			"IS_DATE": {
		      "DATE_FROM": "",
		      "TIME_FROM": "",
		      "DATE_TO": "",
		      "TIME_TO": ""
		    },
		    "IS_HEAD": {
		      "PROCESS_TYPE": "ZVIS",
		      "DESCRIPTION": "",
		      "ACT_LOCATION": $scope.config.address,
		      "ESTAT": "E0001"
		    },
		    "IT_PARTNER": {
		      "item_in": []
		    },
		    "IT_TEXT": {
		      "item_in": []
		    }
		};
		// Z006:客户拜访总结 、Z007:评论
		if(!angular.isUndefined($scope.config.visitComment) && $scope.config.visitComment!=null && $scope.config.visitComment!=""){
			queryParams.IT_TEXT.item_in.push({
				TDID: 'Z006',
				TDSPRAS: '',
				TDFORMAT: '',
				TDLINE: $scope.config.visitComment
			});
		}
		//添加相关方: ZCUSTOME 客户 		ZCUSTCTT 客户联系人
		if(!angular.isUndefined($scope.config.selectedRelations) && $scope.config.selectedRelations!=null && !!$scope.config.selectedRelations.length){
			angular.forEach($scope.config.selectedRelations, function(data){
				queryParams.IT_PARTNER.item_in.push({
					PARTNER_FCT: 'ZCUSTCTT',
					PARTNER: data.PARTNER
				});
			});
		}
		if(!angular.isUndefined($scope.config.selectedCustomer) && $scope.config.selectedCustomer!=null){
			queryParams.IT_PARTNER.item_in.push({
				PARTNER_FCT: 'ZCUSTOME',
				PARTNER: $scope.config.selectedCustomer.PARTNER
			});
		}
		__requestCreateVisit(requestParams);
	};

	//visitService.visit_create.url    visitService.visit_create.defaults
	function __requestCreateVisit(options, successCallback){
		var url = visitService.visit_create.url;
        var postDatas = angular.copy(visitService.visit_create.defaults);
        angular.extend(postDatas, options);
        var promise = HttpAppService.post(url, postDatas);
        Prompter.showLoading("正在创建");
        promise.success(function(response, status, obj, config){
        	if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG=="S"){
        		if(successCallback) successCallback(response);
        	}else if(response && response.ES_RESULT && response.ES_RESULT.ZRESULT && response.ES_RESULT.ZRESULT != null){
        		Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
        	}else{
        		Prompter.showLoadingAutoHidden(JSON.stringify(response), false, 2000);
        	}
        	//Prompter.hideLoading();
        })
        .error(function(errorResponse){
        	Prompter.showLoadingAutoHidden("数据加载失败,请检查网络!", false, 2000);
        });
	}

	$scope.deleteItem = function(item, index){
		var bArray = $scope.config.selectedRelations.slice(0, index);
		var aArray = $scope.config.selectedRelations.slice(index+1);
		$scope.config.selectedRelations = bArray.concat(aArray);
	};

	$scope.caclCurrentLocation = function(){
		__requestCurrentLocation();
	};

	function __requestCurrentLocation(){
		if($scope.config.isLocationing){
			return;
		}
		$scope.config.isLocationing = true;
		BaiduMapServ.getCurrentLocation().then(function (success) {
            console.log('getCurrentLocation success = ' + angular.toJson(success));
            var lat = success.lat;
            var lng = success.long;
            BaiduMapServ.locationToAddress(lat, lng).then(function(response){
            	$scope.config.isLocationing = false;
            	if(response && response.formatted_address && response.formatted_address !=""){
            		$scope.config.address = response.formatted_address;
            		if($scope.$phase){
            			$scope.$apply();
            		}
            	}
	        }, function(response){
	        	$scope.config.isLocationing = false;
	        	$cordovaToast.showShortBottom(angular.toJson(response));
	        });
        }, function (error) {
        	$scope.config.isLocationing = false;
        	$cordovaToast.showShortBottom(angular.toJson(error));
        });
	}


	$scope.init();


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
            }, options);
        }else{
            alert("Camera 插件未安装!");
        }
	};
	
	function getBase64FromFilepath(filepath, sourceTypeInt){
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
			$scope.config.pictures.push(newFileItem);
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

	function __uploadImage(file, url, inbond){
		var filepath = file.fileLocalPath;
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
			
			file.isNetworking = true;
        	file.networkTip = "正在上传中...";
			ft.upload(filepath, url, function (winRes){
				//alert("上传成功:   "+JSON.stringify(winRes));
				file.isServerHolder = true;
				file.uploading = false;
				file.uploadOk = true;
				file.uploadError = false;
				
				file.isNetworking = false;
        		file.networkTip = "";
        		
        		var response = JSON.parse(winRes.response);
        		if(response.ES_OBJECT){
        			file.OBJECT_ID = $scope.config.OBJECT_ID;  //  "5200000315
        			file.PROCESS_TYPE = $scope.config.PROCESS_TYPE;// "ZPRO",;
        			file.OBJIDLO = response.ES_OBJECT.OBJID;
        			file.OBJTYPELO = response.ES_OBJECT.OBJTYPE;
        			file.CLASSLO = response.ES_OBJECT.CLASS;
        		}
        		
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


	//选择客户
    var customerPage = 1;
	    $scope.customerArr = [];
	    $scope.customerSearch = false;
	    $scope.input = {customer:''};
	    var customerType = "";
	    if(ROOTCONFIG.hempConfig.baseEnvironment=='CATL'){
	        if(LoginService.getProfileType()=="APP_SALE"){
	            customerType='CRM000';
	        }
	        if(LoginService.getProfileType()=="APP_SERVICE"){
	            customerType='Z00004';
	        }
	    }else{
	        customerType='CRM000';
	    }

	    $scope.getCustomerArr = function (search) {
	        $scope.isError = false;
	        if (search) {
	            $scope.customerArr = [];
	            $scope.customerSearch = false;
	            customerPage = 1;
	        } else {
	            $scope.spinnerFlag = true;
	        }
	        var data = {
	            "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
	            "IS_PAGE": {
	                "CURRPAGE": customerPage++,
	                "ITEMS": "10"
	            },
	            "IS_SEARCH": {"SEARCH": $scope.input.customer},
	            "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
	            "IT_IN_ROLE": {
	                "item1": {"RLTYP": customerType}
	            }
	        };
	        HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST', data)
	            .success(function (response, status, headers, config) {
	                if (config.data.IS_SEARCH.SEARCH != $scope.input.customer) {
	                    return;
	                }
	                if (response.ES_RESULT.ZFLAG === 'S') {
	                    if (search) {
	                        $scope.customerArr = response.ET_OUT_LIST.item;
	                    } else {
	                        $scope.customerArr = $scope.customerArr.concat(response.ET_OUT_LIST.item);
	                    }
	                    $scope.spinnerFlag = false;
	                    $scope.customerSearch = true;
	                    $scope.CustomerLoadMoreFlag = true;
	                    if (response.ET_OUT_LIST.item.length < 10) {
	                        $scope.spinnerFlag = false;
	                        $scope.customerSearch = false;
	                    }
	                    $ionicScrollDelegate.resize();
	                    //saleActService.customerArr = $scope.customerArr;
	                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
	                } else {
	                    $scope.spinnerFlag = false;
	                    $scope.customerSearch = false;
	                    $scope.isError = true;
	                    Prompter.showShortToastBotton(response.ES_RESULT.ZRESULT);
	                }
	            }).error(function (response, status, header, config) {
	                var respTime = new Date().getTime() - startTime;
	                Prompter.hideLoading();
	                //超时之后返回的方法
	                if(respTime >= config.timeout){
	                    //console.log('HTTP timeout');
	                    if(ionic.Platform.isWebView()){
	                        //$cordovaDialogs.alert('请求超时');
	                    }
	                }
	                $ionicLoading.hide();
	            });
	    };
		//选择客户
	    //选择客户Modal
	    $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/selectCustomer_Modal.html', {
	        scope: $scope,
	        animation: 'slide-in-up',
	        focusFirstInput: true
	    }).then(function (modal) {
	        $scope.selectCustomerModal = modal;
	    });
	    if(ROOTCONFIG.hempConfig.baseEnvironment=='CATL') {
	        if (LoginService.getProfileType() == "APP_SALE") {
	            $scope.customerModalArr = new Array();
	            $scope.customerModalArr = saleActService.getCustomerTypes();
	            $scope.selectCustomerText = '正式客户';
	        }
	        if (LoginService.getProfileType() == "APP_SERVICE") {
	            $scope.customerModalArr = new Array();
	            $scope.customerModalArr = saleActService.getServiceCustomer();
	            $scope.selectCustomerText = '终端客户';
	        }
	    }
	    if(ROOTCONFIG.hempConfig.baseEnvironment=='ATL'){
	        $scope.customerModalArr = new Array();
	        $scope.customerModalArr=saleActService.getATLCustomer();
	        $scope.selectCustomerText = '正式客户';
	    }

	    $scope.openSelectCustomer = function () {
	        $scope.isDropShow = true;
	        $scope.customerSearch = true;
	        $scope.selectCustomerModal.show();
	    };
	    $scope.closeSelectCustomer = function () {
	        $scope.selectCustomerModal.hide();
	    };
	    $scope.selectPop = function (x) {
	        $scope.selectCustomerText = x.text;
	        customerType = x.code;
	        $scope.getCustomerArr('search');
	        $scope.referMoreflag = !$scope.referMoreflag;
	    };
	    $scope.changeReferMoreflag = function () {
	        $scope.referMoreflag = !$scope.referMoreflag;
	    };
	    $scope.showChancePop = function () {
	        $scope.referMoreflag = true;
	        $scope.isDropShow = true;
	    };
	    $scope.initCustomerSearch = function () {
	        $scope.input.customer = '';
	        //$scope.getCustomerArr();
	        $timeout(function () {
	            document.getElementById('selectCustomerId').focus();
	        }, 1)
	    };
    $scope.selectCustomer = function (x) {
		//console.log(x);
		$scope.config.selectedCustomer = x;
		//$scope.create.contact='';
		//contactPage = 1;
		//$scope.contacts = [];
		$scope.contactsLoadMoreFlag = true;
		//$scope.getContacts();
		$scope.selectCustomerModal.hide();

    };

    //选择联系人
    $scope.openRelations = function () {
    	if(angular.isUndefined($scope.config.selectedCustomer) || $scope.config.selectedCustomer==null){
            $cordovaToast.showShortBottom("请先选择客户!");
            return;
        }
        //获取相关方列表中的客户
        relationService.relationCustomer = $scope.config.selectedCustomer;
        // angular.forEach($scope.relationArr, function (data) {
        //     if (data.PARTNER_FCT == "00000009") {
        //         relationService.relationCustomer = data;
        //     }
        // });
        relationService.isReplace = false;
        //relationService.replaceMan = $scope.config.relationObj;
        relationService.myRelations = $scope.config.selectedRelations;
        relationService.saleActSelections = [{
	        text: '联系人',
	        code: '00000015'
	    }];//angular.copy(saleActService.relationPositionForAdd);
        $ionicModal.fromTemplateUrl('src/applications/addRelations/addRelations.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addReleModal = modal;
            modal.show();
        });
    };



}]);