/**
 * Created by Gusenlin on 2015/10/16.
 */
'use strict';
utilsModule.service('HttpAppService', ['$log', '$http', '$rootScope', '$state', 'Prompter', '$ionicLoading', '$timeout', '$cordovaToast','$ionicHistory',
    function ($log, $http, $rootScope, $state, Prompter, $ionicLoading, $timeout, $cordovaToast,$ionicHistory) {
        var debug = function (text) {
            $log.debug(procedure + " success");
        };
        var getToken = function() {
            var timestamp = new Date().getTime();
            var token = CryptoJS.MD5(UTILITIES.getToken() + "" + timestamp);
            return {
                "token": token,
                "timestamp": timestamp,
                "userKey": window.localStorage.crmUserName
            };
        };
        var request = {
            isSuccessfull: function (status) {
                if (status == "S" || status == "SW") {
                    return true;
                }
                else {
                    return false;
                }
            },
            noAuthorPost: function (url, paramter) {
                var config = {
                    timeout: 30000
                };
                var startTime = new Date().getTime();
                var noAuthorPost = $http.post(url, paramter,config).success(function (response) {
                }).error(function (response, status, header, config) {
                    var respTime = new Date().getTime() - startTime;
                    //超时之后返回的方法
                    if(respTime >= config.timeout){
                        console.log('HTTP timeout');
                        if(ionic.Platform.isWebView()){
                            $cordovaDialogs.alert('请求超时','提示','确定');
                        }
                    }
                    $ionicLoading.hide();
                });
                return noAuthorPost;
            },
            noAuthorGet: function (url) {
                var get = $http.get(url).success(function (response) {
                }).error(function (response, status) {
                });
                return get;
            },
            post: function (url, paramter) {
                var config = {
                    headers: getToken(),
                    timeout: 30000
                };
                var startTime = new Date().getTime();
                var post = $http.post(url,paramter,config).success(function (response) {
                    //flag = true;
                    $ionicLoading.hide();
                    try {
                        if (response.ES_RESULT.ZFLAG === 'ETOKEN') {
                            $timeout(function() {
                                $ionicHistory.clearHistory();
                                $ionicHistory.clearCache();
                            }, 1000);
                            $cordovaToast.showShortBottom('你的账户在另一地点登录');
                            window.localStorage.crmToken = '';
                            $state.go('login');
                            $ionicLoading.hide();
                        }
                        if (response.ES_RESULT.ZFLAG === 'E') {
                            $ionicLoading.hide();
                            //$cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                        }
                    } catch (e) {
                        $ionicLoading.hide();
                    }
                }).error(function (response, status, header, config) {
                    var respTime = new Date().getTime() - startTime;
                    //超时之后返回的方法
                    if(respTime >= config.timeout){
                        console.log('HTTP timeout');
                        if(ionic.Platform.isWebView()){
                            $cordovaDialogs.alert('请求超时','提示','确定');
                        }
                    }
                    $ionicLoading.hide();
                });
                return post;
            },
            get: function (url) {
                var get = $http.get(url, {
                    headers: {
                        'Authorization': basicAuthHeaderValue, 'login_name': basicLoginId,
                        'timestamp': timestamp, 'token': hashLogin, 'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).success(function (response) {

                }).error(function (response, status) {
                });
                return get;
            }
        }
        return request;
    }
]); 
utilsModule.service('Prompter', ['$ionicLoading','$ionicHistory', '$rootScope', '$ionicPopup', '$cordovaDialogs',
    '$ionicActionSheet', '$window', '$cordovaClipboard', '$cordovaInAppBrowser', '$cordovaDatePicker', '$cordovaToast',
    '$timeout',
    function ($ionicLoading,$ionicHistory, $rootScope, $ionicPopup, $cordovaDialogs, $ionicActionSheet, $window,
              $cordovaClipboard, $cordovaInAppBrowser, $cordovaDatePicker, $cordovaToast, $timeout) {

        var getFormatTime = function (date) {
            var dateTemp, minutes, hour, time;
            dateTemp = date.format("yyyy-MM-dd");
            //分钟
            if (date.getMinutes().toString().length < 2) {
                minutes = "0" + date.getMinutes();
            } else {
                minutes = date.getMinutes();
            };
            //小时
            if (date.getHours().toString().length < 2) {
                hour = "0" + date.getHours();
                time = hour + ":" + minutes;
            } else {
                hour = date.getHours();
                time = hour + ":" + minutes;
            }
            ;
            return dateTemp + " " + time;
        };
        var getOptions = function (date, mode, title) {
            return {
                date: new Date(date),
                mode: mode,
                titleText: title,
                okText: '确定',
                cancelText: '取消',
                doneButtonLabel: '确认',
                cancelButtonLabel: '取消',
                locale: 'zh_cn',
                androidTheme: window.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
            }
        };
        return {
            isAndroid: function () {
                if(ionic.Platform.isAndroid()){
                    return true
                }
                return false
            },
            isATL: function () {
                if(ROOTCONFIG.hempConfig.baseEnvironment == "ATL"){
                    return true;
                }
                return false;
            },
            showShortToastBotton: function (text) {
                if (ionic.Platform.isWebView()) {
                    console.log(ionic.Platform.platform());
                    $cordovaToast.showShortBottom(text);
                }
            },
            alert: function (text) {
                $cordovaDialogs.alert(text,'提示','确定');
            },
            alertWithTitle: function(title, text){
                $cordovaDialogs.alert(text,title ,'确定');  
            },
            selectTime: function (scope, name, date, mode, title) {
                if (!date || isNaN(date.split('/')[0])) {
                    if (mode == 'date') {
                        date = new Date().format('yyyy/MM/dd');
                    } else if (mode == 'datetime') {
                        date = new Date().format('yyyy/MM/dd hh:mm');
                    }
                }
                var options = getOptions(date, mode, title);
                console.log("utils.js:   "+options);
                document.addEventListener("deviceready", function () {
                    $cordovaDatePicker.show(options).then(function (returnDate) {
                        var time = getFormatTime(returnDate);
                        if (mode == 'date') {
                            time = returnDate.format('yyyy-MM-dd');
                        }
                        switch (name) {
                            case 'actDetailStart':
                                scope.details.de_startTime = time;
                                break;
                            case 'actDetailEnd':
                                scope.details.de_endTime = time;
                                break;
                            case 'actCreateStart':
                                scope.create.de_startTime = time;
                                break;
                            case 'actCreateEnd':
                                scope.create.de_endTime = time;
                                break;
                            case 'chanDetailStart':
                                scope.chanceDetails.STARTDATE = time;
                                break;
                            case 'chanDetailEnd':
                                scope.chanceDetails.EXPECT_END = time;
                                break;
                        }
                    });
                }, false);
            },
            showLoading: function (content) {
                $ionicLoading.show({
                    template: ('<ion-spinner icon="ios"></ion-spinner><p ng-if=content>' + content + '</p>'),
                    animation: 'fade-in',
                    showBackdrop: true
                });
            },
            showLoadingAutoHidden: function (content, isLoading, dissmiss) {
                var dissmissS = dissmiss && dissmiss > 0 ? dissmiss : 1000;
                var contentStr = content && content != "" ? "<p >" + content + "</p>" : "";
                var template = isLoading ? '<ion-spinner icon="ios"></ion-spinner>' + contentStr : contentStr;
                $ionicLoading.show({
                    template: template,
                    animation: 'fade-in',
                    showBackdrop: true
                });
                $timeout(function () {
                    $ionicLoading.hide();
                }, dissmissS);
            },
            showText: function (content) {
                $ionicLoading.show({
                    template: ('<p>' + content + '</p>'),
                    animation: 'fade-in',
                    showBackdrop: true
                });
            },
            hideLoading: function () {
                $ionicLoading.hide();
            },
            showPopup: function (title, template) {
                $ionicPopup.show({
                    title: (angular.isDefined(title) ? title : "提示"),
                    template: template,
                    buttons: [
                        {
                            text: '确定',
                            type: 'button button-cux-popup-confirm'
                        }
                    ]
                });
            },
            showPopupConfirm: function (title, template) {
                return $ionicPopup.confirm({
                    title: (angular.isDefined(title) ? title : "提示"),
                    template: template,
                    cancelText: '取消',
                    cancelType: 'button-cux-popup-cancel',
                    okText: '确定',
                    okType: 'button-cux-popup-confirm'
                })
            },
            showPopupAlert: function (title, template) {
                return $ionicPopup.alert({
                    backdrop: 'static',
                    title: (angular.isDefined(title) ? title : "提示"),
                    template: template,
                    okText: '确定',
                })
            },
            //调用电话
            showphone: function (types) {
                return $ionicActionSheet.show({
                    buttons: [
                        {text: '确定'},
                    ],
                    titleText: '是否拨打电话',
                    cancelText: '取消',
                    buttonClicked: function (index) {
                        if (index == 0) {
                            $window.location.href = "tel:" + types;
                            return true;
                        }
                    }
                })
            },
            //调用copy
            showpcopy: function (valuecopy) {
                return $ionicActionSheet.show({
                    buttons: [
                        {text: '确定'},
                    ],
                    titleText: '是否要复制',
                    cancelText: '取消',
                    buttonClicked: function (index) {
                        if (index == 0) {
                            $cordovaClipboard
                                .copy(valuecopy)
                                .then(function () {
                                    $ionicLoading.show({template: '复制成功', noBackdrop: true, duration: 1000});
                                }, function () {
                                    $ionicLoading.show({template: '复制失败', noBackdrop: true, duration: 1000});
                                });
                            return true;
                        }
                    }
                });
            },
            //打开浏览器
            openbrserinfo: function (Url) {
                return $ionicActionSheet.show({
                    buttons: [
                        {text: '确定'},
                    ],
                    titleText: '是否要打开链接',
                    cancelText: '取消',
                    buttonClicked: function (index) {
                        if (index == 0) {
                            var options = {
                                location: 'yes'
                                //clearcache: 'yes',
                                //toolbar: 'no'
                            };
                            $cordovaInAppBrowser.open(Url, '_system', options)
                                .then(function (event) {

                                })
                                .catch(function (event) {

                                });
                        }
                        ;
                    }
                });
            },
            //点击取消事件

            //客户和联系人创建和编辑界面点击取消公共函数
            ContactCreateCancelvalue: function () {
                return $cordovaDialogs.confirm('是否退出编辑界面', '提示', ['确定', '取消'])
                    .then(function (buttonIndex) {
                        // no button = 0, 'OK' = 1, 'Cancel' = 2
                        var btnIndex = buttonIndex;
                        if (btnIndex == 1) {
                            $rootScope.goBack();
                        }
                    });
            },
            ContactCreateCancelvalue1: function (type) {
                return $cordovaDialogs.confirm('是否退出'+type+'界面', '提示', ['确定', '取消'])
                    .then(function (buttonIndex) {
                        // no button = 0, 'OK' = 1, 'Cancel' = 2
                        if (buttonIndex == 1) {
                            $ionicHistory.goBack();
                            //$rootScope.goBack();
                        }
                    });
            },
            deleteInfosPoint: function (text) {
                return $cordovaDialogs.confirm(text, '提示', ['确定'])
                    .then(function (buttonIndex) {
                        // no button = 0, 'OK' = 1, 'Cancel' = 2
                        var btnIndex = buttonIndex;
                        if (btnIndex == 1) {
                            //$rootScope.goBack();
                        }
                    });
            },
            //工单模块使用的confirm风格
            wsConfirm: function (title, text, okText, cancelText) {
                $cordovaDialogs.confirm(text, title, [okText, cancelText])
                    .then(function (buttonIndex) {
                        // no button = 0, 'OK' = 1, 'Cancel' = 2
                        console.log("wsConfirm   buttonIndex: "+buttonIndex);
                        var btnIndex = buttonIndex;
                        if (btnIndex == 1) {
                            $rootScope.goBack();
                        }
                    });
                    /*console.log(" ----------   wsConfirm   ---------- ");
                console.log("wsConfirm   "+navigator.notification);
                navigator.notification.confirm(
                    text, // message
                     function (buttonIndex){
                        console.log("wsConfirm   buttonIndex: "+buttonIndex);
                     },            // callback to invoke with index of button pressed
                    title,           // title
                    [okText, cancelText]     // buttonLabels
                );*/
            }
        }
    }])







