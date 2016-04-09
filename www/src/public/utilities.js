
var ROOTCONFIG;
var UTILITIES = new Object();
(function (object) {
  var checkConnection = function () {
    try {
      var networkState = navigator.connection.type;
      var states = {};
      states[Connection.UNKNOWN] = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI] = 'WiFi connection';
      states[Connection.CELL_2G] = 'Cell 2G connection';
      states[Connection.CELL_3G] = 'Cell 3G connection';
      states[Connection.CELL_4G] = 'Cell 4G connection';
      states[Connection.CELL] = 'Cell 2G/3G/4G connection';
      states[Connection.NONE] = 'No network connection';
      if (networkState == 'wifi') {
        return {
          network: "",
          download: "Y"
        };
      }
      return {
        network: "当前网络状态：" + states[networkState] + " 确认是否继续下载？",
        download: "N"
      };
    }
    catch (e) {
      return {
        network: "",
        download: "N"
      };
    }
  };

  var translateModel = function (model) {
    if (model == "iPhone1,1") {
      return "iPhone 2G";
    }
    else if (model == "iPhone1,2") {
      return "iPhone 3G";
    }
    else if (model == "iPhone2,1") {
      return "iPhone 3GS";
    }
    else if (model == "iPhone3,1") {
      return "iPhone 4";
    }
    else if (model == "iPhone3,2") {
      return "iPhone 4";
    }
    else if (model == "iPhone3,3") {
      return "iPhone 4";
    }
    else if (model == "iPhone4,1") {
      return "iPhone 4S";
    }
    else if (model == "iPhone5,1") {
      return "iPhone 5";
    }
    else if (model == "iPhone5,2") {
      return "iPhone 5";
    }
    else if (model == "iPhone5,3") {
      return "iPhone 5C";
    }
    else if (model == "iPhone5,4") {
      return "iPhone 5C";
    }
    else if (model == "iPhone6,1") {
      return "iPhone 5S";
    }
    else if (model == "iPhone6,2") {
      return "iPhone 5S";
    }
    else if (model == "iPhone7,1") {
      return "iPhone 6 Plus";
    }
    else if (model == "iPhone7,2") {
      return "iPhone 6";
    }
    else if (model == "iPhone8,1") {
      return "iPhone 6S Plus";
    }
    else if (model == "iPhone8,2") {
      return "iPhone 6S";
    }
    return "No Catch";
  }

  var device1 = function () {
    console.log("device1 start");
    var obj1 = new Object();
    try {
      if (device.uuid) {
        if (device.uuid == "") {
          obj1.uuid = "No uuid Catch";
        }
        else {
          obj1.uuid = device.uuid;
        }
      } else {
        obj1.uuid = "No uuid Catch";
      }
      obj1.model = translateModel(device.model);
      obj1.version = device.version;
      obj1.platform = device.platform;
    } catch (e) {
      obj1.uuid = "No uuid Catch";
      obj1.model = 'Not Catch';
      obj1.version = 'Not Catch';
      obj1.platform = 'Not Catch';
    }

    return obj1;
  };

  object.init = function () {
    // load json config synch
    var loadConfigRequest = new XMLHttpRequest();
    loadConfigRequest.open('GET', 'config/ClientConfig.json', false);  // (外网)`false` makes the request synchronous
    loadConfigRequest.send(null);
    if (loadConfigRequest.status === 200 || loadConfigRequest.status === 0) { //status是0的时候是safari返回需求的（打苹果包的时候用到）
      ROOTCONFIG = JSON.parse(loadConfigRequest.responseText);
    }
  };

  object.getToken = function () {
    var token = '-1';
    if (window.localStorage.token) {
      token = window.localStorage.token;
    }
    return token;
  };

    object.setToken = function (token) {
        window.localStorage.token = token;
    }

    object.getUser = function () {
        var user = '-1';
        if (window.localStorage.user) {
            user = window.localStorage.user;
        }
        return user;
    }

    object.setUser = function (user) {
        window.localStorage.user = user;
    }

    //获取当前时间格式
    object.getNowFormatDate =  function() {
        var date = new Date();
        var seperator1 = "";
        var seperator2 = "";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + "" + date.getHours() + seperator2 + date.getMinutes();
                //+ seperator2 + date.getSeconds();
        return currentdate;
    }



  object.init2 = function () {
    object.checkConnection = checkConnection();
    object.device = device1();
  }

})(UTILITIES);

UTILITIES.init();
