worksheetReportModule.controller('baoGongCreateCtrl', [
	'$scope',
	'baoGongService',
	"$timeout",
	"Prompter",
	"HttpAppService",
    "$state",
    "$ionicHistory",
    "worksheetDataService",
	function ($scope, baoGongService, $timeout, Prompter, HttpAppService, $state, $ionicHistory, worksheetDataService) {
	 
    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
        if(toState && fromState && toState.name == "baoGongCreate" && fromState.name == "baoGongDetail"){
            worksheetDataService.wsEditToDetail.needReload = true;
            //$timeout(function(){
            $ionicHistory.goBack();
            //}, 600);
        }
    });
    
	$scope.config = {

	};
	$scope.datas = {
		defaultDetail: {
			/*IS_OBJECT_ID: ,
			IS_PROCESS_TYPE: ,
			IS_PROCESS_TYPE_BAO: ,
			BAO_BEIZHU: '',
			TYPE_DESC: ,
			DESCRIPTION: ,
			STATU: ,
			STATU_DESC: ,
			WAIFU_EMP: {
				FCT_DESCRIPTION : "外服人员",
				NAME1 : "张建廷",
				PARTNER_FCT : "ZSRVEMPL",
				PARTNER_NO : "E060000878"
			}*/
		}
	};
    
	$scope.goBack = function(){
		Prompter.wsConfirm("提示","放弃本次编辑?","确定", "取消");
	};

	$scope.createBaoWS = function(){
		var params = {
			IV_OBJECT_ID: $scope.datas.defaultDetail.IS_OBJECT_ID,
			IV_PROCESS_TYPE: $scope.datas.defaultDetail.IS_PROCESS_TYPE,
			IV_DESCRIPTION: $scope.datas.defaultDetail.BAO_DESCRIPTION,
			IV_PROCESS_TYPE_CONF: $scope.datas.defaultDetail.IS_PROCESS_TYPE_BAO
		};
		var beizhu = $scope.datas.defaultDetail.BAO_BEIZHU;
        var maxLength = 255; //132  255
		if(!angular.isUndefined(beizhu) && beizhu!=null && beizhu.trim && beizhu.trim()!=""){
            var currentLength = 0;
            var item_in = [];

            while(beizhu.length > currentLength){
                item_in.push({
                    TDID: "Z002",
                    TEXT: beizhu.substring(currentLength, currentLength+maxLength)
                });
                currentLength += maxLength;
            }
            
			params.IT_TEXT = item_in;
		}
		params = angular.extend(params, baoGongService.BAOWS_CREATE.defaults);
		__requestCreateBaoWS(baoGongService.BAOWS_CREATE.url, params);
	};

	$scope.init = function(){ 
		$scope.datas.defaultDetail = angular.copy(baoGongService.createFromWSDetail);
		$scope.datas.defaultDetail.BAO_DESCRIPTION = $scope.datas.defaultDetail.DESCRIPTION;
		var type = $scope.datas.defaultDetail.IS_PROCESS_TYPE;
		if(type == "ZPRO"){		   // 现场维修工单
			$scope.datas.defaultDetail.IS_PROCESS_TYPE_BAO = "ZPRC";
            $scope.datas.defaultDetail.BAO_TYPE_DESC = "现场维修报工单";
		}else if(type == "ZPLO"){  // 批量改进工单
			$scope.datas.defaultDetail.IS_PROCESS_TYPE_BAO = "ZPLC";
            $scope.datas.defaultDetail.BAO_TYPE_DESC = "批量改进报工单";
		}else if(type == "ZNCO"){  // 新车档案收集工单
			$scope.datas.defaultDetail.IS_PROCESS_TYPE_BAO = "ZNCC";
            $scope.datas.defaultDetail.BAO_TYPE_DESC = "新车档案收集报工单";
		}

		$timeout(function() {
            var textresult = document.getElementById("textarea_bao_beizhu");
            autoTextarea(textresult, 0, 200);// 调用
        }, 1500);
	};
	$scope.init();

	function __requestCreateBaoWS(url, params){
		var promise = HttpAppService.post(url,params);
        Prompter.showLoading("正在创建");
        promise.success(function(response){ // response.EV_OBJECT_ID
            if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG == "S"){
                Prompter.showLoadingAutoHidden("报工单创建成功!", false, 1000);
                $timeout(function(){
                    baoGongService.detailFromWSHistory = {
                        PROCESS_TYPE: $scope.datas.defaultDetail.IS_PROCESS_TYPE_BAO,
                        //OBJECT_ID: $scope.datas.defaultDetail.IS_OBJECT_ID,
                        OBJECT_ID: response.EV_OBJECT_ID,
                        WS_DETAIL: $scope.datas.defaultDetail.BAO_DESCRIPTION,
                        isFromWSHistory: false
                    };
                    __goBaoGongDetail();
                },1000); 
            }else if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG == "E" && response.ES_RESULT.ZRESULT && response.ES_RESULT.ZRESULT!=""){
                Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
            }else if(response && response.ES_RESULT && response.ES_RESULT.ZRESULT && response.ES_RESULT.ZRESULT!="" ){
                Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
            }else if(response && response.ES_RESULT){
                Prompter.showLoadingAutoHidden(JSON.stringify(response), false, 2000);
            }else{
                Prompter.showLoadingAutoHidden(response, false, 2000);
            }
        })
        .error(function(errorResponse){
            Prompter.showLoadingAutoHidden("保存失败,请检查网络状况!", false, 2000);
        });
	}

    function __goBaoGongDetail(){
        var detail = $scope.datas.defaultDetail.ET_DETAIL;
        if(!angular.isUndefined(detail) && !!detail && detail.item && !!detail.item.length){
            baoGongService.detailFromWSHistory.isEmptyDetail = false;
            $state.go("baoGongDetail");
        }else{
            baoGongService.detailFromWSHistory.isEmptyDetail = true;
            $state.go("baoGongDetail");
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
        

	

}]);