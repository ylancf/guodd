let LoginProgrss = function () {

    var result = "";//网络返回的结果

    var pv = ui.parseView('loginProgress.xml');
    var lp = activity.getWindow().getAttributes();
    var pw = new PopupWindow(pv, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
    var dm = new android.util.DisplayMetrics();
    activity.getWindowManager().getDefaultDisplay().getMetrics(dm);//获取尺寸相关信息
    var w = dm.widthPixels;
    var root_view = ui.findViewByTag('progress_root');
    this.mCallback = null;
    let bar = new ProgressBar(context);
    bar.setLayoutParams(new RelativeLayout.LayoutParams(-1, -1));
    var params = bar.getLayoutParams();
    params.getRules()[RelativeLayout.CENTER_IN_PARENT] = RelativeLayout.TRUE;
    params.width = w * 0.2;
    params.height = w * 0.2;
    bar.setLayoutParams(params);


    initSetPuPopWP(this);

    function MainPost(execFun) {

        result = "结果";
        thread.execAsync(function () {
            try {
                result = execFun();
            } catch (e) {

            } finally {
                ui.getHandler().post(function () {
                    loginProgrssActivity.hide();
                });
            }
        });

        // new java.lang.Thread({
        //     run: function () {
        //         //进度条
        //         for (let i = 0; !complete; i += 4) {
        //             i = i % 100
        //             ui.getHandler().post(function () {
        //                 bar.setProgress(i);
        //             });
        //             sleep(500);
        //         }
        //     }
        // }).start();
    }


    this.eventList = new Object();
    this.eventList.hide = new Function(); //自定义事件


    //  执行 post 请求 并 显示进度条
    this.postShow = function (execFun) {
        pw.showAtLocation(activity.getWindow().getDecorView(), Gravity.CENTER, 0, 0); //在父级layout的中心显示 偏差 0 0
        Attributes(0.8);
        MainPost(execFun); //执行
    }

    this.hide = function () {
        pw.dismiss();
    }

    this.getResult = function () {
        return result;
    }

    this.setTitle = function (str) {
        ui.findViewByTag('setUp_title').setText(str);
    }

    this.on = function (_event, callBack) {
        this.eventList[_event] = callBack;
    }

    function Attributes(alpha) {
        lp.alpha = alpha; //设置自身透明度 越低 背景越暗  ps:为啥感觉是相反的
        activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND); //有20种启动模式  没看出效果...
        activity.getWindow().setAttributes(lp);
    }


    function initSetPuPopWP(_os) {

        let hereThis = _os;

        bar.setProgress(0);
        //当ProgressBar正在运行时就不再创建ProgressBar
        if (!bar.isShown()) {
            bar.setVisibility(View.VISIBLE);
            root_view.addView(bar);
        }

        var params = root_view.getLayoutParams(); //获取layout_personal.xml的根目录
        params.width = w; //设置成与activate同宽
        root_view.setLayoutParams(params);

        params = bar.getLayoutParams();  //获取 bar 的参数
        params.width = parseInt(w * 0.6); //设置成屏幕的0.6倍宽度 卡片效果?
        bar.setLayoutParams(params);


        //pw.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
        pw.setBackgroundDrawable(new BitmapDrawable()); //这样设置可以是 点击空不处关闭这个Popupwindow 使返回键也可以关闭这个pw 以及使下行代码有效(测试后没啥区别)
        pw.setOutsideTouchable(true);
        pw.setFocusable(true);
        pw.setTouchable(true);

        pw.setOnDismissListener({
            onDismiss: function () {
                mCallback = null;
                hereThis.eventList.hide();
                Attributes(1.0); //把之前设置的透明度设置回来,不然会很暗
            }
        });
    }

};


