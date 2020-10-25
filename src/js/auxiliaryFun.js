// 10.27


let excluisiver = {};
let findCloseBT, dingWei;
let socket_ip = socket_name = socket_port = "";
var wait_Time = 7;  //特殊检测次数
//监测使用 次依赖于sim_Slide文件
excluisiver.opposeUnexpected = function (opt) {


    toastLog("进行环境监测");





    thread.execAsync(function () {
        var commBT;
        //循环持续监测
        while (true) {

            if (text("以后再说").exist()) { //去除更新
                sleep(500);
                let tager = text("以后再说").getOneNodeInfo(10);
                regularClick(tager, "以后再说");
            }

            if (textMatch(".*微信登录$").exist() && !idMatch(".*skip_btn").getOneNodeInfo(5000)) {
                sleep(random(3300, 5100));
                localClick(textMatch(".*微信登录.*").getOneNodeInfo(10));
                wait_Time += 5;
                sleep(random(1800, 2500));
            }

            if (textMatch("你的微信头像.*性别信息").exist()) {
                if (commBT = text("同意").getOneNodeInfo(10), commBT) {
                    commBT.click();
                }

            }

            if (bounds(0, 1550, 1080, 1920).clickable(true).text("安装").exist()) {
                let closeBT = bounds(0, 1550, 1080, 1920).clickable().text("取消").getOneNodeInfo(10);
                if (closeBT) {
                    closeBT.click();
                }
            }

            if (commBT = clickable(true).textMatch("等待WLAN").getOneNodeInfo(10), commBT) {
                localClick(commBT);
            }

            if (textMatch("^测试程序.*正在尝试开启.*").exist()) {
                clickable().text("允许").getOneNodeInfo(100).click();
            }

            if (text("等待").exist()) {
                let bt = text("等待").getOneNodeInfo(10);
                if (bt) {
                    bt.click();
                }
                sleep(1000);
            }

            if (textMatch("^准备下载.*应用$").exist()) {
                localClick(clickable().text("取消").getOneNodeInfo(10));
            }

            if (!dingWei && textMatch("^要允许.*卫星.*定位.*").exist()) {
                clickable().textMatch("拒绝").click();
                dingWei = false;
            }

            if (textMatch("^我知道了$|^知道了$|^下次再说$").exist()) {
                sleep(500);
                let tager = textMatch("^我知道了$|^知道了$|^下次再说$").getOneNodeInfo(10);
                regularClick(tager, tager.text());
            }

            if (text("忽略").exist()) {
                sleep(500);
                let tager = text("忽略").getOneNodeInfo(10);
                regularClick(tager, "忽略");
            }

            if (text("权限设置").exist()) {
                var power_App_Cancel = text("取消").getOneNodeInfo(10);
                regularClick(power_App_Cancel, "权限设置", 2000);
            }

            switch (opt) {

                case "旅行世界":
                    travelWorld();
                    break;

            }
            sleep(100);
        }
    })

    for (let i = 0; i < wait_Time; i++) {
        sleep(2000);
        toastLog("特殊监测中.....")
    }

    toastLog("等待结束,开始脚本");
    sleep(2000);
}


//旅行世界

function travelWorld() {
    var commBT;
    if (text("怎么玩").exist()) {
        sleep(500, 1300);
        localClick(text("关闭").getOneNodeInfo(10));
        sleep(800, 1500);
    }


    if (commBT = idMatch(".*img_close.*").getOneNodeInfo(10), commBT) {
        localClick(commBT);
    }

    //合成狗使用的 防止被关闭
    if (bounds(140, 1038, 1000, 1528).id("com.jiayouya.travel:id/btn").exist()) {
        sleep(5000);
    }


    if (!textMatch("^转盘券|看视频.*|看广告翻倍|可提现|立即获得.*收益|扩容").exist() || (textMatch("^转盘券").exist() && !rotary_Table)) {

        TryCloseGG();
    }

}


//寻找常规广告并关闭
function TryCloseGG(checkText) {

    var target;
    var centerPos = [540, 960];//屏幕中心点
    var distance = 0; //距离
    var arr = bounds(0, 150, 1080, 1900).clickable(true).getNodeInfo(100);
    if(!arr){return ;}
    arr.forEach(element => {
        if (element.boundsEx().width() > 30 && element.boundsEx().width() < 170) {
            let this_width = element.boundsEx().width()
            let this_height = element.boundsEx().height()
            var pointX = this_width / 2;
            var pointY = this_height / 2;
            let ratio = this_width / this_height;
            if (ratio < 1.1 && ratio > 0.9) {
                //差距
                let chaju = Math.pow(pointX - centerPos[0], 2) + Math.pow(pointY - centerPos[1], 2);
                if (chaju > distance) {
                    distance = chaju;
                    target = element;
                }
            }
        }
    });

    if (target && imgHandler([target])) {
        if (!findCloseBT) {
            findCloseBT = target;
        } else {
            if (findCloseBT.depth == target.depth) {
                sleep(random(400, 550));
                localClick(target);
                sleep(200);
            } else {
                findCloseBT = target;
            }
        }
    }
}


