package com.hand.cordova.plugin.baidu;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.baidu.location.LocationClientOption.LocationMode;
import com.baidu.location.Poi;
import com.baidu.location.BDNotifyListener;

import android.content.Context;
import android.util.Log;

public class BaiduMap extends CordovaPlugin {
    private static String TAG = "BaiduMap";
    
    public LocationClient mLocationClient = null;
    public LocationService locationService;
    private CallbackContext callbackContext;
    
    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        locationService = new LocationService(webView.getContext());
    }
    
    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (action.equals("getLocation")) {
            this.callbackContext = callbackContext;
            locationService.registerListener(myListener);
            locationService.setLocationOption(locationService.getOption());
            locationService.start();
            return true;
        }
        return false;
    }
    
    public BDLocationListener myListener = new BDLocationListener() {
    
    @Override
    public void onReceiveLocation(BDLocation location) {
    StringBuffer sb = new StringBuffer(256);
    sb.append("time : ");
    sb.append(location.getTime());
    sb.append("\nerror code : ");
    sb.append(location.getLocType());
    sb.append("\nlatitude : ");
    sb.append(location.getLatitude());
    sb.append("\nlontitude : ");
    sb.append(location.getLongitude());
    sb.append("\nradius : ");
    sb.append(location.getRadius());
    if (location.getLocType() == BDLocation.TypeGpsLocation) {// GPS定位结果
        sb.append("\nspeed : ");
        sb.append(location.getSpeed());// 单位：公里每小时
        sb.append("\nsatellite : ");
        sb.append(location.getSatelliteNumber());
        sb.append("\nheight : ");
        sb.append(location.getAltitude());// 单位：米
        sb.append("\ndirection : ");
        sb.append(location.getDirection());// 单位度
        sb.append("\naddr : ");
        sb.append(location.getAddrStr());
        sb.append("\ndescribe : ");
        sb.append("gps定位成功");
        
    } else if (location.getLocType() == BDLocation.TypeNetWorkLocation) {// 网络定位结果
        sb.append("\naddr : ");
        sb.append(location.getAddrStr());
        // 运营商信息
        sb.append("\noperationers : ");
        sb.append(location.getOperators());
        sb.append("\ndescribe : ");
        sb.append("网络定位成功");
    } else if (location.getLocType() == BDLocation.TypeOffLineLocation) {// 离线定位结果
        sb.append("\ndescribe : ");
        sb.append("离线定位成功，离线定位结果也是有效的");
    } else if (location.getLocType() == BDLocation.TypeServerError) {
        sb.append("\ndescribe : ");
        sb.append("服务端网络定位失败，可以反馈IMEI号和大体定位时间到loc-bugs@baidu.com，会有人追查原因");
    } else if (location.getLocType() == BDLocation.TypeNetWorkException) {
        sb.append("\ndescribe : ");
        sb.append("网络不同导致定位失败，请检查网络是否通畅");
    } else if (location.getLocType() == BDLocation.TypeCriteriaException) {
        sb.append("\ndescribe : ");
        sb.append("无法获取有效定位依据导致定位失败，一般是由于手机的原因，处于飞行模式下一般会造成这种结果，可以试着重启手机");
    }
    sb.append("\nlocationdescribe : ");
    sb.append(location.getLocationDescribe());// 位置语义化信息
    List<Poi> list = location.getPoiList();// POI数据
    if (list != null) {
        sb.append("\npoilist size = : ");
        sb.append(list.size());
        for (Poi p : list) {
            sb.append("\npoi= : ");
            sb.append(p.getId() + " " + p.getName() + " " + p.getRank());
        }
    }
    Log.i(TAG, "Get Location = " + sb.toString());
    
    int locationResult = location.getLocType();
    if (locationResult == 61 || locationResult == 65 || locationResult == 66 || locationResult == 68
        || locationResult == 161) {
        double latitude = location.getLatitude();
        double lontitude = location.getLongitude();
        returnPluginResult(1, latitude, lontitude);
    } else {
        returnPluginResult(0, 0, 0);
    }
}
};

public void returnPluginResult(int resultCode, double latitude, double lontitude) {
    locationService.unregisterListener(myListener);
    locationService.stop();
    JSONObject result = new JSONObject();
    if (resultCode == 1) {
        try {
            result.put("result", "1");
            JSONObject location = new JSONObject();
            location.put("latitude", latitude);
            location.put("lontitude", lontitude);
            result.put("location", location);
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        this.callbackContext.success(result);
    } else if (resultCode == 0) {
        try {
            result.put("result", "0");
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        this.callbackContext.error(result);
    }
}

}
