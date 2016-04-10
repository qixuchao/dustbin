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

worksheetModule.service('worksheetHttpService', ['HttpAppService', function(HttpAppService){
    
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
        }
    };

}]);