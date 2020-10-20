/**
 * 常用JS变量:
 * agentEvent = 代理模式下自动点击模块
 * acEvent= 无障碍模式下自动点击模块
 * device = 设备信息模块
 * file = 文件处理模块
 * http = HTTP网络请求模块
 * shell = shell命令模块
 * thread= 多线程模块
 * image = 图色查找模块
 * utils= 工具类模块
 * global = 全局快捷方式模块
 * 常用java变量：
 *  context : Android的Context对象
 *  javaLoader : java的类加载器对象
 * 导入Java类或者包：
 *  importClass(类名) = 导入java类
 *      例如: importClass(java.io.File) 导入java的 File 类
 *  importPackage(包名) =导入java包名下的所有类
 *      例如: importPackage(java.util) 导入java.util下的类
 */
importClass(android.content.Intent);
function main() {

    //如果自动化服务正常
    if (!autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }

    toast("这里是主线程");


    // //不带文件的请求
    // var url = "http://47.98.194.121:80/login";
    // var pa = {"username":"111","password":"222"}
    // var result = http.httpPost(url, pa, null, 5 * 1000, {"User-Agent": "Mobile"});
    // loge("result ->     " + result);
    //
    // exit();


    let s = loadDex("defaultplugin.apk"); //改成你们自己的
    if (!s) {
        logd("调用失败");
        toast("调用失败");
    } else {
        logd("调用成功!");
        toast("调用成功");
    }

    // let applyPermission = new com.plugin.jPrlGSPKhr.ApplyPermission();
    // //申请权限
    // applyPermission.ExecPermission([Manifest.permission.WAKE_LOCK,Manifest.permission.DISABLE_KEYGUARD]);

    let obj = new com.plugin.jPrlGSPKhr.ScreenHelper(context);
    if (obj) {
        logd(obj);
    }

    logd(obj.ScreenIsLock());
    
    sleep(10000);

    logd(obj.ScreenIsLock());
    

    // toast("十秒后开屏");
    // sleep(10000);
    //这个是立即运行的 立马见效的 直接用的话 用一次 调用一次 PowerManagerWakeLock.release();
    //com.plugin.jPrlGSPKhr.PowerManagerWakeLock.acquire(context);



    // 刚注册广播 马上就调用第一次调用可能不会成功(因为 注册了系统不一定立即运行)
    // var intent = new Intent("unlockScreen233");  //这里的action要一致。
    // //intent.putExtra("time", "2020-03-16");
    // context.sendBroadcast(intent);
    //
    // sleep(5000);
    // context.sendBroadcast(intent);
    //
    // sleep(2000);
    // context.sendBroadcast(intent);
    // sleep(5000);


}



function autoServiceStart(time) {
    for (var i = 0; i < time; i++) {
        if (isServiceOk()) {
            return true;
        }
        var started = startEnv();
        logd("第" + (i + 1) + "次启动服务结果: " + started);
        if (isServiceOk()) {
            return true;
        }
    }
    return isServiceOk();
}

main();