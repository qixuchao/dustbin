worksheetReportModule.directive('crmToast', function() {
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

worksheetReportModule.factory('worksheetReportservice', ['HttpAppService', function (HttpAppService) {
    //报工单列表
    var worksheetReportlistInfos;
    return{
        getReportlist: function () {
            return worksheetReportlistInfos;
        },
        setReportlist: function (obj) {
            worksheetReportlistInfos = obj;
        },
    }
}]);