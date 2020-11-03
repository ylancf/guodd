package com.plugin.jPrlGSPKhr.WifiCarcker;

import android.util.Log;

import java.io.*;

public class PasswordGetter {
    private String password;
    private File file;
    private FileReader reader;
    private BufferedReader br;


    //初始化 br缓存,为以后获得密码做准备
    public PasswordGetter(String passwordFile) throws FileNotFoundException{
        password = null;
        // file = new File("/sdcard/Download/WeiXin/password.txt");
        file = new File(passwordFile);
        Log.d("打印","执行了");
        if (!file.exists())
            throw new FileNotFoundException();
        reader = new FileReader(file);
        Log.d("打印","对象"+br);
        br = new BufferedReader(reader);

//        for(int i=0;i<startNUmber;i++){
//            try {
//                br.readLine();
//            } catch (IOException e) {
//                e.printStackTrace();
//                password="00000001";
//                break;
//            }
//        }




    }
    
    public void reSet(){
        try {
            br.close();
            reader.close();
            reader = new FileReader(file);
            br = new BufferedReader(reader);
        } catch (IOException e) {
            e.printStackTrace();
            password = null;
        }
    }

    //获取密码
    public String getPassword(){
        try {
            password = br.readLine();
        } catch (IOException e) {
            e.printStackTrace();
            password = null;
        }
        return password;
    }
    
    public void Clean(){
        try {
            br.close();
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
