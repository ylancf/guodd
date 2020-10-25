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

    //如果自动化服务正常
    if (!autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }
    //获取屏幕管理对象
    initScreenManagers()
    toast("脚本开始");
    
   // test();
    
    //得到要运行的脚本信息
    let list = [];
    let shareList = ui.getShareData("VarShareData");
    list = shareList.filter(function (x) {
        return x.done == true;
    });


   list= listSorting(list);//按时间排序

    //logd(JSON.stringify(list));

    list.forEach(function (target){
        addInfo = target.addInfo;
        startTime=target.startTime;
        endTime=target.endTime;
        runTimes=target.runTimes;

        //  myScript=getTextScript("http://47.98.194.121:80/"+list[i].path);



        if (endTime<=new Date()) {
            toastLog(target.title + "时间到结束!")
        }else if(runTimes==0){
            toastLog(target.title + "次数到结束!")
        }

    });


    toastLog("我是更新前的程序");
    
    
    // ShowObjProperty(image);

    startTravel();

   //  weiChatMain();  //红包脚本
    

       
}



function test(){



    //var list = bounds(0, 890, 1080, 1603).textMatch("^\d+$").getNodeInfo(10);
    var list = id("com.jiayouya.travel:id/tv_level").getNodeInfo(10);
    logd(list.length);



    
    exit();
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
        loge("脚本运行中");
    }

}



// try {
    main();
// } catch (e) {
//    logd(e.message);
// } finally {
//     if (screenManagers) {
//         screenManagers.onDestroy();//一些释放工作
//     }
// }

