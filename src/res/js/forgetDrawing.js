//忘记密码界面的渲染
function forget_drawing_layout(popwd) {

    //获取屏幕宽度
    let dm = new android.util.DisplayMetrics();//获得显示度量
    activity.getWindowManager().getDefaultDisplay().getMetrics(dm);//获取尺寸相关信息 没有这句代码w将为0
    let w = dm.widthPixels;//获得屏幕宽度
    let h = dm.heightPixels;
    let for_layout = ui.findViewByTag("forget_ed_layout");
    let params = for_layout.getLayoutParams();//获取 forgetlayout的参数
    params.width = w * 0.8;//宽度设置为80%
    params.height=h*0.5;
    for_layout.setLayoutParams(params);

    let account_ed = ui.findViewByTag("for_account_ed");
    let answer_ed = ui.findViewByTag("for_answer_ed");
    let password_ed = ui.findViewByTag("for_password_ed");
    let confirm_ed = ui.findViewByTag("for_confirm_ed");
    let account_layout=ui.findViewByTag("for_account_layout")
    let ed_viewList = [account_ed, answer_ed, password_ed, confirm_ed];

    account_ed.setWidth(w-110);
    changeShape([answer_ed, password_ed, confirm_ed,account_layout]); //改变输入框形状

    ed_viewList.forEach(function (value, index) { //设置输入框类型
        if (index == 0)
            setEditTextType(value, [2, 4]);
        else if (index == 3 || index == 1) {
            setEditTextType(value, [1, 5]);
        } else
            setEditTextType(value, [1, 4]);
    })


    let question_tv=ui.findViewByTag("forget_question_tv");
    let question_layuot=ui.findViewByTag("forget_question_layout");
    let reset_layout=ui.findViewByTag("forget_reset_layout");
    let go_img=ui.findViewByTag("for_go_img");
    //防止重启打开忘记密码界面 有数据
    popwd.onDismissEvent(function () {
        for (let view of ed_viewList) {
            view.setText("");
        }
        question_tv.setText("");
        question_layuot.setVisibility(0);
        reset_layout.setVisibility(8);
    });


    //排断两次密码是否一致
    confirm_ed.setOnFocusChangeListener({
        onFocusChange: function (view, hasFocus) {
            if (!hasFocus) {
                let temp = password_ed.getText().toString();
                let tre = view.getText().toString();
                if (temp != tre) {
                    toast('两次密码不一致');
                }
            }
        }
    });

    let states = [[android.R.attr.state_pressed], [-android.R.attr.state_pressed]];
    let user_sld = new StateListDrawable();
    user_sld.addState(states[0],ui.resResAsDrawable('drawable/submit3.png'));
    user_sld.addState(states[1],ui.resResAsDrawable('drawable/submit1.png'));
    go_img.setBackground(user_sld);

    viewScale(go_img); //设置动画


    let accountStr=""; //记录用户输入的账户
    //箭头图片点击事件
    go_img.setOnClickListener({
        onClick:function (){
             accountStr=account_ed.getText().toString()+"";
            //发送数据库
            httpProgressActivity.on("hide", function () {

                let resultInfo = httpProgressActivity.result;
                if (resultInfo.code == 200) {
                  //  question_tv.setText(resultInfo.question);
                    toastLog("此处要返回信息");
                } else {
                    toast("验证失败:" + resultInfo.msg);
                }
            });

            httpProgressActivity.postShow(function () {
                var url = "http://47.98.194.121:80/getUserQuestion";
                var pa = {"userName": accountStr};
                var httpResult = http.httpPost(url, pa, null, 5 * 1000, {"Content-Type": "application/json"});
                loge("result ->     " + httpResult);
                return JSON.parse(httpResult);
            });

        }
    });


    new CreateImageButton(ui.findViewByTag("forget_root"), function (btn) {
        btn.setText('确  认');
        btn.setTextColor('#FAFAFA');
        btn.setPadding(10, 5, 10, 5);
        btn.setTypeface('monospace');
        btn.setTextSize(17);
        //点击事件
        btn.onClick(function (view) {

            if(question_tv.getText().toString()==""){

                toast("点击箭头获得问题");
                return;
            }else if( question_layuot.getVisibility()==0){ //0 可见 4 不可见但占位置 8不可见不占位置
                //访问数据库
                httpProgressActivity.on("hide", function () {

                    let resultInfo = httpProgressActivity.result;
                    if (resultInfo.code == 200&& true) {
                        toastLog("此处要修改  true ");
                        question_layuot.setVisibility(8);
                        reset_layout.setVisibility(0)
                    } else {
                        toast("验证失败:" + resultInfo.msg);
                    }
                });
                  //发送数据库
                httpProgressActivity.postShow(function () {
                    var url = "http://47.98.194.121:80/checkMyAnswer";
                    var pa = {"userName": accountStr,"answer": answer_ed.getText().toString()+""};
                    var httpResult = http.httpPost(url, pa, null, 5 * 1000, {"Content-Type": "application/json"});
                    loge("result ->     " + httpResult);
                    return JSON.parse(httpResult);
                });

            }else{
                let new_password=password_ed.getText().toString()+"";
                if(new_password==""){
                    toast("密码不许为空");
                    return;
                }
                let new_comfirm=confirm_ed.getText().toString()+"";

                if (new_password==new_comfirm) {
                    //访问数据库

                    //访问数据库
                    httpProgressActivity.on("hide", function () {

                        let resultInfo = httpProgressActivity.result;
                        if (resultInfo.code == 200&& true) {
                            toastLog("此处要修改  true ");
                             toastLog("密码修改成功")
                        } else {
                            toast("修改失败:" + resultInfo.msg);
                        }
                    });
                    //发送数据库
                    httpProgressActivity.postShow(function () {
                        var url = "http://47.98.194.121:80/resetPwdByQA";
                        var pa = {"userName": accountStr,"password": new_password};
                        var httpResult = http.httpPost(url, pa, null, 5 * 1000, {"Content-Type": "application/json"});
                        loge("result ->     " + httpResult);
                        return JSON.parse(httpResult);
                    });
                } else {
                    toast("两次密码不一致!");
                    return;
                }
            }
        });
        CreateImageButtonNext(btn, "#20c040", "#20a040",0.5);//一半部分
    });
    //添加一个按钮

}




// 图片按钮的缩放
function viewScale(view) {


    view.setTranslationZ(10);//设置高度产生阴影效果  只有api 21 以上生效

    //设置可点击
    view.setClickable(true);
    //0~1浮数点 当前动画进度
    let fraction = 0;
    //动画回调接口
    let addUpdateListener = {
        onAnimationUpdate: function (animation) {
            fraction = animation.getAnimatedValue();
            //缩放
            let scale = 1 - 0.1 * fraction;
            view.setScaleX(scale);
            view.setScaleY(scale);
        }
    };
    //按下动画
    let pressedAnim = ValueAnimator.ofFloat(0, 1);
    pressedAnim.setDuration(100);
    pressedAnim.addUpdateListener(addUpdateListener);
    //抬起动画
    let normalOffAnim = ValueAnimator.ofFloat(1, 0);
    normalOffAnim.setDuration(100);
    normalOffAnim.addUpdateListener(addUpdateListener);
    //状态动画集合
    let mStateListAnimator = new StateListAnimator();
    mStateListAnimator.addState([android.R.attr.state_pressed], pressedAnim);//按下
    mStateListAnimator.addState([-android.R.attr.state_pressed], normalOffAnim);//- 反之抬起

    view.stateListAnimator = mStateListAnimator;

}