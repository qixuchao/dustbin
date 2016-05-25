==================================================================================================================

百度定位插件：
    当前功能
    安卓百度定位

==================================================================================================================


定位服务

1.安装
    (1)修改插件plugin.xml
        <meta-data
        android:name="com.baidu.lbsapi.API_KEY"
        android:value="0ZbTZE6YwNTGPuvW4rTQP6j226uZp073" />
        其中value填写在百度中申请的apk_key
    (2)cordova plugin add <插件在本地保存的路径>

2.使用
    var baiduMap = window.plugins.baiduMap;
    baiduMap.getLocation(function (success) {
        console.log('success = '+success);
        
    },function(error){
        console.log('error = '+error);
    },[]);