package com.plugin.jPrlGSPKhr;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Looper;
import android.provider.Settings;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import  androidx.appcompat.app.AppCompatActivity;





import java.util.ArrayList;
import java.util.List;

public class ApplyPermission extends Activity {




    String[] permissions;  //Manifest.permission.WRITE_EXTERNAL_STORAGE,Manifest.permission.READ_EXTERNAL_STORAGE,
    //String s= Manifest.permission.WAKE_LOCK;//,Manifest.permission.DISABLE_KEYGUARD


    private Activity activity;
    private Context context;
    List<String> mPermissionList=new ArrayList<>();
    private final int mRequestCode = 100;//权限请求码
    AlertDialog mPermissionDialog;
    String mPackName = "com.gibb.easyclick";///"com.pkg2.mytestapp";//自己的项目包名;



    public  ApplyPermission(){
        if(Looper.myLooper()==null){
           System.out.println("没有looper对象");
        }else{
            System.out.println("有looper对象");
        }
    }


    //开始执行获取权限
    public  void  ExecPermission(Context context,Activity activity , String[] _permissions){
         permissions=_permissions;
         this.context=context;
        this.activity=activity;
        if (Build.VERSION.SDK_INT >= 23) {//6.0才用动态权限
            initPermission();
        }


    }

    private void initPermission() {
        mPermissionList.clear();//清空没有通过的权限
        //逐个判断你要的权限是否已经通过
        for (int i = 0; i < permissions.length; i++) {

            PackageManager pm =context.getPackageManager();
            boolean permission = (PackageManager.PERMISSION_GRANTED ==
                    pm.checkPermission(permissions[i], mPackName));
            if (!permission) {
                mPermissionList.add(permissions[i]);//添加还未授予的权限
            }
        }
        //申请权限
        if (mPermissionList.size() > 0) {//有权限没有通过，需要申请
            ActivityCompat.requestPermissions(activity, permissions, mRequestCode);
        }else{
            //说明权限都已经通过，可以做你想做的事情去
        }
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        boolean hasPermissionDismiss = false;//有权限没有通过
        if (mRequestCode == requestCode) {
            for (int i = 0; i < grantResults.length; i++) {
                if (grantResults[i] == -1) {
                    hasPermissionDismiss = true;
                }
            }
            //如果有权限没有被允许
            if (hasPermissionDismiss) {
                showPermissionDialog();//跳转到系统设置权限页面，或者直接关闭页面，不让他继续访问
            }else{
                //全部权限通过，可以进行下一步操作。。。
            }
        }
    }

    /**
     * 不再提示权限时的展示对话框
     */
    private void showPermissionDialog() {
        if (mPermissionDialog == null) {
            mPermissionDialog = new AlertDialog.Builder(activity)
                    .setMessage("已禁用权限，请手动授予")
                    .setPositiveButton("设置", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            cancelPermissionDialog();

                            Uri packageURI = Uri.parse("package:" + mPackName);
                            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, packageURI);
                           startActivity(intent);
                        }
                    })
                    .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            //关闭页面或者做其他操作
                            cancelPermissionDialog();

                        }
                    })
                    .create();
        }
        mPermissionDialog.show();
    }

    //关闭对话框
    private void cancelPermissionDialog() {
        mPermissionDialog.cancel();
    }


}
