//初始化屏幕类
function initScreenManagers() {
    let s = loadDex("defaultplugin.apk");
    if (!s) {
        logd("屏幕管理调用失败");
    } else {
        logd("调用成功!");
        screenManagers = new com.plugin.jPrlGSPKhr.ScreenHelper(context);
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


//直到节点消失  返回值 消失返回true 否则 false
function waitNodeDisappear(fun, value, outTime) {
    while (outTime > 0) {
        if (fun(value).getOneNodeInfo(100)) {
            sleep(100);
            outTime -= 100;
        } else {
            return true;
        }
    }
    return false;
}

//对要运行的脚本进行 按时间排序
function listSorting(list) {
    let newList;
    list.forEach(function (target) {
        let sTime = target.summary.replace(/\s+/g, "");
        let sArr = sTime.split(/[,，]/);
        let time = sArr[0].split(":");

        if (time.length == 3) {  //启动时间设定
            try {
                target.startTime = new Date();
                target.startTime.setHours(time[1], time[2]);
            } catch (e) {

                target.startTime = new Date();
            }
        } else {
            target.startTime = new Date();
        }
        //运行结束部分
        let runLong = sArr[1].split(":");
        let runMin = 100000;
        if (Number(runLong[1]) > 0) {
            runMin = Number(target.startTime.getMinutes()) + Number(runLong[1]);
        }
        target.endTime = new Date();
        logd(runMin);
        target.endTime.setHours(target.startTime.getHours(), runMin);
        //启动次数设定
        let times = sArr[2].split(":", 2)[1];
        target.runTimes = times != "" ? times : -1;
    });

    newList = list.sort(function (a, b) {
        return a.startTime > b.startTime
    });
    return newList;
}

function toastLog(msg) {
    logd(msg);
    toast(msg);
}


//关闭app  参数 包名
function closeApp(pkgName) {
    let intent = new Intent();
    intent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
    intent.setData(Uri.parse("package:" + pkgName));
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    try {
        context.startActivity(intent);
        let is_sure = textMatch(".*强.*|.*停.*|.*结.*|.*运行.*").getOneNodeInfo(10000);
        if (is_sure) {
            sleep(300);
            is_sure.click();
            let _sure = textMatch(".*确.*|.*定.*").getOneNodeInfo(3000);
            if (_sure) {
                _sure.click();
                return true;
            } else {
                toastLog("_sure未找到");
                return false;
            }
        } else {
            toastLog( "应用不能被正常关闭或不在后台运行");
            return false;
        }
    } catch (e) {
        loge(e)
    }
    return false;
}



// function  closeApp(){
//     thread.stopAll();
//
//     var packageName = app.getPackageName(appName)
//     if (!packageName) { return false; }
//     var setFace = app.openAppSetting(packageName);
//     log("打开设置结果:" + setFace);
//     text(appName).findOne(10000);
//     let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*|.*运行.*)/).findOne(10000);
//     if (is_sure && is_sure.enabled()) {
//         let jiesu = textMatches(/(.*强.*|.*停.*|.*结.*|.*运行.*)/).findOne(3000);
//         if (jiesu) { jiesu.click(); } else { log("jiesu未找到"); return false; }
//         let _sure = textMatches(/(.*确.*|.*定.*)/).findOne(3000);
//         if (_sure) { _sure.click(); } else { log("_sure未找到"); return false; }
//         log(getAppName(packageName) + "应用已被关闭");
//         sleep(1000);
//         back();
//         return true;
//
//     } else {
//         log(getAppName(packageName) + "应用不能被正常关闭或不在后台运行");
//         return false;
//     }
//
//
// }