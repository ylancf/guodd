package com.plugin.jPrlGSPKhr;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;


public class MyScreenHelper {

    ScreenSaver screenSaverService;
    boolean bound = false;

    public static Context context;

    public MyScreenHelper(Context context){

        this.context=context;

        Intent intent = new Intent(context, ScreenSaver.class);
        context.bindService(intent, connection, Context.BIND_AUTO_CREATE);
        context.startService(intent);

    }

    //停止服务
    public  void ScreenServiceStop(){
        if (screenSaverService != null) {
            screenSaverService.stopSelf();
        }
    }

    //发送解锁广播  第一次肯能会不成功 不成功稍后再试
    public  boolean SendUnlockBroadcast(){
        if(screenSaverService==null){
            return false;
        }
        Intent intent = new Intent("unlockScreen233");  //这里的action要一致。
        //intent.putExtra("time", "2020-03-16");
        context.sendBroadcast(intent);
        return  true;
    }


    protected void onStop() {
        if (bound) {
            context.unbindService(connection);
            bound = false;
        }
    }

    private ServiceConnection connection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            ScreenSaver.LocalBinder binder = (ScreenSaver.LocalBinder) service;
            screenSaverService = binder.getService();
            Log.d("屏幕", "onServiceConnected:我执行了 ");
            bound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            bound = false;
            Log.d("屏幕", ":我断开连接 ");
        }
    };

}
