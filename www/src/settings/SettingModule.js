settingsModule.service("SettingsService", [
	function(){
		return {
			getCheckCode: {
				url: ROOTCONFIG.hempConfig.basePathBty + 'getCheckCode',
				defaults: {
					userName: "",
					moduleCode: "",  //RESET_PASS 重置密码; CHANGE_PASS: 修改密码
					phoneNo: "",
					system: ""
				}
			},
			changePwd: {
				url: ROOTCONFIG.hempConfig.basePathBty + 'changePwd',  //修改密码接口
				defaults: {
					userName: "",
					oldPassword: "",
					newPassword: "",
					newPassword2: "",
					moduleCode: "CHANGE_PASS",
					checkcode: "",
					system: ""
				}
			},
			resetPwd: {
				url: ROOTCONFIG.hempConfig.basePathBty + 'resetPwd',
				defaults: {
					userName: "",
					newPassword: "",
					newPassword2: "",
					moduleCode: "RESET_PASS",
					checkcode: "",
					system: ""
				}
			}
		};
	}]);