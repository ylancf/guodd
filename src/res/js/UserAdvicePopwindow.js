

importPackage(android.text.method);

//脚本设置界面
let userAdvicePop=function(){

    var pv = ui.parseView('userAdvice.xml');
    var lp = activity.getWindow().getAttributes();
    var pw = new PopupWindow(pv, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
    var w = device.getScreenWidth();
    var root_view = ui.findViewByTag('advice_root');
    var advice_layout = ui.findViewByTag('advice_layout');
    var advice_title = ui.findViewByTag('advice_title');
    var advice_msg = ui.findViewByTag('advice_msg');
    var cancel = ui.findViewByTag('advice_cancel');
    var confirm = ui.findViewByTag('advice_confirm');
    var mCallback = null;
    this.eventList=new Object();
    this.eventList.hide=new Function(); //自定义事件
    initAdvicePopWP(this);

    this.show = function () {
        pw.showAtLocation(activity.getWindow().getDecorView(), Gravity.CENTER, 0, 0); //在父级layout的中心显示 偏差 0 0
        Attributes(0.6);
    }

    this.hide = function () {
        pw.dismiss();
    }

    this.setTitle = function (str) {
        advice_title.setText(str);
    }

    this.on=function (_event,callBack){
        this.eventList[_event]=callBack;
    }

    function Attributes(alpha) {
        lp.alpha = alpha; //设置自身透明度 越低 背景越暗  ps:为啥感觉是相反的
        activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND); //有20种启动模式  没看出效果...
        activity.getWindow().setAttributes(lp);
    }



    function initAdvicePopWP(_os){

        let hereThis=_os;
        advice_msg.setSingleLine(false);
        advice_msg.setInputType(EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_FLAG_MULTI_LINE | EditorInfo.TYPE_TEXT_FLAG_IME_MULTI_LINE);
        advice_msg.setMinLines(4);

        changeShape([advice_msg],2,1,"#AAAAAA","#CC99FF");

        let params = root_view.getLayoutParams(); //获取layout_personal.xml的根目录
        params.width = w; //设置成与activate同宽
        root_view.setLayoutParams(params);

        params = advice_layout.getLayoutParams();  //获取 CardView 的参数
        params.width = parseInt(w * 0.7); //设置成屏幕的0.7倍宽度 卡片效果?
        advice_layout.setLayoutParams(params);

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
            thread.execAsync(function (){
                if(sendAdviceMsg(advice_msg.getText(),readConfigString("userName"))){
                    toast("提交成功!");
                }else{
                    toast("提交失败!检查内容是否为空");
                }
            });
            pw.dismiss();
        });


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
