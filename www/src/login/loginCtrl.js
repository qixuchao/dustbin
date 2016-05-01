/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
loginModule
    .controller('LoginCtrl', [
        '$ionicHistory', 'LoginService', 'Prompter', '$cordovaToast',
        'HttpAppService', '$scope', '$state', 'ionicMaterialInk',
        '$ionicLoading', '$timeout', '$ionicPlatform',
        function ($ionicHistory, LoginService, Prompter, $cordovaToast, HttpAppService, $scope, $state, ionicMaterialInk, $ionicLoading, $timeout, $ionicPlatform) {

            $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam) {
                if (toState && toState.name == 'login') {
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $timeout(function () {
                        angular.element('#myTabId').remove();
                    }, 500);
                    $ionicPlatform.ready(function () {
                        if (window.device) {
                            $scope.config.deviceId = device.uuid;
                            $scope.config.deviceIdOk = true;
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
            $scope.loginradioimgflag = true;
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
            $scope.login = function () {
                Prompter.showLoading();
                //http://117.28.248.23:9388/test/api/bty/login
                //var url = ROOTCONFIG.hempConfig.LoginUrl; //"http://117.28.248.23:9388/test/api/bty/login";
                var url = ROOTCONFIG.hempConfig.basePath + "login";
                var data = {
                    "username": $scope.loginData.username,
                    "password": $scope.loginData.password,
                    "system": ROOTCONFIG.hempConfig.baseEnvironment,
                    "platform": ionic.Platform.platform(),
                    "deviceId": $scope.config.deviceId
                };//ROOTCONFIG.hempConfig.baseEnvironment

                HttpAppService.noAuthorPost(url, data).success(function (response) {
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
                        if (!$scope.loginradioimgflag) { //记住密码
                            LoginService.setPassword($scope.loginData.password);
                        } else {
                            LoginService.setPassword("");
                            $scope.loginData.password = "";
                        }
                        //if(response.FIRST_LOGIN != "Y"){
                        //$state.go('changePass');
                        //}else{
                        $state.go('tabs', {}, {location: "replace", reload: "true"});
                        //}
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

        }]);