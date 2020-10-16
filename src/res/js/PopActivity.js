
importPackage(android.widget);
importPackage(android.transition);
importPackage(android.graphics.drawable);

let PopActivity = (function () {
    let activity = ui.getActivity();
    let resources = context.getResources(); //获得资源
    //获取状态栏高度
    let statusBarHeight = resources.getDimensionPixelSize(resources.getIdentifier("status_bar_height", "dimen", "android"));

    //建立一个全屏的popupwindow 模仿activate
    function PopActivity(view) {
        this.view = typeof (view) == 'string' ? ui.parseView(view) : view;//获得视图
        if (view == null) throw 'PopActivity解析布局失败';
        this.contentView = initContentView(this);
        this.popupwindow = initPopupWindow(this.contentView);
    }

    PopActivity.prototype.onDismissEvent=function (backcall){
        this.popupwindow.setOnDismissListener({ onDismiss:backcall});
    }

    PopActivity.prototype.show = function () {
        this.popupwindow.showAtLocation(activity.getWindow().getDecorView(), Gravity.CENTER, 0, 0);
    }

    PopActivity.prototype.hide = function () {
        this.popupwindow.dismiss();
    }

    PopActivity.prototype.setTitle = function (title) {
        this.contentView.findViewWithTag('pop_toolbar').setTitle(title);
    }

    PopActivity.prototype.findView = function (tag) {
        return this.view.findViewWithTag(tag);
    }

    PopActivity.prototype.setEvent = function (tag, eventType, eventAction) {
        ui.setEvent(this.view.findViewWithTag(tag), eventType, eventAction);
    }

    function initContentView(mGlobal) {
        //LinearLayout
        let mainView = new LinearLayout(context); //context 为当前activate的context
        //-1代表LayoutParams.MATCH_PARENT，即该布局的尺寸将填满它的父控件；-2代表LayoutParams.WRAP_CONTENT
        mainView.setLayoutParams(new LinearLayout.LayoutParams(-1, -1));
        mainView.setBackgroundColor(Color.parseColor('#EBEBEB'));
        mainView.setOrientation(1);
        //Toolbar
        let toolbar = new Toolbar(context);
        //-1代表LayoutParams.MATCH_PARENT，即该布局的尺寸将填满它的父控件；-2代表LayoutParams.WRAP_CONTENT
        toolbar.setLayoutParams(Toolbar.LayoutParams(-1, -2));
        toolbar.setTag('pop_toolbar');
        toolbar.setPadding(0, statusBarHeight, 0, 0);
        toolbar.setBackgroundColor(Color.parseColor('#1095DA'));
        //设置返回的箭头
        toolbar.setNavigationIcon(getResourceID('abc_ic_ab_back_material'));//ic_back
        toolbar.setNavigationOnClickListener({
            onClick: function () {
                mGlobal.popupwindow.dismiss();
            }
        });
        mainView.addView(toolbar);
        mainView.addView(mGlobal.view);
        return mainView;
    }

    function initPopupWindow(view) {
        let pw = new PopupWindow(view, -1, -1);
        fitPopupWindowOverStatusBar(pw);
        pw.setOutsideTouchable(true);
        pw.setFocusable(true);
        pw.setTouchable(true);
        //显示动画
        let showSlide = new Slide(Gravity.BOTTOM);
        showSlide.setDuration(200);
        pw.setEnterTransition(showSlide);
        //隐藏动画
        let hideSlide = new Slide(Gravity.BOTTOM);
        hideSlide.setDuration(200);
        hideSlide.setMode(Visibility.MODE_OUT);
        pw.setExitTransition(hideSlide);
        return pw;
    }

    /**
     * 获取内置资源ID
     * @param name {String} 资源名称
     * @param type {String} 资源类型
     * @returns {Int} 资源ID
     */
    function getResourceID(name, type) {
        return resources.getIdentifier(name, type = type || 'drawable', 'com.gibb.easyclick');
    }

    /**
     * 反射修改 PopupWindow 全屏显示
     * @param mPopupWindow {PopupWindow}
     */

    function fitPopupWindowOverStatusBar(mPopupWindow) {
        //沉浸式状态栏显示PopupWindow全屏效果 以下是固定写法
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) { //判断sdk版本号?
            try {
                let mLayoutInScreen = (new PopupWindow(activity)).class.getDeclaredField("mLayoutInScreen");
                mLayoutInScreen.setAccessible(true);
                mLayoutInScreen.set(mPopupWindow, true);
            } catch (e) {
            }
        }
    }

    return PopActivity;
})();