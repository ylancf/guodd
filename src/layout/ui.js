importClass(android.view.View);
importClass(android.os.Build);
importClass(java.util.HashMap);
importClass(android.view.Gravity);
importClass(android.graphics.Bitmap);
importClass(android.graphics.Paint);
importClass(android.graphics.Color);
importClass(android.view.ViewGroup);
importClass(android.widget.ListView);
importClass(android.widget.TextView);
importClass(android.graphics.Typeface);
importClass(android.transition.Slide);
importClass(android.view.WindowManager);
importClass(android.widget.PopupWindow);
importClass(android.widget.LinearLayout);
importClass(android.graphics.PorterDuff);
importClass(android.transition.Visibility);
importClass(android.widget.RelativeLayout);
importClass(android.animation.ValueAnimator);
importClass(android.graphics.BitmapFactory);
importClass(android.animation.StateListAnimator);
importClass(android.view.inputmethod.EditorInfo);
importClass(android.graphics.drawable.BitmapDrawable);
importClass(android.graphics.drawable.ColorDrawable);
importClass(android.graphics.drawable.StateListDrawable);
importClass(android.graphics.drawable.GradientDrawable);
importClass(android.view.animation.OvershootInterpolator);
importClass(android.view.animation.AnticipateInterpolator);
importClass(android.support.v4.graphics.drawable.DrawableCompat);


var activity = ui.getActivity(); //获取当前的Activity
var resources = context.getResources(); //获取资源文件

execScript(2, readResString('js/PopActivity.js'));
execScript(2, readResString('js/dialogs.js'));//导入dialogs模块
execScript(2, readResString('js/JsListView.js'));//导入JsListView模块
execScript(2, readResString('js/SetUpPopwindow.js'));//导入SetUpPopwindow模块
execScript(2, readResString("js/LoginProgress.js"))

var myPopActivity;//注册界面
var scale = resources.getDisplayMetrics().density; //获得手机屏幕的相对密度 或者说比例
//获取顶级视图 DecorView内部又分为两部分，一部分是ActionBar，另一部分是ContentParent，即activity在setContentView对应的布局。
var decorView = activity.getWindow().getDecorView();
//给状态栏留出空间 相当于padding 只在状态栏或者导航栏设置透明时有效
decorView.getChildAt(0).getChildAt(1).setFitsSystemWindows(true);
//activity.window.addFlags(View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
activity.getWindow().setStatusBarColor(Color.TRANSPARENT);//状态栏颜色 设置成透明
activity.getWindow().setNavigationBarColor(0x999999);//导航栏颜色
SystemUiVisibility(false);//设置暗色系状态栏
var loginProgrssActivity = new LoginProgrss();
var the_label, js_start_BT, head_bar;
var startBTState=false; //记录开始按钮的状态
function main() {


    ui.layout("任务界面", "loginactivate.xml");
    head_bar = activity.findViewById(getResourceID('header_layout', 'id'));//获取头部布局
    the_label = activity.findViewById(getResourceID('tl', 'id')); //获取标签栏
    js_start_BT = activity.findViewById(getResourceID('fb', 'id')); //获取按钮


    //启动脚本按钮
    ui.setEvent(js_start_BT, "click", function (view) {

        startBTState=!startBTState;
        if(startBTState){
            let page = activity.findViewById(getResourceID('vp', 'id')).getCurrentItem();
            if (page == 0) {
                toast("开始任务界面的任务");
                ui.putShareData("VarShareData", taskItems);
            } else if (page == 1) {
                toast("开始公共脚本");
                ui.putShareData("VarShareData", comm_items);
            }
            updateConfig("todoItems", JSON.stringify(taskItems)); //自定义数据
            updateConfig("commItems",JSON.stringify(comm_items));
            ui.saveAllConfig(); //保存所有的值  所有动作的结果

            ui.start();  //z执行main
        }else{
            ui.stopTask();
        }
    });


    //在我的信息处 不显示开始按钮
    let viewpager = activity.findViewById(getResourceID('vp', 'id'));
    viewpager.setOnPageChangeListener({
        onPageSelected: function (index) {
            let _view = the_label.getChildAt(0);
            if (_view.getChildAt(index).getChildAt(2).getText() == "我的信息") {
                js_start_BT.setVisibility(4);
            } else {
                js_start_BT.setVisibility(0);
            }
        }
    });

        //判断显示那种界面
    if (readConfigBoolean("loginState")) {//如果有效
        login_on(); //开始进入
    } else {
        ui.findViewByTag('user_word').setVisibility(8);//隐藏操作界面
        main2(); //并执行一些渲染工作
    }

}

