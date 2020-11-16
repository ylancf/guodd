//初始化屏幕类   放一些中要的封装方法


importClass(android.content.Intent);
importClass(android.net.Uri)


function initScreenManagers() {

    //如果自动化服务正常
    if (!autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }

    let s = loadDex("defaultplugin.apk");
    if (!s) {
        logd("屏幕管理调用失败");
    } else {
        logd("调用成功!");
        screenManagers = new com.plugin.jPrlGSPKhr.ScreenHelper(context);
    }




}

//请求截图权限
function requestSCap(){

    toastLog("部分手机空白处隐藏了勾选框,但可以点击");
    let request = image.requestScreenCapture(10000,0);
    if (!request) {
        request = image.requestScreenCapture(10000,0);
    }
    logd("申请截图结果... "+request)
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

//权限检查与申请
function PermissionCheck(permisstionJson){
    new com.plugin.jPrlGSPKhr.ApplyPermission(context,JSON.stringify(permisstionJson),{
        goToSet:function (str){
            let result= confirm("权限申请", "缺少权限--"+str+"\n是否现在去申请?");
            if(result){
                var intent = new Intent();
                intent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
                intent.setData(Uri.parse("package:com.ylancf.gdd"))
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                try {
                    context.startActivity(intent);
                } catch (e) {
                    loge(e)
                }
            }
            exit();
        },
        continueRun:function (){

        }
    });
}


//获得屏幕的宽高
function getScreenWidthHeight(){
    let activity = ui.getActivity(); //获取当前的Activity
    let dm = new android.util.DisplayMetrics();//获得显示度量
    activity.getWindowManager().getDefaultDisplay().getMetrics(dm);//获取尺寸相关信息 没有这句代码w将为0
    let w = dm.widthPixels;//获得屏幕宽度
    let h=dm.heightPixels;
    // let w=device.getScreenWidth();
    // let h=device.getScreenHeight();
    return {width:w,height:h}
}




//下载东西的方法
// url 下载地址
// fileName 文件名和缀
// path   路径(后头不用/)   默认为 系统Download 文件夹

function downloadPassword(url,fileName,path) {

    let loadInfo = {
        setProgress: function (value) {
            ui.getHandler().post(function () {  //使用handle 改变主页面控件 线程中只能使用这个方式改变主线程的界面
                try {
                    let v = ui.findViewByTag("progressPer");
                    if (v) {
                        v.setText(value + "%")
                    };
                } catch (e) {
                    logd(e.message);
                }
            });
        },
        finish: function () {
            dialog.dismiss();
        },
        sendLog: function (info) {
            logd(info);
        },
        sendToast:function (info){
            toast(info);
        }
    };

    var obj = new com.plugin.jPrlGSPKhr.loadDownTool(context, loadInfo);
    if(path){
        var path = path+"/"+ fileName;
    }else{
        var path = obj.getPath() + fileName;
    }
    if (!file.exists(path)) {
        let result=confirm("提示", "需要下载密码字典,或手动添加到文件夹DownLoad/password.txt,是否下载?");
        if(result){
            loadDownBar("下载字典中..", true).then(value => {
                if (!value) {
                    obj.LoadDownStop();
                }
            });
            obj.download(path, url);
        }else{
            exit();
        }
    }
}


//判断是否高于某个版本
// 参数 version - 1.0.1
function check_Version(uVersion){
    // try {
        let versionData =  JSON.parse(readResString("package.txt"));
        if(versionData){
            let  currentVersion =versionData.version.replace(".","");
            let  version=uVersion.replace(".","");
            if(Number(currentVersion)>Number(version)){
                return true;
            }else{
                return  false;
            }
        }
    // }catch (e){
    //     logd(e.message);
    //     return  false;
    // }
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

function  localClick(_node){
    if(!_node){return  false;}
    _node.click();
    return true;
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



