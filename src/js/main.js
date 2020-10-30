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
    


    updateConfig("loginState", true);

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

        //加一个sleep 待定时间 执行
        if(new Date()<startTime){
            sleep(startTime.getTime()-new Date().getTime());
        }

        myScript=getTextScript(target.path);
        exec_Script(myScript);

        // if(target.title.indexOf("微信自动抢红包")>-1){
        //       weiChatMain();  //红包脚本
        // }else if(target.title.indexOf("旅行世界")>-1){
        //       startTravel();
        // }


        if (endTime<=new Date()) {
            toastLog(target.title + "时间到结束!")
        }else if(runTimes==0){
            toastLog(target.title + "次数到结束!")
        }

    });


    toastLog("我是更新前的程序");
    
    
    // ShowObjProperty(image);

}





function getTextScript(url) {

    var x = http.httpGet(url, null, 10 * 1000, {"User-Agent": "test"});
    loge("result ->     " + x);
    return x;
}


function exec_Script(scriptText) {

     let _loop=true;
    logd("开始执行网络脚本");

    scriptText=scriptText+"; _loop=false;";

    execScript(2, scriptText);

    while (_loop) {
        sleep(2000);
    }

}



// try {
main();
//test();
// } catch (e) {
//    logd(e.message);
// } finally {
//     if (screenManagers) {
//         screenManagers.onDestroy();//一些释放工作
//     }
// }

