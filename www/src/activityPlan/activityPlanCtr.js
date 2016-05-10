/**
 * Created by admin on 16/5/1.
 */
activityPlanModule.controller('activityPlanListCtrl', ['$cordovaDialogs', '$ionicLoading', '$ionicHistory', 'worksheetDataService', '$rootScope', '$ionicScrollDelegate', '$http', '$cordovaToast', 'HttpAppService', '$scope', 'CarService', '$timeout', '$state', 'Prompter', 'activityPlanService',
    function ($cordovaDialogs, $ionicLoading, $ionicHistory, worksheetDataService, $rootScope, $ionicScrollDelegate, $http, $cordovaToast, HttpAppService, $scope, CarService, $timeout, $state, Prompter, activityPlanService) {
        $scope.cars = [];
        $scope.searchFlag = false;
        $scope.isSearch = false;
        $scope.carimisshow = false;
        $scope.carInfo = "";
        $scope.data = [];
        var page = 0;
        $scope.config = {
            changeData: false,
            backParameter: worksheetDataService.selectedCheLiang
        };
        $scope.search = function (x, e) {
            Prompter.showLoading('正在搜索');
            $scope.searchFlag = true;
            page = 0;
            $scope.carInfo = x;
            $scope.carLoadMore1Im();
        };
        $rootScope.$on('carCreatevalue1', function (event, data) {
            console.log("接收成功" + data);
            $scope.searchFlag = data;
            $scope.carInfo = "";
            $scope.cancelSearch();
        });
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam) {
            if (fromState && toState && fromState.name == 'worksheetDetail') {
                worksheetDataService.selectedCheLiang = "";
            }
        });

        $scope.carListHistoryval = function () {
            if (storedb('actdb').find().arrUniq() != undefined || storedb('actdb').find().arrUniq() != null) {
                $scope.data = (storedb('actdb').find().arrUniq());
                if ($scope.data.length > 5) {
                    $scope.data = $scope.data.slice(0, 5);
                }
            }

            if (JSON.parse(localStorage.getItem("oftenActdb")) != null || JSON.parse(localStorage.getItem("oftenActdb")) != undefined) {
                $scope.carList = JSON.parse(localStorage.getItem("oftenActdb"));
                //console.log($scope.spareList1.SHORT_TEXT);
                if ($scope.carList.length > 15) {
                    $scope.carList = $scope.carList.slice(0, 15);
                }
            } else {
                $scope.carList = [];
            }
        };
        $scope.carListHistoryval();


        $scope.carLoadMore1Im = function () {
            //$scope.spareimisshow = false;
            //console.log("第1步");
            page += 1;
            var url = ROOTCONFIG.hempConfig.basePath + 'VISIT_PLAN_LIST';
            var data = {
                "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_PAGE": {
                    "CURRPAGE": page,
                    "ITEMS": "10"
                },
                "IS_USER": {"BNAME": window.localStorage.crmUserName},
                "IS_VP": {
                    "TOURNUMBER": "",
                    "TOURDESCRIPTION": $scope.carInfo,
                    "VALIDFROM": "",
                    "VALIDTO": "",
                    "TOUROWNER_NAME": '',
                    "EDITABLE": ""
                }
            }
            //console.log(ROOTCONFIG.hempConfig.baseEnvironment);
            console.log(angular.toJson(data));
            HttpAppService.post(url, data).success(function (response) {
                console.log(angular.toJson(response));
                if (response.ES_RESULT.ZFLAG == 'E') {
                    $scope.carimisshow = false;
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } else if (response.ES_RESULT.ZFLAG == 'S') {
                    //console.log("第4步");
                    $ionicLoading.hide();
                    Prompter.hideLoading();
                    if (response.ET_VISIT_PLAN != '') {
                        if (response.ET_VISIT_PLAN.item.length == 0) {
                            $scope.carimisshow = false;
                            if (page == 1) {
                                $cordovaToast.showShortBottom('数据为空');
                            } else {
                                $cordovaToast.showShortBottom('没有更多数据了');
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        } else {
                            //console.log(angular.toJson((response.ET_PRODMAS_OUTPUT.item)));
                            $.each(response.ET_VISIT_PLAN.item, function (n, value) {
                                if ($scope.carInfo == "") {
                                    $scope.cars = new Array;
                                } else {
                                    $scope.cars.push(value);
                                }
                            });
                        }
                        if (response.ET_VISIT_PLAN.item.length < 10) {
                            if (page > 1) {
                                $cordovaToast.showShortBottom('没有更多数据了');
                            }
                        } else {
                            $scope.carimisshow = true;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                }
                $ionicScrollDelegate.resize();
            }).error(function (response, status, header, config) {
                var respTime = new Date().getTime() - startTime;
                Prompter.hideLoading();
                //超时之后返回的方法
                if (respTime >= config.timeout) {
                    //console.log('HTTP timeout');
                    if (ionic.Platform.isWebView()) {
                        $cordovaDialogs.alert('请求超时');
                    }
                }
                $ionicLoading.hide();
            });
        };
        //车辆列表接口
        $scope.initLoad = function () {
            page = 0;
            $scope.cars = new Array;
            $scope.carLoadMore1Im();
        };
        //页面跳转，并传递参数
        if (JSON.parse(localStorage.getItem("oftenActdb")) != null || JSON.parse(localStorage.getItem("oftenActdb")) != undefined) {
            $scope.oftenCarList = JSON.parse(localStorage.getItem("oftenActdb"));
        } else {
            $scope.oftenCarList = new Array;
        }
        $scope.goDetail = function (value) {
            var carIs = false;
            if ($scope.carInfo !== "") {
                if (storedb('actdb').find() !== null || storedb('actdb').find() !== undefined) {
                    var list = storedb('actdb').find();
                    for (var j = 0; j < list.length; j++) {
                        if (list[j].name == $scope.carInfo) {
                            storedb('actdb').remove({'name': list[j].name}, function (err) {
                                if (!err) {
                                } else {
                                    $cordovaToast.showShortBottom('历史记录保存失败');
                                }
                            });
                            storedb('actdb').insert({'name': $scope.carInfo}, function (err) {
                                if (!err) {
                                    console.log('历史记录保存成功')
                                } else {
                                    $cordovaToast.showShortBottom('历史记录保存失败');
                                }
                            });
                            carIs = true;
                        }
                    }
                    if (carIs === false) {
                        storedb('actdb').insert({'name': $scope.carInfo}, function (err) {
                            if (!err) {
                                console.log('历史记录保存成功')
                            } else {
                                $cordovaToast.showShortBottom('历史记录保存失败');
                            }
                        });
                    }
                }
            }
            //存储常用车辆
            if (JSON.parse(localStorage.getItem("oftenActdb")) != null || JSON.parse(localStorage.getItem("oftenActdb")) != undefined) {
                //判断是否有相同的值
                var carIsIn = true;
                for (var i = 0; i < $scope.oftenCarList.length; i++) {
                    console.log($scope.oftenCarList.length + 'car');

                    if ($scope.oftenCarList[i].ZBAR_CODE == value.ZBAR_CODE) {
                        //删除原有的，重新插入
                        $scope.oftenCarList = JSON.parse(localStorage.getItem("oftenActdb"));
                        $scope.oftenCarList.splice(i, 1);
                        $scope.oftenCarList.unshift(value);
                        localStorage['oftenActdb'] = JSON.stringify($scope.oftenCarList);
                        carIsIn = false;
                    }
                }
                if (carIsIn == true) {
                    $scope.oftenCarList.unshift(value);
                    localStorage['oftenActdb'] = JSON.stringify($scope.oftenCarList);
                }
            } else {
                $scope.oftenCarList.unshift(value);
                localStorage['oftenActdb'] = JSON.stringify($scope.oftenCarList);
            }

            activityPlanService.activityList = value.TOURNUMBER;
            $state.go('activityPlanDetail');


        };
        //取消按钮
        $scope.cancelSearch = function () {
            $scope.searchFlag = false;
            $scope.carInfo = '';
            $scope.cars = new Array;
            $scope.carListHistoryval();
            page = 0;
        };
        //显示搜索页面
        $scope.changePage = function () {
            $scope.searchFlag = true;

        };
        //清除输入框内的内容
        $scope.initSearch = function () {
            $scope.carInfo = '';
            //$timeout(function () {
            //    document.getElementById('searchId').focus();
            //}, 1)
        };
        $scope.creatActivity = function () {
            $state.go("activityPlanCreateHead");
        }
    }
])


activityPlanModule.controller('activityPlanDetailCtrl', ['$cordovaDialogs', '$ionicLoading', '$ionicHistory', 'worksheetDataService', '$rootScope', '$ionicScrollDelegate', '$http', '$cordovaToast', 'HttpAppService', '$scope', 'CarService', '$timeout', '$state', 'Prompter', 'activityPlanService',
    function ($cordovaDialogs, $ionicLoading, $ionicHistory, worksheetDataService, $rootScope, $ionicScrollDelegate, $http, $cordovaToast, HttpAppService, $scope, CarService, $timeout, $state, Prompter, activityPlanService) {
        var activityList = activityPlanService.activityList;
        var url = ROOTCONFIG.hempConfig.basePath + 'VISIT_PLAN_DETAIL';
        var data = {
            "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
            "IS_USER": {"BNAME": window.localStorage.crmUserName},
            "IS_VP": {"TOURNUMBER": activityList}
        }
        console.log(angular.toJson(data));
        //添加活动
        $scope.creatActivityGo = function () {
            console.log("11");
            activityPlanService.detail = $scope.activityDetail;
            $state.go("activityPlanCreate");
        }
        Prompter.showLoading("正在加载");
        HttpAppService.post(url, data).success(function (response) {
            console.log(response);
            Prompter.hideLoading();
            if (response.ES_RESULT.ZFLAG == 'S') {
                $scope.activityDetail = response;
                var arr = $scope.activityDetail.ES_VISIT_PLAN.TOURNUMBER;
                for(var i =0;i<arr.length;i++){
                    if(arr[i] != "0"){
                        $scope.PARTNER_ID = arr.substring(i,arr.length);
                    }
                }
                $scope.details = response.ET_TRAVEL_PLAN.item;
                for(vari=0;i<$scope.details.length;i++){
                    $scope.details.otherInfos = false;
                }
            } else if (response.ES_RESULT.ZFLAG == 'E') {
                $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
            } else {

            }
        }).error(function (response, status, header, config) {
            var respTime = new Date().getTime() - startTime;
            Prompter.hideLoading();
            //超时之后返回的方法
            if (respTime >= config.timeout) {
                //console.log('HTTP timeout');
                if (ionic.Platform.isWebView()) {
                    $cordovaDialogs.alert('请求超时');
                }
            } else {
                $cordovaToast.showShortBottom("访问失败");
            }
            $ionicLoading.hide();
        });
        $scope.showOther = function(item){
            item.otherInfos = ! item.otherInfos;
        };
        $scope.edit = function(){
            $state.go("activityPlanCreateHead");
        };
    }]);

activityPlanModule.controller('activityPlanCreateHeadCtrl', ['$cordovaDialogs', '$ionicLoading', '$ionicHistory', 'worksheetDataService', '$rootScope', '$ionicScrollDelegate', '$http', '$cordovaToast', 'HttpAppService', '$scope', 'CarService', '$timeout', '$state', 'Prompter', 'activityPlanService','$ionicModal',
    function ($cordovaDialogs, $ionicLoading, $ionicHistory, worksheetDataService, $rootScope, $ionicScrollDelegate, $http, $cordovaToast, HttpAppService, $scope, CarService, $timeout, $state, Prompter, activityPlanService,$ionicModal) {
        $scope.dataDetail = {
            instart : "2013-11-11",
            inend : "2016-11-11",
            saleOffice :{
                flag : "N",
                SALES_OFF_TXT : "请选择销售办事处"
            },
            remark : ""
        };
        $scope.contentLength = function(item){
            if(item.length == 40){
                $cordovaToast.showShortBottom("计划描述已到达40个字符");
            }
        }
        $scope.keepData = function(){
            if($scope.dataDetail.instart == "" || $scope.dataDetail.inend ==""){
                $cordovaToast.showShortBottom("请选择有效期");
                return;
            }
            if($scope.dataDetail.remark == ''){
                $cordovaToast.showShortBottom("请填写计划描述");
                return;
            }
            if($scope.dataDetail.saleOffice.flag == "N"){
                $cordovaToast.showShortBottom("请选择销售办事处");
                return;
            }
            $ionicLoading.show("正在保存");
            var data ={
                "IS_USER": { "BNAME": window.localStorage.crmUserName },
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_ORGMAN": {
                    "SALES_OFFICE": $scope.dataDetail.saleOffice.SALES_OFFICE,
                    "SALES_GROUP": $scope.dataDetail.saleOffice.SALES_GROUP
                },
                "IS_VISIT_PLAN": {
                    "DESCRIPTION": $scope.dataDetail.remark,
                    "VALIDFROM": $scope.dataDetail.instart,
                    "VALIDTO": $scope.dataDetail.inend,
                    "STATUS": ""
                },
                "T_TRAVEL_PLAN": {
                }
            }
            HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'VISIT_PLAN_CREATE', data)
                .success(function (response) {
                    $ionicLoading.hide();
                    console.log(response);
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        activityPlanService.activityList = response.ES_VISIT_PLAN.VISIT_ID;
                        activityPlanService.pageFlag = "Y";
                        $state.go("activityPlanDetail");
                    }else{
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    }
                }).error(function (response, status, header, config) {
                    var respTime = new Date().getTime() - startTime;
                    //超时之后返回的方法
                    if (respTime >= config.timeout) {
                        if (ionic.Platform.isWebView()) {
                            //$cordovaDialogs.alert('请求超时');
                        }
                    } else {
                        $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                    }
                    $ionicLoading.hide();
                });
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
                    }
                    ;

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
                }
                ;
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                    if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                    } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'hidden';
                    }
                    ;
                    style.height = height + extra + 'px';
                    scrollTop += parseInt(style.height) - elem.currHeight;
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                    elem.currHeight = parseInt(style.height);
                }
                ;
            };

            addEvent('propertychange', change);
            addEvent('input', change);
            addEvent('focus', change);
            change();
        };
        var text = document.getElementById("textarea");
        autoTextarea(text);// 调用
        //选择时间
        $scope.pickDate = function (type) {
            if (device.platform === 'android' || device.platform === 'Android') {
                $scope.androidPickDate(type);
            } else {
                $scope.iosPickDate(type);
            }
        };
        $scope.iosPickDate = function (type) {
            var dateTime = "";
            var options = {
                date: new Date(),
                mode: 'date'
            };
            datePicker.show(options, function (date) {
                dateTime = date.format('yyyyMMdd ');
                $scope.inputDatePicker(type, dateTime);
            });
        };
        $scope.androidPickDate = function (type) {
            var pickDate = "";
            var options1 = {
                date: new Date(),
                mode: 'date'
            };
            datePicker.show(options1, function (date) {
                pickDate = date.format('yyyyMMdd');
                $scope.inputDatePicker(type, pickDate);
            });
        };
        //根据INPUT里面的参数赋值
        $scope.inputDatePicker = function (type, dateTime) {

            if ("instart" === type) {
                $scope.dataDetail.remark = dateTime;
            }
            if ("inend" === type) {
                $scope.dateEnd = dateTime;
            }

            if (!$scope.$$phrese) {
                $scope.$apply();
            }
        };
        //选择销售办事处和销售组
        var conPage = 1;
        $scope.conArr = [];
        $scope.conSearch = false;
        $scope.getConArr = function (search) {
            $scope.ConLoadMoreFlag = false;
            if (search) {
                $scope.conSearch = false;
                conPage = 1;
            } else {
                $scope.spinnerFlagOffice = true;
            }
            var data ={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": window.localStorage.crmUserName }
            };
            var startTime = new Date().getTime();
            HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ORGMAN', data)
                .success(function (response) {
                    console.log(response);
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        $scope.conArr = response.ET_ORGMAN.item;
                        $scope.spinnerFlagOffice = false;
                        $scope.conSearch = true;
                        $scope.ConLoadMoreFlag = true;
                        $ionicScrollDelegate.resize();
                        $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    }else{
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    }
                }).error(function (response, status, header, config) {
                    var respTime = new Date().getTime() - startTime;
                    //超时之后返回的方法
                    if (respTime >= config.timeout) {
                        if (ionic.Platform.isWebView()) {
                            $cordovaDialogs.alert('请求超时');
                        }
                    } else {
                        $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                    }
                    $ionicLoading.hide();
                });
            ;
        };

        $ionicModal.fromTemplateUrl('src/activityPlan/model/selectOffice_Modal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function (modal) {
            $scope.selectContactModal = modal;
        });
        $scope.selectContactText = '销售办事处';
        $scope.openSelectCon = function () {
            $scope.isDropShow = true;
            $scope.conSearch = true;
            $scope.getConArr();
            $scope.selectContactModal.show();
        };
        $scope.closeSelectCon = function () {
            $scope.selectContactModal.hide();
        };
        $scope.selectPop = function (x) {
            console.log(x);
            $scope.selectContactText = x.text;
            $scope.referMoreflag = !$scope.referMoreflag;
        };
        $scope.showChancePop = function () {
            $scope.referMoreflag = true;
            $scope.isDropShow = true;
        };
        $scope.initConSearch = function () {
            $scope.input.con = '';
            $timeout(function () {
                document.getElementById('selectConId').focus();
            }, 1)
        };
        $scope.selectCon = function (x) {
            console.log(x);
            $scope.dataDetail.saleOffice = x;
            $scope.selectContactModal.hide();
        }
    }]);

