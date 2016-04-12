/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
ContactsModule
    .controller('contactQueryCtrl',['$scope','$rootScope','$state','$http','HttpAppService','$timeout','$ionicPopover','$ionicActionSheet','$window','$cordovaToast','$ionicScrollDelegate','ionicMaterialInk','contactService','$ionicLoading',function($scope,$rootScope,$state,$http,HttpAppService,$timeout,$ionicPopover,$ionicActionSheet,$window,$cordovaToast,$ionicScrollDelegate,ionicMaterialInk,contactService,$ionicLoading){
        //历史记录显示
        $scope.ContactListHistoryval = function(){
            $scope.contacts_userqueryflag = false;
            if(storedb('contactdb').find() != undefined || storedb('contactdb').find() != null) {
                $scope.contact_query_historylists = (storedb('contactdb').find());
                if ($scope.contact_query_historylists.length > 5) {
                    $scope.contact_query_historylists = $scope.contact_query_historylists.slice(0, 5);
                }
                ;
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
            $scope.contact.contactfiledvalue ='';
            $scope.ContactListHistoryval();
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
        $scope.contact_query_list = new Array;
        $scope.conitemImPage = 0;
        $scope.contactLoadmore = function() {
            //$scope.contactisshow = true;
            $scope.conitemImPage = $scope.conitemImPage + 1;
            var url = ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST';
            var data = {
                "I_SYSNAME": { "SysName": "CATL" },
                "IS_AUTHORITY": { "BNAME": "" },
                "IS_PAGE": {
                    "CURRPAGE": $scope.conitemImPage,
                    "ITEMS": "10"
                },
                "IS_PARTNER": { "PARTNER": "" },
                "IS_SEARCH": { "SEARCH": $scope.contact.contactfiledvalue}
            }
            console.log("data"+angular.toJson(data));
            console.log("name"+angular.toJson(data.IS_SEARCH.SEARCH));
            console.log("number"+angular.toJson(data.IS_PAGE.CURRPAGE));
            HttpAppService.post(url, data).success(function (response) {
                console.log(angular.toJson(response.ET_EMPLOYEE));
                if (response.ES_RESULT.ZFLAG == 'E') {
                    $scope.contactisshow = false;
                    //$cordovaToast.showShortCenter(response.ES_RESULT.ZRESULT);
                    $cordovaToast.showShortCenter("没有符合搜索条件的数据")
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    if (response.ES_RESULT.ZFLAG == 'S') {
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
                                    $scope.contact_query_list.push(value);
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
        }
        //实时搜索
        //实时搜索变量初始化一次flag
        $scope.contactinitflag = true;
        $scope.contact ={contactfiledvalue :''};
        var contatctimer;
        setTimeout(function(){
            document.getElementById('contactqueryinput').style.display = "none";
            document.getElementById('contactinputvalueid').addEventListener("keyup", function () {//监听密码输入框，如果有值显示一键清除按钮
                if(!$scope.$$phase) {
                    $scope.$apply();
                };
                $scope.contactisshow = false;
                clearTimeout(contatctimer);
                contatctimer = setTimeout(function() {
                    if (document.getElementById('contactinputvalueid').value.length > 0) {
                        document.getElementById('contactqueryinput').style.display = "inline-block";
                        $scope.$apply(function(){
                            $scope.contactisshow = false;
                            //删除请求
                            $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST')
                            $scope.contact_query_list = [];
                            $scope.contact_query_list = new Array;
                            $scope.conitemImPage = 0;
                        });
                        $scope.contacts_userqueryflag = true;
                        $ionicScrollDelegate.resize();
                        $scope.contactisshow = true;
                        if(!$scope.$$phase) {
                            $scope.$apply();
                        };
                    } else {
                        //删除请求
                        $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST')
                        $scope.contactisshow = false;
                        if(!$scope.$$phase) {
                            $scope.$apply();
                        };
                        $ionicScrollDelegate.resize();
                        document.getElementById('contactqueryinput').style.display = "none";
                    }
                }, 500);

            });
        },50);
        $scope.contactiputDeletevalue = function(){
            $scope.contact.contactfiledvalue ='';
        };

        //清除历史记录
        $scope.ContactsClearhis = function(){
            storedb('contactdb').remove();
            $scope.contact_query_historylists = [];
        };
        //点击历史记录开始请求
        $scope.ContactHisGetvalue = function(value){
            $scope.contact.contactfiledvalue = value.name;
            $scope.contact_query_list = [];
            $scope.contact_query_list = new Array;
            $scope.conitemImPage = 0;
            $scope.contacts_userqueryflag = true;
            $ionicScrollDelegate.resize();
            $scope.contactisshow = true;
            if(!$scope.$$phase) {
                $scope.$apply();
            };
        }
        $scope.contacthislistvalue = new Array();
        $scope.Contacts_godetails = function(x){
            $scope.contactisshow = false;
            //存储历史记录
            $scope.usuallycontactlist = x;
            if($scope.contact.contactfiledvalue != ''){
                if(storedb('contactdb').find() != undefined || storedb('contactdb').find() != null){
                    var conatcthislistvalue = storedb('contactdb').find();
                    var contacthislistvaluelength = storedb('contactdb').find().length;
                    //判断是否有相同的值
                    var contacthislistflag = true;
                    for(var i=0;i<contacthislistvaluelength;i++){
                        if(conatcthislistvalue[i].name ==  $scope.contact.contactfiledvalue){
                            //删除原有的，重新插入
                            storedb('contactdb').remove({"name":conatcthislistvalue[i].name}, function (err) {
                                if (!err) {
                                } else {
                                }
                            })
                            //storedb('customerdb').find().splice(i,1);
                            storedb('contactdb').insert({"name": $scope.contact.contactfiledvalue}, function (err) {
                                if (!err) {
                                } else {
                                    $cordovaToast.showShortBottom('历史记录保存失败');
                                }
                            });
                            contacthislistflag = false;
                        }
                    };
                    if(contacthislistflag == true){
                        storedb('contactdb').insert({"name": $scope.contact.contactfiledvalue}, function (err) {
                            if (!err) {
                                //console.log('历史记录保存成功')
                            } else {
                                $cordovaToast.showShortBottom('历史记录保存失败');
                            }
                        });
                    }
                }else{
                    storedb('contactdb').insert({"name": $scope.contact.contactfiledvalue}, function (err) {
                        if (!err) {
                            //console.log('历史记录保存成功')
                        } else {
                            $cordovaToast.showShortBottom('历史记录保存失败');
                        }
                    });
                };
            };


            //存储常用联系人
            if (JSON.parse(localStorage.getItem("usuacontactdb")) != null || JSON.parse(localStorage.getItem("usuacontactdb")) != undefined) {
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



            contactService.set_ContactsListvalue(x);
            $state.go('ContactDetail');
        };
        //广播添加联系人
        //$rootScope.$on('contactCreatevalue', function(event, data) {
        //    $scope.contact_query_list.push(contactService.get_ContactCreatevalue());
        //    console.log($scope.contact_query_list)
        //});

        //拨打电话手机
        $scope.conatct_querynumber = function(data){
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

    }])
    .controller('contactDetailCtrl',['$scope','$rootScope','$state','$ionicHistory','Prompter','HttpAppService','$cordovaToast','$ionicLoading','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','contactService','$window','$ionicActionSheet',function($scope,$rootScope,$state,$ionicHistory,Prompter,HttpAppService,$cordovaToast,$ionicLoading,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,contactService,$window,$ionicActionSheet){
        ////定制从联系人详细界面进入列表界面改变界面flag
        ////返回回退
        $scope.ContactgoBack = function() {
            $rootScope.$broadcast('contactdeatillist');
            $ionicHistory.goBack();
        }
       //获取数据
        Prompter.showLoading("数据加载中...");
        var url = ROOTCONFIG.hempConfig.basePath + 'CONTACT_DETAIL';
        var data = {
            "I_SYSNAME": { "SysName": "CATL" },
            "IS_AUTHORITY": { "BNAME": "" },
            "IS_PARTNER": { "PARTNER": contactService.get_ContactsListvalue().PARTNER}
            //"IS_PARTNER": { "PARTNER":'6000000385'}
        };
        HttpAppService.post(url, data).success(function (response) {
            Prompter.hideLoading();
            if (response.ES_RESULT.ZFLAG == 'E') {
                $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
            } else {
                if(response.ET_OUT_CONTACT != ''){
                    $scope.contactdetails = response.ET_OUT_CONTACT.item;
                }
                //注释字段获取
                if(response.ET_LINES != ''){
                    $scope.conatctdeatilnotelist = response.ET_LINES.item;
                    $scope.conatctdeatilnote = '';
                    $scope.conatctdeatilnotelenght = $scope.conatctdeatilnotelist.length;
                    for(var i=0;i<$scope.conatctdeatilnotelenght;i++){
                        $scope.conatctdeatilnote += $scope.conatctdeatilnotelist[i].TDLINE;
                    };
                    $scope.contactdetails.conatctdeatilnote =$scope.conatctdeatilnote;
                }
                //销售员工字段获取
                if(response.ET_OUT_RELATION != ''){
                    //处理返回数据item是一条的时候
                        $scope.conatctdeatilsaleslist = response.ET_OUT_RELATION.item;
                        $scope.conatctdeatilsalslenght = $scope.conatctdeatilsaleslist.length;
                        for(var i=0;i<$scope.conatctdeatilsalslenght;i++){
                            if( $scope.conatctdeatilsaleslist[i].BEZ50 == '负责员工是'){
                                $scope.contactdetails.relationsalsname = $scope.conatctdeatilsaleslist[i].NAME_LAST;
                            }
                        }
                        //为联系人-关系界面保存数据(联系人详情界面的item)
                        contactService.set_ContactsdeaRelationval(response.ET_OUT_RELATION.item)
                    }
                }

        }).error(function(){
            Prompter.hideLoading();
            $cordovaToast.showShortBottom('请检查你的网络设备');
        });



        $scope.customer_detailstypes = [{
            typemane:'活动',
            imgurl:'img/customer/customerhuod.png',
        },{
            typemane:'机会',
            imgurl:'img/customer/customerjihui@2x.png',
        },{
            typemane:'关系',
            imgurl:'img/contact/relationship@2x.png',
            url:'ContactsRelationship',
        }];
        $scope.GocontactLists = function(convalue){
            if(convalue.url){
                $state.go(convalue.url);
            }
        }
        //$scope.Contacts_showTitle = false;
        //$scope.Contacts_TitleFlag=false;
        //$scope.Contacts_TitletranstionFlag = false;
        //
        //var Contacts_position;
        //$scope.customerContacts_onScroll = function () {
        //    Contacts_position = $ionicScrollDelegate.getScrollPosition().top;
        //    if (Contacts_position > 16) {
        //        $scope.Contacts_TitleFlag = true;
        //        $scope.Contacts_showTitle = true;
        //        if (Contacts_position > 20) {
        //            $scope.Contacts_customerFlag = true;
        //        } else {
        //            $scope.Contacts_customerFlag = false;
        //        }
        //        if (Contacts_position > 28) {
        //            $scope.Contacts_placeFlag = true;
        //        } else {
        //            $scope.Contacts_placeFlag = false;
        //        }
        //        if (Contacts_position > 50) {
        //            $scope.Contacts_phoneFlag = true;
        //        } else {
        //            $scope.Contacts_phoneFlag = false;
        //        }
        //        if (Contacts_position > 80) {
        //            $scope.Contacts_mobileFlag = true;
        //        } else {
        //            $scope.Contacts_mobileFlag = false;
        //        }
        //
        //        if (Contacts_position > 95) {
        //            $scope.Contacts_addressFlag = true;
        //        } else {
        //            $scope.Contacts_addressFlag = false;
        //        }
        //        if (Contacts_position > 120) {
        //            $scope.Contacts_empolFlag = true;
        //        } else {
        //            $scope.Contacts_empolFlag = false;
        //        }
        //        if (Contacts_position > 154) {
        //            $scope.Contacts_showTitle = false;
        //            $scope.Contacts_TitletranstionFlag = true;
        //        }else{
        //            $scope.Contacts_showTitle = true;
        //            $scope.Contacts_TitletranstionFlag = false;
        //        }
        //    } else {
        //        $scope.Contacts_customerFlag = false;
        //        $scope.Contacts_placeFlag = false;
        //        $scope.Contacts_typeFlag = false;
        //        $scope.Contacts_addressFlag = false;
        //        $scope.Contacts_empolFlag = false;
        //        $scope.Contacts_showTitle = false;
        //        $scope.Contacts_TitleFlag=false;
        //        $scope.customer_showtarnsitionTitle = false;
        //
        //    }
        //    if(!$scope.$$phase) {
        //        $scope.$apply();
        //    }
        //}

        //电话
        $scope.contactshowphone =function(types){
            if(types == undefined || types == ""){
                $cordovaToast.showShortBottom('没有数据');
            }else{
                Prompter.showphone(types)
            }
        }
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
        });

        $scope.contact_deatilgoedit = function(){
            //判断数据是否获取成功
            if($scope.contactdetails !=undefined ||  $scope.contactdetails != ""){
                contactService.set_Contactsdetailvalue($scope.contactdetails);
                $state.go("ContactsEdit");
            }else{
                $cordovaToast.showShortBottom("数据获取失败,不能编辑");
            }
        }
    }])
    .controller('contactCreateCtrl',['$scope','$rootScope','$ionicHistory','$state','Prompter','$cordovaDatePicker','saleActService','HttpAppService','$cordovaToast','$ionicModal','$ionicLoading','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','contactService','$window','$ionicActionSheet',function($scope,$rootScope,$ionicHistory,$state,Prompter,$cordovaDatePicker,saleActService,HttpAppService,$cordovaToast,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,contactService,$window,$ionicActionSheet){
        //初始化数据

        $scope.contactlistvaluesel = [{
            name:'先生',
        },{
            name:'小姐'
        }];
        $scope.contactcreat = {
            conatctdeatilnote:"",
            TITLE:"",
            FAX_NUMBER:"",
            FAX_EXTENS:"",
            DPRTMNT:"",
            FNCTN:"",
            COUNTRY:"",
            BEZEI:"",
            CITY1:"",
            REGION:"",
            POST_CODE1:"",
            BIRTHDT:"",
            LANGU:"",
            NAME_LAST:"",
            TEL_NUMBER:"",
            MOB_NUMBER:"",
            STREET:"",
            //不需要改的
            PARTNER2:"",
            //relationsalsname:"",
            //PARTNER:"",
        };
        //创建
        $scope.contactCreatevalue = function(){
            Prompter.showLoading("数据保存中...");
            var url = ROOTCONFIG.hempConfig.basePath + 'CONTACT_CHANGE';
            var data = {
                "I_SYSTEM": { "SysName": "CATL" },
                "IS_AUTHORITY": { "BNAME": "" },
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
                    "SMTP_ADDR": "888888@qq.com",
                    "BAPIBNAME": "HANDLCX",
                    "MODE": "I"
                },
                "IT_LINES": {
                    "item": {
                        "TDFORMAT": "",
                        "TDLINE": ""
                    }
                }
            };
            data.IS_CUSTOMER.PARTNER2 = $scope.contactcreat.PARTNER2;
            data.IS_CUSTOMER.TITLE = $scope.contactcreat.TITLE;
            data.IS_CUSTOMER.NAME_LAST = $scope.contactcreat.NAME_LAST;
            data.IS_CUSTOMER.BIRTHDT = $scope.contactcreat.BIRTHDT;
            data.IS_CUSTOMER.LANGU = $scope.contactcreat.LANGU;
            data.IS_CUSTOMER.FNCTN = $scope.contactcreat.FNCTN;
            data.IS_CUSTOMER.DPRTMNT = $scope.contactcreat.DPRTMNT;
            data.IS_CUSTOMER.COUNTRY = $scope.contactcreat.COUNTRY;
            data.IS_CUSTOMER.REGION = $scope.contactcreat.REGION;
            data.IS_CUSTOMER.CITY1 = $scope.contactcreat.CITY1;
            data.IS_CUSTOMER.POST_CODE1 = $scope.contactcreat.POST_CODE1;
            data.IS_CUSTOMER.STREET = $scope.contactcreat.STREET;
            data.IS_CUSTOMER.TEL_NUMBER = $scope.contactcreat.TEL_NUMBER;
            data.IS_CUSTOMER.MOB_NUMBER = $scope.contactcreat.MOB_NUMBER;
            data.IS_CUSTOMER.FAX_NUMBER = $scope.contactcreat.FAX_NUMBER;
            data.IS_CUSTOMER.FAX_EXTENS = $scope.contactcreat.FAX_EXTENS;

            //根据登陆接口来判断 角色字段的类型
            var rolevalue = ' ';
            if(rolevalue == '销售'){
                data.IS_CUSTOMER.PARTNERROLE == 'BUP001';
            }else{
                data.IS_CUSTOMER.PARTNERROLE == 'Z00005';
            }
            if(data.IS_CUSTOMER.PARTNER2 == '' || data.IS_CUSTOMER.PARTNER2 == undefined
                || data.IS_CUSTOMER.NAME_LAST == ''|| data.IS_CUSTOMER.NAME_LAST == undefined
                || data.IS_CUSTOMER.COUNTRY == '' || data.IS_CUSTOMER.COUNTRY == undefined){

                console.log("data.IS_CUSTOMER.PARTNER2"+data.IS_CUSTOMER.PARTNER2)
                console.log("data.IS_CUSTOMER.NAME_LAST"+data.IS_CUSTOMER.NAME_LAST)
                console.log("data.IS_CUSTOMER.COUNTRY"+data.IS_CUSTOMER.COUNTRY)
                $cordovaToast.showShortCenter('请输入客户姓名,标识或国家');
                //console.log("请输入客户");
                Prompter.hideLoading();


            }else{
                HttpAppService.post(url, data).success(function (response) {
                    Prompter.hideLoading();
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        console.log(response.ES_RESULT.ZRESULT);
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                        //$state.go('ContactDetail');
                    } else {
                        $cordovaToast.showShortCenter('保存数据成功');
                        //console.log("保存创建成功")
                        //$scope.contactKeepCreatevalue = function(){
                            //contactService.set_ContactCreatevalue($scope.contactcreat);
                            //广播修改详细信息界面的数据
                            if(contactService.get_ContactCreateflag() == true){
                                contactService.set_ContactCreateflagfalse();
                                //$rootScope.$broadcast('contactCreatevalue');
                                $state.go('ContactQuery');
                            }else{
                                //$rootScope.$broadcast('customercontactCreatevalue');
                                $state.go('customerContactQuery');
                            }
                            //$ionicHistory.goBack(-2);
                        //}
                    }
                }).error(function(){
                    Prompter.hideLoading();
                    $cordovaToast.showShortBottom('请检查你的网络设备');
                });
            }
        }
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
        $scope.conatactCavebr = function () {
            var Creoptionsdatedate = {
                date: new Date($scope.contactcreat.BIRTHDT),
                mode: 'date',
                titleText: '请选择时间',
                okText: '确定',
                cancelText: '取消',
                doneButtonLabel: '确认',
                cancelButtonLabel: '取消',
                locale: 'zh_cn',
                androidTheme: window.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
            }
            document.addEventListener("deviceready", function () {
                $cordovaDatePicker.show(Creoptionsdatedate).then(function (date) {
                    alert(date)
                    $scope.contactcreat.BIRTHDT = date.Format('yyyy-MM-dd');
                    alert($scope.contactcreat.BIRTHDT)
                })
            })
        };
        //选择客户

        var customerPage = 1;
        $scope.customerArr = new Array;;
        $scope.customerSearch = true;
        $scope.getCustomerArr = function (search) {
            if (search) {
                $scope.customerSearch = false;
                customerPage = 1;
            }else{
                $scope.spinnerFlag = true;
            }
            console.log(customerPage);
            var data = {
                "I_SYSNAME": {"SysName": "CATL"},
                "IS_PAGE": {
                    "CURRPAGE": customerPage++,
                    "ITEMS": "10"
                },
                "IS_SEARCH": {"SEARCH": search},
                "IT_IN_ROLE": {}
            };
            HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST', data)
                .success(function (response) {
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
                        $ionicScrollDelegate.resize();
                        saleActService.customerArr = $scope.customerArr;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                });
        };
        //$scope.searchCustomer = function () {
        //    console.log('searchCustomer');
        //};
        //$scope.getCustomerArr();
        $scope.getCustomerArr();

        $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/selectCustomer_Modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selectCustomerModal = modal;
        });
        $scope.customerModalArr = saleActService.getCustomerTypes();
        $scope.selectCustomerText = '竞争对手';
        $scope.openSelectCustomer = function () {
            $scope.isDropShow = true;
            $scope.selectCustomerModal.show();
        };
        $scope.closeSelectCustomer = function () {
            $scope.selectCustomerModal.hide();
        };
        $scope.selectPop = function (x) {
            $scope.selectCustomerText = x.text;
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
            $timeout(function () {
                document.getElementById('selectCustomerId').focus();
            }, 1)
        };
        $scope.selectCustomer = function (x) {
            $scope.contactcreat.PARTNER2 = x.NAME_ORG1;
            $scope.selectCustomerModal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.selectCustomerModal.remove();
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
    .controller('contactEditCtrl',['$scope','$rootScope','$timeout','$state','Prompter','$http','HttpAppService','$cordovaToast','$ionicLoading','$ionicScrollDelegate','$ionicPopup','$cordovaDatePicker','ionicMaterialInk','contactService','$window','$ionicActionSheet',function($scope,$rootScope,$timeout,$state,Prompter,$http,HttpAppService,$cordovaToast,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$cordovaDatePicker,ionicMaterialInk,contactService,$window,$ionicActionSheet){
        $scope.contactlistvaluesel = [{
            name:'先生',
        },{
            name:'小姐'
        }];
        $scope.contactedit = {
            conatctdeatilnote:contactService.get_Contactsdetailvalue().conatctdeatilnote,
            TITLE:contactService.get_Contactsdetailvalue().TITLE,
            FAX_NUMBER:contactService.get_Contactsdetailvalue().FAX_NUMBER,
            FAX_EXTENS:contactService.get_Contactsdetailvalue().FAX_EXTENS,
            DPRTMNT:contactService.get_Contactsdetailvalue().DPRTMNT,
            FNCTN:contactService.get_Contactsdetailvalue().FNCTN,
            COUNTRY:contactService.get_Contactsdetailvalue().COUNTRY,
            BEZEI:contactService.get_Contactsdetailvalue().BEZEI,
            CITY1:contactService.get_Contactsdetailvalue().CITY1,
            REGION:contactService.get_Contactsdetailvalue().REGION,
            POST_CODE1:contactService.get_Contactsdetailvalue().POST_CODE1,
            BIRTHDT:contactService.get_Contactsdetailvalue().BIRTHDT,
            LANGU:contactService.get_Contactsdetailvalue().LANGU,

            NAME_LAST:contactService.get_Contactsdetailvalue().NAME_LAST,
            TEL_NUMBER:contactService.get_Contactsdetailvalue().TEL_NUMBER,
            MOB_NUMBER:contactService.get_Contactsdetailvalue().MOB_NUMBER,
            STREET:contactService.get_Contactsdetailvalue().STREET,
        //不需要改的
            NAME_ORG1:contactService.get_Contactsdetailvalue().NAME_ORG1,
            relationsalsname:contactService.get_Contactsdetailvalue().relationsalsname,
            PARTNER:contactService.get_Contactsdetailvalue().PARTNER,
            PARTNER2:contactService.get_Contactsdetailvalue().PARTNER2,
        };

        ////点击取消事件
        $scope.EditCancel = function(){
           Prompter.ContactCreateCancelvalue();
        }
        //保存
        //日期的选择
        $scope.conatacteEavebr = function () {
            var optionsdatedate = {
                date: new Date($scope.contactedit.BIRTHDT),
                mode: 'date',
                titleText: '请选择时间',
                okText: '确定',
                cancelText: '取消',
                doneButtonLabel: '确认',
                cancelButtonLabel: '取消',
                locale: 'zh_cn',
                androidTheme: window.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
            }
            document.addEventListener("deviceready", function () {
                $cordovaDatePicker.show(optionsdatedate).then(function (date) {
                    alert(date)
                    $scope.contactedit.BIRTHDT = date.Format('yyyy-MM-dd');
                    alert($scope.contactedit.BIRTHDT)
                })
            })
        };
        //国家的选择



        $scope.contactKeepEditvalue = function(){
            contactService.set_Contactsdetailvalue($scope.contactedit);
            //提交修改数据
            Prompter.showLoading("数据保存中...");
            var url = ROOTCONFIG.hempConfig.basePath + 'CONTACT_CHANGE';
            var data = {
                "I_SYSTEM": { "SysName": "CATL" },
                "IS_AUTHORITY": { "BNAME": "" },
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
                    "REGION": "",
                    "CITY1": "",
                    "POST_CODE1": "",
                    "LANGU2": "",
                    "STREET": "",
                    "TEL_NUMBER": "",
                    "TEL_EXTENS": "88",
                    "MOB_NUMBER": "",
                    "FAX_NUMBER": "",
                    "FAX_EXTENS": "",
                    "SMTP_ADDR": "",
                    "BAPIBNAME": "HANDLCX",
                    "MODE": "a"
                },
                "IT_LINES": {
                    "item": {
                        "TDFORMAT": "",
                        "TDLINE": ""
                    }
                }
            };
            data.IS_CUSTOMER.PARTNER = $scope.contactedit.PARTNER;
            data.IS_CUSTOMER.PARTNER2 = contactService.get_Contactsdetailvalue().PARTNER2;
            //data.IS_CUSTOMER.PARTNER = '2284';
            data.IS_CUSTOMER.TITLE = $scope.contactedit.TITLE;
            data.IS_CUSTOMER.NAME_LAST = $scope.contactedit.NAME_LAST;
            data.IS_CUSTOMER.BIRTHDT = $scope.contactedit.BIRTHDT;
            data.IS_CUSTOMER.LANGU = $scope.contactedit.LANGU;
            data.IS_CUSTOMER.FNCTN = $scope.contactedit.FNCTN;
            data.IS_CUSTOMER.DPRTMNT = $scope.contactedit.DPRTMNT;
            data.IS_CUSTOMER.COUNTRY = $scope.contactedit.COUNTRY;
            data.IS_CUSTOMER.REGION = $scope.contactedit.REGION;
            data.IS_CUSTOMER.CITY1 = $scope.contactedit.CITY1;
            data.IS_CUSTOMER.POST_CODE1 = $scope.contactedit.POST_CODE1;
            data.IS_CUSTOMER.STREET = $scope.contactedit.STREET;
            data.IS_CUSTOMER.TEL_NUMBER = $scope.contactedit.TEL_NUMBER;
            data.IS_CUSTOMER.MOB_NUMBER = $scope.contactedit.MOB_NUMBER;
            data.IS_CUSTOMER.FAX_NUMBER = $scope.contactedit.FAX_NUMBER;
            data.IS_CUSTOMER.FAX_EXTENS = $scope.contactedit.FAX_EXTENS;
            data.IS_CUSTOMER.MODE = "U";
            //if(data.IS_CUSTOMER.NAME_LAST == ''|| data.IS_CUSTOMER.NAME_LAST == undefined || data.IS_CUSTOMER.PARTNER == ''|| data.IS_CUSTOMER.PARTNER == undefined){
            if(data.IS_CUSTOMER.NAME_LAST == ''|| data.IS_CUSTOMER.NAME_LAST == undefined
                || data.IS_CUSTOMER.COUNTRY == ''|| data.IS_CUSTOMER.COUNTRY == ''){
                $cordovaToast.showShortCenter('请输入客户姓名或国家');
                //console.log("请输入客户姓名或标识");
                Prompter.hideLoading();
            }else{
                HttpAppService.post(url, data).success(function (response) {
                    Prompter.hideLoading();
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        console.log(response.ES_RESULT.ZRESULT);
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                        //$state.go('ContactDetail');
                    } else {
                        $cordovaToast.showShortCenter('保存数据成功');
                        console.log("保存数据成功")
                        //广播修改详细信息界面的数据
                        $rootScope.$broadcast('contactEditvalue');
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
    }])