//检验账号密码
function judge_availability(user, pw) {

    //连接数据库判断有效性
    if (user == "" || pw == "") {
        toast("账号或密码不正确!");
        return false;
    } else {
        loginProgrssActivity.on("hide", function () {

            let resultInfo = loginProgrssActivity.getResult();
            if (resultInfo.code == 200) {
                ui.saveAllConfig(); //保存所有的值
                updateConfig("loginState", true); //保存为登录状态
                ui.findViewByTag('user_word').setVisibility(0);//显示操作界面
                head_bar.setVisibility(0);//显示bar栏
                js_start_BT.setVisibility(0);//恢复开始按钮
                login_on(); //开始进入
            } else {
                toast("登录失败:" + resultInfo.msg);
            }
        });

        loginProgrssActivity.postShow(function () {
            var url = "http://47.98.194.121:80/login";
            var pa = {"username": user.toString() + "", "password": pw.toString() + ""};
            var httpResult = http.httpPost(url, pa, null, 5 * 1000, {"Content-Type": "application/json"});
            loge("result ->     " + httpResult);
            return JSON.parse(httpResult);
        });
    }
}

//账号注册   一共六个字段
function register_account(nickname, userName, password, question, answer) {

    let imei = device.getIMEI();

    loginProgrssActivity.on("hide", function () {
        let resultInfo = loginProgrssActivity.getResult();
        if (resultInfo.code == 200) {
            toast("注册成功");
        } else {
            toast("注册失败:" + resultInfo.msg);
        }
    });

    loginProgrssActivity.postShow(function () {
        var url = "http://47.98.194.121:80/system/user/a/register";
        var pa = {
            "nickName": nickname,
            "userName": userName,
            "password": password,
            "question": question,
            "answer": answer,
            "IMEI": imei
        }
        var httpResult = http.httpPost(url, pa, null, 5 * 1000, {"User-Agent": "application/json"});
        loge("result ->     " + httpResult);
        return JSON.parse(httpResult);
        ;
    });

    return true; //成功返回true;
}


//登入
function login_on() {

    //展示操作界面
    ui.findViewByTag('login_ac').setVisibility(8);//隐藏登录界面
    activity.findViewById(getResourceID('tv_title', 'id')).setText("我的应用");//改掉名称
    activity.findViewById(getResourceID('right_header_iv3', 'id')).setVisibility(8);//隐藏云控;
    activity.findViewById(getResourceID('right_header_iv2', 'id')).setVisibility(8);//隐藏远程调试
    //移动设置按钮的位置
    let v2 = activity.findViewById(getResourceID('right_header_iv', 'id')).getParent();
    let v1 = v2.getParent();
    v1.removeView(v2);
    v1.addView(v2);

    ui.layout("公共脚本", "intr.xml");
    ui.layout("我的信息", "myselfInfo.xml");
    //导入模块
    execScript(2, readResString('js/mianObject.js'));
    execScript(2, readResString('js/commObject.js'));
    execScript(2, readResString('js/myInfo.js'));
    myPopActivity = myForgetActivity = null; //去掉已经不需要的对象

}


function main2() {


    head_bar.setVisibility(8);//去掉头部布局  这些name可以通过节点获取
    the_label.setVisibility(8);//去掉标签(多标签)
    js_start_BT.setVisibility(4);//去掉开始按钮

    drawingEdit(); //一些输入框渲染
    //创建开始按钮
    new CreateImageButton(ui.findViewByTag('login_edt_layout'), function (btn) {
        btn.setText('登 录');
        btn.setTextColor('#FAFAFA');
        btn.setPadding(10, 5, 10, 5);
        btn.setTypeface('monospace');
        btn.setTextSize(17)
        //点击事件
        btn.onClick(function (view) {
            var user_input = ui.findViewByTag("userName");
            var pw_input = ui.findViewByTag("password");
            let ut = user_input.getText();
            let pt = pw_input.getText();
            if (ut == '') {
                user_input.setError('用户名不能为空');  //这么写 小米4c这里会崩溃  不知道打包会不会
                return;
            }
            if (pt == '') {
                pw_input.setError('密码不能为空');
                return;
            }
            judge_availability(ut, pt);

        });
        CreateImageButtonNext(btn);//一半部分
    });


    myForgetActivity = new PopActivity("forgetPW.xml");//忘记密码界面
    myForgetActivity.setTitle('忘记密码'); //设置标题

    ui.setEvent(ui.forgetMM, "click", function (view) {
        logd("忘记密码界面");
        toast("开发中");
    });


    myPopActivity = new PopActivity('register.xml'); //必须放在外面 放在
    myPopActivity.setTitle('注册账号'); //设置标题
    re_drawing_layout(); //渲染这个layout

    ui.setEvent(ui.registerAccount, "click", function (view) {

        let ed_list = ["re_name_ed", "re_account_ed", "re_password_ed", "re_confirm_ed", "re_question_ed", "re_answer_ed"]; //注册界面中编辑框
        for (let v of ed_list) {
            ui.findViewByTag(v).setText("");
        }
        myPopActivity.show();
    });

}

