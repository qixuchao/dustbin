employeeModuleServive
    .factory('employeeService', [function() {
        var employeeliatvalue;
        var employeeaddcountv;

        var employeeaddfileds;
        //����ͻ��б�
        var employeecustomerlist;
        return {
            set_employeeListvalue:function(evalue){
                employeeliatvalue = evalue;
            },
            get_employeeListvalue:function(){
                return employeeliatvalue;
            },

            set_employeeaddcountv:function(epvalue){
                employeeaddcountv = epvalue;
            },
            get_employeeaddcountv:function(){
                return employeeaddcountv;
            },

            set_employeeaddfiled:function(efvalue){
                employeeaddfileds = epvalue;
            },
            get_employeeaddfiled:function(){
                return employeeaddfileds;
            },
            //�ͻ��б�
            set_employeecustomerlist:function(value){
                employeecustomerlist = value;
            },
            get_employeecustomerlist:function(){
                return employeecustomerlist;
            }
        }
    }])
