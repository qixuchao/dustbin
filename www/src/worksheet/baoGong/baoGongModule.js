worksheetReportModule.service("baoGongService", [
	"worksheetDataService",
	function(worksheetDataService){
	
	return {

		createFromWSDetail: {},
		/*{
			IS_OBJECT_ID: ,
			IS_PROCESS_TYPE: ,
			TYPE_DESC: ,
			DESCRIPTION: ,
			STATU: ,
			STATU_DESC: ,
			WAIFU_EMP: {
				FCT_DESCRIPTION : "外服人员",
				NAME1 : "张建廷",
				PARTNER_FCT : "ZSRVEMPL",
				PARTNER_NO : "E060000878"
			}
		}*/
		detailFromWSHistory: {
			isEmptyDetail: false
		},
		listFromBaoWSDetail: {
			isEmptyDetail: false
		},
		wsBaoDetailData: '',
		/*{
			OBJECT_ID: '',
			PROCESS_TYPE: ''
		}*/
		BAOWS_CREATE: {
			url: ROOTCONFIG.hempConfig.basePath + 'CONFIRM_CREATE',
			defaults: {
				I_SYSTEM: { SysName: worksheetDataService.getStoredByKey("sysName") },
			    IS_AUTHORITY: { BNAME: worksheetDataService.getStoredByKey("userName") }
			}
		},
		BAOWS_EDIT: {
			url: ROOTCONFIG.hempConfig.basePath + 'CONFIRM_CHANGE',
			defaults: {
				I_SYSTEM: { SysName: worksheetDataService.getStoredByKey("sysName") },
			    IS_AUTHORITY: { BNAME: worksheetDataService.getStoredByKey("userName") }
			}
		},
		BAOWS_CONFIRM_FILL: {
			url: ROOTCONFIG.hempConfig.basePath + 'CONFIRM_FILL',
			defaults: {
				I_SYSTEM: { SysName: worksheetDataService.getStoredByKey("sysName") },
			    IS_AUTHORITY: { BNAME: worksheetDataService.getStoredByKey("userName") }
			}
		}

	};

}]);