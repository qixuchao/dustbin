contactModuleServive
    .factory('contactService', [function() {
        //联系人到详情数据保存
        var contactlistdeatilvalue;
        //保存新建联系人的数据
        var contactcreatenewvalue;
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
        }
    }])
