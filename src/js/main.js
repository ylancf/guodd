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
function main() {

     //如果自动化服务正常
  if (!autoServiceStart(3)) {
      logd("自动化服务启动失败，无法执行脚本")
      exit();
      return;
  }

  toast("这里是主线程");


   /* let s=  loadDex("defaultplugin.apk");
    if(!s){logd("调用失败"); toast("调用成功");}else{logd("调用成功!");
        toast("调用成功");}

     let obj=new com.plugin.jPrlGSPKhr.PluginClz();
     logd(obj.test());*/
    // var activity = ui.getActivity(); //获取当前的Activity
    // var resources = context.getResources(); //获取资源文件
    //  var view= activity.findViewById(getResourceID('template_save_btn', 'id'));
    //
    //  try {
    //      logd(view);
    //  }catch (e){
    //
    //  }
  // var s= ui.getShareData("VarShareData");
  // logd(s);

    updateConfig("toTop",JSON.stringify([1,3,5,7,55]));
    sleep(1000);
    var s= JSON.parse(readConfigString("toTop"));

}



function  huotiao(view){

    try {
        for ( let i=0;i<view.getChildCount();i++){

            logd(""+i+" "+view.getChildAt(i));
            huotiao(view.getChildAt(i));

        }
    }catch (e){

    }

}

//获取内置资源ID
function getResourceID(name, type) {
    //context.getResources().getIdentifier(name, type, context.getPackageName()');//废弃打包后无法获取内置资源
    return context.getResources().getIdentifier(name, type, 'com.gibb.easyclick');
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