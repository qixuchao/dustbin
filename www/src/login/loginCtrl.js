/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
loginModule
    .controller('LoginCtrl',[
        '$ionicHistory', 'LoginService','Prompter','$cordovaToast',
        'HttpAppService','$scope','$state','ionicMaterialInk',
        '$ionicLoading','$timeout','$ionicPlatform',
        '$rootScope',
        function($ionicHistory, LoginService,Prompter,$cordovaToast,HttpAppService,$scope,$state,ionicMaterialInk,$ionicLoading,$timeout, $ionicPlatform, $rootScope){
            
            
            $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
                if(toState && toState.name == 'login'){
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $timeout(function () {
                        angular.element('#myTabId').remove();
                    }, 500);
                    $ionicPlatform.ready(function () {
                        if (window.device) {
                            //$scope.config.deviceId = device.uuid;
                            //$scope.config.deviceIdOk = true;
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        }
                    });
                }
            }); 

            $scope.config = {
                deviceId: null,
                deviceIdOk: false
            };

            ionicMaterialInk.displayEffect();
            $scope.loginData = {
                username: window.localStorage.crmUserName,
                password: window.localStorage.crmUserPassword
            };
            $scope.loginradioimgflag = false;
            $scope.loginradioSele = function () {
                $scope.loginradioimgflag = !$scope.loginradioimgflag;
                if ($scope.loginradioimgflag) {

                }
            };

            //监听用户名，去掉空格、
            var reg = /(^\s+)|(\s+$)/g;
            $scope.watchloginvalue = function (type) {
                document.getElementById(type).addEventListener("keyup", function () {//监听密码输入框，如果有值显示一键清除按钮
                    if (this.value.length > 0) {
                        if (reg.test(this.value)) {
                            this.value = this.value.replace(/\s/g, "");//去掉前后空格
                        }
                    }
                });
            };
            $scope.watchloginvalue('username');
            $scope.watchloginvalue('password');
            // alert(JSON.stringify(ionic.Platform.platforms));
            // alert(JSON.stringify(ionic.Platform.platform()));
            // alert(JSON.stringify(ionic.Platform.isWebView()));
            //监听password
            $scope.deletepass = function () {
                $scope.loginData.password = "";
                $scope.logindeleteimgflag = false;
            };
            if ($scope.loginData.password === "" || $scope.loginData.password === undefined) {//初始化判断一键清除按钮是否显示
                $scope.logindeleteimgflag = false;
            } else {
                $scope.logindeleteimgflag = true;
            }
            document.getElementById("password").addEventListener("keyup", function () {//监听密码输入框，如果有值显示一键清除按钮
                if (this.value.length > 0) {
                    $scope.$apply(function () {
                        $scope.logindeleteimgflag = true;
                    })
                } else {
                    $scope.$apply(function () {
                        $scope.logindeleteimgflag = false;
                    })
                }
            });
            
            //var userName = "HANDLCX02";
            var userPassword = $scope.loginData.password;
            var timeForGetDeviceId = 3000;
            $scope.login = function(isNotFirst){
                if(!isNotFirst){
                    Prompter.showLoading();
                }
                timeForGetDeviceId -= 300;
                if($scope.config.deviceId == null || $scope.config.deviceId==""){
                    if(timeForGetDeviceId >= 0){
                        $scope.login(true);
                    }else{
                        Prompter.hideLoading();
                        $cordovaToast.showShortBottom('获取设备ID失败,请重试!');
                    }
                }else{
                    timeForGetDeviceId = 5000;
                    $scope.loginReal();
                }
            };
            $scope.loginReal = function () {
                //http://117.28.248.23:9388/test/api/bty/login
                //var url = ROOTCONFIG.hempConfig.LoginUrl; //"http://117.28.248.23:9388/test/api/bty/login";
                var url = ROOTCONFIG.hempConfig.basePath + "login";
                var data = {
                    "username": $scope.loginData.username,
                    "password": $scope.loginData.password,
                    "system": ROOTCONFIG.hempConfig.baseEnvironment,
                    "platform": ionic.Platform.isWebView() ? ionic.Platform.platform() : 'browser',
                    "deviceId": $scope.config.deviceId
                };//ROOTCONFIG.hempConfig.baseEnvironment

                HttpAppService.noAuthorPost(url, data).success(function (response) {
                    alert("loginReal ... success  ~ ");
                    Prompter.hideLoading();
                    //alert("请求成功："+JSON.stringify(response));
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        //Prompter.showPopupAlert("登录失败","用户名或密码错误");
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else if (response.ES_RESULT.ZFLAG == 'S') {
                        LoginService.setProfile(response.PROFILE);
                        LoginService.setProfileType(response.PROFILE_TYPE);
                        LoginService.setMenulist(response.MENULIST);
                        LoginService.setAuth(response.AUTH);
                        LoginService.setUserName($scope.loginData.username);
                        LoginService.version = response.VERSION;
                        UTILITIES.setToken(response.TOKEN.pre_token + "" + response.TOKEN.token_key);
                        if (LoginService.getBupaTypeUser() != response.BUPA_TYPE_USER) {
                            LoginService.setBupaTypeUser(response.BUPA_TYPE_USER);
                            LoginService.setLoginerName("");
                          }
                          if(!$scope.loginradioimgflag){ //记住密码
                              LoginService.setPassword($scope.loginData.password);
                          }else{
                              LoginService.setPassword("");
                              $scope.loginData.password = "";
                          }
                          if(ROOTCONFIG.hempConfig.baseEnvironment == "CATL"){
                                __initJPushPlugin();
                          }
                          if(response.FIRST_LOGIN == "Y" || response.FIRST_LOGIN == "D"){
                            $state.go('changePass');
                            $rootScope.FIRST_LOGIN = response.FIRST_LOGIN;
                          }else{
                            $state.go('tabs', {}, {location:"replace", reload:"true"});
                          }
                    }
                }).error(function(errorResponse){
                    if(!errorResponse || errorResponse == null){
                        Prompter.showLoadingAutoHidden("请求超时,请检查网络", false, 1500);
                    }else{
                        Prompter.showLoadingAutoHidden(errorResponse.ES_RESULT.ZRESULT, false, 1500);
                    }
                });

                //if($scope.loginData.username === "" || $scope.loginData.username === undefined || $scope.loginData.password === "" || $scope.loginData.password === undefined){
                //    $ionicLoading.show({template: '<div style="color: black;">请输入用户名或密码</div>', noBackdrop: true, duration: 1000})
                //}else{
                //    //去掉空格
                //    alert($scope.loginData.password.replace(/\s/g,""))
                //    $scope.show()
                //};
                //$state.go('tabs')
            };
            
            $scope.show = function () {
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
                });
                $timeout(function () {
                    $scope.hide();
                }, 2000)
            };
            $scope.hide = function () {
                $ionicLoading.hide();
            };
            

            var  times__registerJpushId = 20;
            function __registerJpushId(){
                times__registerJpushId--;
                getMyDeviceId();
                window.plugins.jPushPlugin.getRegistrationID(function(data){
                    //alert("getRegistrationID   id: "+data);
                    if(angular.isUndefined(data) || data == null || data == ""){
                        if(times__registerJpushId > 0){
                            __registerJpushId();
                        }
                    }else{
                        if(ionic.Platform.isIOS()){
                            //window.localStorage.deviceId = data;
                            //$scope.config.deviceId = data;
                            //$scope.config.deviceIdOk = true;
                            console.log("JPushPlugin:registrationID is-----: " + data);
                        }
                    }
                });
            };
            function getMyDeviceId(){
                if(window.device && window.device.uuid && device.uuid.replace){
                    var tempDeviceId = device.uuid.replace("-","");
                    while(tempDeviceId.indexOf("-") >= 0){
                        tempDeviceId = tempDeviceId.replace("-","");
                    }
                    tempDeviceId = tempDeviceId.substring(0,24);
                    $scope.config.deviceId = tempDeviceId;
                    window.localStorage.deviceId = tempDeviceId;
                }
            };
            $ionicPlatform.ready(function () {
                //如果是android则使用 device插件获取deviceId
                if(ionic.Platform.isAndroid()){
                    if(!window.localStorage.deviceId || window.localStorage.deviceId==null || window.localStorage.deviceId==""){
                        window.localStorage.deviceId = window.device ? window.device.uuid : undefined;
                    }
                    $scope.config.deviceId = window.localStorage.deviceId;
                    $scope.config.deviceIdOk = false;
                }
                getMyDeviceId();
                //如果是ios则使用 jpush插件获取deviceId
                if(window.plugins && window.plugins.jPushPlugin){
                    window.plugins.jPushPlugin.init();
                    __registerJpushId();
                }
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            });
            
            //$scope.config.deviceId
            function __initJPushPlugin(){
                //alert("  __initJPushPlugin  "+window.plugins.jPushPlugin);
                try {
                    window.plugins.jPushPlugin.getRegistrationID(function(data){
                        console.log("22222   JPushPlugin:registrationID is: " + data);
                        var tags = [ROOTCONFIG.hempConfig.baseEnvironment];
                        // eg: CATL + 60000051 + deviceId     1114a89792aa79e6ef2
                        var deviceId = $scope.config.deviceId; //ionic.Platform.isIOS ? data : $scope.config.deviceId;
                        var alias = ROOTCONFIG.hempConfig.baseEnvironment+ LoginService.getUserName() + deviceId;// + $scope.config.deviceId;
                        //alert(tags);
                        //alert(alias);
                        console.log("setTagsWithAlias:   tags:"+tags+"    alias:"+alias);
                        window.plugins.jPushPlugin.setTagsWithAlias(tags, alias);
                    });
                    if (device.platform != "Android") {
                        //window.plugins.jPushPlugin.setDebugModeFromIos();
                        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                    } else {
                        //window.plugins.jPushPlugin.setDebugMode(true);
                        window.plugins.jPushPlugin.setStatisticsOpen(true);
                        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                    }
                } catch (exception) {
                    console.log(exception);
                }
                
                //document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
                //document.addEventListener("deviceready", onDeviceReady, false);
                document.addEventListener("jpush.openNotification", onOpenNotification, false);
                document.addEventListener("jpush.backgroundNotification", onBackgroundNotification, false);
                document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
                //document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
                /*
                    window.plugins.jPushPlugin.init();
                    window.plugins.jPushPlugin.setDebugMode(true);
                    window.plugins.jPushPlugin.getRegistrationID(function(id){
                        //将获取到的id存入服务端
                        alert(id);
                    });
                    //点击通知栏的回调，在这里编写特定逻辑
                    window.plugins.jPushPlugin.openNotificationInAndroidCallback= function(data){  
                        alert(JSON.stringify(data));
                    }
                */
            }
            function onReceiveNotification(event) {
                //alert("onReceiveNotification    event: "+JSON.stringify(event));
                if(device.platform != "Android"){
                    var alertContent = event.aps.alert;
                    //Prompter.showPopupAlert("消息推送",alertContent);
                    Prompter.alertWithTitle("消息推送", alertContent);
                }
                //alert(event.content);
                //alert(JSON.stringify(event.extras));
            }
            function onBackgroundNotification(event){
                console.log("onBackgroundNotification  evnet: "+event);
            }
            function onOpenNotification(event) { // {isTrusted: false}
                //alert("onOpenNotification");
                //alert(JSON.stringify(event));
                console.log("onOpenNotification   event: "+event);
                try {
                    var alertContent;
                    var extrasParams;
                    var title, extras, msgId, notificationId;
                    if (device.platform == "Android") {
                        var content = window.plugins.jPushPlugin.receiveNotification;
                        title = content.title;  //ATL Test
                        //alertContent = content.alert; //测试信息。。。
                        var extras = content.extras;
                        var msgId = extras["cn.jpush.android.MSG_ID"];
                        var notificationId = extras["cn.jpush.android.NOTIFICATION_ID"];
                        alertContent = extras["cn.jpush.android.ALERT"];
                        extrasParams = extras["cn.jpush.android.EXTRA"];
                    } else {
                        alertContent = event.aps.alert;
                        //alert(JSON.stringify(window.plugins.jPushPlugin.receiveNotification));
                    }
                    window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                    Prompter.alertWithTitle("消息推送", alertContent);
                    //Prompter.showPopupAlert("消息推送2",alertContent);
                    //alert("title: "+title+"\ncontent: "+alertContent+"\nmsgId:  "+msgId+"\nnotificationId: "+notificationId);
                    //alert("extras: "+JSON.stringify(extras));
                } catch (exception) {
                    console.log("JPushPlugin:onOpenNotification" + exception);
                }
            };


        }]);