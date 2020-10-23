package com.plugin.jPrlGSPKhr;

import android.annotation.SuppressLint;
import android.app.KeyguardManager;
import android.content.Context;
import android.os.Build;
import android.os.PowerManager;

import androidx.annotation.RequiresApi;

import static android.content.Context.KEYGUARD_SERVICE;
import static java.lang.Thread.sleep;

public class PowerManagerWakeLock {

    static KeyguardManager.KeyguardLock keyguardLock;

    @RequiresApi(api = Build.VERSION_CODES.KITKAT_WATCH)
    public  static  void acquire(Context context){

        try {

            // 获取电源管理器对象
            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            boolean screenOn = pm.isInteractive();
            if (!screenOn) {
                // ScreenOn是LogCat里用的Tag
                @SuppressLint("InvalidWakeLockTag") PowerManager.WakeLock wl = pm.newWakeLock(
                        PowerManager.ACQUIRE_CAUSES_WAKEUP |
                                PowerManager.SCREEN_BRIGHT_WAKE_LOCK, "ScreenOn");
                wl.acquire(1000); // 点亮屏幕
                wl.release(); // 释放
            }
            // 屏幕解锁
            KeyguardManager keyguardManager = (KeyguardManager) context.getSystemService(KEYGUARD_SERVICE);
            keyguardLock = keyguardManager.newKeyguardLock("unLock");
            // 屏幕锁定
            keyguardLock.disableKeyguard(); // 解锁 关闭掉了系统锁屏服务,所以多次调用会出错

        }catch (Exception e){

        }


    }

    /**关闭 保持屏幕唤醒*/
    public static void release() {
        try {
            if (keyguardLock != null) {
                keyguardLock.reenableKeyguard(); //恢复系统锁屏
            }
        }catch (Exception e){

        }
    }

    //判断屏幕是否锁屏
    public static boolean ScreenIsLock(Context context){
        try {
            KeyguardManager mKeyguardManager = (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);
            return  mKeyguardManager.inKeyguardRestrictedInputMode();
        }catch (Exception e ){
            release();
            return true;
        }
    }

}
