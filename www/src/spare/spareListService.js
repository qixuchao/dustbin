/**
 * Created by Administrator on 2016/3/22 0022.
 */
spareModule.factory('SpareListService',['$http',function($http){
    var data;
    var spareList=[{
        spareName:'MSD上盖(CATL)',
        spareDescribe:'#30.0热缩套管-红色',
        spareCode:'14190-0024'
    },{
        spareName:'M10*50六角头螺栓',
        spareDescribe:'#30.0热缩套管-红色',
        spareCode:'14190-0024'
    }];

    return{
        all:function(){
            return spareList;
        },
        set:function(spare){
            data=spare;
            return data;
        },
        get:function(){
          return data;
        }
    }
}]);