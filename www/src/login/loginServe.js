/**
 * Created by gongke on 2016/3/14.
 */
loginModule.factory('LoginService', function ($cordovaAppVersion, $cordovaDialogs, $cordovaNetwork, $cordovaInAppBrowser) {
    var data;
    var data3;
    var type;
    var menuList=[]; 
    var author={};
    var version;
    return{
        setLoginerName: function(name){
            window.localStorage.loginerName = name;
        },
        getLoginerName: function(){
            return window.localStorage.loginerName;
        },
        setBupaTypeUser: function(bupaTypeUser){
            window.localStorage.bupaTypeUser = bupaTypeUser;
        },
        getBupaTypeUser: function(){
            return window.localStorage.bupaTypeUser;
        },
        setPassword: function(password){
            window.localStorage.crmUserPassword = password;
        },
        getPassword: function(){
            return window.localStorage.crmUserPassword;
        },
        setUserName:function(data4){
            window.localStorage.crmUserName = data4;
            data = data4;
            return data;
        },
        //过去登录的用户名
        getUserName: function () {
            return data;
        },
        setProfile: function (data1) {
            data3 = data1;
            //return data;
        },
        //角色
        getProfile: function () {
            return data3;
        },
        //角色类型
        setProfileType: function (data) {
            type = data;
        },
        getProfileType: function () {
            return type;
        },
        setMenulist: function (data2) {
            menuList = data2;
            return menuList;
        },
        // 应用页列表
        getMenulist: function () {
            return menuList;
        },
        setAuth: function (data3) {
            author = data3;
            return author;
        },
        //用户的权限
        getFunctionAuth: function () {
            return author;
        },
        /*
         获取功能的权限信息
         @params:
         funcitonName: 功能名
         @return: 若返回为null,则说明获取不到权限信息  或 function不存在
         {
         VIEW: false,
         EDIT: false,
         CREATE: false
         }
         */
        getAuthInfoByFunction: function (functionName) {
            var obj = data3;
            if (!obj) {
                return null;
            }
            var auth = obj.AUTH;
            if (!auth) {
                return null;
            }
            var returnObj = {
                VIEW: false,
                EDIT: false,
                CREATE: false
            };
            for (var i = 0; i < auth.length; i++) {
                if (auth[i].FUNCTION == functionName) {
                    if (auth[i].EDIT == 'TRUE') {
                        returnObj.EDIT = true;
                    }
                    if (auth[i].VIEW == 'TRUE') {
                        returnObj.VIEW = true;
                    }
                    if (auth[i].CRTEAT == 'TRUE') { 
                        returnObj.CREATE = true;
                    }
                    return returnObj;
                }
                ;
            }
            return null;
        },
        version,
        getNewVersion: function (app) {
            if (ionic.Platform.isWebView()) {
                $cordovaAppVersion.getVersionNumber().then(function (version) {
                    var appVersion = version;
                    //强制更新
                    if (app.minVersion > appVersion) {
                        $cordovaDialogs.alert('程序有了新版本,请确认更新!', '提示', '确定').then(function () {
                            if ($cordovaNetwork.getNetwork() != 'wifi') {
                                $cordovaDialogs.confirm('当前正在使用流量上网,是否继续下载?', '提示', ['确定', '取消']).then(function (buttonIndex) {
                                    //确定
                                    if (buttonIndex == 1) {
                                        $cordovaInAppBrowser.open(app.downloadUrl, '_system', {location: 'yes'}).then(function (event) {
                                                // success
                                            })
                                            .catch(function (event) {
                                                // error
                                            });
                                    }
                                });
                            } else {
                                $cordovaInAppBrowser.open(app.downloadUrl, '_system', {location: 'yes'});
                            }
                        });
                    } else if (app.newVersion > appVersion) {
                        $cordovaDialogs.confirm('程序有了新版本,请确认更新!', '提示', ['确定', '取消']).then(function (versionIndex) {
                            if (versionIndex == 1) {
                                if ($cordovaNetwork.getNetwork() != 'wifi') {
                                    $cordovaDialogs.confirm('当前正在使用流量上网,是否继续下载?', '提示', ['确定', '取消']).then(function (buttonIndex) {
                                        //确定
                                        if (buttonIndex == 1) {
                                            $cordovaInAppBrowser.open(app.downloadUrl, '_system', {location: 'yes'});
                                        }
                                    });
                                } else {
                                    $cordovaInAppBrowser.open(app.downloadUrl, '_system', {location: 'yes'});
                                }
                            }
                        });
                    }

                });
            }
        }

    }
});