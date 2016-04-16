worksheetModule.directive('crmToast', function() {
    return {
        restrict: 'E',
        scope: {
        	message: '@', // message="method()"
        	showTime: '@', // showTime="{{timeStr}}"
        	className: '@', //
        	testDatas: '=', // test-datas="config.datas"
        	level: '@'  // 级别：warn、info、error
        },
        replace: true,
        template: '<div class="crm-toast-wrapper {{className}} {{level}}"><span ng-bind="message"></span></div>',
        compile: function(element){
        	
        	return {pre: preLink};

        	function preLink($scope, $element, $attr){

        	};
        }
    };
});

worksheetModule.filter('xbrParseInt', function($sce){
  var fn = function (str) {
      return window.parseInt(str);
  };
  return fn;
});


worksheetModule.service('worksheetDataService', [function(){
  return {
    worksheetList:{
      toDetail:{
        //  "IS_OBJECT_ID": "5200000297"
        //  "IS_PROCESS_TYPE": "ZPRO"
        //  "ydWorksheetNum": 
        //  "ydStatusNum":
      }
    },
    toDetailPageTag: null, //"history",
    worksheetHistoryList:{
      toDetail: {

      }
    },
    wsDetailData: null,
    wsDetailToList: {
      needReload: false
    },
<<<<<<< HEAD
      selectedCheLiang: null
=======
    wsEditToDetail: {
      needReload: false
    }
>>>>>>> 655ec3cd125aeed3d04b538bbc790214d7408be7
    /*{
      ydWorksheetNum: 
    }*/
  };
}]);

worksheetModule.service('worksheetHttpService', ['HttpAppService', function(HttpAppService){
    //配件的选择数据
    var sparePart;
    //相关方数据
    var worksheetRelatePart;
    return {
        serviceList: {
            url: ROOTCONFIG.hempConfig.basePath + 'SERVICE_LIST',   //工单列表接口
            defaults: {
                I_SYSNAME: { SysName: "CATL" },
                IS_AUTHORITY: { BNAME: "" },
                IS_PAGE: {
                  CURRPAGE: 1,
                  ITEMS: 10
                },
                IS_SEARCH: {
                  SEARCH: "",
                  OBJECT_ID: "",
                  DESCRIPTION: "",
                  PARTNER: "",
                  PRODUCT_ID: "",
                  CAR_TEXT: "",
                  CREATED_FROM: "",
                  CREATED_TO: ""
                },
                IS_SORT: "1",
                T_IN_IMPACT: {},
                T_IN_PARTNER: {},
                T_IN_PROCESS_TYPE: {},
                T_IN_STAT: {}
            }
        },
        //备件
        setSparePart:function(data){
            sparePart=data;
            return sparePart;
        },
        getSparePart:function(){
            return sparePart;
        },
        //相关方
        setWorksheetRelatePart:function(data){
            worksheetRelatePart=data;
            return worksheetRelatePart;
        },
        getWorksheetRelatePart:function(){
            return worksheetRelatePart;
        },
        serviceDetail: {
            url: ROOTCONFIG.hempConfig.basePath + 'SERVICE_DETAIL'   //工单详情接口
        },
        serviceDetailChange: {
            url: ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE',   //工单详情修改接口
            defaults: {
                "I_SYSTEM": { "SysName": "CATL" },
                "IS_AUTHORITY": { "BNAME": "HANDLCX" }
                /*,
                "IS_HEAD_DATA": {
                  "DESCRIPTION": "",
                  "CAR_NO": "",
                  "STATUS": "",
                  "IMPACT": "0",
                  "START_DATE": "",
                  "START_TIME": "14:20:00.0Z",
                  "END_DATE": "",
                  "END_TIME": "14:20:00.0Z",
                  "SCENARIO": "",
                  "RESPONSE": "",
                  "DEFECT": "",
                  "COMP_TYPE": "",
                  "COMPONENT": "",
                  "REASON": "",
                  "ZZBXR": "",
                  "ZZBXDH": ""
                },
                "IS_PROCESS_TYPE": "",
                "IT_MAT_LIST": {
                  "item": {
                    "STORAGE": "",
                    "PROD": "",
                    "APPLY_NUM": "",
                    "SEND_NUM": "",
                    "RETURN_NUM": "",
                    "OLDNUM": "",
                    "ZMODE": "a"
                  }
                },
                "IT_MILEAGE": {
                  "item": {
                    "MILEAGE_REF": "",
                    "MILEAGE_VALUE": "",
                    "MILEAGE_DATE": "",
                    "MILEAGE_DESC": ""
                  }
                },
                "IT_PARTNER": {
                  "item": {
                    "PARTNER_FCT": "",
                    "PARTNER_NO": "",
                    "ZMODE": ""
                  }
                },
                "IT_TEXT": {
                  "item": {
                    "TDID": "",
                    "TEXT": ""
                  }
                }*/
            }
        },
        xialazhi: {
          service_order_reason:{
            url: ROOTCONFIG.hempConfig.basePath + "SERVICE_ORDER_REASON",
            defaults: {
                "I_SYSTEM": { "SysName": "CATL" },
                "IS_USER": { "BNAME": "HANDLCX02" }
            }
          },
          list_scenario:{
            url: ROOTCONFIG.hempConfig.basePath + "LIST_SCENARIO",
            defaults: {
                "I_SYSTEM": { "SysName": "CATL" },
                "IS_USER": { "BNAME": "HANDLCX02" }
            }
          },
          list_response: {
            url: ROOTCONFIG.hempConfig.basePath + "LIST_RESPONSE",
            defaults: {
                "I_SYSTEM": { "SysName": "CATL" },
                "IS_USER": { "BNAME": "HANDLCX02" }
            }
          },
          list_defect:{
            url: ROOTCONFIG.hempConfig.basePath + "LIST_DEFECT",
            defaults: {
              "I_SYSTEM": { "SysName": "CATL" },
              "IS_USER": { "BNAME": "HANDLCX02" }
            }
          }
        }
    };
}]);