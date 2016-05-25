/**
 * Created by think on 2016/5/23.
 */
saleQuoteModule.controller('saleQuoteListCtrl',['$cordovaDialogs','$ionicActionSheet','$window','$scope','$state','$http','HttpAppService','$rootScope','$timeout','$cordovaToast','$ionicScrollDelegate','ionicMaterialInk','employeeService','Prompter','$ionicLoading','saleQuoteService',
        function($cordovaDialogs,$ionicActionSheet,$window,$scope,$state,$http,HttpAppService,$rootScope,$timeout,$cordovaToast,$ionicScrollDelegate,ionicMaterialInk,employeeService,Prompter,$ionicLoading,saleQuoteService){
            $scope.searchFlag=false;
            $scope.employ={
                employeefiledvalue:''
            };
            $scope.EmployeeListHistoryval = function(){
                $scope.employee_userqueryflag = false;
                if(storedb('saleQuteUsedb').find() != undefined || storedb('saleQuteUsedb').find() != null){
                    $scope.employee_query_historylists = (storedb('saleQuteUsedb').find());
                    if ($scope.employee_query_historylists.length > 5) {
                        $scope.employee_query_historylists = $scope.employee_query_historylists.slice(0, 5);
                    };
                };

                //常用联系人显示
                if (JSON.parse(localStorage.getItem("saleQuotedb")) != null || JSON.parse(localStorage.getItem("saleQuotedb")) != undefined) {
                    $scope.usuaemployee_query_list = JSON.parse(localStorage.getItem("saleQuotedb"));

                    if ($scope.usuaemployee_query_list.length > 15) {
                        $scope.usuaemployee_query_list = $scope.usuaemployee_query_list.slice(0, 15);
                    }
                } else {
                    $scope.usuaemployee_query_list = [];
                }
            };
            $scope.EmployeeListHistoryval();
            //广播修改界面显示flag
            $rootScope.$on('employeedeatillist', function(event, data) {
                //数据初始化
                //删除请求
                $http['delete'](ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST');
                $scope.employee_userqueryflag = false;
                $scope.employisshow = false;
                $scope.employee_query_list = [];
                $scope.empitemPage = 0;
                $scope.employ.employeefiledvalue ='';
                $scope.EmployeeListHistoryval();
            });

            //获取数据列表函数
            $scope.employLoadmore = function(){
                //$scope.employisshow = true;
                $scope.empitemPage += 1;
                var url = ROOTCONFIG.hempConfig.basePath + 'QUOTATION_LIST_GET';
                var data = {
                    "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_USER": { "BNAME":  window.localStorage.crmUserName  },
                    "IS_PAGE": {
                        "CURRPAGE": $scope.empitemPage,
                        "ITEMS": "10"
                    },
                    "IS_SEARCH": {
                        "SEARCH": $scope.employ.employeefiledvalue,
                        "PROCESS_TYPE": "",
                        "STATUS": ""
                    },
                };
                //console.log("data"+angular.toJson(data));
                //console.log("name"+angular.toJson(data.IS_EMPLOYEE.NAME));
                //console.log("number"+angular.toJson(data.IS_PAGE.CURRPAGE));
                var startTime=new Date().getTime();
                HttpAppService.post(url, data).success(function (response) {
                    if(data.IS_SEARCH.SEARCH!=$scope.employ.employeefiledvalue){
                        return ;
                    }
                    if (response.ES_RESULT.ZFLAG == 'S') {
                        if(response.ET_OUT_LIST != '') {
                            if (response.ET_OUT_LIST.item_out.length == 0) {
                                $scope.employisshow = false;
                                Prompter.hideLoading();
                                if ($scope.empitemPage == 1) {
                                    $cordovaToast.showShortBottom('数据为空');
                                } else {
                                    $cordovaToast.showShortBottom('没有更多数据');
                                }
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            } else {
                                //console.log(angular.toJson((response.ET_EMPLOYEE.item)));
                                $.each(response.ET_OUT_LIST.item_out, function (n, value) {
                                    if($scope.employ.employeefiledvalue===""){
                                        $scope.employee_query_list=new Array;
                                    }else{
                                        $scope.employee_query_list.push(value);
                                    }

                                });
                            }
                            if (response.ET_OUT_LIST.item_out.length < 10) {
                                $scope.employisshow = false;
                                if ($scope.empitemPage > 1) {
                                    //console.log("没有更多数据了");
                                    $cordovaToast.showShortBottom('没有更多数据');
                                }
                            } else {
                                $scope.employisshow = true;
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }else{
                            $cordovaToast.showShortBottom('搜索数据为空');
                        }

                    }else if (response.ES_RESULT.ZFLAG == 'E') {
                        $scope.employisshow = false;
                        $cordovaToast.showShortCenter('无符合条件数据');
                    }
                }).error(function (response, status, header, config) {
                    var respTime = new Date().getTime() - startTime;
                    Prompter.hideLoading();
                    //超时之后返回的方法
                    if(respTime >= config.timeout){
                        //console.log('HTTP timeout');
                        if(ionic.Platform.isWebView()){
                            //$cordovaDialogs.alert('请求超时');
                        }
                    }
                    $ionicLoading.hide();
                });
            };
            //input输入框监听
            //实时搜索
            $scope.initLoad=function(){
                //$http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST');
                $scope.empitemPage = 0;
                $scope.employee_query_list=new Array;
                Prompter.showLoading("正在加载");
                $scope.employLoadmore();
            };
            $scope.search = function (x, e){
                Prompter.showLoading('正在搜索');
                $scope.searchFlag=true;
                $scope.employ.employeefiledvalue = x;
                $scope.empitemPage = 0;
                $scope.initLoad();
            };
            $scope.cancelSearch=function(){
                $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST')
                $scope.searchFlag=false;
                $scope.employ.employeefiledvalue = '';
                $scope.employee_query_list=new Array;
                $scope.EmployeeListHistoryval();
                //$scope.conitemImPage=0;
            };
            //显示搜索页面
            $scope.changePage=function(){
                $scope.searchFlag=true;
            };
            $rootScope.$on('employeeBack',function(event, data) {
                //console.log("接收成功" + data);
                $scope.searchFlag = data;
                $scope.employ.employeefiledvalue = "";
                $scope.cancelSearch();
            });
            //清除输入框内的内容
            $scope.initSearch = function () {
                $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST')
                $scope.employ.employeefiledvalue = '';
                $scope.empitemPage=0;
                $scope.employee_query_list=new Array;
                Prompter.showLoading("正在加载")
                $scope.employLoadmore();
            };

            //清除历史记录
            $scope.employeeiputDeletevalue = function(){
                $http['delete'](ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST');
                $scope.employee_userqueryflag = false;
                $scope.employisshow = false;
                $scope.employee_query_list = [];
                $scope.empitemPage = 0;
                $scope.employ.employeefiledvalue = '';

            };
            $scope.employee_userClearhis = function(){
                storedb('saleQuotedb').remove();
                $scope.employee_query_historylists = [];
            };
            //$scope.employee_userClearhis();
            //点击历史记录开始请求
            $scope.EmployHisGetvalue = function(value){
                $scope.employ.employeefiledvalue = value.name;
                $scope.employee_query_list = [];
                $scope.employee_query_list = new Array;
                $scope.empitemPage = 0;
                $scope.employee_userqueryflag = true;
                $ionicScrollDelegate.resize();
                $scope.employisshow = true;
                if(!$scope.$$phase) {
                    $scope.$apply();
                };
            };
            //拨打电话
            $scope.employeequeryphone = function(data){
                //console.log(angular.toJson(data));
                //console.log(data.TEL_NUMBER);
                if((data.TEL_NUMBER==undefined) && (data.MOB_NUMBER==undefined)){
                    $cordovaToast.showShortBottom('无号码');
                }else{
                    var number=[];
                    if(data.TEL_NUMBER!==undefined){
                        number.push({text:data.TEL_NUMBER});
                        //console.log(number);
                    }
                    if(data.MOB_NUMBER!==undefined){
                        number.push({text:data.MOB_NUMBER});
                        //console.log(number);
                    }

                    $ionicActionSheet.show({
                        buttons:number,
                        titleText: '拨打电话',
                        cancelText: '取消',
                        buttonClicked: function (index) {
                            if (index == 0) {
                                $window.location.href = "tel:" + data.TEL_NUMBER;
                                return true;
                            };
                            if (index == 1) {
                                $window.location.href = "tel:" + data.MOB_NUMBER;
                                return true;
                            }
                        }
                    })
                }
            };
            //进入详细界面传递标识
            //初始化本地数据
            if (JSON.parse(localStorage.getItem("saleQuotedb")) != null || JSON.parse(localStorage.getItem("saleQuotedb")) != undefined) {
                $scope.employeehislistvalue = JSON.parse(localStorage.getItem("saleQuotedb"));
            }else{
                $scope.employeehislistvalue = new Array;
            }

            $scope.employee_govalue = function(value){
                $scope.employisshow = false;
                $scope.usuallyemployeelist = value;
                //存储历史记录

                //存储历史记录
                if($scope.employ.employeefiledvalue != ''){
                    if(storedb('saleQuteUsedb').find() != undefined || storedb('saleQuteUsedb').find() != null){
                        var employeehislistvalue = storedb('saleQuteUsedb').find();
                        var employeehislistvaluelength = storedb('saleQuteUsedb').find().length;
                        //判断是否有相同的值
                        var emplyeehislistflag = true;
                        for(var i=0;i<employeehislistvaluelength;i++){
                            if(employeehislistvalue[i].name ==  $scope.employ.employeefiledvalue) {
                                //删除原有的，重新插入
                                storedb('saleQuteUsedb').remove({"name":employeehislistvalue[i].name}, function (err) {
                                    if (!err) {
                                    } else {
                                    }

                                })
                                storedb('saleQuteUsedb').insert({"name": $scope.employ.employeefiledvalue}, function (err) {
                                    if (!err) {
                                    } else {
                                        $cordovaToast.showShortBottom('历史记录保存失败');
                                    }
                                });
                                emplyeehislistflag = false;
                            }
                        };
                        if(emplyeehislistflag == true){
                            storedb('saleQuteUsedb').insert({"name": $scope.employ.employeefiledvalue}, function (err) {
                                if (!err) {
                                } else {
                                    $cordovaToast.showShortBottom('历史记录保存失败');
                                }
                            });
                        }
                    }else{
                        storedb('saleQuteUsedb').insert({"name": $scope.employ.employeefiledvalue}, function (err) {
                            if (!err) {
                            } else {
                                $cordovaToast.showShortBottom('历史记录保存失败');
                            }
                        });
                    };
                };


                //存储常用联系人
                if (JSON.parse(localStorage.getItem("saleQuotedb")) != null || JSON.parse(localStorage.getItem("saleQuotedb")) != undefined) {
                    //判断是否有相同的值
                    var usuaemployhislistflag = true;
                    console.log($scope.employeehislistvalue);
                    for(var i=0;i<$scope.employeehislistvalue.length;i++){
                        if($scope.employeehislistvalue[i].OBJECT_ID == $scope.usuallyemployeelist.OBJECT_ID) {
                            //删除原有的，重新插入
                            $scope.employeehislistvalue = JSON.parse(localStorage.getItem("saleQuotedb"));
                            $scope.employeehislistvalue.splice(i,1);
                            $scope.employeehislistvalue.unshift($scope.usuallyemployeelist);
                            console.log($scope.employeehislistvalue);
                            localStorage['saleQuotedb'] = JSON.stringify( $scope.employeehislistvalue);
                            usuaemployhislistflag = false;
                        }
                    };
                    if(usuaemployhislistflag == true){
                        console.log($scope.employeehislistvalue);
                        $scope.employeehislistvalue.unshift($scope.usuallyemployeelist);
                        localStorage['saleQuotedb'] = JSON.stringify( $scope.employeehislistvalue);
                    }

                }else{
                    console.log($scope.employeehislistvalue);
                    $scope.employeehislistvalue.unshift($scope.usuallyemployeelist);
                    console.log($scope.employeehislistvalue);
                    localStorage['saleQuotedb'] = JSON.stringify( $scope.employeehislistvalue);
                    console.log(localStorage['saleQuotedb']);
                };
                saleQuoteService.saleQuoteList = value;
                console.log(saleQuoteService.saleQuoteList);
                $state.go('saleQuoteDetail');
            }
        }])

.controller('saleQuoteDetailCtrl',['$cordovaDialogs','$ionicActionSheet','$window','$scope','$state','$http','HttpAppService','$rootScope','$timeout','$cordovaToast','$ionicScrollDelegate','ionicMaterialInk','employeeService','Prompter','$ionicLoading','saleQuoteService',
    function($cordovaDialogs,$ionicActionSheet,$window,$scope,$state,$http,HttpAppService,$rootScope,$timeout,$cordovaToast,$ionicScrollDelegate,ionicMaterialInk,employeeService,Prompter,$ionicLoading,saleQuoteService){
        $scope.scrollLists = [
            {
                name : "报价明细",
                id : 1,
                colorFlag : true,
            },
            {
                name : "竞争对手",
                id : 2,
                colorFlag : false,
            },
            {
                id : 3,
                name : "项目信息",
                colorFlag : false,
            },
            {
                id : 4,
                name : "客户性质",
                colorFlag : false,
            },
            {
                id : 5,
                name : "其他因素",
                colorFlag : false,
            }
        ];
        $scope.config = {
            detail : true,
            competitors : false,
            projectInfos : false,
            costomerNature : false,
            others : false
        };
        $scope.showContent = function(item) {
            $scope.config = {
                detail : false,
                competitors : false,
                projectInfos : false,
                costomerNature : false,
                others : false
            };
            for (var i = 0; i < $scope.scrollLists.length; i++) {
                $scope.scrollLists[i].colorFlag = false;
            }
            item.colorFlag = true;
            if (item.id == 1) {
                $scope.config.detail = true;
            } else if (item.id == 2) {
                $scope.config.competitors = true;
            } else if (item.id == 3) {
                $scope.config.projectInfos = true;
            } else if (item.id == 4) {
                $scope.config.costomerNature = true;
            } else if (item.id == 5) {
                $scope.config.others = true;
            }
        };
        $scope.goOthers = function(item){
            if(item == 'project'){
                saleQuoteService.projectInfos = $scope.saleQuoteDetail;
                $state.go('saleQuoteProjectList');
            }else  if(item == 'related'){
                saleQuoteService.projectInfos = $scope.saleQuoteDetail;
                $state.go('saleQuoteRelated');
            }else  if(item == 'remark'){
                saleQuoteService.projectInfos = $scope.saleQuoteDetail;
                $state.go('saleQuoteRemark');
            }
        }
        var saleQuoteList = saleQuoteService.saleQuoteList;
        $scope.showDetailSaleQuote=function(){
            Prompter.showLoading('正在加载');
            var url = ROOTCONFIG.hempConfig.basePath + 'QUOTATION_GET_DEATIL';
            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME":  window.localStorage.crmUserName  },
                "IS_PARTNER": { "PARTNER": saleQuoteList.OBJECT_ID}
                //"IS_PARTNER": { "PARTNER": '25000125'}
            };
            var startTime=new Date().getTime();
            HttpAppService.post(url, data).success(function (response) {
                if (response.ES_RESULT.ZFLAG == 'S') {
                    $scope.saleQuoteDetail = response;
                    console.log($scope.saleQuoteDetail.ES_OUT_QUOT.OBJECT_ID);
                    Prompter.hideLoading();
                }else if (response.ES_RESULT.ZFLAG == 'E') {
                    Prompter.hideLoading();
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                }
            }).error(function(){
                Prompter.hideLoading();
                var respTime = new Date().getTime() - startTime;
                Prompter.hideLoading();
                //超时之后返回的方法
                if(respTime >= config.timeout){
                    //console.log('HTTP timeout');
                    if(ionic.Platform.isWebView()){
                        //$cordovaDialogs.alert('请求超时');
                    }
                }
                $ionicLoading.hide();
            });
        };
        $scope.showDetailSaleQuote();
    }])
//25000125
.controller('saleQuoteProjectCtrl',['$cordovaDialogs','$ionicActionSheet','$window','$scope','$state','$http','HttpAppService','$rootScope','$timeout','$cordovaToast','$ionicScrollDelegate','ionicMaterialInk','employeeService','Prompter','$ionicLoading','saleQuoteService',
    function($cordovaDialogs,$ionicActionSheet,$window,$scope,$state,$http,HttpAppService,$rootScope,$timeout,$cordovaToast,$ionicScrollDelegate,ionicMaterialInk,employeeService,Prompter,$ionicLoading,saleQuoteService){
        $scope.projectInfosDetail=saleQuoteService.projectInfosDetail;
        if(saleQuoteService.projectInfos.ET_OUT_PRI_ITEM==''){
            var projectInfosPrice='';
        }else{
            var projectInfosPrice=saleQuoteService.projectInfos.ET_OUT_PRI_ITEM.item_out;
        }
        for(var i=0;i<projectInfosPrice.length;i++){

        }
        $scope.projectLists = [
            {
                name : "项目明细",
                id : 1,
                colorFlag : true,
            },
            {
                name : "客户属性",
                id : 2,
                colorFlag : false,
            },
            {
                id : 3,
                name : "物料属性",
                colorFlag : false,
            },
            {
                id : 4,
                name : "其他属性",
                colorFlag : false,
            },
            {
                id : 5,
                name : "价格明细",
                colorFlag : false,
            }
        ];
        $scope.config = {
            project : true,
            customer : false,
            materials : false,
            others : false,
            price : false
        };
        $scope.showContent = function(item) {
            $scope.config = {
                project : false,
                customer : false,
                materials : false,
                others : false,
                price : false
            };
            for (var i = 0; i < $scope.projectLists.length; i++) {
                $scope.projectLists[i].colorFlag = false;
            }
            item.colorFlag = true;
            if (item.id == 1) {
                $scope.config.project = true;
            } else if (item.id == 2) {
                $scope.config.customer = true;
            } else if (item.id == 3) {
                $scope.config.materials = true;
            } else if (item.id == 4) {
                $scope.config.others = true;
            } else if (item.id == 5) {
                $scope.config.price = true;
            }
        };
    }])
.controller('saleQuoteProjectListCtrl',['$cordovaDialogs','$ionicActionSheet','$window','$scope','$state','$http','HttpAppService','$rootScope','$timeout','$cordovaToast','$ionicScrollDelegate','ionicMaterialInk','employeeService','Prompter','$ionicLoading','saleQuoteService',
    function($cordovaDialogs,$ionicActionSheet,$window,$scope,$state,$http,HttpAppService,$rootScope,$timeout,$cordovaToast,$ionicScrollDelegate,ionicMaterialInk,employeeService,Prompter,$ionicLoading,saleQuoteService){
        if(saleQuoteService.projectInfos.ET_OUT_ITEM==''){
            $scope.projectInfosList='';
            $cordovaToast.showShortBottom('暂无内容');
        }else{
            $scope.projectInfosList=saleQuoteService.projectInfos.ET_OUT_ITEM.item_out;
        }
        $scope.goProjectDetail = function(value){
            saleQuoteService.projectInfosDetail=value;
            $state.go('saleQuoteProject');
        }
    }])
    //相关方
.controller('saleQuoteRelatedCtrl',['$cordovaDialogs','$ionicActionSheet','$window','$scope','$state','$http','HttpAppService','$rootScope','$timeout','$cordovaToast','$ionicScrollDelegate','ionicMaterialInk','employeeService','Prompter','$ionicLoading','saleQuoteService',
    function($cordovaDialogs,$ionicActionSheet,$window,$scope,$state,$http,HttpAppService,$rootScope,$timeout,$cordovaToast,$ionicScrollDelegate,ionicMaterialInk,employeeService,Prompter,$ionicLoading,saleQuoteService){
        if(saleQuoteService.projectInfos.ET_OUT_REAL==''){
            $scope.relatedInfos='';
            $cordovaToast.showShortBottom('暂无内容');
        }else{
            $scope.relatedInfos=saleQuoteService.projectInfos.ET_OUT_REAL.item_out;
        }
    }])
    //zhushi
.controller('saleQuoteRelatedCtrl',['$cordovaDialogs','$ionicActionSheet','$window','$scope','$state','$http','HttpAppService','$rootScope','$timeout','$cordovaToast','$ionicScrollDelegate','ionicMaterialInk','employeeService','Prompter','$ionicLoading','saleQuoteService',
    function($cordovaDialogs,$ionicActionSheet,$window,$scope,$state,$http,HttpAppService,$rootScope,$timeout,$cordovaToast,$ionicScrollDelegate,ionicMaterialInk,employeeService,Prompter,$ionicLoading,saleQuoteService){
        console.log(saleQuoteService.projectInfos);
        console.log('132132');
        if(saleQuoteService.projectInfos.ET_LINES==''){
            $scope.remarkInfos='';
            $cordovaToast.showShortBottom('暂无内容');
        }else{
            $scope.remarkInfos=saleQuoteService.projectInfos.ET_LINES.item_out;
        }
    }]);