/**
 * Created by gongke on 2016/3/14.
 */
loginModule.factory('LoginService',function(){
    var data;
    var menuList=[];
    var author={};
    return{
        setUserName:function(data4){
            data=data4;
            return data;
        },
        //��ȥ��¼���û���
        getUserName:function(){
            return data;
        },
        setProfile:function(data1){
            data=data1;
            return data;
        },
        //��ɫ
        getProfile:function(){
            return data;
        },
        setMenulist:function(data2){
            menuList=data2;
            return menuList;
        },
        // Ӧ��ҳ�б�
        getMenulist:function(){
            return menuList;
        },
        setAuth:function(data3){
            author=data3;
            return author;
        },
        //�û���Ȩ��
        getAuth:function(){
            return author;
        }
    }
});