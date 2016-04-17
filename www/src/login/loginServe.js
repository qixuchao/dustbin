/**
 * Created by gongke on 2016/3/14.
 */
loginModule.factory('LoginService',function(){
    var data;
    var data3;
    var menuList=[];
    var author={};
    return{
        setUserName:function(data4){
            data=data4;
            return data;
        },
        //过去登录的用户名
        getUserName:function(){
            return data;
        },
        setProfile:function(data1){
            data3=data1;
            //return data;
        },
        //角色
        getProfile:function(){
            return data3;
        },
        setMenulist:function(data2){
            menuList=data2;
            return menuList;
        },
        // 应用页列表
        getMenulist:function(){
            return menuList;
        },
        setAuth:function(data3){
            author=data3;
            return author;
        },
        //用户的权限
        getFunctionAuth:function(){
            return author;
        },
        /*
            获取功能的权限信息
            @params:
                funcitonName: 功能名
            @return: 若返回为null,则说明获取不到权限信息  或 function不存在
                    {
                        VIEW: false,
                        EDIT: false,
                        CREATE: false
                    }
        */
        getAuthInfoByFunction: function(functionName){
            var obj = data3;
            if(!obj){return null;}
            var auth = obj.AUTH;
            if(!auth){return null;}
            var returnObj = {
                VIEW: false,
                EDIT: false,
                CREATE: false
            };
            for(var i=0;i<auth.length;i++){
                if(auth[i].FUNCTION == functionName){
                    if(auth[i].EDIT == 'TRUE'){
                        returnObj.EDIT = true;
                    }
                    if(auth[i].VIEW == 'TRUE'){
                        returnObj.VIEW = true;
                    }
                    if(auth[i].CRTEAT == 'TRUE'){
                        returnObj.CREATE = true;
                    }
                    return returnObj;
                };
            }
            return null;
        }
    }
});