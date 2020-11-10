/*
 * @Author: 大柒
 * @QQ: 531310591@qq.com
 * @Date: 2020-07-31 04:45:27
 * @Version: EasyClick 5.0.0.RC12
 * @Description:
 * @LastEditors: 大柒
 * @LastEditTime: 2020-07-31 04:45:36
 */

importClass(android.os.Build);
importClass(android.view.Gravity);
importClass(android.view.WindowManager);
importClass(android.graphics.PixelFormat);

/**
 * 悬浮窗工具类
 * @param contentView
 * @constructor
 */
function FloatUtil(contentView) {
    let mWindowManager = context.getSystemService(context.WINDOW_SERVICE); //用于创建系统窗口,独立于app纯在(委)
    let mHandler = ui.getHandler();
    let layoutParams = new WindowManager.LayoutParams();
    if (Build.VERSION.SDK_INT >= 26) {  // 悬浮窗设置的方式
        layoutParams.type = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;  //该Type描述的是形成的窗口的层级关系
    } else {
        layoutParams.type = WindowManager.LayoutParams.TYPE_PHONE; //层级较低的TYPE_PHONE悬浮窗
    }
    layoutParams.x = 0;
    layoutParams.y = 0;
    layoutParams.width = -2; //包裹内容
    layoutParams.height = -2;
    //该flags描述的是窗口的模式，是否可以触摸，可以聚焦等
    layoutParams.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL | WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS;
    layoutParams.gravity = Gravity.LEFT | Gravity.TOP;  //设置窗口的位置
    layoutParams.format = PixelFormat.RGBA_8888; //不设置这个弹出框的透明遮罩显示为黑色

    MainPost(() => mWindowManager.addView(contentView, layoutParams));  //显示窗口

    this.contentView = contentView; //这个就是我们要显示的内容

    this.getX = function () {
        return layoutParams.x;
    }

    this.getY = function () {
        return layoutParams.y;
    }

    this.getWidth = function () {
        return layoutParams.width;
    }

    this.getHeight = function () {
        return layoutParams.height;
    }

    this.getScreenWidth = function () {
        return mWindowManager.getDefaultDisplay().getWidth();
    }

    this.getScreenHeight = function () {
        return mWindowManager.getDefaultDisplay().getHeight();
    }

    this.setSize = function (width, height) {
        layoutParams.width = width;
        layoutParams.height = height;
        updateViewLayout();
    }

    this.setPosition = function (x, y) {
        layoutParams.x = x;
        layoutParams.y = y;
        updateViewLayout();
    }

    this.setTouchable = function (touchable) {
        if (touchable) {
            layoutParams.flags &= ~WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
        } else {
            layoutParams.flags |= WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
        }
        updateViewLayout();
    }

    this.close = function () {
        MainPost(() => mWindowManager.removeView(contentView)); //移除按钮
    }

    function MainPost(action) {
        mHandler.post({run: action});
    }

    function updateViewLayout() {
        MainPost(() => mWindowManager.updateViewLayout(contentView, layoutParams));//刷新
    }
}