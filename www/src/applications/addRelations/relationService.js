/**
 * Created by zhangren on 16/4/18.
 */
'use strict';
salesModule.factory('relationService', function () {
    var saleActSelections;
    //相关方里面的客户,用来查联系人
    var relationCustomer={},
        //替换还是添加
        isReplace=false,
        myRelations=[],
        replaceMan,
        repTempIndex,
        //替换的类型,决定初始化,默认联系人
        position='联系人',
        chanceDetailPartner={}
        ;
  return{
      saleActSelections : "",
      relationCustomer : "",
      isReplace : "",
      myRelations : "",
      replaceMan : "",
      repTempIndex : "",
      position : "",
      chanceDetailPartner : ""
  }
});