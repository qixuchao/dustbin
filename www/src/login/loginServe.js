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
        getAuth:function(){
            return author;
        }
    }
});