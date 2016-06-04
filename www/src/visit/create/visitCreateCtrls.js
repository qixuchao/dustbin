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
	"relationService",'Prompter','$cordovaDatePicker','visitService','$state','$timeout','$ionicHistory',
	function ($scope, BaiduMapServ, $cordovaToast, $ionicActionSheet,
		$ionicModal, LoginService, saleActService, HttpAppService,
		$ionicScrollDelegate, $rootScope,
		relationService,Prompter,$cordovaDatePicker,visitService,$state,$timeout,$ionicHistory){
		$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
			if(fromState && toState && fromState.name == 'visit.detail' && toState.name == 'visit.create'){
				var loadingTime = 800;
				Prompter.showLoadingAutoHidden("正在返回,请稍候", false, loadingTime);
				$timeout(function(){
					$ionicHistory.goBack();
				}, loadingTime);
			}
			if(fromState && toState && fromState.name == 'ContactCreate' && toState.name == 'visit.create'){
				var loadingTime = 500;
				$timeout(function(){
					$scope.openRelations();
				}, loadingTime);
			}
		});
	$scope.config = {
		uploadNow : false,
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
		startTime: '',
		endTime: '',
		visitComment: '',
		userName:"",
		FILE_URL : [],
		pictures:[
			{
				src: 'https://www.baidu.com/img/bd_logo1.png'
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
		},
		photoModel: null,
		currentPhotoSrc: ''
	};

	$scope.destoryPhotoModel = function(){
		if($scope.config.photoModel){
			$scope.config.photoModel.hide();
			$scope.config.photoModel.remove();
			$scope.config.photoModel = null;
		}
	}

	$scope.$on("$destroy", function(){
		$scope.destoryPhotoModel();
	});

	$scope.showSinglePicture = function(item, index){
		if($scope.config.photoModel == null){
			$ionicModal.fromTemplateUrl('src/visit/photo/model.html', {
		        scope: $scope,
		        animation: 'slide-in-up',
		        focusFirstInput: true
		    }).then(function (modal) {
		        $scope.config.photoModel = modal;
		        $scope.config.currentPhotoSrc = item.src;
				$scope.config.photoModel.show();
	    	});
		}else{
			$scope.config.currentPhotoSrc = item.src;
			$scope.config.photoModel.show();
		}
	};


	$scope.init = function(){
		$scope.config.startTime = getDefultStartTime();
		$scope.config.endTime = new Date().format('yyyy-MM-dd hh:mm:ss')
		$scope.caclCurrentLocation();
		__requestVisitName();
		//src/applications/saleActivities/modal/selectCustomer_Modal.html
		$ionicModal.fromTemplateUrl('src/visit/photo/model.html', {
	        scope: $scope,
	        animation: 'slide-in-up',
	        focusFirstInput: true
	    }).then(function (modal) {
	        $scope.config.photoModel = modal;
	    });

	};
		//名称
		function __requestVisitName(options){
			Prompter.showLoading();
			var urlName = ROOTCONFIG.hempConfig.basePath + "STAFF_DETAIL"; //"http://117.28.248.23:9388/test/api/bty/login";
			var querParams = {
				"I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
				"IS_EMPLOYEE": { "PARTNER": LoginService.getBupaTypeUser() }
			};
			HttpAppService.post(urlName,querParams).success(function(response){
				Prompter.hideLoading();
				console.log(response);
				if(response.ES_RESULT.ZFLAG == 'E') {
					$cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
				} else if (response.ES_RESULT.ZFLAG == 'S') {
					if(response.ES_EMPLOYEE){
						$scope.config.userName = response.ES_EMPLOYEE.NAME_LAST+response.ES_EMPLOYEE.NAME_FIRST;
					}
				}

			});
		}
	var getDefultStartTime = function () {
		//60*60*1000*2: 2小时  ：7200000
		var nowTime = new Date().getTime();
		var hourTime =  nowTime - 7200000;
		var hourDate = new Date(hourTime);
		return hourDate.format("yyyy-MM-dd hh:mm:ss");
	};
	$scope.visitCreateConfirm = function(){
		if($scope.config.uploadNow == false){
			$cordovaToast.showShortBottom('图片正在上传中,请稍后..');
		}
		var queryParams = {
			"I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
			"IS_USER": { "BNAME": window.localStorage.crmUserName },
			"IS_DATE": {
		      "DATE_FROM": $scope.config.startTime.substring(0,10),
		      "TIME_FROM": $scope.config.startTime.substring(10,19),
		      "DATE_TO": $scope.config.endTime.substring(0,10),
		      "TIME_TO": $scope.config.endTime.substring(10,19)
		    },
		    "IS_HEAD": {
		      "PROCESS_TYPE": "ZVIS",
		      "ACT_LOCATION": $scope.config.address,
		      "ESTAT": "E0001"
		    },
		    "IT_PARTNER": {
		      "item_in": []
		    },
			"IS_ORGMAN": { },
		    "IT_TEXT": {
		      "item_in": []
		    }
		};
		console.log(queryParams);
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
		}else{
			$cordovaToast.showShortBottom('请选择客户');
			return;
		}
		__requestCreateVisit(queryParams);
	};
		function upPicture(data){
			var url = ROOTCONFIG.hempConfig.basePath + "URL_CREATE";
			Prompter.showLoadingAutoHidden("正在提交,请稍候", false, 800);
				$timeout(function(){
					$state.go("visit.detail");
				}, 1000);
			for(var i=0;i<$scope.config.FILE_URL.length;i++){
				var pic={
					"I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment  },
					"IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
					"IS_URL": {
						"OBJECT_ID": data.EV_OBJECT_ID,
						"PROCESS_TYPE": 'ZVIS',
						"CREATED_BY": $scope.config.userName,
						"LINE": $scope.config.FILE_URL[i]
					}
				}
				var picture = HttpAppService.post(url, pic);
				picture.success(function(response, status, obj, config){
					console.log(response);
					if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG=="S"){

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
		}
	//visitService.visit_create.url    visitService.visit_create.defaults
	function __requestCreateVisit(options, successCallback){
		var url = visitService.visit_create.url;
        var postDatas = angular.copy(visitService.visit_create.defaults);
        angular.extend(postDatas, options);
		//console.log(url);
		//console.log(postDatas);
        var promise = HttpAppService.post(url, postDatas);
        Prompter.showLoading("正在创建");
        promise.success(function(response, status, obj, config){
			//console.log(response);
        	if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG=="S"){
        		if(successCallback) successCallback(response);
				visitService.currentVisitDetail={
					OBJECT_ID : response.EV_OBJECT_ID
				}
				upPicture(response);
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
            //console.log('getCurrentLocation success = ' + angular.toJson(success));
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
		$scope.config.uploadNow = true;
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
			username : $scope.config.userName
		};
		//console.log(inbond);
		//ROOTCONFIG.hempConfig.UploadImageUrl;			
		// http://117.28.248.23:9388/test/api/bty/uploadImage
		var url = ROOTCONFIG.hempConfig.basePath + "visitImageUpload";
		__uploadImage(item, url, JSON.stringify(inbond));
	};

	function __uploadImage(file, url, inbond){
		//console.log(inbond);
		var filepath = file.fileLocalPath;
		var uploadUrl = ROOTCONFIG.hempConfig.basePath + "visitImageUpload";
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
		//console.log(options);
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
				//file.isServerHolder = true;
				//file.uploading = false;
				//file.uploadOk = true;
				//file.uploadError = false;
				//
				//file.isNetworking = false;
                //file.networkTip = "";
        		
        		var response = JSON.parse(winRes.response);
				//console.log(response);
        		if(response.ES_RESULT){
					$scope.config.uploadNow = false;
					$scope.config.FILE_URL.push(response.ES_RESULT.ZRESULT.FILE_URL);
        		}
        		
				if(!$scope.$$phase){
					$scope.$apply();
				}
			}, function (errorRes){
				$scope.config.uploadNow = false;
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
		relationService.createContact = true;
		console.log(relationService.relationCustomer );
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
	$scope.goAlertBack=function(){
		Prompter.ContactCreateCancelvalue1("新建");
	}
		//选择时间
		$scope.selectCreateTime = function (type, title) { // type: start、end
			if(ionic.Platform.isAndroid()){
				__selectCreateTimeAndroid(type, title);
			}else{
				__selectCreateTimeIOS(type,title);
			}
		};
		function __selectCreateTimeIOS(type, title){
			console.log("__selectCreateTimeIOS");
			var date;
			if(type == 'start'){
				if(!$scope.config.startTime || $scope.config.startTime==""){
					date =  new Date().format('yyyy/MM/dd hh:mm:ss');
				}else{
					date =  new Date($scope.config.startTime.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm:ss');
				}
				//date =  new Date($scope.config.timeStart.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm:ss');
			}else if(type=='end'){
				if(!$scope.config.endTime || $scope.config.endTime==""){
					date = new Date().format('yyyy/MM/dd hh:mm:ss');
				}else{
					date = new Date($scope.config.endTime.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm:ss');
				}
			}
			__selectCreateTimeBasic(type, title, date);
			console.log("__selectCreateTimeIOS : "+type+"    "+type+"    "+date);
		}
		function __selectCreateTimeAndroid(type, title){
			var date;
			if(type == 'start'){
				if(!$scope.config.startTime || $scope.config.startTime==""){
					date = new Date().format('MM/dd/yyyy/hh/mm/ss');
				}else{
					date = new Date($scope.config.startTime.replace(/-/g, "/")).format('MM/dd/yyyy/hh/mm/ss');
				}
			}else if(type=='end'){
				if(!$scope.config.endTime || $scope.config.endTime==""){
					date = new Date().format('MM/dd/yyyy/hh/mm/ss');
				}else{
					date = new Date($scope.config.endTime.replace(/-/g, "/")).format('MM/dd/yyyy/hh/mm/ss');
				}
			}
			__selectCreateTimeBasic(type, title, date);
		}
		function __selectCreateTimeBasic(type, title, date){
			console.log("Android selectCreateTime:     "+date);
			console.log("Android datePicker:     "+datePicker);
			$cordovaDatePicker.show({
				date: date,
				allowOldDates: true,
				allowFutureDates: true,
				mode: 'datetime',
				titleText: title,
				okText: '确定',               //android
				cancelText: '取消',           //android
				doneButtonLabel: '确认',      // ios
				cancelButtonLabel: '取消',    //ios
				todayText: '今天',            //android
				nowText: '现在',              //android
				is24Hour: true,              //android
				androidTheme: datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT, // android： 3
				popoverArrowDirection: 'UP',
				locale: 'zh_cn'
				//locale: 'en_us'
			}).then(function(returnDate){
				var time = returnDate.format("yyyy-MM-dd hh:mm:ss"); //__getFormatTime(returnDate);
				console.log("selectTimeCallback : "+time);
				switch (type) {
					case 'start':
						if(__startTimeIsValid(time, $scope.config.endTime)){
							$scope.config.startTime = time;
						}else{
							$cordovaToast.showShortBottom("最小时间不能大于最大时间!");
						}
						break;
					case 'end':
						if(__endTimeIsValid($scope.config.startTime, time)){
							$scope.config.endTime = time;
						}else{
							$cordovaToast.showShortBottom("最大时间不能小于最小时间!");
						}
						break;
				}
				if(!$scope.$$phase){
					$scope.$apply();
				}
			});
		}

		function __startTimeIsValid(startTime, endTime){
			if(!startTime || startTime==""){
				return false;
			}
			if(!endTime || endTime==""){
				return true;
			}
			var startTime2 = new Date(startTime.replace("-","/").replace("-","/")).getTime();
			var endTime2 = new Date(endTime.replace("-","/").replace("-","/")).getTime();
			return startTime2 <= endTime2;
		}
		function __endTimeIsValid(startTime, endTime){
			if(!endTime || endTime==""){
				return false;
			}
			if(!startTime || startTime==""){
				return true;
			}
			var startTime = new Date(startTime.replace("-","/").replace("-","/")).getTime();
			var endTime = new Date(endTime.replace("-","/").replace("-","/")).getTime();
			return startTime <= endTime;
		}
}]);