/**
 * Created by zhangren on 16/4/18.
 */
'use strict';
salesModule.factory('relationService', function () {
    var saleActSelections = [{
        text:'联系人',
        code:'00000015'
    },{
        text:'客户',
        code:'00000009'
    },{
        text:'CATL销售',
        code:'Z0000003'
    }];
    //相关方里面的客户,用来查联系人
    var relationCustomer={},
        //替换还是添加
        isReplace=false,
        myRelations=[],
        replaceMan,
        repTempIndex,
        //替换的类型,决定初始化,默认客户
        position='客户';
  return{
      saleActSelections,
      relationCustomer,
      isReplace,
      myRelations,
      replaceMan,
      repTempIndex,
      position
  }
});