worksheetModule.controller('baoGongDetailEditCtrl',[
        '$scope',
        '$state',
        '$ionicHistory',
        '$timeout',
        '$ionicPosition',
        'HttpAppService',
        'worksheetHttpService',
        "baoGongService",
        "Prompter",
        "$ionicHistory",
        function ($scope, $state, $ionicHistory, 
        	$timeout, $ionicPosition, HttpAppService, 
        	worksheetHttpService, baoGongService,
        	Prompter, $ionicHistory) {
        
        $scope.config = {
        	BAO_BEIZHU: '',

        	OBJECT_ID: '',
        	PROCESS_TYPE: ''
        };
        
        
        $scope.goBack = function(){            
            Prompter.wsConfirm("提示","放弃本次编辑?","确定", "取消");
        };
        
        $scope.saveEdited = function(){
        	var oldDesc = $scope.datas.detail.ES_OUT_LIST.DESCRIPTION;
			var newDesc = $scope.datas.detail.ES_OUT_LIST.DESCRIPTION_EDIT;
			if(oldDesc == newDesc && ($scope.config.BAO_BEIZHU=="" || ($scope.config.BAO_BEIZHU.trim && $scope.config.BAO_BEIZHU.trim()=="")) ){
				Prompter.showLoadingAutoHidden("报工单未修改!", false, 800);
				return;
			}
			var header = {
				DESCRIPTION: $scope.datas.detail.ES_OUT_LIST.DESCRIPTION_EDIT,
				STATUS: $scope.datas.detail.ES_OUT_LIST.STATU
			};
			var params = angular.copy(baoGongService.BAOWS_EDIT.defaults);
			params.IS_HEAD_DATA = header;
			params.IV_PROCESS_TYPE = $scope.config.PROCESS_TYPE;
			params.IV_OBJECT_ID = $scope.config.OBJECT_ID;
			if($scope.config.BAO_BEIZHU && $scope.config.BAO_BEIZHU != "" && $scope.config.BAO_BEIZHU.trim && $scope.config.BAO_BEIZHU.trim()!=""){
				params.IT_TEXT = {
					item_in: {
						TDID: 'Z002',
						TEXT: $scope.config.BAO_BEIZHU
					}
				};
			}
			__requestChangeBaoWS(baoGongService.BAOWS_EDIT.url, params);
        };

        $scope.datas = {
            detail: null
        };

        $scope.init = function(){
        	$scope.datas.detail = baoGongService.wsBaoDetailData;
        	$scope.config.OBJECT_ID = baoGongService.wsBaoDetailData.ydWorksheetNum;
        	$scope.config.PROCESS_TYPE = baoGongService.wsBaoDetailData.IS_PROCESS_TYPE;
        	$scope.datas.detail.ES_OUT_LIST.DESCRIPTION_EDIT = $scope.datas.detail.ES_OUT_LIST.DESCRIPTION;
        	__initTextarea();
        };

        $scope.init();

        function __requestChangeBaoWS(url, params){
			Prompter.showLoading("正在修改报工单");
	        var promise = HttpAppService.post(url,params);
	        promise.success(function(response){
	        	$scope.config.BAO_BEIZHU = "";
	        	if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG == "S"){
	        		Prompter.showLoadingAutoHidden("修改成功", false, 1000);
	        		baoGongService.wsBaoDetailData = {
	        			needReload: true
	        		};
	        		
	        		$timeout(function(){
	        			$ionicHistory.goBack();
	        		},1000);
	        	}else if(response && response.ES_RESULT && response.ES_RESULT.ZRESULT != ""){
	        		Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
	        	}else{
	        		Prompter.showLoadingAutoHidden(response, false, 2000);
	        	}
	        })
	        .error(function(errorResponse){
	        	Prompter.showLoadingAutoHidden("修改失败,请检查网络!", false, 2000);
	        });
        }


        //文本框自适应换行
        function autoTextarea(elem, extra, maxHeight) {
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
        function __initTextarea(){
        	var text = document.getElementById("textarea_beizhu");
            autoTextarea(text);
        };
        

        

}]);