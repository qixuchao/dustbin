visitModule.controller('visitEditCtrl', [
	'$scope','visitService','HttpAppService','Prompter','$ionicModal','$timeout','$cordovaToast','$cordovaDatePicker','$ionicHistory','$ionicActionSheet','$cordovaDialogs',
	function ($scope,visitService,HttpAppService,Prompter,$ionicModal,$timeout,$cordovaToast,$cordovaDatePicker,$ionicHistory,$ionicActionSheet,$cordovaDialogs) {
		$scope.datas={
			detail:"",
			result:"",
			START_TIME_STR:"",
			END_TIME_STR:"",
			pictures: []
		};
		$scope.config={
			num : "",
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
			currentPhotoSrc: '',
			activeSlideInteger: 0
		}
		$scope.datas.detail=visitService.visitDetail.ES_VISIT;
		$scope.datas.START_TIME_STR=visitService.visitDetail.ES_VISIT.DATE_FROM +" "+visitService.visitDetail.ES_VISIT.TIME_FROM;
		$scope.datas.END_TIME_STR=visitService.visitDetail.ES_VISIT.DATE_TO +" "+visitService.visitDetail.ES_VISIT.TIME_TO;
		if(visitService.visitDetail.ET_TEXT!=''){
			for(var i=0;i<visitService.visitDetail.ET_TEXT.item_out.length;i++){
				if(visitService.visitDetail.ET_TEXT.item_out[i].TDID=='Z006'){
					$scope.datas.result += visitService.visitDetail.ET_TEXT.item_out[i].TDLINE;
				}
			}
		}
		//文本框自适应换行
		var autoTextarea = function (elem, extra, maxHeight) {
			extra = extra || 0;
			var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
				isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
				addEvent = function (type, callback) {
					elem.addEventListener ?
						elem.addEventListener(type, callback, false) :
						elem.attachEvent('on' + type, callback);
				},
				getStyle = elem.currentStyle ? function (name) {
					var val = elem.currentStyle[name];

					if (name === 'height' && val.search(/px/i) !== 1) {
						var rect = elem.getBoundingClientRect();
						return rect.bottom - rect.top -
							parseFloat(getStyle('paddingTop')) -
							parseFloat(getStyle('paddingBottom')) + 'px';
					};

					return val;
				} : function (name) {
					return getComputedStyle(elem, null)[name];
				},
				minHeight = parseFloat(getStyle('height'));

			elem.style.resize = 'none';

			var change = function () {
				var scrollTop, height,
					padding = 0,
					style = elem.style;

				if (elem._length === elem.value.length) return;
				elem._length = elem.value.length;

				if (!isFirefox && !isOpera) {
					padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
				};
				scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

				elem.style.height = minHeight + 'px';
				if (elem.scrollHeight > minHeight) {
					if (maxHeight && elem.scrollHeight > maxHeight) {
						height = maxHeight - padding;
						style.overflowY = 'auto';
					} else {
						height = elem.scrollHeight - padding;
						style.overflowY = 'hidden';
					};
					style.height = height + extra + 'px';
					scrollTop += parseInt(style.height) - elem.currHeight;
					document.body.scrollTop = scrollTop;
					document.documentElement.scrollTop = scrollTop;
					elem.currHeight = parseInt(style.height);
				};
			};

			addEvent('propertychange', change);
			addEvent('input', change);
			addEvent('focus', change);
			change();
		};
		//var text = document.getElementById("textarea");
		//autoTextarea(text);// 调用
		for(var i=0;i<visitService.visitPicture.length;i++){
			visitService.visitPicture[i].src=visitService.visitPicture[i].LINE;
		}
		$scope.config.pictures=visitService.visitPicture;
		$scope.config.num=$scope.config.pictures.length;
		$scope.goDetail=function(){
			Prompter.ContactCreateCancelvalue();
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
			//console.log("__selectCreateTimeIOS");
			var date;
			if(type == 'start'){
				if(!$scope.datas.START_TIME_STR || $scope.datas.START_TIME_STR==""){
					date =  new Date().format('yyyy/MM/dd hh:mm:ss');
				}else{
					date =  new Date($scope.datas.START_TIME_STR.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm:ss');
				}
				//date =  new Date($scope.config.timeStart.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm:ss');
			}else if(type=='end'){
				if(!$scope.datas.END_TIME_STR || $scope.datas.END_TIME_STR==""){
					date = new Date().format('yyyy/MM/dd hh:mm:ss');
				}else{
					date = new Date($scope.datas.END_TIME_STR.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm:ss');
				}
			}
			__selectCreateTimeBasic(type, title, date);
			//console.log("__selectCreateTimeIOS : "+type+"    "+type+"    "+date);
		}
		function __selectCreateTimeAndroid(type, title){
			var date;
			if(type == 'start'){
				if(!$scope.datas.START_TIME_STR || $scope.datas.START_TIME_STR==""){
					date = new Date().format('MM/dd/yyyy/hh/mm/ss');
				}else{
					date = new Date($scope.datas.START_TIME_STR.replace(/-/g, "/")).format('MM/dd/yyyy/hh/mm/ss');
				}
			}else if(type=='end'){
				if(!$scope.datas.END_TIME_STR || $scope.datas.END_TIME_STR==""){
					date = new Date().format('MM/dd/yyyy/hh/mm/ss');
				}else{
					date = new Date($scope.datas.END_TIME_STR.replace(/-/g, "/")).format('MM/dd/yyyy/hh/mm/ss');
				}
			}
			__selectCreateTimeBasic(type, title, date);
		}
		function __selectCreateTimeBasic(type, title, date){
			//console.log("Android selectCreateTime:     "+date);
			//console.log("Android datePicker:     "+datePicker);
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
						if(__startTimeIsValid(time, $scope.datas.END_TIME_STR)){
							$scope.datas.START_TIME_STR = time;
						}else{
							$cordovaToast.showShortBottom("最小时间不能大于最大时间!");
						}
						break;
					case 'end':
						if(__endTimeIsValid($scope.datas.START_TIME_STR, time)){
							$scope.datas.END_TIME_STR = time;
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

		$scope.keepDatas = function () {
			console.log($scope.config.num);
			console.log($scope.config.pictures.length);
			if($scope.config.num!=$scope.config.pictures.length){
				$cordovaToast.showShortBottom('图片正在上传中,请稍后..');
				return;
			}
			Prompter.showLoading("正在保存");
			var num = Math.ceil($scope.datas.result.length/132);
			var item = [];
			for(var i=0;i<num;i++){
				item.push({
					"TDID": "Z006",
					"TDSPRAS": "",
					"TDFORMAT": "",
					"TDLINE": $scope.datas.result.substring(i*132,i*132+131)
				});
			}
			var data={
				"I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
				"IS_USER": { "BNAME": window.localStorage.crmUserName },
				"IS_HEAD": {
					"OBJECT_ID": visitService.visitDetail.ES_VISIT.OBJECT_ID,
					"DESCRIPTION": visitService.visitDetail.ES_VISIT.DESCRIPTION,
					"ACT_LOCATION": visitService.visitDetail.ES_VISIT.ACT_LOCATION,
					"ESTAT": visitService.visitDetail.ES_VISIT.ESTAT
				},
				"IS_DATE": {
					"DATE_FROM": $scope.datas.START_TIME_STR.substring(0,10),
					"TIME_FROM": $scope.datas.START_TIME_STR.substring(10,19),
					"DATE_TO": $scope.datas.END_TIME_STR.substring(0,10),
					"TIME_TO": $scope.datas.END_TIME_STR.substring(10,19)
				},
				"IT_PARTNER": {
				},
				"IT_TEXT": {
					"item_in": item
				}};
			//console.log(angular.toJson(data));
			var url = ROOTCONFIG.hempConfig.basePath + 'VISIT_CHANGE';
			var startTime = new Date().getTime();
			HttpAppService.post(url, data).success(function(response){
				if (response.ES_RESULT.ZFLAG == 'S') {
					$ionicHistory.goBack();
					$cordovaToast.showShortBottom('保存成功');
				}else{
					$cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
					Prompter.hideLoading();
				}

			}).error(function (response, status, header, config) {
				var respTime = new Date().getTime() - startTime;
				//超时之后返回的方法
				if(respTime >= config.timeout){
					if(ionic.Platform.isWebView()){
						//$cordovaDialogs.alert('请求超时');
					}
				}else{
					$cordovaDialogs.alert('访问接口失败，请检查设备网络');
				}
				$ionicLoading.hide();
				Prompter.hideLoading();
			});
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
						//$scope.selectImage(1);
						$scope.pickImage(1);
						return true;
					}
					//return false;
				}
			});
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

		$scope.closePhotoShowModel = function(){
			$scope.destoryPhotoModel();
		};

		$scope.showSinglePicture = function(item, index){
			$scope.config.activeSlideInteger = index;
			if($scope.config.photoModel == null){
				$ionicModal.fromTemplateUrl('src/visit/photo/model.html', {
			        scope: $scope,
			        animation: 'slide-in-up',
			        focusFirstInput: true,
			        backdropClickToClose: false
			    }).then(function (modal) {
			        $scope.config.photoModel = modal;
			        $scope.config.currentPhotoSrc = item.src;
					$scope.config.photoModel.show();
					$scope.config.photoModel.$el.addClass("visit-photo-show-modal");

		    	});
			}else{
				$scope.config.currentPhotoSrc = item.src;
				$scope.config.photoModel.show();
				$scope.config.photoModel.$el.addClass("visit-photo-show-modal");
			}
		};

		$scope.pickImage = function (item) {
			var options = {
				maximumImagesCount: 10,
				width: 1366,
				height: 768,
				quality: 5
			};
			//console.log(item);
			//console.log(options);
			window.imagePicker.getPictures(
				function(results) {
					for (var i = 0; i < results.length; i++) {
						getBase64FromFilepath(results[i], item);
						//console.log('Image URI: ' + results[i]);
					}
				}, function (error) {
					console.log('Error: ' + error);
				}, options
			);
		}

		$scope.selectImage = function(sourceTypeInt){
			//console.log(sourceTypeInt);
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
				saveToPhotoAlbum: false,
				cameraDirection: Camera.Direction.BACK, // 0, //'BACK'
				targetWidth: 1366, targetHeight: 768
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
			//console.log(filepath);
			//console.log(sourceTypeInt);
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
					SysName: ROOTCONFIG.hempConfig.baseEnvironment
				},
				IS_AUTHORITY: {
					BNAME:  window.localStorage.crmUserName
				},
				IS_URL: {
					OBJECT_ID: visitService.visitDetail.ES_VISIT.OBJECT_ID,//  "5200000315",
					PROCESS_TYPE: visitService.visitDetail.ES_VISIT.PROCESS_TYPE,// "ZPRO",
					CREATED_BY: visitService.visitCreate, //"HANDLCX",
					LINE: ""
				}
			};
			console.log(inbond);
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
				//console.log("正在上传中...");
				ft.upload(filepath, url, function (winRes){
					//alert("上传成功:   "+JSON.stringify(winRes));
					file.isServerHolder = true;
					file.uploading = false;
					file.uploadOk = true;
					file.uploadError = false;

					file.isNetworking = false;
					file.networkTip = "";
					$scope.config.num++;

					var response = JSON.parse(winRes.response);
					//console.log(response);
					//console.log("-------------");
					//if(response.ES_OBJECT){
					//	file.OBJECT_ID = $scope.config.OBJECT_ID;  //  "5200000315
					//	file.PROCESS_TYPE = $scope.config.PROCESS_TYPE;// "ZPRO",;
					//	file.OBJIDLO = response.ES_OBJECT.OBJID;
					//	file.OBJTYPELO = response.ES_OBJECT.OBJTYPE;
					//	file.CLASSLO = response.ES_OBJECT.CLASS;
					//}

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
		$scope.deletePic=function(item){
			$cordovaDialogs.confirm('是否删除此图片', '提示', ['确定', '取消'])
				.then(function (buttonIndex) {
					// no button = 0, 'OK' = 1, 'Cancel' = 2
					if (buttonIndex == 1) {
						$scope.deleteInfos(item);
					}
				});
		}
		$scope.deleteInfos=function(item){
			console.log(item);
			var data ={
				"I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment  },
				"IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
				"IS_URL": {
					"OBJECT_ID": item.OBJECT_ID,
					"PROCESS_TYPE": item.PROCESS_TYPE,
					"OBJIDLO": item.OBJIDLO,
					"OBJTYPELO":item.OBJTYPELO,
					"CLASSLO": item.CLASSLO
				}
			}
			var url = ROOTCONFIG.hempConfig.basePath + 'URL_DELETE';
			var startTime = new Date().getTime();
			HttpAppService.post(url, data).success(function(response){
				Prompter.hideLoading();
				if (response.ES_RESULT.ZFLAG === 'S') {

				for(var i=0;i<$scope.config.pictures.length;i++){
					if($scope.config.pictures[i].OBJIDLO == item.OBJIDLO){
						$scope.config.pictures.splice(i,1);
						break;
					}
				}
					$scope.config.num--;
					$cordovaToast.showShortBottom('删除成功 ');
				}else{
					$cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
				}
			}).error(function (response, status, header, config) {
				var respTime = new Date().getTime() - startTime;
				//超时之后返回的方法
				if(respTime >= config.timeout){
					if(ionic.Platform.isWebView()){
						//$cordovaDialogs.alert('请求超时');
					}
				}else{
					$cordovaDialogs.alert('访问接口失败，请检查设备网络');
				}
				Prompter.hideLoading();
				$ionicLoading.hide();
			});

		}
}]);



visitModule.controller('visitContactCtrl', [
	'$scope','visitService','HttpAppService','Prompter','$ionicModal','$timeout','$cordovaToast','LoginService','$ionicPopover','$ionicScrollDelegate','$rootScope','$cordovaDialogs','$state','contactService',
	function ($scope,visitService,HttpAppService,Prompter,$ionicModal,$timeout,$cordovaToast,LoginService,$ionicPopover,$ionicScrollDelegate,$rootScope,$cordovaDialogs,$state,contactService) {
		$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
			if(fromState && toState && fromState.name == 'ContactCreate' && toState.name == 'visit.contact'){
				var loadingTime = 500;
				$timeout(function(){
					$scope.openSelectCon();
				}, loadingTime);
			}
		});
		$scope.config={
			detail:[],
			PARTNER:'',
			name : "",
			add : ""
		};
		//$scope.add=false;
		console.log(visitService.visitContact);
		if(visitService.visitContact.ET_PARTNERS != ''){
			for(var i=0;i<visitService.visitContact.ET_PARTNERS.item_out.length;i++){
				if(visitService.visitContact.ET_PARTNERS.item_out[i].PARTNER_FCT =="ZCUSTCTT"){
					$scope.config.detail.push(visitService.visitContact.ET_PARTNERS.item_out[i]);
				}
				if(visitService.visitContact.ET_PARTNERS.item_out[i].PARTNER_FCT =="ZCUSTOME"){
					$scope.config.PARTNER = visitService.visitContact.ET_PARTNERS.item_out[i].PARTNER;
					$scope.config.name = visitService.visitContact.ET_PARTNERS.item_out[i].NAME;
				}
			}
			if(visitService.visitContact.ES_VISIT.EDIT_FLAG=='X'){
				$scope.config.add=true;
				console.log(visitService.visitContact.ES_VISIT.EDIT_FLAG);
			}else{
				$scope.config.add=false;
				console.log(visitService.visitContact.ES_VISIT.EDIT_FLAG);
			}
		}
		$scope.deleteInfos = function(item){
			if(item.PARTNER_FCT == "" ){
				Prompter.deleteInfosPoint(item.FCT_DESCRIPTION + "不允许删除");
			}else{
				Prompter.showLoading("正在删除");
				var data={
					"I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
					"IS_USER": { "BNAME": window.localStorage.crmUserName },
					"IS_HEAD": {
						"OBJECT_ID": visitService.visitContact.ES_VISIT.OBJECT_ID,
						"DESCRIPTION": visitService.visitContact.ES_VISIT.DESCRIPTION,
						"ACT_LOCATION": visitService.visitContact.ES_VISIT.ACT_LOCATION,
						"ESTAT": visitService.visitContact.ES_VISIT.ESTAT
					},
					"IS_DATE": {
						"DATE_FROM": visitService.visitContact.ES_VISIT.DATE_FROM,
						"TIME_FROM": visitService.visitContact.ES_VISIT.TIME_FROM,
						"DATE_TO": visitService.visitContact.ES_VISIT.DATE_TO,
						"TIME_TO": visitService.visitContact.ES_VISIT.TIME_TO
					},
					"IT_PARTNER": {
						"item_in": {
							"MODE": "D",
							"PARTNER_FCT":'',
							"PARTNER": '',
							"MAINPARTNER":'',
							"OLD_FCT": item.PARTNER_FCT,
							"OLD_PARTNER": item.PARTNER,
							"RELATION_PARTNER":''
						}
					},
					"IT_TEXT": {
					}};
				console.log(data);
				var url = ROOTCONFIG.hempConfig.basePath + 'VISIT_CHANGE';
				var startTime = new Date().getTime();
				HttpAppService.post(url, data).success(function(response){
					Prompter.hideLoading();
					if (response.ES_RESULT.ZFLAG === 'S') {
						__requestVisitDetail();
						$cordovaToast.showShortBottom('删除成功 ');
					}else{
						$cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
					}
				}).error(function (response, status, header, config) {
					var respTime = new Date().getTime() - startTime;
					//超时之后返回的方法
					if(respTime >= config.timeout){
						if(ionic.Platform.isWebView()){
							//$cordovaDialogs.alert('请求超时');
						}
					}else{
						$cordovaDialogs.alert('访问接口失败，请检查设备网络');
					}
					Prompter.hideLoading();
					$ionicLoading.hide();
				});
			}
		}
		$ionicPopover.fromTemplateUrl('src/worksheet/relatedPart/worksheetRelate_select.html', {
			scope: $scope
		}).then(function(popover) {
			$scope.relatedpopover = popover;
		});
		$scope.relatedPopoverShow = function() {
			$scope.relatedpopover.show();
			//document.getElementsByClassName('popover-arrow')[0].addClassName ="popover-arrow";
		};
		$scope.relatedPopoverhide = function() {
			$scope.relatedpopover.hide();
			//document.getElementsByClassName('popover-arrow')[0].removeClass ="popover-arrow";
		};
		$scope.related_types = ['联系人'];
		$scope.relatedqueryType = function(types){
			if(types === "联系人"){
				//$state.go("worksheetRelatedPartContact");
				$scope.openSelectCon();
			}
			$scope.relatedPopoverhide();
		};
		//选择联系人

		var conPage = 1;
		$scope.conArr = [];
		$scope.conSearch = true;
		$scope.noMore = false;
		$scope.haveMore = true;
		$scope.getConArr = function (search) {
			console.log(conPage);
			$scope.haveMore = false;
			$scope.ConLoadMoreFlag = false;
			if (search) {
				$scope.conSearch = false;
				conPage = 1;
			} else {
				$scope.spinnerFlag = true;
			}
			var data = {
				"I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
				"IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
				"IS_PAGE": {
					"CURRPAGE": conPage++,
					"ITEMS": "10"
				},
				"IS_PARTNER": { "PARTNER": $scope.config.PARTNER },
				"IS_SEARCH": { "SEARCH": search }
			};
			console.log(data);
			var startTime = new Date().getTime();
			HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST', data)
				.success(function (response) {
					if (response.ES_RESULT.ZFLAG === 'S') {
						if (response.ET_OUT_LIST.item.length < 10) {
							$scope.ConLoadMoreFlag = false;
							$scope.noMore = true;
							$scope.haveMore = false;
						}else{
							$scope.haveMore = true;
						}
						if (search) {
							$scope.conArr = response.ET_OUT_LIST.item;
						} else {
							$scope.conArr = $scope.conArr.concat(response.ET_OUT_LIST.item);
						}
						$scope.spinnerFlag = false;
						$scope.conSearch = true;
						$scope.ConLoadMoreFlag = true;
						//$scope.haveMore = true;
						$ionicScrollDelegate.resize();
						$rootScope.$broadcast('scroll.infiniteScrollComplete');
					}else{
						$scope.noMore = true;
						$scope.haveMore = false;
						$scope.spinnerFlag = false;
						$cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
					}
				}).error(function (response, status, header, config) {
					var respTime = new Date().getTime() - startTime;
					//超时之后返回的方法
					if(respTime >= config.timeout){
						if(ionic.Platform.isWebView()){
							//$cordovaDialogs.alert('请求超时');
						}
					}else{
						$cordovaDialogs.alert('访问接口失败，请检查设备网络');
					}
					$ionicLoading.hide();
				});;
		};

		$ionicModal.fromTemplateUrl('src/worksheet/relatedPart/selectContact_Modal.html', {
			scope: $scope,
			animation: 'slide-in-up',
			focusFirstInput: true
		}).then(function (modal) {
			$scope.selectContactModal = modal;
		});
		$scope.selectContactText = '联系人';
		$scope.openSelectCon = function () {
			$scope.isDropShow = true;
			$scope.conSearch = true;
			$scope.noMore = false;
			$scope.haveMore = true;
			conPage = 1;
			$scope.getConArr("");
			$scope.selectContactModal.show();
		};
		$scope.closeSelectCon = function () {
			$scope.selectContactModal.hide();
		};
		$scope.selectPop = function (x) {
			$scope.selectContactText = x.text;
			$scope.referMoreflag = !$scope.referMoreflag;
		};
		$scope.showChancePop = function () {
			$scope.referMoreflag = true;
			$scope.isDropShow = true;
		};
		$scope.initConSearch = function () {
			$scope.input.con = '';
			$timeout(function () {
				document.getElementById('selectConId').focus();
			}, 1)
		};
		$scope.selectCon = function (x) {
			Prompter.showLoading("正在添加");
			var data={
				"I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
				"IS_USER": { "BNAME": window.localStorage.crmUserName },
				"IS_HEAD": {
					"OBJECT_ID": visitService.visitContact.ES_VISIT.OBJECT_ID,
					"DESCRIPTION": visitService.visitContact.ES_VISIT.DESCRIPTION,
					"ACT_LOCATION": visitService.visitContact.ES_VISIT.ACT_LOCATION,
					"ESTAT": visitService.visitContact.ES_VISIT.ESTAT
				},
				"IS_DATE": {
					"DATE_FROM": visitService.visitContact.ES_VISIT.DATE_FROM,
					"TIME_FROM": visitService.visitContact.ES_VISIT.TIME_FROM,
					"DATE_TO": visitService.visitContact.ES_VISIT.DATE_TO,
					"TIME_TO": visitService.visitContact.ES_VISIT.TIME_TO
				},
				"IT_PARTNER": {
					"item_in": {
						"MODE": "I",
						"PARTNER_FCT":'ZCUSTCTT',
						"PARTNER": x.PARTNER,
						"MAINPARTNER":'',
						"OLD_FCT": "",
						"OLD_PARTNER": '',
						"RELATION_PARTNER":''
					}
				},
				"IT_TEXT": {
				}};
			console.log(angular.toJson(data));
			var url = ROOTCONFIG.hempConfig.basePath + 'VISIT_CHANGE';
			var startTime = new Date().getTime();
			HttpAppService.post(url, data).success(function(response){
				if (response.ES_RESULT.ZFLAG === 'S') {
					__requestVisitDetail();
					$cordovaToast.showShortBottom('添加成功');
				}else{
					$cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
					Prompter.hideLoading();
				}

			}).error(function (response, status, header, config) {
				var respTime = new Date().getTime() - startTime;
				//超时之后返回的方法
				if(respTime >= config.timeout){
					if(ionic.Platform.isWebView()){
						//$cordovaDialogs.alert('请求超时');
					}
				}else{
					$cordovaDialogs.alert('访问接口失败，请检查设备网络');
				}
				$ionicLoading.hide();
				Prompter.hideLoading();
			});
			$scope.selectContactModal.hide();
		};
		//详情
		function __requestVisitDetail(){
			$scope.config.detail=[];
			var options={
				I_OBJECT_ID : visitService.currentVisitDetail.OBJECT_ID
				//"I_OBJECT_ID": "0064000004"
			}
			//var postDatas = angular.copy(visitService.visit_detail.defaults);
			var postDatas = {
				"I_SYSNAME": { "SysName": visitService.getStoredByKey("sysName") },
				"IS_USER": { "BNAME": visitService.getStoredByKey("userName") }
			};
			angular.extend(postDatas, options);
			var promise = HttpAppService.post(visitService.visit_detail.url,postDatas);
			promise.success(function(response, status, obj, config){
				if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG){
					if(response.ES_RESULT.ZFLAG == "S"){
						for(var i=0;i<response.ET_PARTNERS.item_out.length;i++){
							if(response.ET_PARTNERS.item_out[i].PARTNER_FCT =="ZCUSTCTT"){
								$scope.config.detail.push(response.ET_PARTNERS.item_out[i]);
							}
						}
					}else if(response.ES_RESULT.ZFLAG == "E"){
						Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
					}else{
						Prompter.showLoadingAutoHidden(angular.toJson(response), false, 2000);
					}
				}else{
					Prompter.showLoadingAutoHidden(response, false, 2000);
				}
			})
				.error(function(errorResponse){
					Prompter.showLoadingAutoHidden("请求失败,请检查网络!", false, 2000);
				});
		}
		//创建联系人
		$scope.createContact=true;
		$scope.creatConGo = function(){
			$scope.conArr=[];
			visitService.goCreateCon = true;
			visitService.goCreateConInfo.id = $scope.config.PARTNER;
			visitService.goCreateConInfo.name = $scope.config.name;
			$scope.selectContactModal.hide();
			$state.go('ContactCreate');
		}
		$scope.goDetail = function(i){
			console.log(i);
			contactService.set_ContactsListvalue(i.PARTNER);
			$state.go("ContactDetail");
		};
	}]);