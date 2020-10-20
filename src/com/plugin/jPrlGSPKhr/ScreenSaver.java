package com.plugin.jPrlGSPKhr;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

public class ScreenSaver extends Service {

    private final IBinder binder= new LocalBinder();

    public class LocalBinder extends Binder {
        ScreenSaver getService(){
            return  ScreenSaver.this;
        };
    }
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    public void onCreate() {
        // 注册一个监听屏幕开启和关闭的广播
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_SCREEN_ON);
        filter.addAction(Intent.ACTION_SCREEN_OFF);
        filter.addAction("unlockScreen233");
        registerReceiver(screenReceiver, filter);
    }

    BroadcastReceiver screenReceiver = new BroadcastReceiver() {
        @RequiresApi(api = Build.VERSION_CODES.KITKAT_WATCH)
        @Override
        public void onReceive(Context context, Intent intent) {
            // TODO Auto-generated method stub
            String action = intent.getAction();
            if (action.equals(Intent.ACTION_SCREEN_ON)) {

            } else if (action.equals(Intent.ACTION_SCREEN_OFF)) {//如果接受到关闭屏幕的广播

                PowerManagerWakeLock.release(); //当屏幕关闭时 换回系统锁屏
                Log.d("屏幕", "onReceive: 我这接收到屏幕关闭");
            }else if(action.equals("unlockScreen233")){
                Log.d("屏幕", "我接收到了 unlockScreen233");
                PowerManagerWakeLock.acquire(ScreenSaver.this);
            }
        }
    };

    public void onDestroy() {
        PowerManagerWakeLock.release();
        unregisterReceiver(screenReceiver);
        Log.d("屏幕", "onDestroy:我是服务 我关闭了");
    };


}
