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
        function ($scope, $rootScope, $state, $timeout, $ionicLoading, $ionicPopover, $ionicModal, $cordovaToast, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, saleActService, Prompter, HttpAppService, relationService) {
            console.log('添加相关方');
            //是否单选
            $scope.isReplace = relationService.isReplace;
            //替换对象
            var replaceMan = relationService.replaceMan;
            //替换对象的数组序号
            var repTempIndex = relationService.repTempIndex;
            console.log(replaceMan)
            $scope.isDropShow = true;
            //已有的相关方列表
            var myRelations = relationService.myRelations;
            console.log(myRelations);
            //从活动跳转过来
            $scope.selectPopText = relationService.position;
            $scope.moreflag = false;
            $scope.relationsPopArr = relationService.saleActSelections;
            $scope.relationSelections = saleActService.getRelationSelections();
            $scope.relationArr = [];

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
                        break
                }
            };
            var getContacts = function (search) {
                $scope.relationLoadMoreFlag = false;
                if (search) {
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
                    "IS_SEARCH": {"SEARCH": search}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST', data)
                    .success(function (response) {
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            angular.forEach(response.ET_OUT_LIST.item, function (data) {
                                data.NAME = data.NAME_LAST + "";
                            });
                            if (response.ET_OUT_LIST.item.length < 10) {
                                $scope.relationLoadMoreFlag = false;
                            }
                            if (search) {
                                $scope.relationArr = response.ET_OUT_LIST.item;
                            } else {
                                $scope.relationArr = $scope.relationArr.concat(response.ET_OUT_LIST.item);
                            }
                            $scope.relationSpinnerFlag = false;
                            $scope.relationSearch = true;
                            $scope.relationLoadMoreFlag = true;
                            $ionicScrollDelegate.resize();
                            //saleActService.customerArr = $scope.customerArr;
                            $rootScope.$broadcast('scroll.infiniteScrollComplete');
                        }else{
                            Prompter.alert(response.ES_RESULT.ZRESULT);
                            $scope.relationSpinnerFlag = true;
                            $scope.relationSearch = true;
                        }
                    });
            };
            var getFormalCustomer = function (search) {
                $scope.relationLoadMoreFlag = false;
                if (search) {
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
                    "IS_SEARCH": {"SEARCH": search},
                    "IT_IN_ROLE": {}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST', data)
                    .success(function (response) {
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            angular.forEach(response.ET_OUT_LIST.item, function (data) {
                                data.NAME = data.NAME_ORG1 + "";
                            });
                            if (response.ET_OUT_LIST.item.length < 10) {
                                $scope.relationLoadMoreFlag = false;
                            }
                            if (search) {
                                $scope.relationArr = response.ET_OUT_LIST.item;
                            } else {
                                $scope.relationArr = $scope.relationArr.concat(response.ET_OUT_LIST.item);
                            }
                            $scope.relationSpinnerFlag = false;
                            $scope.relationSearch = true;
                            $scope.relationLoadMoreFlag = true;
                            $ionicScrollDelegate.resize();
                            //saleActService.customerArr = $scope.customerArr;
                            $rootScope.$broadcast('scroll.infiniteScrollComplete');
                        }else{
                            Prompter.alert(response.ES_RESULT.ZRESULT);
                            $scope.relationSpinnerFlag = true;
                            $scope.relationSearch = true;
                        }
                    });
            };
            var getStaff = function (search) {
                $scope.relationLoadMoreFlag = false;
                if (search) {
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
                    "IS_EMPLOYEE": {"NAME": search}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST', data)
                    .success(function (response) {
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            angular.forEach(response.ET_EMPLOYEE.item, function (data) {
                                data.NAME = data.NAME_LAST + "";
                            });
                            if (response.ET_EMPLOYEE.item.length < 10) {
                                $scope.relationLoadMoreFlag = false;
                            }
                            if (search) {
                                $scope.relationArr = response.ET_EMPLOYEE.item;
                            } else {
                                $scope.relationArr = $scope.relationArr.concat(response.ET_EMPLOYEE.item);
                            }
                            $scope.relationSpinnerFlag = false;
                            $scope.relationSearch = true;
                            $scope.relationLoadMoreFlag = true;
                            $ionicScrollDelegate.resize();
                            //saleActService.customerArr = $scope.customerArr;
                            $rootScope.$broadcast('scroll.infiniteScrollComplete');
                        }else{
                            Prompter.alert(response.ES_RESULT.ZRESULT);
                            $scope.relationSpinnerFlag = true;
                            $scope.relationSearch = true;
                        }
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
                    $scope.selectPopText = x.text;
                    $scope.changeMoreFlag();
                }
            };
            $scope.addRelationModal = function (x) {
                if($scope.selectPopText=='客户'&&relationCustomer){
                    Prompter.alert('已存在客户!');
                    return
                }
                x.flag = true;
                angular.forEach($scope.relationArr, function (data) {
                    if (data.flag && myRelations.indexOf(data) == -1) {
                        data.position = $scope.selectPopText;
                        myRelations.push(data);
                    }
                });
                if($scope.selectPopText=='客户'){
                    relationService.relationCustomer = x;
                }
                console.log(myRelations);
                $scope.hideRelations();
            };
            $scope.replaceRelation = function (x) {
                angular.forEach($scope.relationSelections, function (data) {
                    data.flag = false;
                });
                x.flag = true;
                x.position = $scope.selectPopText;
                myRelations[repTempIndex] = x;
                if($scope.selectPopText=='客户'){
                    relationService.relationCustomer = x;
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