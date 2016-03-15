
#399CRM 项目说明
		
* ##### 项目前端模块简介
	+ 当前所有模块
	+ employee模块详解
* ##### Cordova插件集合(待续)
* ##### Gulp构建脚本
	+ task 列表及说明
	+ task 使用指南
* ##### 项目编码规范(待续)
*******
<br/>
### 项目简介
 [Git地址](http://hpm.hand-china.com/diffusion/M)
www 文件夹结构说明 (假定根目录为src目录：所有sass、html、js文件均在src目录下) 
* ###### 当前所有模块

``public``: 项目公共代码<br/>

				_public.scss       : 公共的css代码<br/>
				CRMApp.js          : 定义项目angular module及各个子module<br/>
				services.js	    : 公共的angular service<br/>
				controllers.js	    : 公共的controller（eg:html、body上的controller）<br/>
				templates/*.html		    : 公共的html模板<br/>			
``applications``:  		应用页<br/>
``employee``:		员工模块(4个人信息界面、5员工-查询结果-列表、13员工详情)<br/>
``contacts``: 		联系人模块(6联系人详情、7创建、8编辑)<br/>
``customer``:		客户模块(9客户查询-查询结果列表、10详情、11编辑)<br/>
``saleActivities``:		销售活动模块（14销售活动查询-查询结果列表、15详情、16创建、17编辑）<br/>
``businessOpportunity``:	商业机会模块(18查询-查询结果列表、19详情、20创建、21编辑)<br/>
``contactRelationship``:	联系人关系(22查询、23维护)<br/>
``responserRelationship``:	负责人关系(24查询、25维护)<br/>
``worksheet``:		工单模块(26查询-结果列表、27详情、28编辑)<br/>
``actionPlan``:		活动计划模块(29查询-查询结果列表、30详情、31创建、32编辑)<br/>
``clues``:			线索模块（33查询-查询结果列表、34详情、35编辑）<br/>
``baoworksheet``:		报工单模块(36查询-结果列表、37详情、38编辑、39创建)<br/>
``offer``:			报价模块（40查询查询结果列表、41详情、42创建、43编辑）<br/>
``receipts``:		报销模块（44查询、45审核）<br/>
``services``:		服务模块（46地图、47知识库、48签到查询、49签到提交、50拜访查询、51拜访提交）<br/>
``terminalUser``:		终端用户模块（个人查询、维护）<br/><br/>
	
* ###### employee模块详解 (以employee模块为例)

	userDetail.html、userInfo.html、userQuery.html 分别代表员工详情、个人信息、查询-查询结果列表界面
	_employy.scss  :包含这三个界面的css代码
	employeeModule.js : 包含该模块的module定义以及所有的service定义、filter定义、directive定义等
	employeeCtrls.js  : 包含该模块的所有controller定义

### Cordova插件
	待续
### Gulp构建脚本
* ##### task 列表及说明:
			sass	  : 将所有 www/src/public/CRMApp.scss 文件编译为 www/src/dev/CRMApp[.min].css
			default = watch-sass : 监控www/src/文件夹及其所有子文件夹内的scss文件，若有变化则执行 sass进行编译
			patch-html : 项目开发完成后使用：用来将所有的html打包为一个js文件www/src/dev/CRMApp-templates.js，并使用angular的module机制封装为"crm-templates"的module
			patch-js   : 项目开发完成后使用：将www/src下面的所有js文件(包含CRMApp-templates.js)打包为www/src/dev/CRMApp-all.js
			
* ##### task 使用指南:
	+ 开发中
	
	```
		1、 cd atlenergy/www							: 进入工作目录
		2、 node scripts/web-server.js  				: 运行node服务器
		3、 http://localhost:8005/index.html#/tabs
		4、 gulp watch-sass 							: 监控scss文件并时实编译为css
	```
	+ 项目打包（可选）
	```
	1、	gulp sass   ：生成 css
	2、	gulp patch-html: 打包html
	3、	gulp patch-js ： 合并压缩 js文件
	4、	最终只需要在index.html中引入2个文件(除lib之外)：CRMApp-all.min.css、CRMApp-all.min.js
	```
	

		
		
### 项目编码规范








	
	
			