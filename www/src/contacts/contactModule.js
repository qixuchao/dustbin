contactModuleServive
    .factory('contactService', [function() {
        //联系人到详情数据保存
        var contactlistdeatilvalue;
        //保存新建联系人的数据
        var contactcreatenewvalue;
        //从联系人进入创建联系人界面设置一个标记
        var contactcreate;
        //从联系人列表-联系人详细信息保存联系人的标识
        var contactlistvaluekey;
        //为联系人-关系界面保存数据(联系人详情界面的item)
        var contactdeatrelationlist;

        return {
            //为联系人-关系界面保存数据(联系人详情界面的item)
            set_ContactsdeaRelationval:function(rvalue){
                contactdeatrelationlist = rvalue;
            },
            get_ContactsdeaRelationval:function(){
                return contactdeatrelationlist;
            },
            //客户联系人数据
            set_Contactsdetailvalue:function(conval){
                contactlistdeatilvalue = conval;
            },
            get_Contactsdetailvalue:function(){
                return contactlistdeatilvalue;
            },
            //从联系人列表-联系人详细信息保存联系人的标识
            set_ContactsListvalue:function(value){
                contactlistvaluekey = value;
             },
            get_ContactsListvalue:function(){
                return contactlistvaluekey;
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
            },
        }
    }])
