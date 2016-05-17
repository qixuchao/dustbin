/*
 * Created by gongke on 2016/3/14.
 */
loginModule.factory('LoginService', function ($cordovaAppVersion, $cordovaDialogs, $cordovaNetwork, $cordovaInAppBrowser, $cordovaToast) {
    var data;
    var data3;
    var type;
    var menuList=[]; 
    var author={};
    var version;
    function newVersionGreaterThanOld(newVersion, oldVersion){  //判断oldVersion是不是最新version。。oldVersion=newVersion
        if(!newVersion || !oldVersion){
            return false;
        }
        var newVs = newVersion.split(".");
        var oldVs = oldVersion.split(".");
        if(window.parseInt(newVs[0]) > window.parseInt(oldVs[0])){
            return true;
        }else if(newVs[0] == oldVs[0]){
            if(window.parseInt(newVs[1]) > window.parseInt(oldVs[1])){
                return true;
            }else if(newVs[1]==oldVs[1]){
                if(window.parseInt(newVs[2]) > window.parseInt(oldVs[2])){
                    return true;
                }
            }
        }
        return false;
    };
    return{
        newVersionGreaterThanOld: newVersionGreaterThanOld,
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
            var objs = author;
            if (!objs || objs == "" || objs == null) {
                return null;
            }
            var returnObj = {
                VIEW: false,
                EDIT: false,
                CREATE: false
            };
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].FUNCTION == functionName) {
                    if (objs[i].EDIT == 'TRUE') {
                        returnObj.EDIT = true;
                    }
                    if (objs[i].VIEW == 'TRUE') {
                        returnObj.VIEW = true;
                    }
                    if (objs[i].CREATE == 'TRUE') {
                        returnObj.CREATE = true;
                    }
                    return returnObj;
                };
            }
            return null;
        },
        version : '',
        versionInfo: {
            currentVersion: '',
            newVersion: '',
            minVersion: ''
        },
        getNewVersion: function (app) { // 50130
            if(!app || app == null){
                return;
            }
            this.versionInfo.currentVersion = app.newVersion;
            this.versionInfo.newVersion = app.newVersion;
            this.versionInfo.minVersion = app.minVersion;

            if (ionic.Platform.isWebView()) {
                $cordovaAppVersion.getVersionNumber().then(function (version) {
                    var appVersion = version;

                    if(appVersion == app.newVersion){
                        $cordovaToast.showShortBottom('当前是最新版本');
                    }else if(newVersionGreaterThanOld(app.minVersion, version)){  //强制更新  app.minVersion > appVersion
                        // alert("程序有了新版本,请确认更新!");
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
                    }else if(newVersionGreaterThanOld(app.newVersion > appVersion)){   // app.newVersion > appVersion
                        //alert("程序有了新版本,请确认更新!222");
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