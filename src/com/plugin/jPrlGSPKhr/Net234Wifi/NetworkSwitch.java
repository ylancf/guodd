package com.plugin.jPrlGSPKhr.Net234Wifi;

import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import java.io.DataOutputStream;
import java.io.File;

public class NetworkSwitch {

    private Context context;
    private WifiManager mWifiManager;
    private NetManagers netManagers;
    private ISendEvent iSendEvent;

    public NetworkSwitch(Context context, ISendEvent iSendEvent) {
        this.context = context;
        mWifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        netManagers = new NetManagers(context, this);
        this.iSendEvent = iSendEvent;
    }

    interface ISendEvent {
        public void NetChangeEvent(String netType);

        public void GPSChangeEvent(boolean enable);
    }

    //打开wifi
    public boolean WifiOpenORClose(boolean enabled) {
        if (enabled) {
            //"检查wifi是否断开"
            if (!mWifiManager.isWifiEnabled()) { //判断是否开启
                mWifiManager.setWifiEnabled(true); // 开启WIFI
                return true;
            }
        } else {
            //"检查wifi是否开启"
            if (mWifiManager.isWifiEnabled()) { //判断是否开启
                mWifiManager.setWifiEnabled(false); // 开启WIFI
                return true;
            }
        }
        return false;
    }

    //获取wifi状态
    public boolean getWifiState(){

       return mWifiManager.isWifiEnabled();

    }



    private final static String COMMAND_AIRPLANE_ON = "settings put global airplane_mode_on 1 \n " +
            "am broadcast -a android.intent.action.AIRPLANE_MODE --ez state true\n ";
    private final static String COMMAND_AIRPLANE_OFF = "settings put global airplane_mode_on 0 \n" +
            " am broadcast -a android.intent.action.AIRPLANE_MODE --ez state false\n ";
    private final static String COMMAND_SU = "su";

    //设置飞行模式
    public boolean setAirplaneModeOn(boolean isEnable) {

        if (IsAirModeOn() == isEnable) { //判断是否已经是需要的状态
            return isEnable;
        }

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN_MR1) {
            Settings.System.putInt(context.getContentResolver(),
                    Settings.System.AIRPLANE_MODE_ON, isEnable ? 1 : 0);
            Intent intent = new Intent(Intent.ACTION_AIRPLANE_MODE_CHANGED);
            intent.putExtra("state", isEnable);
            context.sendBroadcast(intent);
        } else {//4.2或4.2以上
            if (isEnable) {
                writeCmd(COMMAND_AIRPLANE_ON);
            } else {
                writeCmd(COMMAND_AIRPLANE_OFF);
            }
        }

        return isEnable;
    }

    //是否是飞行模式
    public boolean IsAirModeOn() {
        return (Settings.System.getInt(context.getContentResolver(),
                Settings.System.AIRPLANE_MODE_ON, 0) == 1 ? true : false);
    }


    //写入shell命令
    private static void writeCmd(String command) {
        try {
            Process su = Runtime.getRuntime().exec(COMMAND_SU);
            DataOutputStream outputStream = new DataOutputStream(su.getOutputStream());

            outputStream.writeBytes(command);
            outputStream.flush();

            outputStream.writeBytes("exit\n");
            outputStream.flush();
            try {
                su.waitFor();
            } catch (Exception e) {
                e.printStackTrace();
            }

            outputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }



    //设置网络模式  7 3G  1 2G   20 4G

    public void setPreferedNetworkType(int netType) {

        String COMMAND_Network_type = "settings put Global preferred_network_mode "+netType+" \n" +
                " am broadcast -a com.android.phone.CHANGE_NETWORK_MODE --ei com.android.phone.NEW_NETWORK_MODE "+netType+"\n ";
        writeCmd(COMMAND_Network_type);

//        String COMMAND_Network_type = "settings put Global preferred_network_mode " + netType + " \n";
//        writeCmd(COMMAND_Network_type);
//        Intent intent = new Intent("com.android.phone.CHANGE_NETWORK_MODE");
//        intent.putExtra("com.android.phone.NEW_NETWORK_MODE", netType);
//        context.sendBroadcast(intent);
    }


    //开关数据流量
    public void setPoneNetState(boolean state) {

        if (state) {
            writeCmd(" svc data enable \n");
        } else {
            writeCmd(" svc data disable \n");
        }
    }


    //开关GPS
    public void setGPS(boolean enable) {

        if (enable) {
            writeCmd(" settings put secure location_providers_allowed +gps  \n");
        } else {
            writeCmd(" settings put secure location_providers_allowed -gps  \n");
        }
    }


    /**
     * 是否存在su命令，并且有执行权限
     *
     * @return 存在su命令，并且有执行权限返回true
     */
    public boolean isSuEnable() {
        File file = null;
        String[] paths = {"/system/bin/", "/system/xbin/", "/system/sbin/", "/sbin/", "/vendor/bin/", "/su/bin/"};
        try {
            for (String path : paths) {
                file = new File(path + "su");
                if (file.exists() && file.canExecute()) {
                    return true;
                }
            }
        } catch (Exception x) {
            x.printStackTrace();
        }
        return false;
    }


    public void onDestroy() {

        if(netManagers!=null)
            netManagers.onDestroy();

    }

    private String netTypeName = "";

    public int NetChangeEvent(String netType) {
        netTypeName = netType;
        Log.i("网络", "NetChangeEvent:" + netType);
        if (netType == "无网络" && IsAirModeOn()) {
            netType = "飞行";
        }
        if (iSendEvent != null) {
            iSendEvent.NetChangeEvent(netType);
        }
        return 0;
    }


    public void GPSChangeEvent(boolean enable) {
        iSendEvent.GPSChangeEvent(enable);
    }

    ;
}