/////////////////////////////////////////////////


//imageButtom的下半部分  为代码重复利用 而分开
function CreateImageButtonNext(btn, color1, color2) {

    let view = btn.getView();
    let params = view.getLayoutParams(); //获取布局参数

    //params.width = ViewGroup.LayoutParams.WRAP_CONTENT;//控件宽度 包裹内容的宽度
    let hereW = view.getParent().getLayoutParams().width; //match_parent 为-1
    params.width = (hereW == -1 ? resources.getDisplayMetrics().widthPixels : hereW) * 0.6;
    params.gravity = Gravity.CENTER;//layout_gravity; 这里使用java的设置方式
    view.setGravity(Gravity.CENTER); //这是相当于 gravity 与上面的不一样
    view.setLayoutParams(params);  //使新的布局参数生效
    view.setTranslationZ(10);//设置高度产生阴影效果  只有api 21 以上生效


    //视图状态动画
    let gd = new CreateShape(dp2px(5), 0, null);
    //设置背景图片
    view.setBackground(gd);
    //抬起颜色 按下颜色

    if (!color1 || !color2) {
        var colors = [str2argb('#1e88e5'), str2argb('#1565c0')];
    } else {
        var colors = [str2argb(color1), str2argb(color2)];
    }


    //设置可点击
    view.setClickable(true);
    //0~1浮数点 当前动画进度
    let fraction = 0;
    //动画回调接口
    let addUpdateListener = {
        onAnimationUpdate: function (animation) {
            fraction = animation.getAnimatedValue();
            //过度颜色
            let color = ColorEvaluator(fraction, colors[0], colors[1]);
            gd.setColor(Color.parseColor(color));
            view.setBackground(gd);
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


//给注册界面渲染
function re_drawing_layout() {
    //获取屏幕宽度
    var dm = new android.util.DisplayMetrics();//获得显示度量
    activity.getWindowManager().getDefaultDisplay().getMetrics(dm);//获取尺寸相关信息 没有这句代码w将为0
    var w = dm.widthPixels;//获得屏幕宽度
    var re_layout = ui.findViewByTag("register_layout");
    var params = re_layout.getLayoutParams();//获取 register_layout的参数
    params.width = w * 0.8;//宽度设置为80%

    re_layout.setLayoutParams(params);
    params = re_layout.getLayoutParams();

    var layoutList = ["re_name_layout", "re_account_layout", "re_password_layout", "re_confirm_layout", "re_question_layout", "re_answer_layout"]
    var ed_list = ["re_name_ed", "re_account_ed", "re_password_ed", "re_confirm_ed", "re_question_ed", "re_answer_ed"]; //注册界面中编辑框

    layoutList.forEach(function (value) {
        let re_layout = ui.findViewByTag(value);
        let dp1 = dp2px(1);
        let dp3 = dp2px(3);
        //设置输入框的形状
        var states = [[android.R.attr.state_focused], [-android.R.attr.state_focused]];
        var user_sld = new StateListDrawable();
        user_sld.addState(states[0], new CreateShape(dp3, 0, null, [dp1, "#000000"]));
        user_sld.addState(states[1], new CreateShape(dp3, 0, null, [dp1, "#5F000000"]));
        re_layout.setBackground(user_sld);

    })

    ed_list.forEach(function (value, index) { //设置输入框类型
        if (index == 1)
            setEditTextType(value, [2, 4]);
        else if (index == 5) {
            setEditTextType(value, [1, 5]);
        } else
            setEditTextType(value, [1, 4]);
    })
    //防止 重启打开注册界面 有数据
    myPopActivity.onDismissEvent(function () {
        for (let n of ed_list) {
            updateConfig(n, "");
        }
    });

    //排断两次密码是否一致
    ui.findViewByTag("re_confirm_ed").setOnFocusChangeListener({
        onFocusChange: function (view, hasFocus) {
            if (!hasFocus) {
                let temp = ui.findViewByTag("re_password_ed").getText().toString();
                let tre = view.getText().toString();
                if (temp != tre) {
                    //view.setError('两次密码不一致'); 容易奔溃
                    toast('两次密码不一致');
                }
            }
        }
    });

    new CreateImageButton(re_layout, function (btn) {
        btn.setText('注  册');
        btn.setTextColor('#FAFAFA');
        btn.setPadding(10, 5, 10, 5);
        btn.setTypeface('monospace');
        btn.setTextSize(17);
        //点击事件
        btn.onClick(function (view) {
            var infoList = []
            for (let v of ed_list) {
                let inputInfo = ui.findViewByTag(v);
                let _text = inputInfo.getText();
                if (_text == "") {
                    //inputInfo.setError('不能为空');//部分机型会崩溃
                    toast("请填写完整");
                    return;
                } else {
                    infoList[v] = _text.toString() + "";
                }
            }
            if (infoList["re_password_ed"].toString() == infoList["re_confirm_ed"].toString()) {
                register_account(infoList["re_name_ed"], infoList["re_account_ed"], infoList["re_password_ed"],
                    infoList["re_question_ed"], infoList["re_answer_ed"])//注册
            } else {
                toast("两次密码不一致!");
                return;
            }
            //ui.start();//启动脚本
        });
        CreateImageButtonNext(btn, "#EE4280", "#C33B6C");//一半部分
    });
    //添加一个按钮
}


//对登录界面的输入框进行渲染
function drawingEdit() {
    var dm = new android.util.DisplayMetrics();//获得显示度量
    activity.getWindowManager().getDefaultDisplay().getMetrics(dm);//获取尺寸相关信息 没有这句代码w将为0
    var w = dm.widthPixels;//获得屏幕宽度
    var user_root_view = ui.findViewByTag('login_edt_layout');
    var user_input = ui.findViewByTag("userName");
    var pw_input = ui.findViewByTag("password");


    setEditTextType("userName", [2, 4]);
    setEditTextType("password", [3, 5]);

    var params = user_root_view.getLayoutParams(); //获取layout_personal.xml的根目录
    params.width = w * 0.7; //设置成宽度的0.7同宽
    user_root_view.setLayoutParams(params);


    let dp1 = dp2px(1);
    let dp5 = dp2px(5);
    //设置输入框的形状
    var states = [[android.R.attr.state_focused], [-android.R.attr.state_focused]];
    var user_sld = new StateListDrawable();
    user_sld.addState(states[0], new CreateShape(dp5, 0, null, [dp1, "#000000"]));
    user_sld.addState(states[1], new CreateShape(dp5, 0, null, [dp1, "#5F000000"]));
    user_input.setBackground(user_sld);

    var pw_sld = new StateListDrawable();
    pw_sld.addState(states[0], new CreateShape(dp5, 0, null, [dp1, "#000000"]));
    pw_sld.addState(states[1], new CreateShape(dp5, 0, null, [dp1, "#5F000000"]));
    pw_input.setBackground(pw_sld);

}

/**
 * 设置输入法的enter样式
 *
 * @param tagName  编辑框的tag值
 *
 * @param _type    数组类型 如[1,4] 1:文本形 ,2:数值形,3密码型 ,4:enter是向下箭头 ,5:enter 是完成,
 * 6,去掉下划线
 *
 */
function setEditTextType(tagName, _type) {

    var input = ui.findViewByTag(tagName);

    _type.forEach(function (value) {
        switch (value) {
            case 1:
                input.setInputType(EditorInfo.TYPE_CLASS_TEXT); //文本型
                break;
            case 2:
                input.setInputType(EditorInfo.TYPE_CLASS_NUMBER);//数值型
                break;
            case 3:
                input.setInputType(EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_PASSWORD);//密码型
                break;
            case 4:
                input.setImeOptions(EditorInfo.IME_ACTION_NEXT);//使输入法的enter键变为 向下箭头或者 下一项
                break;
            case 5:
                input.setImeOptions(EditorInfo.IME_ACTION_DONE);//使输入法的enter键变为 回车或完成
                break;
            case 6:

                break;
        }
    });

}


//获取内置资源ID
function getResourceID(name, type) {
    //context.getResources().getIdentifier(name, type, context.getPackageName()');//废弃打包后无法获取内置资源
    return context.getResources().getIdentifier(name, type, 'com.gibb.easyclick');
}


//创建图片形式按钮
function CreateImageButton(parent, callback, isTop) {
    isTop = isTop || false     //添加的位置最上方还是最下方
    var ld = null;
    var tv = new TextView(context);
    var mClickCallback = function () {  //此处先设置为空方法,稍后被赋值为回调方法
    };
    var paint = tv.getPaint();
    var typeface = {
        'default': Typeface.DEFAULT,
        'sans': Typeface.SANS_SERIF,
        'serif': Typeface.SERIF,
        'monospace': Typeface.MONOSPACE
    }
    parent.addView(tv, isTop ? 0 : -1); //向父控件添加控件
    tv.setOnClickListener({             //一个监听方法
        onClick: function () {
            mClickCallback(tv, tv.getText()) //执行方法,其实就是回调方法 callback
        }
    });

    //获得这个textview对象
    this.getView = function () {
        return tv;
    }

    //设置text内容
    this.setText = function (str) {
        tv.setText(str);
    }
    //设置文件大小
    this.setTextSize = function (number) {
        tv.setTextSize(number);
    }

    //设置文字颜色
    this.setTextColor = function (colorstr) {
        tv.setTextColor(Color.parseColor(colorstr));
    }
    //设置字体粗细
    this.setBold = function (isBold) {
        paint.setFakeBoldText(isBold);
    }

    this.setTypeface = function (str) {
        tv.setTypeface(typeface[str]);
    }

    this.setPadding = function (l, t, r, b) {
        let hasMeasured = false;
        if (tv.getMeasuredHeight() != 0) {
            tv.setPadding(dp2px(l), dp2px(t), dp2px(r), dp2px(b));
        } else {
            tv.getViewTreeObserver().addOnPreDrawListener({
                onPreDraw: function () {
                    if (hasMeasured == false && tv.getMeasuredHeight() != 0) {
                        hasMeasured = true;
                        tv.getViewTreeObserver().addOnPreDrawListener({
                            onPreDraw: function () {
                                return true;
                            }
                        });
                        tv.setPadding(dp2px(l), dp2px(t), dp2px(r), dp2px(b));
                    }
                    return true;
                }
            });
        }
    }

    this.setLeftDrawable = function (resName, size, colorstr, padding) {
        if (ld != null) ld.recycle();
        ld = ui.resResAsDrawable('drawable/' + resName + '.png');
        ld.setBounds(0, 0, dp2px(size), dp2px(size));
        ld.setTint(Color.parseColor(colorstr));
        tv.setCompoundDrawables(ld, null, null, null);
        tv.setCompoundDrawablePadding(dp2px(padding));
    }
    //设置背景
    this.setBackgroundRes = function (resName) {
        tv.setBackground(context.getResources().getDrawable(getResourceID(resName, 'drawable')));
    }

    this.onClick = function (callback) { //此callback 非这个方法参数的callback  实现事件方法
        mClickCallback = callback;
    }

    callback(this); //执行回调函数 实现初始化
}

/**
 * 创建ShapeDrawable
 * @param roundRadius
 * @param shape
 * @param fillColor
 * @param stroke
 * @returns {GradientDrawable}
 * @constructor
 */
function CreateShape(roundRadius, shape, fillColor, stroke) {
    stroke = stroke || null;
    if (stroke != null && stroke[1] != "") stroke[1] = Color.parseColor(stroke[1]);
    fillColor = Color.parseColor((fillColor != null && fillColor != "") ? fillColor : "#00000000"); //用于设置边框颜色
    var gd = new GradientDrawable(); //获取图像对象   画按钮用
    gd.setColor(fillColor);
    gd.setShape(shape != -1 ? GradientDrawable.LINEAR_GRADIENT : shape); //此处应该有逻辑问题 -1不会有按钮显示 0 为矩形 1椭圆

    if (roundRadius != -1) gd.setCornerRadius(roundRadius); //设置圆角
    //一些笔法的设置
    if (stroke != null && stroke[0] != -1) gd.setStroke(stroke[0], stroke[1], stroke[2] = stroke[2] || 0, stroke[3] = stroke[3] || 0);
    return gd;
}

/**
 * 初始化相对布局属性
 */
function initRelativeLayout() {
    var view = ui.item_layout;
    //给控件设置id
    ui.toolbar.setId(1000 + random.nextInt(1000));
    ui.bottom_layout.setId(1000 + random.nextInt(1000));
    //获取布局参数
    var params = view.getLayoutParams();
    //设置布局 above属性 和 below属性
    params.addRule(RelativeLayout.ABOVE, ui.bottom_layout.getId());
    params.addRule(RelativeLayout.BELOW, ui.toolbar.getId());
    ui.item_layout.setLayoutParams(params);
    //设置布局底部对齐
    var params_1 = ui.bottom_layout.getLayoutParams();
    params_1.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
    ui.bottom_layout.setLayoutParams(params_1);
}

//通知栏改变主题
function SystemUiVisibility(value) {
    var option = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | (value ? View.SYSTEM_UI_FLAG_LAYOUT_STABLE : View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
    activity.getWindow().getDecorView().setSystemUiVisibility(option);
}

function str2argb(colorstr) {
    let cArr = colorstr.split('');
    let arr = new Array();
    let obj = new Object();
    for (i = 1; i < cArr.length; i += 2) {
        arr[arr.length] = '' + cArr[i] + cArr[i + 1];
    }
    if (arr.length == 3) {
        arr.unshift('FF');
    }
    obj.a = parseInt(arr[0], 16);
    obj.r = parseInt(arr[1], 16);
    obj.g = parseInt(arr[2], 16);
    obj.b = parseInt(arr[3], 16);
    return obj;
}

function ColorEvaluator(fraction, startColor, endColor) {
    let inverseRation = 1 - fraction;
    let a = parseInt((endColor.a * fraction) + (startColor.a * inverseRation));
    let r = parseInt((endColor.r * fraction) + (startColor.r * inverseRation));
    let g = parseInt((endColor.g * fraction) + (startColor.g * inverseRation));
    let b = parseInt((endColor.b * fraction) + (startColor.b * inverseRation));
    return argb2str(a, r, g, b);
}

function argb2str(a, r, g, b) {
    let a1 = a.toString(16);
    let r1 = r.toString(16);
    let g1 = g.toString(16);
    let b1 = b.toString(16);
    if (a1.length == 1) a1 = '0' + a1;
    if (r1.length == 1) r1 = '0' + r1;
    if (g1.length == 1) g1 = '0' + g1;
    if (b1.length == 1) b1 = '0' + b1;
    return '#' + a1 + r1 + g1 + b1;
}

//根据手机的分辨率从 dp 的单位 转成为 px(像素)
var dp2px = function (dp) {
    return Math.floor(dp * scale + 0.5);
};

//根据手机的分辨率从 px(像素) 的单位 转成为 dp
var px2dp = function (px) {
    return Math.floor(px / scale + 0.5);
};


//公共脚本的匹配用于两个数组的包含 sqlArr 包含 localArr
// 返回 合并的数组
function containArr(sqlArr, localArr) {

    let toTopArr = JSON.parse(readConfigString("toTop"));  //要置顶的数组编号(按顺序)
    let toDelete = JSON.parse(readConfigString("toDelete")); //要删除的数组编号
    let newArr = [];
    let tempArr = []; //临时数组存放没有排序的置顶对象
    if (localArr) {
        go_here:
            for (let local of localArr) {
                let index = local.id_number; //获取编号
                for (let sql of sqlArr) {
                    if (sql.id_number == index) {
                        if (toDelete.lastIndexOf(index) > -1) { //如果在删除列表 就不插入数组
                            continue go_here;
                        }

                        local.prompt = sql.prompt; //修改本地对象的提示语
                        local.path = sql.path;  //修改本地对象的脚本访问路径

                        if (toTopArr.lastIndexOf(index) > -1) {
                            tempArr[index] = local//放在临时数组中没有排序
                            continue go_here;
                        }
                        newArr.push(local);
                        continue go_here;
                    } else {
                        newArr.push(sql);
                    }
                }
            }

        //将要置顶的对象排序
        let _arr = [];
        for (let i of toTopArr) {
            _arr.push(tempArr[i]);
        }
        newArr = _arr.concat(newArr);//数组合并

    } else {
        newArr = sqlArr; //直接是数据库返回的集合
    }

    return newArr;
}


try {
    main();
}catch (e){

    var create=file.create("/sdcard/AppDebug.txt");
    toast(create);
    var data=e.message;
    file.writeFile(data,"/sdcard/test.txt");

}

