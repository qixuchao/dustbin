/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
loginModule
    .controller('LoginCtrl',['LoginService','Prompter','$cordovaToast','HttpAppService','$scope','$state','ionicMaterialInk','$ionicLoading','$timeout',
        function(LoginService,Prompter,$cordovaToast,HttpAppService,$scope,$state,ionicMaterialInk,$ionicLoading, $timeout){
        //$scope.goMain = function(){
        //    $state.go('main')
        //};
        ionicMaterialInk.displayEffect();
        $scope.loginData = {
            username:'',
            password:''
        };
        $scope.loginradioimgflag = true;
        $scope.loginradioSele = function(){
            $scope.loginradioimgflag = !$scope.loginradioimgflag;
        };

        //监听用户名，去掉空格、
        var reg=/(^\s+)|(\s+$)/g;
        $scope.watchloginvalue = function(type){
            document.getElementById(type).addEventListener("keyup", function () {//监听密码输入框，如果有值显示一键清除按钮
                if (this.value.length > 0) {
                    if (reg.test(this.value)) {
                        this.value = this.value.replace(/\s/g,"");//去掉前后空格
                    }
                }
            });
        };
        $scope.watchloginvalue('username')
        $scope.watchloginvalue('password')

        //监听password
        $scope.deletepass =function(){
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
                $scope.$apply(function(){
                    $scope.logindeleteimgflag = true;
                })
            } else {
                $scope.$apply(function(){
                    $scope.logindeleteimgflag = false;
                })
            }
        });
        var userName = "HANDLCX02";
        var userPassword = $scope.loginData.password;
       $scope.login = function(){
           console.log($scope.loginData.password);
           //http://117.28.248.23:9388/test/api/bty/login
           var url="http://117.28.248.23:9388/test/api/bty/login";
           var data={
               "username": $scope.loginData.username,
               "password": $scope.loginData.password,
               "system": "CATL"
           };
           HttpAppService.post(url,data).success(function(response){

               if (response.ES_RESULT.ZFLAG == 'E') {
                   Prompter.showPopupAlert("登录失败","用户名或密码错误");
                   $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                   $scope.$broadcast('scroll.infiniteScrollComplete');
               } else if (response.ES_RESULT.ZFLAG == 'S') {
                         LoginService.setProfile(response);
                         LoginService.setMenulist(response.MENULIST);
                         LoginService.setAuth(response.AUTH);
                         LoginService.setUserName(userName);

                   $state.go('tabs');
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
       }

        $scope.show = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
            });
            $timeout(function(){
                $scope.hide();
            },2000)
        };
        $scope.hide = function(){
            $ionicLoading.hide();
        };
        
}]);