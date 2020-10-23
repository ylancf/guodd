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
import android.widget.Toast;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;


public class ScreenHelper {

    final private Context context;
    BroadcastReceiver screenReceiver;
    private  Intent intent;
    public ScreenHelper(Context context) {
        this.context = context;
        intiFunction();
        intent = new Intent("unlockScreen233");
        // 注册一个监听屏幕开启和关闭的广播
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_SCREEN_ON);
        filter.addAction(Intent.ACTION_SCREEN_OFF);
        filter.addAction("unlockScreen233");
        context.registerReceiver(screenReceiver, filter);

    }

    private void intiFunction() {
        screenReceiver = new BroadcastReceiver() {
            @RequiresApi(api = Build.VERSION_CODES.KITKAT_WATCH)
            @Override
            public void onReceive(Context context, Intent intent) {
                // TODO Auto-generated method stub
                String action = intent.getAction();
                if (action.equals(Intent.ACTION_SCREEN_ON)) {

                } else if (action.equals(Intent.ACTION_SCREEN_OFF)) {//如果接受到关闭屏幕的广播

                    PowerManagerWakeLock.release(); //当屏幕关闭时 换回系统锁屏

                } else if (action.equals("unlockScreen233")) {

                    PowerManagerWakeLock.acquire(context);
                }
            }
        };
    }


    //判断是否锁屏
    public  boolean  ScreenIsLock(){
      return   PowerManagerWakeLock.ScreenIsLock(context);

    }

   //直接解锁
    public void DirectUnlock(){
        PowerManagerWakeLock.acquire(context);
    }

    //改为系统锁
    public void release(){
        PowerManagerWakeLock.release();
    }


    public void  PerformUnlock(){
        PerformUnlock(0);
    }

    //执行解锁   未锁将什么都不做
    public void  PerformUnlock(int waitTime){
         //intent.putExtra("time", "2020-03-16");
        try {
            context.sendBroadcast(intent);
            Thread.sleep(waitTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    //退出后恢复原来的系统锁屏
    public void onDestroy() {
        PowerManagerWakeLock.release();
        context.unregisterReceiver(screenReceiver);
    }

}
