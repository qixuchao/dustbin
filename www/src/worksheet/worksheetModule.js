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

worksheetModule.service('', function(){
    return {
        serviceList: serviceList
    };

    function serviceList(argument) {
        //var url="http://117.28.248.23:9388/test/api/CRMAPP/CAR_LIST_BY_DCR";
        var serviceListUrl = ROOTCONFIG.hempConfig.basePath + 'SERVICE_LIST';
        var postData = {
            "I_SYSNAME": { "SysName": "CATL" },
            "IS_AUTHORITY": { "BNAME": "" },
            "IS_PAGE": {
              "CURRPAGE": "0000000001",
              "ITEMS": "0000000010"
            },
            "IS_SEARCH": {
              "SEARCH": "",
              "OBJECT_ID": "",
              "DESCRIPTION": "",
              "PARTNER": "",
              "PRODUCT_ID": "",
              "CAR_TEXT": "",
              "CREATED_FROM": "",
              "CREATED_TO": ""
            },
            "IS_SORT": "1",
            "T_IN_IMPACT": {
             
            },
            "T_IN_PARTNER": {
             
            },
            "T_IN_PROCESS_TYPE": {
             
            },
            "T_IN_STAT": {
                
            }
        };
        HttpAppService.post(serviceListUrl,postData).success(function(response){
            var num=response.ET_VEHICL_OUTPUT.item.length;
            console.log(num);
            for(var i=0;i<num;i++){
                var car={
                    codeId:"",
                    describe:""
                };
                car.codeId=response.ET_VEHICL_OUTPUT.item[i].ZBAR_CODE;
                car.describe=response.ET_VEHICL_OUTPUT.item[i].SHORT_TEXT;
                $scope.cars.push(car);
            }
        });
    }

});