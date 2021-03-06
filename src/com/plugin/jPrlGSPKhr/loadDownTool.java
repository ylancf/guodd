package com.plugin.jPrlGSPKhr;


import android.content.Context;
import android.os.Environment;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class loadDownTool {
    private Context context;

    //  判断是否停止
    private boolean mIsCancel = false;
    //  进度
    private int mProgress;
    //  文件保存路径

    private MyTest localHander;


    public loadDownTool(Context context , MyTest handerObj) {
        this.context = context;
        this.localHander = handerObj;
    }


    /**/
    public void download(String mSavePath, String loadDownUrl) {

            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        // 下载文件
                        HttpURLConnection conn = (HttpURLConnection) new URL(loadDownUrl).openConnection();
                        conn.connect();
                        InputStream is = conn.getInputStream();
                        int length = conn.getContentLength();

                        File apkFile = new File(mSavePath);
                        FileOutputStream fos = new FileOutputStream(apkFile);

                        int count = 0;
                        int localProfress = 0;
                        byte[] buffer = new byte[5 * 1024];
                        while (!mIsCancel) {
                            int numread = is.read(buffer);
                            count += numread;
                            // 计算进度条的当前位置
                            localProfress = (int) (((float) count / length) * 100);
                            // 更新进度条
                            if (localProfress > mProgress) { //防止执行过度 界面卡死
                                mProgress = localProfress;
                                localHander.setProgress(mProgress);
                            }
                            // 下载完成
                            if (numread < 0) {
                                localHander.finish();
                                break;
                            }
                            fos.write(buffer, 0, numread);
                        }
                        fos.close();
                        is.close();

                    } catch (Exception e) {
                        e.printStackTrace();
                        if(e.getMessage().contains("No address associated")){
                            localHander.sendLog("确保有网络");
                            localHander.sendToast("确保有网络");
                        };
                        localHander.sendLog(e.getMessage());
                    }
                }
            }).start();
    }


    //停止下载
    public void LoadDownStop() {
        mIsCancel = true;
    }


    public String getPath() {
        //返回系统路径
        return Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + Environment.DIRECTORY_DOWNLOADS + "/";
    }

    public interface MyTest {

        public void setProgress(int progress);

        public void finish();

        public  void sendLog(String info);

        public  void sendToast(String info);
    }

}


