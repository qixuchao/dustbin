employeeModuleServive
    .factory('employeeService', [function() {
        var employeeliatvalue;
        var employeeaddcountv;

        var employeeaddfileds;
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
            }
        }
    }])
