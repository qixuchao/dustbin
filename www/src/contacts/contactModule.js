contactModuleServive
    .factory('contactService', [function() {
        //联系人到详情数据保存
        var contactlistdeatilvalue;
        //保存新建联系人的数据
        var contactcreatenewvalue;
        //从联系人进入创建联系人界面设置一个标记
        var contactcreate;
        return {
            //客户联系人数据
            set_ContactsListvalue:function(conval){
                contactlistdeatilvalue = conval;
            },
            get_ContactsListvalue:function(){
                return contactlistdeatilvalue;
            },
            //保存新建联系人的数据
            set_ContactCreatevalue:function(crval){
                contactcreatenewvalue = crval;
            },
            get_ContactCreatevalue:function(){
                return contactcreatenewvalue;
            },
            //从联系人进入创建联系人界面设置一个标记
            set_ContactCreateflag:function(){
                contactcreate = true;
            },
            get_ContactCreateflag:function(){
                return contactcreate;
            },
            //设置变量为fals
            set_ContactCreateflagfalse:function(){
                contactcreate = false;
            }
        }
    }])
