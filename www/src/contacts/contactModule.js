contactModuleServive
    .factory('contactService', [function() {
        //联系人到详情数据保存
        var contactlistdeatilvalue;
        return {
            //客户联系人数据
            set_ContactsListvalue:function(conval){
                contactlistdeatilvalue = conval;
            },
            get_ContactsListvalue:function(){
                return contactlistdeatilvalue;
            },
        }
    }])
