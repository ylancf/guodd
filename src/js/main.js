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

importClass (android.content.Intent);
importClass (android.graphics.Bitmap);
importClass (android.net.Uri);

var screenManagers;
var addInfo="";
var startTime,endTime,runTimes;
var  myScript="",myScriptNext="";

function main() {
    //获取屏幕管理对象
    initScreenManagers()
    toast("脚本开始");

    updateConfig("loginState", true);

    //得到要运行的脚本信息
    let list = [];
    let shareList = ui.getShareData("VarShareData");
    list = shareList.filter(function (x) {
        return x.done == true;
    });


   list= listSorting(list);//按时间排序


    list.forEach(function (target){
        addInfo = target.addInfo;
        startTime=target.startTime;
        endTime=target.endTime;
        runTimes=target.runTimes;

        //加一个sleep 待定时间 执行
        if(new Date()<startTime){
            sleep(startTime.getTime()-new Date().getTime());
        }
        if (screenManagers.ScreenIsLock()) { //判断是否锁屏
            screenManagers.PerformUnlock();//
            sleep(1000);
        }
          myScript=getTextScript(target.path);
          exec_Script(myScript);

        sleep(100000);


        if (endTime<=new Date()) {
            toastLog(target.title + "时间到结束!")
        }else if(runTimes==0){
            toastLog(target.title + "次数到结束!")
        }

    });

}





function getTextScript(url) {

    var x = http.httpGet(url, null, 10 * 1000, {"User-Agent": "test"});
    loge("result ->     " + x);
    return x;
}


function exec_Script(scriptText) {

     let _loop=true;
    logd("开始执行网络脚本");

    scriptText="try {"+scriptText+"}catch (e){ toastLog(e.message);} finally {_loop=false;}"
    execScript(2, scriptText);

    while (_loop) {
        sleep(2000);
    }
}




main();

function  test(){

    var result = closeCtrlWindow();
    toastLog("是否展示:"+result);

}