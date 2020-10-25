/*
* [2020-10-21 08:30:31.62]【远程设备】(js/main.js#95 )属性属性：seqId = com.tencent.mm-358359843
属性：pkg = com.tencent.mm
属性：text = [2条]最强临时工: [微信红包]恭喜发财，大吉大利
属性：title = @[表情]陵设默群、最强临时工、拟态人生
属性：subText = undefined
属性：infoText = null
属性：time = 1603240229553
属性：bigText = undefined
属性：titleBig = undefined
属性：summaryBig = undefined
属性：key = 0|com.tencent.mm|-358359843|null|10129
属性：tickerText = 最强临时工: [微信红包]恭喜发财，大吉大利
* */


function weiChatMain() {
    //开始再这里编写代码了！！
    //判断是否有权限
    let res = hasNotificationPermission();
    if (!res) {
        requestNotificationPermission(10); //跳到权限位置
        toast("需要开启通知权限");
        exit();
    } else {
        logd("通知权限:" + res);
    }

    logd("开始执行脚本...")

    let specialPerson = specialArr();

    var result

    while (startTime<=new Date() && endTime>new Date()&&(runTimes==-1||runTimes>0)) {
          logd("运行中..")
        result = getLastNotification("com.tencent.mm", 20);

        if (result != null && result.length > 0) {
            if (special(result[0].title, specialPerson)) {
                logd("忽略了" + result[0].title);
                ignoreNotification(result[0].seqId);
            }

            if (screenManagers.ScreenIsLock()) { //判断是否锁屏
                screenManagers.PerformUnlock();//
                sleep(1000);
            }

            var s = shotNotification(result[0].seqId);
            sleep(200);//防止聊天界面间跳转卡住
            desc("表情").getOneNodeInfo(1000);
            grabRedEnvelope();
        }else if(result==null){
            logd("服务失效请重启手机");
            toast("服务失效请重启手机");
            sleep(5000);
        }

        //在主界面时
        if ((getRunningActivity() == "com.tencent.mm.ui.LauncherUI"
            || getRunningActivity() == "com.tencent.mm.plugin.luckymoney.ui.LuckyMoneyNotHookReceiveUI")
            && text("我").getOneNodeInfo(10)) {
            result = textMatch(".*\\[微信红包\\].*").getNodeInfo(200);
            if (result) {
                let name;
                result.forEach(function (target) {
                    try {
                        name = target.parent().parent().previousSiblings()[0].child(0).child(0).text;
                        if (!special(name, specialPerson)) {
                            logd("点击效果" + target.click());
                            //以下两行其实也可以不写
                            desc("表情").getOneNodeInfo(1000);
                            grabRedEnvelope();
                        }
                    } catch (e) {
                        logd("主界面问题:" + e.message);
                    }
                });
            }
        }

        // if(desc("表情").getOneNodeInfo(100)){
        //     grabRedEnvelope();
        // }

        sleep(1000);
    }
}

//排除特殊
function special(name, specialObj) {

    if (!specialObj) {
        return false;
    }
    if (specialObj.completeName.indexOf(name) > -1) {
        return true;
    } else {
        let checkNameArr = specialObj.containsName;
        for (let check of checkNameArr) {
            if (name.indexOf(check) > -1) {
                return true;
            }
        }
    }
    return false;
}

function specialArr() {
    let completeName = [], containsName = [];
    try {
        addInfo = addInfo.replace(/\s+/g, "");
        if (addInfo != "") {
            let arr = addInfo.split(/[|｜]/);
            for (let i = 0; i < arr.length; i += 2) {
                let tempArr = [];
                if (arr[i + 1].indexOf(",") > -1 || arr[i + 1].indexOf("，") > -1) {
                    tempArr = arr[i + 1].split(/[,，]/);
                } else {
                    tempArr.push(arr[i + 1]);
                }
                if (arr[i] == "屏蔽") {
                    completeName = completeName.concat(tempArr);
                } else if (arr[i] == "屏蔽包含") {
                    containsName = containsName.concat(tempArr);
                }
            }
        } else {
            return false;
        }

    } catch (e) {
        logd(e.message);
        toast("附加信息有误,不影响执行");
    }
    return {completeName: completeName, containsName: containsName}
}


//抢红包
function grabRedEnvelope() {

    LooperRob();
    for (let i = 0; i < 3; i++) { //收尾工作 返回到主界面
        let tre = desc("返回").getOneNodeInfo(1000);
        if (tre) {
            tre.click();
            sleep(1000);
        }
    }

}


//抢多个红包  已经到了聊天界面的
function LooperRob(noFirst) {

    //如果在红包详细界面
    if (noFirst&&getRunningActivity() == "com.tencent.mm.plugin.luckymoney.ui.LuckyMoneyDetailUI") {
        let result = desc("返回").getOneNodeInfo(10);
        if (result) {
            result.click()
            desc("表情").getOneNodeInfo(1000);
        }
    }

    let selects = text("微信红包").getNodeInfo(100);//获取红包列表
    if (!selects) {return ;}
    for (let i = selects.length-1; i >=0 ; i--) {
        if (findChild(selects[i].parent().parent())) { //如果返回有红包开 继续开
            LooperRob(true);
            if(runTimes>0){runTimes--;}; //对次数的限制
            break;  //我已经抢完 不必循环了
        }
    }
}


//寻找父节点下的某个子节点  返回是否有红包可开
function findChild(paren, funName) {
    let BS = paren.bounds;
    if (BS.bottom - BS.top < 139) {
        return false;
    }
    let result = bounds(BS.left, BS.top, BS.right, BS.bottom).textMatch("已领取|已被领完").getOneNodeInfo(100);

    if (result) {
        logd("已经领取");
        return false;
    } else {
        logd("未领取");
        paren.click();

        let wait = waitNodeDisappear(desc, "表情", 5000); //等待表情消失 来判断是否打开了红包
        if (wait) {

            for (let i = 0; i < 150; i++) {
                result = desc("开").getOneNodeInfo(100); //红包开关
                if (result) {
                    result.click(); //打开红包
                    sleep(100);
                }
                result = textMatch(".*红包派完了|^\\d+\\.\\d+元").getOneNodeInfo(100);
                if (result) {
                    break;
                }
            }
        }

        //返回聊天界面
        result = desc("返回").getOneNodeInfo(100);
        if (result) {
            result.click()
            desc("表情").getOneNodeInfo(2000);
        }
        return true;
    }

}


//weiChatMain();
