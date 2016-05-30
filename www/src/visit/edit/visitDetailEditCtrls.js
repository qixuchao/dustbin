visitModule.controller('visitEditCtrl', [
	'$scope','visitService','HttpAppService','Prompter','$ionicModal','$timeout','$cordovaToast','$cordovaDatePicker','$ionicHistory',
	function ($scope,visitService,HttpAppService,Prompter,$ionicModal,$timeout,$cordovaToast,$cordovaDatePicker,$ionicHistory) {
		$scope.datas={
			detail:"",
			result:"",
			START_TIME_STR:"",
			END_TIME_STR:""
		};
		$scope.datas.detail=visitService.visitDetail.ES_VISIT;
		$scope.datas.START_TIME_STR=visitService.visitDetail.ES_VISIT.DATE_FROM +" "+visitService.visitDetail.ES_VISIT.TIME_FROM;
		$scope.datas.END_TIME_STR=visitService.visitDetail.ES_VISIT.DATE_TO +" "+visitService.visitDetail.ES_VISIT.TIME_TO;
		if(visitService.visitDetail.ET_TEXT!=''){
			for(var i=0;i<visitService.visitDetail.ET_TEXT.item_out.length;i++){
				if(visitService.visitDetail.ET_TEXT.item_out[i].TDID=='Z006'){
					$scope.datas.result=visitService.visitDetail.ET_TEXT.item_out[i].TDLINE;
				}
			}
		}

		$scope.goDetail=function(){
			Prompter.ContactCreateCancelvalue();
		}
		//选择时间
		function __selectCreateTimeBasic(type, title, date){
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
			}).then(function (returnDate) {
				var time = returnDate.format("yyyy-MM-dd hh:mm:ss"); //__getFormatTime(returnDate);
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
				if(!$scope.$$phrese){
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
			var startTime = new Date(startTime.replace("-","/").replace("-","/")).getTime();
			var endTime = new Date(endTime.replace("-","/").replace("-","/")).getTime();
			return startTime <= endTime;
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
			Prompter.showLoading("正在保存");
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
					"item_in": {
						"TDID": "Z006",
						"TDSPRAS": "",
						"TDFORMAT": "",
						"TDLINE": $scope.datas.result
					}
				}};
			console.log(angular.toJson(data));
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
}]);



visitModule.controller('visitContactCtrl', [
	'$scope','visitService','HttpAppService','Prompter','$ionicModal','$timeout','$cordovaToast','LoginService','$ionicPopover','$ionicScrollDelegate','$rootScope',
	function ($scope,visitService,HttpAppService,Prompter,$ionicModal,$timeout,$cordovaToast,LoginService,$ionicPopover,$ionicScrollDelegate,$rootScope) {
		$scope.config={
			detail:[]
		};
		$scope.add=false;
		if(visitService.visitContact.ET_PARTNERS != ''){
			for(var i=0;i<visitService.visitContact.ET_PARTNERS.item_out.length;i++){
				if(visitService.visitContact.ET_PARTNERS.item_out[i].PARTNER_FCT =="ZCUSTCTT"){
					$scope.config.detail.push(visitService.visitContact.ET_PARTNERS.item_out[i]);
				}
			}
			if(visitService.visitContact.ES_VISIT.EDIT_FLAG=='X'){
				$scope.add=true;
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
		$scope.add=true;
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
		$scope.conSearch = false;
		$scope.getConArr = function (search) {
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
				"IS_PARTNER": { "PARTNER": "" },
				"IS_SEARCH": { "SEARCH": search }
			};
			var startTime = new Date().getTime();
			HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST', data)
				.success(function (response) {
					if (response.ES_RESULT.ZFLAG === 'S') {
						if (response.ET_OUT_LIST.item.length < 10) {
							$scope.ConLoadMoreFlag = false;
						}
						if (search) {
							$scope.conArr = response.ET_OUT_LIST.item;
						} else {
							$scope.conArr = $scope.conArr.concat(response.ET_OUT_LIST.item);
						}
						$scope.spinnerFlag = false;
						$scope.conSearch = true;
						$scope.ConLoadMoreFlag = true;
						$ionicScrollDelegate.resize();
						$rootScope.$broadcast('scroll.infiniteScrollComplete');
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
			var options={
				I_OBJECT_ID : visitService.currentVisitDetail.OBJECT_ID
				//"I_OBJECT_ID": "0064000004"
			}
			var postDatas = angular.copy(visitService.visit_detail.defaults);
			angular.extend(postDatas, options);
			var promise = HttpAppService.post(visitService.visit_detail.url,postDatas);
			promise.success(function(response, status, obj, config){
				if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG){
					if(response.ES_RESULT.ZFLAG == "S"){
						$scope.config.detail = response.ET_PARTNERS.item_out;
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
	}]);