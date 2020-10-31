let ProBarAct=(function (){

    function ProBarAct(){
        this.result="";
        this.eventList = new Object();
        this.eventList.hide = new Function(); //自定义事件
        this.mCallback=null;
        this.pv=ui.parseView('loginProgress.xml');
        this.pw=initProBarAct(this);
         initProBar(this);
    }

    function initProBarAct(hereThis){
      let pw = new PopupWindow(hereThis.pv, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
      //pw.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
      pw.setBackgroundDrawable(new BitmapDrawable()); //这样设置可以是 点击空不处关闭这个Popupwindow 使返回键也可以关闭这个pw 以及使下行代码有效(测试后没啥区别)
      pw.setOutsideTouchable(true);
      pw.setFocusable(true);
      pw.setTouchable(true);
      pw.setOnDismissListener({
          onDismiss: function () {
              mCallback = null;
              hereThis.eventList.hide();
              hereThis.Attributes(1.0); //把之前设置的透明度设置回来,不然会很暗
          }
      });
      return pw;
    }


    ProBarAct.prototype.Attributes=function (alpha){
        var lp = activity.getWindow().getAttributes();
        lp.alpha = alpha; //设置自身透明度 越低 背景越暗  ps:为啥感觉是相反的
        activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND); //有20种启动模式  没看出效果...
        activity.getWindow().setAttributes(lp);
    }
    //隐藏消失
    ProBarAct.prototype.hide = function () {
        this.pw.dismiss();
    }

    ProBarAct.prototype.MainPost= function (execFun) {

        this.result = "结果";
        let hereThis=this;
        thread.execAsync(function () {
            try {
                hereThis.result = execFun();
                logd("execFun执行成功")
            } catch (e) {
                logd(e.message);
            } finally {
                logd("finally执行成功")
                ui.getHandler().post(function () {
                    logd("post执行成功");
                    hereThis.hide();
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


    ProBarAct.prototype.on=function (_event, callBack){
        this.eventList[_event] = callBack;
    }
    //  执行 post 请求 并 显示进度条
    ProBarAct.prototype.postShow = function (execFun) {
       this.pw.showAtLocation(activity.getWindow().getDecorView(), Gravity.CENTER, 0, 0); //在父级layout的中心显示 偏差 0 0
       this.Attributes(0.8);
       this.MainPost(execFun); //执行
    }

    function initProBar(hereThis){

        let dm = new android.util.DisplayMetrics();
        activity.getWindowManager().getDefaultDisplay().getMetrics(dm);//获取尺寸相关信息
        let w = dm.widthPixels;
        let bar = new ProgressBar(context);
        bar.setLayoutParams(new RelativeLayout.LayoutParams(-1, -1));
        let params = bar.getLayoutParams();
        params.getRules()[RelativeLayout.CENTER_IN_PARENT] = RelativeLayout.TRUE;
        params.width = w * 0.2;
        params.height = w * 0.2;
        bar.setLayoutParams(params);
        bar.setProgress(0);
        //当ProgressBar正在运行时就不再创建ProgressBar
        if (!bar.isShown()) {
            bar.setVisibility(View.VISIBLE);
            hereThis.pv.getChildAt(0).addView(bar);
        }

        params = bar.getLayoutParams();  //获取 bar 的参数
        params.width = parseInt(w * 0.6); //设置成屏幕的0.6倍宽度 卡片效果?
        bar.setLayoutParams(params);
    }

  return  ProBarAct ;

})();