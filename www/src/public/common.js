/**
 * Created by gongke on 2016/3/18.
 */

(function () {
    var loadConfigRequest = new XMLHttpRequest();
    loadConfigRequest.open('GET', 'config/ClientConfig.json',false);
    loadConfigRequest.send(null);
    if (loadConfigRequest.status === 200 || loadConfigRequest.status === 0) {
        ROOTCONFIG = JSON.parse(loadConfigRequest.responseText)
        //console.log(typeof (ROOTCONFIG));
    }
})()

function detectOS() {
    var sUserAgent = navigator.userAgent;

    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") ||
        (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if (isMac) return "iPhone";
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix) return "Unix";
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);

    var isPhone = (navigator.platform == "iPhone");
    if (isPhone) {
        return "iPhone";
    }

    var bIsAndroid = sUserAgent.toLowerCase().match(/android/i) == "android";
    if (isLinux) {
        if (bIsAndroid) return "Android";
        else return "Linux";
    }
    if (isWin) {
        var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) return "Win2000";
        var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 ||
            sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) return "WinXP";
        var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) return "Win2003";
        var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
        if (isWinVista) return "WinVista";
        var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
        if (isWin7) return "Android";
    }
    return "Android";
};


var storedb = function(collectionName){
    collectionName = collectionName ? collectionName : 'default';

    var err;
    var cache = localStorage[collectionName] ? JSON.parse(localStorage[collectionName]) : [];

    return {

        insert: function(obj,callback){
            cache.unshift(obj);
            localStorage.setItem(collectionName,JSON.stringify(cache));
            if(callback)
                callback(err,obj);
        },
        find: function(obj, callback){
            if(arguments.length == 0){
                return cache;
            } else {
                var result = [];

                for(var key in obj){
                    for(var i = 0; i < cache.length; i++){
                        if(cache[i][key] == obj[key]){
                            result.push(cache[i]);
                        }
                    }
                }
                if(callback)
                    callback(err,result);
                else
                    return result;
            }
        },
        remove: function(obj,callback){
            if(arguments.length == 0){
                localStorage.removeItem(collectionName);
            } else {

                for(var key in obj){
                    for (var i = cache.length - 1; i >= 0; i--) {
                        if(cache[i][key] == obj[key]){
                            cache.splice(i,1);
                        }
                    }
                }
                localStorage.setItem(collectionName, JSON.stringify(cache));
            }

            if(callback)
                callback(err);

        }

    };
};

Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}


Array.prototype.arrUniq = function() {
    var temp,arrVal,
        array = this,
        arrClone = array.concat(),//克隆数组
        typeArr = {//数组原型
            'obj' : '[object Object]',
            'fun' : '[object Function]',
            'arr' : '[object Array]',
            'num' : '[object Number]'
        },
        ent = /(\u3000|\s|\t)*(\n)+(\u3000|\s|\t)*/gi;//空白字符正则

    //把数组中的object和function转换为字符串形式
    for(var i = arrClone.length; i--;){
        arrVal = arrClone[i];
        temp = Object.prototype.toString.call(arrVal);

        if(temp == typeArr['num'] && arrVal.toString() == 'NaN'){
            arrClone[i] = arrVal.toString();
        }

        if(temp == typeArr['obj']){
            arrClone[i] = JSON.stringify(arrVal);
        }

        if(temp == typeArr['fun']){
            arrClone[i] = arrVal.toString().replace(ent,'');
        }
    }
    //去重关键步骤
    for (var i = arrClone.length; i--;) {
        arrVal = arrClone[i];
        temp = Object.prototype.toString.call(arrVal);

        if(temp == typeArr['arr']) arrVal.arrUniq();//如果数组中有数组，则递归
        if (arrClone.indexOf(arrVal) != arrClone.lastIndexOf(arrVal)) {//如果有重复的，则去重
            array.splice(i,1);
            arrClone.splice(i, 1);
        }
        else{
            if(Object.prototype.toString.call(array[i]) != temp){
                //检查现在数组和原始数组的值类型是否相同，如果不同则用原数组中的替换，原因是原数组经过了字符串变换
                arrClone[i] = array[i];
            }
        }
    }
    return arrClone;
};


