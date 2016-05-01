/**
 * Created by zhangren on 16/4/17.
 */
salesModule
    .controller('addRelationsCtrl', ['$scope', '$rootScope',
        '$state',
        '$timeout',
        '$ionicLoading',
        '$ionicPopover',
        '$ionicModal',
        '$cordovaToast',
        '$ionicScrollDelegate',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        'saleActService',
        'Prompter',
        'HttpAppService',
        'relationService',
        'LoginService',
        function ($scope, $rootScope, $state, $timeout, $ionicLoading, $ionicPopover, $ionicModal, $cordovaToast, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, saleActService, Prompter, HttpAppService, relationService,LoginService) {
            $scope.role = LoginService.getProfileType();
            //是否单选
            $scope.isReplace = relationService.isReplace;
            //替换对象
            var replaceMan = relationService.replaceMan;
            //替换对象的数组序号
            var repTempIndex = relationService.repTempIndex;
            $scope.isDropShow = true;
            //已有的相关方列表
            var myRelations = relationService.myRelations;
            //从活动跳转过来
            $scope.selectPopText = relationService.position;
            $scope.moreflag = false;
            $scope.relationsPopArr = relationService.saleActSelections;
            $scope.relationArr = [];
            $scope.input = {relation:''};
            //相关方里面的客户,用来查联系人
            var relationCustomer = relationService.relationCustomer;
            var relationPage = 1;
            $scope.getRelationsArr = function (search) {
                switch ($scope.selectPopText) {
                    case '客户':
                        getFormalCustomer(search);
                        break;
                    case '联系人':
                        getContacts(search);
                        break;
                    case 'CATL销售':
                        getStaff(search);
                        break;
                    case 'ATL销售':
                        getStaff(search);
                        break;
                    case'竞争对手':
                        getFormalCustomer(search, true);
                        break;
                    case 'CATL销售2':
                        getStaff(search);
                        break
                    case 'ATL销售2':
                        getStaff(search);
                        break
                }
            };
            var getContacts = function (search) {
                $scope.isError = false;
                if (search) {
                    $scope.relationArr = [];
                    $scope.relationSearch = false;
                    relationPage = 1;
                } else {
                    $scope.relationrelationSpinnerFlag = true;
                }
                var data = {
                    "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_AUTHORITY": {"BNAME": window.localStorage.crmUserName},
                    "IS_PAGE": {
                        "CURRPAGE": relationPage++,
                        "ITEMS": "10"
                    },
                    "IS_PARTNER": {"PARTNER": relationCustomer.PARTNER},
                    "IS_SEARCH": {"SEARCH": $scope.input.relation}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST', data)
                    .success(function (response, status, headers, config) {
                        if (config.data.IS_SEARCH.SEARCH != $scope.input.relation) {
                            return;
                        }
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            angular.forEach(response.ET_OUT_LIST.item, function (data) {
                                data.NAME = data.NAME_LAST + "";
                            });
                            if (search) {
                                $scope.relationArr = response.ET_OUT_LIST.item;
                            } else {
                                $scope.relationArr = $scope.relationArr.concat(response.ET_OUT_LIST.item);
                            }
                            initSelect();
                            $scope.relationSpinnerFlag = false;
                            $scope.relationSearch = true;
                            if (response.ET_OUT_LIST.item.length < 10) {
                                $scope.relationSpinnerFlag = false;
                                $scope.relationSearch = false;
                            }
                            $ionicScrollDelegate.resize();
                            //saleActService.customerArr = $scope.customerArr;
                            $rootScope.$broadcast('scroll.infiniteScrollComplete');
                        } else if{
                            Prompter.showShortToastBotton(response.ES_RESULT.ZRESULT);
                            $scope.relationSpinnerFlag = false;
                            $scope.relationSearch = false;
                            $scope.isError = true;
                        }
                    });
            };
            var getFormalCustomer = function (search, type) {
                $scope.isError = false;
                if (search) {
                    $scope.relationArr = [];
                    $scope.relationSearch = false;
                    relationPage = 1;
                } else {
                    $scope.relationrelationSpinnerFlag = true;
                }
                if (type) {
                    var rltyp;
                    if(Prompter.isATL()){
                        rltyp = 'ZATL05';
                    }else{
                        rltyp = 'Z00002';
                    }
                    var data = {
                        "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                        "IS_PAGE": {
                            "CURRPAGE": relationPage++,
                            "ITEMS": "10"
                        },
                        "IS_SEARCH": {"SEARCH": $scope.input.relation},
                        "IT_IN_ROLE": {
                            "item1": {"RLTYP": rltyp}
                        },
                        "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName }
                    };
                } else {
                    var data = {
                        "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                        "IS_PAGE": {
                            "CURRPAGE": relationPage++,
                            "ITEMS": "10"
                        },
                        "IS_SEARCH": {"SEARCH": $scope.input.relation},
                        "IT_IN_ROLE": {},
                        "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName }
                    };
                }
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST', data)
                    .success(function (response, status, headers, config) {
                        if (config.data.IS_SEARCH.SEARCH != $scope.input.relation) {
                            return;
                        }
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            angular.forEach(response.ET_OUT_LIST.item, function (data) {
                                data.NAME = data.NAME_ORG1 + "";
                            });
                            if (search) {
                                $scope.relationArr = response.ET_OUT_LIST.item;
                            } else {
                                $scope.relationArr = $scope.relationArr.concat(response.ET_OUT_LIST.item);
                            }
                            initSelect();
                            $scope.relationSpinnerFlag = false;
                            $scope.relationSearch = true;
                            if (response.ET_OUT_LIST.item.length < 10) {
                                $scope.relationSpinnerFlag = false;
                                $scope.relationSearch = false;
                            }
                            $ionicScrollDelegate.resize();
                            //saleActService.customerArr = $scope.customerArr;
                            $rootScope.$broadcast('scroll.infiniteScrollComplete');
                        } else {
                            Prompter.showShortToastBotton(response.ES_RESULT.ZRESULT);
                            $scope.relationSpinnerFlag = false;
                            $scope.relationSearch = false;
                            $scope.isError = true;
                        }
                    });
            };
            var getStaff = function (search) {
                $scope.isError = false;
                if (search) {
                    $scope.relationArr = [];
                    $scope.relationSearch = false;
                    relationPage = 1;
                } else {
                    $scope.relationrelationSpinnerFlag = true;
                }
                var data = {
                    "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_PAGE": {
                        "CURRPAGE": relationPage++,
                        "ITEMS": "10"
                    },
                    "IS_EMPLOYEE": {"NAME": $scope.input.relation}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST', data)
                    .success(function (response, status, headers, config) {
                        if (config.data.IS_EMPLOYEE.NAME != $scope.input.relation) {
                            return;
                        }
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            angular.forEach(response.ET_EMPLOYEE.item, function (data) {
                                data.NAME = data.NAME_LAST + "";
                            });
                            if (search) {
                                $scope.relationArr = response.ET_EMPLOYEE.item;
                            } else {
                                $scope.relationArr = $scope.relationArr.concat(response.ET_EMPLOYEE.item);
                            }
                            initSelect();
                            $scope.relationSpinnerFlag = false;
                            $scope.relationSearch = true;
                            if (response.ET_EMPLOYEE.item.length < 10) {
                                $scope.relationSpinnerFlag = false;
                                $scope.relationSearch = false;
                            }
                            $ionicScrollDelegate.resize();
                            $rootScope.$broadcast('scroll.infiniteScrollComplete');
                        } else {
                            Prompter.showShortToastBotton(response.ES_RESULT.ZRESULT);
                            $scope.relationSpinnerFlag = false;
                            $scope.relationSearch = false;
                            $scope.isError = true;
                        }
                    });
            };
            var initSelect = function () {
                angular.forEach(myRelations, function (x) {
                    angular.forEach($scope.relationArr, function (y) {
                        if (x.PARTNER == y.PARTNER) {
                            y.flag = true;
                        }
                    })
                });
            };
            $scope.initRelationSearch = function () {
                $scope.relationArr = [];
                $scope.input.relation = '';
                $scope.getRelationsArr();
                $timeout(function () {
                    document.getElementById('relationSearchId').focus();
                }, 1)
            };
            $scope.hideRelations = function () {
                $scope.addReleModal.remove();
                $timeout(function () {
                    $scope.hideSelections();
                }, 300)
            };
            $scope.selectPop_rel = function (x) {
                if ($scope.selectPopText != x.text) {
                    relationPage = 1;
                    $scope.selectPopText = x.text;
                    $scope.relationArr = [];
                    $scope.relationSearch = false;
                    $scope.getRelationsArr();
                    $scope.changeMoreFlag();
                } else {
                    //$scope.selectPopText = x.text;
                    $scope.changeMoreFlag();
                }
            };
            var getRelationFCT = function () {
                for (var i = 0; i < $scope.relationsPopArr.length; i++) {
                    if ($scope.relationsPopArr[i].text == $scope.selectPopText) {
                        return $scope.relationsPopArr[i].code;
                    }
                }
            };
            $scope.addRelationModal = function (x) {
                if ($scope.selectPopText == '客户' && !angular.isUndefined(relationService.relationCustomer.position)) {
                    Prompter.alert('已存在客户!');
                    return
                }
                x.flag = true;
                //已选的人不要再添加
                angular.forEach($scope.relationArr, function (data) {
                    if (data.flag) {
                        var temp = 0;
                        angular.forEach(myRelations, function (x) {
                            if (x.PARTNER == data.PARTNER) {
                                temp++;
                            }
                        });
                        if (temp == 0) {
                            data.PARTNER_FCT = getRelationFCT();
                            data.position = $scope.selectPopText;
                            data.mode = "I";
                            myRelations.push(data);
                        } else {
                        }
                    }
                });
                if ($scope.selectPopText == '客户') {
                    x.PARTNER_FCT = getRelationFCT();
                    relationService.relationCustomer = x;
                    relationService.chanceDetailPartner.PARTNER_TXT = x.NAME;
                    relationService.chanceDetailPartner.customerName = x.NAME;
                }
                $scope.hideRelations();
            };
            $scope.replaceRelation = function (x) {
                //angular.forEach($scope.relationSelections, function (data) {
                //    data.flag = false;
                //});
                x.flag = true;
                x.position = $scope.selectPopText;
                x.PARTNER_FCT = getRelationFCT();
                if (angular.isUndefined(replaceMan.mode)) {
                    x.mode = "U";
                }
                if (angular.isUndefined(replaceMan.old)) {
                    x.old = replaceMan;
                } else {
                    x.old = replaceMan.old;
                }
                myRelations[repTempIndex] = x;
                if ($scope.selectPopText == '客户') {
                    x.PARTNER_FCT = getRelationFCT();
                    relationService.relationCustomer = x;
                    relationService.chanceDetailPartner.PARTNER_TXT = x.NAME;
                    relationService.chanceDetailPartner.customerName = x.NAME;
                }
                $scope.hideRelations();
            };
            $scope.changeMoreFlag = function () {
                $scope.moreflag = !$scope.moreflag;
            };
            $scope.hideSelections = function () {
                $scope.moreflag = false;
                $scope.isDropShow = false;
            };

            //初始化
            $scope.getRelationsArr();

        }]);