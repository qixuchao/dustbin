 /**
 * Created by zhangren on 16/3/7.
 */
customerModule
    .controller('customerQueryCtrl',['$cordovaDialogs','Prompter','$scope','$rootScope','$state','$http','HttpAppService','LoginService','$timeout','$cordovaToast','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading',
        function($cordovaDialogs,Prompter,$scope,$rootScope,$state,$http,HttpAppService,LoginService,$timeout,$cordovaToast,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading){
        $ionicPopover.fromTemplateUrl('src/customer/model/customer_selec.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.customerpopover = popover;
        }); 
        $scope.customerPopover = function() {
            $scope.changePage();
            $scope.customerpopover.show();
        };
        $scope.customerPopoverhide = function() {
            $scope.customerpopover.hide();
        };
        if(LoginService.getProfileType()=="APP_SERVICE"){
            $scope.ser = true;
            $scope.sale = false;
        }else if (LoginService.getProfileType()=="APP_SALE"){
            $scope.sale = true;
            $scope.ser = false;
        }
        $scope.searchFlag=false;
        $scope.customer={
            customerfiledvalue:""
        };
            $scope.customerQuery_list = []; 
        //历史记录显示customer_usuaflag
        $scope.CustomerHisGetvaluehis = function(){
            $scope.customer_queryflag = false;
            if(storedb('customerdb').find() != undefined || storedb('contactdb').find() != null) {
                $scope.customer_query_historylists = (storedb('customerdb').find());
                if ($scope.customer_query_historylists.length > 5) {
                    $scope.customer_query_historylists = $scope.customer_query_historylists.slice(0, 5);
                };
            }
            //}else{
            //    $scope.customer_queryflag = true;
            //};
            //常用联系人显示
            if (JSON.parse(localStorage.getItem("usuacustomerdb")) != null || JSON.parse(localStorage.getItem("usuacustomerdb")) != undefined) {
                $scope.usuallycustomerQuery_list = JSON.parse(localStorage.getItem("usuacustomerdb"));
                if ($scope.usuallycustomerQuery_list.length > 15) {
                    $scope.usuallycustomerQuery_list = $scope.usuallycustomerQuery_list.slice(0, 15);
                };
            } else {
                $scope.usuallycustomerQuery_list = [];
            };

        };
        $scope.CustomerHisGetvaluehis();

        //广播修改界面显示flag
        //$rootScope.$on('customerdeatillist', function(event, data) {
        //    //返回初始化
        //    $scope.customerisshow = false;
        //    //删除请求
        //    //$http['delete'](ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST')
        //    $scope.customerQuery_list = [];
        //    $scope.customerQuery_list = new Array;
        //    $scope.customerPage = 0;
        //
        //    $scope.customer.customerfiledvalue ='';
        //    $scope.CustomerHisGetvaluehis();
        //});
        //查询
        //初始化查询参数
        //$scope.customerselecttyperole = '';
        //$scope.customerQuery_list = [];
        //$scope.customerQuery_list = new Array;
        //$scope.customerPage = 0;

        //$scope.initSearch = function(){
        //    $scope.customer_queryflag = true;
        //};
        //$scope.customerFirstLoad = function() {
        //    $scope.customerQuery_list = [];
        //    $scope.customerQuery_list = new Array;
        //    $scope.customerPage = 1;
        //    $scope.customerLoadmore("first");
        //}
        $scope.customerLoadmore = function() {

            $scope.customerPage += 1;
            var url = ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST';
            var data = {
                "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                "IS_PAGE": {
                    "CURRPAGE": $scope.customerPage,
                    "ITEMS": "10"
                },
                "IS_SEARCH": {"SEARCH": $scope.customer.customerfiledvalue},
                "IT_IN_ROLE": {}
            };
            if ($scope.customerselecttyperole){
                data.IT_IN_ROLE = {"item1": [{"RLTYP": $scope.customerselecttyperole}]}
            }

            //var data = data2;
            //console.log("data"+angular.toJson(data));
            //console.log("name"+angular.toJson(data.IS_SEARCH.SEARCH));
            //console.log("number"+angular.toJson(data.IS_PAGE.CURRPAGE));
            var startTime = new Date().getTime();
            HttpAppService.post(url, data).success(function (response) {
                //console.log($scope.customer.customerfiledvalue);
                //console.log(data.IS_SEARCH);
                if($scope.customer.customerfiledvalue != data.IS_SEARCH.SEARCH){
                    return;
                }
                //console.log(response);
                $scope.customer_queryflag = true;
                if (response.ES_RESULT.ZFLAG == 'E') {
                    $scope.customerisshow = false;
                    //$cordovaToast.showShortCenter(response.ES_RESULT.ZRESULT);
                        $cordovaToast.showShortCenter(response.ES_RESULT.ZRESULT)
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    if (response.ES_RESULT.ZFLAG == 'S') {
                        if(response.ET_OUT_LIST != ''){
                            if (response.ET_OUT_LIST.item.length == 0) {
                                $scope.customerisshow = false;
                                if ($scope.customerPage == 1) {
                                    $cordovaToast.showShortBottom('数据为空');
                                } else {
                                    $cordovaToast.showShortBottom('没有更多数据');
                                }
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            } else {
                                if(response.ET_OUT_LIST.item.length < 10){
                                    $scope.customerisshow = false;
                                }
                                    //if($scope.customer.customerfiledvalue=="" && data.IT_IN_ROLE == ""){
                                    //    $scope.customerQuery_list = new Array;
                                    //}else{
                                    //    $scope.customerQuery_list = response.ET_OUT_LIST.item;
                                    //}
                                $.each(response.ET_OUT_LIST.item, function (n, value) {
                                    if($scope.customer.customerfiledvalue==""  && data.IT_IN_ROLE == ""){
                                        $scope.customerQuery_list = new Array;
                                    }else{
                                        $scope.customerQuery_list.push(value);
                                    }

                                });

                            }
                            if (response.ET_OUT_LIST.item.length < 10) {
                                $scope.customerisshow = false;
                                if ($scope.customerPage > 1) {
                                    $cordovaToast.showShortBottom('没有更多数据');
                                }
                            } else {
                                $scope.customerisshow = true;
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    }
                }
                //$scope.config.queryResultScrollDelegate.resize();
            }).error(function (response, status, header, config) {
                var respTime = new Date().getTime() - startTime;
                //超时之后返回的方法
                if(respTime >= config.timeout){
                    if(ionic.Platform.isWebView()){
                        $cordovaDialogs.alert('请求超时');
                    }
                }else{
                    $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                }
                $ionicLoading.hide();
            });
        };
        //实时搜索
        $scope.initLoad=function(){
            $scope.customerPage = 0;
            $scope.customerQuery_list=new Array;
            Prompter.showLoading("正在加载");
            $scope.customerLoadmore();
        };
        $scope.search = function (x, e){
            Prompter.showLoading('正在搜索');
            $scope.searchFlag=true;
            $scope.customer.customerfiledvalue = x;
            $scope.initLoad();
        };
        $scope.cancelSearch=function(){
            //$http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST')
            $scope.searchFlag=false;
            $scope.customer.customerfiledvalue = '';
            $scope.customerQuery_list=new Array;
            $scope.CustomerHisGetvaluehis();

        };
        //显示搜索页面
        $scope.changePage=function(){
            $scope.searchFlag=true;
        };
            $rootScope.$on('customerCreatevalue',function(event, data) {
                //console.log("接收成功" + data);
                $scope.searchFlag = data;
                $scope.customer.customerfiledvalue = "";
                $scope.cancelSearch();
            });
            //清除输入框内的内容
            $scope.initSearch = function () {
                //$http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST')
                $scope.customer.customerfiledvalue = '';
                $scope.customerPage = 0;
                $scope.customerQuery_list = new Array;
                Prompter.showLoading("正在加载");
                $scope.customerLoadmore();
            }
        //清除历史记录
        $scope.CustomerClearhis = function(){
            storedb('customerdb').remove();
            $scope.customer_query_historylists = [];
        };
        //点击历史记录开始请求

        //$scope.CustomerHisGetvalue = function(value){
        //    $scope.customer.customerfiledvalue = value.name;
        //    $scope.customerQuery_list = [];
        //    $scope.customerQuery_list = new Array;
        //    $scope.customerPage = 0;
        //    $scope.customer_queryflag = true;
        //    $ionicScrollDelegate.resize();
        //    $scope.customerisshow = true;
        //    if(!$scope.$$phase) {
        //        $scope.$apply();
        //    };
        //};
        //    $scope.config={
        //        queryResultScrollDelegate:""
        //    };
        //    $scope.config.queryResultScrollDelegate = $ionicScrollDelegate.$getByHandle("customerListResult");
        ////
        //$scope.CustomerHisGetvalue = function(value){
        //    $scope.customer.customerfiledvalue = value.name;
        //    $scope.customerQuery_list = [];
        //    $scope.customerQuery_list = new Array;
        //    $scope.customerPage = 0;
        //    $scope.customer_queryflag = true;
        //    $ionicScrollDelegate.resize();
        //    $scope.customerisshow = true;
        //    if(!$scope.$$phase) {
        //        $scope.$apply();
        //    };
        //};
            //$scope.config={
            //    queryResultScrollDelegate:""
            //};
            //$scope.config.queryResultScrollDelegate = $ionicScrollDelegate.$getByHandle("customerListResult");


        //跳转detail界面
        //$scope.customergodeatil = function(cusvalue){
        //    customeService.set_customerListvalue(cusvalue);
        //    $state.go("customerDetail");
        //}


        //初始化本地数据
        if (JSON.parse(localStorage.getItem("usuacustomerdb")) != null || JSON.parse(localStorage.getItem("usuacustomerdb")) != undefined) {
            $scope.customerhislistvalue = JSON.parse(localStorage.getItem("usuacustomerdb"));
        }else{
            $scope.customerhislistvalue = new Array;
        }


        $scope.customergodeatil = function(x){
            $scope.customerisshow = false;
            $scope.usuallycustomerlist = x;
            //console.log(x)
            //存储历史记录
            if($scope.customer.customerfiledvalue != ''){
                if(storedb('customerdb').find() != undefined || storedb('contactdb').find() != null){
                    var customerhislistvalue = storedb('customerdb').find();
                    var customerhislistvaluelength = storedb('customerdb').find().length;
                    //判断是否有相同的值
                    var customerhislistflag = true;
                    for(var i=0;i<customerhislistvaluelength;i++){
                        if(customerhislistvalue[i].name ==  $scope.customer.customerfiledvalue) {
                            //删除原有的，重新插入
                            storedb('customerdb').remove({"name":customerhislistvalue[i].name}, function (err) {
                                if (!err) {
                                } else {
                                }
                            });
                            //storedb('customerdb').find().splice(i,1);
                            storedb('customerdb').insert({"name": $scope.customer.customerfiledvalue}, function (err) {
                                if (!err) {
                                } else {
                                    $cordovaToast.showShortBottom('历史记录保存失败');
                                }
                            });
                            customerhislistflag = false;
                        }
                    };
                    if(customerhislistflag == true){
                        storedb('customerdb').insert({"name": $scope.customer.customerfiledvalue}, function (err) {
                            if (!err) {
                            } else {
                                $cordovaToast.showShortBottom('历史记录保存失败');
                            }
                        });
                    }
                }else{
                    storedb('customerdb').insert({"name": $scope.customer.customerfiledvalue}, function (err) {
                        if (!err) {
                            //console.log('历史记录保存成功')
                        } else {
                            $cordovaToast.showShortBottom('历史记录保存失败');
                        }
                    });
                };
            };
            //存储常用联系人
            if (JSON.parse(localStorage.getItem("usuacustomerdb")) != null || JSON.parse(localStorage.getItem("usuacustomerdb")) != undefined) {
                //判断是否有相同的值
                var usuacustomerhislistflag = true;
                for(var i=0;i<$scope.customerhislistvalue.length;i++){
                    if($scope.customerhislistvalue[i].NAME_ORG1 == $scope.usuallycustomerlist.NAME_ORG1) {
                        //删除原有的，重新插入
                        $scope.customerhislistvalue = JSON.parse(localStorage.getItem("usuacustomerdb"));
                        $scope.customerhislistvalue.splice(i,1);
                        $scope.customerhislistvalue.unshift($scope.usuallycustomerlist);
                        localStorage['usuacustomerdb'] = JSON.stringify( $scope.customerhislistvalue);

                        usuacustomerhislistflag = false;
                    }
                };
                if(usuacustomerhislistflag == true){
                    $scope.customerhislistvalue.unshift($scope.usuallycustomerlist);
                    localStorage['usuacustomerdb'] = JSON.stringify( $scope.customerhislistvalue);
                }

            }else{
                $scope.customerhislistvalue.unshift($scope.usuallycustomerlist);
                localStorage['usuacustomerdb'] = JSON.stringify( $scope.customerhislistvalue);
            };

            customeService.set_customerListvalue(x);
            $state.go("customerDetail");
        };

        /*//判断是ATL还是CATL
        if(ROOTCONFIG.hempConfig.baseEnvironment == 'CATL'){
            $scope.customer_types = ['潜在客户','正式客户','竞争对手','助销伙伴','终端客户','服务供应商'];
        }else{
            $scope.customer_types = ['潜在客户','正式客户','竞争对手','服务供应商'];
        }*/
        //判断是APP_SERVICE还是APP_SALE
        if(LoginService.getProfileType()=="APP_SERVICE"){
            $scope.customer_types = [{name : '正式客户',color1 : false,color2: true},{name : '服务供应商',color1 : false,color2: true},{ name:'终端客户',color1 : false,color2: true}];
        }else if (LoginService.getProfileType()=="APP_SALE"){
            $scope.customer_types = [{name:'潜在客户',color1 : false,color2: true},{name:'正式客户',color1 : false,color2: true},{name:'竞争对手',color1 : false,color2: true},{name:'助销合作伙伴',color1 : false,color2: true}];
            //,{name:'终端客户',color1 : false,color2: true},{name:'服务供应商',color1 : false,color2: true}
        }

        $scope.customerqueryTypeunit = "常用客户";
        $scope.employbasiclineflag = true;
        $scope.customerqueryType = function(type){
            //console.log(type);
            for(var i=0;i<$scope.customer_types.length;i++){
                $scope.customer_types[i].color1 = false;
                $scope.customer_types[i].color2 = true;
            }
            type.color1 = true;
            type.color2 = false;
            //console.log($scope.customer_types);
            $scope.customer.customerfiledvalue ='';
            $scope.customerqueryTypeunit = type.name;
            if(type == "服务供应商"){
                $scope.employbasiclineflag = false;
            }else{
                $scope.employbasiclineflag = true;
            };
            //改变参数
            if(ROOTCONFIG.hempConfig.baseEnvironment == 'CATL'){
                switch (type.name) {
                    case '潜在客户':
                        $scope.customerselecttyperole = 'Z00001';
                        break;
                    case '正式客户':
                        $scope.customerselecttyperole = 'CRM000';
                        break;
                    case '竞争对手':
                        $scope.customerselecttyperole = 'Z00002';
                        break;
                    case '助销合作伙伴':
                        $scope.customerselecttyperole = 'Z00003';
                        break;
                    case '终端客户':
                        $scope.customerselecttyperole = 'Z00004';
                        break;
                    case '服务供应商':
                        $scope.customerselecttyperole = 'BBP000';
                        break;
                }
            }else{
                switch (type.name) {
                    case '潜在客户':
                        $scope.customerselecttyperole = 'ZATL01';
                        break;
                    case '正式客户':
                        $scope.customerselecttyperole = 'CRM000';
                        break;
                    case '竞争对手':
                        $scope.customerselecttyperole = 'ZATL05';
                        break;
                    case '助销合作伙伴':
                        $scope.customerselecttyperole = 'ZATL06';
                        break;
                }
            };
            //改变角色的参数
            //$scope.$apply(function(){

            //$scope.customerisshow = false;
            //删除请求
            //$http['delete'](ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST');
            //$scope.customerQuery_list = [];
            //$scope.customerQuery_list = new Array;
            //$scope.customerPage = 0;
            //$scope.customer_queryflag = true;
            //$ionicScrollDelegate.resize();
            //$scope.customerFirstLoad();
            //$scope.customerisshow = true;
            $scope.customerQuery_list = [];
            $scope.customerPage = 0;
            $scope.customerLoadmore();
            $scope.customerPopoverhide();
        };
    }])
    .controller('customerDetailCtrl',['$scope','$rootScope','$ionicHistory','$state','$cordovaToast','$ionicSlideBoxDelegate','Prompter','LoginService','HttpAppService','$timeout','$ionicLoading','$cordovaInAppBrowser','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','customeService','$window','$ionicActionSheet','saleActService','$cordovaDialogs',
        function($scope,$rootScope,$ionicHistory,$state,$cordovaToast,$ionicSlideBoxDelegate,Prompter,LoginService,HttpAppService,$timeout,$ionicLoading,$cordovaInAppBrowser,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,customeService,$window,$ionicActionSheet,saleActService,$cordovaDialogs){

        if(LoginService.getProfileType()=="APP_SERVICE"){
            $scope.sedit = true;
        }else if (LoginService.getProfileType()=="APP_SALE"){
            $scope.sedit = false;
        }
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            //console.log(fromState.name+toState.name);
            if(fromState.name == 'customerEdit' && toState.name == 'customerDetail'){
                Prompter.showLoading("数据加载中...");
                var url = ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_DETAIL';
                var data = {
                    "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                    "IS_PARTNER": { "PARTNER": customeService.get_customerListvalue().PARTNER},
                    "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName }
                };
                var startTime = new Date().getTime();
                HttpAppService.post(url, data).success(function (response) {
                    //console.log(response);
                    //Prompter.hideLoading();
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    } else {
                        customeService.set_customeFuZe(response);
                        if(response.ET_OUT_DETAIL != ''){
                            $scope.customerdetails = response.ET_OUT_DETAIL.item[0];
                            var arr = $scope.customerdetails.PARTNER;
                            for(var i =0;i<arr.length;i++){
                                if(arr[i] != "0"){
                                    $scope.customerdetails.PARTNER_ID = arr.substring(i,arr.length);
                                }
                            }
                            //$scope.customerdetails.PARTNER_ID = parseInt($scope.customerdetails.PARTNER);
                            //console.log($scope.customerdetails.PARTNER_ID);
                        }
                        if(response.ET_LINES != '' && response.ET_LINES.item){
                            $scope.customerdetails.TDLINE = "";
                            for(var i=0;i<response.ET_LINES.item.length;i++){
                                $scope.customerdetails.TDLINE = $scope.customerdetails.TDLINE.concat(response.ET_LINES.item[i].TDLINE);
                            }
                        }
                    }
                }).error(function (response, status, header, config) {
                    var respTime = new Date().getTime() - startTime;
                    //超时之后返回的方法
                    if(respTime >= config.timeout){
                        if(ionic.Platform.isWebView()){
                            $cordovaDialogs.alert('请求超时');
                        }
                    }else{
                        $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                    }
                    $ionicLoading.hide();
                });
            }
        });

        $scope.CustomergoBack = function() {
            saleActService.isFromRelation = false;
            $rootScope.$broadcast('customerCreatevalue', 'false');
            //window.history.back(-1);
            $ionicHistory.goBack();
        };

        //根据角色检查字段初始化
        //付款方式
        $scope.customerDetailplayway = true;
        //付款日历
        $scope.customerDetailplaydate = true;
        //验收周期
        $scope.customerDetailcheckdate = true;
        //预验收周期
        $scope.customerDetailwillcheckdate = true;
        //竞争对手领域
        $scope.customerDetailZzlyone = true;
        //份额
        $scope.customerDetailContains = true;
        //价格
        $scope.customerDetailPrice = true;
        //助销伙伴领域
        $scope.customerDetailZzlytwo = true;
        //长项
        $scope.customerDetailAdvatage = true;
        //项目
        $scope.customerDetailEvent = true;
        //移动电话
        $scope.customerDetailmobilenum = true;
        //国家
        $scope.customerDetailcontrary = true;
        //代收人
        $scope.customerDetailnameco = true;
        //街道二
        $scope.customerDetailstrret = true;
        //街道三
        $scope.customerDetailstrreth = true;
            //网站
            $scope.web = true;
            //fuze
            $scope.fuzeEmp = true;
            //zhushi
            $scope.remark = true;
            //menpai
            $scope.menNum = true;
        //初始化角色判断
        var customerDroletypeold = customeService.get_customerListvalue().PARTNER_ROLE;

        //唯一确定传入是否可以编辑的角色
        var customerDroletypenewvalue = '';

        if(ROOTCONFIG.hempConfig.baseEnvironment == 'CATL'){
            if(customerDroletypeold.includes("Z00001")){
                $scope.customerDroletype='潜在客户';
                customerDroletypenewvalue = 'Z00001';
            }else if(customerDroletypeold.includes("Z00004")){
                $scope.customerDroletype='终端客户';
                customerDroletypenewvalue = 'Z00004';
            }else if(customerDroletypeold.includes("CRM000")){
                $scope.customerDroletype='正式客户';
                customerDroletypenewvalue = 'CRM000';
            }else if(customerDroletypeold.includes("Z00002")){
                $scope.customerDroletype='竞争对手';
                customerDroletypenewvalue = 'Z00002';
            }else if(customerDroletypeold.includes("Z00003")){
                $scope.customerDroletype='助销合作伙伴';
                customerDroletypenewvalue = 'Z00003';
            }else if(customerDroletypeold.includes("CRM000")== false && customerDroletypeold.includes("BBP000") == true){
                $scope.customerDroletype='服务商';
                customerDroletypenewvalue = 'BBP000';
            };
            $scope.authInfo = LoginService.getAuthInfoByFunction(customerDroletypenewvalue);
        }else{
            if(customerDroletypeold.includes("ZATL01")){
                $scope.customerDroletype='潜在客户';
                customerDroletypenewvalue = 'ZATL01';
            }else if(customerDroletypeold.includes("ZATL05")){
                $scope.customerDroletype='竞争对手';
                customerDroletypenewvalue = 'ZATL05';
            }else if(customerDroletypeold.includes("ZATL06")){
                $scope.customerDroletype='助销合作伙伴';
                customerDroletypenewvalue = 'ZATL06';
            }else if(customerDroletypeold.includes("Z00004")){
                $scope.customerDroletype='终端客户';
                customerDroletypenewvalue = 'Z00004';
            }else if(customerDroletypeold.includes("CRM000")){
                $scope.customerDroletype='正式客户';
                customerDroletypenewvalue = 'CRM000';
            }else if(customerDroletypeold.includes("CRM000")== false && customerDroletypeold.includes("BBP000") == true){
                $scope.customerDroletype='服务商';
                customerDroletypenewvalue = 'BBP000';
            };
        }
        if($scope.customerDroletype == "潜在客户" || $scope.customerDroletype == "正式客户" || $scope.customerDroletype == "终端客户"){
            //竞争对手领域
            $scope.customerDetailZzlyone = false;
            //份额
            $scope.customerDetailContains = false;
            //价格
            $scope.customerDetailPrice = false;
            //助销伙伴领域
            $scope.customerDetailZzlytwo = false;
            //长项
            $scope.customerDetailAdvatage = false;
            //项目
            $scope.customerDetailEvent = false;

        }else if($scope.customerDroletype == "竞争对手"){
            //付款方式
            $scope.customerDetailplayway = false;
            //付款日历
            $scope.customerDetailplaydate = false;
            //验收周期
            $scope.customerDetailcheckdate = false;
            //预验收周期
            $scope.customerDetailwillcheckdate = false;
            //助销伙伴领域
            $scope.customerDetailZzlytwo = false;
            //长项
            $scope.customerDetailAdvatage = false;
            //项目
            $scope.customerDetailEvent = false;

            //移动电话
            $scope.customerDetailmobilenum = false;

        }else if($scope.customerDroletype == "助销合作伙伴"){
            //付款方式
            $scope.customerDetailplayway = false;
            //付款日历
            $scope.customerDetailplaydate = false;
            //验收周期
            $scope.customerDetailcheckdate = false;
            //预验收周期
            $scope.customerDetailwillcheckdate = false;
            //竞争对手领域
            $scope.customerDetailZzlyone = false;
            //份额
            $scope.customerDetailContains = false;
            //价格
            $scope.customerDetailPrice = false;
            //移动电话
            $scope.customerDetailmobilenum = false;

        }else if($scope.customerDroletype == "服务商"){
            //付款方式
            $scope.customerDetailplayway = false;
            //付款日历
            $scope.customerDetailplaydate = false;
            //验收周期
            $scope.customerDetailcheckdate = false;
            //预验收周期
            $scope.customerDetailwillcheckdate = false;
        };
        if(ROOTCONFIG.hempConfig.baseEnvironment == 'ATL'){
            //竞争对手领域
            $scope.customerDetailZzlyone = false;
            //份额
            $scope.customerDetailContains = false;
            //价格
            $scope.customerDetailPrice = false;
            //助销伙伴领域
            $scope.customerDetailZzlytwo = false;
            //长项
            $scope.customerDetailAdvatage = false;
            //项目
            $scope.customerDetailEvent = false;
            if($scope.customerDroletype == "潜在客户" || $scope.customerDroletype == "正式客户"){
                //付款方式
                $scope.customerDetailplayway = true;
                //付款日历
                $scope.customerDetailplaydate = true;
            }else{
                //付款方式
                $scope.customerDetailplayway = false;
                //付款日历
                $scope.customerDetailplaydate = false;
            }
        }
            if(LoginService.getProfileType()=="APP_SERVICE"){
                $scope.customerDetailmobilenum = true;
                //竞争对手领域
                $scope.customerDetailZzlyone = false;
                //份额
                $scope.customerDetailContains = false;
                //价格
                $scope.customerDetailPrice = false;
                //助销伙伴领域
                $scope.customerDetailZzlytwo = false;
                //长项
                $scope.customerDetailAdvatage = false;
                //项目
                $scope.customerDetailEvent = false;
                $scope.web = false;
                //付款方式
                $scope.customerDetailplayway = false;
                //付款日历
                $scope.customerDetailplaydate = false;
                //验收周期
                $scope.customerDetailcheckdate = false;
                //预验收周期
                $scope.customerDetailwillcheckdate = false;
                $scope.fuzeEmp = false;
                $scope.remark = false;
                //代收人
                $scope.customerDetailnameco = false;
                //街道二
                $scope.customerDetailstrret = false;
                //街道三
                $scope.customerDetailstrreth = false;
            }
        else if (LoginService.getProfileType()=="APP_SALE"){
                //代收人
                $scope.customerDetailnameco = true;
                //街道二
                $scope.customerDetailstrret = true;
                //街道三
                $scope.customerDetailstrreth = true;
                $scope.customerDetailmobilenum = false;
                $scope.menNum = false;
            }
        Prompter.showLoading("数据加载中...");
        var url = ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_DETAIL';
        var data = {
            "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
            "IS_PARTNER": { "PARTNER": customeService.get_customerListvalue().PARTNER},
            "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName }
        };
            var startTime = new Date().getTime();
        HttpAppService.post(url, data).success(function (response) {
            //console.log(angular.toJson(response));
            Prompter.hideLoading();
            if (response.ES_RESULT.ZFLAG == 'E') {
                $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
            } else {
                customeService.set_customeFuZe(response);
                if(response.ET_OUT_DETAIL != ''){
                    $scope.customerdetails = response.ET_OUT_DETAIL.item[0];
                    var arr = $scope.customerdetails.PARTNER;
                    for(var i =0;i<arr.length;i++){
                        if(arr[i] != "0"){
                            $scope.customerdetails.PARTNER_ID = arr.substring(i,arr.length);
                            break;
                        }
                    }
                    //$scope.customerdetails.PARTNER_ID = parseInt($scope.customerdetails.PARTNER);
                    //console.log($scope.customerdetails.PARTNER_ID);
                     }
                if(response.ET_LINES != '' && response.ET_LINES.item){
                    $scope.customerdetails.TDLINE = response.ET_LINES.item[0].TDLINE;
                }
            }
        }).error(function(){
            Prompter.hideLoading();
            $cordovaToast.showShortBottom('请检查你的网络设备');
        });

           if(LoginService.getProfileType()=="APP_SERVICE"){
                   $scope.customer_detailstypes = [
                       {
                           typemane:'联系人',
                           imgurl:'img/customer/customerlianxir@2x.png',
                           url:'customerContactQuery'
                       },{
                           typemane:'工单',
                           imgurl:'img/customer/customergongd@2x.png',
                           url:'worksheetList'
                       },{
                           typemane:'车辆',
                           imgurl:'img/customer/customerchel@2x.png',
                           url:'customerVehicleQuery'
                       },{
                           typemane:'负责人',
                           imgurl:'img/customer/customerfuz@2x.png',
                           url:'customerFuZe'

                       }
                   ]
           }else if (LoginService.getProfileType()=="APP_SALE"){
               if(saleActService.isFromRelation == true){
                   $scope.customer_detailstypes = [{
                       typemane:'联系人',
                       imgurl:'img/customer/customerlianxir@2x.png',
                       url:'customerContactQuery'
                   },{
                       typemane:'负责人',
                       imgurl:'img/customer/customerfuz@2x.png',
                       url:'customerFuZe'
                   }];
               }else{
                   $scope.customer_detailstypes = [{
                       typemane:'联系人',
                       imgurl:'img/customer/customerlianxir@2x.png',
                       url:'customerContactQuery'
                   },{
                       typemane:'负责人',
                       imgurl:'img/customer/customerfuz@2x.png',
                       url:'customerFuZe'
                   },{
                       typemane:'机会',
                       imgurl:'img/customer/customerjihui@2x.png',
                       url:'saleChanList'
                   },{
                       typemane:'活动',
                       imgurl:'img/customer/customerhuod.png',
                       url:'saleActList'
                   }
                   ];
               }
               /*

               */
           } else{
               $scope.customer_detailstypes = [{
                   typemane:'联系人',
                   imgurl:'img/customer/customerlianxir@2x.png',
                   url:'customerContactQuery'
               },
               {
                   typemane:'机会',
                   imgurl:'img/customer/customerjihui@2x.png',
                   url:'saleChanList'
               },{
                   typemane:'活动',
                   imgurl:'img/customer/customerhuod.png',
                   url:'saleActList'
               },
               {
                   typemane:'工单',
                   imgurl:'img/customer/customergongd@2x.png',
                   url:'worksheetList'
               },
               //    {
               //    typemane:'线索',
               //    imgurl:'img/customer/customerxians@2x.png',
               //    url:'customerKeyQuery'
               //},
                   {
                   typemane:'车辆',
                   imgurl:'img/customer/customerchel@2x.png',
                   url:'customerVehicleQuery'
               },
               //    {
               //    typemane:'报价',
               //    imgurl:'img/customer/customerbaoj@2x.png'
               //},
               {
                   typemane:'负责人',
                   imgurl:'img/customer/customerfuz@2x.png',
                   url:'customerFuZe'
               }];

           }
            if(ROOTCONFIG.hempConfig.baseEnvironment == 'ATL' && (LoginService.getProfileType()=="APP_SALE")){
                $scope.customer_detailstypes = [{
                    typemane:'联系人',
                    imgurl:'img/customer/customerlianxir@2x.png',
                    url:'customerContactQuery'
                },{
                    typemane:'负责人',
                    imgurl:'img/customer/customerfuz@2x.png',
                    url:'customerFuZe'
                }];
            }

        $scope.gocustomerLists = function(cusvalue){
            if(cusvalue.url == "worksheetList" || cusvalue.url == "saleChanList" || cusvalue.url == "saleActList"){
                //从客户详情-进入各个详情界面
                var customerWorkorderdata = {
                    "PARTNER": $scope.customerdetails.PARTNER
                };
                customeService.set_customerWorkordervalue(customerWorkorderdata);
            }else if(cusvalue.url == "customerContactQuery"){
                customeService.set_customerEditServevalue( $scope.customerdetails);
            }
            $state.go(cusvalue.url);
        };
        //电话
        $scope.customershowphone =function(types){
            if(types == ''|| types == undefined) {
                $cordovaToast.showShortBottom('没有数据');
            }else{
                Prompter.showphone(types);
            }
        };

        //拨打电话手机
        $scope.customerdeatil_querynumber = function(data){
            var number = [];
            if(data.TEL_NUMBER == '' && data.TEL_EXTENS == ""){
                $cordovaToast.showShortBottom('没有数据');
            }else{
                if(data.TEL_NUMBER != ''){
                number.push({text: data.TEL_NUMBER});
                }
                if(data.TEL_EXTENS != ""){
                    number.push({text: data.TEL_EXTENS});
                }
                $ionicActionSheet.show({
                    buttons: number,
                    titleText: '拨打电话',
                    cancelText: '取消',
                    buttonClicked: function (index) {
                        if (index == 0) {
                            $window.location.href = "tel:" + data.TEL_NUMBER;
                            return true;
                        };
                        if (index == 1) {
                            $window.location.href = "tel:" + data.TEL_EXTENS;
                            return true;
                        }
                    }
                })
            };
        };
        //邮箱
        $scope.customermailcopyvalue = function(valuecopy){
            if(valuecopy == '' || valuecopy == undefined) {
                $cordovaToast.showShortBottom('没有数据');
            }else{
                Prompter.showpcopy(valuecopy)
            }
        };
        //打开浏览器
        $scope.customeropenbrser = function(Url){
            if(Url == '' || Url == undefined) {
                $cordovaToast.showShortBottom('没有数据');
            }else{
                Prompter.openbrserinfo(Url)
            }
        };
        //编辑  CustomerDeatilEditvalue()
        $scope.CustomerDeatilEditvalue = function(){
            var authInfo = LoginService.getAuthInfoByFunction(customerDroletypenewvalue);
            /*if(authInfo && authInfo.EDIT){
                customeService.set_customerEditServevalue( $scope.customerdetails);
                $state.go('customerEdit');
            }else{
                $cordovaToast.showShortBottom('没有权限编辑');
            }*/
            customeService.set_customerEditServevalue( $scope.customerdetails);
            $state.go('customerEdit');
        };

        ////广播编辑
        //$rootScope.$on('customerEditvalue', function(event, data) {
        //    $scope.customerdetails = customeService.get_customerEditServevalue();
        //});

    }])
    .controller('customerEditlCtrl',['$scope','$rootScope','$state','$http','$timeout','$cordovaToast','HttpAppService','$ionicPopover','customeService','Prompter','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading',function($scope,$rootScope,$state,$http,$timeout,$cordovaToast,HttpAppService,$ionicPopover,customeService,Prompter,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading){
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
        $scope.autoHeight = function(){
            var text = document.getElementById("textarea1");
            autoTextarea(text);// 调用
            //console.log('1');
        }
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
            //从新来
            //不允许修改
            NAME_ORG2:customeService.get_customerEditServevalue().NAME_ORG2,
            NAME_ORG3:customeService.get_customerEditServevalue().NAME_ORG3,
            NAME_ORG4:customeService.get_customerEditServevalue().NAME_ORG4,
            TEXT2:customeService.get_customerEditServevalue().TEXT2,
            CLD_DSC:customeService.get_customerEditServevalue().CLD_DSC,
            ZZACCEPTPERIOD:customeService.get_customerEditServevalue().ZZACCEPTPERIOD,
            URI_SRCH:customeService.get_customerEditServevalue().URI_SRCH,
            PARTNER_AUTO_COMPLETE:customeService.get_customerEditServevalue().PARTNER_AUTO_COMPLETE,
            PARTNER_NO:customeService.get_customerEditServevalue().PARTNER_NO,
            NAME_CO:customeService.get_customerEditServevalue().NAME_CO,
            STR_SUPPL1:customeService.get_customerEditServevalue().STR_SUPPL1,
            STR_SUPPL2:customeService.get_customerEditServevalue().STR_SUPPL2,
            SPTXT:customeService.get_customerEditServevalue().SPTXT,
            //可修改
            NAME_ORG1:customeService.get_customerEditServevalue().NAME_ORG1,
            TEL_NUMBER:customeService.get_customerEditServevalue().TEL_NUMBER,
            TEL_EXTENS:customeService.get_customerEditServevalue().TEL_EXTENS,
            MOB_NUMBER:customeService.get_customerEditServevalue().MOB_NUMBER,
            FAX_NUMBER:customeService.get_customerEditServevalue().FAX_NUMBER,
            FAX_EXTENS:customeService.get_customerEditServevalue().FAX_EXTENS,
            SMTP_ADDR:customeService.get_customerEditServevalue().SMTP_ADDR,
            LANDX:customeService.get_customerEditServevalue().LANDX,
            REGION:customeService.get_customerEditServevalue().REGION,
            CITY1:customeService.get_customerEditServevalue().CITY1,
            STREET:customeService.get_customerEditServevalue().STREET,
            HOUSE_NUM1:customeService.get_customerEditServevalue().HOUSE_NUM1,
            POST_CODE1:customeService.get_customerEditServevalue().POST_CODE1,
            TDLINE:customeService.get_customerEditServevalue().TDLINE
        };
        //console.log(customeService.get_customerEditServevalue());
        $scope.country=[];
        $scope.provence=[];
        $scope.city=[];
        $scope.countryCode="";
        $scope.Ctype="A";
        $scope.provenceCode="";

        $scope.config = {
            currentCountry: customeService.get_customerEditServevalue().COUNTRY,
            currentProvence:customeService.get_customerEditServevalue().REGION,
            currentCity:customeService.get_customerEditServevalue().CITY1
        };
        if($scope.config.currentCountry = ''){
            $scope.config.currentCountry = "CN";
        }
        $scope.cascade=function(){
            var url=ROOTCONFIG.hempConfig.basePath + "LIST_CITY";
            var data={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": window.localStorage.crmUserName },
                "I_COUNTRY": "",
                "I_MODE": "A",
                "I_REGION": ""
            };
            HttpAppService.post(url,data).success(function(response){
                $.each(response.ET_CITY.item, function (n, value) {
                    $scope.country.push(value);
                });
            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
            });
        };
        $scope.cascade1=function(){
            var url=ROOTCONFIG.hempConfig.basePath + "LIST_CITY";
            var data={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": window.localStorage.crmUserName },
                "I_COUNTRY": $scope.countryCode,
                "I_MODE": "B",
                "I_REGION": ""
            };
            HttpAppService.post(url,data).success(function(response){
                //console.log(response);
                $.each(response.ET_CITY.item, function (n, value) {
                    $scope.provence.push(value);
                })

            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
            });
        };
        $scope.cascade2=function(){
            var url= ROOTCONFIG.hempConfig.basePath + "LIST_CITY";
            var data={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": window.localStorage.crmUserName },
                "I_COUNTRY": $scope.countryCode,
                "I_MODE": "C",
                "I_REGION": $scope.provenceCode
            };
            HttpAppService.post(url,data).success(function(response){
                //console.log(response);
                if(response.ET_CITY.item.length===undefined){
                    $scope.city=new Array;
                }else{
                    $.each(response.ET_CITY.item, function (n, value) {
                        $scope.city.push(value);
                    })
                    for(var i=0;i<$scope.city.length;i++){
                        if($scope.city[i].CITY_NAME == customeService.get_customerEditServevalue().CITY1){
                            $scope.config.currentCity = $scope.city[i];
                        }
                    }
                    //console.log($scope.config.currentCity);
                }
            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
            });
        };
        $scope.cascade();
        $scope.changCountry=function(){
            $scope.provence=new Array;
            $scope.city=new Array;
            $scope.countryCode= $scope.config.currentCountry;
            //console.log($scope.country.COUNTRY);
            $scope.cascade1();
        };
        $scope.changProvence=function(){
            $scope.city=new Array;
            $scope.provenceCode=$scope.config.currentProvence;
            $scope.cascade2();
        };
        $scope.init=function(){
            $scope.country=new Array;
            $scope.provence=new Array;
            $scope.city=new Array;
        };
        if($scope.config.currentCountry == ""){
            $scope.config.currentCountry = "CN";
        }
        $scope.changCountry();
        if($scope.config.currentProvence != ""){
            $scope.changProvence();
        }

        $scope.customerKeepEditvalue = function(){
            //提交数据
            //提交修改数据
            Prompter.showLoading("数据保存中...");
            var url = ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_EDIT';
            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                "IS_ADDR": {
                    "STREET": "",//地址
                    "HOUSE_NUM1": "",//门牌号
                    "POST_CODE1": "",//youbian邮编
                    "CITY1": "",//chengshiming城市
                    "LANGU" : customeService.get_customerEditServevalue().LANGU,
                    "COUNTRY": $scope.config.currentCountry,//guojiabiaoshi国家
                    "REGION": $scope.config.currentProvence,//shifeibiaoshi省份
                    "TEL_NUMBER": "",//dianhua电话
                    "TEL_EXTENS": "",//dianhuafenji电话
                    "MOB_NUMBER": "",//yidongdianhua移动
                    "FAX_NUMBER": "",//chuanzhen
                    "FAX_EXTENS": "",//chuanzhenfenji
                    "SMTP_ADDR": ""//emial 邮箱
                },
                "IS_CUSTOMER": {
                    "NAME_ORG1": "",
                    "NAME_ORG2": "",
                    "NAME_ORG3": "",
                    "NAME_ORG4": "",
                    "BU_SORT1": "",
                    "BU_SORT2": ""
                },
                "IT_LINES" : {
                    "item": {
                        "TDFORMAT": "",
                        "TDLINE": ""//beizhu
                    }} ,
                "IS_PARTNER": { "PARTNER": customeService.get_customerEditServevalue().PARTNER }
            };
            if(data.IS_ADDR.LANGU == ''){
                data.IS_ADDR.LANGU = '1';
            }
            if($scope.config.currentCity == '' || $scope.config.currentCity == null || $scope.config.currentCity == undefined){
                $cordovaToast.showShortCenter('请输入城市');
                Prompter.hideLoading();
                return;
            }else{
                data.IS_ADDR.CITY1 =  $scope.config.currentCity.CITY_NAME;
            }
            if($scope.config.currentProvence == '' || $scope.config.currentProvence == null || $scope.config.currentProvence == undefined){
                $cordovaToast.showShortCenter('请输入城市');
                Prompter.hideLoading();
                return;
            }else{
                data.IS_ADDR.REGION =  $scope.config.currentProvence;
            }
            data.IT_LINES.item.TDLINE = $scope.customeredit.TDLINE;
            //data.IT_lINES.item.TDFORMAT = $scope.customeredit.TDLINE;
            data.IS_ADDR.STREET = $scope.customeredit.STREET;
            data.IS_ADDR.HOUSE_NUM1 = $scope.customeredit.HOUSE_NUM1;
            data.IS_ADDR.POST_CODE1 = $scope.customeredit.POST_CODE1;
            //data.IS_ADDR.CITY1 = $scope.customeredit.CITY1;
            //data.IS_ADDR.COUNTRY = $scope.customeredit.COUNTRY;
            //data.IS_ADDR.REGION = $scope.customeredit.REGION;
            data.IS_ADDR.TEL_NUMBER = $scope.customeredit.TEL_NUMBER;
            data.IS_ADDR.TEL_EXTENS = $scope.customeredit.TEL_EXTENS;
            data.IS_ADDR.MOB_NUMBER = $scope.customeredit.MOB_NUMBER;

            data.IS_ADDR.FAX_NUMBER = $scope.customeredit.FAX_NUMBER;
            data.IS_ADDR.FAX_EXTENS = $scope.customeredit.FAX_EXTENS;
            data.IS_ADDR.SMTP_ADDR = $scope.customeredit.SMTP_ADDR;
            data.IS_CUSTOMER.NAME_ORG1 = $scope.customeredit.NAME_ORG1;
            data.IS_CUSTOMER.NAME_ORG2 = $scope.customeredit.NAME_ORG2;
            data.IS_CUSTOMER.NAME_ORG3 = $scope.customeredit.NAME_ORG3;
            data.IS_CUSTOMER.NAME_ORG4 = $scope.customeredit.NAME_ORG4;
            data.IS_CUSTOMER.BEZEI = $scope.customeredit.BEZEI;

            //if(data.IS_CUSTOMER.NAME_LAST == ''|| data.IS_CUSTOMER.NAME_LAST == undefined || data.IS_CUSTOMER.PARTNER == ''|| data.IS_CUSTOMER.PARTNER == undefined){
            if(data.IS_ADDR.COUNTRY == ''|| data.IS_ADDR.COUNTRY == undefined){
                $cordovaToast.showShortCenter('请输入国家');
                //console.log("请输入客户姓名或标识");
                Prompter.hideLoading();
            } else{
                //console.log(angular.toJson(data));
                //console.log(angular.toJson(url));
                HttpAppService.post(url, data).success(function (response) {
                    Prompter.hideLoading();
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        //console.log(response.ES_RESULT.ZRESULT);
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                        //$state.go('ContactDetail');
                    } else {
                        //$cordovaToast.showShortCenter('保存数据成功');
                        //console.log("保存数据成功")
                        //广播修改详细信息界面的数据
                        customeService.set_customerEditServevalue($scope.customeredit);
                        //$rootScope.$broadcast('customerEditvalue');
                        $state.go('customerDetail');
                    }
                }).error(function(){
                    Prompter.hideLoading();
                    $cordovaToast.showShortBottom('请检查你的网络设备');
                });
            }
        };
        ////点击取消事件
        $scope.customerEditCancel = function(){
            Prompter.ContactCreateCancelvalue();
        }
        $scope.customerDeleteListener = function(cusid,cusimgid){
            setTimeout(function(){
                document.getElementById(cusid).addEventListener("keyup", function () {//监听密码输入框，如果有值显示一键清除按钮
                    if (this.value.length > 0) {
                        document.getElementById(cusimgid).style.display = "inline-block";
                    } else {
                        document.getElementById(cusimgid).style.display = "none";
                    }
                });
            },20)
        };
        $scope.customerDeleteListener('comrole','comroleimg');
        $scope.customerDeleteListener('customerpayway','compaywayimg');
        $scope.customerDeleteListener('cuspaydate','cuspaydateimg');
        $scope.customerDeleteListener('cuscheckpreid','cuscheckpreidimg');
        $scope.customerDeleteListener('cusfax','cusfaximg');
        $scope.customerDeleteListener('cusfaxext','cusfaxextimg');
        $scope.customerDeleteListener('cusstreetedit','cusstreeteditimg');
        $scope.customerDeleteListener('cusboraod','cusboraodimg');
        $scope.customerDeleteListener('cuspostall','cuspostallimg');
        $scope.customerDeleteListener('cuszhishiv','cuszhishivimg');


        //delete
        $scope.customerDeletevalue = function(type){
            switch (type) {
                case 'NAME_ORG1':
                    $scope.customeredit.NAME_ORG1 = '';
                    document.getElementById('comroleimg').style.display = "none";
                    break;
                case 'TEL_NUMBER':
                    $scope.customeredit.TEL_NUMBER = '';
                    document.getElementById('compaywayimg').style.display = "none";
                    break;
                case 'TEL_EXTENS':
                    $scope.customeredit.TEL_EXTENS = '';
                    document.getElementById('cuspaydateimg').style.display = "none";
                    break;
                case 'MOB_NUMBER':
                    $scope.customeredit.MOB_NUMBER = '';
                    document.getElementById('cuscheckpreidimg').style.display = "none";
                    break;
                case 'FAX_NUMBER':
                    $scope.customeredit.FAX_NUMBER = '';
                    document.getElementById('cusfaximg').style.display = "none";
                    break;
                case 'FAX_EXTENS':
                    $scope.customeredit.FAX_EXTENS = '';
                    document.getElementById('cusfaxextimg').style.display = "none";
                    break;
                case 'SMTP_ADDR':
                    $scope.customeredit.SMTP_ADDR = '';
                    document.getElementById('cusmailvalimg').style.display = "none";
                    break;
                case 'STREET':
                    $scope.customeredit.STREET = '';
                    document.getElementById('cusstreeteditimg').style.display = "none";
                    break;
                case 'HOUSE_NUM1':
                    $scope.customeredit.HOUSE_NUM1 = '';
                    document.getElementById('cusboraodimg').style.display = "none";
                    break;
                case 'POST_CODE1':
                    $scope.customeredit.POST_CODE1 = '';
                    document.getElementById('cuspostallimg').style.display = "none";
                    break;
                case 'BEZEI':
                    $scope.customeredit.BEZEI = '';
                    document.getElementById('cuszhishivimg').style.display = "none";
                    break;
            }
        }

    }])
