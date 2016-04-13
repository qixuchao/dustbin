/**
 * Created by zhangren on 16/3/7.
 */
customerModule
    .controller('customerQueryCtrl',['$scope','$rootScope','$state','$http','HttpAppService','$timeout','$cordovaToast','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading',function($scope,$rootScope,$state,$http,HttpAppService,$timeout,$cordovaToast,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading){
        $ionicPopover.fromTemplateUrl('src/customer/model/customer_selec.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.customerpopover = popover;
        });
        $scope.customerPopover = function() {
            $scope.customerpopover.show();
        };
        $scope.customerPopoverhide = function() {
            $scope.customerpopover.hide();
        };

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
        $rootScope.$on('customerdeatillist', function(event, data) {
            //返回初始化
            $scope.customerisshow = false;
            //删除请求
            $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST')
            $scope.customerQuery_list = [];
            $scope.customerQuery_list = new Array;
            $scope.customerPage = 0;

            $scope.customer.customerfiledvalue ='';
            $scope.CustomerHisGetvaluehis();
        });
        //查询
        //初始化查询参数
        $scope.customerselecttyperole = '';
        $scope.customerQuery_list = [];
        $scope.customerQuery_list = new Array;
        $scope.customerPage = 0;
        $scope.customerLoadmore = function() {
            //$scope.contactisshow = true;
            $scope.customerPage = $scope.customerPage + 1;
            var url = ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST';
            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_PAGE": {
                    "CURRPAGE": $scope.customerPage,
                    "ITEMS": "10"
                },
                "IS_SEARCH": { "SEARCH": ""},
                "IT_IN_ROLE": { "RLTYP":$scope.customerselecttyperole
                }
            };
            //var data = data2;
            console.log("data"+angular.toJson(data));
            console.log("name"+angular.toJson(data.IS_SEARCH.SEARCH));
            console.log("number"+angular.toJson(data.IS_PAGE.CURRPAGE));
            HttpAppService.post(url, data).success(function (response) {
                if (response.ES_RESULT.ZFLAG == 'E') {
                    $scope.customerisshow = false;
                    //$cordovaToast.showShortCenter(response.ES_RESULT.ZRESULT);
                    $cordovaToast.showShortCenter("没有符合搜索条件的数据")
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
                                $.each(response.ET_OUT_LIST.item, function (n, value) {
                                    $scope.customerQuery_list.push(value);
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
            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
                $scope.customerisshow = false;
            });
        }
        //实时搜索
        //实时搜索变量初始化一次flag
        $scope.customer ={customerfiledvalue :''};
        var customertimer;
        setTimeout(function(){
            document.getElementById('customerqueryinput').style.display = "none";
            document.getElementById('customerinputvalueid').addEventListener("keyup", function () {//监听密码输入框，如果有值显示一键清除按钮
                if(!$scope.$$phase) {
                    $scope.$apply();
                };
                $scope.contactisshow = false;
                clearTimeout(customertimer);
                customertimer = setTimeout(function() {
                    if (document.getElementById('customerinputvalueid').value.length > 0) {
                        document.getElementById('customerqueryinput').style.display = "inline-block";
                        $scope.$apply(function(){
                            $scope.customerisshow = false;
                            //删除请求
                            $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST')
                            $scope.customerQuery_list = [];
                            $scope.customerQuery_list = new Array;
                            $scope.customerPage = 0;
                        });
                        $scope.customer_queryflag = true;
                        $ionicScrollDelegate.resize();
                        $scope.customerisshow = true;
                        //if(!$scope.$$phase) {
                        //    $scope.$apply();
                        //};
                    } else {
                        //删除请求
                        $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST');
                        $scope.customer_queryflag = false;
                        $scope.customerisshow = false;
                        $scope.customerQuery_list = [];
                        $scope.customerPage = 0;
                        if(!$scope.$$phase) {
                            $scope.$apply();
                        };
                        $ionicScrollDelegate.resize();
                        document.getElementById('customerqueryinput').style.display = "none";

                    }
                }, 500);

            });
        },50);
        $scope.customeriputDeletevalue = function(){
            $scope.customer.customerfiledvalue ='';
        };


        $scope.customerSelectTypeGet = function(){
            ////改变角色的参数
            //$scope.$apply(function(){
            //    $scope.customerisshow = false;
            //    //删除请求
            //    $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST')
            //    $scope.customerQuery_list = [];
            //    $scope.customerQuery_list = new Array;
            //    $scope.customerPage = 0;
            //});
            //$scope.customer_queryflag = true;
            //$ionicScrollDelegate.resize();
            //$scope.customerisshow = true;
            //if(!$scope.$$phase) {
            //    $scope.$apply();
            //};
            //$scope.customerselecttyperole = '';
        }

        //清除历史记录
        $scope.CustomerClearhis = function(){
            storedb('customerdb').remove();
            $scope.customer_query_historylists = [];
        };
        //点击历史记录开始请求
        $scope.CustomerHisGetvalue = function(value){
            $scope.customer.customerfiledvalue = value.name;
            $scope.customerQuery_list = [];
            $scope.customerQuery_list = new Array;
            $scope.customerPage = 0;
            $scope.customer_queryflag = true;
            $ionicScrollDelegate.resize();
            $scope.customerisshow = true;
            if(!$scope.$$phase) {
                $scope.$apply();
            };
        };

        //跳转detail界面
        //$scope.customergodeatil = function(cusvalue){
        //    customeService.set_customerListvalue(cusvalue);
        //    $state.go("customerDetail");
        //}
        $scope.customerhislistvalue = new Array;
        $scope.customergodeatil = function(x){
            $scope.customerisshow = false;
            $scope.usuallycustomerlist = x;
            console.log(x)
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

                            })
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
                            console.log('历史记录保存成功')
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

            //contactService.set_ContactsListvalue(x);
            $state.go('customerDetail');
        };

        //判断是ATL还是CATL
        if(ROOTCONFIG.hempConfig.baseEnvironment == 'CATL'){
            $scope.customer_types = ['潜在客户','正式客户','竞争对手','助销伙伴','终端客户','服务供应商'];
        }else{
            $scope.customer_types = ['潜在客户','正式客户','竞争对手','服务供应商'];
        }

        $scope.customerqueryTypeunit = "常用客户";
        $scope.employbasiclineflag = true;
        $scope.customerqueryType = function(type){
            $scope.customerqueryTypeunit = type;
            if(type == "服务供应商"){
                $scope.employbasiclineflag = false;
            }else{
                $scope.employbasiclineflag = true;
            };
            //改变参数
            if(ROOTCONFIG.hempConfig.baseEnvironment == 'CATL'){
                switch (type) {
                    case '潜在客户':
                        $scope.customerselecttyperole = 'Z00001';
                        break;
                    case '正式客户':
                        $scope.customerselecttyperole = 'CRM000';
                        break;
                    case '竞争对手':
                        $scope.customerselecttyperole = 'Z00002';
                        break;
                    case '助销伙伴':
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
                switch (type) {
                    case '潜在客户':
                        $scope.customerselecttyperole = 'ZATL';
                        break;
                    case '正式客户':
                        $scope.customerselecttyperole = 'CRM000';
                        break;
                    case '竞争对手':
                        $scope.customerselecttyperole = 'ZATL05';
                        break;
                    case '助销伙伴':
                        $scope.customerselecttyperole = 'ZATL06';
                        break;
                }
            }
            //改变角色的参数
            //$scope.$apply(function(){
                $scope.customerisshow = false;
                //删除请求
                $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST')
                $scope.customerQuery_list = [];
                $scope.customerQuery_list = new Array;
                $scope.customerPage = 0;
                $scope.customer_queryflag = true;
                $ionicScrollDelegate.resize();
                $scope.customerLoadmore()
                $scope.customerisshow = true;
            $scope.customerPopoverhide();
        };

        //跳转detail界面
        //$scope.customergodeatil = function(cusvalue){
        //    customeService.set_customerListvalue(cusvalue);
        //    $state.go("customerDetail");
        //}
    }])
    .controller('customerDetailCtrl',['$scope','$rootScope','$ionicHistory','$state','Prompter','$timeout','$ionicLoading','$cordovaInAppBrowser','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','customeService','$window','$ionicActionSheet',function($scope,$rootScope,$ionicHistory,$state,Prompter,$timeout,$ionicLoading,$cordovaInAppBrowser,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,customeService,$window,$ionicActionSheet){
        //customeService.get_customerListvalue().PARTNER;
        ////返回回退
        $scope.CustomergoBack = function() {
            $rootScope.$broadcast('customerdeatillist');
            $ionicHistory.goBack();
        }

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
            url:'worksheetList'
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
            if(cusvalue.url){

                //从客户详情-工单进入服务工单界面
                if(cusvalue.url == 'customerWorkorderQuery'){
                    var customerWorkorderdata = {
                        "PARTNER": "0000101186",
                        "STATE":'customerDetail'
                    };
                    customeService.set_customerWorkordervalue(customerWorkorderdata);
                }
                $state.go(cusvalue.url);
            }
        };
        //$scope.customer_showTitle = false;
        //$scope.customer_showtarnsitionTitle = false;
        //$scope.customer_TitleFlag=false;
        //var customer_position;
        //$scope.customer_onScroll = function () {
        //    customer_position = $ionicScrollDelegate.getScrollPosition().top;
        //    if (customer_position > 15) {
        //        $scope.customer_TitleFlag=true;
        //        $scope.customer_showTitle = true;
        //        if (customer_position >25) {
        //            $scope.customer_customerFlag = true;
        //        }else{
        //            $scope.customer_customerFlag = false;
        //        };
        //        if (customer_position > 40) {
        //            $scope.customer_placeFlag = true;
        //        }else{
        //            $scope.customer_placeFlag = false;
        //        };
        //        if (customer_position >60) {
        //            $scope.customer_typeFlag = true;
        //        }else{
        //            $scope.customer_typeFlag = false;
        //        };
        //        if (customer_position >95) {
        //            $scope.customer_showTitle = false;
        //            $scope.customer_showtarnsitionTitle = true;
        //        }else{
        //            $scope.customer_showTitle = true;
        //            $scope.customer_showtarnsitionTitle = false;
        //        };
        //
        //    } else {
        //        $scope.customer_TitleFlag = false;
        //        $scope.customer_showTitle = false;
        //        $scope.customer_customerFlag = false;
        //        $scope.customer_placeFlag = false;
        //        $scope.ecustomer_typeFlag = false;
        //        $scope.customer_showtarnsitionTitle = false;
        //    }
        //    //if (!$scope.$digest()) {
        //        $scope.$apply();
        //    //}
        //};

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

        };
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
        $scope.customerDeleteListener('cuswillcheckpreid','cuswillcheckpreidimg');
        $scope.customerDeleteListener('cusfax','cusfaximg');
        $scope.customerDeleteListener('cusmailval','cusmailvalimg');
        $scope.customerDeleteListener('cuswebsite','cuswebsiteimg');

        $scope.customerDeleteListener('cuspostall','cuspostallimg');
        $scope.customerDeleteListener('cusboraod','cusboraodimg');
        $scope.customerDeleteListener('cuszhishiv','cuszhishivimg');


        //delete
        $scope.customerDeletevalue = function(type){
            switch (type) {
                case 'customerposition':
                    $scope.customeredit.customerposition = '';
                    document.getElementById('comroleimg').style.display = "none";
                    break;
                case 'customerpayway':
                    $scope.customeredit.customerpayway = '';
                    document.getElementById('compaywayimg').style.display = "none";
                    break;
                case 'customerpaydate':
                    $scope.customeredit.customerpaydate = '';
                    document.getElementById('cuspaydateimg').style.display = "none";
                    break;
                case 'customercheckperiod':
                    $scope.customeredit.customercheckperiod = '';
                    document.getElementById('cuscheckpreidimg').style.display = "none";
                    break;
                case 'customerwillcheckperiod':
                    $scope.customeredit.customerwillcheckperiod = '';
                    document.getElementById('cuswillcheckpreidimg').style.display = "none";
                    break;
                case 'customerfax':
                    $scope.customeredit.customerfax = '';
                    document.getElementById('cusfaximg').style.display = "none";
                    break;
                case 'customermail':
                    $scope.customeredit.customermail = '';
                    document.getElementById('cusmailvalimg').style.display = "none";
                    break;
                case 'customerwebsite':
                    $scope.customeredit.customerwebsite = '';
                    document.getElementById('cuswebsiteimg').style.display = "none";
                    break;
                case 'customerborad':
                    $scope.customeredit.customerborad = '';
                    document.getElementById('cusboraodimg').style.display = "none";
                    break;
                case 'customerpostal':
                    $scope.customeredit.customerpostal = '';
                    document.getElementById('cuspostallimg').style.display = "none";
                    break;
                case 'customerzhushi':
                    $scope.customeredit.customerzhushi = '';
                    document.getElementById('cuszhishivimg').style.display = "none";
                    break;
            }
        }

    }])