//广告视频的关闭方法 //视频广告关闭方法   参数 进出文本 正则 标志
excluisiver.GGTVCloseFun = function (regularMark, gg_delay, class_name) {
    var class_name = class_name || "android.widget.TextView";
    var gg_delay = gg_delay || 1;
    if (!regularMark) {
        toastLog("需要进出广告的标志");
        return false;
    }
    var preventStuck = true;

    let cdl = new java.util.concurrent.CountDownLatch(1); //倒数计数的锁 线程通信 当倒数到0时触发事件

    thread.execAsync(function () {

        toastLog("进入广告");

        sleep(10000);

        try {

            //寻找时间框
            for (let i = 0; i < 42; i++) {
                var time = clzMatch("android.widget.TextView|android.view.View").bounds(10, 20, 300, 300).getOneNodeInfo(10);
                if (time) {
                    var miao = parseInt(time.text);
                    if (!isNaN(miao)) {
                        i = 0;
                        if (miao == 2 || miao == 1) {
                            sleep(2000);
                            break;
                        }
                    }
                } else {
                    sleep(600);
                    //直接寻找x
                    let tryCloseArr = bounds(0, 10, 1080, 250).getNodeInfo(10).filter(function (w) {
                        return (w.boundsEx().width() == w.boundsEx().height()) && (w.boundsEx().width() < 150)
                    });

                    if (imgHandler(tryCloseArr) != false) {
                        logd("确认有关闭标志");
                        gg_delay = 0; //已经找到x 就不需要延迟了
                        break;
                    }
                }
                sleep(800);
            }

            sleep(random(1000, 3000) + gg_delay);

            var arr = bounds(0, 0, 1080, 250).getNodeInfo(10).filter(function (w) {
                let ratio = w.boundsEx().width() / w.boundsEx().height();
                return w.boundsEx().width() > 20 && w.boundsEx().width() < 170 && ratio < 1.1 && ratio > 0.9;
            });

            var target = imgHandler(arr);
            var X_Click = false;
            if (target) {
                regularClick(target, regularMark);
                logd("点击");
                X_Click = true;
            }


            if (!X_Click) {
                logd("未能成功退出广告,尝试中..");
                let arrTry = bounds(0, 0, 1080, 1920).getNodeInfo(10).filter(function (w) {
                    let ratio = w.boundsEx().width() / w.boundsEx().height();
                    return w.boundsEx().width() > 20 && w.boundsEx().width() < 170 && ratio < 1.1 && ratio > 0.9;
                });
                let target = imgHandler(arrTry);
                if (target) {
                    localClick(target);
                    logd("点击");
                }

                let tryClose;
                if (tryClose = idMatch(".*close.*").getOneNodeInfo(10), tryClose) {
                    regularClick(tryClose, regularMark, 2000);
                    preventStuck = false;
                    cdl.countDown();
                    return true;
                }

                if (!textMatch(regularMark).exist()) {
                    toastLog("未能退出,重启");
                    cdl.countDown();
                    return false;
                }
            }
            sleep(1000, 2000);
            cdl.countDown();
            preventStuck = false; //表示没有卡死

        }catch (e){

            logd(e.message);
        }

    }, 95000)


    try {
        cdl.await(95000, java.util.concurrent.TimeUnit.MILLISECONDS); //等待超时时间
        // 继续执行下面的逻辑...(略)
    } catch ( e) {
        logd(e.message);
    }

    if (preventStuck) {
        toastLog("判定为卡死,重启");
        exit();
    }
}


//图片处理  返回 false 或者 关闭控件对象
function imgHandler(controlArr) {
    let img = image.captureScreenEx();
    var clipArr = [];
    controlArr.forEach(element => {
        var w = element.boundsEx();
        var clip = image.clip(img, w.left, w.top, w.right, w.bottom);
        clipArr.push([clip,w.width(),w.height()]);
    });
    image.recycle(img);//回收
    var result = false;
    //判断是否有关闭X
    for (let i = clipArr.length - 1; i >= 0; i--) {
        if (clipArr[i] && CloseBinaryJudge(clipArr[i])) {
            result = controlArr[i];
            break;
        }
    }

    return result;
}