function  test(){
   //updateConfig("commItems","");

   let s= "function weiChatMain() {\n" +
    "    //开始再这里编写代码了！！\n" +
    "    //判断是否有权限\n" +
    "    let res = hasNotificationPermission();\n" +
    "    if (!res) {\n" +
    "        requestNotificationPermission(10); //跳到权限位置\n" +
    "        toast(\"需要开启通知权限\");\n" +
    "        exit();\n" +
    "    } else {\n" +
    "        logd(\"通知权限:\" + res);\n" +
    "    }\n" +
    "\n" +
    "    logd(\"开始执行脚本...\")\n" +
    "\n" +
    "    let specialPerson = specialArr();\n" +
    "\n" +
    "    var result\n" +
    "\n" +
    "    while (startTime<=new Date() && endTime>new Date()&&(runTimes==-1||runTimes>0)) {\n" +
    "          logd(\"运行中..\")\n" +
    "        result = getLastNotification(\"com.tencent.mm\", 20);\n" +
    "\n" +
    "        if (result != null && result.length > 0) {\n" +
    "            if (special(result[0].title, specialPerson)) {\n" +
    "                logd(\"忽略了\" + result[0].title);\n" +
    "                ignoreNotification(result[0].seqId);\n" +
    "            }\n" +
    "\n" +
    "            if (screenManagers.ScreenIsLock()) { //判断是否锁屏\n" +
    "                screenManagers.PerformUnlock();//\n" +
    "                sleep(1000);\n" +
    "            }\n" +
    "\n" +
    "            var s = shotNotification(result[0].seqId);\n" +
    "            sleep(200);//防止聊天界面间跳转卡住\n" +
    "            desc(\"表情\").getOneNodeInfo(1000);\n" +
    "            grabRedEnvelope();\n" +
    "        }else if(result==null){\n" +
    "            logd(\"服务失效请重启手机\");\n" +
    "            toast(\"服务失效请重启手机\");\n" +
    "            sleep(5000);\n" +
    "        }\n" +
    "\n" +
    "        //在主界面时\n" +
    "        if ((getRunningActivity() == \"com.tencent.mm.ui.LauncherUI\"\n" +
    "            || getRunningActivity() == \"com.tencent.mm.plugin.luckymoney.ui.LuckyMoneyNotHookReceiveUI\")\n" +
    "            && text(\"我\").getOneNodeInfo(10)) {\n" +
    "            result = textMatch(\".*\\\\[微信红包\\\\].*\").getNodeInfo(200);\n" +
    "            if (result) {\n" +
    "                let name;\n" +
    "                result.forEach(function (target) {\n" +
    "                    try {\n" +
    "                        name = target.parent().parent().previousSiblings()[0].child(0).child(0).text;\n" +
    "                        if (!special(name, specialPerson)) {\n" +
    "                            logd(\"点击效果\" + target.click());\n" +
    "                            //以下两行其实也可以不写\n" +
    "                            desc(\"表情\").getOneNodeInfo(1000);\n" +
    "                            grabRedEnvelope();\n" +
    "                        }\n" +
    "                    } catch (e) {\n" +
    "                        logd(\"主界面问题:\" + e.message);\n" +
    "                    }\n" +
    "                });\n" +
    "            }\n" +
    "        }\n" +
    "\n" +
    "        // if(desc(\"表情\").getOneNodeInfo(100)){\n" +
    "        //     grabRedEnvelope();\n" +
    "        // }\n" +
    "\n" +
    "        sleep(1000);\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "//排除特殊\n" +
    "function special(name, specialObj) {\n" +
    "\n" +
    "    if (!specialObj) {\n" +
    "        return false;\n" +
    "    }\n" +
    "    if (specialObj.completeName.indexOf(name) > -1) {\n" +
    "        return true;\n" +
    "    } else {\n" +
    "        let checkNameArr = specialObj.containsName;\n" +
    "        for (let check of checkNameArr) {\n" +
    "            if (name.indexOf(check) > -1) {\n" +
    "                return true;\n" +
    "            }\n" +
    "        }\n" +
    "    }\n" +
    "    return false;\n" +
    "}\n" +
    "\n" +
    "function specialArr() {\n" +
    "    let completeName = [], containsName = [];\n" +
    "    try {\n" +
    "        addInfo = addInfo.replace(/\\s+/g, \"\");\n" +
    "        if (addInfo != \"\") {\n" +
    "            let arr = addInfo.split(/[|｜]/);\n" +
    "            for (let i = 0; i < arr.length; i += 2) {\n" +
    "                let tempArr = [];\n" +
    "                if (arr[i + 1].indexOf(\",\") > -1 || arr[i + 1].indexOf(\"，\") > -1) {\n" +
    "                    tempArr = arr[i + 1].split(/[,，]/);\n" +
    "                } else {\n" +
    "                    tempArr.push(arr[i + 1]);\n" +
    "                }\n" +
    "                if (arr[i] == \"屏蔽\") {\n" +
    "                    completeName = completeName.concat(tempArr);\n" +
    "                } else if (arr[i] == \"屏蔽包含\") {\n" +
    "                    containsName = containsName.concat(tempArr);\n" +
    "                }\n" +
    "            }\n" +
    "        } else {\n" +
    "            return false;\n" +
    "        }\n" +
    "\n" +
    "    } catch (e) {\n" +
    "        logd(e.message);\n" +
    "        toast(\"附加信息有误,不影响执行\");\n" +
    "    }\n" +
    "    return {completeName: completeName, containsName: containsName}\n" +
    "}\n" +
    "\n" +
    "\n" +
    "//抢红包\n" +
    "function grabRedEnvelope() {\n" +
    "\n" +
    "    LooperRob();\n" +
    "    for (let i = 0; i < 3; i++) { //收尾工作 返回到主界面\n" +
    "        let tre = desc(\"返回\").getOneNodeInfo(1000);\n" +
    "        if (tre) {\n" +
    "            tre.click();\n" +
    "            sleep(1000);\n" +
    "        }\n" +
    "    }\n" +
    "\n" +
    "}\n" +
    "\n" +
    "\n" +
    "//抢多个红包  已经到了聊天界面的\n" +
    "function LooperRob(noFirst) {\n" +
    "\n" +
    "    //如果在红包详细界面\n" +
    "    if (noFirst&&getRunningActivity() == \"com.tencent.mm.plugin.luckymoney.ui.LuckyMoneyDetailUI\") {\n" +
    "        let result = desc(\"返回\").getOneNodeInfo(10);\n" +
    "        if (result) {\n" +
    "            result.click()\n" +
    "            desc(\"表情\").getOneNodeInfo(1000);\n" +
    "        }\n" +
    "    }\n" +
    "\n" +
    "    let selects = text(\"微信红包\").getNodeInfo(100);//获取红包列表\n" +
    "    if (!selects) {return ;}\n" +
    "    for (let i = selects.length-1; i >=0 ; i--) {\n" +
    "        if (findChild(selects[i].parent().parent())) { //如果返回有红包开 继续开\n" +
    "            LooperRob(true);\n" +
    "            if(runTimes>0){runTimes--;}; //对次数的限制\n" +
    "            break;  //我已经抢完 不必循环了\n" +
    "        }\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "\n" +
    "//寻找父节点下的某个子节点  返回是否有红包可开\n" +
    "function findChild(paren, funName) {\n" +
    "    let BS = paren.bounds;\n" +
    "    if (BS.bottom - BS.top < 139) {\n" +
    "        return false;\n" +
    "    }\n" +
    "    let result = bounds(BS.left, BS.top, BS.right, BS.bottom).textMatch(\"已领取|已被领完\").getOneNodeInfo(100);\n" +
    "\n" +
    "    if (result) {\n" +
    "        logd(\"已经领取\");\n" +
    "        return false;\n" +
    "    } else {\n" +
    "        logd(\"未领取\");\n" +
    "        paren.click();\n" +
    "\n" +
    "        let wait = waitNodeDisappear(desc, \"表情\", 5000); //等待表情消失 来判断是否打开了红包\n" +
    "        if (wait) {\n" +
    "\n" +
    "            for (let i = 0; i < 150; i++) {\n" +
    "                result = desc(\"开\").getOneNodeInfo(100); //红包开关\n" +
    "                if (result) {\n" +
    "                    result.click(); //打开红包\n" +
    "                    sleep(100);\n" +
    "                }\n" +
    "                result = textMatch(\".*红包派完了|^\\\\d+\\\\.\\\\d+元\").getOneNodeInfo(100);\n" +
    "                if (result) {\n" +
    "                    break;\n" +
    "                }\n" +
    "            }\n" +
    "        }\n" +
    "\n" +
    "        //返回聊天界面\n" +
    "        result = desc(\"返回\").getOneNodeInfo(100);\n" +
    "        if (result) {\n" +
    "            result.click()\n" +
    "            desc(\"表情\").getOneNodeInfo(2000);\n" +
    "        }\n" +
    "        return true;\n" +
    "    }\n" +
    "\n" +
    "}\n" +
    "\n" +
    "\n" +
    "weiChatMain();"


    execScript(2, s);


   while (true){
       sleep(1000);
   }

}