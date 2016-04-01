/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
customerModule
    .controller('customerQueryCtrl',['$scope','$rootScope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading',function($scope,$rootScope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading){
        $ionicPopover.fromTemplateUrl('../src/customer/model/customer_selec.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.customerpopover = popover;
        });
        $scope.customerPopover = function($event) {
            $scope.customerpopover.show($event);
        };
        $scope.customerPopoverhide = function() {
            $scope.customerpopover.hide();
        };

        $scope.customer_types = ['潜在客户','正式客户','竞争对手','助销伙伴','终端客户','服务端'];
        $scope.customerQuery_list = [{
            customername: '福州龙福汽车有限责任公司',
            customeraddress:'河南省郑州市芙蓉街汇金路55号',
            customerphonenumber:'021-88221731',
            customernumber:'NO.100036',
            customerposition:'正式客户',
            customerpayway:'电汇/90天',
            customerpaydate:'通用日历',
            customercheckperiod:'10',
            customerwillcheckperiod:'10',
            customerfax:'010-86543777',
            customermail:'yuwei.wang@hand-china.com',
            customerwebsite:'www.jinlonggao.com',
            customercontrary:'中国',
            customerregion:'河南省',
            customercity:'郑州市',
            customerstreet:'芙蓉街汇金路55',
            customerborad:'55号',
            customerpostal:'5567001',
            'customerzhushi':'in the feahennmkk in the feahennmkk in the feahennmkk in the feahennmkk'
        }, {
                customername: '福州龙福汽车有限责任公司',
                customeraddress:'河南省郑州市芙蓉街汇金路55号',
                customerphonenumber:'021-88221731',
                customernumber:'NO.100036',
                customerposition:'正式客户',
                customerpayway:'电汇/90天',
                customerpaydate:'通用日历',
                customercheckperiod:'10',
                customerwillcheckperiod:'10',
                customerfax:'010-86543777',
                customermail:'yuwei.wang@hand-china.com',
                customerwebsite:'www.jinlonggao.com',
                customercontrary:'中国',
                customerregion:'河南省',
                customercity:'郑州市',
                customerstreet:'芙蓉街汇金路55',
                customerborad:'55号',
                customerpostal:'5567001',
                'customerzhushi':'in the feahennmkk in the feahennmkk in the feahennmkk in the feahennmkk'
            }
        ];

        $scope.customerqueryTypeunit = "常用客户";
        //$scope.customer_Querylistheadlinestyle = 'customer_QuerylistheadlineA'
        $scope.customerqueryType = function(type){
            $scope.customerqueryTypeunit = type;
            //if(type == "服务端"){
            //    $scope.customer_Querylistheadlinestyle = 'customer_QuerylistheadlineB';
            //}else{
            //    $scope.customer_Querylistheadlinestyle = 'customer_QuerylistheadlineA'
            //}
            $scope.customerPopoverhide();
        };

        //跳转detail界面
        $scope.customergodeatil = function(cusvalue){
            customeService.set_customerListvalue(cusvalue);
            $state.go("customerDetail");
        }
    }])
    .controller('customerDetailCtrl',['$scope','$rootScope','$state','Prompter','$ionicLoading','$cordovaInAppBrowser','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','customeService','$window','$ionicActionSheet',function($scope,$rootScope,$state,Prompter,$ionicLoading,$cordovaInAppBrowser,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,customeService,$window,$ionicActionSheet){
        $scope.customer_detailstypes = [{
            typemane:'联系人',
            imgurl:'img/customer/customerlianxir@2x.png',
            url:'customerContactQuery'
        },{
            typemane:'机会',
            imgurl:'img/customer/customerjihui@2x.png',
            url:'customerChanceQuery'
        },{
            typemane:'活动',
            imgurl:'img/customer/customerhuod.png',
            url:'customerActivityQuery'
        },{
            typemane:'工单',
            imgurl:'img/customer/customergongd@2x.png',
            url:'customerWorkorderQuery'
        },{
            typemane:'线索',
            imgurl:'img/customer/customerxians@2x.png',
            url:'customerKeyQuery'
        },{
            typemane:'车辆',
            imgurl:'img/customer/customerchel@2x.png',
            url:'customerVehicleQuery'
        },{
            typemane:'报价',
            imgurl:'img/customer/customerbaoj@2x.png',
        },{
            typemane:'负责人',
            imgurl:'img/customer/customerfuz@2x.png',
        }
        ];

        $scope.gocustomerLists = function(cusvalue){
            console.log(cusvalue)
            if(cusvalue.url){
                $state.go(cusvalue.url);
            }
        }

        $scope.customer_showTitle = false;
        $scope.customer_showTitleStatus = false;
        $scope.customer_TitleFlag=false;

        var customer_position;
        $scope.customer_onScroll = function () {
            customer_position = $ionicScrollDelegate.getScrollPosition().top;
            if (customer_position > 15) {
                $scope.customer_TitleFlag=true;
                $scope.customer_showTitle = true;

                if (customer_position >25) {
                    $scope.customer_customerFlag = true;
                }else{
                    $scope.customer_customerFlag = false;
                }
                if (customer_position > 25) {
                    $scope.customer_placeFlag = true;
                }else{
                    $scope.customer_placeFlag = false;
                }
                if (customer_position >40) {
                    $scope.customer_typeFlag = true;
                }else{
                    $scope.customer_typeFlag = false;
                }
                console.log(customer_position);
            } else {
                $scope.customer_customerFlag = false;
                $scope.customer_placeFlag = false;
                $scope.ecustomer_typeFlag = false;
                $scope.customer_TitleFlag = false;
            }
            $scope.$apply();
        };
        $scope.customerdetails = customeService.get_customerListvalue();
        //电话
        $scope.customershowphone =function(types){
            Prompter.showphone(types)
        }
        //邮箱
        $scope.customermailcopyvalue = function(valuecopy){
            Prompter.showpcopy(valuecopy)
        };
        //打开浏览器
        $scope.customeropenbrser = function(Url){
            Prompter.openbrserinfo(Url)
        };
        //编辑
        $scope.CustomerDeatilEditvalue = function(){
            $state.go('customerEdit')
        };
        //广播编辑
        $rootScope.$on('customerEditvalue', function(event, data) {
            $scope.customerdetails = customeService.get_customerListvalue();
        });

    }])
    .controller('customerEditlCtrl',['$scope','$rootScope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading',function($scope,$rootScope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading){
        //位置级联
        $scope.customereditcontry = [
            {
                name:'中国'
            },{
                name:'美国'
            },{
                name:'新加坡'
            }
        ];
        //初始化数据
        $scope.customeredit = {
            customerposition:customeService.get_customerListvalue().customerposition,
            customerpayway:customeService.get_customerListvalue().customerpayway,
            customerpaydate:customeService.get_customerListvalue().customerpaydate,
            customercheckperiod:customeService.get_customerListvalue().customercheckperiod,
            customerwillcheckperiod:customeService.get_customerListvalue().customerwillcheckperiod,
            customerfax:customeService.get_customerListvalue().customerfax,
            customermail:customeService.get_customerListvalue().customermail,
            customerwebsite:customeService.get_customerListvalue().customerwebsite,
            customercontrary:customeService.get_customerListvalue().customercontrary,
            customerregion:customeService.get_customerListvalue().customerregion,
            customercity:customeService.get_customerListvalue().customercity,
            customerstreet:customeService.get_customerListvalue().customerstreet,
            customerborad:customeService.get_customerListvalue().customerborad,
            customerpostal:customeService.get_customerListvalue().customerpostal,
            customerzhushi:customeService.get_customerListvalue().customerzhushi,

            customername:customeService.get_customerListvalue().customername,
            customeraddress:customeService.get_customerListvalue().customeraddress,
            customerphonenumber:customeService.get_customerListvalue().customerphonenumber,

        };
        $scope.customerKeepEditvalue = function(){
            customeService.set_customerListvalue($scope.customeredit);
            //广播修改详细信息界面的数据
            $rootScope.$broadcast('customerEditvalue');
            $state.go('customerDetail');

        }

    }])
