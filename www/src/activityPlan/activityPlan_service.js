/**
 * Created by admin on 16/5/1.
 */
activityPlanModule.factory('activityPlanService',function(){
    return{
        //活动计划的单号
        activityList : "",
        //新建计划进入详情的标志
        pageFlag : "",
        //活动计划详情
        detail :"",
        //活动修改
        detailItem : "",
        //添加或更新
        status : "",
        //是否刷新详情的标识
        updatePageFlag : "",
        //创建联系人
        goCreateCon : ""
    }
});