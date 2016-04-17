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
        function ($scope, $rootScope, $state, $timeout, $ionicLoading, $ionicPopover, $ionicModal, $cordovaToast, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, saleActService, Prompter, HttpAppService) {
            console.log('添加相关方');
            $scope.isReplace = false;
            $scope.isDropShow = true;
            $scope.selectPopText = '正式客户';
            $scope.moreflag = false;
            $scope.relationsPopArr = saleActService.getRelationsPopArr();
            $scope.relationSelections = saleActService.getRelationSelections();
            var relationPage = 1;
            $scope.getRelations = function (search) {
                $scope.CustomerLoadMoreFlag = false;
                if (search) {
                    $scope.customerSearch = false;
                    relationPage = 1;
                } else {
                    $scope.spinnerFlag = true;
                }
                var data = {
                    "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_PAGE": {
                        "CURRPAGE": customerPage++,
                        "ITEMS": "10"
                    },
                    "IS_SEARCH": {"SEARCH": search},
                    "IT_IN_ROLE": {}
                };
                console.log(data);
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
                            $scope.CustomerLoadMoreFlag = true;
                            $ionicScrollDelegate.resize();
                            //saleActService.customerArr = $scope.customerArr;
                            $rootScope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    });
            };
            $scope.hideRelations = function () {
                $scope.addReleModal.remove();
                $timeout(function () {
                    $scope.hideSelections();
                },300)
            };
            $scope.selectPop_rel = function (x) {
                $scope.selectPopText = x.text;
                $scope.changeMoreFlag();
            };
            $scope.addRelationModal = function () {

                angular.forEach($scope.relationSelections, function (data) {
                    if (data.flag && $scope.details.relations.indexOf(data) == -1) {
                        $scope.details.relations.push(data);
                    }
                });
                $scope.hideRelations();
            };
            $scope.replaceRelation = function (x) {
                angular.forEach($scope.relationSelections, function (data) {
                    data.flag = false;
                });
                x.flag = true;
                $scope.details.relations[repTempIndex] = x;
                $scope.hideRelations();
            };
            $scope.changeMoreFlag = function () {
                $scope.moreflag = !$scope.moreflag;
            };
            $scope.hideSelections = function () {
                $scope.moreflag = false;
                $scope.isDropShow = false;
            };
            var repTempIndex;
            $scope.showActionSheet = function (x) {
                if (!$scope.isEdit) {
                    return
                }
                repTempIndex = $scope.details.relations.indexOf(x);
                $ionicActionSheet.show({
                    buttons: [
                        {text: '删除'},
                        {text: '替换'}
                    ],
                    titleText: '请选择操作',
                    cancelText: '取消',
                    buttonClicked: function (index) {
                        console.log(index);
                        switch (index) {
                            case 0:
                                console.log('删除');
                                $scope.details.relations.splice(repTempIndex, 1);
                                break;
                            case 1:
                                console.log('替换');
                                $scope.isReplace = true;
                                $scope.isDropShow = true;
                                $scope.selectPopText = '正式客户';
                                $scope.addReleModal.show();
                                break;
                        }
                        return true;
                    }
                });
            };
        }]);