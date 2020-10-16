


let PopSetUp=function (){

    var pv = ui.parseView('setUpPopwindow.xml');
    var lp = activity.getWindow().getAttributes();
    var pw = new PopupWindow(pv, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
    var dm = new android.util.DisplayMetrics();
    activity.getWindowManager().getDefaultDisplay().getMetrics(dm);//获取尺寸相关信息
    var w = dm.widthPixels;

    var root_view = ui.findViewByTag('setUp_root');
    var set_layout = ui.findViewByTag('setUp_layout');
    var set_title = ui.findViewByTag('setUp_title');
    var start_time = ui.findViewByTag('setUp_start_time');

    var run_time = ui.findViewByTag('setUp_run_time');
    var run_number = ui.findViewByTag('setUp_run_number');
    var cancel = ui.findViewByTag('setUp_cancel');

    var confirm = ui.findViewByTag('setUp_confirm');
    var mCallback = null;
    this.eventList=new Object();
    this.eventList.hide=new Function(); //自定义事件
    initSetPuPopWP(this);

    this.show = function (_view,callback) {

        let setList=_view.findViewWithTag("summary").getText().split(",");
        set_title.setText(_view.findViewWithTag("title").getText());
        start_time.setText(setList[0].split(":",2)[1]); //显示开始时间
        run_time.setText(setList[1].split(":",2)[1]);  //显示运行时长
        run_number.setText(setList[2].split(":",2)[1]);//显示运行次数
        pw.showAtLocation(activity.getWindow().getDecorView(), Gravity.CENTER, 0, 0); //在父级layout的中心显示 偏差 0 0
        Attributes(0.6);
        mCallback = callback;
    }

    this.hide = function () {
        pw.dismiss();
    }

    this.setTitle = function (str) {
        ui.findViewByTag('setUp_title').setText(str);
    }

   this.on=function (_event,callBack){
        this.eventList[_event]=callBack;
   }

    function Attributes(alpha) {
        lp.alpha = alpha; //设置自身透明度 越低 背景越暗  ps:为啥感觉是相反的
        activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND); //有20种启动模式  没看出效果...
        activity.getWindow().setAttributes(lp);
    }



    function initSetPuPopWP(_os){

        let hereThis=_os;
        setEditTextType("setUp_start_time",[1,4]);
        setEditTextType("setUp_run_time",[2,4]);
        setEditTextType("setUp_run_number",[2,5]);


        var params = root_view.getLayoutParams(); //获取layout_personal.xml的根目录
        params.width = w; //设置成与activate同宽
        root_view.setLayoutParams(params);

        params = set_layout.getLayoutParams();  //获取 CardView 的参数
        params.width = parseInt(w * 0.7); //设置成屏幕的0.7倍宽度 卡片效果?
        set_layout.setLayoutParams(params);

        params = cancel.getLayoutParams(); //设置取消按钮的宽度
        params.width = parseInt((w * 0.7) / 2 - dp2px(1));  //减1 是为了防止边界3冲突??
        cancel.setLayoutParams(params);

        params = confirm.getLayoutParams();//设置确定按钮的宽度
        params.width = parseInt((w * 0.7) / 2 - dp2px(1));
        confirm.setLayoutParams(params);

        //空白处被点击时 当前界面消失
        ui.setEvent(root_view, 'click', function (view) {
            pw.dismiss();
        });
        //取消被点击时 当前界面消失
        ui.setEvent(cancel, 'click', function (view) {
            pw.dismiss();
        });


        ui.setEvent(confirm, 'click', function (view) {
            let _date=start_time.getText();
            let r_time = run_time.getText();
            let r_number = run_number.getText();

            mCallback(true, _date.toString().trim(), r_time.toString().trim(),r_number.toString().trim());
            mCallback = null;
            pw.dismiss();
        });

        let dp1 = dp2px(1);
        let dp5 = dp2px(5);


        // //设置输入框的形状
        // var states = [[android.R.attr.state_focused], [-android.R.attr.state_focused]];
        // var user_sld = new StateListDrawable();
        // user_sld.addState(states[0], new CreateShape(dp5, 0, null, [dp1, "#000000"]));
        // user_sld.addState(states[1], new CreateShape(dp5, 0, null, [dp1, "#5F000000"]));
        // user_input.setBackground(user_sld);
        //
        // var pw_sld = new StateListDrawable();
        // pw_sld.addState(states[0], new CreateShape(dp5, 0, null, [dp1, "#000000"]));
        // pw_sld.addState(states[1], new CreateShape(dp5, 0, null, [dp1, "#5F000000"]));
        // pw_input.setBackground(pw_sld);

        //pw.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
        pw.setBackgroundDrawable(new BitmapDrawable()); //这样设置可以是 点击空不处关闭这个Popupwindow 使返回键也可以关闭这个pw 以及使下行代码有效(测试后没啥区别)
        pw.setOutsideTouchable(true);
        pw.setFocusable(true);
        pw.setTouchable(true);

        var showSlide = new Slide(Gravity.BOTTOM); //从底部进入
        showSlide.setInterpolator(new OvershootInterpolator(0.8)); //加速执行，结束之后回弹
        showSlide.setDuration(300);//过程时间
        pw.setEnterTransition(showSlide); //设置出现效果

        var hideSlide = new Slide(Gravity.BOTTOM);
        hideSlide.setInterpolator(new AnticipateInterpolator(0.8));
        hideSlide.setDuration(300);
        hideSlide.setMode(Visibility.MODE_OUT);
        pw.setExitTransition(hideSlide);

        pw.setOnDismissListener({
            onDismiss: function () {
                //if (mCallback != null) mCallback(false, null, null);
                mCallback = null;
                hereThis.eventList.hide(); 
                Attributes(1.0); //把之前设置的透明度设置回来,不然会很暗
            }
        });
    }

};
