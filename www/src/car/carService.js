/**
 * Created by Administrator on 2016/3/14 0014.
 */
carModule.factory('CarService',function(){
   var data;
   var car=[{
           describe:'贵GU1230*15H647-0002*112016013002',
           carNumber:'1234',
           projectName:'11234556',
           productionDate:'2016.01.01',
           endDate:'2018.12.31',
           buyDate:'2016.10.25',
           operationDate:'2016.10.25',
           point:'3786',
           code:'114296311231',
           barCode:'114296311231',
           carCode:'18612345678',
           driver:'张三',
           phoneNum:'18612345678',
           version:'Yun.ma@alibaba.com',
           directCustomer:'郑州宇通客车股份有限公司',
           terminal:'武夷山市公交巴士旅游有限公司',
           quality:'质保5年10万公里',
           maintenance:[{
               listType:'现场维修工单',
               maintenanceDate:'2016.01.01 10:00:01-2016.12.31 12:00:00',
               maintenanceDescribe:'车辆电池出现重大问题1'
           },{
               listType:'批量改进工单',
               maintenanceDate:'2016.01.01 10:00:01-2016.12.31 12:00:00',
               maintenanceDescribe:'车辆电池出现重大问题1'
           }],
           spare:[{
               spareName:'高压箱-BD1',
               spareNum:'17240-0026',
               count:'7',
               qualityTime:'CATL两年质保',
               qualityDate:'2016.01.01-2018.01.01'
           }, {
                   spareName:'400A高压熔断器1',
                   spareNum:'13090-0008',
                   count:'5',
                   qualityTime:'CATL两年质保',
                   qualityDate:'2016.01.01-2018.01.01'
               }]

       },{
           describe:'京AS9116*14H581P-004*114442300070',
           carNumber:'1234',
           projectName:'11234556',
           productionDate:'2016.01.01',
           endDate:'2018.12.31',
           buyDate:'2016.10.25',
           operationDate:'2016.10.25',
           point:'3786',
           code:'114296311231',
           barCode:'114296311231',
           carCode:'18612345678',
           driver:'张三',
           phoneNum:'18612345678',
           version:'Yun.ma@alibaba.com',
           directCustomer:'郑州宇通客车股份有限公司',
           terminal:'武夷山市公交巴士旅游有限公司',
           quality:'质保5年10万公里',
           maintenance:[{
               listType:'现场维修工单',
               maintenanceDate:'2016.01.01 10:00:01-2016.12.31 12:00:00',
               maintenanceDescribe:'车辆电池出现重大问题2'
           },{
               listType:'批量改进工单',
               maintenanceDate:'2016.01.01 10:00:01-2016.12.31 12:00:00',
               maintenanceDescribe:'车辆电池出现重大问题2'
           }

           ],
           spare:[{
               spareName:'高压箱-BD2',
               spareNum:'17240-0026',
               count:'7',
               qualityTime:'CATL两年质保',
               qualityDate:'2016.01.01-2018.01.01'
           }, {
               spareName:'400A高压熔断器2',
               spareNum:'13090-0008',
               count:'5',
               qualityTime:'CATL两年质保',
               qualityDate:'2016.01.01-2018.01.01'
           }]
       },{
           describe:'贵GU1229*15H647M-0001*114296311222',
           carNumber:'1234',
           projectName:'11234556',
           productionDate:'2016.01.01',
           endDate:'2018.12.31',
           buyDate:'2016.10.25',
           operationDate:'2016.10.25',
           point:'3786',
           code:'114296311231',
           barCode:'114296311231',
           carCode:'18612345678',
           driver:'张三',
           phoneNum:'18612345678',
           version:'Yun.ma@alibaba.com',
           directCustomer:'郑州宇通客车股份有限公司',
           terminal:'武夷山市公交巴士旅游有限公司',
           quality:'质保5年10万公里',
           maintenance:[{
               listType:'现场维修工单',
               maintenanceDate:'2016.01.01 10:00:01-2016.12.31 12:00:00',
               maintenanceDescribe:'车辆电池出现重大问题3'
           },{
               listType:'批量改进工单',
               maintenanceDate:'2016.01.01 10:00:01-2016.12.31 12:00:00',
               maintenanceDescribe:'车辆电池出现重大问题3'
           }],
           spare:[{
               spareName:'高压箱-BD3',
               spareNum:'17240-0026',
               count:'7',
               qualityTime:'CATL两年质保',
               qualityDate:'2016.01.01-2018.01.01'
           }, {
               spareName:'400A高压熔断器3',
               spareNum:'13090-0008',
               count:'5',
               qualityTime:'CATL两年质保',
               qualityDate:'2016.01.01-2018.01.01'
           }]
       }];
    return{
        all:function(){
            return car;
        },
        setData:function(data1){
            data=data1;
            return data;
        },
        getData:function(){
            return data;
        }
    };
});