worksheetModule.controller("WorksheetListCtrl",[
	"$scope", 
	"ionicMaterialInk", 
	"ionicMaterialMotion",
	"$ionicPopup", "$timeout", 
	function($scope, ionicMaterialInk, ionicMaterialMotion,$ionicPopup, $timeout){
	
	$timeout(function () { //pushDown  fadeSlideIn  fadeSlideInRight
        //ionicMaterialInk.displayEffect();
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 100);

	$scope.config = {
		searchText: '',
		//showXbrModel: false, //是否显示遮罩层
		// page mode
		isFilterMode: false,
		isSorteMode: false,
		isQueryMode: false,
		isListMode: false,

		//排序 规则
		sortedTypeNone: true,    //不排序（默认）
		sortedTypeTimeDesc: false,  //时间 降序
		sortedTypeTimeAes: false,	//时间 升序
		sortedTypeCompactDesc: false,
		//筛选 规则 ----> 工单类型
		filterLocalService: false,
		filterNewCarOnline: false,
		filterBatchUpdate: false,
		filterNone: true,
		//筛选 规则 ----> 影响：damage height middle low none
		filterImpactDamage: false,
		filterImpactHeight: false,
		filterImpactMiddle: false,
		filterImpactLow: false,
		filterImpactNone: false,
		filterImpactNoSelected: true,
		timeStart: '20150101',
		timeEnd: '20150609',


		searchPlaceholder: '输入服务订单描述模糊搜索',




		ok: true
	};

	//依据所选 筛选条件 进行筛选操作
	$scope.filterConfirm = function(){
		// TODO
	};
	//重置筛选条件
	$scope.resetFilters = function(){
		//筛选 规则 ----> 工单类型
		$scope.config.filterLocalService = false;
		$scope.config.filterNewCarOnline = false;
		$scope.config.filterBatchUpdate = false;
		$scope.config.filterNone = true;
		//筛选 规则 ----> 影响
		$scope.config.filterImpactDamage = false;
		$scope.config.filterImpactHeight = false;
		$scope.config.filterImpactMiddle = false;
		$scope.config.filterImpactLow = false;
		$scope.config.filterImpactNone = false;
		$scope.config.filterImpactNoSelected = true;
	};

	$scope.onSearchTextChange = function($event){
		if($scope.config.searchText && $scope.config.searchText.trim()!=''){
			$scope.enterListMode();
		}
	};

	$scope.showXbrModel = function(){
		return $scope.config.isFilterMode || $scope.config.isSorteMode;
	};

	$scope.datas = {
		testDates: [
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单---end',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			}
		]
	};

	$scope.clickHeadTopSearchIcon = function(){
		$scope.enterQueryMode();
	};
	$scope.onSearchTextChangeFromHeaderBar = function(){
		
	};

	$scope.clickEnterListMode = function($event){ //点击遮罩层，取消排序和筛选界面 
		if(!$event){ return; }
		var $target = angular.element($event.target);
		var attrs = $target[0].attributes;
		// 如果该元素有 canNotClickEnterListMode 或 canClickEnterListMode标签
		for(var i = 0; i < attrs.length; i++){
			var attr = attrs[i];
			if(attr && attr.name!= null && attr.name.toLowerCase()=='canNotClickEnterListMode'.toLowerCase()){
				return;
			}
			if(attr && attr.name!= null && attr.name.toLowerCase() == 'canClickEnterListMode'.toLowerCase()){
				$scope.enterListMode();
				return;
			}
		}
		delete i;
		//身上查找你元素,直到body或html
		var parent;
		parent = $target[0].parentElement
		while(parent && parent.nodeName.toLowerCase()!= 'body' && parent.nodeName.toLowerCase()!= 'html'){
			var attrs2 = parent.attributes;
			for(var j = 0; j<attrs2.length; j++){
				var attr2 = attrs2[i];
				if(attr2 && attr2.name!= null && attr2.name.toLowerCase()=='canNotClickEnterListMode'.toLowerCase()){
					return;
				}
				if(attr2 && attr2.name!= null && attr2.name.toLowerCase() == 'canClickEnterListMode'.toLowerCase()){
					$scope.enterListMode();
					return;
				}
			}
			parent = parent.parentElement;
		}
	};


	$scope.enterFilterMode = function(){
		if($scope.config.isFilterMode){
			$scope.enterListMode();
			return;
		}
		$scope.config.isFilterMode = true;
		$scope.config.isSorteMode = false;
		$scope.config.isQueryMode = false;
		$scope.config.isListMode = false;
		//ionicMaterialMotion.pushDown(".tab-filter-content ,tab-filter-content-inner");
	};
	$scope.enterSorteMode = function(){
		if($scope.config.isSorteMode){
			$scope.enterListMode();
			return;
		}
		$scope.config.isFilterMode = false;
		$scope.config.isSorteMode = true;
		$scope.config.isQueryMode = false;
		$scope.config.isListMode = false;
	};
	$scope.enterQueryMode = function(){
		$scope.config.isFilterMode = false;
		$scope.config.isSorteMode = false;
		$scope.config.isQueryMode = true;
		$scope.config.isListMode = false;
	};
	$scope.enterListMode = function(){
		$scope.config.isFilterMode = false;
		$scope.config.isSorteMode = false;
		$scope.config.isQueryMode = false;
		$scope.config.isListMode = true;
	};

	$scope.sorteTimeDesc = function(){
		$scope.config.sortedTypeNone = false;
		$scope.config.sortedTypeCompactDesc = false;
		$scope.config.sortedTypeTimeAes = false;
		$scope.config.sortedTypeTimeDesc = true;
		$scope.enterListMode();
	};
	$scope.sorteTimeAes = function(){
		$scope.config.sortedTypeNone = false;
		$scope.config.sortedTypeCompactDesc = false;
		$scope.config.sortedTypeTimeAes = true;
		$scope.config.sortedTypeTimeDesc = false;
		$scope.enterListMode();
	};
	$scope.sorteNone = function(){
		$scope.config.sortedTypeNone = true;
		$scope.config.sortedTypeCompactDesc = false;
		$scope.config.sortedTypeTimeAes = false;
		$scope.config.sortedTypeTimeDesc = false;
		$scope.enterListMode();
	};
	$scope.sorteCompactDesc = function(){
		$scope.config.sortedTypeNone = false;
		$scope.config.sortedTypeCompactDesc = true;
		$scope.config.sortedTypeTimeAes = false;
		$scope.config.sortedTypeTimeDesc = false;
		$scope.enterListMode();
	};
	
	$scope.selectFilterType = function(filterName){ // localService、batchUpdate、newcarOnline
		if(filterName == 'localService'){
			$scope.config.filterLocalService = true;
			$scope.config.filterNone = false;
			$scope.config.filterBatchUpdate = false;
			$scope.config.filterNewCarOnline = false;
		}else if(filterName == 'batchUpdate'){
			$scope.config.filterLocalService = false;
			$scope.config.filterNone = false;
			$scope.config.filterBatchUpdate = true;
			$scope.config.filterNewCarOnline = false;
		}else if(filterName == 'newcarOnline'){
			$scope.config.filterLocalService = false;
			$scope.config.filterNone = false;
			$scope.config.filterBatchUpdate = false;
			$scope.config.filterNewCarOnline = true;
		}else{
			$scope.config.filterLocalService = false;
			$scope.config.filterNone = true;
			$scope.config.filterBatchUpdate = false;
			$scope.config.filterNewCarOnline = false;
		}
	};
	$scope.selectFilterImpact = function(impactName){ // damage height middle low none
		if(!impactName){
			$scope.config.filterImpactDamage =false;
			$scope.config.filterImpactHeight = false;
			$scope.config.filterImpactMiddle = false;
			$scope.config.filterImpactLow = false;
			$scope.config.filterImpactNone = false;
			$scope.config.filterImpactNoSelected = true;
		}
		if(impactName == 'damage'){
			$scope.config.filterImpactDamage =true;
			$scope.config.filterImpactHeight = false;
			$scope.config.filterImpactMiddle = false;
			$scope.config.filterImpactLow = false;
			$scope.config.filterImpactNone = false;
			$scope.config.filterImpactNoSelected = false;
		}else if(impactName == 'height'){
			$scope.config.filterImpactDamage =false;
			$scope.config.filterImpactHeight = true;
			$scope.config.filterImpactMiddle = false;
			$scope.config.filterImpactLow = false;
			$scope.config.filterImpactNone = false;
			$scope.config.filterImpactNoSelected = false;
		}else if(impactName == 'middle'){
			$scope.config.filterImpactDamage =false;
			$scope.config.filterImpactHeight = false;
			$scope.config.filterImpactMiddle = true;
			$scope.config.filterImpactLow = false;
			$scope.config.filterImpactNone = false;
			$scope.config.filterImpactNoSelected = false;
		}else if(impactName == 'low'){
			$scope.config.filterImpactDamage =false;
			$scope.config.filterImpactHeight = false;
			$scope.config.filterImpactMiddle = false;
			$scope.config.filterImpactLow = true;
			$scope.config.filterImpactNone = false;
			$scope.config.filterImpactNoSelected = false;
		}else if(impactName == 'none'){
			$scope.config.filterImpactDamage =false;
			$scope.config.filterImpactHeight = false;
			$scope.config.filterImpactMiddle = false;
			$scope.config.filterImpactLow = false;
			$scope.config.filterImpactNone = true;
			$scope.config.filterImpactNoSelected = false;
		}
	};

	$scope.init = function(){
		$scope.enterListMode();
		
		/*$ionicPopup.alert({
			title: '你好',
			template: '你好不'
		});*/
	};
	$scope.init();

}]);

worksheetModule.controller("WorksheetDetailCtrl",["$scope", "ionicMaterialInk", function($scope, ionicMaterialInk){

	$scope.config = {

	};

	$scope.datas = {

	};

	$scope.init = function(){
		ionicMaterialInk.displayEffect();
	};
	$scope.init();
	
}]);