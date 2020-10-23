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

var screenManagers;
var addInfo;
var  myScript="",myScriptNext="";

function  initScreenManagers(){
    let s = loadDex("defaultplugin.apk");
    if (!s) {
        logd("屏幕管理调用失败");
    } else {
        logd("调用成功!");
        screenManagers = new com.plugin.jPrlGSPKhr.ScreenHelper(context);
    }
}


function main() {

    //如果自动化服务正常
    if (!autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }
    //获取屏幕管理对象
    initScreenManagers()
    toast("脚本开始");
    //得到要运行的脚本信息
    let list = [];
    let shareList = ui.getShareData("VarShareData");
    list = shareList.filter(function (x) {
        return x.done == true;
    });

    for (let i = 0; i < list.length; i++) {
        if (list[i].prompt != "") {
            addInfo = list[i].addInfo;
        }

        //  myScript=getTextScript("http://47.98.194.121:80/"+list[i].path);


        weiChatMain();
    }

}

function getTextScript(url) {

    var url = "http://192.168.0.5:8081/api/httpGet?a=1";
    var pa = {"b": "22"};
    var x = http.httpGet(url, pa, 10 * 1000, {"User-Agent": "test"});
    toast(" result->     " + x);
    loge("result ->     " + x);
}


function execScript(scriptText) {

    thread.execAsync(function () {
        //execScript(1,"/sdcard/ad.js")
        execScript(2, scriptText);
    });

    while (true) {
        sleep(2000);
        loge("fsadffsad")
    }

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


try {
    main();
} catch (e) {

} finally {
    if (screenManagers) {
        screenManagers.onDestroy();//一些释放工作
    }
}