activityPlanModule.controller('activityPlanCreateCtrl', ['$cordovaDialogs', '$ionicLoading', '$ionicHistory', 'worksheetDataService', '$rootScope', '$ionicScrollDelegate', '$http', '$cordovaToast', 'HttpAppService', '$scope', 'CarService', '$timeout', '$state', 'Prompter',
    'activityPlanService','LoginService','$ionicModal','saleActService',
    function ($cordovaDialogs, $ionicLoading, $ionicHistory, worksheetDataService, $rootScope, $ionicScrollDelegate, $http, $cordovaToast, HttpAppService, $scope, CarService, $timeout, $state, Prompter, activityPlanService,LoginService,$ionicModal,saleActService) {
        $scope.config = {};
        $scope.dataDetail = {
            customer: {
                NAME_ORG1 : "请选择客户"
            },
            contact: {
                NAME_LAST : "请选择联系人"
            },
            business: {
                DESCRIPTION : "请选择商机"
            },
            acttype: {
                desc : "请选择活动类型"
            },
            urgency : {
                desc : "请选择活动紧急度"
            },
            instart: "2012-11-11",
            desc: ""
        }

        //选择客户
        $scope.selectCustomerText = '客户';
        var customerPage = 1;
        $scope.customerArr = [];
        $scope.customerSearch = false;
        $scope.input = {customer: ''};
        var customerType = "";
        //if (ROOTCONFIG.hempConfig.baseEnvironment == 'CATL') {
        //    if (LoginService.getProfileType() == "APP_SALE") {
        //        customerType = 'CRM000';
        //    }
        //    if (LoginService.getProfileType() == "APP_SERVICE") {
        //        customerType = 'Z00004';
        //    }
        //} else {
        //    customerType = 'CRM000';
        //}

        $scope.getCustomerArr = function (search) {
            $scope.isError = false;
            if (search) {
                $scope.customerArr = [];
                $scope.customerSearch = false;
                customerPage = 1;
            } else {
                $scope.spinnerFlag = true;
            }
            var data = {
                "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_PAGE": {
                    "CURRPAGE": customerPage++,
                    "ITEMS": "10"
                },
                "IS_SEARCH": {"SEARCH": $scope.input.customer},
                "IS_AUTHORITY": {"BNAME": window.localStorage.crmUserName},
                "IT_IN_ROLE": {
                }
            };
            console.log(angular.toJson(data));
            HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST', data)
                .success(function (response, status, headers, config) {
                    if (config.data.IS_SEARCH.SEARCH != $scope.input.customer) {
                        return;
                    }
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        if (search) {
                            $scope.customerArr = response.ET_OUT_LIST.item;
                        } else {
                            $scope.customerArr = $scope.customerArr.concat(response.ET_OUT_LIST.item);
                        }
                        $scope.spinnerFlag = false;
                        $scope.customerSearch = true;
                        $scope.CustomerLoadMoreFlag = true;
                        if (response.ET_OUT_LIST.item.length < 10) {
                            $scope.spinnerFlag = false;
                            $scope.customerSearch = false;
                        }
                        $ionicScrollDelegate.resize();
                        //saleActService.customerArr = $scope.customerArr;
                        $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        $scope.spinnerFlag = false;
                        $scope.customerSearch = false;
                        $scope.isError = true;
                        Prompter.showShortToastBotton(response.ES_RESULT.ZRESULT);
                    }
                }).error(function (response, status, header, config) {
                    var respTime = new Date().getTime() - startTime;
                    Prompter.hideLoading();
                    //超时之后返回的方法
                    if (respTime >= config.timeout) {
                        //console.log('HTTP timeout');
                        if (ionic.Platform.isWebView()) {
                            $cordovaDialogs.alert('请求超时');
                        }
                    }
                    $ionicLoading.hide();
                });
        };
        //选择客户Modal
        $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/selectCustomer_Modal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function (modal) {
            $scope.selectCustomerModal = modal;
        });
        //if (ROOTCONFIG.hempConfig.baseEnvironment == 'CATL') {
        //    if (LoginService.getProfileType() == "APP_SALE") {
        //        $scope.customerModalArr = new Array();
        //        $scope.customerModalArr = saleActService.getCustomerTypes();
        //        $scope.selectCustomerText = '正式客户';
        //    }
        //    if (LoginService.getProfileType() == "APP_SERVICE") {
        //        $scope.customerModalArr = new Array();
        //        $scope.customerModalArr = saleActService.getServiceCustomer();
        //        $scope.selectCustomerText = '终端客户';
        //    }
        //}
        //if (ROOTCONFIG.hempConfig.baseEnvironment == 'ATL') {
        //    $scope.customerModalArr = new Array();
        //    $scope.customerModalArr = saleActService.getATLCustomer();
        //    $scope.selectCustomerText = '正式客户';
        //}

        $scope.openSelectCustomer = function () {
            $scope.isDropShow = true;
            $scope.customerSearch = true;
            $scope.selectCustomerModal.show();
        };
        $scope.closeSelectCustomer = function () {
            $scope.selectCustomerModal.hide();
        };
        $scope.selectPop = function (x) {
            $scope.selectCustomerText = x.text;
            customerType = x.code;
            $scope.getCustomerArr('search');
            $scope.referMoreflag = !$scope.referMoreflag;
        };
        $scope.changeReferMoreflag = function () {
            $scope.referMoreflag = !$scope.referMoreflag;
        };
        $scope.showChancePop = function () {
            $scope.referMoreflag = true;
            $scope.isDropShow = true;
        };
        $scope.initCustomerSearch = function () {
            $scope.input.customer = '';
            //$scope.getCustomerArr();
            $timeout(function () {
                document.getElementById('selectCustomerId').focus();
            }, 1)
        };
        $scope.selectCustomer = function (x) {
            console.log(x);
            $scope.dataDetail.customer = x;
            //console.log(x.PARTNER);

            //$scope.create.contact='';
            //contactPage = 1;
            //$scope.contacts = [];
            $scope.contactsLoadMoreFlag = true;
            //$scope.getContacts();
            $scope.selectCustomerModal.hide();

        };

        //选择联系人
        var conPage = 1;
        $scope.conArr = [];
        $scope.conSearch = false;
        $scope.getConArr = function (search) {
            $scope.ConLoadMoreFlag = false;
            if (search) {
                $scope.conSearch = false;
                conPage = 1;
            } else {
                $scope.spinnerFlagCon = true;
            }
            var data = {
                "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_AUTHORITY": {"BNAME": window.localStorage.crmUserName},
                "IS_PAGE": {
                    "CURRPAGE": conPage++,
                    "ITEMS": "10"
                },
                "IS_PARTNER": {"PARTNER": ""},
                "IS_SEARCH": {"SEARCH": search}
            };
            var startTime = new Date().getTime();
            HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST', data)
                .success(function (response) {
                    if (data.IS_SEARCH.SEARCH != $scope.input.customer) {
                        return;
                    }
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        if (response.ET_OUT_LIST.item.length < 10) {
                            $scope.ConLoadMoreFlag = false;
                        }
                        if (search) {
                            $scope.conArr = response.ET_OUT_LIST.item;
                        } else {
                            $scope.conArr = $scope.conArr.concat(response.ET_OUT_LIST.item);
                        }
                        $scope.spinnerFlagCon = false;
                        $scope.conSearch = true;
                        $scope.ConLoadMoreFlag = true;
                        $ionicScrollDelegate.resize();
                        $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    }
                }).error(function (response, status, header, config) {
                    var respTime = new Date().getTime() - startTime;
                    //超时之后返回的方法
                    if (respTime >= config.timeout) {
                        if (ionic.Platform.isWebView()) {
                            $cordovaDialogs.alert('请求超时');
                        }
                    } else {
                        $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                    }
                    $ionicLoading.hide();
                });
            ;
        };

        $ionicModal.fromTemplateUrl('src/activityPlan/model/selectContacts_Modal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function (modal) {
            $scope.selectContactModal = modal;
        });
        $scope.selectContactText = '联系人';
        $scope.openSelectCon = function () {
            $scope.isDropShow = true;
            $scope.conSearch = true;
            $scope.input.customer = '';
            $scope.selectContactModal.show();
        };
        $scope.closeSelectCon = function () {
            $scope.selectContactModal.hide();
        };
        $scope.selectPop = function (x) {
            console.log(x);
            $scope.selectContactText = x.text;
            $scope.referMoreflag = !$scope.referMoreflag;
        };
        $scope.showChancePop = function () {
            $scope.referMoreflag = true;
            $scope.isDropShow = true;
        };
        $scope.initConSearch = function () {
            $scope.input.con = '';
            $timeout(function () {
                document.getElementById('selectConId').focus();
            }, 1)
        };
        $scope.selectCon = function (x) {
            console.log(x);
            $scope.dataDetail.contact = x;
            $scope.selectContactModal.hide();
        }


        //选择商机
        var changePage = 1;
        $scope.changeArr = [];
        $scope.changeSearch = false;
        $scope.getChangeArr = function (search) {
            console.log("--");
            $scope.changeLoadMoreFlag = false;
            if (search) {
                $scope.changeSearch = false;
                changePage = 1;
            } else {
                $scope.spinnerFlagChange = true;
            }
            var data = {
                "IS_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_USER": {"BNAME": window.localStorage.crmUserName},
                "IS_PAGE": {
                    "CURRPAGE": changePage++,
                    "ITEMS": "10"
                },
                "IS_SEARCH": {
                    "ZSRTING": search,
                    "PARTNER_NO": "",
                    "OBJECT_ID": "",
                    "PHASE": "",
                    "STARTDATE": "",
                    "STATUS": ""
                }
            };
            console.log(data);
            var startTime = new Date().getTime();
            HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'OPPORT_LIST', data)
                .success(function (response) {
                    if (data.IS_SEARCH.ZSRTING != $scope.input.customer) {
                        return;
                    }
                    console.log(response);
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        if (response.ET_OPPORT.item.length < 10) {
                            $scope.changeLoadMoreFlag = false;
                        }
                        if (search) {
                            $scope.changeArr = response.ET_OPPORT.item;
                        } else {
                            $scope.changeArr = $scope.changeArr.concat(response.ET_OPPORT.item);
                        }
                        $scope.spinnerFlagChange = false;
                        $scope.changeSearch = true;
                        $scope.changeLoadMoreFlag = true;
                        $ionicScrollDelegate.resize();
                        $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    }
                }).error(function (response, status, header, config) {
                    var respTime = new Date().getTime() - startTime;
                    //超时之后返回的方法
                    if (respTime >= config.timeout) {
                        if (ionic.Platform.isWebView()) {
                            $cordovaDialogs.alert('请求超时');
                        }
                    } else {
                        $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                    }
                    $ionicLoading.hide();
                });
            ;
        };

        $ionicModal.fromTemplateUrl('src/activityPlan/model/selectChange_Modal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function (modal) {
            $scope.selectChangetactModal = modal;
        });
        $scope.selectChangeText = '商机';
        $scope.openSelectChange = function () {
            $scope.isDropShow = true;
            $scope.changeSearch = true;
            $scope.input.customer ='';
            $scope.selectChangetactModal.show();
        };
        $scope.closeSelectChange = function () {
            $scope.selectChangetactModal.hide();
        };
        $scope.selectPop = function (x) {
            console.log(x);
            $scope.selectChangeText = x.text;
            $scope.referMoreflag = !$scope.referMoreflag;
        };
        $scope.showChancePop = function () {
            $scope.referMoreflag = true;
            $scope.isDropShow = true;
        };
        $scope.initChangeSearch = function () {
            $scope.input.change = '';
            $timeout(function () {
                document.getElementById('selectChangeId').focus();
            }, 1)
        };
        $scope.selectChange = function (x) {
            console.log(x);
            $scope.dataDetail.business = x;
            $scope.selectChangetactModal.hide();
        }

        //选择活动类型
        $ionicModal.fromTemplateUrl('src/activityPlan/model/selectType_Modal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function (modal) {
            $scope.selectTypeModal = modal;
        });
        $scope.selectTypeText = '活动类型';
        if(ROOTCONFIG.hempConfig.baseEnvironment == 'CATL'){
            $scope.typeArr = [{
                code : "ZA01",
                desc : "商务洽谈"
             },{
                    code : "ZA02",
                    desc : "客情交流"
                },{
                code : "ZA03",
                desc : "项目推进"
            },{
                code : "ZA04",
                desc : "内部事务"
            },{
                code : "ZA05",
                desc : "来访接待"
            },{
                code : "ZA06",
                desc : "市场营销"
            }];
        }else{
            $scope.typeArr = [{
                code : "ZA01",
                desc : "技术交流"
            },{
                code : "ZA02",
                desc : "业务交流"
            },{
                code : "ZA03",
                desc : "关系维护"
            },{
                code : "ZA04",
                desc : "事务性活动"
            }];
        }
        $scope.openSelectType = function () {
            $scope.isDropShow = true;
            $scope.changeSearch = true;
            $scope.input.customer ='';
            $scope.selectTypeModal.show();
        };
        $scope.closeSelectType = function () {
            $scope.selectTypeModal.hide();
        };
        $scope.selectType = function (x) {
            console.log(x);
            $scope.dataDetail.acttype = x;
            $scope.selectTypeModal.hide();
        }
        //选择活动紧急度
        $ionicModal.fromTemplateUrl('src/activityPlan/model/selectUrgency_Modal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function (modal) {
            $scope.selectUrgencyModal = modal;
        });
        $scope.selectUrgencyText = '活动紧急度';

        if(ROOTCONFIG.hempConfig.baseEnvironment == 'CATL'){
            $scope.urgency = true;
            $scope.urgencyArr = [{
                code : "01",
                desc : "需领导支持"
            },{
                code : "02",
                desc : "重要紧急"
            },{
                code : "03",
                desc : "重要不紧急"
            },{
                code : "04",
                desc : "紧急不重要"
            },{
                code : "05",
                desc : "普通事项"
            }];
        }else{
            $scope.urgency = false;
        }
        $scope.openSelectUrgency = function () {
            $scope.isDropShow = true;
            $scope.changeSearch = true;
            $scope.input.customer ='';
            $scope.selectUrgencyModal.show();
        };
        $scope.closeSelectUrgency = function () {
            $scope.selectUrgencyModal.hide();
        };
        $scope.selectUrgency = function (x) {
            console.log(x);
            $scope.dataDetail.urgency = x;
            $scope.selectUrgencyModal.hide();
        }
        //选择时间
        $scope.pickDate = function (type) {
            if (device.platform === 'android' || device.platform === 'Android') {
                $scope.androidPickDate(type);
            } else {
                $scope.iosPickDate(type);
            }
        };
        $scope.iosPickDate = function (type) {
            var dateTime = "";
            var options = {
                date: new Date(),
                mode: 'date'
            };
            datePicker.show(options, function (date) {
                dateTime = date.format('yyyyMMdd ');
                $scope.inputDatePicker(type, dateTime);
            });
        };
        $scope.androidPickDate = function (type) {
            var pickDate = "";
            var options1 = {
                date: new Date(),
                mode: 'date'
            };
            datePicker.show(options1, function (date) {
                pickDate = date.format('yyyyMMdd');
                $scope.inputDatePicker(type, pickDate);
            });
        };
        //根据INPUT里面的参数赋值
        $scope.inputDatePicker = function (type, dateTime) {

            if ("instart" === type) {
                $scope.dataDetail.remark = dateTime;
            }
            if ("inend" === type) {
                $scope.dateEnd = dateTime;
            }

            if (!$scope.$$phrese) {
                $scope.$apply();
            }
        };
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
                    }
                    ;

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
                }
                ;
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                    if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                    } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'hidden';
                    }
                    ;
                    style.height = height + extra + 'px';
                    scrollTop += parseInt(style.height) - elem.currHeight;
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                    elem.currHeight = parseInt(style.height);
                }
                ;
            };

            addEvent('propertychange', change);
            addEvent('input', change);
            addEvent('focus', change);
            change();
        };
        var text = document.getElementById("textarea");
        autoTextarea(text);// 调用
        $scope.confirm = function(){
            var detail = activityPlanService.detail;
            console.log(detail);
            console.log($scope.dataDetail);
            var urlUpdate = ROOTCONFIG.hempConfig.basePath + 'VISIT_PLAN_CHANGE';
            var dataUpdate = {
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": window.localStorage.crmUserName },
                "IS_VISIT_PLAN": {
                    "VISIT_ID": detail.ES_VISIT_PLAN.TOURNUMBER,
                    "DESCRIPTION": detail.ES_VISIT_PLAN.TOURDESCRIPTION,
                    "RESPON_PERSON": detail.ES_VISIT_PLAN.TOUROWNER_NAME,
                    "VALIDFROM": detail.ES_VISIT_PLAN.VALIDFROM,
                    "VALIDTO": detail.ES_VISIT_PLAN.VALIDTO,
                    "STATUS": ""
                },
                "IT_TRAVEL_PLAN": {
                    "item": {
                        "MODE": "",
                        "ZZNO": "",
                        "ZZCUSNO": $scope.dataDetail.customer.PARTNER,
                        "ZZCONNO": $scope.dataDetail.contact.PARTNER,
                        "ZZBEGDA":  $scope.dataDetail.instart,
                        "ZZACTTYPE":  $scope.dataDetail.acttype.code,
                        "ZZACTDESC": $scope.dataDetail.desc,
                        "ZZOPPOID": $scope.dataDetail.business.OBJECT_ID,
                        "ZZACTID": "",
                        "ZZHDJJD":  $scope.dataDetail.urgency.code
                    }
                }
            }
            console.log(dataUpdate);
            Prompter.showLoading("正在提交");
            HttpAppService.post(urlUpdate, dataUpdate).success(function (response) {
                console.log(response);
                Prompter.hideLoading();
                if (response.ES_RESULT.ZFLAG == 'S') {
                    $cordovaToast.showShortBottom("活动计划创建成功");
                } else if (response.ES_RESULT.ZFLAG == 'E') {
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                } else {

                }
            }).error(function (response, status, header, config) {
                var respTime = new Date().getTime() - startTime;
                Prompter.hideLoading();
                //超时之后返回的方法
                if (respTime >= config.timeout) {
                    //console.log('HTTP timeout');
                    if (ionic.Platform.isWebView()) {
                        $cordovaDialogs.alert('请求超时');
                    }
                } else {
                    $cordovaToast.showShortBottom("访问失败");
                }
                $ionicLoading.hide();
            });
        }
    }]);