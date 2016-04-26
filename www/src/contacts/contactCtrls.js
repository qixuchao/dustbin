/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
ContactsModule
    .controller('contactQueryCtrl',['Prompter','$scope','$rootScope','$state','$http','HttpAppService','$timeout','$ionicPopover','$ionicActionSheet','$window','$cordovaToast','$ionicScrollDelegate','ionicMaterialInk','contactService','$ionicLoading',
        function(Prompter,$scope,$rootScope,$state,$http,HttpAppService,$timeout,$ionicPopover,$ionicActionSheet,$window,$cordovaToast,$ionicScrollDelegate,ionicMaterialInk,contactService,$ionicLoading){
        $scope.searchFlag=false;
        $scope.config={
            contactfiledvalue:""
        };
        //历史记录显示
        $scope.ContactListHistoryval = function(){
            //$scope.contacts_userqueryflag = false;
            if(storedb('contactdb').find() != undefined || storedb('contactdb').find() != null) {
                $scope.contact_query_historylists = (storedb('contactdb').find());
                if ($scope.contact_query_historylists.length > 5) {
                    $scope.contact_query_historylists = $scope.contact_query_historylists.slice(0, 5);
                };
            }
            //常用联系人显示
            if (JSON.parse(localStorage.getItem("usuacontactdb")) != null || JSON.parse(localStorage.getItem("usuacontactdb")) != undefined) {
                $scope.usuallycontactQuery_list = JSON.parse(localStorage.getItem("usuacontactdb"));
                if ($scope.usuallycontactQuery_list.length > 15) {
                    $scope.usuallycontactQuery_list = $scope.usuallycontactQuery_list.slice(0, 15);
                };
            } else {
                $scope.usuallycontactQuery_list = [];
            };
        };
        $scope.ContactListHistoryval();
        //广播修改界面显示flag
        $rootScope.$on('contactdeatillist', function(event, data) {
            //数据初始化

            //删除请求
            //$scope.contact_query_list = [];
            //$scope.contact_query_list = new Array;
            //$scope.conitemImPage = 0;
            //$scope.contacts_userqueryflag = false;
            //$http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST');
            //$scope.contactisshow = false;
            //$scope.contactfiledvalue ='';
            //$scope.ContactListHistoryval();
        });


        $ionicPopover.fromTemplateUrl('src/contacts/model/contact_selec.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.Contactspopover = popover;
        });
        $scope.Contactsopenpopv = function() {
            $scope.Contactspopover.show();
        };
        $scope.ContactsPopoverhide = function() {
            $scope.Contactspopover.hide();
        };
        $scope.contact_types = [
            {
                type:"扫描名片创建联系人",
                url:""
            },
            {
                type:"手动创建联系人",
                url:'ContactCreate'
            }
        ];
        $scope.ContactsqueryType = function(type){
            if(type.url){
                //从联系人进入创建联系人界面设置一个标记
                if(type.url == "ContactCreate"){
                    contactService.set_ContactCreateflag();
                };
            }
            $scope.Contactspopover.hide();
            $state.go('ContactCreate');
        };
        //查询
        $scope.contact_query_list = [];
        $scope.conitemImPage = 0;
        $scope.contactLoadmore = function() {
            //$scope.contactisshow = true;
            $scope.conitemImPage += 1;
            var url = ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST';
            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                "IS_PAGE": {
                    "CURRPAGE": $scope.conitemImPage,
                    "ITEMS": "10"
                },
                "IS_PARTNER": { "PARTNER": "" },
                "IS_SEARCH": { "SEARCH": $scope.config.contactfiledvalue}
            }
            //console.log("data"+angular.toJson(data));
            //console.log("name"+angular.toJson(data.IS_SEARCH.SEARCH));
            //console.log("number"+angular.toJson(data.IS_PAGE.CURRPAGE));
            HttpAppService.post(url, data).success(function (response) {
                console.log($scope.config.contactfiledvalue);
                //console.log(angular.toJson(response.ET_EMPLOYEE));
                if (response.ES_RESULT.ZFLAG == 'E') {
                    $scope.contactisshow = false;
                    Prompter.hideLoading();
                    //$cordovaToast.showShortCenter(response.ES_RESULT.ZRESULT);
                    $cordovaToast.showShortCenter("没有符合搜索条件的数据")
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    if (response.ES_RESULT.ZFLAG == 'S') {
                        Prompter.hideLoading();
                        if(response.ET_OUT_LIST != ''){
                            if (response.ET_OUT_LIST.item.length == 0) {
                                $scope.contactisshow = false;
                                if ($scope.conitemImPage == 1) {
                                    $cordovaToast.showShortBottom('数据为空');
                                } else {
                                    $cordovaToast.showShortBottom('没有更多数据');
                                }
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            } else {
                                $.each(response.ET_OUT_LIST.item, function (n, value) {
                                    if($scope.config.contactfiledvalue===""){
                                        $scope.contact_query_list=new Array;
                                    }else{
                                        $scope.contact_query_list.push(value);
                                    }
                                });
                            }
                            if (response.ET_OUT_LIST.item.length < 10) {
                                $scope.contactisshow = false;
                                if ($scope.conitemImPage > 1) {
                                    $cordovaToast.showShortBottom('没有更多数据');
                                }
                            } else {
                                $scope.contactisshow = true;
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    }
                }
            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
                $scope.contactisshow = false;
            });
        };

        $scope.initLoad=function(){
            //$http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST');
            $scope.conitemImPage = 0;
            $scope.contact_query_list=new Array;
            Prompter.showLoading("正在加载");
            $scope.contactLoadmore();
        };
            $scope.search = function (x, e){
                Prompter.showLoading('正在搜索');
                $scope.searchFlag=true;
                $scope.config.contactfiledvalue = x;
                $scope.initLoad();
            };
            $scope.cancelSearch=function(){
                //$http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST')
                $scope.searchFlag=false;
                $scope.config.contactfiledvalue = '';
                $scope.contact_query_list=new Array;
                $scope.ContactListHistoryval();
                //$scope.conitemImPage=0;
            };
            //显示搜索页面
            $scope.changePage=function(){
                $scope.searchFlag=true;
            };
            $rootScope.$on('contactBack',function(event, data) {
                console.log("接收成功" + data);
                $scope.searchFlag = data;
                $scope.config.contactfiledvalue = "";
                $scope.cancelSearch();
            });
            //清除输入框内的内容
            $scope.initSearch = function () {
                $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST')
                $scope.config.contactfiledvalue = '';
                $scope.conitemImPage=0;
                $scope.contact_query_list=new Array;
                Prompter.showLoading("正在加载")
                $scope.contactLoadmore();
            };
        //实时搜索
        //实时搜索变量初始化一次flag
        //$scope.contactinitflag = true;
        //$scope.contact ={contactfiledvalue :''};
        //var contatctimer;
        //setTimeout(function(){
        //    document.getElementById('contactqueryinput').style.display = "none";
        //    document.getElementById('contactinputvalueid').addEventListener("keyup", function () {//监听密码输入框，如果有值显示一键清除按钮
        //        //if(!$scope.$$phase) {
        //        //    $scope.$apply();
        //        //};
        //        $scope.contactisshow = false;
        //        clearTimeout(contatctimer);
        //        contatctimer = setTimeout(function() {
        //            if (document.getElementById('contactinputvalueid').value.length > 0) {
        //                document.getElementById('contactqueryinput').style.display = "inline-block";
        //                $scope.$apply(function(){
        //                    $scope.contactisshow = false;
        //                    //删除请求
        //                    $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST')
        //                    $scope.contact_query_list = [];
        //                    $scope.contact_query_list = new Array;
        //                    $scope.conitemImPage = 0;
        //                });
        //                $scope.contacts_userqueryflag = true;
        //                $ionicScrollDelegate.resize();
        //                $scope.contactisshow = true;
        //                if(!$scope.$$phase) {
        //                    $scope.$apply();
        //                };
        //            } else {
        //                //删除请求
        //                $scope.contact_query_list = [];
        //                $scope.contact_query_list = new Array;
        //                $scope.conitemImPage = 0;
        //                $scope.contacts_userqueryflag = false;
        //                $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST')
        //                $scope.contactisshow = false;
        //                if(!$scope.$$phase) {
        //                    $scope.$apply();
        //                };
        //                $ionicScrollDelegate.resize();
        //                document.getElementById('contactqueryinput').style.display = "none";
        //            }
        //        }, 500);
        //
        //    });
        //},50);
        //$scope.contactiputDeletevalue = function(){
        //    //删除请求
        //    $scope.contact_query_list = [];
        //    $scope.contact_query_list = new Array;
        //    $scope.conitemImPage = 0;
        //    $scope.contacts_userqueryflag = false;
        //    $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST')
        //    $scope.contactisshow = false;
        //    $scope.config.contactfiledvalue ='';
        //};

        //清除历史记录
        $scope.ContactsClearhis = function(){
            storedb('contactdb').remove();
            $scope.contact_query_historylists = [];
        };
        //点击历史记录开始请求
        $scope.ContactHisGetvalue = function(value){
            $scope.config.contactfiledvalue = value.name;
            $scope.contact_query_list = [];
            $scope.contact_query_list = new Array;
            $scope.conitemImPage = 0;
            $scope.contacts_userqueryflag = true;
            $ionicScrollDelegate.resize();
            $scope.contactisshow = true;
            if(!$scope.$$phase) {
                $scope.$apply();
            };
        };

        //初始化本地数据
        if (JSON.parse(localStorage.getItem("usuacontactdb")) != null || JSON.parse(localStorage.getItem("usuacontactdb")) != undefined) {
            $scope.contacthislistvalue = JSON.parse(localStorage.getItem("usuacontactdb"));
        }else{
            $scope.contacthislistvalue = new Array;
        };
        $scope.Contacts_godetails = function(x){
            $scope.contactisshow = false;
            //存储历史记录
            $scope.usuallycontactlist = x;
            if($scope.config.contactfiledvalue != ''){
                if(storedb('contactdb').find() != undefined || storedb('contactdb').find() != null){
                    var conatcthislistvalue = storedb('contactdb').find();
                    var contacthislistvaluelength = storedb('contactdb').find().length;
                    //判断是否有相同的值
                    var contacthislistflag = true;
                    for(var i=0;i<contacthislistvaluelength;i++){
                        if(conatcthislistvalue[i].name ==  $scope.config.contactfiledvalue){
                            //删除原有的，重新插入
                            storedb('contactdb').remove({"name":conatcthislistvalue[i].name}, function (err) {
                                if (!err) {
                                } else {
                                }
                            })
                            //storedb('customerdb').find().splice(i,1);
                            storedb('contactdb').insert({"name": $scope.config.contactfiledvalue}, function (err) {
                                if (!err) {
                                } else {
                                    $cordovaToast.showShortBottom('历史记录保存失败');
                                }
                            });
                            contacthislistflag = false;
                        }
                    };
                    if(contacthislistflag == true){
                        storedb('contactdb').insert({"name": $scope.config.contactfiledvalue}, function (err) {
                            if (!err) {
                                //console.log('历史记录保存成功')
                            } else {
                                $cordovaToast.showShortBottom('历史记录保存失败');
                            }
                        });
                    }
                }else{
                    storedb('contactdb').insert({"name": $scope.config.contactfiledvalue}, function (err) {
                        if (!err) {
                            //console.log('历史记录保存成功')
                        } else {
                            $cordovaToast.showShortBottom('历史记录保存失败');
                        }
                    });
                };
            };


            //存储常用联系人
            if (JSON.parse(localStorage.getItem("usuacontactdb")) !== null || JSON.parse(localStorage.getItem("usuacontactdb")) !== undefined) {
                //判断是否有相同的值
                var usuacontacthislistflag = true;
                for(var i=0;i<$scope.contacthislistvalue.length;i++){
                    if($scope.contacthislistvalue[i].NAME_LAST == $scope.usuallycontactlist.NAME_LAST) {
                        //删除原有的，重新插入
                        $scope.contacthislistvalue = JSON.parse(localStorage.getItem("usuacontactdb"));
                        $scope.contacthislistvalue.splice(i,1);
                        $scope.contacthislistvalue.unshift($scope.usuallycontactlist);
                        localStorage['usuacontactdb'] = JSON.stringify( $scope.contacthislistvalue);

                        usuacontacthislistflag = false;
                    }
                };
                if(usuacontacthislistflag == true){
                    $scope.contacthislistvalue.unshift($scope.usuallycontactlist);
                    localStorage['usuacontactdb'] = JSON.stringify( $scope.contacthislistvalue);
                }

            }else{
                $scope.contacthislistvalue.unshift($scope.usuallycontactlist);
                localStorage['usuacontactdb'] = JSON.stringify( $scope.contacthislistvalue);
            }


            var x1= x.PARTNER;
            contactService.set_ContactsListvalue(x1);
            $state.go('ContactDetail');
        };
        //广播添加联系人
        //$rootScope.$on('contactCreatevalue', function(event, data) {
        //    $scope.contact_query_list.push(contactService.get_ContactCreatevalue());
        //    console.log($scope.contact_query_list)
        //});

        //拨打电话手机
        $scope.conatct_querynumber = function(data){
            console.log(data)
            if(data.TEL_NUMBER == '' && data.MOB_NUMBER == ""){
                $cordovaToast.showShortBottom('没有数据');
            }else{
                $ionicActionSheet.show({
                    buttons: [
                        {text: data.TEL_NUMBER},
                        {text: data.MOB_NUMBER},
                    ],
                    titleText: '拨打电话',
                    cancelText: '取消',
                    buttonClicked: function (index) {
                        if (index == 0) {
                            $window.location.href = "tel:" + data.TEL_NUMBER;
                            return true;
                        };
                        if (index == 1) {
                            $window.location.href = "tel:" + data.MOB_NUMBER;
                            return true;
                        }
                    }
                })
            }
        }

    }])
    .controller('contactDetailCtrl',['LoginService','$scope','$rootScope','$state','$ionicHistory','Prompter','HttpAppService','$cordovaToast','$ionicLoading','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','contactService','$window','$ionicActionSheet',
        function(LoginService,$scope,$rootScope,$state,$ionicHistory,Prompter,HttpAppService,$cordovaToast,$ionicLoading,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,contactService,$window,$ionicActionSheet){
        ////定制从联系人详细界面进入列表界面改变界面flag
        ////返回回退
        $scope.peopleCode="";
        $scope.countryCode=""
        $scope.showFlag=true;
        $scope.ContactgoBack = function() {
            $rootScope.$broadcast('contactBack','false');
            $rootScope.$on('contactCreatevalue');
            $ionicHistory.goBack();
            //$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            //    if(fromState && toState && fromState.name == 'ContactCreate'){
            //       $ionicHistory.back();
            //    }else{
            //        $ionicHistory.goBack();
            //    }
            //});
          //$state.go('ContactQuery');
          //  });
        };
        // 数字前导“0”去掉
        var numDo=function(num){
            for(var i=0;i<num.length;i++){
                if(num[i]!='0'){
                    num=num.substr(i,num.length-i)
                    return num;
                }
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
                    };

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
                };
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                    if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                    } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'hidden';
                    };
                    style.height = height + extra + 'px';
                    scrollTop += parseInt(style.height) - elem.currHeight;
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                    elem.currHeight = parseInt(style.height);
                };
            };

            addEvent('propertychange', change);
            addEvent('input', change);
            addEvent('focus', change);
            change();
        };
        var text = document.getElementById("textarea");
            autoTextarea(text);// 调用
        //var textresult = document.getElementById("textareare");
        //autoTextarea(textresult);
        //邮箱
        $scope.mailcopyvalue = function(valuecopy){
            if(valuecopy == undefined || valuecopy == ""){
                $cordovaToast.showShortBottom('没有数据');
            }else{
                Prompter.showpcopy(valuecopy)
            }
        }
       //获取数据
            console.log(contactService.get_ContactsListvalue()+"ccc");
        Prompter.showLoading("数据加载中...");
        var loadData=function() {
            var url = ROOTCONFIG.hempConfig.basePath + 'CONTACT_DETAIL';
            var data = {
                "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_AUTHORITY": {"BNAME": window.localStorage.crmUserName},
                "IS_PARTNER": {"PARTNER": contactService.get_ContactsListvalue()}
                //contactService.get_ContactsListvalue()
                //"IS_PARTNER": { "PARTNER":'6000000385'}
            };
            console.log(contactService.get_ContactsListvalue());
            HttpAppService.post(url, data).success(function (response) {
                Prompter.hideLoading();
                if (response.ES_RESULT.ZFLAG == 'E') {
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                } else {
                    if (response.ET_OUT_CONTACT != '') {
                        $scope.contactdetails = response.ET_OUT_CONTACT.item[0];
                        console.log(angular.toJson($scope.contactdetails));
                        $scope.contactdetails.PARTNER = numDo($scope.contactdetails.PARTNER)
                    }
                    //注释字段获取
                    if (response.ET_LINES != '') {
                        $scope.conatctdeatilnotelist = response.ET_LINES.item;
                        $scope.conatctdeatilnote = '';
                        $scope.conatctdeatilnotelenght = $scope.conatctdeatilnotelist.length;
                        for (var i = 0; i < $scope.conatctdeatilnotelenght; i++) {
                            $scope.conatctdeatilnote += $scope.conatctdeatilnotelist[i].TDLINE;
                        }
                        ;
                        $scope.contactdetails.conatctdeatilnote = $scope.conatctdeatilnote;
                    }
                    //销售员工字段获取
                    if (response.ET_OUT_RELATION != '') {
                        //处理返回数据item是一条的时候
                        $scope.conatctdeatilsaleslist = response.ET_OUT_RELATION.item;
                        $scope.conatctdeatilsalslenght = $scope.conatctdeatilsaleslist.length;
                        for (var i = 0; i < $scope.conatctdeatilsalslenght; i++) {
                            if ($scope.conatctdeatilsaleslist[i].RELTYP == 'ZSA01') {
                                $scope.contactdetails.relationsalsname = $scope.conatctdeatilsaleslist[i].NAME_LAST;
                            }
                        }
                        //为联系人-关系界面保存数据(联系人详情界面的item)
                        contactService.set_ContactsdeaRelationval(response.ET_OUT_RELATION.item)
                    }
                }

            }).error(function () {
                Prompter.hideLoading();
                $cordovaToast.showShortBottom('请检查你的网络设备');
            });
        };
            loadData();
            $scope.customer_detailstypes=[{
                typemane:'关系',
                    imgurl:'img/contact/relationship@2x.png',
                    url:'ContactsRelationship'
            }]
        if(LoginService.getProfileType()=="APP_SERVICE"){
            //$scope.customer_detailstypes=new Array;
            $scope.showFlag=true;
        }else{
            $scope.showFlag=false;
            //$scope.customer_detailstypes = [{
            //    typemane:'活动',
            //    imgurl:'img/customer/customerhuod.png',
            //    url:'saleActList'
            //},{
            //    typemane:'机会',
            //    imgurl:'img/customer/customerjihui@2x.png',
            //    url:'saleChanList'
            //},{
            //    typemane:'关系',
            //    imgurl:'img/contact/relationship@2x.png',
            //    url:'ContactsRelationship'
            //}];
        }

            $scope.GocontactLists = function(convalue){
                if(convalue.url){
                    $state.go(convalue.url);
                }
            };

        //电话
        $scope.contactshowphone =function(data){
            if(data == undefined || data == ""){
                $cordovaToast.showShortBottom('没有数据');
            }else{
                $ionicActionSheet.show({
                    buttons: [
                        {text: data}
                    ],
                    titleText: '拨打电话',
                    cancelText: '取消',
                    buttonClicked: function (index) {
                        if (index == 0) {
                            $window.location.href = "tel:" + data;
                            return true;
                        };
                        //if (index == 1) {
                        //    $window.location.href = "tel:" + data.MOB_NUMBER;
                        //    return true;
                        //}
                    }
                })
            }
        };
        //邮箱
        $scope.contactmailcopyvalue = function(valuecopy){
            if(valuecopy == undefined || valuecopy == ""){
                $cordovaToast.showShortBottom('没有数据');
            }else{
                Prompter.showpcopy(valuecopy);
            }
        };
        //广播修改数据
        $rootScope.$on('contactEditvalue', function(event, data) {
            $scope.contactdetails = contactService.get_Contactsdetailvalue();
            loadData();
        });

        $scope.contact_deatilgoedit = function(){
            //判断数据是否获取成功
            if($scope.contactdetails !=undefined ||  $scope.contactdetails != ""){
                contactService.set_Contactsdetailvalue($scope.contactdetails);
                //contactService.setBname("60000051");
                $state.go("ContactsEdit");
            }else{
                $cordovaToast.showShortBottom("数据获取失败,不能编辑");
            }
        }
    }])
    .controller('contactCreateCtrl',['$scope','$rootScope','$ionicHistory','$state','Prompter','$cordovaDatePicker','customeService','LoginService','saleActService','HttpAppService','$cordovaToast','$ionicModal','$ionicLoading','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','contactService','$window','$ionicActionSheet',
        function($scope,$rootScope,$ionicHistory,$state,Prompter,$cordovaDatePicker,customeService,LoginService,saleActService,HttpAppService,$cordovaToast,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,contactService,$window,$ionicActionSheet){
        //初始化数据
        $scope.contactlistvaluesel = [{
            typeId:'1',
            name:'中文'
        },{
            typeId:'E',
            name:'英语'
        }];
        $scope.contactlistTitle = [{
            codeId:'0002',
            name:'先生'
        },{
            codeId:'0001',
            name:'女士'
        }];
            //文本框自适应换行
            var autoTextarea1 = function (elem, extra, maxHeight) {
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
                        };

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
                    };
                    scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                    elem.style.height = minHeight + 'px';
                    if (elem.scrollHeight > minHeight) {
                        if (maxHeight && elem.scrollHeight > maxHeight) {
                            height = maxHeight - padding;
                            style.overflowY = 'auto';
                        } else {
                            height = elem.scrollHeight - padding;
                            style.overflowY = 'hidden';
                        };
                        style.height = height + extra + 'px';
                        scrollTop += parseInt(style.height) - elem.currHeight;
                        document.body.scrollTop = scrollTop;
                        document.documentElement.scrollTop = scrollTop;
                        elem.currHeight = parseInt(style.height);
                    };
                };

                addEvent('propertychange', change);
                addEvent('input', change);
                addEvent('focus', change);
                change();
            };
            $scope.autoHeight=function(){
                var text = document.getElementById("textarea2");
                autoTextarea1(text);
            };

        $scope.contactcreat = {
            //客户编号
            PARTNER2VALUE:'',
            conatctdeatilnote:"",
            TITLE:"",
            TITLE_MEDI:"",
            FAX_NUMBER:"",
            FAX_EXTENS:"",
            DPRTMNT:"",
            FNCTN:"",
            COUNTRY:"",
            LANDX:"",
            BEZEI:"",
            CITY1:"",
            REGION:"",
            POST_CODE1:"",
            BIRTHDT:"",
            LANGU:"",
            SPTEXT:"",
            NAME_LAST:"",
            SMTP_ADDR:"",
            TEL_NUMBER:"",
            MOB_NUMBER:"",
            STREET:"",
            //不需要改的
            PARTNER2:"",
            //relationsalsname:"",
            //PARTNER:"",
        };
            $scope.showCustomer=customeService.goContacts.formCusttomer;
            console.log(angular.toJson(customeService.get_customerEditServevalue()));

            console.log(customeService.goContacts.formCusttomer);
            if($scope.showCustomer==true){
                $scope.contactcreat.PARTNER2VALUE= customeService.get_customerEditServevalue().NAME_ORG1;
                $scope.contactcreat.PARTNER2=customeService.get_customerEditServevalue().PARTNER;
            }else{
                console.log("2323");
                $scope.contactcreat.PARTNER2VALUE="";
            }
        //创建
        $scope.contactCreatevalue = function(){
            Prompter.showLoading("数据保存中...");
            var url = ROOTCONFIG.hempConfig.basePath + 'CONTACT_CHANGE';
            var data = {
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                "IS_CUSTOMER": {
                    "PARTNER": "",
                    "PARTNERROLE": "",
                    "TITLE": "",
                    "TITLE_MEDI":"",
                    "NAME_LAST": "",
                    "BIRTHDT": "",
                    "LANGU": "",
                    "SPTXT":"",
                    "PARTNER2": "",
                    "FNCTN": "",
                    "DPRTMNT": "",
                    "COUNTRY": "",
                    "LANDX":"",
                    "REGION": "",
                    "CITY1": "",
                    "POST_CODE1": "",
                    "LANGU2": "",
                    "STREET": "",
                    "TEL_NUMBER": "",
                    "TEL_EXTENS": "",
                    "MOB_NUMBER": "",
                    "FAX_NUMBER": "",
                    "FAX_EXTENS": "",
                    "SMTP_ADDR": "",
                    "BAPIBNAME":  window.localStorage.crmUserName,
                    "MODE": "I"
                },
                "IT_LINES": {
                    "item": {
                        "TDFORMAT": "",
                        "TDLINE": ""
                    }
                }
            };
            //data.IS_CUSTOMER.PARTNER = $scope.contactcreat.PARTNER;
            data.IS_CUSTOMER.PARTNER = window.localStorage.crmUserName;
            data.IS_CUSTOMER.PARTNER2 = $scope.contactcreat.PARTNER2;
            data.IS_CUSTOMER.TITLE = $scope.config.currentTitle;
            data.IS_CUSTOMER.TITLE_MEDI = $scope.config.currentTitle;
            data.IS_CUSTOMER.NAME_LAST = $scope.contactcreat.NAME_LAST;
            data.IS_CUSTOMER.BIRTHDT = $scope.contactcreat.BIRTHDT;
            data.IS_CUSTOMER.LANGU = $scope.config.currentLanguage;
            data.IS_CUSTOMER.SPTXT =$scope.config.currentLanguage;
            data.IS_CUSTOMER.FNCTN = $scope.contactcreat.FNCTN;
            data.IS_CUSTOMER.DPRTMNT = $scope.contactcreat.DPRTMNT;
            //data.IS_CUSTOMER.COUNTRY = $scope.contactcreat.COUNTRY;
            data.IS_CUSTOMER.COUNTRY =$scope.config.currentCountry;
            data.IS_CUSTOMER.LANDX =$scope.config.currentCountry;
            data.IS_CUSTOMER.REGION = $scope.config.currentProvence.REGION;
            data.IS_CUSTOMER.CITY1 = $scope.config.currentCity.CITY_NAME;
            data.IS_CUSTOMER.POST_CODE1 = $scope.contactcreat.POST_CODE1;
            data.IS_CUSTOMER.STREET = $scope.contactcreat.STREET;
            data.IS_CUSTOMER.TEL_NUMBER = $scope.contactcreat.TEL_NUMBER;
            data.IS_CUSTOMER.TEL_EXTENS = $scope.contactcreat.TEL_EXTENS;
            data.IS_CUSTOMER.MOB_NUMBER = $scope.contactcreat.MOB_NUMBER;
            data.IS_CUSTOMER.SMTP_ADDR = $scope.contactcreat.SMTP_ADDR;
            data.IS_CUSTOMER.FAX_NUMBER = $scope.contactcreat.FAX_NUMBER;
            data.IS_CUSTOMER.FAX_EXTENS = $scope.contactcreat.FAX_EXTENS;
            data.IT_LINES.item.TDLINE=$scope.contactcreat.conatctdeatilnote;

            //根据登陆接口来判断 角色字段的类型
            var rolevalue = LoginService.getProfileType();
            console.log(rolevalue);
            if(rolevalue == 'APP_SALE'){
                data.IS_CUSTOMER.PARTNERROLE = 'BUP001';
            }else{
                data.IS_CUSTOMER.PARTNERROLE = 'Z00005';
            }
            if(data.IS_CUSTOMER.PARTNER2 == '' || data.IS_CUSTOMER.PARTNER2 == undefined
                || data.IS_CUSTOMER.NAME_LAST == ''|| data.IS_CUSTOMER.NAME_LAST == undefined
                || $scope.config.currentCountry == '' || $scope.config.currentCountry == undefined){

                console.log("data.IS_CUSTOMER.PARTNE2"+data.IS_CUSTOMER.PARTNER2);
                console.log("data.IS_CUSTOMER.NAME_LAST"+data.IS_CUSTOMER.NAME_LAST);
                console.log("data.IS_CUSTOMER.COUNTRY"+ $scope.config.currentCountry);
                $cordovaToast.showShortCenter('请输入客户姓名,标识或国家');
                //console.log("请输入客户姓名,标识或国家");
                Prompter.hideLoading();


            }else{
                HttpAppService.post(url, data).success(function (response) {
                    Prompter.hideLoading();
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        console.log(response.ES_RESULT.ZRESULT);
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                        //$state.go('ContactDetail');
                    } else {
                        //$cordovaToast.showShortCenter('保存数据成功');
                        console.log('保存数据成功');

                        //contactService.set_ContactCreateflagfalse();
                        $rootScope.$broadcast('contactCreatevalue');
                        console.log(response.ES_RESULT.ZRESULT);
                        contactService.set_ContactsListvalue(response.ES_RESULT.ZRESULT);

                        if($scope.showCustomer==true){
                            $scope.showCustomer=false;
                            $ionicHistory.goBack();
                        }else{
                            console.log('跳转成功--xbr');
                            $state.go('ContactDetail',{},{
                                location: "replace"
                            });
                        }

                    }
                }).error(function(){
                    Prompter.hideLoading();
                    $cordovaToast.showShortBottom('请检查你的网络设备');
                });
            }
        };
            //国家。省，市级联下拉框
            $scope.country=[];
            $scope.provence=[];
            $scope.city=[];
            $scope.countryCode="";
            $scope.Ctype="A";
            $scope.provenceCode="";

            $scope.config = {
                currentCountry:"CN",
                currentProvence:{},
                currentCity:{},
                currentTitle:"0002",
                currentLanguage:"1"
            };
            console.log(angular.toJson($scope.config)+"create");
            $scope.cascade=function(){
                //http://117.28.248.23:9388/test/api/CRMAPP/LIST_CITY
                var url=ROOTCONFIG.hempConfig.basePath +'LIST_CITY';
                var data={
                    "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                    "IS_USER": { "BNAME": window.localStorage.crmUserName },
                    "I_COUNTRY": "",
                    "I_MODE": "A",
                    "I_REGION": ""
                };
                HttpAppService.post(url,data).success(function(response){
                    $.each(response.ET_CITY.item, function (n, value) {
                        $scope.country.push(value);
                    });
                }).error(function (response, status) {
                    $cordovaToast.showShortBottom('请检查你的网络设备');
                });
            };
            $scope.cascade1=function(){
                //http://117.28.248.23:9388/test/api/CRMAPP/LIST_CITY
                var url=ROOTCONFIG.hempConfig.basePath + "LIST_CITY";
                var data={
                    "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                    "IS_USER": { "BNAME": window.localStorage.crmUserName },
                    "I_COUNTRY": $scope.countryCode,
                    "I_MODE": "B",
                    "I_REGION": ""
                };
                HttpAppService.post(url,data).success(function(response){
                    $.each(response.ET_CITY.item, function (n, value) {
                        $scope.provence.push(value);
                    })

                }).error(function (response, status) {
                    $cordovaToast.showShortBottom('请检查你的网络设备');
                });
            };
            if($scope.currentCountry!=null||$scope.currentCountry!=""){
                $scope.countryCode= $scope.config.currentCountry;
                $scope.cascade1();
            }
            $scope.cascade2=function(){
                //http://117.28.248.23:9388/test/api/CRMAPP/LIST_CITY
                var url=ROOTCONFIG.hempConfig.basePath + "LIST_CITY";
                var data={
                    "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                    "IS_USER": { "BNAME": window.localStorage.crmUserName },
                    "I_COUNTRY": $scope.countryCode,
                    "I_MODE": "C",
                    "I_REGION": $scope.provenceCode
                };
                HttpAppService.post(url,data).success(function(response){
                    if(response.ET_CITY.item.length===undefined){
                        $scope.city=new Array;
                    }else{
                        $.each(response.ET_CITY.item, function (n, value) {
                            $scope.city.push(value);
                        })
                    }
                }).error(function (response, status) {
                    $cordovaToast.showShortBottom('请检查你的网络设备');
                });
            };
            $scope.cascade();
            $scope.changCountry=function(){
                $scope.provence=new Array;
                $scope.city=new Array;
                $scope.countryCode= $scope.config.currentCountry;
                console.log($scope.countryCode);
                $scope.cascade1();
            };
            $scope.changProvence=function(){
                $scope.city=new Array;
                $scope.provenceCode=$scope.config.currentProvence.REGION;
                $scope.cascade2();
            };
            $scope.init=function(){
                $scope.country=new Array;
                $scope.provence=new Array;
                $scope.city=new Array;
            };
        $scope.contactCreateDeleteListener = function(crid,crimgid){
            setTimeout(function(){
                document.getElementById(crid).addEventListener("keyup", function () {//监听密码输入框，如果有值显示一键清除按钮
                    if (this.value.length > 0) {
                        document.getElementById(crimgid).style.display = "inline-block";
                    } else {
                        document.getElementById(crimgid).style.display = "none";
                    }
                });
            },20)
        };
        $scope.contactCreateDeleteListener('concreatename','contcreatenameimg');
        $scope.contactCreateDeleteListener('contcreatephonenumber','concreatetphonenumberimg');
        $scope.contactCreateDeleteListener('contcreatemobilenumber','contcreatemobilenumberimg');
        $scope.contactCreateDeleteListener('contcreateaddressname','contcreaaddressnameimg');
        $scope.contactCreateDeleteListener('contcreanotename','contcreanotenameimg');
        $scope.contactCreateDeleteListener('contcreatefax','contcreafaximg');
        $scope.contactCreateDeleteListener('contcreafaxexit','contcreafaxexitimg');
        $scope.contactCreateDeleteListener('contcreapartment','contcreapartmentimg');
        $scope.contactCreateDeleteListener('contcreaatend','contcreaatendimg');
        $scope.contactCreateDeleteListener('contcreapostm','contcreapostmimg');

        $scope.contactCreateDeletevalue = function(type) {
            switch (type) {
                case 'NAME_LAST':
                    $scope.contactcreat.NAME_LAST = '';
                    document.getElementById('contcreatenameimg').style.display = "none";
                    break;
                case 'TEL_NUMBER':
                    $scope.contactcreat.TEL_NUMBER = '';
                    document.getElementById('concreatetphonenumberimg').style.display = "none";
                    break;
                case 'MOB_NUMBER':
                    $scope.contactcreat.MOB_NUMBER = '';
                    document.getElementById('contcreatemobilenumberimg').style.display = "none";
                    break;
                case 'STREET':
                    $scope.contactcreat.STREET = '';
                    document.getElementById('contcreaaddressnameimg').style.display = "none";
                    break;
                case 'conatctdeatilnote':
                    $scope.contactcreat.conatctdeatilnote = '';
                    document.getElementById('contcreanotenameimg').style.display = "none";
                    break;
                case 'FAX_NUMBER':
                    $scope.contactcreat.FAX_NUMBER = '';
                    document.getElementById('contcreafaximg').style.display = "none";
                    break;
                case 'FAX_EXTENS':
                    $scope.contactcreat.FAX_EXTENS = '';
                    document.getElementById('contcreafaxexitimg').style.display = "none";
                    break;
                case 'DPRTMNT':
                    $scope.contactcreat.DPRTMNT = '';
                    document.getElementById('contcreapartmentimg').style.display = "none";
                    break;
                case 'FNCTN':
                    $scope.contactcreat.POST_CODE1 = '';
                    document.getElementById('contcreaatendimg').style.display = "none";
                    break;
                case 'POST_CODE1':
                    $scope.contactcreat.POST_CODE1 = '';
                    document.getElementById('contcreapostmimg').style.display = "none";
                    break;
            }
        };

        //日期的选择
        //$scope.conatactCavebr = function () {
        //    var Creoptionsdatedate = {
        //        date: new Date($scope.contactcreat.BIRTHDT),
        //        mode: 'date',
        //        titleText: '请选择时间',
        //        okText: '确定',
        //        cancelText: '取消',
        //        doneButtonLabel: '确认',
        //        cancelButtonLabel: '取消',
        //        locale: 'zh_cn',
        //        androidTheme: window.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
        //    };
        //    document.addEventListener("deviceready", function () {
        //        $cordovaDatePicker.show(Creoptionsdatedate).then(function (date) {
        //            alert(date);
        //            $scope.contactcreat.BIRTHDT = date.Format('yyyy-MM-dd');
        //            alert($scope.contactcreat.BIRTHDT)
        //        })
        //    })
        //};
        //选择日期
        $scope.selectCreateTime = function () { // type: start、end
            var date;
            if($scope.contactcreat.BIRTHDT!==""){
                date = new Date($scope.contactcreat.BIRTHDT.replace(/-/g, "/")).format('yyyy/MM/dd');
                console.log(date);
            }else{
                date=new Date();
                console.log(date);
            }
            $cordovaDatePicker.show({
                date: date,
                mode: 'date',
                titleText: "",
                okText: '确定',
                cancelText: '取消',
                doneButtonLabel: '确认',
                cancelButtonLabel: '取消',
                locale: 'zh_cn'
            }).then(function (returnDate) {
                var time = returnDate.format("yyyy-MM-dd"); //__getFormatTime(returnDate);
                //alert(time);
                console.log(date);
                $scope.contactcreat.BIRTHDT = time;
                //console.log($scope.datas.detail.ES_OUT_LIST.START_TIME_STR);
                if(!$scope.$$phrese){
                    $scope.$apply();
                }
            })
        };
        //选择客户

            var customerPage = 1;
            $scope.customerArr = [];
            $scope.customerSearch = false;
            $scope.input = {customer:''};
            var customerType = 'CRM000';
            $scope.getCustomerArr = function (search) {
                $scope.CustomerLoadMoreFlag = false;
                if (search) {
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
                    "IT_IN_ROLE": {
                        "item1": { "RLTYP": customerType }
                    }
                };
                console.log(data);
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST', data)
                    .success(function (response, status, headers, config) {
                        if (config.data.IS_SEARCH.SEARCH != $scope.input.customer) {
                            return;
                        }
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            if (response.ET_OUT_LIST.item.length < 10) {
                                $scope.CustomerLoadMoreFlag = false;
                            }
                            if (search) {
                                $scope.customerArr = response.ET_OUT_LIST.item;
                            } else {
                                $scope.customerArr = $scope.customerArr.concat(response.ET_OUT_LIST.item);
                            }
                            $scope.spinnerFlag = false;
                            $scope.customerSearch = true;
                            $scope.CustomerLoadMoreFlag = true;
                            $ionicScrollDelegate.resize();
                            //saleActService.customerArr = $scope.customerArr;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }else{
                            $scope.CustomerLoadMoreFlag = false;
                            Prompter.showShortToastBotton(response.ES_RESULT.ZRESULT);
                        }
                    });
            };
        $scope.getCustomerArr();
            //根据用户权限显示
            $scope.showFlag="";
            if(LoginService.getProfileType=="APP_SALE"){
                $scope.showFlag=false;
            }else if(LoginService.getProfileType=="APP_SERVICE"){
                $scope.showFlag=true;
            }
            // 选择时间
            $scope.selectCreateTime = function () { // type: start、end
                var date;
                if($scope.contactcreat.BIRTHDT){
                    date = new Date($scope.contactcreat.BIRTHDT.replace(/-/g, "/")).format('yyyy/MM/dd');
                    console.log(date);
                }else{
                    date=new Date();
                    console.log(date);
                }
                $cordovaDatePicker.show({
                    date: date,
                    mode: 'date',
                    titleText: "",
                    okText: '确定',
                    cancelText: '取消',
                    doneButtonLabel: '确认',
                    cancelButtonLabel: '取消',
                    locale: 'zh_cn'

                }).then(function (returnDate) {
                    var time = returnDate.format("yyyy-MM-dd"); //__getFormatTime(returnDate);
                    alert(time);
                    console.log(date);
                    $scope.contactcreat.BIRTHDT = time;
                    //console.log($scope.datas.detail.ES_OUT_LIST.START_TIME_STR);
                    if(!$scope.$$phrese){
                        $scope.$apply();
                    }
                })
            };
        //选择客户
            //选择客户Modal
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/selectCustomer_Modal.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: true
            }).then(function (modal) {
                $scope.selectCustomerModal = modal;
            });
            $scope.customerModalArr = saleActService.getCustomerTypes();
            $scope.selectCustomerText = '竞争对手';
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
                    console.log(x.PARTNER);

                    //$scope.create.contact='';
                    //contactPage = 1;
                    //$scope.contacts = [];
                    $scope.contactsLoadMoreFlag = true;
                    //$scope.getContacts();
                    $scope.selectCustomerModal.hide();
                //$scope.create.customer = x;
                //$scope.create.contact = '';
                //contactPage = 1;
                //$scope.contacts = [];
                //$scope.contactSpinnerFLag = true;
                //$scope.contactsLoadMoreFlag = true;
                ////$scope.getContacts();
                //$scope.selectCustomerModal.hide();
            };

            $scope.$on('$destroy', function () {
                $scope.createPop.remove();
                $scope.createModal.remove();
                $scope.selectPersonModal.remove();
            });


        ////点击取消事件
        $scope.Createancel = function(){
            Prompter.ContactCreateCancelvalue();
        }
        //$scope.contactKeepCreatevalue = function(){
        //    contactService.set_ContactCreatevalue($scope.contactcreat);
        //    //广播修改详细信息界面的数据
        //    if(contactService.get_ContactCreateflag() == true){
        //        contactService.set_ContactCreateflagfalse();
        //        $rootScope.$broadcast('contactCreatevalue');
        //        $state.go('ContactQuery');
        //    }else{
        //        $rootScope.$broadcast('customercontactCreatevalue');
        //        $state.go('customerContactQuery');
        //    }
        //    $ionicHistory.goBack(-2);
        //}
    }])
    .controller('contactEditCtrl',['$scope','$rootScope','$timeout','$state','Prompter','$http','HttpAppService','$cordovaToast','$ionicLoading','$ionicScrollDelegate','$ionicPopup','$cordovaDatePicker','ionicMaterialInk','LoginService','contactService','$window','$ionicActionSheet',
        function($scope,$rootScope,$timeout,$state,Prompter,$http,HttpAppService,$cordovaToast,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$cordovaDatePicker,ionicMaterialInk,LoginService,contactService,$window,$ionicActionSheet){

            //默认的称谓
            var observe;
            if (window.attachEvent) {
                observe = function (element, event, handler) {
                    element.attachEvent('on'+event, handler);
                };
            }
            else {
                observe = function (element, event, handler) {
                    element.addEventListener(event, handler, false);
                };
            }
            function init () {
                var text = document.getElementById('text');
                function resize () {
                    text.style.height = 'auto';
                    text.style.height = text.scrollHeight+'px';
                }
                /* 0-timeout to get the already changed text */
                function delayedResize () {
                    window.setTimeout(resize, 0);
                }
                observe(text, 'change',  resize);
                observe(text, 'cut',     delayedResize);
                observe(text, 'paste',   delayedResize);
                observe(text, 'drop',    delayedResize);
                observe(text, 'keydown', delayedResize);

                text.focus();
                text.select();
                resize();
            };

            $scope.contactedit = contactService.get_Contactsdetailvalue();
             console.log(angular.toJson($scope.contactedit));
        ////点击取消事件
        $scope.EditCancel = function(){
           Prompter.ContactCreateCancelvalue();
        };
            //文本框自适应换行
            var autoTextarea1 = function (elem, extra, maxHeight) {
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
                        };

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
                    };
                    scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                    elem.style.height = minHeight + 'px';
                    if (elem.scrollHeight > minHeight) {
                        if (maxHeight && elem.scrollHeight > maxHeight) {
                            height = maxHeight - padding;
                            style.overflowY = 'auto';
                        } else {
                            height = elem.scrollHeight - padding;
                            style.overflowY = 'hidden';
                        };
                        style.height = height + extra + 'px';
                        scrollTop += parseInt(style.height) - elem.currHeight;
                        document.body.scrollTop = scrollTop;
                        document.documentElement.scrollTop = scrollTop;
                        elem.currHeight = parseInt(style.height);
                    };
                };

                addEvent('propertychange', change);
                addEvent('input', change);
                addEvent('focus', change);
                change();
            };
            $scope.autoHeight=function(){
                var text = document.getElementById("textarea1");
                autoTextarea1(text);
            };
        //根据用户权限显示
            $scope.showFlag="";
            if(LoginService.getProfileType=="APP_SALE"){
                $scope.showFlag=false;
            }else if(LoginService.getProfileType=="APP_SERVICE"){
                $scope.showFlag=true;
            }
        //选择日期
            $scope.selectCreateTime1 = function () { // type: start、end
                var date;
                //console.log($scope.contactedit.BIRTHDT);
                if($scope.contactedit.BIRTHDT!==undefined){
                    if($scope.contactedit.BIRTHDT=="0000-00-00"){
                        date=new Date();
                    }else{
                        date = new Date($scope.contactedit.BIRTHDT.replace(/-/g, "/")).format('yyyy/MM/dd');
                    }//console.log(angular.toJson(date));
                }else{
                    date=new Date();
                    console.log(date);
                }
                $cordovaDatePicker.show({
                    date: date,
                    mode: 'date',
                    titleText: "",
                    okText: '确定',
                    cancelText: '取消',
                    doneButtonLabel: '确认',
                    cancelButtonLabel: '取消',
                    locale: 'zh_cn'
                }).then(function (returnDate) {
                    var time = returnDate.format("yyyy-MM-dd"); //__getFormatTime(returnDate);
                    //alert(time);
                    console.log(date);
                    $scope.contactedit.BIRTHDT = time;
                    //console.log($scope.datas.detail.ES_OUT_LIST.START_TIME_STR);
                    if(!$scope.$$phrese){
                        $scope.$apply();
                    }
                })
            };
            //$scope.selectCreateTime1 = function () { // type: start、end
            //    var date;
            //      if($scope.contactedit.BIRTHDT!==""){
            //          date = new Date($scope.contactedit.BIRTHDT.replace(/-/g, "/")).format('yyyy/MM/dd');
            //      }else{
            //          date=new Date();
            //      }
            //    $cordovaDatePicker.show({
            //        date: date,
            //        mode: 'date',
            //        titleText: "",
            //        okText: '确定',
            //        cancelText: '取消',
            //        doneButtonLabel: '确认',
            //        cancelButtonLabel: '取消',
            //        locale: 'zh_cn'
            //    }).then(function (returnDate) {
            //        var time = returnDate.format("yyyy-MM-dd"); //__getFormatTime(returnDate);
            //        //alert(time);
            //        $scope.contactedit.BIRTHDT = time;
            //                //console.log($scope.datas.detail.ES_OUT_LIST.START_TIME_STR);
            //        if(!$scope.$$phrese){
            //            $scope.$apply();
            //        }
            //    })
            //};
            $scope.contactlistvaluesel = [{
                typeId:"1",
                name:"中文"
            },{
                typeId:"E",
                name:"英语"
            }];
            $scope.contactlistTitle = [{
                codeId:'0002',
                name:'先生'
            },{
                codeId:'0001',
                name:'女士'
            }];
        $scope.contactKeepEditvalue = function(){
            contactService.set_Contactsdetailvalue($scope.contactedit);
            //提交修改数据
            Prompter.showLoading("数据保存中...");
            var url = ROOTCONFIG.hempConfig.basePath + 'CONTACT_CHANGE';
            var data = {
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName},
                "IS_CUSTOMER": {
                    "PARTNER": "",
                    "PARTNERROLE": "",
                    "TITLE": "",
                    "NAME_LAST": "",
                    "BIRTHDT": "",
                    "LANGU": "",
                    "PARTNER2": "",
                    "FNCTN": "",
                    "DPRTMNT": "",
                    "COUNTRY": "",
                    "LANDX":"",
                    "REGION": "",
                    "HOUSE_NUM1":"",
                    "SPTXT":"",
                    "CITY1": "",
                    "POST_CODE1": "",
                    "LANGU2": "",
                    "STREET": "",
                    "TEL_NUMBER": "",
                    "TEL_EXTENS": "",
                    "MOB_NUMBER": "",
                    "FAX_NUMBER": "",
                    "FAX_EXTENS": "",
                    "SMTP_ADDR": "",
                    "TITLE_MEDI":"",
                    "BAPIBNAME": "",
                    "MODE": "U"
                },
                "IT_LINES": {
                    "item": {
                        "TDFORMAT": "",
                        "TDLINE": ""
                    }
                }
            };
            console.log(window.localStorage.crmUserName);
            data.IS_CUSTOMER.PARTNER = $scope.contactedit.PARTNER;
            data.IS_CUSTOMER.PARTNER2 = contactService.get_Contactsdetailvalue().PARTNER2;
            //data.IS_CUSTOMER.PARTNER = '2284';
            data.IS_CUSTOMER.TITLE = $scope.config.currentTitile;
            data.IS_CUSTOMER.NAME_LAST = $scope.contactedit.NAME_LAST;
            data.IS_CUSTOMER.BIRTHDT = $scope.contactedit.BIRTHDT;
            data.IS_CUSTOMER.LANGU2 = $scope.config.currentLanguage;
            data.IS_CUSTOMER.LANGU = $scope.config.currentLanguage;
            data.IS_CUSTOMER.SPTXT = $scope.config.currentLanguage;
            data.IS_CUSTOMER.FNCTN = $scope.contactedit.FNCTN;
            data.IS_CUSTOMER.DPRTMNT = $scope.contactedit.DPRTMNT;
            data.IS_CUSTOMER.COUNTRY = $scope.config.currentCountry;
            data.IS_CUSTOMER.LANDX = $scope.config.currentCountry;
            data.IS_CUSTOMER.REGION = $scope.config.currentProvence.REGION;
            data.IS_CUSTOMER.CITY1 = $scope.config.currentCity.CITY_NAME;
            data.IS_CUSTOMER.POST_CODE1 = $scope.contactedit.POST_CODE1;
            data.IS_CUSTOMER.STREET = $scope.contactedit.STREET;
            data.IS_CUSTOMER.HOUSE_NUM1=$scope.contactedit.HOUSE_NUM1;
            data.IS_CUSTOMER.TEL_NUMBER = $scope.contactedit.MOB_NUMBER;
            data.IS_CUSTOMER.TEL_EXTENS =$scope.contactedit.TEL_EXTENS;
            data.IS_CUSTOMER.MOB_NUMBER = $scope.contactedit.TEL_NUMBER;
            data.IS_CUSTOMER.FAX_NUMBER = $scope.contactedit.FAX_NUMBER;
            data.IS_CUSTOMER.FAX_EXTENS = $scope.contactedit.FAX_EXTENS;
            data.IS_CUSTOMER.SMTP_ADDR = $scope.contactedit.SMTP_ADDR;
            data.IS_CUSTOMER.MODE = "U";
            data.IS_CUSTOMER.TITLE_MEDI=$scope.config.currentTitile.name;
            data.IT_LINES.item.TDLINE=$scope.contactedit.conatctdeatilnote;
            //if(data.IS_CUSTOMER.NAME_LAST == ''|| data.IS_CUSTOMER.NAME_LAST == undefined || data.IS_CUSTOMER.PARTNER == ''|| data.IS_CUSTOMER.PARTNER == undefined){
            if(data.IS_CUSTOMER.NAME_LAST == ''|| data.IS_CUSTOMER.NAME_LAST == undefined
                || $scope.config.currentCountry == ''|| $scope.config.currentCountry == undefined){
                $cordovaToast.showShortCenter('请输入客户姓名或国家');
                //console.log("请输入客户姓名或标识");
                Prompter.hideLoading();
            }else{
                HttpAppService.post(url, data).success(function (response) {
                    console.log($scope.contactedit.BIRTHDT+'sheng ri');

                    Prompter.hideLoading();
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        console.log(response.ES_RESULT.ZRESULT);
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                        //$state.go('ContactDetail');
                    } else {
                        //$cordovaToast.showShortCenter('保存数据成功');
                        console.log("保存数据成功");

                        //广播修改详细信息界面的数据
                        $rootScope.$broadcast('contactEditvalue');
                        //contactService.set_Contactsdetailvalue();

                        $state.go('ContactDetail');
                    }
                }).error(function(){
                    Prompter.hideLoading();
                    $cordovaToast.showShortBottom('请检查你的网络设备');
                });
            }
        };
        $scope.contactDeleteListener = function(id,imgid){
            setTimeout(function(){
                document.getElementById(id).addEventListener("keyup", function () {//监听密码输入框，如果有值显示一键清除按钮
                    if (this.value.length > 0) {
                       document.getElementById(imgid).style.display = "inline-block";
                    } else {
                        document.getElementById(imgid).style.display = "none";
                    }
                });
            },20)
        };
        $scope.contactDeleteListener('contname','contnameimg');
        $scope.contactDeleteListener('contphonenumber','contphonenumberimg');
        $scope.contactDeleteListener('contmobilenumber','contmobilenumberimg');
        $scope.contactDeleteListener('contaddressname','contaddressnameimg');
        $scope.contactDeleteListener('contmobilenumber','contmobilenumberimg');

        $scope.contactDeleteListener('contnotename','contnotenameimg');
        $scope.contactDeleteListener('contfax','contfaximg');
        $scope.contactDeleteListener('contfaxexit','contfaxexitimg');
        $scope.contactDeleteListener('contpartment','contpartmentimg');
        $scope.contactDeleteListener('contatend','contatendimg');
        $scope.contactDeleteListener('contpostm','contpostmimg');
        //delete
        $scope.contactDeletevalue = function(type){
            switch (type) {
                case 'NAME_LAST':
                    $scope.contactedit.NAME_LAST = '';
                    document.getElementById('contnameimg').style.display = "none";
                    break;
                case 'TEL_NUMBER':
                    $scope.contactedit.TEL_NUMBER = '';
                    document.getElementById('contphonenumberimg').style.display = "none";
                    break;
                case 'MOB_NUMBER':
                    $scope.contactedit.MOB_NUMBER = '';
                    document.getElementById('contmobilenumberimg').style.display = "none";
                    break;
                case 'STREET':
                    $scope.contactedit.STREET = '';
                    document.getElementById('contaddressnameimg').style.display = "none";
                    break;
                case 'FAX_NUMBER':
                    $scope.contactedit.FAX_NUMBER = '';
                    document.getElementById('contfaximg').style.display = "none";
                    break;
                case 'FAX_EXTENS':
                    $scope.contactedit.FAX_EXTENS = '';
                    document.getElementById('contfaxexitimg').style.display = "none";
                    break;
                case 'DPRTMNT':
                    $scope.contactedit.DPRTMNT = '';
                    document.getElementById('contpartmentimg').style.display = "none";
                    break;
                case 'FNCTN':
                    $scope.contactedit.FNCTN = '';
                    document.getElementById('contatendimg').style.display = "none";
                    break;

                case 'POST_CODE1':
                    $scope.contactedit.POST_CODE1 = '';
                    document.getElementById('contpostmimg').style.display = "none";
                    break;
            }
        }
        //国家。省，市级联下拉框
        $scope.country=[];
        $scope.provence=[];
        $scope.city=[];
        $scope.countryCode="";
        $scope.provenceCode="";
        $scope.config = {
            currentCountry:$scope.contactedit.COUNTRY,
            currentProvence:$scope.contactedit.REGION,
            currentCity:{},
            currentLanguage:$scope.con,
            currentTitile:"0002"
        };
            console.log(angular.toJson($scope.config)+"sdsdsd");
        $scope.cascade=function(){
            //http://117.28.248.23:9388/test/api/CRMAPP/LIST_CITY
            var url=ROOTCONFIG.hempConfig.basePath + "LIST_CITY";
            var data={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": window.localStorage.crmUserName },
                "I_COUNTRY": "",
                "I_MODE": "A",
                "I_REGION": ""
            };
            HttpAppService.post(url,data).success(function(response){
                $.each(response.ET_CITY.item, function (n, value) {
                    $scope.country.push(value);
                     contactService.set_country(value);
                });
            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
            });
        };
        $scope.cascade1=function(){
            //http://117.28.248.23:9388/test/api/CRMAPP/LIST_CITY
            var url=ROOTCONFIG.hempConfig.basePath + "LIST_CITY";
            var data={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": window.localStorage.crmUserName },
                "I_COUNTRY": $scope.countryCode,
                "I_MODE": "B",
                "I_REGION": ""
            };
            HttpAppService.post(url,data).success(function(response){
                $.each(response.ET_CITY.item, function (n, value) {
                    $scope.provence.push(value);
                })

            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
            });
        };
        $scope.cascade2=function(){
            //http://117.28.248.23:9388/test/api/CRMAPP/LIST_CITY
            var url=ROOTCONFIG.hempConfig.basePath +'LIST_CITY';
            var data={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": window.localStorage.crmUserName },
                "I_COUNTRY": $scope.countryCode,
                "I_MODE": "C",
                "I_REGION": $scope.provenceCode
            };
            HttpAppService.post(url,data).success(function(response){
                if(response.ET_CITY.item.length===undefined){
                    $scope.city=new Array;
                }else{
                    $.each(response.ET_CITY.item, function (n, value) {
                        $scope.city.push(value);
                    })
                }
            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
            });
        };
        $scope.cascade();
            $scope.chang1=function(){
                console.log(angular.toJson($scope.config)+'称谓');
                //console.log($scope.config.currentLanguage.typeId+'语言');
            };
            if($scope.config.currentCountry!=null||$scope.config.currentCountry!=undefined){
                $scope.countryCode= "CN";
                $scope.provence=new Array;
                $scope.city=new Array;
                $scope.cascade1();
            }
            if($scope.config.currentProvence!=""||$scope.config.currentProvence!=undefined){
                console.log($scope.currentProvence);
                $scope.provenceCode=$scope.currentProvence;
                $scope.city=new Array;
                $scope.cascade2();
            }
        $scope.changCountry=function(){
            $scope.provence=new Array;
            $scope.city=new Array;
            console.log($scope.config.currentCountry);
            $scope.countryCode= $scope.config.currentCountry;
            $scope.cascade1();
        };
            $scope.chang2=function(){
                console.log(angular.toJson($scope.config)+'城市');
            };
        $scope.changProvence=function(){
            $scope.city=new Array;
            console.log($scope.config);
            $scope.provenceCode=$scope.config.currentProvence;
            $scope.cascade2();
        };
        $scope.init=function(){
            $scope.country=new Array;
            $scope.provence=new Array;
            $scope.city=new Array;
        };

    }]);