// 二值化后 判断是否有X  参数 剪切的图片
function CloseBinaryJudge(targetArr) {

    let centerX = Math.round(targetArr[1] / 2);
    let centerY = Math.round(targetArr[2] / 2);
    let Img=targetArr[0]; //图片
    if (centerX < 15) {
        return false;
    } else {
        let temp = centerX < centerY ? centerX : centerY;
        var radii = (temp < 10 ? temp : 10) - 2;
    }
    if (radii <= 0) { return false;}

    let upX = downX = leftY = rightY = 0;
    let color = image.pixel(Img, centerX, centerY);//获取中心点颜色

    //优化中心位置
    for (; detectsColor(Img, color, centerX + upX, centerY) && upX > -radii; upX--) ;
    for (; detectsColor(Img, color, centerX + downX, centerY) && downX < radii; downX++) ;
    for (; detectsColor(Img, color, centerX, centerY + leftY) && leftY > -radii; leftY--) ;
    for (; detectsColor(Img, color, centerX, centerY + rightY) && rightY < radii; rightY++) ;

    centerX = centerX + Math.round((upX + downX) / 2);
    centerY = centerY + Math.round((leftY + rightY) / 2);

    let bitmap= image.imageToBitmap(Img);
    image.recycle(Img);//回收
    let newBitmap=com.plugin.jPrlGSPKhr.OpenCvClass.BitmapToGray(bitmap);
    image.recycle(bitmap);//回收

    //用于计算阀值得点
    let cutting_value_Arr = [[centerX, centerY], [centerX - 3, centerY - 3], [centerX - 3, centerY + 3],
        [centerX + 3, centerY - 3], [centerX + 3, centerY + 3], [centerX - 12, centerY],
        [centerX + 12, centerY], [centerX, centerY - 12], [centerX, centerY + 12]]

    let tempValue = 0;
    for (let i = 0; i < cutting_value_Arr.length; i++) {
        let trmpColor = image.getPixelBitmap(newBitmap, cutting_value_Arr[i][0], cutting_value_Arr[i][1]);
        tempValue += converArgbToRgb(trmpColor)[2];//总和值
    }
    var cutting_value = Math.round(tempValue / cutting_value_Arr.length); //平均值

    //一刀切二值化 二值化
    let newclip =image.binaryzationBitmap(newBitmap, 1,cutting_value);
    image.recycle(newBitmap);

    //获取中心颜色 做参照值
    color = image.getPixelBitmap(newclip, centerX, centerY);

    let needEqualColor = [[centerX - 3, centerY - 3],
        [centerX - 3, centerY + 3], [centerX + 3, centerY - 3],
        [centerX + 3, centerY + 3], [centerX - 6, centerY - 6],
        [centerX - 6, centerY + 6], [centerX + 6, centerY - 6], [centerX + 6, centerY + 6]];

    let needDifferentColor = [[centerX, centerY - 8],
        [centerX, centerY + 8], [centerX - 8, centerY],
        [centerX + 8, centerY], [centerX - 12, centerY],
        [centerX + 12, centerY], [centerX, centerY - 12], [centerX, centerY + 12]];

        let result = true;
        for (let i = 0; i < needEqualColor.length; i++) {
            if (detectsColorBitmao(newclip, color, needEqualColor[i][0], needEqualColor[i][1]) == false) {
                result = false;
                break;
            }
        }
        for (let i = 0; i < needDifferentColor.length; i++) {
            if (detectsColorBitmao(newclip, color, needDifferentColor[i][0], needDifferentColor[i][1]) == true) {
                result = false;
                break;
            }
        }

    //回收图片
    image.recycle(newclip);
    return result;

}


function converArgbToRgb(argb){
    var rgb = [];
    rgb[0] = (argb & 0xff0000) >> 16;
    rgb[1] = (argb & 0xff00) >> 8;
    rgb[2] = (argb & 0xff);
    return rgb;
}

function detectsColorBitmao(Img, color, x, y){

    let _color = image.getPixelBitmap(Img, x, y);//获取中心点颜色
    if(_color==color){
        return true;
    }else{
        return false;
    }

}

function detectsColor(Img, color, x, y){

    let _color = image.pixel(Img, x, y);//获取中心点颜色
    if(_color==color){
        return true;
    }else{
        return false;
    }
}




