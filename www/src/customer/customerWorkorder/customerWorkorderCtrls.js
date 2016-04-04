/**
 * Created by gongke on 2016/3/31.
 */
/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
customerWorkorderModule
    .controller('customerWorkorderQueryCtrl',['$scope','$state','$http','$timeout','$ionicPopover','$ionicModal','$ionicScrollDelegate','ionicMaterialInk','ionicMaterialMotion','customeService','$ionicLoading',function($scope,$state,$http,$timeout,$ionicPopover,$ionicModal,$ionicScrollDelegate,ionicMaterialInk,ionicMaterialMotion,customeService,$ionicLoading) {
        //sort点击变量设置
        $scope.customerworksortflag = false;

        //select点击变量设置
        $scope.customerworkselectflag = false;
        //select点击右出与hide矛盾解决变量
        $scope.customerworkselectrightflag = false;

        //sort虚化背景andsort列表
        $scope.cusworkodersortbgflag = false;
        //selec虚化背景andsort列表
        $scope.cusworkoderselecbgflag = false;

        $scope.cusomerWorkorlineisortstyle = false;
        $scope.cusomerWorkorlineiselecstyle = false;

        $scope.cusomerWorkorsortimg = true;
        $scope.customerworkorsortspanflag = true;

        $scope.showCustomerWorkeordSortModal = function(){
            $scope.cusomerWorkorsortimg = !$scope.cusomerWorkorsortimg;
            $scope.customerworkorsortspanflag = !$scope.customerworkorsortspanflag;

            $scope.cusomerWorkorlineisortstyle =  !$scope.cusomerWorkorlineisortstyle;
            $scope.cusomerWorkorlineiselecstyle = false;

            $scope.customerworkorselecspanflag=true;
            $scope.cusomerWorkorselecimg=true;
            //sort虚化背景andsort列表show
            $scope.cusworkodersortbgflag = !$scope.cusworkodersortbgflag;
            //select虚化背景hide
            $scope.cusworkoderselecbgflag = false;

            //sort点击变量设置
            if($scope.cusworkodersortbgflag == true){
                $scope.customerworksortflag = true;
            }else{
                $scope.customerworksortflag = false;
            }

            //select点击右出与hide矛盾解决变量
            if($scope.cusworkodersortbgflag == true){
                $scope.customerworkselectrightflag = true;
            }else{
                $scope.customerworkselectrightflag = false;
            };


        };
        //点击列表
        $scope.customerworkordergetvalue = function(x,index){
            //sort虚化背景andsort列表show
            $scope.cusworkodersortbgflag = false;
            //lines-sort设置为false
            $scope.cusomerWorkorlineisortstyle = false;
            //文字andimg灰色
            $scope.cusomerWorkorsortimg = true;
            $scope.customerworkorsortspanflag = true;

        };
        $scope.customerworkorselecspanflag = true;
        $scope.cusomerWorkorselecimg = true;
        $scope.showCustomerWorkeordSelecModal = function (){
            $scope.customerworkorselecspanflag=!$scope.customerworkorselecspanflag;
            $scope.cusomerWorkorselecimg=!$scope.cusomerWorkorselecimg;

            $scope.cusomerWorkorlineisortstyle = false;
            $scope.cusomerWorkorlineiselecstyle = !$scope.cusomerWorkorlineiselecstyle;

            $scope.cusomerWorkorsortimg=true;
            $scope.customerworkorsortspanflag=true;

            //select虚化背景show
            $scope.cusworkoderselecbgflag = !$scope.cusworkoderselecbgflag;
            //sort虚化背景andsort列表hide
            $scope.cusworkodersortbgflag = false;

            //selectt点击变量设置
            if($scope.cusworkoderselecbgflag == true){
                $scope.customerworkselectflag = true;
            }else{
                $scope.customerworkselectflag = false;
            };
            ////select点击右出与hide矛盾解决变量
            //if($scope.cusworkoderselecbgflag == true){
            //    $scope.customerworkselectrightflag = true;
            //}else{
            //    $scope.customerworkselectrightflag = false;
            //};

            console.log("分割线");
            console.log( "customerworkselectflag"+$scope.customerworkselectflag);
            console.log( "customerworksortflag"+$scope.customerworksortflag);

            console.log( "cusworkoderselecbgflag"+$scope.cusworkoderselecbgflag);


        };
        $scope.customerworkordersortlist = [{
            sortname:'开始时间倒序',
            id:'revser'
        },{
            sortname:'开始时间顺序',
            id:'sort'
        },{
            sortname:'影响程度由高到底',
            id:'effict'
        }];

        //sort背景点击影藏
        $scope.cusworkodersortbghide = function(){
            //sort虚化背景andsort列表show
            $scope.cusworkodersortbgflag = false;
            //lines-sort设置为false
            $scope.cusomerWorkorlineisortstyle = false;
            //文字andimg灰色
            $scope.cusomerWorkorsortimg = true;
            $scope.customerworkorsortspanflag = true;

        };
        //selec背景影藏
        $scope.cusworkoderselecbghide = function(){
            //selec虚化背景andsort列表
            $scope.cusworkoderselecbgflag = false;
            $scope.cusomerWorkorlineiselecstyle = false

            //文字andimg灰色
            $scope.customerworkorselecspanflag=true
            $scope.cusomerWorkorselecimg = true;
        };

        //日期调用
        $scope.CusworkorderGetatetime = function (type) {
            var customOrderdatepickerdate = '';
            var cusWoptionsdatedate = {
                date: new Date($scope.contactedit.birthday),
                mode: 'date',
                titleText: '请选择时间',
                okText: '确定',
                cancelText: '取消',
                doneButtonLabel: '确认',
                cancelButtonLabel: '取消',
                locale: 'zh_cn',
                androidTheme: window.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
            }
            $cordovaDatePicker.show(cusWoptionsdatedate).then(function (datetime) {
                $scope.contactedit.birthday = customOrderdatepickerdate;
            })
        };
        //工作类型
        $scope.customerWorkorderetypelsit = [{
            typename: '现场维修工作',
            typeflag:false
        },{  typename: '批量工作',
            typeflag:false
        },{
            typename: '现场维修工作',
            typeflag:false
        },{
            typename: '现场维修工作(服务商)',
            typeflag:false
        },{
            typename: '现场维修工作(服务商)',
            typeflag:false
        },{
            typename: '现场维修工作(服务商)',
            typeflag:false
        }];
        $scope.customerWorkordertypetlsitlenth = $scope.customerWorkorderetypelsit.length;
        $scope.customerWorkTypeset = function(x,index){
            x.typeflag = !x.typeflag;
            for(var i=0;i<$scope.customerWorkordertypetlsitlenth;i++){
                if(i != index) {
                    $scope.customerWorkorderetypelsit[i].typeflag = false;
                }
            }
        }

        //影响程度数据
        $scope.customerWorkordereffictlsit = [{
           effname: '灾难',
            effflag:false
        },{ effname: '高',
            effflag:false
        },{
            effname: '中',
            effflag:false
        },{
            effname: '低',
            effflag:false
        },{
            effname: '无',
            effflag:false
        }];
        $scope.customerWorkordereffictlsitlenth = $scope.customerWorkordereffictlsit.length;
        $scope.customerWorkEffctset = function(x,index){
            x.effflag = !x.effflag;
            for(var i=0;i<$scope.customerWorkordereffictlsitlenth;i++){
                if(i != index) {
                    $scope.customerWorkordereffictlsit[i].effflag = false;
                }

            }
        };
        //重置按钮
        $scope.customerWorkorderReset = function(){
            for(var i=0;i<$scope.customerWorkordereffictlsitlenth;i++){
                if($scope.customerWorkordereffictlsit[i].effflag == true) {
                    $scope.customerWorkordereffictlsit[i].effflag = false;
                }

            }
            for(var i=0;i<$scope.customerWorkordertypetlsitlenth;i++){
                if($scope.customerWorkorderetypelsit[i].typeflag == true) {
                    $scope.customerWorkorderetypelsit[i].typeflag = false;
                }

            }
        }
    }])

