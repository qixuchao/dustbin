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

worksheetModule.filter('xbrParseInt', function(){
  var fn = function (str) {
      return window.parseInt(str);
  };
  return fn;
});

// $filter('date')(date, format, timezone)
// 用来处理 20160101055050 类似的日期字符串
worksheetModule.filter('xbrWorksheetTime', function($filter){
  return function(timeStr, formatStr){
    var returnStr = (!formatStr || formatStr=="") ? "yyyy-MM-dd HH:mm:ss" : formatStr;
    
    var str = timeStr.toString();
    var year = str.substr(0,4);
    var month = str.substr(4,2);
    var day = str.substr(6,2);
    var hh = str.substr(8,2);
    var mm = str.substr(10,2);
    var ss = str.substr(12,2);
    returnStr = returnStr.replace("yyyy", year);
    returnStr = returnStr.replace("MM", month);
    returnStr = returnStr.replace("dd", day);
    returnStr = returnStr.replace("HH", hh);
    returnStr = returnStr.replace("mm", mm);
    returnStr = returnStr.replace("ss", ss);
    return returnStr;
  };
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
    
    //选择车辆
    selectedCheLiang: null,
    backObject:null,   //选择的车辆信息
    //选择产品
    selectedProduct: null,
    backObjectProduct: null,  //选择的产品信息

    wsEditToDetail: {
      needReload: false
    },
    wsDetailToPaiZHao: null,
    getStoredByKey: function(key){
      if(key == "userName"){
        return window.localStorage.crmUserName;
      }
      if(key == "sysName"){
        return "CATL";
      }
      
    }
    /*{
      ydWorksheetNum: 
    }*/
  };
}]);

worksheetModule.service('worksheetHttpService', ['HttpAppService', 'worksheetDataService', function(HttpAppService, worksheetDataService){
    //配件的选择数据
    var sparePart;
    var sparePartPro;
    //相关方数据
    return {
        serviceList: {
            url: ROOTCONFIG.hempConfig.basePath + 'SERVICE_LIST',   //工单列表接口
            /*defaults: {
                I_SYSNAME: { SysName: worksheetDataService.getStoredByKey("sysName") },
                IS_AUTHORITY: { BNAME: worksheetDataService.getStoredByKey("userName") },
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
            }*/
            defaults: {
                I_SYSNAME: { SysName: worksheetDataService.getStoredByKey("sysName") },
                IS_AUTHORITY: { BNAME: worksheetDataService.getStoredByKey("userName") },
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
                IV_SORT: "1",
                IT_IMPACT: {},
                IT_PARTNER: {},
                IT_PROCESS_TYPE: {},
                IT_STAT: {}
            }
        },
        empsList: {
          url: "STAFF_LIST",
          defaults: {
              I_SYSNAME: { SysName: worksheetDataService.getStoredByKey("sysName") },
              IS_PAGE: {
                CURRPAGE: "1",
                ITEMS: "10"
              },
              IS_EMPLOYEE: { "NAME": "" }
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
        setWSCarMileage:function(data){
            worksheetRelatePart=data;
            return worksheetRelatePart;
        },
        getWSCarMileage:function(){
            return worksheetRelatePart;
        },
        //产品

        serviceDetail: {
            url: ROOTCONFIG.hempConfig.basePath + 'SERVICE_DETAIL'   //工单详情接口
        },
        serviceDetailChange: {
            url: ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE',   //工单详情修改接口
            defaults: {
                "I_SYSTEM": { "SysName": worksheetDataService.getStoredByKey("sysName") },
                "IS_AUTHORITY": { "BNAME": worksheetDataService.getStoredByKey("userName") }
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
                "I_SYSTEM": { "SysName": worksheetDataService.getStoredByKey("sysName") },
                "IS_USER": { "BNAME": worksheetDataService.getStoredByKey("userName") }
            }
          },
          list_scenario:{
            url: ROOTCONFIG.hempConfig.basePath + "LIST_SCENARIO",
            defaults: {
                "I_SYSTEM": { "SysName": worksheetDataService.getStoredByKey("sysName") },
                "IS_USER": { "BNAME": worksheetDataService.getStoredByKey("userName") }
            }
          },
          list_response: {
            url: ROOTCONFIG.hempConfig.basePath + "LIST_RESPONSE",
            defaults: {
                "I_SYSTEM": { "SysName": worksheetDataService.getStoredByKey("sysName") },
                "IS_USER": { "BNAME": worksheetDataService.getStoredByKey("userName") }
            }
          },
          list_defect:{
            url: ROOTCONFIG.hempConfig.basePath + "LIST_DEFECT",
            defaults: {
              "I_SYSTEM": { "SysName": worksheetDataService.getStoredByKey("sysName") },
              "IS_USER": { "BNAME": worksheetDataService.getStoredByKey("userName") }
            }
          }
        },
        imageInfos: {  // 图片展示界面
           listUrl: "http://117.28.248.23:9388/test/api/CRMAPP/URL_LIST",
           listDefaults: null,
           deleteUrl: "http://117.28.248.23:9388/test/api/CRMAPP/URL_DELETE",
           deleteDefaults: null,
           uploadUrl: "http://117.28.248.23:9388/test/api/CRMAPP/URL_CREATE",
           uploadDefaults: null
        }
    };
}]);