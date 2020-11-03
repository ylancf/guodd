package com.plugin.jPrlGSPKhr;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ApplyPermission  {
    // applyPermission.ExecPermission(context,ui.getActivity(),["android.permission.WAKE_LOCK","android.permission.DISABLE_KEYGUARD"]);

    private Activity activity;
    private Context context;
    private Idialogs dialogs;
    List<String> mPermissionList=new ArrayList<>();
    JSONObject permissonsJson;
    String mPackName = "com.ylancf.gdd";//自己的项目包名;


    //开始执行获取权限
    public   ApplyPermission(Context context, String _permissions,Idialogs dialogd){

        try {
            permissonsJson = new JSONObject(_permissions);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        this.context=context;
        this.dialogs=dialogd;
        this.activity=activity;
        if (Build.VERSION.SDK_INT >= 23) {//6.0才用动态权限
            initPermission();
        }




    }


    interface  Idialogs{
        public void goToSet(String info);
        public void continueRun();
    }


    private void initPermission() {
        mPermissionList.clear();//清空没有通过的权限
        //逐个判断你要的权限是否已经通过


        Iterator it = permissonsJson.keys();
        while (it.hasNext()) {
            try {
                String key = (String) it.next();
                String value = permissonsJson.getString(key);
                PackageManager pm =context.getPackageManager();
                boolean permission = (PackageManager.PERMISSION_GRANTED ==
                        pm.checkPermission(value, mPackName));
                if (!permission) {
                    mPermissionList.add(key);//添加还未授予的权限
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        //申请权限
        if (mPermissionList.size() > 0) {//有权限没有通过，需要申请
            String str="";
            for (int i=0;i<mPermissionList.size();i++){
                str+=mPermissionList.get(i);
            }
            dialogs.goToSet(str);
            //ActivityCompat.requestPermissions(activity, permissions, mRequestCode);
        }else{
            dialogs.continueRun();
            //说明权限都已经通过，可以做你想做的事情去
        }
    }


}
