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
                    "TOURDESCRIPTION": "",
                    "VALIDFROM": "",
                    "VALIDTO": "",
                    "TOUROWNER_NAME": $scope.carInfo
                }
            }
            //console.log(ROOTCONFIG.hempConfig.baseEnvironment);
            //console.log($scope.carInfo);
            HttpAppService.post(url, data).success(function (response) {
                console.log(page);
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

            activityPlanService.activityList = value;
            console.log(value);
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
            $state.go("activityPlanCreate");
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
            "IS_VP": {"TOURNUMBER": activityList.TOURNUMBER}
        }
        console.log(data);
        Prompter.showLoading("正在加载");
        HttpAppService.post(url, data).success(function (response) {
            Prompter.hideLoading();
            if (response.ES_RESULT.ZFLAG == 'S') {
                $scope.activityDetail = response.ES_VISIT_PLAN;
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
    }]);

activityPlanModule.controller('activityPlanEditCtrl', ['$cordovaDialogs', '$ionicLoading', '$ionicHistory', 'worksheetDataService', '$rootScope', '$ionicScrollDelegate', '$http', '$cordovaToast', 'HttpAppService', '$scope', 'CarService', '$timeout', '$state', 'Prompter', 'activityPlanService',
    function ($cordovaDialogs, $ionicLoading, $ionicHistory, worksheetDataService, $rootScope, $ionicScrollDelegate, $http, $cordovaToast, HttpAppService, $scope, CarService, $timeout, $state, Prompter, activityPlanService) {

    }]);

activityPlanModule.controller('activityPlanCreateCtrl', ['$cordovaDialogs', '$ionicLoading', '$ionicHistory', 'worksheetDataService', '$rootScope', '$ionicScrollDelegate', '$http', '$cordovaToast', 'HttpAppService', '$scope', 'CarService', '$timeout', '$state', 'Prompter', 'activityPlanService',
    function ($cordovaDialogs, $ionicLoading, $ionicHistory, worksheetDataService, $rootScope, $ionicScrollDelegate, $http, $cordovaToast, HttpAppService, $scope, CarService, $timeout, $state, Prompter, activityPlanService) {
        $scope.config = {};
        $scope.dataDetail = {
            customer: "",
            contact: "",
            business: "",
            acttype: "",
            instart: "",
            desc: ""
        }
        //选择客户
        var customerPage = 1;
        $scope.customerArr = [];
        $scope.customerSearch = false;
        $scope.input = {customer: ''};
        var customerType = "";
        if (ROOTCONFIG.hempConfig.baseEnvironment == 'CATL') {
            if (LoginService.getProfileType() == "APP_SALE") {
                customerType = 'CRM000';
            }
            if (LoginService.getProfileType() == "APP_SERVICE") {
                customerType = 'Z00004';
            }
        } else {
            customerType = 'CRM000';
        }

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
                    "item1": {"RLTYP": customerType}
                }
            };
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
        if (ROOTCONFIG.hempConfig.baseEnvironment == 'CATL') {
            if (LoginService.getProfileType() == "APP_SALE") {
                $scope.customerModalArr = new Array();
                $scope.customerModalArr = saleActService.getCustomerTypes();
                $scope.selectCustomerText = '正式客户';
            }
            if (LoginService.getProfileType() == "APP_SERVICE") {
                $scope.customerModalArr = new Array();
                $scope.customerModalArr = saleActService.getServiceCustomer();
                $scope.selectCustomerText = '终端客户';
            }
        }
        if (ROOTCONFIG.hempConfig.baseEnvironment == 'ATL') {
            $scope.customerModalArr = new Array();
            $scope.customerModalArr = saleActService.getATLCustomer();
            $scope.selectCustomerText = '正式客户';
        }

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
            $scope.contactcreat.PARTNER2VALUE = x.NAME_ORG1;
            $scope.contactcreat.PARTNER2 = x.PARTNER;
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
                $scope.spinnerFlag = true;
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
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        if (response.ET_OUT_LIST.item.length < 10) {
                            $scope.ConLoadMoreFlag = false;
                        }
                        if (search) {
                            $scope.conArr = response.ET_OUT_LIST.item;
                        } else {
                            $scope.conArr = $scope.conArr.concat(response.ET_OUT_LIST.item);
                        }
                        $scope.spinnerFlag = false;
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

        $ionicModal.fromTemplateUrl('src/worksheet/relatedPart/selectContact_Modal.html', {
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
            $scope.dataDetail.customer = x;
            $scope.selectContactModal.hide();
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
                $scope.update.readDate = dateTime;
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
        var url = ROOTCONFIG.hempConfig.basePath + 'VISIT_PLAN_DETAIL';
        var data = {
            "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
            "IS_USER": {"BNAME": window.localStorage.crmUserName},
            "IS_VISIT_PLAN": {
                "DESCRIPTION": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "VALIDFROM": "",
                "VALIDTO": "",
                "STATUS": "U"
            },
            "T_TRAVEL_PLAN": {
                "item": {
                    "ZZCUSNO": "aaaaaaaaaa",
                    "ZZCONNO": "aaaaaaaaaa",
                    "ZZBEGDA": "aaaaaaaa",
                    "ZZACTTYPE": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                    "ZZACTDESC": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                    "ZZOPPOID": "aaaaaaaaaa"
                }
            }
        }
        Prompter.showLoading("正在提交");
        HttpAppService.post(url, data).success(function (response) {
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
    }]);